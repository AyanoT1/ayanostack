# Babysit a Bitbucket PR

Read the current head, diff, build statuses, mergeability, and review threads through `twg`. From the correctly configured repository:

```sh
twg bb prs get "$pr" --statuses
twg bb prs diff "$pr"
twg bb prs mergeability "$pr"
twg bb prs comment query "$pr"
```

Check pagination in the installed CLI and use the PR's full thread state where available. Match statuses by source commit. An empty build list, a status for an older commit, and an unknown policy are each unverified. For a failed pipeline, use `twg bb pipeline get --help` to locate the build by its status URL and read failed steps and test results. Use the installed CLI's supported rerun or reply operation when the caller authorized it.

Use the host's PR watcher if it supports this Bitbucket repository. Otherwise discover the installed `twg` or CI watch operation and use it in the host's supported background mode. If the project has a watcher in `AGENTS.md`, use that. If only snapshots are available, report the latest status and the missing watch capability. Keep organizational build keys, bot identities, and Jira rules in the project’s own instructions.
