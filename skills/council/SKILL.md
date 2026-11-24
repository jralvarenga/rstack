---
name: council
description: Rules on how the agent runs a council, a review or feedback round by three delegates from three different providers at high reasoning effort, including preparing the work, briefing members, scoring, summarizing, running fresh rounds until every member is satisfied, and recording scores in the PR. Use when I say "council", or ask for a multi-provider review or second opinions on a plan, change, or PR.
---

These are my rules on how to run a council. The goal is that one model's blind spots never go unchallenged before work is merged: three strong models from three different providers review the same work, disagree in the open, and the work keeps improving until all of them are satisfied. Use organization and project rules as the base and apply these rules as long as they do not conflict with them.

When I say "council", run this flow on the work in front of us, a PR, a branch, a plan, or a design. Pick the model, brief, and tools for every member following [agent-orchestration](../agent-orchestration/SKILL.md).

## Before calling the council

The council reviews finished work, not work you already know is broken. Before the first round, fix the issues you already know about.

For a PR or branch, also:

- Address every open comment on the PR, fix it or reply with why not.
- Fix failing CI.
- Run the project's checks, like the formatter, linter, type checker, tests, and build, and make them pass.
- Commit and push, so every member reviews the same head commit.

For a plan or design, there are no checks, commit, or push. Instead:

- Write the current version to a file and give every member its path, so every member reviews the same version.
- Don't edit it while a round runs.

If something can't be fixed first, say what it is and put it in every brief, so members don't spend the round reporting it.

## Members

- When I name the members, use exactly those, as long as they are three members from three different providers. When they aren't, tell me what's wrong with the panel and wait for a valid one.
- Otherwise use the members from the "Council" row of the routing table in [agent-orchestration](../agent-orchestration/SKILL.md#routing-table). Don't pick models yourself and don't keep your own list.
- A council has three members, one per provider, each at high reasoning effort. Two members from the same provider is not a council.
- You are the chair, not a member. You brief, collect, summarize, and fix, but your opinion never counts as a member's.

## Missing members

Before the first round, check that the harness can reach every member.

- When a default member isn't available, use the council fallback from the routing table in [agent-orchestration](../agent-orchestration/SKILL.md#routing-table), and tell me which member it replaced. The council still needs three different providers.
- When more members are missing than the fallback covers, or a member I named isn't available, tell me which ones are missing, then wait for my answer.
- Never pick a replacement outside the routing table, never run with fewer members without my OK, and never report a council that didn't happen.

## Briefing the council

Write one brief and send it to every member, following the briefing rules in [agent-orchestration](../agent-orchestration/SKILL.md#briefing-a-delegate). It also says:

- What to review: the PR URL, branch, and head commit, or the path to the plan or design.
- The standard: for code reviews, review against [code-review](../code-review/SKILL.md) and the project rules it resolves. For plans and designs, review against the issue and the skills that cover that area.
- That the member is read-only: no edits, commits, pushes, PR comments, or reviews. It reports back to you only.
- The report shape: a score out of 10, every finding with its severity and `path:line` when there is one, and what it couldn't verify.
- From the second round on, what changed since the last round and which findings were declined and why.

Run all three members in parallel in the current checkout.

## Scores

- Every member scores the work out of 10 in every round. 10 means it would merge or ship as is.
- Record each score exactly as the member gave it. If a member doesn't give one, ask it once. If it still doesn't, record it as missing. Never invent, estimate, or average a missing score.
- A member is satisfied when it reports no remaining findings it would block on. A high score with open blocking findings is not satisfied.

## Summary

After each round, tell me:

- **Findings:** merged across members and ranked by severity, with which members raised each one. A finding raised by more than one member is stronger.
- **Disagreements:** where members contradict each other, what each said, and what you recommend.
- **Next steps:** what you will fix, what you will decline and why, and what needs my decision.
- **Scores:** each member's score for the round.

## Rounds

- Apply the fixes the council agrees on, and the ones a single member raised when they are real bugs. For a PR or branch, run the checks again, then commit and push. For a plan or design, update the file.
- Run a fresh round with the same members, and say in the brief what changed. Don't continue the earlier round's conversation, each round starts clean.
- Keep going until every member is satisfied.
- Keep the scope of the original work. A finding that asks for new features, unrelated refactors, or work outside the issue goes to next steps as a follow-up, not into this change. When a member keeps blocking on something out of scope or that I already decided, stop and ask me instead of running another round.
- When members disagree and the fix isn't clear, ask me. Never settle a disagreement by quietly dropping a member's finding.

## Council review table

When the council reviews a PR, put a "Council review" section in the PR description, not in a comment. Update it after every round: one row per member, one column per round. Use the members' names, write missing scores as `—`, and add a note under the table for anything missing or still open.

```markdown
## Council review

| Member | Round 1 | Round 2 | Round 3 |
| --- | --- | --- | --- |
| Member A | 6/10 | 8/10 | 9/10 |
| Member B | 5/10 | 8/10 | 10/10 |
| Member C | 7/10 | — | 9/10 |

Member C gave no score in round 2.
```
