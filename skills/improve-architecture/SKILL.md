---
name: improve-architecture
description: Survey architectural friction and propose evidence-backed refactors as a visual HTML report for the user to choose from.
---

<!-- Adapted from Matt Pocock's improve-codebase-architecture. See the bundled MIT license. -->

# Improve architecture

Use the user's proposed area when supplied. Otherwise start with code that changes often, has recurring defects, or takes unusual effort to test. Read local decisions, the project glossary, and the behavior that callers depend on. Trace how a real task crosses the current modules before proposing a new shape.

Look for implementation details callers have to know, duplicated orchestration, and abandoned paths that attract new callers. Ask whether moving behavior behind an existing interface would concentrate complexity and let more behavior be tested through that interface. Verify presumed dead paths and consider compatibility or the cost of a migration.

Write a local HTML report with a clickable link. For each candidate show where the code is, what is painful today, a before and after diagram, what gets better in a way someone can see, and how big and risky the change is. Name the best place to start and any past decision the candidate would undo. Write it as [plain replies](../ayanostack/references/plain-replies.md) say.

Explore constraints and design tradeoffs with the user after they pick a candidate. The survey is read-only. Implementation follows a separate request and the project's existing workflow.
