# Requirements

What TiTools must do, and how you would know it does. Index — detail lives in the documents referenced from `context.md`.

## Product

TiTools distributes Titanium SDK skills to AI coding assistants through two independent channels from a single source tree.

### R1 — npm CLI installs skills for any agentskills.io-compatible assistant

`npm install -g @maccesar/titools && titools install` places the skills under `~/.agents/skills/` and creates Claude Code symlinks at `~/.claude/skills/`.

**Accepted when:** after `titools install`, every name in `lib/config.js:SKILLS` exists under `~/.agents/skills/<name>/SKILL.md`, and `titools status` reports the same count. Gemini CLI and Codex CLI must read the canonical path directly — no platform-specific symlinks are created for them (see decision 2026-07-15). When the CLI resolves to a development checkout containing `.git`, each canonical skill directory is itself a symlink to that checkout; a normal npm package installs a copy.

### R2 — Claude Code plugin marketplace ships the same content

`/plugin marketplace add macCesar/titools` then `/plugin install titools@maccesar-titools`.

**Accepted when:** a marketplace install exposes the same skills as the CLI, plus the SessionStart hook and slash commands.

### R3 — Both channels report the same version

`package.json` and `.claude-plugin/plugin.json` carry the identical version string, and both channels actually receive it: `main` pushed for the marketplace, and the `vX.Y.Z` tag pushed so the publish workflow ships the npm package.

**Accepted when:** `npm view @maccesar/titools version`, the `version` field in `.claude-plugin/plugin.json` on `main`, and the newest `vX.Y.Z` tag all agree. This is the requirement most often left half-done — see `status.md`.

### R4 — `titools sync` injects a Knowledge Index into a consumer project

Run from inside a Titanium project (a directory containing `tiapp.xml`), it writes or refreshes a delimited block in that project's `AGENTS.md` / `CLAUDE.md` / `GEMINI.md`.

**Accepted when:** the block is bounded by `<!-- TITANIUM-KNOWLEDGE-START -->` / `<!-- TITANIUM-KNOWLEDGE-END -->`, re-running replaces rather than duplicates it, and the index lists every skill that has a `references/` folder — built by scanning the filesystem, not from a hardcoded list.

### R5 — Deprecated skills are actively removed from existing installs

A skill moved from `SKILLS` to `LEGACY_SKILLS` in `lib/config.js` disappears from a user's machine on their next `titools update`.

**Accepted when:** upgrading over an install that has a legacy skill leaves no directory or symlink for it on any platform path.

## Skills content

### R6 — Reference files mirror official Titanium documentation, not training data

The five doc-based skills (`ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`) are mirrors of <https://titaniumsdk.com>; `purgetss` mirrors the PurgeTSS docs. The three opinionated skills (`ti-expert`, `purgetss`, `ti-ui`) carry judgement on top.

**Accepted when:** each claim in a reference traces to upstream documentation, and the `titools-skill-auditor` skill run against a skill reports no stale content. Sections headed `## Community-Discovered Patterns` are exempt — they have no upstream source by design and must never be deleted by an audit.

### R7 — Every skill's frontmatter is loadable by any compatible agent

**Accepted when:** total frontmatter ≤ 1024 chars, `name` equals the folder name in kebab-case, and `description` starts with `Use when…` in third person, stating triggers rather than summarising the workflow.

### R8 — New skills ship with example prompts

**Accepted when:** `EXAMPLE-PROMPTS.md` contains ≥ 2 prompts per skill. The file doubles as the smoke test for whether a skill triggers at all.

## Engineering

### R9 — Test suite stays green

**Accepted when:** `npm test` passes. Current baseline: 53 tests, 11 suites.

### R10 — Feature parity with the sibling project is considered, not assumed

`@maccesar/aiskills` shares the same `lib/` infrastructure. Every change to `lib/` raises the question of whether the equivalent belongs there.

**Accepted when:** a `lib/` change is either ported to aiskills or the decision not to port it is recorded. Not every change needs porting — Titanium-specific pieces (the Knowledge Index wording, `tiapp.xml` detection, the `ti-pro` agent) do not belong in a general-purpose toolkit.
