import { createHash } from 'node:crypto';
import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

export type ExternalSkill = {
  name: string;
  repo: string;
  path: string;
  ref: string;
  url: string;
  owner: string;
  license?: string;
  usedBy: string[];
};

type GitHubCommit = {
  sha: string;
  commit: { message: string };
};

type GitHubEnvironment = {
  GITHUB_TOKEN?: string;
};

type CommitPage = {
  commits: GitHubCommit[];
  hasNextPage: boolean;
};

type SkillUpdate = {
  skill: ExternalSkill;
  ref: string;
  commits: GitHubCommit[];
};

const fullSha = /^[a-f0-9]{40}$/;
const repoSlug = /^[\w.-]+\/[\w.-]+$/;

/** Returns changes in the path history up to, but excluding, the reviewed pin. */
export function diffSkillHistory(skill: ExternalSkill, history: GitHubCommit[]): SkillUpdate | null {
  const pinIndex = history.findIndex(({ sha }) => sha === skill.ref);
  if (pinIndex === 0) return null;
  if (pinIndex === -1) {
    throw new Error(`Pin ${skill.ref} is missing from the upstream history for ${skill.path}`);
  }

  const commits = history.slice(0, pinIndex);
  return { skill, ref: commits[0].sha, commits };
}

/** Formats a literal Markdown code span for text supplied by upstream. */
function codeSpan(value: string): string {
  const runs = value.match(/`+/g) ?? [];
  const fence = "`".repeat(Math.max(0, ...runs.map((run) => run.length)) + 1);
  return `${fence} ${value} ${fence}`;
}

/** Renders the pin changes and links to the upstream comparison and each commit. */
export function renderPullRequestBody(updates: SkillUpdate[]): string {
  const lines = ["Updates the reviewed pins in `external-skills.json`."];

  for (const { skill, ref, commits } of updates) {
    const repoUrl = `https://github.com/${skill.repo}`;
    lines.push(
      "",
      `## ${skill.name}`,
      "",
      `- Pin \`${skill.ref}\` → \`${ref}\``,
      `- Used by ${skill.usedBy.map(codeSpan).join(", ") || "no listed skills"}`,
      `- [Compare upstream commits](${repoUrl}/compare/${skill.ref}...${ref})`,
      "",
      `Commits touching ${codeSpan(skill.path)}`,
      "",
    );

    for (const { sha, commit } of commits) {
      const subject = commit.message.split(/[\r\n]/, 1)[0].trim() || "(no subject)";
      lines.push(`- [\`${sha.slice(0, 7)}\`](${repoUrl}/commit/${sha}) ${codeSpan(subject)}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

/** Requests one page of commits scoped to the skill directory. */
async function fetchCommits(
  skill: ExternalSkill,
  query: Record<string, string>,
  { GITHUB_TOKEN }: GitHubEnvironment,
): Promise<CommitPage> {
  const url = new URL(`https://api.github.com/repos/${skill.repo}/commits`);
  url.search = new URLSearchParams({ path: skill.path, ...query }).toString();
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status} for ${url}`);

  const commits = (await response.json()) as GitHubCommit[];
  if (!Array.isArray(commits) || commits.some(({ sha, commit }) => (
    !fullSha.test(sha) || typeof commit?.message !== "string"
  ))) {
    throw new Error(`GitHub returned an invalid commit list for ${url}`);
  }

  const hasNextPage = response.headers.get("link")?.includes('rel="next"') ?? false;
  return { commits, hasNextPage };
}

/** Checks the default branch and walks the path history from a fixed head when it changes. */
async function checkSkill(skill: ExternalSkill, env: GitHubEnvironment): Promise<SkillUpdate | null> {
  if (!repoSlug.test(skill.repo) || !skill.path || !fullSha.test(skill.ref)) {
    throw new Error("Expected an owner/repo, skill path, and full commit SHA");
  }

  const { commits: [latest] } = await fetchCommits(skill, { per_page: "1" }, env);
  if (!latest) throw new Error(`No upstream commits found for ${skill.path}`);
  if (latest.sha === skill.ref) return null;

  const history: GitHubCommit[] = [];
  for (let page = 1; ; page++) {
    const { commits, hasNextPage } = await fetchCommits(
      skill,
      { sha: latest.sha, per_page: "100", page: String(page) },
      env,
    );
    history.push(...commits);
    if (commits.some(({ sha }) => sha === skill.ref) || !hasNextPage) {
      return diffSkillHistory(skill, history);
    }
  }
}

/** Writes a review body and a stable changeset for this batch, then saves the new pins. */
async function writeUpdates(
  root: string,
  skills: ExternalSkill[],
  updates: SkillUpdate[],
  body: string,
): Promise<void> {
  const names = updates.map(({ skill }) => skill.name).join(", ");
  const pins = updates.map(({ skill, ref }) => [skill.name, skill.ref, ref]);
  const id = createHash("sha256").update(JSON.stringify(pins)).digest("hex").slice(0, 12);
  const changeset = `---\n"rstack": patch\n---\n\nUpdate external skill pins for ${names}.\n`;

  await mkdir(join(root, ".cache"), { recursive: true });
  await Bun.write(join(root, ".cache/external-skills-pr.md"), body);
  await Bun.write(join(root, `.changeset/update-external-skills-${id}.md`), changeset);
  const stagedRegistry = join(root, `.cache/external-skills-${id}.json`);
  await Bun.write(stagedRegistry, `${JSON.stringify(skills, null, 2)}\n`);
  await rename(stagedRegistry, join(root, "external-skills.json"));
}

/** Checks each registry entry independently and writes files only when updates are available. */
async function main(dryRun: boolean): Promise<number> {
  const root = join(import.meta.dir, "..");
  const skills: ExternalSkill[] = await Bun.file(join(root, "external-skills.json")).json();
  const env: GitHubEnvironment = { GITHUB_TOKEN: Bun.env.GITHUB_TOKEN };
  const updates: SkillUpdate[] = [];
  let failures = 0;

  for (const [index, skill] of skills.entries()) {
    try {
      const update = await checkSkill(skill, env);
      if (update) {
        updates.push(update);
        skills[index] = { ...skill, ref: update.ref };
        console.log(`${skill.name}: update available (${skill.ref} → ${update.ref})`);
      } else {
        console.log(`${skill.name}: up to date (${skill.ref})`);
      }
    } catch (error) {
      failures++;
      console.error(`${skill.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures > 0 && failures === skills.length) return 1;
  if (updates.length === 0) return 0;

  const body = renderPullRequestBody(updates);
  if (dryRun) {
    console.log(body);
  } else {
    await writeUpdates(root, skills, updates, body);
  }
  return 0;
}

if (import.meta.main) {
  process.exitCode = await main(Bun.argv.includes("--dry-run"));
}
