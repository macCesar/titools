# Status — 2026-09-08

**Phase:** v4.21.0 shipped; live and maintained
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`) — added `ti-reuse-first`, then measured and raised its reachability
**Deployed:** `@maccesar/titools@4.21.0` on npm (verified with `npm view @maccesar/titools version` after the run), tag `v4.21.0` → `a8b25d8`, GitHub Release created, and `plugin.json` at `4.21.0` on `main`.
**Branch:** `main`, aligned with `origin/main`, nothing unpushed.
**Sibling:** `../aiskills` — `git diff --stat v4.20.0..v4.21.0 -- lib/ bin/` is one line in `lib/config.js`, the `SKILLS` entry for the new skill. That is payload, not shared machinery, so no port is required.

## Where things stand

`ti-reuse-first` ships as the eleventh skill and the first one in `SKILLS`. It applies a search order with early exit before anything new exists in a project — does this need to exist, is it already in `app/`, does a `Ti.*` API or the platform cover it, does an installed module do it, can it be one line, and only then the smallest thing that works. Five references carry the detail, each with its counter-case, and `/ti-audit` runs it as step 1.

Its reachability was the actual work of this session, and it was measured rather than argued. See `decisions.md` 2026-09-08 for the numbers and the method. Three of the five suspected causes in the plan turned out to be wrong; only the measurement separated them.

`references/alloy-reuse.md` carries a third worked example, taken from a real failure in a sibling project the same day: the correct template was chosen and then "improved" with a `touchEnabled` toggle and an `animating` lock nobody asked for, which deadlocked when the open callback never fired. The rule it states — reuse means copying the behavior, not copying it and defending it against a failure nobody has observed — is the one the other two worked examples did not cover, because this failure appears *after* the search has already succeeded.

## In flight

- Nothing shipping.

## Requirements

- R3 is satisfied: npm `4.21.0`, tag `v4.21.0`, and `plugin.json` on `main` agree, and `publish.yml` re-checked that agreement itself before publishing.
- R7–R9 remain satisfied: frontmatter validates and the suite is green. The 1024-character description cap in `test/manifest.test.js` did real work this session — it rejected a rewritten description of 1403 characters before it could ship.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

Two open items, in order of how much they cost to leave alone:

1. **The SessionStart hook does not reach npm-only installs.** `hooks/hooks.json` declares it with `${CLAUDE_PLUGIN_ROOT}`, so the marketplace plugin registers it and `titools install` does not — it writes only the `titools auto-update --silent` hook. Measured on the maintainer's machine: `~/.claude/settings.json` has no `session-start.sh` entry and `~/.claude/plugins/cache/` has no `maccesar-titools`, so the Titanium project-detection message has never run there. Deciding whether the CLI should register it is a design question, not a bug fix: it means the CLI writing into the user's global settings, which it has deliberately never done except for auto-update. Until it is decided, anything that must reach both channels belongs in a skill description or body, not in the hook. Recorded as a trap in `context.md`.

2. **`skills/purgetss/references/cli-commands.md` is still at 815 lines** against the auditor's 800-line cap, unchanged from the previous session. The measured split point is unchanged too: of the 21 anchor links pointing into it from 11 other files, 20 target asset commands, so a `cli-commands-assets.md` would leave the utility-class lifecycle behind and require repointing ~20 anchors.

## Verified vs. assumed

- Verified now: 358/358 tests pass across 31 suites.
- Verified now: `main` matches `origin/main` with zero unpushed commits; `v4.21.0` resolves to `a8b25d8`.
- Verified now: publish workflow run `34275730808` concluded `success`, including its own tag-versus-version-files guard, and `npm view` reports `4.21.0`.
- Verified now: the dev-mode symlinks exist and resolve into this checkout — `~/.agents/skills/ti-reuse-first` → `skills/ti-reuse-first`, mirrored at `~/.claude/skills/`. They did not exist before this session, which is why the skill was unreachable from any other project even though its files had been written the day before.
- Verified during the measurement: a positive control ran before any conclusion and fired the correct skill 2/2. Without it no reading would have been trustworthy.
- **Assumed, not verified:** that the fixture's behavior predicts a real project. The field test — asking for the work in a real Titanium project, without naming the skill — has not been run. Nothing in this release rests on it, but nothing confirms it either.
- **Assumed, not verified:** the marketplace-channel mechanics described in `context.md` were established in the sibling repo and have still not been re-confirmed against `maccesar-titools` on this machine, since no marketplace cache for it exists here.

## Known pending

- A local Claude Code marketplace installation would need `/plugin marketplace update maccesar-titools` followed by `/reload-plugins`. Neither published channel is blocked by it, and on this machine there is no such installation to update.
