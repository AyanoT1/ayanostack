---
name: typescript-best-practices
description: Check TypeScript boundary validation and domain types when a change introduces type complexity, unsafe narrowing, or a new data contract. Use the repository's established patterns and libraries.
---

<!-- Adapted from pstack by Lauren Tan. See the bundled MIT license. -->

# TypeScript best practices

Read project instructions, compiler settings, and adjacent patterns first. Keep the compiler and dependency choices of the project.

- Validate untrusted input at the boundary with the project's existing validation approach. Enter domain code with a validated type. A type assertion does not validate a value.
- Reuse an existing type or derive from the source of truth when that keeps the public contract readable. Give downstream callers explicit contracts where inference would expose internals.
- Use a discriminant and exhaustive handling when variants have different behavior. Choose plain types for simple data. Use a stronger type only when it makes a real invalid state harder to construct and fits the codebase.
- Prefer ordinary control-flow narrowing. A named guard should verify its promise at runtime. Investigate a new suppression or non-null assertion before keeping it.
- Preserve existing public and persisted shapes. Verify boundary, error, and legacy-data cases through project tests where the change affects them.

Favor a change the next team can maintain. A new schema library, type-level abstraction, or migration needs a concrete payoff and its own project decision.

Report each problem with its location, the bad value it lets through, and the fix, as [plain replies](../ayanostack/references/plain-replies.md) say.
