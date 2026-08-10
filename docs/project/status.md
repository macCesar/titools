# Status — 2026-08-10

**Phase:** live and maintained. **v4.4.2 tagged, pushed and released on GitHub.** The one thing left is `npm publish --access public`, which needs the maintainer's 2FA and has not been run.

**Sibling:** `~/Developer/openSource/aiskills` (`@maccesar/aiskills`) — shares this repo's `lib/`. See `context.md` § "Sibling project" for the parity contract.

## Release state — one channel still behind

| Channel | Version | Checked |
|---|---|---|
| npm | **4.4.0** | `npm view @maccesar/titools version`, 2026-08-10 — two releases behind |
| Claude Code marketplace | 4.4.2 | `plugin.json` on `main`, tag `v4.4.2` pushed, GitHub release created |

**v4.4.1 was tagged and pushed on 2026-08-05 and never published to npm.** Same failure as v4.1.0, which sat unpublished for two days in July: step 8 of the checklist — `npm publish` — is the one that gets skipped, because tagging feels like finishing. CLI users never received `file-type-association.md` at all.

**The 4.4.2 tarball carries both releases' content**, so publishing once clears the gap. It has not been published yet: `npm publish --access public` needs 2FA and only the maintainer can run it. Confirm with `npm view @maccesar/titools version` afterwards rather than assuming the tag implies the publish.

This is the second time the same step has been missed in six weeks. If it happens again, the fix is mechanical rather than a note: a check that compares `npm view` against `plugin.json` and fails loudly.

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

## Verified this session

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

Not applicable in the usual sense — distribution *is* the release. Nothing here deploys by file sync; a change reaches users only through `npm publish` (CLI) or a pushed `plugin.json` version bump (marketplace). Because those are two separate acts, the channels drift — as they have since 2026-08-05. Check both whenever you need to know what users actually have.
