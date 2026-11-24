# Implementing an issue end to end

Use when I ask to implement, fix, or build what an issue describes.

## Steps

1. Read the issue, its comments, and the issues it links. Treat decisions in the comments as final.
2. Read the project's `AGENTS.md`, `CLAUDE.md`, and `DESIGN.md`.
3. Create a branch named after the issue, for example `49-rstack-mode`, from `main` or from the base the issue or I name. See [app-architecture](../../app-architecture/SKILL.md#branching).
4. Load [code-guidelines](../../code-guidelines/SKILL.md) and the area skills from the routing table in [rstack-mode](../SKILL.md#routing), then plan the change.
5. Implement it. Add or update tests for the changed behavior, then run the project's formatter, checks, and tests. When the change makes the agent files stale, update them with [agent-file](../../agent-file/SKILL.md).
6. Follow the project's release process, for example adding a changeset.
7. Commit, push, and open a pull request that references the issue with a closing keyword. Move the issue to In Review following [issue-management](../../issue-management/SKILL.md#managing-existing-issues).
8. Review your own pull request with [code-review](../../code-review/SKILL.md) and fix every P0 and P1 before handing it over. Use council instead when I ask for it.

## Done when

The pull request is open against the right base, closes the issue, and its checks pass or their failures are reported with the output. Code review left no open P0 or P1, and I got the PR link, its head commit, and what wasn't verified. Nothing is merged unless I asked.
