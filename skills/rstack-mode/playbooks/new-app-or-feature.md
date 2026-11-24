# Starting a new app or feature

Use when I ask to start a new app, package, or service, or a feature big enough to need a plan before code.

## Steps

1. Get clear on who the app or feature is for and what it must do. Ask one focused question only when the answer changes the plan.
2. Load [app-architecture](../../app-architecture/SKILL.md) to decide the repository layout, branches, environments, deployment targets, and auth. For a feature in an existing app, follow the decisions the project already made.
3. When it has a server side, load [backend](../../backend/SKILL.md) to plan the API, the database, and the jobs it needs.
4. When it has a user-facing interface, load [frontend](../../frontend/SKILL.md) to plan the pages, components, routing, and data fetching.
5. When it has a user-facing interface or output, load [design](../../design/SKILL.md) to set the visual direction before building any UI.
6. Load [agent-file](../../agent-file/SKILL.md) to record the decisions in `AGENTS.md`, and the visual ones in `DESIGN.md` when the project has something to design. Keep `CLAUDE.md` as the `@AGENTS.md` import.
7. When the work needs tracking, file it with the [file-issue](file-issue.md) playbook, one issue per deliverable piece.
8. Build each tracked piece with the [implement-issue](implement-issue.md) playbook, or split the pieces across delegates with the [parallel-work](parallel-work.md) playbook. Build untracked work on its own branch with the skills loaded above, then open a pull request and review it with code-review.

## Done when

The plan covers architecture and each of backend, frontend, and design that the work needs, the agent files record the decisions, and every piece of the work is either in an open pull request or filed as an issue.
