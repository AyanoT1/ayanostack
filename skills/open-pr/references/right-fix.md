# Right fix

Separate the observed symptom, the proposed diagnosis, and the outcome the change needs to deliver. Follow the real path from the entry point to its first wrong result. Use a regression test or a focused run when the behavior can be reproduced safely. Treat previous tickets and explanations as leads to test.

When the change affects several modules, trace who owns each piece of state and what callers depend on. Compare two shapes when they would lead to materially different ownership, contracts, or migration costs. If several workarounds protect the same assumption, test that assumption before adding another.

Compare the diff with the smallest fix that covers supported callers and each acceptance criterion. Report which behavior is verified, what remains uncertain, and whether the diff needs a smaller change or a correction at the root. Use a base-only independent read when the diagnosis is disputed and the user or project authorizes it.
