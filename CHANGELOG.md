# rstack

## 3.0.0

### Major Changes

- 17d07c8: Rename the collection and plugin from `jralvarenga-skills` ("Rigo's Skills") to `rstack`. Reinstall with `rstack@jralvarenga`.

### Minor Changes

- 003efc8: Add the `agent-orchestration` skill: which model and provider handles each kind of work, when to delegate, how to brief delegates, and what to do when a model is unavailable.
- ee8d4d5: Add the `council` skill: a review or feedback round by three delegates from three different providers, scored out of 10 per round, repeated until every member is satisfied, with the scores recorded in the PR description.
- 9f4d57e: Track reviewed external skill versions in a registry and propose upstream updates in a weekly pull request.
- 7158862: Package rstack for Cursor Marketplace review with an MIT license, a plugin logo, and submission instructions.
- e70715d: Add the `rstack-help` skill, a short guide to what rstack is, its skills, and which skill or playbook fits a common ask, and the `setup-rstack` skill, which writes a marked rstack section into a project's `AGENTS.md` with the model routing generated from `agent-orchestration`'s routing table and any per-project overrides.
- df9cbc2: Add the `rstack-mode` entry-point skill: core rules, an index of every rstack skill, routing from the kind of ask to the skills to load, and playbooks for filing an issue, implementing it, reviewing a PR, starting an app or feature, and running parallel delegates. Add an `agents/` pack with an `rstack` subagent that loads `rstack-mode` and `agent-orchestration`, registered in the Cursor manifest.

## 2.6.0

### Minor Changes

- 4fbef77: Drop the next integration branch from the app-architecture branching rules so feature branches are created from and merged into main, which then promotes to dev, staging and prod.
- 51fdc73: Require every added test to live inside a test folder named after the language or framework convention, such as `__tests__` for JavaScript and TypeScript or `tests` for Python and Rust, and check test placement during code review.

## 2.5.1

### Patch Changes

- 8c3890c: Fix Cubic review findings on the 2.5.0 skills: advertise agent-file and issue-management in plugin metadata, drop the invalid Cursor marketplace displayName, align backend validation, Drizzle types, and retries, and require DESIGN.md only when the project has user-facing output.

## 2.5.0

### Minor Changes

- 69cf197: Add the `backend` skill for API, database, validation, error handling, infrastructure, and testing rules, with schema-first Zod validation, typed requests and responses, and Docker-first services. Update plugin descriptions so the new skill is discoverable.

### Patch Changes

- 0b2a124: Rename the collection display name to Rigo's Skills in the README and plugin manifests.

## 2.4.0

### Minor Changes

- 2939673: Add an issue-management skill for filing and managing issues in any tracker with consistent routing, defaults, priority, and body format
- 8c20185: Add an agent-file skill for reading a codebase and creating or refreshing AGENTS.md, CLAUDE.md, and DESIGN.md

## 2.3.0

### Minor Changes

- f86beb1: Add the `app-architecture` skill for repository structure, branching and protection, environments, deployment, and authentication.

## 2.2.0

### Minor Changes

- e05d49e: Add the `code-review` skill for reviewing pull requests against project rules and the code guidelines, with severity-ranked summary and inline comments.

## 2.1.0

### Minor Changes

- 1c0cacf: chore: update code guidelines and design agent description (#14)

### Patch Changes

- a3e788a: Clarify frontend rendering boundaries, query state ownership, and error reporting. Align design metadata with its frontend scope and correct wording and the structured error example.
- eb2b41b: Fix frontend references to the code guidelines, remove obsolete repository-owned links when relinking skills, and put Codex display metadata in the supported interface object.

## 2.0.0

### Major Changes

- 5e4377a: Rename `jralv-code-guidelines` to `code-guidelines` and `jralv-design` to `design`, and stop vendoring the external `frontend-design` and `ui-ux-pro-max` skills.

  Ship the repository as a plugin for Claude Code, Grok Build, Codex, ChatGPT and Cursor, with one manifest per agent and the version kept in sync on release.

### Minor Changes

- 71eb458: chore: remove outdated skills and update code guidelines

## 1.0.0

### Major Changes

- c5ed0ef: Initial skills package release.
