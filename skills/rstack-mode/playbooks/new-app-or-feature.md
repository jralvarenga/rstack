# Starting a new app or feature

Use when I ask to start a new app, package, or service, or a feature big enough to need a plan before code.

## Steps

1. Get clear on who the app or feature is for and what it must do. Ask one focused question only when the answer changes the plan.
2. Load [app-architecture](../../app-architecture/SKILL.md) to decide the repository layout, branches, environments, deployment targets, and auth. For a feature in an existing app, follow the decisions the project already made.
3. Load [backend](../../backend/SKILL.md) to plan the API, the database, and the jobs the feature needs.
4. Load [frontend](../../frontend/SKILL.md) to plan the pages, components, routing, and data fetching.
5. Load [design](../../design/SKILL.md) to set the visual direction before building any UI.
6. Load [agent-file](../../agent-file/SKILL.md) to write or update `AGENTS.md`, `CLAUDE.md`, and `DESIGN.md` with the decisions.
7. When the work needs tracking, file it with the [file-issue](file-issue.md) playbook, one issue per deliverable piece.
8. Build each piece with the [implement-issue](implement-issue.md) playbook, or split it across delegates with the [parallel-work](parallel-work.md) playbook.

## Done when

The plan covers architecture, backend, frontend, and design, the agent files record the decisions, and every piece of the work is either in an open pull request or filed as an issue.
