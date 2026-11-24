---
name: testing
description: Rules on when and how the agent writes, places, runs, and reports tests, from unit tests to integration and end-to-end, for the frontend, the backend, and bug fixes. Use whenever a task adds or changes behavior, fixes a bug, adds, changes, or runs tests, sets up a test runner or test commands, or reviews tests in a diff.
---

These are my rules on how the agent tests code. A test is the evidence that a change does what it claims, so every behavior change ships with one and every claim about tests comes from a run. Use organization and project rules as the base and apply these rules as long as they do not conflict with them. When the project already has a runner, a folder layout, or helpers, follow what it decided.

## When to test

- **New or changed behavior** → add or update the tests that cover it in the same change.
- **A bug** → write a failing test that shows the bug before you fix it. The test fails without the fix and passes with it. When a test can't reproduce it, write down the exact steps and the output you saw.
- **A refactor** → the existing tests stay green without changes. When the code has no tests, add tests for its current behavior first, then refactor.
- **Planning a feature or a slice** → name the tests that will prove each acceptance criterion as part of the plan.
- **No tests needed** → files with only types, generated code, configuration, or copy changes. Don't add empty test files.

Never delete, skip, or weaken a failing test to get a green run. Change a test only when the behavior it checks changed on purpose, and say so in the PR.

## What to test

Test observable behavior and public contracts, not the implementation. A test should still pass after a refactor that keeps the behavior.

- Cover the main path, the failure paths, and the edge cases that matter: empty, invalid, unauthorized, boundary values, and concurrent or repeated calls.
- Pick the lowest level that proves the behavior. Unit tests for pure logic, integration tests where pieces meet, like a procedure and its database, and end-to-end tests only for critical journeys that span several features.
- Don't write assertions that copy the implementation, snapshot large trees, or only check that a mock was called.

## Where tests live

Whenever a test is added, always put it inside a test folder, never next to the source file or loose in the project root.

- Name the test folder after the convention of the language or framework: `__tests__` for JavaScript and TypeScript (Jest, Vitest, React Native), `tests` for Python, Rust and PHP, and `test` for Elixir, Dart and Flutter. If the project or framework already uses a different test folder name, use that one.
- Put the test folder directly inside the folder that contains the source files it verifies, for example components/ui/__tests__/button.test.tsx for components/ui/button.tsx.
- When the test runner only discovers tests in a project-level folder, like `tests` for Rust integration tests or `test` for Dart, Flutter and Elixir, put the tests in that folder and mirror the source structure inside it.
- Only place tests outside a test folder when the language requires it, like Go `_test.go` files next to the source or Rust unit tests in a `#[cfg(test)]` module inside the source file.
- Give each source file with testable behavior its own test file, keeping its filename and adding `.test.ts` or `.test.tsx`.
- Keep folder-specific fixtures and helpers in that folder's test directory, and shared testing infrastructure, like factories, fakes, and setup files, in a dedicated application-level testing directory. In a monorepo, keep shared test configuration in packages/config as described in [app-architecture](../app-architecture/SKILL.md).

## Writing a test

- One behavior per test. Name it after the behavior, for example "rejects an order with no items", not after the function.
- Arrange, act, assert, in that order. Build test data with small factories that take overrides instead of large shared fixtures.
- Keep tests deterministic and independent. Control time with fake timers, fix random seeds, never sleep to wait, and never depend on the order tests run in or on state another test left.
- Fake only the boundaries you don't own: the network, third-party services, time, and randomness. Never mock your own modules or the database to make a test pass.
- Follow [code-guidelines](../code-guidelines/SKILL.md) for the test code itself.

## Frontend

- Use the project's runner, or Vitest by default, with Testing Library for React and React Native Testing Library for React Native.
- Component tests find and use the interface the way a person does, by role, label, and text, following Testing Library's guiding principles. Cover user interactions, accessibility, state transitions, validation, and the loading, empty, error, and retry states.
- Hook and utility tests check inputs, outputs, side effects, and meaningful edge cases.
- Route integration tests cover parameters, navigation, authentication, and error recovery.
- Fake the network at the request level, like with MSW, instead of mocking the data-fetching hooks.
- End-to-end tests cover the critical journeys that span multiple features, with Playwright on the web unless the project uses something else.

## Backend

- Test the public contract and the business behavior: valid and invalid inputs against the schemas, authorization rules, error codes, state transitions, and edge cases.
- Run integration tests for services and queries against a real Postgres database started from the same Docker image used in development, as described in [backend](../backend/SKILL.md#infrastructure), instead of mocking the database. Reset it between tests through migrations and seeds.
- Test procedures and routes through the server handler to verify validation, authentication, status codes, and response shapes.
- For Convex, test functions with the project's Convex test harness, like `convex-test`, instead of calling the handlers directly.
- Isolate external services with fakes at the lib layer.

## Running tests

- The project provides commands to run all tests, a single file, watch mode, and coverage. Add the missing ones when you set up a runner, and record them in the agent files with [agent-file](../agent-file/SKILL.md).
- While working, run the tests for what you changed. Before every commit, run the formatter, the checks, and the tests for what changed. Before opening or handing over a PR, run the full suite when it's practical.
- CI runs the tests on every pull request, as described in [app-architecture](../app-architecture/SKILL.md#deployment). Never bypass a failing check.
- A flaky test is a bug. Rerun it once to confirm it's flaky, then fix it, or skip it with a linked issue and say so. Never add retries to hide it.
- Coverage is a map, not a goal. Use it to find untested changed behavior, not to hit a percentage.

## Reporting

- Never say tests pass without running them in this session. Give the command and the result.
- Say which behavior has no test and why, and which tests you couldn't run, like ones that need a service you don't have.
- When the project has no test setup, say so and propose the smallest one that fits its stack instead of adding a runner unasked.
