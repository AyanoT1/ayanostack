# Babysit a GitHub PR

In T3 Code, use the PR tools for the snapshot, threads, logs, and authorized reruns, following the host's watch and wake instructions. Handle existing comments before registering a watch for new events. Keep the watch on the target PR and recheck the head on each wake. Follow the host's watch cleanup rules when handing back.

For a standalone `gh` session, inspect metadata and required checks with:

```sh
gh pr view "$pr" --json url,headRefOid,baseRefName,isDraft,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup
gh pr checks "$pr" --required
```

Use the host thread tool or GitHub's paginated GraphQL `reviewThreads` for resolution and inline context. `gh pr view` comments alone do not show thread resolution. Wait with the supported GitHub event listener or `gh pr checks "$pr" --required --watch` where allowed by the host. Review and approval are separate from CI; refresh the snapshot before reporting readiness. Read [the GitHub CLI checks reference](https://cli.github.com/manual/gh_pr_checks) for check buckets and pending exit status.
