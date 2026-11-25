---
name: install
description: Set up or update AyanoStack across Claude Code, Codex, Antigravity, and T3 Code. Runs in order, detects what changed upstream since the last install, and only does the steps those changes need, from linking new skills to a project's personal settings or ship-bar profile. Never writes a file a repository tracks or could commit. Use for /install, first-time setup, or after pulling AyanoStack.
---

<!-- Model role lines inspired by pstack's setup-pstack by Lauren Tan (MIT). See the bundled LICENSE. https://github.com/cursor/plugins/blob/7a583913eb1b8d1a0ee76753d1a2cf072e7b54f9/pstack/skills/setup-pstack/SKILL.md -->

# Install

Every file this skill writes is personal: provider skill roots, personal global instruction files, and files outside git or ignored by it. It never edits a file a repository tracks or could commit, such as a repo's `AGENTS.md`, `CLAUDE.md`, rules folders, or `.gitignore`. [Personal configuration](references/personal-config.md) lists where each thing goes and the check to run before any write.

Run the steps in order. Each step first checks whether it has anything to do and says "nothing to do" when it does not. A first install runs every step; an update runs only the steps the upstream changes need.

Run from the AyanoStack repo for the host steps (1 to 3). Run from a project directory, or name one, for the project steps (4 to 7). With no project named inside the AyanoStack repo, stop after step 3.

## 1. Sync AyanoStack

1. In the AyanoStack checkout, run `git fetch` and compare `HEAD` with its upstream (`git rev-list --left-right --count HEAD...@{u}`).
2. **Behind:** show the incoming commits and the files they touch under `skills/`, then `git pull --ff-only`. Do not pull over uncommitted changes or a diverged branch; report it and continue with the local version.
3. **Ahead or local changes:** the local version is what gets installed. Say so.

## 2. Find what changed

The **last-installed revision** is the `ayanostack:` stamp in the project's personal settings file (see steps 5 and 7). With no stamp, treat it as a first install of the project section: check every section but keep what is already written.

From the stamp to `HEAD`, list with `git diff --name-status <stamp>..HEAD -- skills/`:

- **New skills** (a new `skills/<name>/SKILL.md`).
- **Removed or renamed skills.**
- **Changed template sections** in [the project template](references/agents-template.md). Each section names the skills that read it.

Changes to a skill's body alone need no install step: providers link to the checkout, so a pull already updates them. Use this list to skip the steps below that have nothing to do.

## 3. Link skills on this host

Skip when no skill was added or removed and the check is clean.

- **Claude Code.** `$HOME/.claude/skills`
- **Codex.** `$HOME/.codex/skills`
- **Antigravity.** `$HOME/.gemini/config/skills` (in T3 Code, verify that `$HOME/.t3/userdata/providers/antigravity/*/config/skills` points to `$HOME/.gemini/config/skills`)

1. Run [scripts/install.sh](scripts/install.sh) `--all --check`. It reports `missing`, `diff` (a non-symlink or a link elsewhere), and `stale` (a link into AyanoStack whose skill no longer exists).
2. Run `scripts/install.sh --all` to link the missing ones. Never replace a non-symlink directory without comparing it first or confirming `--force`. Use `--copy` only when requested.
3. Remove stale links with `--prune` after showing them.
4. Check the CLIs the declared profiles need: `gh` (`github`), `twg` (`bitbucket-jira`), `node`/`npm` (`press-release`, `scripts/check-skills.mjs`). Report missing tools without installing them.

## 4. Point every provider at the personal settings

Skip when the pointer is already in all three files.

Append the pointer block from [personal configuration](references/personal-config.md) to `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, and `~/.gemini/GEMINI.md`, creating them if missing. Never add `@AGENTS.md`, imports, or AyanoStack lines to a repository's `CLAUDE.md`, `AGENTS.md`, or rules folder, even when Claude Code would otherwise miss the settings: the pointer is what makes them visible.

## 5. Fill the project's AyanoStack settings

Find the settings file: an existing `.ayanostack/AGENTS.md` at the repo root, or an existing `AGENTS.md` in a parent directory outside any git repository. With neither, ask which of the two the user wants; the workspace file suits several repos that share boards and rules. Run [personal-path.sh](scripts/personal-path.sh) on it before writing. A refused path is never written.

Read the repo's own `AGENTS.md` and `CLAUDE.md` only as input, together with `git remote -v`, the default branch, and manifests (`package.json`, `Makefile`, `pyproject.toml`), to infer build, lint, test, and dev-server commands. Then, for each section of [the project template](references/agents-template.md):

- **Present and the template section unchanged since the stamp:** skip it.
- **Missing, or the template section changed:** merge only that section. Ask only for values that cannot be inferred: ticket sources for [triage](../triage/SKILL.md), the delivery ceiling, tracker writes for [assume-task](../assume-task/SKILL.md), and model roles for [interrogate](../interrogate/SKILL.md) and [swarm](../swarm/SKILL.md). Offer only models confirmed available on this host, and include one from another model family for the `interrogate` council.
- **A removed skill:** point out its lines and remove them after the user confirms.

Preserve unrelated instructions. Never write tokens, credentials, or local machine paths.

## 6. Set up what new skills need in the project

Run only for skills new since the stamp, or whose setup is missing:

- **[shippable](../shippable/SKILL.md):** each repo in scope needs a personal ship-bar profile at `.ayanostack/ship-bar.md`. Make sure the user's global gitignore (`git config --global core.excludesFile`) lists `.ayanostack/`, adding it there if missing, and confirm with [personal-path.sh](scripts/personal-path.sh). With no profile, offer `shippable` in `survey` mode; it runs long and reads the history, so ask first.
- **[aita](../aita/SKILL.md) and [triage](../triage/SKILL.md):** the ticket sources in step 5.
- Any other new skill: check its `SKILL.md` for what it reads from `AGENTS.md` and fill only that, in the personal settings file.

## 7. Stamp and report

Write or update one line at the top of the AyanoStack section in the personal settings file: `<!-- ayanostack: <short HEAD> <YYYY-MM-DD> -->`. The next install diffs from it.

**Reply:** one line per step (done, nothing to do, or blocked and why), the skills added or removed, provider link status, sections written, and anything the user still has to do (a placeholder to fill, a profile to survey, a CLI to install).
