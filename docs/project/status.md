# Status — 2026-08-03

**Phase:** live and maintained. **v4.3.0 shipped on both channels** on 2026-08-02.

**Branch:** `main`, in sync with `origin/main`. Uncommitted: the `ti-expert` feedback
work and its documentation sync, described under "Changed 2026-08-03". Nothing is
released yet — the CHANGELOG entry sits under `[Unreleased]` and no version was bumped.

**Sibling:** `~/Developer/openSource/aiskills` (`@maccesar/aiskills`) — shares this
repo's `lib/`. See `context.md` § "Sibling project" for the parity contract.

## Release state — both channels on 4.3.0

| Channel | Version | Verified |
|---|---|---|
| npm | 4.3.0 | tarball downloaded from the registry and inspected, 2026-08-02 21:36 UTC |
| Claude Code marketplace | 4.3.0 | `plugin.json` on `main`, tag `v4.3.0` pushed, GitHub release created |

v4.3.0 bundles **4.2.0, which was prepared but never released**, so the tag and the
release notes carry both CHANGELOG sections. Users going from 4.1.0 get everything at
once: plugin detection, the three slash commands, the fence repairs and the indexes.

Verification went past the version number — the published tarball was downloaded and
checked: `commands/` present (3 files), `lib/claude-plugin.js` present, `scripts/` and
`.claude/` correctly absent, indexes present in the references.

What 4.2.0 + 4.3.0 shipped:

1. **Marketplace-plugin detection** (`lib/claude-plugin.js`, ported from aiskills
   v1.16.1 with its tests). Nothing previously checked whether the plugin already
   served a skill, so having both channels installed duplicated all 8 in the
   autocomplete. See `decisions.md` for why a cache directory is not proof of
   installation.
2. **The three slash commands actually ship.** They sat in gitignored
   `.claude/commands/` since April, reaching neither channel while the README
   advertised them.
3. **Nine references had unclosed code fences**, one of them swallowing 684 of 701
   lines into a single code block. Repaired; content verified byte-identical.
4. **83 references gained a table of contents** (1,038 anchors, none broken).
5. **The maintainer-only auditor skill is versioned**, via the same `.gitignore`
   pattern used for `docs/project/`.

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
- Everything listed under the release above, landed as 7 semantic commits plus
  `chore(release): v4.3.0`.

## Changed after the release

Documentation only, no version bump — the content joins the next real release's
CHANGELOG:

- **How a release propagates to each install channel**, ported from aiskills into
  `CLAUDE.md` with a short pointer in `AGENTS.md`. `npm publish` feeds one channel;
  the marketplace cache needs `/plugin marketplace update maccesar-titools` +
  `/reload-plugins`, and third-party marketplaces do not auto-update. The mechanics
  were verified in aiskills, not here — the port says so rather than claiming a
  verification that did not happen.

Also this session, in the sibling repo: the three references over 300 lines gained
indexes, run with this repo's `scripts/generate-toc.mjs`. aiskills has **no unclosed
fences** — that damage was specific to the Titanium docs conversion. The scripts
themselves were not copied there; see "Open, not blocked".

## Changed 2026-08-03

`ti-expert` gained three feedback references (`feedback-surfaces.md`,
`feedback-widget-contracts.md`, `feedback-migration.md`) and revisions to ten existing
ones. Reviewed against the skill-creator guidance — structurally clean: SKILL.md at
207 lines, all 24 references linked from it, every file over 300 lines carrying an
index, zero broken relative links or anchors (checked with a script over all 24), the
`ControllerAutoCleanup.js` asset still reachable, and no protected
`## Community-Discovered Patterns` heading lost in the rewrite.

Four gaps found and closed:

- The rewritten `description` had dropped `auditing`, `memory leaks`, `migrating legacy
  apps` and the `tablets, foldables, large screens` wording. `commands/ti-audit.md:8`
  invokes the skill precisely for "memory leaks", and `adaptive-layouts.md` is 591 lines
  whose trigger vocabulary had disappeared. Restored alongside the new feedback triggers.
- `EXAMPLE-PROMPTS.md` had no prompt touching feedback surfaces. Two added, plus a
  checklist line.
- The README said 21 references in two places (now 24) and its "When it activates" list
  omitted four topics — closing the adaptive-layouts item that was open below.
- `feedback-widget-contracts.md` told the reader not to fold these Widgets into TiKit
  without saying what TiKit is; it is only explained inside the `purgetss` skill.
  Reworded as a general boundary rule.

**No evals were run.** The skill-creator's triggering measurement is `run_eval.py`, the
same instrument that scored 0/5 on a known-good control (`audit-codebase`) in aiskills
on 2026-08-01 — it returned zero for everything. Running it here would repeat that
mistake. If triggering ever needs measuring, the positive control comes first.

## Local install

This machine runs TiTools via `npm link` — `/usr/local/lib/node_modules/@maccesar/titools`
is a symlink to this repo, so the `titools` binary executes the working tree rather
than what npm published. `npm publish` refreshes *other people's* installs, never this
one; `isDevMode()` detects the repo's `.git` and skips `npm update -g` so the link
survives.

`titools update` was run on 2026-08-02 and the installed skills now match the repo
(`adaptive-layouts.md` 577 = 577, `purgetss` 33 = 33, the three slash commands in
`~/.claude/commands/`). Before that they were from May 18.

## Open, not blocked

- **`scripts/generate-toc.mjs` and `fix-fences.mjs` live only here.** aiskills was
  indexed by running them across the fence, so nobody there can regenerate or
  `--strip` those indexes. Porting them is not a `cp`: `fix-fences.mjs` carries
  Titanium-specific reasoning and the `*(See full overview in titanium-docs)*`
  boundary pattern, which would need adapting.
- **The `manifest.test.js` port went further than aiskills' version.** It now also
  covers agents, the nested hook format, and the `files` allowlist in both
  directions — what must ship and what must not. That extension is worth sending
  back the other way; aiskills has no agents but does have the hook and `files`
  concerns.
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
