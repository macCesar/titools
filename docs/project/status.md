# Status — 2026-08-02

**Phase:** live and maintained. v4.1.0 is out on both channels; **v4.2.0 is built
and green but not released** — see below.

**Branch:** `main`, in sync with `origin/main` (0 ahead, 0 behind), with the
uncommitted changes listed below.

**Sibling:** `~/Developer/openSource/aiskills` (`@maccesar/aiskills`) — shares this
repo's `lib/`. Not opened this session; its own state is unknown from here.

## Release state — both channels on 4.1.0

| Channel | Version | Verified |
|---|---|---|
| npm | 4.1.0 | `npm view` — published 2026-08-02 20:33 UTC |
| Claude Code marketplace | 4.1.0 | `.claude-plugin/plugin.json` on `main`, tag `v4.1.0` pushed |

The release checklist is complete for 4.1.0. It had stalled at step 8 — the tag was
pushed on 2026-07-31 but `npm publish` never ran, leaving CLI users on 4.0.0 without
the Android 16 resizability work in `ti-expert` for two days. Published this session.

The `README.md` correction below made it into the published tarball: the README on
npm reads "21 reference guides".

## v4.2.0 — built, not released

Version bumped in `package.json`, `.claude-plugin/plugin.json` and the lockfile;
CHANGELOG written. Steps 1–4 of the release checklist are done. **Nothing is
committed, tagged, pushed or published.**

Two things ship in it:

1. **Marketplace-plugin detection** (`lib/claude-plugin.js`, ported from aiskills
   v1.16.1 with its tests). Nothing previously checked whether the plugin already
   served a skill, so having both channels installed duplicated all 8 in the
   autocomplete. See `decisions.md` for why a cache directory is not proof of
   installation.
2. **The three slash commands actually ship.** They sat in gitignored
   `.claude/commands/` since April, reaching neither channel while the README
   advertised them.

## Verified this session

- `npm test` → **73 passing, 17 suites, 0 failures** (was 53/11 before the new
  tests).
- `node bin/titools.js doctor` runs clean and reports the new sections: slash
  commands `0/3 installed` (correct — this machine has not run the new install
  yet) and `Marketplace plugin: Not installed`.
- `npm publish --dry-run` → `maccesar-titools-4.2.0.tgz`, 176 files, 642.2 kB, with
  `commands/ti-check.md`, `ti-new-screen.md` and `ti-audit.md` present. Worth
  knowing: `README.md` ships in the tarball even though `files` does not list it —
  npm always includes it, and it is the npmjs.com landing page. `commands/` is not
  special-cased that way, which is why it had to be added to `files` by hand.
- 8 skills under `skills/`, matching `lib/config.js:SKILLS` and the README table.

## Changed this session

- Installed the `docs/project/` convention: these four files, the pointer block in
  `CLAUDE.md` and `AGENTS.md`, and the `.gitignore` fix that makes the directory
  trackable.
- `README.md:345` said "18 reference guides" for `ti-expert`; corrected to 21. The
  file contradicted itself — the table at line 704 already said 21. The drift
  predates 4.1.0: the skill shipped with 19 references, then gained
  `architecture-tiers.md` and `adaptive-layouts.md`.
- `CLAUDE.md:7` said "9 Titanium SDK skills"; corrected to 8, and it now names the
  3 slash commands.
- Everything for v4.2.0 above: `lib/claude-plugin.js`, changes across `config.js`,
  `symlink.js`, `installer.js`, `cleanup.js` and the `skills` / `update` /
  `uninstall` / `doctor` commands, the CLI help strings, `commands/`, two new test
  files, and README / AGENTS.md / CLAUDE.md / CHANGELOG.

All of it is uncommitted.

## Local install is behind

This machine runs TiTools via `npm link` — `/usr/local/lib/node_modules/@maccesar/titools`
is a symlink to this repo, so the `titools` binary executes the working tree, not
what npm published. The **skills copied into `~/.agents/skills/` are from May 18**
and lack the v4.1.0 Android 16 work in `ti-expert` (414 lines installed vs 577 here)
plus two `purgetss` references. `titools update` copies from the repo and fixes it;
`isDevMode()` keeps it from clobbering the link with an npm install.

## Open, not blocked

- **The README's "When it activates" list for `ti-expert` (~line 323) omits
  adaptive layouts.** It lists 8 scenarios, none covering tablets, foldables or
  large screens — which the skill's own `description` announces and which v4.1.0
  expanded. Incomplete rather than wrong.
- **aiskills has no equivalent of `commands.test.js`.** Its `release` command was
  already in `commands/`, so it never had this bug — but nothing there pins
  `COMMANDS` to the directory either.
- **`docs/PENDING-IMPROVEMENTS.md`, TiTools item 2, is obsolete.** It plans migrating
  the doc-based skills to `tidev/skills`; v4.0.0 reversed that. TiTools items 1
  (documenting the `~/.claude/CLAUDE.md` enforcement block in the README) and 3
  (aligning the opinionated skills' descriptions to the `Use when…` form) still stand.
- **aiskills still lacks a SessionStart hook.** Its Knowledge Index item was
  discarded on 2026-08-02 — measured at ~850 tokens per session with no outdated
  training data to correct there, and no `tiapp.xml`-equivalent trigger. The hook,
  with multi-domain detection, is the part still worth doing.
- **`docs/actualizar-skill.md` describes a pending correction to `ti-howtos`.** Not
  checked against the current skill — it may already be fixed.

## Blocked by others

Nothing.

## Deployment

Not applicable in the usual sense — distribution *is* the release. Nothing here
deploys by file sync; a change reaches users only through `npm publish` (CLI) or a
pushed `plugin.json` version bump (marketplace). Because those are two separate
acts, the channels can drift — as they did for two days before this session. Check
both whenever you need to know what users actually have.
