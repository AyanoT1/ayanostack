# Personal configuration

AyanoStack never writes a file that is shared through a repository. Shared agent files (a repo's `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.claude/`, `.cursor/`, `.codex/`, `.github/`, any `.gitignore`) load into every teammate's agent, so a line added there changes how other people's agents behave and collides with the skills they installed.

## Where things go

| What | Where |
| --- | --- |
| Skills | Each provider's user skills root (step 3 of install). |
| Pointer that tells each provider where project settings live | The provider's personal global instructions: `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, `~/.gemini/GEMINI.md`. Append; never replace what is there. |
| A project's AyanoStack settings (the template sections) | An `AGENTS.md` in a directory above the repos that is not inside any git repository (a workspace folder), or `.ayanostack/AGENTS.md` at the repo root. |
| Per-repo files skills generate (ship-bar profiles, ledgers) | `.ayanostack/` at the repo root. |

`.ayanostack/` is ignored through the user's global gitignore (`git config --global core.excludesFile`), never through the repo's `.gitignore`.

Before writing any of these, run [personal-path.sh](../scripts/personal-path.sh) on the path. It passes a file outside any git repository, or one inside a repository that is ignored and untracked, and refuses everything else. A refused path is never written, even with the user's go-ahead in the same breath: report it and propose a personal location instead.

## The pointer

Append this block, once, to each provider's personal global instructions file, creating the file if it does not exist:

```markdown
## AyanoStack project settings

When an AyanoStack skill says "the project's AGENTS.md", read the AyanoStack section from the nearest of these, not from a file tracked by the repository: `.ayanostack/AGENTS.md` at the repository root, or an `AGENTS.md` in a parent directory that is outside any git repository. Never write AyanoStack settings or generated files into a tracked or shareable file.
```
