# Task classification

Pick one primary class based on verified evidence, not the ticket's original label. If a ticket mixes two, pick the one that governs the next decision and note the secondary aspect.

| Class | Meaning | Default action in `auto` mode |
| --- | --- | --- |
| `easy-fix` | Verified, localized defect or tweak with clear root cause, small blast radius, and no contract change. | Implement up to project delivery ceiling. |
| `bug` | Confirmed defect with reproducible failure and clear intended behavior. | Implement if bounded and within project rules; otherwise hand off plan. |
| `critical-bug` | Confirmed severe failure (data loss, auth/security break, outage, broken core path). | Confirm mitigation/scope quickly; prepare minimal verified fix up to project ceiling. |
| `not-reproducible` | Could not reproduce live after checking environment, data, and steps. | Stop at handoff with repro log and questions for reporter. |
| `feature-missing` | Documented or expected capability that was omitted or left incomplete. | Implement only in `drive` mode or if explicitly authorized; otherwise hand off scope. |
| `feature-request` | New capability not currently specified or supported. | Stop at handoff with feasibility notes and options. |
| `requirement-change` | Current code matches existing spec/behavior; ticket asks to change the rules. | Stop at handoff; flag contract impact for sign-off. |
| `research` | Feasibility, root cause across external systems, or competing approaches need exploration before committing. | Stop at handoff (or suggest an [overnight](../../overnight/SKILL.md) `research-feature` run). |
| `architecture-decision` | Clean fix depends on choosing between competing ownership, contract, or boundary tradeoffs. | Stop at handoff comparing options, gains, and costs. |
| `architecture-design` | Underlying friction requires a broader structural redesign rather than a local patch. | Stop at handoff; optionally survey via [improve-architecture](../../improve-architecture/SKILL.md). |
