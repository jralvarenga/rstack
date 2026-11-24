---
name: rstack-mode
description: The entry point of rstack. Core rules for every task, an index of every rstack skill, automatic routing from the kind of ask to the skills to load, and playbooks for common workflows like filing an issue, implementing it, reviewing a PR, starting an app, and running parallel delegates. Use at the start of any task in a project that uses rstack, or when unsure which rstack skill applies.
---

These are my rules on how an agent works with rstack. This skill doesn't replace the other skills, it decides which of them to load for the task in front of you and in which order. Use organization and project rules as the base and apply these rules as long as they do not conflict with them.

## Core rules

These apply to every task, whatever skills it loads:

- Read the project's `AGENTS.md` and `CLAUDE.md` before starting, and its `DESIGN.md` when it has one. Project and organization rules come first, rstack fills in everything they don't cover.
- Load [code-guidelines](../code-guidelines/SKILL.md) for every task that writes or changes code, in any language.
- Load [design](../design/SKILL.md) for any work that changes how something looks.
- Load every skill the task needs before you start, not halfway through. A task often needs more than one.
- Act on the request. Ask only when the answer would change the result, and then ask one focused question.
- Never commit to `main`. Work on a branch named after the issue, as described in [app-architecture](../app-architecture/SKILL.md#branching).
- Never invent requirements, product behavior, labels, or results. Check the diff, the tests, or the tool response before saying something is done, and say what you couldn't verify.
- Open pull requests when the task calls for it, but merge only when I ask.

## Skills

| Skill | Use when |
| --- | --- |
| [agent-file](../agent-file/SKILL.md) | Writing or refreshing `AGENTS.md`, `CLAUDE.md`, or `DESIGN.md`, or after a change makes them stale. |
| [agent-orchestration](../agent-orchestration/SKILL.md) | Delegating work, picking a model or provider, briefing delegates, or running them in parallel. |
| [app-architecture](../app-architecture/SKILL.md) | Creating an app, adding a package or service, setting up branches, environments, CI/CD, deployments, or auth. |
| [backend](../backend/SKILL.md) | Designing or changing an API, a database schema or query, a server, a background job, or a service's Docker setup. |
| [code-guidelines](../code-guidelines/SKILL.md) | Writing or formatting any code. Always on for coding tasks. |
| [code-review](../code-review/SKILL.md) | Reviewing a pull request, branch, or diff. |
| [council](../council/SKILL.md) | I say "council", or ask for a review from several models or providers at once. |
| [design](../design/SKILL.md) | Designing components, pages, or features, or any change to how the frontend looks. |
| [frontend](../frontend/SKILL.md) | Planning the frontend app, its components, pages, routing, data fetching, and state. |
| [issue-management](../issue-management/SKILL.md) | Creating, refining, renaming, splitting, assigning, handing off, commenting on, or triaging issues. |
| [rstack-help](../rstack-help/SKILL.md) | I ask what rstack is, which skill does what, or how to use it. |
| [setup-rstack](../setup-rstack/SKILL.md) | Installing or configuring rstack for me or for a project. |

If a skill in this table isn't installed, say so and continue with the skills that are. Don't improvise the missing skill's flow.

## Routing

Match the ask to every row that fits and load all of the skills in them:

| The ask | Load |
| --- | --- |
| Any code change | code-guidelines, plus the area skills below |
| UI, components, pages, styling | frontend and design |
| APIs, databases, servers, jobs, Docker | backend |
| A new app, package, or service, CI/CD, deployments, environments, auth | app-architecture |
| Agent files are missing, asked for, or out of date | agent-file |
| Filing or updating issues | issue-management |
| Reviewing a PR, branch, or diff | code-review |
| "council", or a review by several models | council |
| Delegating, subagents, parallel work, or which model to use | agent-orchestration |
| How rstack works | rstack-help |
| Installing or configuring rstack | setup-rstack |

- Model and provider choices always come from [agent-orchestration](../agent-orchestration/SKILL.md). Don't pick a model from memory or keep a second list here.
- A review from several models always goes through council. Don't assemble your own panel of reviewers.
- When an ask spans several rows, like "build the settings page and its API", load the skills of every row before you plan.
- When the ask matches a playbook below, follow the playbook. It says which skill to load at each step.

## Playbooks

Playbooks are the order of steps for the workflows I repeat most. Each one lists the steps, the skill each step loads, and what done means.

- [Filing or refining an issue](playbooks/file-issue.md)
- [Implementing an issue end to end](playbooks/implement-issue.md)
- [Reviewing a pull request](playbooks/review-pr.md)
- [Starting a new app or feature](playbooks/new-app-or-feature.md)
- [Orchestrating parallel work across delegates](playbooks/parallel-work.md)

When a task doesn't match a playbook, use the routing table and the core rules.

## Delegates

When you delegate, follow [agent-orchestration](../agent-orchestration/SKILL.md) for the model, the brief, and isolation. Tell every delegate to load `rstack-mode` and `agent-orchestration` before it starts. Where the harness supports plugin agents, use the `rstack` agent from rstack's `agents/` folder, which does that for you.
