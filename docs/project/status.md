# Status — 2026-09-11

**Phase:** v4.21.0 is live; **three** finished commits sit on `main`, unreleased and unpushed.
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`). This note replaces an uncommitted draft dated 2026-09-10 that described only `1e4f7f0`; two more commits landed today, so that draft was already stale and never entered git history. Everything below was re-measured today rather than carried over — where a figure is inherited and was not re-run, it says so.
**Deployed:** `@maccesar/titools@4.21.0` on npm (`npm view` confirms `4.21.0` today). `package.json` and `.claude-plugin/plugin.json` both read `4.21.0`. **None of the three commits is in any of that** — they are newer than the tag and unpushed, so they reach no user through either channel.
**Branch:** `main`, **ahead of `origin/main` by 3** (`1e4f7f0`, `cc1fd3c`, `f19a014`), working tree otherwise clean.
**Sibling:** `../aiskills` is aligned with `origin/main` at `2b8058f docs(project): session close for v1.24.0`. No shared machinery moved here — `git diff f1308a3..HEAD -- lib/ bin/ hooks/` is empty — so no port is owed in either direction.

## Where things stand

The three unpushed commits are all skill content, and the two newest are corrections to the first, both driven by field findings rather than by reading.

`1e4f7f0` added `skills/ti-expert/references/push-notifications.md` — 306 lines mapping the four doors an FCM push can arrive through on Android against the one door the module's own example documents: the cost of a top-level `notification` block, why a tap does not fire `didReceiveMessage`, the `singleTop` + `newintent` case that appears in no documentation, the two splash screens, the HTTP v1 payload with its PHP, and why every value inside `data` must be a string. It closes with a symptom-to-cause table, and iOS gets its own section because it has one door that works in every state — the asymmetry that makes "it works on my iPhone" a useless bug report. `SKILL.md` wires it in twice (routing table row plus reference list) and its `description` names push notifications so the skill is reachable from a prompt that never says `ti-expert`.

`f19a014` fixes the `didOpenNotification` example in that file: the module has nested the payload under `data` since 3.6.0, same as `didReceiveMessage`, so one accessor now covers both a tap and an arrival. How to read it on a pre-3.6.0 module is noted in place.

`cc1fd3c` adds 35 lines to `skills/ti-ui/references/icons-and-splash-screens.md` on the Android 12+ splash: `Theme.Titanium` → `Base.Theme.Titanium.Splash` → `Theme.AppDerived` → the app's own theme, which makes an `<application>` theme an *ancestor* and therefore unable to set `windowBackground` or `windowSplashScreenBackground`. It names the three attributes one color has to reach, the 160 dp white circle a flat `windowBackground` destroys, and corrects the section's troubleshooting claim that background color is the only customizable part. It lives under `## Community-Discovered Patterns` rather than in the body because that skill is audited against official documentation and R6 protects those sections from deletion — the body would have been overwritten on the next audit.

## In flight

- Nothing half-done. Three complete commits that have not left this machine.

## Requirements

- R3 (version files agree) holds at `4.21.0` across npm, `package.json` and `plugin.json` — but that agreement now describes a release three commits behind `main`. Publishing means a fresh bump of both files.
- R6 (protected sections survive audits) was exercised deliberately by `cc1fd3c`, which is the first time the rule decided *where* content went rather than merely preserving it.
- R7–R9 remain satisfied: frontmatter validates, anchors resolve, the suite is green.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **Decide whether the three commits ship.** Right now they reach nobody: npm serves `4.21.0`, which is older, and the marketplace tracks default-branch HEAD, which is `origin/main`, which lacks all three. Pushing alone would reach marketplace installs and leave npm users behind — the channels only converge through a tagged release. `/release` is the path and it is César's call to invoke. What it now entails: `0f054cc` in the sibling gave `release` a Step 1.11 that detects `docs/project/status.md` (this repo has one), an announcement line in the Step 4 confirmation, and a Phase 6 that rewrites this file with the release facts and commits `docs(project): …` under the permission Step 4 already collected. So this note is expected to be replaced by that run, not carried through it.
2. **`EXAMPLE-PROMPTS.md` still has no prompt routed at the push-notification reference.** Line 535 carries "How do I add Android push notifications using Firebase in a Titanium app?", written before this work and for a different skill. Where it routes now that `ti-expert`'s description claims the topic has never been checked, and the repo's own convention says a new skill surface needs at least two example prompts.
3. **The SessionStart hook still does not reach npm-only installs.** Re-measured today: `~/.claude/settings.json` has no `session-start.sh` entry, and `~/.claude/plugins/cache/` holds four plugins, none of them `maccesar-titools`, so the Titanium project-detection message has still never run on this machine. The trap is written up in `context.md` § Traps. It remains a design question — whether the CLI should write into the user's global settings, which it has deliberately never done except for auto-update — not a bug fix.
4. **`skills/purgetss/references/cli-commands.md` is still 815 lines** against the auditor's 800-line cap. Re-measured today. The anchor counts behind the proposed `cli-commands-assets.md` split (21 links, 15 with anchors, 13 of those targeting asset commands) come from yesterday's draft and were **not** re-run today.

## Verified vs. assumed

- **Verified now:** 359/359 tests pass across 31 suites. Unchanged from the previous count because `cc1fd3c` edited an existing file rather than adding one — `test/anchors.test.js` emits one test per `.md` file, so only a new file moves that number.
- **Verified now:** `main` is ahead of `origin/main` by exactly three commits; HEAD is `f19a014`.
- **Verified now:** `npm view @maccesar/titools version` → `4.21.0`; both version files read `4.21.0`.
- **Verified now:** the cross-skill link `cc1fd3c` adds resolves — `skills/purgetss/references/launch-background.md` exists, and the anchors suite is green.
- **Verified now:** `skills/purgetss/references/cli-commands.md` is 815 lines.
- **Verified now:** no shared machinery moved since `f1308a3`, which makes the no-port conclusion for `aiskills` a measurement rather than a guess.
- **Verified now:** `ti-expert`'s description is 961 characters, under the 1024-character cap `test/manifest.test.js` enforces, and neither of today's two commits touched `SKILL.md`. Yesterday's draft recorded 959 for the same unchanged text; the gap is how the string was counted, not an edit.
- **Assumed, not verified:** the technical claims inside both references. `cc1fd3c` states its own evidence — the generated `values*/ti_styles.xml` and `res/values-v31/` inside `titanium-13.4.1.aar` — and `push-notifications.md` documents device-by-device testing on an OPPO CPH2639, an Android 10 emulator and an iPad. None of that testimony was re-run from here.
- **Assumed, not verified:** the marketplace-channel mechanics in `context.md` were established in the sibling repo and still have not been re-confirmed against `maccesar-titools`; there is no cache for it on this machine to inspect.

## Known pending

- A local Claude Code marketplace installation would need `/plugin marketplace update maccesar-titools` then `/reload-plugins`. There is still no such installation here, and neither published channel is blocked by it.
