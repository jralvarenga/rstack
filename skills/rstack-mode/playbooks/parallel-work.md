# Orchestrating parallel work across delegates

Use when a task splits into pieces that delegates can work on at the same time, or when I ask for delegates.

## Steps

1. Load [agent-orchestration](../../agent-orchestration/SKILL.md).
2. Split the task into independent pieces. Work that edits the same files stays with one delegate, and work that needs another piece's output runs after it.
3. Pick the model for each piece from the agent-orchestration routing table and check that the harness offers it. Follow its fallback rules when it doesn't.
4. Give every delegate that edits code its own branch or worktree, named after its issue, and state its base.
5. Brief each delegate following agent-orchestration, and tell it to load `rstack-mode` and `agent-orchestration` first. Use the `rstack` agent from rstack's `agents/` folder when the harness supports it.
6. Run the independent delegates in parallel and the dependent ones in sequence, passing earlier results into the next brief.
7. Check every result yourself: read the diff, the tests, and the pull request, and when the change needs tests and the report doesn't show a run, run the project's test command for it yourself. Review each pull request with the [review-pr](review-pr.md) playbook.

## Done when

Every piece has a checked result, like a pull request with its head commit and check state, or a reported failure with the error. I got one report covering all of them, and no delegate merged anything I didn't ask for.
