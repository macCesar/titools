# Status — 2026-09-12

**Phase:** v5.0.0 shipped; live and maintained.
**Session by:** Claude Code · Opus 5 (`claude-opus-5[1m]`).
**Deployed:** `@maccesar/titools@5.0.0` on npm, published by `publish.yml` run [34675604389](https://github.com/macCesar/titools/actions/runs/34675604389), `success` — its tag-versus-version-files guard, `npm ci`, `npm test` and the OIDC publish all green. The registry serves `5.0.0`, read from `registry.npmjs.org` directly; a first read right after the run went green still answered `4.23.1`, which is the same CDN lag the last two releases saw. Tag `v5.0.0` → `e78a675`, which is also the release commit. GitHub release at <https://github.com/macCesar/titools/releases/tag/v5.0.0>. `package.json`, `package-lock.json` and `.claude-plugin/plugin.json` all read `5.0.0`.
**Branch:** `main`, aligned with `origin/main`, working tree clean.
**Sibling:** `../aiskills` clean and aligned with its `origin/main` at `2b8058f`. `git diff v4.23.1..v5.0.0 -- lib/ bin/ hooks/` is empty, so no port is owed.

## Where things stand

v5.0.0 moves TiTools onto the documentation Titanium actually maintains.

`tidev/titanium-docs` (VuePress) is frozen and being archived under TI-52. `tidev/titaniumsdk.com` (Next.js 16, Tailwind 4) replaces it: guides as markdown in `content/docs/`, and the API compiled from the SDK's `apidoc/` YAML into a committed, per-release `registry/`. The SDK's own `regen-docs.yml` dispatches there and labels the job that still notifies the old repo `Notify titanium-docs (legacy)`.

The old repo is not merely deprecated, it is already behind. `Ti.UI.Toolbar.hideSharedBackground` (apidoc 2026-07-12) and `Ti.UI.ListView.snapping` (2026-07-20) are in the SDK and in the site's `registry/sdk/main/`, and never reached it. An audit against it would have reported green against a corpus that stopped moving.

**The condensation is not a loss.** TiDev's own `docs/legacy-guide-audit.md` classifies the 336 legacy pages as 121 rewrite, 121 merge, 2 keep, 92 archive — and 91 of the 92 are release notes, the 92nd the discontinued Atom package. No guide topic is dropped. What changes is density: 1390 KB of legacy prose becomes 219 KB. This repo keeps the full corpus, which is why the archive layer exists rather than being deleted, and why TiTools now carries material the official docs no longer do.

The major is editorial. Nothing breaks on update: no command, flag or skill name moved, and `lib/`, `bin/` and `hooks/` are untouched. It marks the change of sources.

## In flight

- Nothing.

## Blocked on someone else

- **The first contribution to the official docs waits on `hansemannn/titanium-firebase-cloud-messaging` PR #170** ("fix(android): launch once on notification tap, and fire an event for it", opened 2026-09-11, no reviews yet; #169 merged 2026-09-10). Push gets documented once, completely, after that merges — documenting now would mean editing the same page twice.

## Requirements

- R3 (version files agree) holds at `5.0.0` across the registry, `package.json` and `plugin.json`; `publish.yml` re-checked it before publishing.
- R7–R9 hold: 359/359 tests across 31 suites, green locally before the release commit and again in CI.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **The prepared contribution to the new site, once PR #170 merges.** `content/docs/build/notifications.md` is wrong rather than merely thin: it presents `registerForPushNotifications` as returning the token on both platforms, when on Android that call only requests `POST_NOTIFICATIONS` and on iOS `e.deviceToken` is the APNs token, which an FCM server cannot use. It also says `callback` fires on receipt and on tap, when a tap fires `didOpenNotification` with the payload under `message.data`. The corrected material is in `skills/ti-expert/references/push-notifications.md`, verified on device. Before opening anything: read `docs/writing-guides.md` in the site repo in full (508 lines; `pnpm check:em-dash` fails the build on a single em dash), and configure an `upstream` remote on `macCesar/titaniumsdk.com`, which has only `origin`.
2. **Regenerating `ti-api` from `apidoc/` YAML is optional, not owed.** Coverage measured 2682/2682 at `13_4_1_GA` after this release, so a regeneration would likely produce no content change. Worth doing when 14.0.0 ships, alongside the six members that are unreleased today.
3. **When Titanium 14.0.0 ships**, run `node .claude/skills/titools-skill-auditor/scripts/apidoc-coverage.mjs` against the new tag. `Ti.UI.Toolbar.hideSharedBackground`, `Ti.UI.ListView.snapping`, `Ti.UI.TableView.searchText`, `Ti.UI.TabGroup.lazyLoadingEnabled` and the `QuickSettingsServiceShowParams` pseudo-type become real work then.
4. **`EXAMPLE-PROMPTS.md` still has no prompt routed at the push-notification reference.** Line 535 carries one written for a different skill. Carried from the previous three releases; re-checked today and unchanged.
5. **Two `purgetss` references exceed the auditor's size guidance**: `app-branding.md` at 826 lines and `cli-commands.md` at 816, against `~200–800`. Prose guidance, no test enforces it. `ti-howtos/references/extending-titanium.md` grew to 775 with the SPM section and is near the same line.
6. **The SessionStart hook still does not reach npm-only installs.** Not re-measured today; written up in `context.md` § Traps. A design question, not a bug.

## Verified vs. assumed

- **Verified now:** publish run `34675604389` concluded `success`, every step green including the guard, `npm ci`, `npm test` and the OIDC publish.
- **Verified now:** the registry serves `5.0.0` (`dist-tags` read from `registry.npmjs.org` with a cache-busting query); all three version files read `5.0.0`; tag `v5.0.0` → `e78a675`.
- **Verified now:** 359/359 tests across 31 suites, run before the release commit and again in CI.
- **Verified now:** `main` is clean and aligned with `origin/main`; `../aiskills` clean at `2b8058f`; `git diff v4.23.1..v5.0.0 -- lib/ bin/ hooks/` is empty, so the sibling owes no port.
- **Verified now:** `ti-api` names 2682/2682 apidoc members at `13_4_1_GA`, and 2681/2687 against `main`, where the six are unreleased APIs bound for 14.0.0 (`main` declares `14.0.0`).
- **Verified now:** zero `titaniumsdk.com/guide/` or `/api/` links remain under `skills/`; replacement destinations spot-checked at 200.
- **Verified now:** `package.json` `files` lists `bin/ lib/ skills/ agents/ commands/` and one markdown file, so this note landing after the tag leaves the published tarball byte-identical.
- **Corrected during the session:** `hideSharedBackground` was first reported as shipped in 13.4.1. It is not. `registry/sdk/_pool/` is content-addressed and shared across every version, so grepping it says some version has an API, not which; the matching files belonged to `registry/sdk/main/`. Resolve through the version's `contents.json`. Written into the auditor.
- **Corrected during the session:** the auditor was described as not travelling with the repo. It does — `.gitignore` blocks `.claude/*` and re-admits `!.claude/skills/`.
- **Assumed, not verified:** the SPM section is transcribed from the upstream guide. Nobody has built a module against it from here.
- **Assumed, not verified:** the skills have not been reloaded in a client since these edits.
- **Assumed, not verified:** the marketplace-channel mechanics in `context.md`, still established only in the sibling repo. No cache for `maccesar-titools` exists on this machine to inspect.

## Known pending

- **The maintainer's post-release steps are not done by the release.** npm is served. A marketplace installation would need `/plugin marketplace update maccesar-titools` then `/reload-plugins`; there is none on this machine. The CLI here is `npm link`-ed to this checkout, so its skills are already current.
- Marketplace users with auto-update off reach `5.0.0` only by refreshing by hand; third-party marketplaces do not auto-update by default.
- `macCesar/titaniumsdk.com` has no `upstream` remote configured. It needs one before any pull request.
- `.purgetss-docs` (86 MB) and `.purgetss-source` (322 MB) are full clones duplicating checkouts under `~/Developer/openSource/`. Identical remote and HEAD, no local modifications. Converting them to symlinks, as the three Titanium caches already are, frees 408 MB and leaves one place to pull. Not done: deleting the maintainer's directories is the maintainer's call.
