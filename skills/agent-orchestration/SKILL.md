---
name: agent-orchestration
description: Rules on which model and provider the agent should delegate each kind of work to, when to delegate instead of doing the work itself, how to brief a delegate, and how to run delegates in parallel or in isolation. Use when orchestrating subagents, delegating planning, implementation, review, research, or design work, or picking a model for a task.
---

These are my rules on how an orchestrating agent splits work between itself and its delegates. The goal is that every kind of work goes to the model that does it best, each delegate gets a brief it can act on without asking, and when a model is unavailable the work moves to a known fallback instead of an improvised one. Use organization and project rules as the base and apply these rules as long as they do not conflict with them.

## Routing table

This table is the single source of truth for which model handles which work. Other skills, like council and setup-rstack, point here instead of naming models themselves. When models change, update this table only.

| Task type | Model | Provider | Fallback | Reasoning effort |
| --- | --- | --- | --- | --- |
| Planning and architecture | Claude Opus 5.5 | Anthropic | GPT-6.2 Sol (OpenAI) | High |
| Code review | Claude Opus 5.5 | Anthropic | GPT-6.2 Sol (OpenAI) | High |
| UI and design | Claude Opus 5.5 | Anthropic | Gemini 4 Neon (Google) | High |
| Implementation | GPT-6.2 Sol | OpenAI, via Codex | Claude Opus 5.5 (Anthropic) | High |
| Research and fast exploration | Grok 4.7 | xAI | Gemini 4 Neon (Google) | High |
| Quick low-effort tasks | Claude Sonnet 5.5 or Claude Haiku 5.5 | Anthropic | Grok 4.7 Fast (xAI) | Low or medium |
| Council | Claude Opus 5.5, GPT-6.2 Sol, and Grok 4.7, one delegate each | Anthropic, OpenAI, and xAI | Gemini 4 Neon (Google) replaces one missing member | High |

- Pick the row by the main kind of work in the task, not by the files it touches. A plan that ends in a small edit is planning, a refactor across many files is implementation.
- Quick low-effort tasks are mechanical and well-specified, for example renaming, reformatting, collecting file lists, or summarizing a log. Use Haiku for the smallest ones and Sonnet when the task needs some judgment.
- The fallback is a strong model from a different provider, so an outage of one provider never blocks a row. It runs at the same reasoning effort as the primary.
- The council row is the default panel for a multi-provider review: one strong model from each of three providers, so their blind spots don't overlap.
- When I name a model, provider, or effort for a task, use mine instead of the table.

## Do it or delegate it

Do the work yourself when:

- It is small, quick, and you already have the context, for example a one-file fix, answering a question about code you just read, or a follow-up to your own change.
- Writing the brief would take about as long as doing the work.
- The next step depends on the result right away and nothing else could run meanwhile.
- The task belongs to your own row in the routing table.

Delegate when:

- The task belongs to a different row in the routing table than the model you are running on.
- It needs a broad search or a lot of reading and you only need the conclusion, so the file dumps stay out of your context.
- It splits into independent pieces that can run at the same time.
- I ask for a delegate, a second opinion, or a specific model.

Never delegate the decision of what to build or the final report to me. You own the plan, you check the results, and you answer for them.

## Briefing a delegate

A delegate starts with no history. It has not seen this conversation, the files you read, or the decisions already made, so the brief carries everything it needs:

- **Goal:** what to do and why, in one or two sentences, with the issue or PR link when there is one.
- **Context:** the repository, branch, and files that matter, the decisions already made, and anything you already ruled out so it doesn't redo the work. Point to files and skills by path instead of pasting them.
- **Success criteria:** what done looks like, and how to verify it, for example the commands to run or the tests that must pass.
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
- Name the branch after the issue it implements, and say in the brief which base it starts from.
- Read-only delegates, like research, exploration, and review, can share the current checkout.
- When the work is finished, the delegate pushes its branch and opens a PR, or hands the branch back, so you merge the results deliberately instead of finding them mixed in your working tree.

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
