# AITA on GitHub

Use the host's issue tools (`list_issues`, `read_issue`) when available in T3 Code, or `gh` in a CLI session. Follow the repositories and project boards declared in `AGENTS.md`.

Your open work:

```sh
gh search issues --assignee @me --state open --limit 100 --json repository,number,title,updatedAt,url
gh search prs --author @me --state open --json repository,number,title,url
gh search prs --review-requested @me --state open --json repository,number,title,author,url
```

For each of your issues (`OWNER/REPO` and `42` are placeholders), the issues it blocks through GitHub issue dependencies:

```sh
gh api repos/OWNER/REPO/issues/42/dependencies/blocking
```

If that endpoint is unavailable, read the issue's `blocking` relationship with `gh api graphql` instead. Then check:

- **Sub-issues.** An open parent issue owned by someone else that lists yours as a sub-issue.
- **Mentions without a link.** `gh search issues "OWNER/REPO#42" --state open` and issues whose body says "depends on #42" or "blocked by #42". Read each hit to confirm.
- **Questions to you.** Recent comments that mention you on the blocked issues, with no reply from you.

For each blocked issue, fetch assignees, labels, milestone and its due date, project status, and last update.
