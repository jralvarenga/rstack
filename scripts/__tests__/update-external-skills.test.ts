import { describe, expect, test } from 'bun:test';
import { diffSkillHistory, renderPullRequestBody, type ExternalSkill } from '../update-external-skills';

const reviewed = {
  sha: "a".repeat(40),
  commit: { message: "Reviewed skill" },
};
const previous = {
  sha: "b".repeat(40),
  commit: { message: "Refine guidance" },
};
const latest = {
  sha: "c".repeat(40),
  commit: { message: "Revise `examples`\n\nCommit description" },
};
const older = {
  sha: "d".repeat(40),
  commit: { message: "Add skill" },
};
const skill: ExternalSkill = {
  name: "example-skill",
  repo: "example/skills",
  path: "skills/example-skill",
  ref: reviewed.sha,
  url: "https://github.com/example/skills/tree/main/skills/example-skill",
  owner: "Example",
  license: "MIT",
  usedBy: ["design"],
};

describe("diffSkillHistory", () => {
  test("returns no update when the reviewed pin is current", () => {
    expect(diffSkillHistory(skill, [reviewed, older])).toBeNull();
  });

  test("includes only commits newer than the reviewed pin", () => {
    expect(diffSkillHistory(skill, [latest, previous, reviewed, older])).toEqual({
      skill,
      ref: latest.sha,
      commits: [latest, previous],
    });
  });

  test("reports a pin that is absent from the fetched history", () => {
    expect(() => diffSkillHistory(skill, [latest, previous])).toThrow("is missing from the upstream history");
  });
});

test("renders a comparison and commit subjects for each changed skill", () => {
  const body = renderPullRequestBody([
    { skill, ref: latest.sha, commits: [latest, previous] },
    {
      skill: { ...skill, name: "another-skill", path: "skills/another-skill", ref: older.sha },
      ref: previous.sha,
      commits: [previous],
    },
  ]);

  expect(body).toContain("## example-skill\n");
  expect(body).toContain("## another-skill\n");
  expect(body).toContain(`https://github.com/example/skills/compare/${reviewed.sha}...${latest.sha}`);
  expect(body).toContain(`https://github.com/example/skills/compare/${older.sha}...${previous.sha}`);
  expect(body).toContain(`https://github.com/example/skills/commit/${latest.sha}`);
  expect(body).toContain("`` Revise `examples` ``");
  expect(body).not.toContain("Commit description");
});
