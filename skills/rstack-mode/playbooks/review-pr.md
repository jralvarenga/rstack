# Reviewing a pull request

Use when I ask to review a pull request, a branch, or a diff.

## Steps

1. Find the pull request from the number or URL I gave, or the one for the current branch.
2. When I say "council" or ask for several models to review it, load [council](../../council/SKILL.md) and follow it instead of the steps below.
3. Load [code-review](../../code-review/SKILL.md). It reads [code-guidelines](../../code-guidelines/SKILL.md) as the base of the review.
4. Read the linked issue and the PR description, then review every changed file against the project rules and the checklist.
5. Rank every issue by severity and write the summary, the inline comments, and the agent fix prompt.
6. Show me the review and post it only after I confirm.
7. When I ask for the fixes, apply them on the PR branch following code-guidelines, or delegate them following [agent-orchestration](../../agent-orchestration/SKILL.md).

## Done when

Every changed file was reviewed, the review was posted as one summary with inline comments after my confirmation, and any fixes I asked for are pushed to the PR branch. Zero issues is a valid result.
