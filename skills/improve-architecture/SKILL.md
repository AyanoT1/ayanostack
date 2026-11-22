---
name: improve-architecture
description: Survey architectural friction and propose evidence-backed refactors as a visual HTML report for the user to choose from.
---

<!-- Adapted from Matt Pocock's improve-codebase-architecture. See the bundled MIT license. -->

# Improve architecture

Use the user's proposed area when supplied. Otherwise start with code that changes often, has recurring defects, or takes unusual effort to test. Read local decisions, the project glossary, and the behavior that callers depend on. Trace how a real task crosses the current modules before proposing a new shape.

Look for implementation details callers have to know, duplicated orchestration, and abandoned paths that attract new callers. Ask whether moving behavior behind an existing interface would concentrate complexity and let more behavior be tested through that interface. Verify presumed dead paths and consider compatibility or the cost of a migration.

Write a local HTML report with a clickable link. For each candidate show the source locations, the current friction, a before and after diagram, the observable benefit, and the scope and risk. Identify the best starting point and any existing decision the candidate would reopen.

Explore constraints and design tradeoffs with the user after they pick a candidate. The survey is read-only. Implementation follows a separate request and the project's existing workflow.
