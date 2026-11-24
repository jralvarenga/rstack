---
name: code-review
description: Review a pull request in any language against project rules and my code guidelines, then post the issues the way cubic does: one review with an issue count and a prompt for AI agents covering every issue, and one inline comment per issue with its own prompt. Use when asked to review a PR, branch, or diff.
---

Use this skill when your task is to review a PR in a codebase in any programming language, use and read [code guidelines](../code-guidelines/SKILL.md) as the base of the review but add additional rules and best practices for the review. Read [testing](../testing/SKILL.md) to judge the tests in the diff.

Review every changed file in the PR. Produce one review with a summary body and one inline comment per issue, in the format of [Review output](#review-output). Each issue gets a severity and a confidence. Project rules override the base guidelines.

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

## Review output

The review posts in the same shape cubic uses: one `COMMENT` review whose body is a short count and a prompt for AI agents covering every unresolved issue, with one inline comment per issue attached to it. Each inline comment carries its own prompt. Keep the wording, tags, and whitespace of the templates below exactly, and fill in only the `{placeholders}`. Use the `rstack` markers, never cubic's markers, links, or branding.

Before posting anything, give me the overview in the reply instead of the review body: what the PR does, whether it matches its description and issue, the merge risk, the files reviewed and skipped, and the rules used.

### Confidence

Score every issue from 1 to 10 for how sure you are that it's real, after reading the whole file and the callers. Report only issues scored 7 or higher. Record the score in the inline comment's metadata, never in the summary.

### Summary body

````markdown
<!-- rstack:review-summary:start -->
**{N} issues found** across {F} files
<!-- rstack:review-summary:end -->

<details>
<summary>Prompt for AI agents (unresolved issues)</summary>

```text

Check if these issues are valid — if so, understand the root cause of each and fix them. When an issue isn't valid or won't be fixed in this PR, reply in its thread with the reason and then resolve the thread. If appropriate, use sub-agents to investigate and fix each issue separately.


<file name="{path}">

<violation number="1" location="{path}:{line}">
{P#}: {issue text}</violation>

<violation number="2" location="{path}:{line}">
{P#}: {issue text}</violation>
</file>

<file name="{path2}">

<violation number="1" location="{path2}:{line}">
{P#}: {issue text}</violation>
</file>
```

</details>

<!-- rstack:review-post:{full head sha} -->
````

- `{N}` counts the inline comments, and `{F}` counts the files reviewed. Write `**1 issue found**` for one issue. With zero issues, the body is `**No issues found** across {F} files` between the markers, with no `<details>` block.
- The prompt lists every issue in the review, one `<violation>` per inline comment, with the same text the comment has. Number violations per file starting at 1 and sort them by line inside the file.
- Keep the exact whitespace: one blank line after the opening fence, two after the instruction, one after each `<file name>` line and between violations. `</violation>` closes on the text's line, and `</file>` follows the last violation with no blank line.
- There is no PR, branch, or commit header in the prompt. The agent runs it on the branch it already has.
- When the target has no PR, like a branch or a local diff, give me the same summary body in the reply.

### Inline comments

Write one inline comment per issue on the changed line it's about:

````markdown
<!-- rstack:review-run={head sha} -->
<!-- metadata:{"confidence":{7-10}} -->
{P#}: {The problem and what goes wrong in practice. The concrete fix.}

<details>
<summary>Prompt for AI agents</summary>

```text
Check if this issue is valid — if so, understand the root cause and fix it. When an issue isn't valid or won't be fixed in this PR, reply in its thread with the reason and then resolve the thread. At {path}, line {line}:

<comment>{the same text without the P# prefix}</comment>

<file context>
{the @@ header line of the diff hunk the line sits in, verbatim}
{up to 3 diff lines before the line, the line, and up to 2 after, with their +, -, or space prefixes}
</file context>
```

</details>

```suggestion
{replacement for the commented line or lines}
```
````

For example:

````markdown
<!-- rstack:review-run=0a1b2c3 -->
<!-- metadata:{"confidence":9} -->
P1: `createOrder` calls `repo.save(order)` without awaiting it, so the handler returns 200 before the write finishes and write errors are lost. Await the save before responding.

<details>
<summary>Prompt for AI agents</summary>

```text
Check if this issue is valid — if so, understand the root cause and fix it. When an issue isn't valid or won't be fixed in this PR, reply in its thread with the reason and then resolve the thread. At src/orders/create-order.ts, line 42:

<comment>`createOrder` calls `repo.save(order)` without awaiting it, so the handler returns 200 before the write finishes and write errors are lost. Await the save before responding.</comment>

<file context>
@@ -38,6 +38,9 @@ export async function createOrder(input: CreateOrderInput) {
   const order = buildOrder(input);
+  validateStock(order);
+  repo.save(order);
+  return { status: 200, order };
 }
</file context>
```

</details>

```suggestion
  await repo.save(order);
```
````

- The issue text is two sentences: the problem with its consequence, then the concrete fix. Name the function, variable, or value, so the text stands alone without the review.
- The severity prefix is `P0:` to `P3:` from [Assigning severity](#assigning-severity), with no emoji or label.
- Add the suggestion block after `</details>` when the fix fits in the commented lines. Otherwise leave it out and describe the fix in the text.
- When the same problem repeats, comment once at the first place and name the other locations in the text.
- Comment on a single line on the `RIGHT` side. Use a line range only when the problem spans the lines.

### Prompt for AI agents

The prompts let an agent pick up the review without reading it: the summary prompt fixes everything in one pass, and each inline prompt fixes one issue. Both start by telling the agent to check that each issue is valid, because a review comment is a claim. Use the exact instruction sentences from the templates, plural in the summary and singular inline.

When you delegate the review or the fixes to another agent, pick its model and write its brief following [agent-orchestration](../agent-orchestration/SKILL.md). The summary prompt is the core of a fix delegate's brief only. A review delegate gets a read-only brief: it reports findings and never edits, commits, or pushes.

### PR description summary

When the PR is mine, or I confirm it for someone else's PR, append this section to the PR description after a blank line, or replace it when it's already there. Leave the rest of the description as it is:

```markdown
<!-- This is an auto-generated description by rstack. -->
---
## Summary by rstack
{One paragraph: what the PR does and why, with `code` names.}

- {One bullet per area of change, about behavior.}

<sup>Written for commit {full head sha}. Summary will update on new commits.</sup>

<!-- End of auto-generated description by rstack. -->
```

## Posting the review

Show me the overview, the summary body, and the inline comments first. Post only after I confirm. Post the summary and every inline comment as one review. The prompts are part of the summary body and of each inline comment, never separate comments.

Build the payload in a file, then post it:

```json
{
  "commit_id": "{full head sha}",
  "event": "COMMENT",
  "body": "{summary body}",
  "comments": [
    { "path": "src/a.ts", "line": 42, "side": "RIGHT", "body": "{inline comment}" },
    { "path": "src/b.ts", "start_line": 10, "start_side": "RIGHT", "line": 14, "side": "RIGHT", "body": "{inline comment spanning lines}" }
  ]
}
```

```bash
gh api repos/{owner}/{repo}/pulls/{n}/reviews --method POST --input review.json
```

Always post with `"event": "COMMENT"`. Use `REQUEST_CHANGES` only when I ask for it.

If the API rejects a comment because its line isn't in the diff, move it to the nearest changed line that causes the problem. When there's none, keep it only as a violation in the summary prompt and say so in the reply.

## After fixes land

When I ask you to recheck a review you posted, or to re-review after new commits:

- For each issue fixed by a new commit, edit its inline comment to append `\n\n✅ Addressed in [`{sha7}`]({commit url})` and leave the rest of the comment as it is.
- Rewrite the summary body: lower the count, and drop the violations that were fixed or whose threads were resolved. When none are left, the body becomes `**All reported issues were addressed** across {F} files` between the markers, with no `<details>` block. Update the commit in the `review-post` marker.
- Don't reply in the threads or resolve them for the author. Don't comment again on issues that were fixed or resolved as won't fix.
- A re-review covers the whole PR at its new head. Post new issues as a new review in the same format.

```bash
gh api repos/{owner}/{repo}/pulls/comments/{comment id} --method PATCH -f body="{edited inline comment}"
gh api repos/{owner}/{repo}/pulls/{n}/reviews/{review id} --method PUT -f body="{rewritten summary body}"
```
