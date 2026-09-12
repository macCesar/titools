# Status — 2026-09-11

**Phase:** v4.23.1 shipped; live and maintained.
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`). Written after the release, which is the only point at which its facts exist. Three releases landed today — v4.22.0, v4.23.0 and v4.23.1. The content of this one, commit `9512c74`, came from a session whose transcript this note does not have; it was read from the commit and its diff.
**Deployed:** `@maccesar/titools@4.23.1` on npm — published by `publish.yml` run [34666897223](https://github.com/macCesar/titools/actions/runs/34666897223), `success`, after its own tag-versus-version-files guard plus `npm ci && npm test`. The registry serves `4.23.1` (read from `registry.npmjs.org` directly; a cached `npm view` still answered `4.23.0` right after the run went green, the same lag as yesterday's release). Tag `v4.23.1` → `b392242`, release commit `921ee75`, GitHub release at <https://github.com/macCesar/titools/releases/tag/v4.23.1>. `package.json` and `.claude-plugin/plugin.json` both read `4.23.1`.
**Branch:** `main`, aligned with `origin/main`.
**Sibling:** `../aiskills` is aligned with its own `origin/main` at `2b8058f`. No shared machinery moved — `git diff v4.23.0..HEAD -- lib/ bin/ hooks/` is empty — so no port is owed.

## Where things stand

v4.23.1 finishes the push-notification reference `ti-expert` has been growing all day. The file carried the four-doors handler in full but reduced the module's `didOpenNotification` route to a three-line fragment, so anyone starting a new app had to assemble the rest. Both exclusive Android routes are now written out, with the reason `resumed` stays in the listing: it catches an Intent a module version still leaves behind, and returns quietly when the event already delivered the payload.

Four facts that lived only in working code reached the file. On Android the channel is assigned to `modulo.notificationChannel` **before** the token is requested, and its id has to match the `default_notification_channel_id` meta-data in `tiapp.xml`. Firebase does not re-announce a token it already had, so `didRefreshRegistrationToken` can fail to fire on a device that registered before — the app then never sends the token and every push to that device is addressed to nobody; the token has to be read once by hand and `guardarToken` made idempotent. On iOS the token comes from `fetchToken`, not from `fcmToken`, which is empty right after APNs answers and stays empty however long you wait. And `apnsToken` is never assigned by hand: Firebase's swizzling does it, and setting it produces `BadDeviceToken` when sending.

The symptom-to-cause table gained the three symptoms those facts explain — push that works on a fresh install and never on a reinstall, the empty `fcmToken`, and `BadDeviceToken`.

Earlier the same day, v4.23.0 aligned `purgetss` with PurgeTSS 7.17.1 around the `notificationicon.png` rename, and v4.22.0 shipped the push reference in the first place.

## In flight

- Nothing. The release is complete through the channels a release reaches on its own.

## Requirements

- R3 (version files agree) is satisfied at `4.23.1` across the registry, `package.json` and `plugin.json`; `publish.yml` re-checked it before publishing.
- R7–R9 remain satisfied: frontmatter validates, anchors resolve, 359/359 green.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **`EXAMPLE-PROMPTS.md` still has no prompt routed at the push-notification reference.** Line 535 carries "How do I add Android push notifications using Firebase in a Titanium app?", written before this work and for a different skill. Where it routes now that `ti-expert`'s description claims the topic has never been checked, and the repo's convention asks for at least two example prompts per new surface. Carried from the previous release; this one added more surface to that same file and still no prompt.
2. **Two `purgetss` references are over the auditor's size guidance.** `references/app-branding.md` is **826 lines** and `references/cli-commands.md` **816**, against the `~200–800 lines each` the auditor's `SKILL.md` states — prose guidance, not a cap any test enforces, so nothing is failing. Measured in the previous release and not re-measured here; neither file changed since.
3. **The SessionStart hook still does not reach npm-only installs.** Measured in the previous release, not re-measured today. Written up in `context.md` § Traps. A design question — whether the CLI should write into the user's global settings — not a bug.

## Verified vs. assumed

- **Verified now:** the registry serves `4.23.1` (`dist-tags` read from `registry.npmjs.org`, then confirmed with `npm view` against an empty cache directory); both version files read `4.23.1`; tag `v4.23.1` → `b392242`; release commit `921ee75`.
- **Verified now:** publish run `34666897223` concluded `success`, every step green including the guard, `npm ci`, `npm test` and the OIDC publish.
- **Verified now:** 359/359 tests across 31 suites, run locally before the release commit and again in CI. The count did not move — this release added no file, and `test/anchors.test.js` emits one test per `.md`.
- **Verified now:** `main` is aligned with `origin/main`, and `git diff v4.23.0..HEAD -- lib/ bin/ hooks/` is empty, so the sibling owes no port.
- **Verified now:** `../aiskills` is clean and aligned with its `origin/main` at `2b8058f`.
- **Assumed, not verified:** the technical claims the release documents. They come from working app code and from a device session this note did not witness; nothing was run against a device from here, and the module's own source was not read to confirm the `fetchToken` and swizzling behavior.
- **Assumed, not verified:** the marketplace-channel mechanics in `context.md`, still established only in the sibling repo. No cache for `maccesar-titools` exists on this machine to inspect.

## Known pending

- **`package-lock.json` lagged the release commit by one.** `npm version` rewrote its root `version` field to `4.23.1`, but the release commit staged only `package.json`, `plugin.json` and the CHANGELOG, so the tagged tree carries a lockfile that reads `4.23.0`. CI was unaffected — `npm ci` compares the dependency tree, not that field, and the run went green — and the lockfile is committed immediately after the tag, alongside this note. Stage it with the release commit next time.
- **The maintainer's post-release steps are not done by the release.** npm is served; a marketplace installation would need `/plugin marketplace update maccesar-titools` then `/reload-plugins`, and there is none on this machine. The CLI here is `npm link`-ed to this checkout, so its skills are already current.
- Marketplace users with auto-update off reach `4.23.1` only by refreshing by hand; third-party marketplaces do not auto-update by default.
