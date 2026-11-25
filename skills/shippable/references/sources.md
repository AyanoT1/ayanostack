# Sources

The default tiers and rules in `shippable` come from where practitioners who ship fast and those known for craft agree. Quotes are from the linked primary source unless marked otherwise.

## Where the camps agree

**Duplication is cheaper than the wrong abstraction.**

- Sandi Metz, [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction): "duplication is far cheaper than the wrong abstraction."
- Dan Abramov, [Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code/) and [The WET Codebase](https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase): an early urge to abstract "might just mean that you don't really understand the problem yet."
- Kent C. Dodds, [AHA Programming](https://kentcdodds.com/blog/aha-programming): "Optimize for change first."

**Strict at boundaries, loose inside.**

- Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) asks to concentrate guards at system boundaries and parse external data there.
- Matt Pocock: application code needs fewer advanced generics than library code ([interview](https://www.totaltypescript.com/bonuses/typescript-expert-interviews/exploring-generics-in-react-query-with-tanner-linsley)), and `type` vs `interface` is a small difference ([article](https://www.totaltypescript.com/type-vs-interface-which-should-you-use)).
- Theo Browne, [TypeScript Slows You Down](https://www.youtube.com/watch?v=Xl02L1jy53c): "types should be as close to the data they represent as possible."

**Reversibility sets the bar.**

- Jeff Bezos, [2015 shareholder letter](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm): one-way and two-way doors, and the cost of using the heavy process for every decision.
- AWS Builders' Library, [Ensuring rollback safety during deployments](https://builder.aws.com/content/3F04j2yRAAMBuPSPs50xwXZqg01/ensuring-rollback-safety-during-deployments): split changes that are not safe to undo into prepare and activate.

**Better, not perfect.**

- Google, [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html): approve a change that "definitely improves the overall code health … even if the CL isn't perfect"; prefix polish with `Nit:`.
- Basecamp, [Shape Up](https://basecamp.com/shapeup/3.5-chapter-14): "compare down to baseline," not up to the ideal.
- 37signals, [Seven shipping principles](https://37signals.com/podcast/seven-shipping-principles/): ship to the appetite, and "we only ship good work."

**Proof over polish.**

- pstack's prove-it-works: verify against the real artifact before declaring done.
- Charity Majors, [I test in production](https://increment.com/testing/i-test-in-production/): no change merges unless its author can answer "How will I know if this breaks?"
- Matt Pocock, [skills](https://github.com/mattpocock/skills): "The rate of feedback is your speed limit," quoting The Pragmatic Programmer.

**Small batches.**

- DORA, [metrics](https://dora.dev/guides/dora-metrics/) and [working in small batches](https://dora.dev/capabilities/working-in-small-batches/): speed and stability are not a tradeoff, and a batch that takes more than a week is too big.
- Kent Beck, [Tidy First?](https://www.oreilly.com/library/view/tidy-first/9781098151232/ch16.html): keep tidyings in their own changes, separate from behavior changes.

## Where they disagree

**How much design pays back.**

- John Ousterhout ([A Philosophy of Software Design, ch. 3](https://yingang.github.io/aposd-zh/en/ch03.html)) warns against tactical programming.
- Martin Fowler's [Design Stamina Hypothesis](https://martinfowler.com/bliki/DesignStaminaHypothesis.html) puts the payoff line at "weeks not months."
- Andrej Karpathy's [vibe coding post](https://x.com/karpathy/status/1886192184808149383) (Feb 2, 2025) skips design and review entirely: "I 'Accept All' always, I don't read the diffs anymore." He scopes it himself: "It's not too bad for throwaway weekend projects." The default tiers take that scope literally: vibe coding fits T4, and design effort goes to long-lived T1 and T2 flows.

**How much debt is fine.**

- Fowler's [Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html) accepts prudent, deliberate debt taken to reach a release.
- Google SRE [error budgets](https://sre.google/sre-book/embracing-risk/) make the acceptable unreliability explicit and halt releases once it is spent.

## Why the verdict is binary

- Rating scales pull answers toward the middle (central tendency bias): raters avoid the ends because of how the question is framed, not what they think ([overview](https://www.statisticshowto.com/central-tendency-bias/)).
- Jon Krosnick's satisficing research: the neutral or "no opinion" option is the low-effort answer, and leaving it out did not lower the quality of measured attitudes ([Handbook of Survey Research](https://web.stanford.edu/dept/communication/faculty/krosnick/docs/2010/2010%20Handbook%20of%20Survey%20Research.pdf)).
- Netflix replaced five stars with thumbs up or down in 2017 and rating activity rose 200% ([Netflix](https://about.netflix.com/en/news/goodbye-stars-hello-thumbs)). Derek Sivers' [Hell yeah or no](https://sive.rs/2023-11-tribe) applies the same idea to decisions.
- The counterpoint: forced choice can push someone genuinely unsure into a false answer ([Sturgis et al.](https://eprints.soton.ac.uk/197457/1/SMRrevised4.pdf)). `shippable` handles that by turning uncertainty into an unverified item with a check to run, not into a middle verdict.

## Judges, rounds, and expiry

- The author does not judge its own work, and a verdict expires when the patch changes: pstack's [shipping playbook](https://github.com/cursor/plugins/tree/main/pstack/skills/poteto-mode/playbooks).
- A judge from another model family: pstack's [arena](https://github.com/cursor/plugins/tree/main/pstack/skills/arena); [Replacing Judges with Juries](https://arxiv.org/abs/2404.18796) found a panel of diverse models less biased than one large judge; [Bias in the Loop](https://arxiv.org/pdf/2604.16790) found code judges favor verbose output and their own model family; Karpathy's [llm-council](https://github.com/karpathy/llm-council) anonymizes answers before peers rank them.
- Each claimed issue re-checked by a separate validator: Anthropic's [code-review plugin](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-review/commands/code-review.md).
- A cap on review rounds and an incident ledger: [Waza check](https://github.com/tw93/Waza/blob/main/skills/check/SKILL.md) and [depth-lock](https://github.com/malakhov-dmitrii/depth-lock/blob/main/SKILL.md).
- A per-repository review policy file: Compound Engineering's [ce-code-review](https://github.com/EveryInc/compound-engineering-plugin/tree/main/skills/ce-code-review). `shippable` keeps its profile personal and untracked instead, so it never changes other developers' agents.

Several of these skills keep a middle verdict ("Ready with fixes", "SHIP WITH FOLLOW-UPS", `PASS+NOTES`). `shippable` drops it on purpose.

## Why the bar is per project

The tiers are defaults. A repository's own fix history decides which defect classes reach production there, which is why `survey` mines it rather than applying a generic checklist.
