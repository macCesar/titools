# Status — 2026-09-11

**Phase:** v4.22.0 shipped; live and maintained.
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`). This note was written after the release, which is the only point at which its facts exist.
**Deployed:** `@maccesar/titools@4.22.0` on npm — published by `publish.yml` run [34665563869](https://github.com/macCesar/titools/actions/runs/34665563869), which concluded `success` after re-checking the tag against both version files, running `npm ci && npm test`, and publishing over OIDC. `npm view` reports `4.22.0`. Tag `v4.22.0` → `0ecedaa`, GitHub release created at <https://github.com/macCesar/titools/releases/tag/v4.22.0>. `package.json` and `.claude-plugin/plugin.json` both read `4.22.0`.
**Branch:** `main`, aligned with `origin/main`, working tree clean.
**Sibling:** `../aiskills` is aligned with its own `origin/main` at `2b8058f docs(project): session close for v1.24.0`. No shared machinery moved here — `git diff f1308a3..HEAD -- lib/ bin/ hooks/` is empty — so no port is owed in either direction.

## Where things stand

v4.22.0 ships one new reference and two corrections to it, all three driven by field findings rather than by reading.

`skills/ti-expert/references/push-notifications.md` maps the four paths an FCM message can reach an Android app through, against the one the module's own example documents: `didReceiveMessage` while live, the same callback on a cold start, the launcher Intent's extras, and `didOpenNotification` where the module fires it. It covers what a top-level `notification` block costs, why a tap does not fire `didReceiveMessage`, the `singleTop` + `newintent` case that appears in no documentation and opens a panel twice on Android 10 but not on Android 15, the two splash screens a cold start goes through, the HTTP v1 payload with its PHP sender, and why every value inside `data` must be a string. It closes with a symptom-to-cause table, and iOS gets its own section because it has a single path that works in every state — the asymmetry behind "it works on my iPhone". `SKILL.md` routes to it twice and its `description` names push notifications, so the skill is reachable from a prompt that never says `ti-expert`.

`f19a014` then fixed that file's own `didOpenNotification` example: the payload sits under `message.data`, where the module has nested it since 3.6.0 and where `didReceiveMessage` already put it, so one accessor now covers both a tap and an arrival.

`cc1fd3c` corrected the Android 12+ splash section of `ti-ui/references/icons-and-splash-screens.md`. Its companion style inherited from `Theme.MaterialComponents.NoActionBar`, which detaches from the chain Titanium generates — `Theme.Titanium` → `Base.Theme.Titanium.Splash` → `Theme.AppDerived` → the app's own theme — and drops the application theme with it. The correction names the three attributes one color has to reach, including the easily missed `colorBackground`, and the 160 dp white circle a flat `windowBackground` removes along with the icon. It lives under `## Community-Discovered Patterns` because `ti-ui` is audited against official documentation and R6 makes those sections the only ones an audit does not overwrite.

The release commit also repointed the README's skill-routing example for "Implement push notifications" at `ti-expert` alongside `ti-howtos`, since that is where the mechanics reference now lives.

## In flight

- Nothing. The release is complete through both channels that a release can reach on its own.

## Requirements

- R3 (version files agree) is satisfied at `4.22.0` across npm, `package.json` and `plugin.json`, and `publish.yml` re-checked that agreement itself before publishing.
- R6 (protected sections survive audits) was exercised deliberately by `cc1fd3c` — the first time the rule decided *where* new content went rather than merely preserving what was already there.
- R7–R9 remain satisfied: frontmatter validates, anchors resolve, the suite is green.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **`EXAMPLE-PROMPTS.md` still has no prompt routed at the new reference.** Line 535 carries "How do I add Android push notifications using Firebase in a Titanium app?", written before this work and for a different skill. Where it routes now that `ti-expert`'s description claims the topic has never been checked, and the repo's own convention asks for at least two example prompts per new surface. This was deliberately left out of the release as content rather than release documentation.
2. **The SessionStart hook still does not reach npm-only installs.** Re-measured today: `~/.claude/settings.json` has no `session-start.sh` entry, and `~/.claude/plugins/cache/` holds four plugins, none of them `maccesar-titools`, so the Titanium project-detection message has still never run on this machine. The trap is written up in `context.md` § Traps. It remains a design question — whether the CLI should write into the user's global settings, which it has deliberately never done except for auto-update — not a bug fix.
3. **`skills/purgetss/references/cli-commands.md` is still 815 lines** against the auditor's 800-line cap. Re-measured today. The anchor counts behind the proposed `cli-commands-assets.md` split (21 links, 15 with anchors, 13 of those targeting asset commands) come from an earlier draft and were not re-run today.

## Verified vs. assumed

- **Verified now:** `npm view @maccesar/titools version` → `4.22.0`; both version files read `4.22.0`; tag `v4.22.0` resolves to `0ecedaa`.
- **Verified now:** publish workflow run `34665563869` concluded `success`, including its own tag-versus-version-files guard, `npm ci`, `npm test` and the OIDC publish.
- **Verified now:** 359/359 tests pass across 31 suites, run locally before the release commit and again inside the workflow.
- **Verified now:** `main` is aligned with `origin/main` and the working tree is clean.
- **Verified now:** `package.json` → `files` is `bin/ lib/ skills/ agents/ commands/ AGENTS-VERCEL-RESEARCH.md` and excludes `docs/`, so this note lands outside the published tarball — checked rather than assumed, since the note necessarily commits after the tag.
- **Verified now:** no shared machinery moved since `f1308a3`, which makes the no-port conclusion for `aiskills` a measurement rather than a guess.
- **Assumed, not verified:** the technical claims inside both references. `cc1fd3c` states its own evidence — the generated `values*/ti_styles.xml` and `res/values-v31/` inside `titanium-13.4.1.aar` — and `push-notifications.md` documents device-by-device testing on an OPPO CPH2639, an Android 10 emulator and an iPad. None of that testimony was re-run from here.
- **Assumed, not verified:** the marketplace-channel mechanics in `context.md` were established in the sibling repo and still have not been re-confirmed against `maccesar-titools`; there is no cache for it on this machine to inspect.

## Known pending

- **The maintainer's own post-release steps are not done by the release.** npm is served; a local Claude Code marketplace installation would still need `/plugin marketplace update maccesar-titools` then `/reload-plugins`, and there is no such installation on this machine. The CLI here is `npm link`-ed to this checkout, so its skills are already current.
- Users on the marketplace channel with auto-update off reach `4.22.0` only when they refresh the marketplace by hand; third-party marketplaces do not auto-update by default.
