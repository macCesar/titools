# Status — 2026-09-05

**Phase:** v4.20.0 shipped; live and maintained
**Session by:** Claude Code · Opus 5 (PurgeTSS audit and release) — the ti.game re-pin landed in a separate session
**Deployed:** `@maccesar/titools@4.20.0` on npm (registry `dist-tags.latest`, published 2026-09-06T02:54:36Z), tag `v4.20.0`, GitHub Release, and `plugin.json` at `4.20.0` on `main`.
**Branch:** `main`, aligned with `origin/main`, nothing unpushed; tag `v4.20.0` points at release commit `a2f1c9c`.
**Sibling:** `../aiskills` — no shared CLI machinery changed (`git diff v4.19.0..v4.20.0 -- lib/ bin/` is empty), so no port was required.

## Where things stand

The `purgetss` skill reflects PurgeTSS **v7.17.0**. The `images:` section is documented as exactly five keys — `quality`, `format`, `autoSync`, `confirmOverwrites`, `files` — in the order the CLI actually writes them, with the unknown-key validation that aborts a run before writing anything, at both the top level and inside each `files[]` entry. `quality` is scoped to `webp`/`jpeg`/`avif`/`tiff`; PNG is written with `compressionLevel: 9` and GIF takes no quality parameter. `install-dependencies` and `create --dependencies` document the flat `eslint.config.mjs` template installed with only `eslint` and `@eslint/js`, plus the state of projects scaffolded between December 2025 and v7.17.0, whose lint could never run.

The `ti-game` skill is re-pinned from `c216e7f` to upstream `3bea2f4` (2026-09-02), covering gamepads, circular horizontal worlds, `solidimpact`, the 34-demo catalog, and the `0.5.0`/`0.6.0` manifest split.

## In flight

- Nothing shipping. One open decision below.

## Requirements

- R3 is satisfied: npm `4.20.0`, tag `v4.20.0`, and `plugin.json` on `main` agree.
- R6 is satisfied for `purgetss`: every contract was checked against the released v7.17.0 source, not only the prose docs — `gen-scales.js` for the per-format `quality` behavior, `images-config.js` for the key whitelist, `images.js` for where the validation runs, and `dependencies.js` / `create.js` for the ESLint packages.
- R7–R9 remain satisfied: frontmatter validates, and the full suite is green.
- R10 is not implicated: this release changed no shared CLI machinery.

## Next step

Decide whether to split `references/cli-commands.md`. It is at **815 lines against the auditor's 800-line cap**, and it was already at 796 before this release, so it is not a new overflow. The measured split point: of the 21 anchor links pointing into that file from 11 other files, 20 target asset commands (`#brand-command` ×7, `#semantic-command` ×6, `#images-command` ×5, plus `shades` and `build-fonts`), so a `cli-commands-assets.md` carrying those would leave the utility-class lifecycle behind and require repointing ~20 anchors.

## Verified vs. assumed

- Verified now: 348/348 tests pass across 31 suites.
- Verified now: `main` matches `origin/main` with zero unpushed commits; `v4.20.0` resolves to `a2f1c9c`.
- Verified now: publish workflow run `34007659679` concluded `success`, including its own tag-versus-version-files guard.
- Verified now: the npm registry reports `4.20.0` as latest. Note that `npm view` returned the previous version for several minutes after the publish — CDN caching, not a failed release.
- Verified against upstream: `purgeTSS@bb2eb8e` (v7.17.0) and `purgetss-docs@f7018ea` (v1.1.13).
- **Assumed, not verified:** the ti.game re-pin to `3bea2f4` was produced by a separate session. Its full diff was read before it was committed and shipped, but its claims were **not** re-checked against the ti.game repository from this session — the upstream commit hash, the gamepad surface, and `worldWrapX` / `solidimpact` semantics are taken on that session's word.

## Known pending

- A local Claude Code marketplace installation still needs `/plugin marketplace update maccesar-titools` followed by `/reload-plugins`; neither published channel is blocked by it.
- Upstream docs gap, on the PurgeTSS side rather than this repo: `docs/commands.md` at purgetss.com still lists `npm i -D eslint eslint-config-axway eslint-plugin-alloy` and an `eslint.config.js`. v7.17.0 installs only `eslint` and `@eslint/js` and ships `eslint.config.mjs`. The skill follows the released code.
