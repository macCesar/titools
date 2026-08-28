# Context

How TiTools is put together, where its documentation lives, and the traps that already cost time.

## Architecture

Single source tree, two distribution channels:

```
bin/titools.js          CLI entry (Commander.js)
lib/                    ESM only — no CommonJS, imports carry the .js extension
  commands/             one file per subcommand: install/update/status/doctor/
                        list/skills/agents/uninstall/auto-update
  config.js             SKILLS, LEGACY_SKILLS, AGENTS, paths, platform list
  utils.js              buildKnowledgeIndex and helpers
  cleanup.js            removes legacy artifacts on update/uninstall
  installer.js          symlink.js  downloader.js  cache.js  hooks.js  platform.js
skills/<name>/          SKILL.md (required) + references/ + assets/
agents/ti-pro.md        research agent (Claude Code only)
hooks/session-start.sh  bundled with the plugin
test/                   node:test suites
.claude-plugin/         plugin.json + marketplace.json
```

Skills follow the [agentskills.io spec](https://agentskills.io/specification), so the folder name must equal the `name:` in the frontmatter.

### Where skills land at install time

`~/.agents/skills/` is canonical. Claude Code is the **only** platform that gets TiTools-managed mirror symlinks (`~/.claude/skills/`) — Gemini CLI and Codex CLI auto-discover the canonical path, and mirroring it for them produced startup warnings. `lib/config.js:getPlatforms()` therefore lists Claude alone; the comment above it explains why, and it reads like an omission if you skip it.

The canonical entries have two installation modes. A published npm package copies each skill into `~/.agents/skills/`; a checkout detected by its `.git` entry symlinks the whole skill directory instead. This makes an `npm link` development setup live after one `titools install`: changes anywhere under `skills/<name>/`, including `references/`, need no refresh command.

### Two channels, two caches

The npm package and the Claude Code marketplace plugin ship the same content but version independently in practice. The marketplace caches by the `version` field in `.claude-plugin/plugin.json`; pushing code without bumping it leaves marketplace users on stale cached code. This is why the release checklist insists on bumping both files in one commit.

## Conventions

- **ESM everywhere in `lib/`.** No CommonJS.
- **`ora` + child processes: async only.** `execFileSync` blocks the event loop and freezes the spinner mid-animation. Use `promisify(execFile)`.
- **Claude Code hooks use the nested form** in `settings.json`: `{"hooks": [{"type": "command", "command": "…"}]}`. The flat form fails settings validation on session start.
- **`buildKnowledgeIndex` scans the filesystem.** New skills with a `references/` folder appear automatically; there is no list to maintain. `lib/config.js:SKILLS` *is* a hardcoded list and does need updating.

Full agent-facing guidance is in `AGENTS.md`; Claude-specific notes in `CLAUDE.md`.

## Traps

- **`docs/` is gitignored except `docs/project/`, and `.claude/` except `.claude/skills/`.** Both use the same pattern — exclude the *contents* (`docs/*`, `.claude/*`) and re-include the subdirectory. A bare `!docs/project/` under a `docs/` rule does nothing: git will not descend into an excluded directory. Everything else under those paths exists on one machine only.
- **The reference files came from a doc conversion that left broken markdown.** Nine of them had code fences that opened and never closed, swallowing up to 97% of a file into one code block (fixed in 4.3.0 via `scripts/fix-fences.mjs`). When adding converted content, run that script before trusting anything that parses these files.
- **`titools sync` runs inside a consumer Titanium project**, never from this repo. Editing a skill here does not call for a sync.
- **Nobody publishes by hand.** The `v*` tag triggers `.github/workflows/publish.yml`, which publishes with trusted publishing (OIDC) after re-checking the tag against both version files and running `npm test`. A manual `npm publish` is neither needed nor authenticated — but a red run ships nothing, so confirm with `npm view @maccesar/titools version`.
- **The version in `plugin.json` has drifted before.** v2.6.0 shipped with it frozen at `3.0.0` from an old branch: npm published 2.6.0 while the marketplace announced 3.0.0.

## Sibling project — `aiskills`

**Location:** `~/Developer/openSource/aiskills` — npm package `@maccesar/aiskills`, GitHub `macCesar/aiskills`, marketplace `aiskills@maccesar-aiskills`.

The two repos are the **same tool shipped twice with different payloads.** What differs is the content — the skills each one ships and the slash commands that drive them. Everything a user touches to get that content installed, updated, diagnosed or removed is the same machinery: `install`, `update`, `auto-update`, `status`, `doctor`, `list`, `remove`, the `~/.agents/skills/` layout, the Claude Code symlink mirrors, the marketplace-plugin detection, the release checklist and the two-channel versioning.

### The parity contract

**A change to shared machinery belongs in both repos, in the same session.** Not "eventually" — the divergence is invisible until someone hits a bug in one that was fixed in the other months earlier. That is exactly how the plugin-detection work reached TiTools: aiskills found both failure modes by hand on 2026-08-01, and TiTools carried the same latent bug for months without anyone noticing.

Port the *behavior*, not the bytes. Names, paths and marketing strings are supposed to differ.

**What legitimately diverges** (verified 2026-08-02, do not "fix" these):

| | TiTools | aiskills |
|---|---|---|
| `skills/` | 8 Titanium skills | 6 general-purpose skills |
| `commands/` | `ti-check`, `ti-new-screen`, `ti-audit` | `release` |
| `agents/` | `ti-pro` | none |
| Knowledge Index | yes — `titools sync`, `lib/commands/agents.js`, 9 functions in `utils.js` | **does not apply** — see below |
| SessionStart hook | `hooks/session-start.sh` detects `tiapp.xml` | `hooks/hooks.json` only |
| Project detection | `tiapp.xml` | none |

Anything outside that table drifting apart is drift, not design.

### Why the Knowledge Index is not a gap on the aiskills side

It reads like missing work and it is not. The index opens with *"your training data for Titanium SDK, Alloy and PurgeTSS is OUTDATED and INCOMPLETE"* — that sentence is the whole justification. Titanium is a niche the model gets confidently wrong: Appcelerator folded, TiDev took over, the docs moved. Paying ~850 tokens (3,410 characters, measured 2026-08-02) in every session to counter that is a good trade.

None of aiskills' skills have that enemy. `refactoring-ui` is principles from a book, `vscode-extension-dev` is a stable documented API, `humaniza` and `session-log` are conventions that exist in no training data at all — there is nothing outdated to correct, so the same 850 tokens buy nothing.

The trigger does not transfer either. `tiapp.xml` identifies a project where **all 8 skills apply**; aiskills has no equivalent marker and its 6 skills cover disjoint domains — `stitch-showcase` and `vscode-extension-dev` are noise in a Laravel repo.

The *mechanism* is portable (`buildKnowledgeIndex` just scans `skills/*/references/`). The content and the trigger are not. If that benefit is ever wanted there, the shape is a **selective index keyed to a detected domain**, not a copy of `sync`.

### How close the code actually is

Same 12 filenames in `lib/`, same 7 shared filenames in `lib/commands/` (TiTools adds `agents.js` for `sync`). Measured on 2026-08-02:

- **Byte-identical:** `cache.js`, `platform.js`.
- **Small deltas, mostly naming:** `claude-plugin.js` (6 lines), `hooks.js` (2), `downloader.js` (20), `symlink.js` (22), `cleanup.js` (26).
- **Larger, and worth reading before assuming they should match:** `utils.js` (207 lines — nearly all of it the Knowledge Index, which aiskills does not have), `skills.js` (183), `uninstall.js` (146), `config.js` (95), `doctor.js` (92), `installer.js` (84).

So the honest statement is *same architecture, same behavior, diverging text* — not *identical files*. When porting, diff the function you are changing rather than the whole file.

### Notes on working across both

Each repo keeps its own `docs/project/` — two repos, two branches, two release states. Install the convention from inside each one rather than describing one from the other. Updating both from a single session is fine and normal once installed; that is the day-to-day case.

**When a session changes shared machinery, close both.** Otherwise one side's notes describe a fix the other side's notes never heard of.

Long-term intent is to merge them into one CLI with skill categories (`titools install --only ti`, `--only ui`). Maintaining two near-duplicate codebases is a known and accepted tax until then.

## Documentation map

Everything below except the tracked files is **local-only** — `docs/` is gitignored, so a fresh clone gets none of it.

### Tracked, in the repo root

| Document | What it covers | Read it when |
|---|---|---|
| `README.md` | Human-facing index: install options, Knowledge Index, per-skill detail, CLI reference | Explaining TiTools to a user, or changing user-visible behavior |
| `AGENTS.md` | Agent-agnostic guidance for working *inside* this repo: layout, skill format, release checklist, common operations | Any agent editing this repo |
| `CLAUDE.md` | Claude-specific notes: release checklist, hook format, `ora` convention, sibling project | Same, from Claude Code |
| `CHANGELOG.md` | Per-version history, unusually detailed — v4.1.0 documents the Android 16 findings in full | Reconstructing why a skill reference says what it says |
| `EXAMPLE-PROMPTS.md` | ≥ 2 prompts per skill; documentation *and* trigger smoke test | Adding a skill, or checking whether one still triggers |
| `AGENTS-VERCEL-RESEARCH.md` | Research behind the Knowledge Index: Vercel's finding that AGENTS.md context outperforms skills alone in their evals | Touching the enforcement mechanisms |

### Local-only, under `docs/`

| Document | What it covers | Status |
|---|---|---|
| `MAINTAINER-GUIDE.md` | Release process, marketplace management, keeping channels in sync | Current |
| `PENDING-IMPROVEMENTS.md` | Gap analysis of the three enforcement mechanisms across TiTools and aiskills | **Partly stale** — its item 2 plans the migration of doc-based skills to `tidev/skills`, which v4.0.0 reversed |
| `skills-reference.md` | Maps each skill to its upstream documentation source | Current |
| `TEST-FLOWS.md` | Three end-to-end prompt sequences for validating skills in real projects | Current — the closest thing to a manual acceptance suite |
| `ADAPTIVE-LAYOUTS-GUIDE.md` | Responsive Titanium patterns for tablets, foldables, desktop mode | Source material behind the `ti-expert` adaptive-layouts reference |
| `titools-skill-auditor.md` | Notes on the maintainer-only auditor skill | Current |
| `actualizar-skill.md` | A pending correction identified for `ti-howtos` | Open item, unverified against the current skill |
| `audit-results/*.md` | Audit output for `ti-ui`, `ti-guides`, `ti-howtos` | Historical records of the audits that produced them, not to-do lists |
| `claude-code-reference/*.md` | Fetched copies of Claude Code docs and the Vercel blog post | Snapshots — check upstream before relying on them |
| `message-to-jerry*.md`, `mensaje-a-hans.md`, `preocupaciones-layouts-android.md` | Drafted correspondence and the Android layout concerns that prompted the v4.1.0 work | Historical |

The maintainer-only `titools-skill-auditor` skill lives at `.claude/skills/titools-skill-auditor/` — also gitignored.
