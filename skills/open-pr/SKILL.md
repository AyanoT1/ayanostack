---
name: open-pr
description: Prepare, open, or update a pull request using the project's PR checklist. Also use for a prepare-only pass before opening a PR.
---

<!-- Inspired by pstack's opening-a-pr playbook and fix-root-causes principle by Lauren Tan (MIT). See the bundled LICENSE. https://github.com/cursor/plugins/blob/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack/skills/poteto-mode/playbooks/opening-a-pr.md -->

# Open PR

1. Read the project’s `AGENTS.md` and its PR checklist. Use the declared profile, `github` or `bitbucket-jira`. If it is missing or conflicts with the requested destination, ask before publishing. Confirm the repository, head, destination, and work item from the request and existing PR. Use the actual destination as the review base.
2. Run [pre-PR](references/pre-pr.md) on the intended diff. Keep all changes within that scope. Run the project’s build, tests, lint, and any other required checks against the final diff. Publish only on a **Ship** verdict from pre-PR; on **Not yet**, stop and report the blockers unless the user explicitly overrides. A prepare-only request ends with the verdict, the check results, and any remaining blockers.
3. With authorization to publish, read the matching [GitHub](references/github.md) or [Bitbucket + Jira](references/bitbucket-jira.md) reference. Stage and commit any intended changes after reviewing the staged diff for credentials and private material. Check the outgoing commits for the same, then push and create or update the PR. On a retry, look for the existing PR before creating one. Include what the change does for users, how you checked it, the ship verdict and tier, and the work item when there is one. Write the title and body as [plain replies](../ayanostack/references/plain-replies.md) say: reviewers read it cold.
4. Link the PR and run [gc](../gc/SKILL.md) in audit mode for artifacts from this task. Hold the live PR branch and any active worktree. Then hand the PR and reviewed head to [babysit-pr](../babysit-pr/SKILL.md) for status and monitoring. Carry through any restrictions on writes, replies, or reruns. The final result names the PR and its verification state.
