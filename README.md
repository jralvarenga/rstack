# rstack

rstack is my personal stack. It is the set of rules I want every agent to follow when it writes, designs, reviews, and ships code with me, so Claude Code, Codex, Cursor, Grok Build, and any agent that supports the Agent Skills format work the same way.

It is written for the stack I use most: TypeScript, React, Next.js and TanStack Start, React Native, Convex, oRPC, and Drizzle. The portable rules apply to other languages too.

## Skills

| Skill | What it does |
| --- | --- |
| `rstack-mode` | The entry point. Routes each task to the skills it needs and holds playbooks for my common workflows. |
| `code-guidelines` | How the agent writes and formats code. |
| `design` | How the agent designs the frontend. |
| `frontend` | How the agent plans the frontend app, components, pages, and features. |
| `backend` | How the agent plans APIs, databases, validation, and infrastructure. |
| `app-architecture` | How the agent structures, sets up, and deploys apps, including repos, environments, and auth. |
| `code-review` | Reviews a pull request against project rules and my code guidelines. |
| `agent-file` | Creates and updates `AGENTS.md`, `CLAUDE.md`, and `DESIGN.md` from the codebase. |
| `issue-management` | Creates and manages issues in Linear, GitHub, or any other tracker. |
| `agent-orchestration` | Loads at the start of every task: decides what to do yourself or delegate, picks the model and provider for each part, and briefs the delegates. See [Every task](#every-task). |
| `council` | Runs review or feedback rounds on a PR, plan, or design with three models from three providers, until all of them are satisfied. |

Start with `rstack-mode`. Its playbooks in `skills/rstack-mode/playbooks/` walk through filing an issue, implementing it, reviewing a PR, starting an app or feature, and running delegates in parallel.

`agents/rstack.md` is a subagent that loads `rstack-mode` and `agent-orchestration` before it works, so delegates follow the same rules. Claude Code picks it up from `agents/`, and Cursor through `.cursor-plugin/plugin.json`.

Every skill lives in `skills/`. Don't copy them by hand; install rstack with one of the options below.

## Every task

`agent-orchestration` is meant to run at the start of every task. How it gets loaded depends on how you install rstack:

- **Claude Code plugin:** a `UserPromptSubmit` hook in `hooks/hooks.json` reminds the agent on every prompt.
- **Cursor plugin:** the always-on rule in `rules/agent-orchestration.mdc`.
- **Codex, skills.sh, and local links:** the skill is available, but the agent loads it only when the task matches its description. To make it always on, add this line to your global or project `AGENTS.md`, or run `setup-rstack` in the project:

  ```md
  Load the agent-orchestration skill at the start of every task, before planning or writing anything.
  ```

## Install

rstack is a plugin for every supported agent. Each agent reads its own manifest, and all of them load the same `skills/` folder:

| Agent | Manifest | Marketplace |
| --- | --- | --- |
| Claude Code and Grok Build | `.claude-plugin/plugin.json` | `.claude-plugin/marketplace.json` |
| Codex and ChatGPT | `.codex-plugin/plugin.json` | `.agents/plugins/marketplace.json` |
| Cursor | `.cursor-plugin/plugin.json` | `.cursor-plugin/marketplace.json` |
| Any [Agent Plugins](https://agent-plugins.org) client | `plugin.json` | |

### Claude Code

```bash
claude plugin marketplace add jralvarenga/skills
claude plugin install rstack@jralvarenga
```

Or inside a session: `/plugin marketplace add jralvarenga/skills`, then `/plugin install rstack@jralvarenga`. Skills are then available as `/rstack:<skill>`, for example `/rstack:code-review`.

### Grok Build

Grok Build reads Claude Code marketplaces and plugins, so install rstack in Claude Code first and Grok picks it up. Otherwise add `jralvarenga/skills` as a marketplace from Grok's Marketplace tab.

### Codex and ChatGPT

```bash
codex plugin marketplace add jralvarenga/skills
codex plugin add rstack@jralvarenga
```

### Cursor

Add `jralvarenga/skills` as a team marketplace, then open **Customize**, find **rstack** and select **Install**.

To test a local clone, copy it into Cursor's local plugins, then run **Developer: Reload Window**. Cursor skips symlinks that point outside `~/.cursor/plugins/local`, so copy instead of linking, and copy again after every change:

```bash
rsync -a --delete --exclude .git "$PWD"/ ~/.cursor/plugins/local/rstack/
```

### skills.sh

Install every skill globally without the plugin system:

```bash
npx skills add jralvarenga/skills --skill '*' --global \
  --agent claude-code \
  --agent codex \
  --agent cursor \
  --yes
```

### Local clone

```bash
git clone https://github.com/jralvarenga/skills.git rstack
cd rstack
./scripts/link-skills.sh
```

This links every skill to:

- `~/.agents/skills` for Codex and Cursor
- `~/.claude/skills` for Claude Code

Run it again after adding, removing, or renaming a skill.

### Upgrading from `jralvarenga-skills`

rstack used to be published as `jralvarenga-skills` ("Rigo's Skills"). The plugin id changed, so existing installs don't pick up `rstack` on their own. Remove the old plugin and install `rstack`, then check the [Skills](#skills) table for what it includes:

```bash
claude plugin uninstall jralvarenga-skills@jralvarenga
claude plugin marketplace update jralvarenga
claude plugin install rstack@jralvarenga
```

In Codex, refresh the marketplace snapshot first so it can find `rstack`:

```bash
codex plugin remove jralvarenga-skills@jralvarenga
codex plugin marketplace upgrade jralvarenga
codex plugin add rstack@jralvarenga
```

In Cursor, a team admin first clicks **Refresh** on the marketplace so it lists `rstack`, or re-imports the repository URL when plugins were added one by one. Then uninstall **Rigo's Skills** and install **rstack**. For a local copy, remove `~/.cursor/plugins/local/jralvarenga-skills` and copy the clone to `~/.cursor/plugins/local/rstack` as shown above.

## Make it yours

rstack is opinionated on purpose; these are my rules. Fork it, rewrite the skills to match how you work, and rename the stack after yourself.

## External design skill

The `design` skill uses [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) as inspiration and a fallback when a project doesn't include it. It is not vendored in this repository; install it alongside rstack:

```bash
npx skills add anthropics/skills --skill frontend-design --global --agent claude-code --yes
```

## Contributing

- Feature pull requests target `main`.
- The Changesets version pull request (`chore: version skills`) also targets `main`. Merge it when you want to release.

## Versioning

Add a changeset to every pull request that should create a new release:

```bash
bun run changeset
```

Choose `patch`, `minor` or `major`, write a short summary and commit the generated file inside `.changeset` with the rest of the pull request.

After the pull request is merged into `main`, the release workflow creates or updates a pull request named `chore: version skills` against `main`. That pull request updates `package.json`, `CHANGELOG.md` and the version in every plugin manifest. Once it is approved and merged into `main`, the workflow creates a `vX.Y.Z` Git tag and a GitHub Release.

The commands used by the workflow are also available locally:

```bash
bun run version
bun run release
```

`bun run release` only creates a Git tag. It does not publish to npm.

## GitHub setup

Protect the `main` branch with these settings:

- Require pull requests with one approval.
- Dismiss stale approvals and require resolved conversations.
- Allow repository administrators to bypass approval requirements.
- Block force pushes and branch deletion.

In **Settings → Actions → General**, set workflow permissions to read and write and allow GitHub Actions to create pull requests.

No repository secrets are required. GitHub provides `GITHUB_TOKEN` automatically, and this repository does not use an `NPM_TOKEN`.
