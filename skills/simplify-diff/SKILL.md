---
name: simplify-diff
description: Reduce the current diff while preserving behavior and supported callers. Look for existing implementations before inlining or introducing helpers. Use when asked to slim down a change or during PR preparation.
---

<!-- Adapted from Anthony Fu's antfu-simplify. See the bundled MIT license. -->

# Simplify diff

Read the scoped diff and nearby callers. Summarize the intended behavior in one sentence. Search the repository first for equivalent helpers, types, configuration, and tests. Check their contracts and failure cases before reuse.

For each meaningful addition, ask what fails if it goes away. Test removing speculative options, wrappers, unreachable guards, and duplicate paths. For a new test, ask which bug it catches: if it still passes when you break the code it covers, it is [tautological](../garden/references/tautological-tests.md), so cut it or rewrite it against an independent value. Keep behavior for real inputs, retries, migrations, and callers that already depend on it. Stay inside the change unless another file must move with a simplification.

For a new helper, try reusing an existing implementation before considering whether to inline it. Check semantic fit and dependency direction. Keep a named helper when its responsibility or contract makes the caller easier to understand, even with one caller. Preserve a shared helper if replacing it would duplicate behavior or bypass a contract.

Run the project's focused checks against each meaningful cut. Restore a cut that changes behavior. Report what you removed or reused and how you checked it, as [plain replies](../ayanostack/references/plain-replies.md) say.
