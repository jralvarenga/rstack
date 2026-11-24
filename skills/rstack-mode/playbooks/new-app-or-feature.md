# Starting a new app or feature

Use when I ask to start a new app, package, or service, or a feature big enough to need a plan before code.

## Steps

1. Get clear on who the app or feature is for and what it must do. Ask one focused question only when the answer changes the plan.
2. Load [app-architecture](../../app-architecture/SKILL.md) to decide the repository layout, branches, environments, deployment targets, and auth. For a feature in an existing app, follow the decisions the project already made.
3. When it has a server side, load [backend](../../backend/SKILL.md) to plan the API, the database, and the jobs it needs.
4. When it has a user-facing interface, load [frontend](../../frontend/SKILL.md) to plan the pages, components, routing, and data fetching.
5. When it has a user-facing interface or output, load [design](../../design/SKILL.md) to set the visual direction before building any UI.
6. Load [testing](../../testing/SKILL.md) and name the tests that prove each piece: the runner and commands for a new app, and the unit, integration, or end-to-end tests each piece needs, at the lowest level that proves it.
7. Write the plan with one item per deliverable piece, each with its tests. Save it to a file only when I ask for one. If I asked only for a plan, give it to me and stop here.
8. When I ask you to build or update the agent files, load [agent-file](../../agent-file/SKILL.md) to record the decisions in `AGENTS.md` and the visual ones in `DESIGN.md` when the project has something to design. Keep `CLAUDE.md` as the `@AGENTS.md` import.
9. When I ask you to file issues, use the [file-issue](file-issue.md) playbook, one issue per deliverable piece.
10. When I ask you to build, use the [implement-issue](implement-issue.md) playbook for tracked pieces or the [parallel-work](parallel-work.md) playbook for delegates. For untracked work, load [code-guidelines](../../code-guidelines/SKILL.md), build on its own branch with the relevant skills, then open a pull request and review it with [code-review](../../code-review/SKILL.md).

## Done when

The plan lists every deliverable piece with its tests and covers architecture and the backend, frontend, and design work it needs. When I asked for issues, I have their links. When I asked for agent file updates or a build, the agent files record the decisions. When I asked to build, every piece is in an open pull request.
