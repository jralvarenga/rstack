---
name: agent-orchestration
description: Rules on how the agent handles every task I give it, deciding whether to do the work itself or delegate it, which model and provider handles each kind of work, how to brief a delegate, and how to run delegates in parallel or in isolation. Use at the start of every task, before planning or writing anything, and whenever orchestrating subagents or picking a model.
---

These are my rules on how an orchestrating agent splits work between itself and its delegates. The goal is that every kind of work goes to the model that does it best, each delegate gets a brief it can act on without asking, and when a model is unavailable the work moves to a known fallback instead of an improvised one. Use organization and project rules as the base and apply these rules as long as they do not conflict with them.

## Every task

Load this skill at the start of every task I give you, before you plan or write anything, even when the task looks small:

1. Classify the work by the task types in the routing table. A task can have several parts, for example planning, then implementation, then review. Split it only into substantial phases; a small step, like a small edit at the end of a plan, stays part of the phase around it. Classify a part as Council only when I asked for a council.
2. For each part, decide whether you do it yourself or delegate it, following "Do it or delegate it" below.
3. For each delegated part, pick the model from the routing table and its fallback by availability, then brief the delegate.
4. Say in one line how you split the work before you start, for example "Doing this myself" or "Planning here, implementation to a delegate".

When you are a delegate, the brief already made this decision. Do the work yourself and don't delegate again unless the brief allows it.

## Routing table

This table is the single source of truth for which model handles which work. Other skills, like council and setup-rstack, point here instead of naming models themselves. When models change, update this table only.

The ideal stack to have in the machine is Claude Code, Codex and Cursor/Grok, base on what's installed in the machine use the model require that match the desire model, tell the user what's missing and work with the available tools

| Task type                     | Model                                                         | Provider                   | Fallback                                           | Reasoning effort |
| ----------------------------- | ------------------------------------------------------------- | -------------------------- | -------------------------------------------------- | ---------------- |
| Planning and architecture     | Claude Opus 5.5                                               | Anthropic                  | GPT-6.2 Sol                                        | High             |
| Code review                   | Claude Opus 5.5                                               | Anthropic                  | GPT-6.2 Sol                                        | High             |
| UI and design                 | Claude Opus 5.5                                               | Anthropic                  | Claude Opus 5.5                                    | Medium           |
| Implementation                | GPT-6.2 Sol                                                   | OpenAI, via Codex          | Claude Opus 5.5                                    | Medium           |
| Research and fast exploration | GPT-6.1 Sol                                                   | OpenAI, via Codex          | Grok 4.7                                           | High             |
| Quick low-effort tasks        | Claude Sonnet 5.5 or Claude Haiku 5.5                         | Anthropic                  | Grok 4.7 Fast (xAI)                                | Low or medium    |
| Council                       | Claude Opus 5.5, GPT-6.2 Sol, and Grok 4.7, one delegate each | Anthropic, OpenAI, and xAI | Gemini 4 Neon (Google) replaces one missing member | Medium           |

- Pick the row for each phase by its main kind of work, not by the files it touches. A plan that ends in a small edit is one planning phase; a refactor across many files is implementation.
- Quick low-effort tasks are mechanical and well-specified, for example renaming, reformatting, collecting file lists, or summarizing a log. Use Haiku for the smallest ones and Sonnet when the task needs some judgment.
- The fallback is usually a model from a different provider at the same tier as the primary, a strong model for the high-effort rows and a fast one for quick tasks. A row can use the same model as its fallback when no other provider does that work as well. The fallback runs at the same reasoning effort as the primary.
- The Council row is the panel for a council I asked for: one strong model from each of three providers, so their blind spots don't overlap. Never start or offer a council from this row on your own.
- When I name a model, provider, or effort for a task, use mine instead of the table.

## Do it or delegate it

Do the work yourself when:

- It is small, quick, and you already have the context, for example a one-file fix, answering a question about code you just read, or a follow-up to your own change.
- Writing the brief would take about as long as doing the work.
- It is a short step whose result you need right away. A substantial phase that belongs to another row is still delegated, even when it runs in sequence and nothing else can run meanwhile.
- The task belongs to your own row in the routing table.

Delegate when:

- The task belongs to a different row in the routing table than the model you are running on.
- It needs a broad search or a lot of reading and you only need the conclusion, so the file dumps stay out of your context.
- It splits into independent pieces that can run at the same time.
- I ask for a delegate, a second opinion, or a specific model.

When I ask for a delegate, a second opinion, or a specific model, that decides it: delegate, even when the work is small. A second opinion is one delegate on the row for that work. A council starts only when I ask for a council. If the model or settings I asked for aren't available, tell me which and wait. Otherwise, when both lists match, do it yourself. A one-file mechanical fix you already have the context for stays with you even though it belongs to the quick-task row.

Never delegate the decision of what to build, or the final report you give me. You own the plan, you check the results, and you answer for them.

## Briefing a delegate

A delegate starts with no history. It has not seen this conversation, the files you read, or the decisions already made, so the brief carries everything it needs:

- **Goal:** what to do and why, in one or two sentences, with the issue or PR link when there is one.
- **Context:** the repository, branch, and files that matter, the decisions already made, and anything you already ruled out so it doesn't redo the work. Point to files and skills by path instead of pasting them.
- **Success criteria:** what done looks like, and how to verify it, for example the commands to run or the tests that must pass. When the delegate changes behavior, tell it to load [testing](../testing/SKILL.md) and report the test commands it ran and their results.
- **Constraints:** what it must not touch, whether it may commit, push, open a PR, or merge, and whether it may start its own delegates. By default delegates do the work themselves and never merge.
- **Report back:** the exact shape of the answer, for example a short summary, the files changed, open concerns, and the PR URL and head commit. Ask it to say what it could not verify.

Keep the brief specific and short. Use my words for names and decisions, and never let the delegate re-litigate something I already decided.

## Parallel and sequential

- Run delegates in parallel when their work is independent, for example researching two libraries, or reviewing different parts of a change.
- Run them in sequence when one needs the other's output, for example plan, then implement, then review. Pass the earlier result into the next brief instead of assuming the delegate can see it.
- Don't split one change across several delegates that edit the same files. Give it to one delegate.
- Read every result before acting on it. A delegate's report is a claim, check the diff, the tests, or the PR before telling me it is done.

## Isolation

- Every delegate that edits code works in its own worktree or branch, never in the checkout you or another delegate are using.
- Give every delegate that edits code its own branch. Name it after the issue it implements, and add a short suffix when several delegates work on the same issue, for example `46-routing-table` and `46-fallbacks`. Say in the brief which base it starts from.
- Read-only delegates, like research, exploration, and review, can share the current checkout.
- When the work is finished, the delegate pushes its branch and opens a PR if the brief allows it, or otherwise hands the branch back, so you merge the results deliberately instead of finding them mixed in your working tree.

## Fallbacks

Pick the model by availability, in this order:

1. Before delegating, check which models and providers the current harness actually offers.
2. Use the row's primary model when it is available.
3. When the primary model or its provider is not available, use the row's fallback, and tell me in your report which delegate ran on the fallback and why.
4. When neither the primary nor the fallback is available, tell me which ones are missing, then wait for my answer. Don't pick a third model on your own.

- A model I named for the task has no fallback. If it isn't available, tell me and wait.
- Never report work as done by a model that didn't do it.
- If a delegate fails, times out, or returns something unusable, say so with the error. Retry once with a better brief when the cause is clear, otherwise ask me. A provider error or rate limit that persists after the retry counts as unavailable, so move to the fallback.

## Tools

Use the subagent or delegation tools the current harness provides, whatever they are called, instead of a specific product. Pass the model, provider, and reasoning effort through the harness's own settings for the delegate. When the harness has no way to reach a model from the routing table, that model is unavailable, so follow the fallback rules.
