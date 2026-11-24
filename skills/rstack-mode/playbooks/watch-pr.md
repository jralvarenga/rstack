# Watching a pull request until it's ready

Use when I ask you to watch, babysit, or get a pull request green, or after you open a PR I asked you to see through.

## Steps

1. Resolve the PR and check out its head branch. Read the description and the linked issue.
2. Load [code-guidelines](../../code-guidelines/SKILL.md), [testing](../../testing/SKILL.md), [code-review](../../code-review/SKILL.md), and the area skills for the files it changes.
3. Read the failing checks' logs. Fix the cause on the head branch, not the check, and never skip or weaken a failing test to get it green. If a failure is unrelated to the PR or flaky, rerun it once and say so, following [testing](../../testing/SKILL.md#running-tests).
4. Read every open review comment, from people and bots. Judge each one on its merits: fix the real ones, and reply with the reason on the ones you won't change. Don't resolve a person's thread for them.
5. When the base moved and the PR conflicts, update the branch the way the project does it, merge or rebase. Never force-push a branch someone else also pushes to without asking me.
6. After each round of fixes, run the formatter, checks, and tests, then commit and push. Repeat from step 3 until checks pass and no comment is left without a fix or a reply.
7. Use the harness's way to wait for checks and reviews when it has one, instead of polling in a loop.

## Done when

Checks pass, or I got the failures that aren't the PR's fault with their output. Every review comment has a fix or a reply. I got the PR link, its head commit, and what's still waiting on someone else. Nothing is merged unless I asked.
