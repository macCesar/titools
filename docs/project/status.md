# Status — 2026-09-11

**Phase:** v4.23.0 shipped; live and maintained.
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`). Written after the release, which is the only point at which its facts exist. Two releases landed today — v4.22.0 and v4.23.0 — and the `didOpenNotification` correction in between came from a session whose transcript this note does not have; it was read from the commit.
**Deployed:** `@maccesar/titools@4.23.0` on npm — published by `publish.yml` run [34666530349](https://github.com/macCesar/titools/actions/runs/34666530349), `success`, after its own tag-versus-version-files guard plus `npm ci && npm test`. The registry serves `4.23.0` (read from `registry.npmjs.org` directly, because a cached `npm view` still answered `4.22.0` a minute after the run went green). Tag `v4.23.0` → `d958bf0`, GitHub release at <https://github.com/macCesar/titools/releases/tag/v4.23.0>. `package.json` and `.claude-plugin/plugin.json` both read `4.23.0`.
**Branch:** `main`, aligned with `origin/main`, working tree clean.
**Sibling:** `../aiskills` is aligned with its own `origin/main` at `2b8058f`. No shared machinery moved in either release — `git diff v4.21.0..HEAD -- lib/ bin/ hooks/` is empty — so no port is owed.

## Where things stand

v4.23.0 aligns the `purgetss` skill with **PurgeTSS 7.17.1** and closes the seam between that skill and the push-notification reference v4.22.0 shipped.

PurgeTSS renamed the `notification-icon` piece's output from `ic_stat_notify.png` to `notificationicon.png`, because `firebase.cloudmessaging` resolves the drawable by that exact name inside `TiFirebaseMessagingService.showNotification()` and that lookup is the only path a **data** message has. The skill carried the old name in six places and, worse, had the reason inverted — it said the icon was inert without the FCM `meta-data`, when the `meta-data` covers **notification** messages alone. `app-branding.md` gained a `FCM notification icon` section in the same position the official docs give it, with the Alloy and Classic output paths, the runtime tinting that forces white-on-transparent artwork, both `meta-data` entries including `default_notification_color`, and the `colors.xml` resource the second one needs. A troubleshooting entry covers the white square.

`ti-expert/references/push-notifications.md` documented how a message arrives and not how it looks on arrival, so a tap that produced a white blob had no entry in its symptom-to-cause table. Section 2 now names the drawable both routes need and points at PurgeTSS to generate it.

Earlier the same day, v4.22.0 shipped that reference in the first place, plus the Android 12+ splash theme-chain correction in `ti-ui` under `## Community-Discovered Patterns`, and `1c0d42a` corrected the reference's own four-doors table: `didOpenNotification` replaces rows three and four, not two to four, because a cold start still arrives in the Intent — the module does not exist yet when the notification is opened.

## In flight

- Nothing. Both releases are complete through the channels a release reaches on its own.

## Requirements

- R3 (version files agree) is satisfied at `4.23.0` across the registry, `package.json` and `plugin.json`; `publish.yml` re-checked it before publishing.
- R6 was exercised twice today: `cc1fd3c` chose `## Community-Discovered Patterns` over the audited body in `ti-ui`, and this release's `purgetss` edits went into the body deliberately, because that content mirrors official docs and an audit should keep it current rather than preserve it.
- R7–R9 remain satisfied: frontmatter validates, anchors resolve, 359/359 green.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **Two `purgetss` references are over the auditor's size guidance.** `references/app-branding.md` is now **826 lines** and `references/cli-commands.md` **816**, against the `~200–800 lines each` the auditor's `SKILL.md` states. Worth knowing before acting on it: that is prose guidance, not a cap any test enforces, so nothing is failing. `app-branding.md` crossed it in this release by design — the FCM section was the point. The measured split for `cli-commands.md` (a `cli-commands-assets.md`, with anchor counts from an earlier draft and not re-run) is in the previous revisions of this file via `git log`.
2. **`EXAMPLE-PROMPTS.md` still has no prompt routed at the push-notification reference.** Line 535 carries "How do I add Android push notifications using Firebase in a Titanium app?", written before this work and for a different skill. Where it routes now that `ti-expert`'s description claims the topic has never been checked, and the repo's convention asks for at least two example prompts per new surface.
3. **The SessionStart hook still does not reach npm-only installs.** Re-measured today: no `session-start.sh` entry in `~/.claude/settings.json`, and `~/.claude/plugins/cache/` holds four plugins, none of them `maccesar-titools`. Written up in `context.md` § Traps. A design question — whether the CLI should write into the user's global settings — not a bug.

## Verified vs. assumed

- **Verified now:** the registry serves `4.23.0` (queried at `registry.npmjs.org`, then confirmed with `npm view --no-cache`); both version files read `4.23.0`; tag `v4.23.0` → `d958bf0`.
- **Verified now:** publish run `34666530349` concluded `success`, including the guard, `npm ci`, `npm test` and the OIDC publish. The earlier v4.22.0 run, `34665563869`, also `success`.
- **Verified now:** 359/359 tests across 31 suites, run after each content change and again in CI. The count did not move, because `test/anchors.test.js` emits one test per `.md` file and this release added no file.
- **Verified now:** the comments above the opt-in pieces in all three copies of the `brand:` block are byte-identical to `lib/templates/purgetss.config.js.cjs:39-40` in the PurgeTSS repo, compared with grep side by side.
- **Verified now:** the two remaining occurrences of `ic_stat_notify` under `skills/` are deliberate — both describe the old name for someone migrating.
- **Verified now:** all 29 pages under `docs/` in `../purgetss-docs` have a corresponding reference in the skill, and that repo is clean and aligned with its `origin/main` at `1ed1a90`. So the skill is level with the **published** docs, not merely with the CLI.
- **Verified now:** `main` is aligned with `origin/main`, working tree clean.
- **Assumed, not verified:** the technical claims themselves. The PurgeTSS side is traceable to that repo's CHANGELOG, its config template and the official docs, all read today; nothing was run against a device from here, and `firebase.cloudmessaging`'s `getResource("notificationicon")` is quoted from those sources rather than from the module's own source.
- **Assumed, not verified:** the marketplace-channel mechanics in `context.md`, still established only in the sibling repo. No cache for `maccesar-titools` exists on this machine to inspect.

## Known pending

- **The maintainer's post-release steps are not done by the release.** npm is served; a marketplace installation would need `/plugin marketplace update maccesar-titools` then `/reload-plugins`, and there is none on this machine. The CLI here is `npm link`-ed to this checkout, so its skills are already current.
- Marketplace users with auto-update off reach `4.23.0` only by refreshing by hand; third-party marketplaces do not auto-update by default.
