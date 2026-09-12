# Decisions

Append-only. Newest last. Dates are when the decision shipped, taken from `CHANGELOG.md` and the git history.

---

## 2026-07-15 — Doc-based skills return to TiTools as canonical source

**Decision:** `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides` and `alloy-howtos` ship from TiTools again and are the canonical copies. Shipped in v4.0.0, a breaking change.

**Why:** v3.0.0 had donated them to `tidev/skills`. The handoff produced friction around PR #4 and left improvements with no clear home. The community copies in `tidev/skills` stay, but improvements land here first and reach users through `titools update`.

**Consequences:** `SKILLS` in `lib/config.js` grew back to 8; the five names left `LEGACY_SKILLS`. v3.x users get them reinstalled on their next update. Anyone who prefers the v3.x split can pin `@maccesar/titools@^3.3.0`. Item 2 of `docs/PENDING-IMPROVEMENTS.md`, which planned the migration, is obsolete.

---

## 2026-07-15 — Only Claude Code gets TiTools-managed symlinks

**Decision:** Drop the `~/.gemini/skills/` symlinks. `getPlatforms()` lists Claude Code alone. Shipped in v4.0.0, extending the same change made for Codex in v3.1.0.

**Why:** Running `gemini` showed it auto-discovers `~/.agents/skills/` per the agentskills.io standard — the same path Codex reads. The mirror symlinks made it read both locations and print `Skill conflict detected` for every installed skill at startup. The extra path was not just redundant, it was noisy.

**Consequences:** `cleanupLegacyArtifacts()` removes stale Gemini symlinks, and is now called from `titools install` as well as `update` — which also fixed a latent gap where the equivalent Codex cleanup only ran on update. The Knowledge Index written into `GEMINI.md` points at `.agents/skills`.

---

## Standing — `package.json` and `plugin.json` versions bump together

**Decision:** Both version fields move to the same number in a single release commit, before tagging.

**Why:** Claude Code caches marketplace plugins in `~/.claude/plugins/cache/` and invalidates on the `version` field in `plugin.json`. Anthropic's wording: *"If you change your plugin's code but don't bump the version in `plugin.json`, your plugin's existing users won't see your changes due to caching."*

**Precedent:** v2.6.0 shipped with `plugin.json` frozen at `3.0.0` from an earlier branch. npm published 2.6.0 while the marketplace announced 3.0.0; the release had to be amended by hand.

---

## Standing — `ora` wraps async `execFile`, never `execFileSync`

**Decision:** Shell commands under a spinner use `promisify(execFile)`.

**Why:** `execFileSync` blocks the Node event loop, so the spinner freezes into a static dot. Caused the v2.4.2 hotfix.

---

## Standing — Claude Code hooks use the nested `settings.json` form

**Decision:** `{"hooks": [{"type": "command", "command": "…"}]}`, not the flat `{"command": "…", "timeout": …}` form.

**Why:** The flat form fails settings validation at session start. Caused the v2.4.0 → v2.4.1 hotfix.

---

## Standing — `## Community-Discovered Patterns` sections survive audits

**Decision:** Sections under that heading are never deleted when auditing a skill against upstream documentation, even though nothing upstream backs them.

**Why:** They record findings from real projects that the official docs do not cover. An audit that removes everything without an upstream source destroys exactly the content that makes an opinionated skill worth more than the documentation it mirrors.

---

## 2026-08-02 — Project notes live in `docs/project/`, and `docs/` stops being blanket-ignored

**Decision:** Adopt the four-file convention under `docs/project/`. `.gitignore` changes from `docs/` to `docs/*` plus `!docs/project/`.

**Why:** The repo carried roughly twenty markdown documents under `docs/`, none of them tracked, so a clone got none of them and the project's working state lived on one machine. Re-including a subdirectory requires excluding the *contents* of the parent rather than the parent itself — git will not descend into an excluded directory, so `!docs/project/` under a `docs/` rule would have silently done nothing.

**Consequences:** `docs/project/` is versioned; everything else under `docs/` stays local, deliberately — it holds drafted correspondence and fetched doc snapshots that nobody chose to publish. `status.md` is read on demand and must stay out of every `@import` chain.

---

## 2026-08-02 — A cached plugin is not an installed plugin

**Decision:** `lib/claude-plugin.js` treats the marketplace plugin as present only when it is listed under `enabledPlugins` in `settings.json` (or `settings.local.json`) **and** carries the entry in its cache. Detection fails toward `false` on missing or malformed settings. Shipped in v4.2.0.

**Why:** TiTools ships through two channels and a user can have both. When the plugin is enabled it already serves the skills and commands, so a CLI copy shows up twice. But deciding that from the cache directory alone is wrong in the other direction: uninstalling a plugin removes it from `enabledPlugins` and leaves the cache behind. In the sibling project (aiskills v1.16.0) that leftover made the CLI skip every symlink and report `0/6 skills linked`, leaving Claude Code with no skills and no way to repair it by re-running install.

The asymmetry is what sets the default: a wrong `false` costs a duplicate entry in an autocomplete; a wrong `true` costs the user every skill they have.

**Consequences:** `createSkillSymlinks` and `installCommands` return a `skipped` array; `doctor` subtracts plugin-served entries from the expected total and reports the plugin's state as its own section. Ported from aiskills with its tests, so the two failure modes are covered rather than rediscovered.

---

## 2026-08-02 — Slash commands ship from `commands/`, not `.claude/commands/`

**Decision:** The three commands move to a versioned `commands/` directory listed in `package.json` → `files`, with `COMMANDS` in `lib/config.js` driving installation. Shipped in v4.2.0.

**Why:** They had lived in `.claude/commands/` since April, which is the first line of `.gitignore`. Marketplace users never got them (the plugin serves `commands/` from the repo) and npm users never got them (the tarball carries only what `files` lists), while the README documented all three under a "Plugin only" heading. They appeared to work because Claude Code reads `.claude/commands/` as project-local commands — but only for someone sitting inside this repo, which is not a Titanium project and cannot meaningfully run any of them.

**Consequences:** `test/manifest.test.js` fails on any drift between `COMMANDS` and the directory, on a frontmatter `name` that stops matching its filename, and on `commands/` falling out of `files`. (Originally `test/commands.test.js`; folded into the broader manifest suite when that was ported from aiskills on the same day.)

---

## 2026-08-30 — PurgeTSS audits use documentation and released source

**Decision:** The maintainer-only `titools-skill-auditor` treats `purgetss` as a mixed narrative-and-implementation source. It audits concepts and examples against `purgetss-docs`, then checks exact command availability, aliases, defaults, output paths and project-type behavior against the released `purgeTSS` changelog, implementation and tests.

**Why:** PurgeTSS v7.15.0 introduced selected standalone commands for Titanium Classic while leaving the utility-class workflow Alloy-only. The documentation describes that boundary, but exact behavioral contracts such as output paths, default padding, qualifier lists and module aliases live most reliably in the release source and tests.

**Consequences:** The auditor caches both upstream repositories as `.purgetss-docs` and `.purgetss-source`, records both commit hashes in the audit report, and requires disagreements to be resolved according to the kind of claim instead of treating either source as universally authoritative.

---

## 2026-09-08 — `ti-reuse-first` keeps its name, and reachability is measured rather than argued

**Decision:** The skill added in 4.21.0 stays named `ti-reuse-first`. Its reachability was raised by naming it in the SessionStart hook, by three pointers in bodies that always load (`ti-expert`, `ti-ui`, `/ti-new-screen`), and by a description rewritten to open on the user's own words in Spanish and English. The name was A/B-tested against `ti-before-you-build` and the two tied.

**Why:** The skill was reachable in practice only through a note buried in `ti-expert/references/patterns.md`, a file read after the decision to build has already been made. Three of the five suspected causes turned out to be wrong, and only measurement separated them. A disposable Alloy fixture, 8 positive and 4 negative queries, 2 repetitions, counting `Skill` invocations in `claude -p --output-format stream-json`. A positive control ran first and fired the correct skill 2/2 — without it no reading would have been trustworthy, which is the failure this project's sibling already paid for once.

The baseline fired on **16/16** positives with **0/8** false positives, so "does it trigger" had no headroom and could not have distinguished anything; the metric moved to "does it go **first**", which sat at **12/16**. `ti-expert` never competed for that turn — the diagnosis had predicted it would. The actual competitor was `superpowers:brainstorming`, which took the first turn on both "another screen" queries in all four runs. After the change: **16/16 first, 0/8 false positives**. The name variant scored 15/16, one run apart.

**Consequences:** A tie means the name carries no measurable signal here, so it is settled by convention — `ti-<domain>` — and by the ordering that `first` encodes in an alphabetical skill list. No `LEGACY_SKILLS` entry is needed, since 4.21.0 had not shipped when the test ran. `test/manifest.test.js` caught a description of 1403 characters against the spec's 1024-character cap during this work, which is the guardrail that keeps the rewritten description honest. The fixture and the runner are disposable and were not committed; the numbers above are the record.

---

## 2026-09-11 — The API comes from the SDK's apidoc; the guides come from the new site; `titanium-docs` becomes an archive

**Decision:** The doc-based skills read three upstream roots instead of one. `ti-api` audits against `tidev/titanium-sdk:apidoc/*.yml` at the newest GA tag, cross-checked with `tidev/titaniumsdk.com:registry/sdk/<version>/`. The four guide skills audit against `tidev/titaniumsdk.com:content/docs/` where a page exists, and keep `tidev/titanium-docs` as an additive archive. The archive never overrides a live source and nothing is deleted from a reference for being absent from the new site.

**Why:** `tidev/titanium-docs` is frozen and being archived under TI-52. The SDK's `regen-docs.yml` now dispatches to `titaniumsdk.com` and labels the job that still notifies the old repo `Notify titanium-docs (legacy)`. It is not merely deprecated, it is already behind: `Ti.UI.Toolbar.hideSharedBackground` (apidoc 2026-07-12) and `Ti.UI.ListView.snapping` (apidoc 2026-07-20) are in the SDK and in the site's `registry/sdk/main/`, and never reached it. An audit run against it reports green against a corpus that stopped moving.

The new site is not a smaller replacement to fear. TiDev's own `docs/legacy-guide-audit.md` classifies the 336 legacy pages as 121 rewrite, 121 merge, 2 keep and 92 archive — and 91 of the 92 are release notes, the 92nd the discontinued Atom package. No guide topic is dropped. What changes is density: 1390 KB of legacy prose becomes 219 KB. TiTools keeps the full corpus, so this repo now carries material the official docs no longer do.

**Consequences:** Two new gitignored cache symlinks, `.titanium-sdk` and `.titaniumsdk-site`. `titools-skill-auditor` gained a precedence section, per-skill live/archive mappings, and two scripts: `apidoc-coverage.mjs` (which apidoc members a reference never names) and `api-map.mjs` (derives type → reference from the files rather than a hand-written table that drifts). Measured on the day: `ti-api` names 2682/2682 members against `13_4_1_GA` after closing two gaps, and 6 against `main`, all of them unreleased APIs bound for 14.0.0.

Two traps are written into the auditor because both were hit while establishing this. `registry/sdk/_pool/` is content-addressed and shared across every version, so grepping it says some version has an API, not which — that is how `hideSharedBackground` was first misreported as shipped in 13.4.1. And a hand-written type-to-reference map sends an audit at the wrong file and reports every member of a type as missing.

The auditor travels with the repo: `.gitignore` blocks `.claude/*` but re-admits `!.claude/skills/`, so `titools-skill-auditor` and its new `scripts/` are versioned like anything else.
