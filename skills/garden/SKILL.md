---
name: garden
description: Tend a repository like a maintainer with spare time—audit or prune repeated code, dead paths, stale docs, tautological tests that cannot fail, and recurring agent mistakes (`correct`), plus surface structural or performance upkeep. Use for /garden, /correct, codebase hygiene, slow or useless tests, or maintenance passes.
---

<!-- Includes `correct` from pstack by Lauren Tan (MIT). See the bundled LICENSE. -->

# Garden

Treat the repository as an environment that future agents will copy. Every hack, stale doc, or duplicated helper left behind becomes the next agent's precedent.

State the mode before editing. **Audit** (default) returns a prioritized list of high-leverage prunes and missing constraints without modifying files. **Prune** applies 1 to 3 small, atomic, behavior-preserving commits (or a bounded batch when called from [overnight](../overnight/SKILL.md)). Ask if the requested scope is broader than one module or repo.

## Gardening vectors

Inspect the target scope across the vectors that match the request:

1. **Recurring agent mistakes:** Follow [correct](references/correct.md). Read recent commits, reverts, review comments, and workaround comments to group mistakes that happened at least twice, then eliminate each class at the highest level that works (architecture → types/lint/CI → behavior tests → docs last) and prove each new check fails on a real past mistake.
2. **Docs and agent instructions (doc-gardening):** Compare `README`, `AGENTS.md`, runbooks, and examples against live code and scripts. Fix or flag broken links, dead commands, outdated flags, and prose rules that are already enforced in code.
3. **Dead code, repeated blocks, and comment drift:** Hunt unused exports, abandoned code paths, duplicated helpers, orphaned `TODO`s, and forgotten skipped tests. Use [no-comments](../no-comments/SKILL.md) to strip redundant prose and expose workarounds, and [simplify-diff](../simplify-diff/SKILL.md) to keep edits minimal.
4. **Tests that cannot fail:** Follow [tautological tests](references/tautological-tests.md). Prove each one with a deliberate break, then delete it or rewrite it against an independent value. Start with the slowest, and report the suite time before and after.
5. **Structural friction:** When repeated workarounds or tight coupling point to a larger refactor, do not smuggle it into a hygiene commit. Surface it as a candidate through [improve-architecture](../improve-architecture/SKILL.md).
6. **Performance upkeep:** When targeting hotspots or slow paths, validate every before/after claim with [benchmark-checklist](../benchmark-checklist/SKILL.md). Keep only verified wins.

## Guardrails

- Keep hygiene separate from behavior changes unless the user explicitly asked for a fix or feature.
- Verify every prune with the project's real build, lint, and tests before committing. One concern per commit so each change reviews in minutes.
- Never weaken tests, relax types, or silence lint rules to make a cleanup pass green. Removing a test that a deliberate break proves cannot fail is not weakening it.
- Report findings ranked by how much they help and how risky they are: what you removed (with commits and checks), which new checks you added and proved, and which larger refactors or open questions remain. Write it as [plain replies](../ayanostack/references/plain-replies.md) say.
