# Tautological tests

A tautological test cannot fail. It passes whether the code is right or wrong, so it catches no bug. It still costs time on every pipeline run, and it makes coverage look higher than it is.

## Signs

| Sign | Example |
| --- | --- |
| It checks the value the test itself put in a mock | The mock returns `5`, the code passes it through, and the test expects `5`. |
| It only checks that a mock was called | `expect(repo.save).toHaveBeenCalled()`, and nothing about what was saved. |
| The expected value comes from the code under test | `expect(total(rows)).toBe(total(rows))`, or the test copies the formula from the implementation. |
| It pins the current output with no independent check | A snapshot nobody reviewed, or one the history shows was updated with `-u` every time it broke. |
| It checks only that something exists | `toBeDefined()`, `toBeTruthy()`, "does not throw", or a shape the compiler already checks. |
| It tests the framework or a library, not the project | That a state hook updates, or that the ORM saves a row. |
| It mocks the unit it claims to test | The function under test is itself replaced by a mock. |
| Its assertions never run | No `expect`, or an `expect` inside a callback or promise the test does not wait for. |
| It repeats another test | Same path, same kind of input, same assertion. |

A sign is a lead, not proof. Prove it with the mutation check below.

## Prove it: break the code

1. Find the line of project code the test claims to cover.
2. Break it on purpose: flip a condition, return a constant, or delete the line.
3. Run only that test.
4. If it still passes, it is tautological. Restore the code.

If the project already has a mutation tool (Stryker, mutmut, PIT), use its report for the same answer across many tests.

## What to do with it

- **Delete it** when another test fails on the same break, or when the behavior does not matter. Deleting a test that cannot fail does not weaken the suite. Put the break you used in the commit message as proof.
- **Rewrite it** when the behavior matters and no other test catches the break. Take the expected value from an independent source: a hand calculation, a real fixture, or the previous output. Show that the rewritten test fails on the break.

For an existing suite, start with the slowest tests: ones that boot a database, a server, or a browser only to check a mock. Time the suite before and after.

## Report

For each test: its name and location, the sign, the break that proved it, and whether you deleted or rewrote it. End with the time the suite takes before and after. Write it as [plain replies](../../ayanostack/references/plain-replies.md) say.

If agents keep writing these tests, make it a [correct](correct.md) class. A lint rule such as `expect-expect` from the Jest or Vitest ESLint plugin catches tests with no assertion.
