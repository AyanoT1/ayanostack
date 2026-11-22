# Open a Bitbucket PR

Use `twg` for Bitbucket and Jira. Use the branch policy and PR checklist in the project's `AGENTS.md` to determine the remote, source, destination, required checks, and how to link the Jira ticket. Verify which Bitbucket repository `twg` will target.

Use `twg bb prs query --help` to filter for an existing open PR on the intended source branch. If a matching PR exists, update it with the edit operation offered by the installed version. After pushing the authorized source branch, a new PR can be created with `twg bb prs create --title "$title" --source "$head" --dest "$base" --description-file "$body_file"`. Verify the returned URL and SHA before handing off to babysit.
