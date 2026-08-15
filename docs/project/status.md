# Status — 2026-08-14

**Phase:** live and maintained. **v4.6.1 shipped on both channels**, working tree clean, 0 commits unpushed, nothing in flight.

## Release state — both channels on 4.6.1

| Channel | Version | Verified |
|---|---|---|
| npm | 4.6.1 | `curl registry.npmjs.org/@maccesar%2Ftitools` → `dist-tags.latest = 4.6.1`, 2026-08-14 |
| Claude Code marketplace | 4.6.1 | `plugin.json` on `origin/main` reads 4.6.1, tag `v4.6.1` pushed, GitHub release created |

**Do not verify with `npm view`.** It read `4.5.0` for several minutes after the publish had already succeeded — the workflow was green and the registry had 4.6.1. The npm CLI serves that command from a local cache, so it can report a version that is provably stale. Query the registry over HTTP instead. `verification.md` in the sibling repo's `npm-supply-chain` skill documents exactly this.

**Step 8 is now automated and it did its job — by refusing to run.** See below.

## v4.6.0 is tagged but was never published

`v4.6.0` exists as a tag and a commit on `main`. It is not on npm and has no GitHub release. The CHANGELOG says so in the 4.6.1 entry. The tag was left in place rather than deleted; deleting it is a one-liner (`git push origin :refs/tags/v4.6.0`) if that is ever preferred.

**What happened.** `publish.yml` runs `npm test` before `npm publish`. Two tests in `test/list.test.js` asserted the skill names and the `N/M installed` footer against the real `HOME`, so they only passed on a machine that already had skills installed. They passed here and failed on the runner, which had none.

**Why it surfaced now.** `publish.yml` is itself new in this release cycle (`dc4c527`), so this was the **first time `npm test` had ever run in a clean environment**. The tests had been machine-dependent since they were written in v2.6.0 (2026-04-17) — the bug was four months old and invisible. The automation added to stop step 8 from being skipped caught a different bug entirely on its first run, which is the strongest argument for it that could have been asked for.

**Process failure worth recording.** The pre-push verification reported "138/138 passing" from this machine and treated that as evidence the release was safe. It was not evidence of anything about CI. The control that was missing — running the suite under an empty `HOME` — takes one command:

```bash
FAKEHOME=$(mktemp -d) && HOME="$FAKEHOME" npm test; rm -rf "$FAKEHOME"
```

That control is now run before every push in both repos. It is the same lesson as the `run_eval.py` incident: a green result from an instrument that cannot fail is not a measurement.

## Shipped in 4.6.1 — `titools list` shows the catalog

`list` printed "No skills installed yet." and returned, so the one moment you most want to see what is on offer was the one moment it showed nothing. It now always prints the eight skills with ✗/✓, pulling descriptions for uninstalled ones from the copy bundled in the package (`skills/` ships in the tarball). The footer drops the directory path when the count is zero.

The suite now runs every `list` assertion against a temporary `HOME` and covers both states explicitly — empty, and seeded with a `SKILL.md`. 140 tests, verified under an empty `HOME`.

## Shipped in 4.6.0 — purgetss audit, ESLint, list wrapping

**`purgetss` skill audited against PurgeTSS 7.13.1.** The skill described 7.11.1. PurgeTSS 7.13.0 restructured `purgetss brand` end to end and kept **no flag aliases**, so five references were not stale but wrong: every flag name, every config key, and three logo filenames had changed meaning underneath them.

`logo-icon` is the trap — the name survived the rename but now feeds `DefaultIcon.png`, while the Android launcher mark moved to `logo-adaptive`. Following the old text put the artwork on the wrong piece and let the launcher icons fall back to the main logo silently.

`app-branding.md` was rewritten against the current guide (14 pieces, per-piece `brand:` block, `--only`, `--optimize`, `LaunchLogo.png`, the 16 iPhone launch images, the 11 `res-*` splashes, `appicon`, the on-disk config migration). Two claims that had become false were removed: that `background.9.png` is out of scope, and that `--legacy-splash` exists. The Android launch-background setup was split into `launch-background.md` — self-contained, reached from three places, and keeping it inline pushed the file past the 800-line cap.

**Padding defaults came from the source, not the CLI.** `purgetss brand --help` prints `default: 19` for `--android-adaptive-padding` and `default: 20` for the two splash paddings; `src/core/branding/pieces.js` applies `18`, `26` and `26`, and the official guide agrees with the source. The help strings are the stale ones. `cli-commands.md` carries that discrepancy as a warning so nobody re-derives the wrong numbers from the CLI. **This is an open bug in the PurgeTSS repo** (`bin/purgetss:321,327,328`), not in this skill.

Audit verification: 0 broken cross-reference anchors across the whole skill, every reference at or under 800 lines, `SKILL.md`'s table in sync with the files on disk.

**Documentation source.** PurgeTSS is **not** in `tidev/titanium-docs`, so the `titools-skill-auditor` does not map it — `source-map.md` marks PurgeTSS content AUDIT-SKIP for that reason. The source is `~/Developer/openSource/purgetss-docs` (the Docusaurus site behind purgetss.com) plus `~/Developer/openSource/purgeTSS` for the code. Both were at 2026-08-14 HEAD; the docs repo also had uncommitted prose polish that the skill is aligned against.

**ESLint existed as a script and nothing else.** `npm run lint` had failed on every run with "couldn't find an eslint.config.js" since ESLint 9 dropped `.eslintrc`. The flat config now covers `bin/`, `lib/` and `test/`; `skills/` is ignored. Its first pass removed seven unused imports, a helper nothing referenced, and three dead assignments.

## Sibling parity — aiskills 1.20.0, released the same day

`list` was the same code in both repos and carried the same early return. Ported, along with the `ls` alias that only titools had, and the integration test layer aiskills never had. `aiskills` `list.js` shipped in March 2026 and went five months with **no tests at all**; the ones added in August covered the two pure functions only, which is a layer that cannot see a command returning before it calls them.

| Repo | npm | Tests | `list` catalog | `ls` alias |
|---|---|---|---|---|
| titools | 4.6.1 | 140 | yes | yes |
| aiskills | 1.20.0 | 111 | yes | yes |

Both verified under an empty `HOME` before pushing.

## Open items

1. **`v4.6.0` orphan tag** — tagged, never published. Documented in the CHANGELOG. Delete or leave.
2. **PurgeTSS help strings** — `bin/purgetss:321,327,328` disagree with `pieces.js`. Upstream fix, not ours.

## Previous release — 4.5.0

| Channel | Version | Verified |
|---|---|---|
| npm | 4.5.0 | `npm view @maccesar/titools version` → 4.5.0, 2026-08-11 |
| Claude Code marketplace | 4.5.0 | `plugin.json` on `origin/main` reads 4.5.0, tag `v4.5.0` pushed, GitHub release created |

**Step 8 was not skipped that time.** It had been in v4.1.0 and again in v4.4.1. It has since been automated: `publish.yml` publishes from the pushed tag, so the tag and the publish can no longer diverge by forgetting.

## Shipped in 4.5.0 — audit against titanium-docs@c3832a84 (2026-08-11)

Sixteen upstream commits (`7128ac62..c3832a84`) were audited and applied across six semantic commits plus the release commit.

**What upstream actually changed:** Facebook Limited Login (the only real `api.json` change), two typo fixes, a whitespace-only `imageview.md`, the JDK compatibility matrix, a JetBrains link, and release notes for 13.2.0 through 13.4.0. Nothing under `Titanium_SDK_Guide`, `Titanium_SDK_How-tos` or `Alloy_Framework`, so `ti-howtos`, `alloy-guides` and `alloy-howtos` were untouched by design, not by omission.

**The structural finding:** all three guide-side changes landed outside every subtree mapped in `source-map.md`. `ti-guides` was anchored only to `Titanium_SDK_Guide`, leaving `Titanium_SDK_Getting_Started/`, `Titanium_SDK_Release_Notes/` and `Editor_IDE/` permanently invisible to the audit. Now mapped.

**One claim was rejected on evidence.** The 13.3.0 release note says "add deprecation note for old events in ScrollableView". Neither the new `api.json` nor the installed SDK 13.4.0.GA `api.jsca` flags `scroll`, `scrollend` or `dragend` as deprecated, and their descriptions are identical between 13.1.1.GA and 13.4.0.GA. It was written up as advance warning, not as a deprecation. `source-map.md` now carries the general rule: release notes are commit subjects, confirm against API metadata first.

**Verification, before believing any of it.** A generator was written to emit type tables from `api.json`, then pointed at the 113 tables already in the repo: 97 reproduced byte-for-byte, and the 16 differences were all explainable (8 empty-`Dictionary` stubs, 7 truncation markers, and one genuine upstream typo fix). Only after that control passed was it used to write anything. After the rebuild: 136 of 149 blocks match `api.json`, the remaining 13 being the same known artifacts. 580 internal links checked, 0 broken. `npm test` → 118 passing, 24 suites. No file over the 800-line limit (largest is `api-media.md` at 787).

Worth recording: the link checker first reported 4 broken anchors in the new `sdk-release-notes.md`. The checker was wrong — its slug rule collapsed runs of whitespace into one hyphen where GitHub and the repo's own `generate-toc.mjs` emit one hyphen per space. Running `generate-toc.mjs` over the file changed nothing, which is what settled it.

**`NOTA-referencias-truncadas.md` is resolved** and was deleted. Its finding was worse than it read: the marker in `api-media.md` claimed 2 omitted types when the section was really missing 10, and everything the note says had to be dug out of the native SDK source was already sitting in the official `api.json`.

**Sibling:** `~/Developer/openSource/aiskills` (`@maccesar/aiskills`) — shares this repo's `lib/`. See `context.md` § "Sibling project" for the parity contract.

## Previous release — 4.4.2

| Channel | Version | Verified |
|---|---|---|
| npm | 4.4.2 | tarball downloaded from the registry and inspected, 2026-08-10 |
| Claude Code marketplace | 4.4.2 | `plugin.json` on `main`, tag `v4.4.2` pushed, GitHub release created |

Verification went past the version number: the published tarball was pulled and listed — 181 files, `sharing.md` and `file-type-association.md` both present, the three `commands/` present, and `scripts/`, `.claude/` and `EXAMPLE-PROMPTS.md` correctly absent.

**v4.4.1 had been tagged and pushed on 2026-08-05 and never published**, so CLI users had been stuck on 4.4.0 and never received `file-type-association.md`. The 4.4.2 tarball carried both releases' content, which closed the gap in one publish. Same failure as v4.1.0 in July — twice in six weeks, always step 8, because tagging feels like finishing.

**If it happens a third time, stop writing it down and automate it**: a check comparing `npm view @maccesar/titools version` against `plugin.json` that fails loudly. The note has now been written twice and has not prevented anything.

## Changed 2026-08-10

Two commits, in this order.

**1. The markdown is no longer hard-wrapped** (43 files). Paragraphs were wrapped at roughly 80 columns, which made a one-word edit reflow a whole paragraph — five lines of diff for one change — and broke `grep` for any sentence crossing a line break. One paragraph is now one line, the same for list items and table cells.

Verified rather than assumed, because a bulk reflow is exactly the kind of change that quietly damages content:

- With all whitespace collapsed, every one of the 43 files is byte-identical to its previous version. No word was lost, added or reordered.
- The contents of every fenced code block are unchanged — checked by extracting fenced regions from both versions and comparing.
- Three lines lost trailing whitespace (`api-data-network.md` ×2, `api-modules-map.md` ×1). All three carried it by accident of the wrap; none was a Markdown hard break.
- 42 joins were flagged where the second line looked deliberate rather than a continuation (`See also:` followed by its link, `Increase disk space:` followed by its instruction). All of them were already separated by no blank line, so Markdown was rendering them as one paragraph before the change too. Rendered output is identical.

**2. `sharing.md` in `ti-expert`** (227 lines, 10 sections). Files arriving into the app were covered by `file-type-association.md`; files leaving it were not. The reference is organized around the platform asymmetry — Android needs no module, iOS still does, because the SDK exposes nothing wrapping `UIActivityViewController` — since that fact explains most of the confusing sharing code in older projects.

Wiring done in the same commit: the skill `description` and both index entries, the README "When it activates" list and example prompts, two `EXAMPLE-PROMPTS.md` prompts with a checklist line, and the CHANGELOG entry under `[Unreleased]`.

While counting, the README was found two references behind — it said 24 in one place and 25 in another, and `ti-expert` has 26. Both corrected. This is the third release in a row where that count had drifted.

## Verified in the 4.4.2 session

- `npm test` → **118 passing, 24 suites, 0 failures.**
- `sharing.md`: 11 index anchors, all resolving; 2 relative links, both to a file that exists.
- The reflow checks listed above.

**No evals were run.** The skill-creator's `run_eval.py` scored 0/5 on a known-good control in aiskills on 2026-08-01 — it returned zero for everything. If triggering ever needs measuring, the positive control comes first.

## Local install

This machine runs TiTools via `npm link`, so the `titools` binary executes the working tree. `npm publish` refreshes *other people's* installs, never this one; `isDevMode()` detects the repo's `.git` and skips `npm update -g` so the link survives.

## Closed after the release

Two items from this file, both landed after `v4.4.2` was cut and neither shipped in it.

- **`file-type-association.md` now has example prompts.** It went out in 4.4.1 with none, so 237 lines of reference had nothing checking the skill still triggers on them. Two prompts phrased as the symptom (Files previewing the document; an Android filter that matches `backup.snapgym` but not `backup.2026-08-10.snapgym`) plus a checklist line. No release needed — `EXAMPLE-PROMPTS.md` is not in `package.json` → `files`, so it never reaches users.
- **aiskills' leftover hard-wrap is gone** (`9969de7`). Worth recording how the first count was wrong: this file previously said 9 of 67 files were affected. That number came from a heuristic that counted numbered-list items as wrapped prose, so 6 of the 9 were false positives and a 7th (`vscode-extension-dev/references/debugger.md`) was structural on purpose. The real answer was **two** `stitch-showcase` references plus the header block of that repo's own `status.md`, which `f61b57c` had missed. Same verification as here: identical with whitespace collapsed, code blocks untouched, 52 tests passing.

## Open, not blocked

- **`scripts/generate-toc.mjs` and `fix-fences.mjs` live only here** — `~/Developer/openSource/aiskills/scripts/` does not exist, so nobody there can regenerate or `--strip` the indexes that were produced across the fence. Porting is not a `cp`: `fix-fences.mjs` carries Titanium-specific reasoning.
- **The `manifest.test.js` port went further than aiskills' version** — it also covers agents, the nested hook format and the `files` allowlist in both directions. Worth sending back.
- **`docs/PENDING-IMPROVEMENTS.md`, TiTools item 2, is obsolete** (it plans a migration v4.0.0 reversed). Items 1 and 3 still stand.
- **`docs/actualizar-skill.md` describes a pending correction to `ti-howtos`.** Not checked against the current skill — it may already be fixed.

## Blocked by others

Nothing.

## Deployment

Not applicable in the usual sense — distribution *is* the release. Nothing here deploys by file sync; a change reaches users only through `npm publish` (CLI) or a pushed `plugin.json` version bump (marketplace). Because those are two separate acts, the channels drift — they had been apart since 2026-08-05 and were realigned today. Check both whenever you need to know what users actually have.
