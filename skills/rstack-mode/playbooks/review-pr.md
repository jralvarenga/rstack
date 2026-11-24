# Reviewing a pull request

Use when I ask to review a pull request, a branch, or a diff.

## Steps

1. Resolve the PR number or URL, branch, or diff I gave. Use the current branch's PR only when I give no target, and review the current branch diff if it has no PR. For a branch or diff, check for a PR that matches the selected target.
2. When I say "council" or ask for a multi-provider panel without naming its members, load [council](../../council/SKILL.md) and follow it. For any other named-reviewer setup, use [agent-orchestration](../../agent-orchestration/SKILL.md) to brief those reviewers on the selected target and combine their findings in the steps below.
3. Load [code-review](../../code-review/SKILL.md). It reads [code-guidelines](../../code-guidelines/SKILL.md) as the base of the review.
4. Read the PR description and any linked issue only when the selected target has a PR. Review every changed file in the selected target against the project rules and the checklist.
5. Rank every issue by severity and write the summary and the inline comments. Add the agent fix prompt only when the review found issues.
6. Show me the review. Post it only when the selected target has a PR and I confirm.
7. When I ask for fixes, apply them on the selected PR's head branch or the branch for the selected diff, following code-guidelines. If the diff has no known branch, confirm where the fixes belong. Follow [agent-orchestration](../../agent-orchestration/SKILL.md) if you delegate the fixes. Push them when the selected target has a PR.

## Done when

Every changed file was reviewed, the review was posted as one summary with inline comments after my confirmation, or reported to me when there is no pull request, and any fixes I asked for are on the reviewed branch, pushed when there is a pull request. Zero issues is a valid result.
