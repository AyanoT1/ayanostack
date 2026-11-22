# Independent reviewers

Use the panel the user names or the `interrogate reviewers` line in the project's `AGENTS.md`. In T3 Code, inspect the available models and effort choices. A missing model is a coverage gap. Use an available model only within the caller's constraints. One reviewer can still run the local review when an independent panel is unavailable.

Pass the same source snapshot to each reviewer. Verify that the snapshot includes any in-scope unpublished changes. Use the host's checkout isolation when reviewers need to write or execute a repro that modifies files. Give a read-only reviewer a narrow scope and the intent, without seeding suspected findings. Use the host's delegated task and completion flow. Reviewers should return the exact command, actual and expected result, and why the difference matters.
