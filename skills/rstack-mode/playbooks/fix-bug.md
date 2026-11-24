# Fixing a bug

Use when I report a bug, a failing test, a crash, or behavior that doesn't match what the code should do.

## Steps

1. Read the report and any linked issue. If there is no issue and I want one, use the [file-issue](file-issue.md) playbook first.
2. Load [code-guidelines](../../code-guidelines/SKILL.md), [testing](../../testing/SKILL.md), and the area skills from the routing table in [rstack-mode](../SKILL.md#routing). Branch as described in [app-architecture](../../app-architecture/SKILL.md#branching).
3. Reproduce it. Write a failing test that shows the bug, following [testing](../../testing/SKILL.md#when-to-test), in the folder [testing](../../testing/SKILL.md#where-tests-live) describes. When a test can't reproduce it, write down the exact steps and the output you saw.
4. Trace the symptom back to the first place the system went wrong and fix it there. A guard or a fallback counts as a fix only when the state it handles is legitimate.
5. If two fixes failed, stop. Write down the assumption both shared, test it directly, and only then try again.
6. Run the new test and the project's formatter, checks, and tests. The new test fails without the fix and passes with it.
7. Open or update the PR following steps 6 to 9 of the [implement-issue](implement-issue.md) playbook. The PR description says what the cause was, not just what changed.

## Done when

A test or a written repro shows the bug before the fix and its absence after. The PR names the root cause, links the issue when there is one, and passes checks, or I got their failures with the output. Code review left no open P0 or P1.
