# Open a GitHub PR

Use the GitHub PR tools provided by the host when required, or `gh` in a CLI workflow. Verify the authenticated repository and the actual head and base. Look for an existing open PR with `gh pr list --head "$source_branch" --state open` or the equivalent host tool. Pass the unqualified branch name and verify the head repository for forks. Update the existing PR in place.

For a new PR, push the authorized head and use the host's create operation or `gh pr create --base "$base" --head "$head" --title "$title" --body-file "$body_file"`. Set draft status when the caller requests it. Use GitHub issue links if the project uses them. Verify the returned URL and SHA before handing off to babysit.
