# Reviewing a pull request

Use when I ask to review a pull request, a branch, or a diff.

## Steps

1. Resolve the PR number or URL, branch, or diff I gave. Use the current branch's PR only when I give no target, and review the current branch diff if it has no PR. For a branch or diff, check for a PR that matches the selected target.
2. Load [council](../../council/SKILL.md) only when I ask for a council, then follow it. For reviewers I name, use [agent-orchestration](../../agent-orchestration/SKILL.md) to brief those reviewers on the selected target and combine their findings in the steps below. Never start or offer a council on your own.
3. Load [code-review](../../code-review/SKILL.md). It reads [code-guidelines](../../code-guidelines/SKILL.md) as the base of the review and [testing](../../testing/SKILL.md) to judge the tests.
4. Read the PR description and any linked issue only when the selected target has a PR. Review every changed file in the selected target against the project rules and the checklist.
5. Score every issue's severity and confidence, keep the ones at confidence 7 or higher, and write the summary body and the inline comments in the cubic format from [code-review](../../code-review/SKILL.md#review-output), each with its prompt for AI agents.
6. Show me the summary body and the inline comments. Post them as one review only when the selected target has a PR and I confirm. When there's no PR, the summary body with its prompt is the report.
7. When I ask for a recheck after fixes, update the posted review as [code-review](../../code-review/SKILL.md#after-fixes-land) describes.
8. When I ask for fixes, apply them on the selected PR's head branch or the branch for the selected diff, following code-guidelines. If the diff has no known branch, confirm where the fixes belong. Follow [agent-orchestration](../../agent-orchestration/SKILL.md) if you delegate the fixes. Push them when the selected target has a PR.

## Done when

Every changed file was reviewed, the review was posted in the cubic format, one summary body with its prompt and one inline comment per issue, after my confirmation, or reported to me when there is no pull request, and any fixes I asked for are on the reviewed branch, pushed when there is a pull request. Zero issues is a valid result.
