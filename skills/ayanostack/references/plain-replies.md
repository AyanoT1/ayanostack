# Plain replies

Every AyanoStack skill ends with something a person reads: a reply, a report, a PR description, a tracker comment, or an HTML page. Write it so a busy teammate who missed the work can act on it from that text alone.

The rules follow ASD-STE100 Simplified Technical English, as Matt Pocock's [wait-what](https://github.com/mattpocock/skills/blob/main/skills/productivity/wait-what/SKILL.md) asks for, and the plain-words advice in his [writing-for-agents](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md).

## Rules

- **Answer first.** The first line is the verdict, result, or decision the reader needs. Details follow.
- **Short sentences.** One idea per sentence, about 20 words at most. Use active voice: "the test fails", not "a failure was observed".
- **Common words.** Use the word a teammate would say out loud: "hard to undo", "checked it in the running app", "what slows it down". When a skill's own label must appear (a tier, a verdict, a mode, a class like `easy-fix`), give its plain meaning the first time: "T1 (numbers people act on)".
- **What changed for the reader.** Say what is different now, not the steps you took. Give a command, hash, or file path where the reader needs it to act or to check.
- **Concrete.** Give the input, the wrong result, and each number with its unit: "January shows 0 kWh when a meter has no reading", not "silent default in aggregation".
- **Lists for parallel items.** One item per line, most important first. Use prose for a reason or a story.
- **Name what you don't know.** Write "unknown", "not checked", or "my guess" next to the claim it covers.
- **The user's language.** Reply in the language the user writes in. Keep code, commands, and product names as they are.

## Before and after

| Instead of | Write |
| --- | --- |
| Two-way door, T3 maintenance, all must-haves met. | Easy to undo with a redeploy. Routine screen (T3). Every check passes. |
| Load-bearing invariant unproven; coverage gap on teardown. | I could not prove the one fact that makes this safe: that the cache is empty when the page closes. I did not test closing the page. |
| Limiter unidentified, verdict inconclusive. | I don't know yet what slows it down, so I can't say the change made it faster. |
| Holds: 2 refs, 1 worktree (ownership uncertain). | I kept two branches and one worktree because I can't tell who owns them. |
