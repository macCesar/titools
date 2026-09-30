# Status — 2026-09-29

**Phase:** v5.1.1 shipped; live and maintained. Three commits on `main` since, none released.
**Session by:** Claude Code · Opus 5.5 (`claude-opus-5-5`).
**Deployed:** `@maccesar/titools@5.1.1` on npm (`npm view` answers `5.1.1` today). Tag `v5.1.1` → `1a4dbb4`. Nothing after it is published.
**Branch:** `main`, 1 commit ahead of `origin/main` (`cff9438`, not pushed). Untracked `por-hacer.md` is the maintainer's note about the PurgeTSS videos; it predates this session and stays out of git.
**Sibling:** `git diff v5.1.1..HEAD -- lib/ bin/ hooks/` is empty, so no port to `../aiskills` is owed. `../aiskills` is aligned with its `origin/main` and clean.

## Where things stand

Unreleased on `main`, under `[Unreleased]` in `CHANGELOG.md`:

- **`83c43b7`:** `titools-skill-auditor` reaches Codex through a relative symlink in `.agents/skills/`.
- **`5c08d04`:** `purgetss-videos`, a maintainer-only skill under `.claude/skills/`, not shipped to npm.
- **`cff9438`:** `ti-synthengine` follows the TiSynthEngine 1.0.0 public release at `e8f1d0d` (2026-09-29), re-pinned from `6685b81` (2026-08-29). The seven references copied from upstream `documentation/` were regenerated from that commit and match it byte for byte apart from the snapshot line, the generated TOCs (`guide`, `examples`, `sound-design`) and the two closing paragraphs that point at `recipes.md`. `SKILL.md` gained `WAVE.WAVETABLE`, the shaping-field ranges, the chord shaping fields and `audioSession: 'ambient'`. `recipes.md` is TiTools-only and needed no change.

`ti-game` was checked the same day and is current: the skill pins upstream `3bea2f4` (2026-09-02), and `git ls-remote` shows both `m1ga/ti.game` and the `macCesar` fork at `3bea2f4`; latest upstream tag `0.5.0`.

TiSynthEngine's own docs have two small defects, reported to the maintainer and copied as-is into the skill: `documentation/api.md` lists `missing_required` twice in "Common reasons", and `troubleshooting.md` names `invalid_sample_count`, which that table omits. The repository goes public in a few days.

## Blocked on someone else

- **Font Awesome Pro/Beta family names need the maintainer's Pro fonts.** The reset `.tss` for Pro/Beta name `FontAwesome6Pro-*` while the copied files are `FontAwesome7Pro-*`. The skill does not state either, so nothing here depends on it yet.
- **`swap()`'s `rect` fallback was checked in the PurgeTSS source only**, not on a device.
- **An adoption page for `purgetss-docs`**, based on `adopting-purgetss.md`, waits on the maintainer's call.
- **The first contribution to the official Titanium docs still waits on `hansemannn/titanium-firebase-cloud-messaging` PR #170.** Not re-checked today.

## Requirements

- R3 (version files agree) holds at `5.1.1`; no bump since.
- R7–R9: 364/364 tests pass locally at `cff9438`. They cover the skill's registration and the `tiapp.xml` hook, not the content of its references.
- R10 is not implicated: no shared CLI machinery changed.

## Next step

1. **Push `cff9438`**, then decide when the three unreleased commits go out (`/release`). The `ti-synthengine` change reaches npm users only with a release.
2. **Re-align `ti-synthengine` if TiSynthEngine fixes its two doc defects** before or after going public; re-pin to the new commit.
3. **Re-audit `purgetss` against `.purgetss-docs` 1.1.14**, now that the docs were corrected at the source. The alignment above followed the handoff's list and the 7.18.0 changelog; it was not a page-by-page pass over the docs.
4. **The contribution to the new Titanium site, once PR #170 merges.** The plan in the previous status still stands: `content/docs/build/notifications.md` against `skills/ti-expert/references/push-notifications.md`, after reading the site's `docs/writing-guides.md` and adding an `upstream` remote.
5. **When Titanium 14.0.0 ships**, run `apidoc-coverage.mjs` against the new tag.
6. **`EXAMPLE-PROMPTS.md` has no prompt routed at the push-notification reference or at `adopting-purgetss.md`.** Not re-checked today beyond noting the new guide.
7. **The SessionStart hook still does not reach npm-only installs.** A design question, written up in `context.md` § Traps.

## Verified vs. assumed

- **Verified 2026-09-29:** 364/364 tests at `cff9438`; the seven regenerated `ti-synthengine` references `diff` clean against `e8f1d0d:documentation/` once the snapshot line and TOC are stripped; upstream and fork `main` of ti.game at `3bea2f4` by `git ls-remote`.
- **Verified at v5.1.1 (2026-09-26):** publish run `36292092017` concluded `success`; the registry serves `latest 5.1.1` and the 5.1.1 tarball returns 200; tag `v5.1.1` → `1a4dbb4`; all three version files read `5.1.1`.
- **Verified at v5.1.1:** 362/362 tests before the release commit and in CI.
- **Verified at v5.1.1:** the three generated indexes name 3015 class tokens, 0 absent from `utilities.tss`. The checker was run first on known-good (`bg-white`, `row-h-*`) and known-bad (`row-height-*`, `border-t-*`, `hires-true`) inputs. The parser's unique-class count matched an independent `grep` at 7.17.1 (23,343); at 7.18.0 it reports 23,332.
- **Verified at v5.1.0:** 553 relative links and anchors under `skills/purgetss` resolve (checker controlled with a known-bad anchor and a missing file). No PUA glyphs, no `var`, no reference over 800 lines, and every code fence closes.
- **Verified by running the cached CLI in throwaway projects:** `(Npx)` halts the purge; semantic color nesting works at any depth since 7.10.0; `extend.View` needs the `default` wrapper; the 4096 px output cap (width 1024 passes, 1025 aborts).
- **Verified against apidoc `13_4_1_GA`:** `padding` exists only on `TextField` and `TextArea` (both platforms), `Ti.UI.Android.CardView`, `ScrollableView` (Android), `TabGroup` bottom navigation (Android) and `Ti.UI.iOS.ButtonConfiguration`. PurgeTSS's "padding - Android Only" label is wrong for the two text inputs; the skill says so.
- **Corrected during the session:** the agents first propagated that "Android Only" label into two references; fixed after checking the apidoc.
- **Corrected during the session:** `Alloy.createStyle` was treated as unverifiable. Both it (`Alloy/template/lib/alloy.js:231`) and `$.createStyle` exist in Alloy 3.0.1.
- **Assumed, not verified:** the TiKit API in `tikit-components.md`, which no cache covers. The Boxicons and LineIcons codepoints in `icon-fonts.md` come from those projects' CSS, not the PurgeTSS package.
- **Assumed, not verified:** no client has loaded the updated `ti-synthengine` skill and answered a prompt with it.

## Known pending

- The maintainer's CLI is `npm link`-ed here, so the new skills are live; `titools update` adds the symlink for nothing new this time, since no skill was added.
- `.purgetss-docs` and `.purgetss-source` are full clones duplicating `~/Developer/openSource/purgetss-docs` and `~/Developer/openSource/purgeTSS`, at the same HEADs. Converting them to symlinks frees about 408 MB. Not done: the maintainer's call.
- `CLAUDE.md` now imports `@.claude/memory/index.md`, but `.gitignore` excludes `.claude/memory/`, so the import resolves only on this machine.
