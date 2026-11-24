# Personal skills

Start with [skills/rstack-mode/SKILL.md](skills/rstack-mode/SKILL.md) to route a task to the skills and playbook it needs. Read [skills/code-guidelines/SKILL.md](skills/code-guidelines/SKILL.md) for every coding task and [skills/design/SKILL.md](skills/design/SKILL.md) for any design work. Use [skills/agent-file/SKILL.md](skills/agent-file/SKILL.md) when creating or updating AGENTS.md, CLAUDE.md, or DESIGN.md. Use [skills/issue-management/SKILL.md](skills/issue-management/SKILL.md) when managing issues, including creating, refining, renaming, splitting, assigning, handing off, commenting on, or triaging them. Use [skills/agent-orchestration/SKILL.md](skills/agent-orchestration/SKILL.md) at the start of every task to decide whether to do it yourself or delegate it, and which model handles it.

Use organization and project rules as the base. Apply these personal skills when they do not conflict with higher-priority instructions or mandatory language and framework requirements.

The skills are written primarily for:

- TypeScript
- React
- Next.js and TanStack Start
- React Native
- Convex
- oRPC
- Drizzle

Apply portable rules to other languages and stacks when relevant.

Run `scripts/link-skills.sh` after adding, removing, or renaming a skill.

## Versioning

Every change that lands on `main` bumps the version. Add a changeset in the same pull request, by running `bun run changeset` or by writing `.changeset/<short-name>.md` directly:

```md
---
"rstack": patch
---

One sentence on what changed, for the changelog.
```

- `patch`: fixes, wording, and docs.
- `minor`: a new skill, playbook, or feature.
- `major`: a breaking change, like renaming the plugin id or a skill.

Never edit `version` fields or `CHANGELOG.md` by hand. After the merge, the release workflow opens the `chore: version skills` pull request. That PR bumps `package.json`, `CHANGELOG.md`, and every plugin manifest through `scripts/sync-plugin-versions.ts`.
