---
name: rstack-help
description: Explains what rstack is, how to install and start using it, which skill does what, and which skill or playbook fits a common ask. Use when I ask what rstack is, how to use it, which skills it has, or which skill to use for something.
---

These are my rules on how the agent explains rstack to me or to anyone using it. Keep the answer friendly and short, answer the question that was asked, and point to the skill that does the work instead of doing that skill's job here.

## What rstack is

rstack is my personal stack: a collection of agent skills with the rules I want every agent to follow when it writes, designs, reviews, and ships code with me. It ships as a plugin for Claude Code, Codex, Cursor, Grok Build, and any Agent Plugins client, and every agent loads the same skills.

## Getting started

1. Install it. The Install section of the [README](https://github.com/jralvarenga/skills#install) has the command for each agent. In Claude Code the skills are then available as `/rstack:<skill>`.
2. Start every task from [rstack-mode](../rstack-mode/SKILL.md). It holds the core rules, picks the skills each task needs, and has playbooks for the workflows I repeat.
3. Run [setup-rstack](../setup-rstack/SKILL.md) once in each project, and again after the routing table in [agent-orchestration](../agent-orchestration/SKILL.md) changes. It adds an rstack section to the project's `AGENTS.md` with the model routing for that project.
4. Say "council" when you want a review from several models at once. The agent runs a council only when you ask, and never starts or offers one on its own.

## Skills

| Skill | What it does |
| --- | --- |
| rstack-mode | The entry point. Core rules, triggers, principles, autonomy, routing from the ask to the skills, and the playbooks. |
| rstack-help | This guide. |
| setup-rstack | Writes the rstack section, with the model routing, into a project's `AGENTS.md`. |
| code-guidelines | How code is written and formatted. Always on for coding tasks. |
| testing | When and how tests are written, placed, run, and reported. On for every behavior change and bug fix. |
| design | How the frontend looks. |
| frontend | How the frontend app, components, pages, and features are planned. |
| backend | How APIs, databases, validation, and infrastructure are planned. |
| app-architecture | How apps are structured, set up, and deployed, including repos, environments, and auth. |
| code-review | Reviews a pull request, branch, or diff. |
| council | Reviews with several models from different providers at once, only when you ask for a council. |
| agent-file | Writes and refreshes `AGENTS.md`, `CLAUDE.md`, and `DESIGN.md`. |
| issue-management | Creates and manages issues in Linear, GitHub, or another tracker. |
| agent-orchestration | Picks the model for each kind of work and briefs delegates. Holds the routing table. |

When a skill in this list isn't installed, say so instead of describing it as available.

## Common asks

| The ask | Use |
| --- | --- |
| "Implement issue #12" | The [implement-issue](../rstack-mode/playbooks/implement-issue.md) playbook |
| "File an issue for this" | The [file-issue](../rstack-mode/playbooks/file-issue.md) playbook |
| "Fix this bug" | The [fix-bug](../rstack-mode/playbooks/fix-bug.md) playbook |
| "Get this PR green" or "babysit this PR" | The [watch-pr](../rstack-mode/playbooks/watch-pr.md) playbook |
| "Review this PR" | The [review-pr](../rstack-mode/playbooks/review-pr.md) playbook |
| "council" | council |
| "Start a new app" or "plan a big feature" | The [new-app-or-feature](../rstack-mode/playbooks/new-app-or-feature.md) playbook |
| "Do these in parallel" | The [parallel-work](../rstack-mode/playbooks/parallel-work.md) playbook |
| "Add tests for this" or "set up tests" | testing |
| "Write the AGENTS.md" | agent-file |
| "Which model should do this?" | agent-orchestration |
| "Set up rstack in this repo" | setup-rstack |

For anything else, the full routing lives in [rstack-mode](../rstack-mode/SKILL.md#routing). Don't keep a second copy of it here.

## Answering

- Answer what was asked. A question about one skill gets that skill's line and a pointer to it, not the whole guide.
- Never name models here. Model and provider questions go to agent-orchestration, which is the only place that lists them.
- When the question turns into a task, like "ok, review my PR", stop explaining and load rstack-mode to do it.
