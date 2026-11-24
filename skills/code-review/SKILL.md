---
name: code-review
description: Review a pull request in any language against project rules and my code guidelines, then report severity-ranked issues as one summary and inline comments, each with a copy-ready prompt for AI agents to verify and fix them. Use when asked to review a PR, branch, or diff.
---

Use this skill when your task is to review a PR in a codebase in any programming language, use and read [code guidelines](../code-guidelines/SKILL.md) as the base of the review but add additional rules and best practices for the review. Read [testing](../testing/SKILL.md) to judge the tests in the diff.

Review every changed file in the PR. Produce one summary comment and one inline comment per issue. Each issue gets a severity. Project rules override the base guidelines.

## Gathering Context

The pr should have attached the respective issue number and the link to that issue, use the PR number or URL from the request. If none is given, use the PR for the current branch.

The PR should have a description of the changes made, use the PR title and description to understand the changes made and compare that with the issue description and the actual changes made, if it does not match trigger a warning/error depending on the severity.

## Reviewing the code

Look for project rules in this order, a project rule overrides the base rule on the same topic, the base still applies to every topic the project does not cover.

- CLAUDE.md, AGENTS.md, README.md (repo root and the folders of changed files)
- CONTRIBUTING.md, docs/ style or architecture guides
- .cursor/rules/, .github/copilot-instructions.md
- Linter and formatter configs: biome.json, .eslintrc*, .prettierrc*, tsconfig.json, .swiftlint.yml
- Patterns already used in the codebase. If the codebase consistently does X, do not flag X as an issue.
- When you cite a rule in a comment, name its source: (project: CLAUDE.md) or (base guidelines).

Do not report issues the linter or formatter already enforces in CI.

Review every file, go through the checklist one file at a time. For each file:

- Read the diff for that file.
- Read the whole file, not only the diff. Many bugs are in how new code interacts with code around it.
- If the change touches an exported function, type, schema, or API route, search for its callers and check that they still work.
- Check whether tests were added or updated for the changed behavior, and that they follow [testing](../testing/SKILL.md): they test behavior instead of the implementation, and live where [testing](../testing/SKILL.md#where-tests-live) says.
- Check the file against each item in the checklist below.
- Mark the file as reviewed. Do not write the summary until every file on the list is marked.

Only report an issue if you are confident it is real. If you are unsure, say what you checked and what you could not confirm, or leave it out.

If the same problem appears in several places, report it once at the first place and list the other locations in that comment.

Only comment on lines in the diff. If a change breaks unchanged code, put the comment on the changed line that causes it.

Do not pad the review. Zero issues is a valid result.

## Code review checklist

- Correctness: logic errors, wrong conditions, off-by-one, missing await, unhandled promise, wrong null/undefined handling, race conditions.
- Security: missing auth or permission check, secrets in code, injection (SQL, shell, HTML), unvalidated input at a trust boundary, data from one user visible to another.
- Data: migrations that lose data or lock tables, schema changes without a backfill, breaking changes to stored formats.
- Errors: errors swallowed silently, missing error states in UI, retries without limits.
- Performance: N+1 queries, work inside loops that can move outside, unbounded lists, missing pagination, extra re-renders.
- API and contracts: breaking changes to public types, endpoints, or props without a note in the PR.
- Tests: changed behavior with no test, a bug fix with no test that reproduces the bug, tests that do not assert anything useful or only copy the implementation, mocks of the project's own modules or database, flaky or order-dependent tests, failing tests deleted, skipped, or weakened, and tests placed outside a test folder when the language does not require colocated tests. See [testing](../testing/SKILL.md).
- Maintainability: duplicated logic, dead code, unclear names, functions doing too many things.
- Guidelines: anything that breaks the project rules or base guidelines resolved in "Reviewing the code".
- Intent: the code does what the PR description says, and nothing unrelated slipped in.

## Assigning severity

| Level | Label | Use when |
|---|---|---|
| P0 | 🔴 Critical | Will break production, lose or leak data, or open a security hole. Must fix before merge. |
| P1 | 🟠 High | A real bug or a likely failure in a common case. Should fix before merge. |
| P2 | 🟡 Medium | Edge-case bug, missing test, performance problem, or a clear guideline violation. Fix soon. |
| P3 | 🔵 Low | Readability, naming, small cleanup. Optional. |

## Summary comment

Use this template for the summary comment:

````markdown
## PR Review

**Found N issues:** 🔴 X critical · 🟠 X high · 🟡 X medium · 🔵 X low

### Overview
2–4 sentences: what the PR does, whether it does what the description says, and the overall risk of merging it.

### Issues by file
| File | 🔴 | 🟠 | 🟡 | 🔵 |
|---|---|---|---|---|
| `src/a.ts` | 1 | 0 | 2 | 0 |

### Most important
1. 🔴 Short title — `path:line`
2. 🟠 Short title — `path:line`

### Guidelines used
Base guidelines, overridden by: CLAUDE.md (naming, error handling).

<details><summary>Files reviewed (N) / skipped (N)</summary>

Reviewed: ...
Skipped (generated): ...

</details>

<details>
<summary>🤖 Prompt for AI agents (all issues)</summary>

```
Check if these issues are valid. If one is, find its root cause and fix it. If one isn't, skip it and say why.

PR: #<n> (<url>), branch `<branch>`. Work on that branch, fix in issue-number order, which is severity order (P0 → P3), run the formatter, checks, and tests, and push as few commits as reasonable. Do not merge.

<file name="src/a.ts">
<issue number="1" severity="P0" location="src/a.ts:42">
Short title. What's wrong and what goes wrong in practice. Expected fix: …
</issue>
<issue number="3" severity="P2" location="src/a.ts:88" also="src/c.ts:12">
…
</issue>
</file>

<file name="src/b.ts">
<issue number="2" severity="P1" location="src/b.ts:10-14">
…
</issue>
</file>

When you're done, list each issue number with fixed, skipped and why, or blocked and why.
```

</details>
````

Include the prompt block only when N > 0. When the review found zero issues, omit it.

### Prompt for AI agents

When the review found 1 or more issues, the summary ends with a copy-ready prompt that a coding agent can take to verify and fix every issue in one pass, the way cubic does it. Put it in a collapsible `<details><summary>🤖 Prompt for AI agents (all issues)</summary>` wrapping a fenced code block, so the whole prompt copies in one click and renders as plain text.

- List every issue in the review, not only "Most important", including the ones moved to "Other notes". Number them across the whole review in severity order (P0 → P3), then group them by file in `<file>` blocks, files ordered by their most severe issue. The numbers inside a file can skip, and the agent fixes by number, so a file's P2 never goes before another file's P1.
- For each issue give its severity, a short title, the `path:line` or `path:start-end`, other locations when the same problem repeats, what's wrong, and the expected fix or the content of the suggestion block.
- Write each issue so it stands alone. The agent reading it has the repository but not this review, so name the function, the variable, or the value it's about instead of saying "this" or "here".
- Open with the instruction to check whether each issue is valid before fixing it. A review comment is a claim, and the agent should skip a wrong one and say why instead of forcing a fix.
- Give the PR number and URL and the branch name. Tell it to fix in issue-number order, run the project's formatter, checks, and tests, push as few commits as reasonable, never merge, and finish with a status per issue number.
- When the target has no PR, like a branch or a local diff, keep the prompt and replace the PR line with the branch or the base and head it should apply to.

When you delegate the review or the fixes to another agent, pick its model and write its brief following [agent-orchestration](../agent-orchestration/SKILL.md). The prompt above is the core of a fix delegate's brief only. A review delegate gets a read-only brief: it reports findings and never edits, commits, or pushes.

When the review found zero issues, omit this section. Do not include an empty prompt.

## Inline comments

Write one inline comment per issue:

````markdown
**🟠 P1 · Missing await on save()**

`save()` returns a promise, but it is not awaited. The handler returns 200 before the write finishes, and write errors are lost.

```suggestion
await repo.save(order);
```

<sub>Rule: base guidelines › Async</sub>

<details>
<summary>🤖 Prompt for AI agents</summary>

```
Check if this issue is valid. If it is, find its root cause and fix it. If it isn't, say why.

PR #<n>, branch `<branch>`, at src/orders/create-order.ts, line 42:

<issue severity="P1">
`save()` returns a promise that `createOrder` doesn't await, so the handler returns 200 before the write finishes and write errors are lost. Expected fix: `await repo.save(order)`.
</issue>
```

</details>
````

- Start with the severity and a short title.
- Explain the problem and what goes wrong in practice.
- Add a suggestion block when the fix fits in the commented lines. Otherwise describe the fix in words.
- End with a collapsed `🤖 Prompt for AI agents` block for that one issue, so it can be fixed on its own. Use the same wording as its entry in the summary prompt.

## Posting the review

Show the summary (including the prompt for AI agents when N > 0) and the list of inline comments to the user first. Post only after they confirm. The prompts are part of the summary body and of each inline comment, never separate comments. When the review isn't posted, like for a branch or a local diff, still give the user the full prompt in the reply.

Build the payload in a file, then post it as one review:

```json
{
  "event": "COMMENT",
  "body": "<summary comment markdown>",
  "comments": [
    { "path": "src/a.ts", "line": 42, "side": "RIGHT", "body": "<inline comment>" },
    { "path": "src/b.ts", "start_line": 10, "start_side": "RIGHT", "line": 14, "side": "RIGHT", "body": "<multi-line comment>" }
  ]
}
```

```bash
gh api repos/{owner}/{repo}/pulls/<n>/reviews --method POST --input review.json
```

Use `"event": "REQUEST_CHANGES"` only if the user asks for it, or if there is a P0 and the user agrees.

If the API rejects a comment because its line is not in the diff, move the comment into the summary under "Other notes" with its `path:line`, keep it in the summary prompt, and post again.
