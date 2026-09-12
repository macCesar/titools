# Status — 2026-09-12

**Phase:** v4.23.1 is what users have. Eight commits sit on `main` unpushed, rewiring where the skills' documentation comes from. **The next release is 5.0.0**, decided 2026-09-12: the major marks TiTools moving onto the rewritten documentation, not a broken interface.
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`).
**Deployed:** `@maccesar/titools@4.23.1` on npm, unchanged from yesterday (`npm view` reads `4.23.1`; both version files agree). **Nothing from this session has shipped or been pushed.**
**Branch:** `main`, eight commits ahead of `origin/main`, working tree clean.
**Sibling:** `../aiskills` clean and aligned with its `origin/main` at `2b8058f`. `git diff v4.23.1..HEAD -- lib/ bin/ hooks/` is empty, so no port is owed.

## Where things stand

The Titanium documentation moved, and the skills were still reading the repo it moved away from.

`tidev/titanium-docs` (VuePress) is frozen and being archived under TI-52. `tidev/titaniumsdk.com` (Next.js 16, Tailwind 4) replaces it, with guides as markdown in `content/docs/` and the API compiled from the SDK's `apidoc/` YAML into a committed, per-release `registry/`. The SDK's own `regen-docs.yml` now dispatches there and labels the job that still notifies the old repo `Notify titanium-docs (legacy)`.

The old repo is not merely deprecated, it is already behind. `Ti.UI.Toolbar.hideSharedBackground` (apidoc 2026-07-12) and `Ti.UI.ListView.snapping` (2026-07-20) are in the SDK and in the site's `registry/sdk/main/`, and never reached it. An audit run against it would have reported green against a corpus that stopped moving.

**The condensation is not a loss.** TiDev's own `docs/legacy-guide-audit.md` classifies the 336 legacy pages as 121 rewrite, 121 merge, 2 keep, 92 archive — and 91 of the 92 are release notes, the 92nd the discontinued Atom package. No guide topic is dropped. What changes is density: 1390 KB of legacy prose becomes 219 KB. This repo keeps the full corpus, so TiTools now carries material the official docs no longer do, which is the reason the archive layer exists rather than being deleted.

What landed, as outcomes:

- **The auditor reads three roots**, with a precedence section saying which wins: the SDK's `apidoc/` for the API, the new site's `content/docs/` for the guides, `titanium-docs` as an additive archive that never overrides a live source. Two gitignored symlinks, `.titanium-sdk` and `.titaniumsdk-site`.
- **Two scripts**, both written because a hand-built answer was wrong first. `apidoc-coverage.mjs` lists apidoc members a reference never names; `api-map.mjs` derives type-to-reference from the files rather than a table that drifts.
- **`ti-api` is complete against the published release**: 2682/2682 members named at `13_4_1_GA`, after adding `Calendar.Attendee.relationship` and the `TableViewRow.touchmove` event, and fixing four Attendee rows that claimed iOS-only for properties the apidoc declares on both platforms.
- **Swift Package Manager for iOS modules** is documented in `ti-howtos` (`spm.json`, `embedded` vs `host`, migrating off `ti.spm.js`). Upstream added that guide 2026-08-23 and the skill had no coverage.
- **13.4.1 is in the release history**, and the 27 `titaniumsdk.com/guide|api/` links across 13 references now point at the pages that replaced them, in the canonical unversioned form the site's own writing guide asks for.

## In flight

- Nothing half-written. The eight commits are complete and the tree is clean.

## Blocked on someone else

- **The first contribution to the official docs waits on `hansemannn/titanium-firebase-cloud-messaging` PR #170** ("fix(android): launch once on notification tap, and fire an event for it", opened 2026-09-11, no reviews yet; #169 merged 2026-09-10). The plan is to document push once, completely, after that merges. Documenting now would mean editing the same page twice.

## Requirements

- R3 (version files agree) holds at `4.23.1` across the registry, `package.json` and `plugin.json`. Untouched this session.
- R7–R9 hold: 359/359 tests green across 31 suites, run after the last edit.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **Decide what 5.0.0 contains, then run `/release`.** The number is settled; the contents are not. Everything committed so far is additive — two `ti-api` members, the SPM section, 13.4.1, the link rewrite — and would pass as a minor on its own. The change that actually breaks anything is regenerating the 19 `ti-api` references against `apidoc/` YAML instead of the archived markdown, and that has not been done. So 5.0.0 is either cut now, marking the move to the new sources, or held until the regeneration lands with it.

   An earlier proposal to keep a 4.x line tied to the SDK alongside a 5.x line for the new site was dropped: `marketplace.json` declares its source without a version, so plugin installs track default-branch HEAD rather than a tag, and a parallel 4.x line would not exist for those users.

   Both version files and the CHANGELOG are untouched. `/release` handles the sequence; the tag is what publishes.
2. **Push.** Eight commits are local only.
3. **The push-notifications page on the new site is wrong, not merely thin**, and that is the prepared contribution. `content/docs/build/notifications.md` presents `registerForPushNotifications` as returning the token on both platforms; on Android that call only requests `POST_NOTIFICATIONS` and on iOS `e.deviceToken` is the APNs token, which an FCM server cannot use. It also says `callback` fires on receipt and on tap, when a tap fires `didOpenNotification` with the payload under `message.data`. Everything needed to correct it is in `skills/ti-expert/references/push-notifications.md`, verified on device. Waits on item under "Blocked".
4. **`EXAMPLE-PROMPTS.md` still has no prompt routed at the push-notification reference.** Line 535 carries one written for a different skill. Carried from the previous two releases; re-checked today and unchanged.
5. **Two `purgetss` references exceed the auditor's size guidance**: `app-branding.md` at 826 lines and `cli-commands.md` at 816, against `~200–800`. Prose guidance, no test enforces it. Re-measured today. `ti-howtos/references/extending-titanium.md` grew to 775 with the SPM section and is now near the same line.
6. **The SessionStart hook still does not reach npm-only installs.** Not re-measured today; written up in `context.md` § Traps. A design question, not a bug.

## Verified vs. assumed

- **Verified now:** 359/359 tests across 31 suites, after the last edit.
- **Verified now:** `ti-api` names 2682/2682 apidoc members at `13_4_1_GA`, and 2681/2687 against `main`, where the six are unreleased APIs bound for 14.0.0 (`main` declares `14.0.0` in `package.json`).
- **Verified now:** zero `titaniumsdk.com/guide/` or `/api/` links remain under `skills/`; four replacement destinations returned 200.
- **Verified now:** every path the new source map names exists — the 27 mapped site pages, the apidoc subtrees, all five cache roots.
- **Verified now:** `main` is clean and eight ahead of `origin/main`; `../aiskills` clean at `2b8058f`; no shared machinery in the diff.
- **Verified now:** the site repo wraps prose at roughly 76 columns (median 72, p95 79 over 1736 prose lines) — the opposite of this repo's convention, and `docs/writing-guides.md` never states it.
- **Corrected during the session:** `hideSharedBackground` was first reported as shipped in 13.4.1. It is not. `registry/sdk/_pool/` is content-addressed and shared across every version, so grepping it says some version has an API, not which; the matching files belonged to `registry/sdk/main/`. Resolve through the version's `contents.json` instead. Written into the auditor.
- **Corrected during the session:** the auditor was described as not travelling with the repo. It does — `.gitignore` blocks `.claude/*` and re-admits `!.claude/skills/`.
- **Assumed, not verified:** the SPM section is transcribed from the upstream guide. Nobody has built a module against it from here.
- **Assumed, not verified:** the skills have not been reloaded in a client since these edits. `titools install` and a reload would confirm they still load.
- **Assumed, not verified:** the marketplace-channel mechanics in `context.md`, still established only in the sibling repo.

## Known pending

- The maintainer's fork of the docs site, `macCesar/titaniumsdk.com`, has no `upstream` remote configured. It will need one before any pull request.
- `.purgetss-docs` (86 MB) and `.purgetss-source` (322 MB) are full clones duplicating checkouts that already exist under `~/Developer/openSource/`. Identical remote and HEAD, no local modifications. Converting them to symlinks, as the three Titanium caches already are, frees 408 MB and leaves one place to pull. Not done: deleting the maintainer's directories is the maintainer's call.
