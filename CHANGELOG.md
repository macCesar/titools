# Changelog

All notable changes to titools will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [4.6.1] - 2026-08-14

### Changed — `titools list` shows the catalog when nothing is installed

The list printed "No skills installed yet." and stopped, so the one moment you most want to see what is on offer — before installing anything — was the one moment it showed nothing. It now always prints the eight skills, marks each ✗ or ✓, and moves the install hint to the footer next to the count. Descriptions for a skill that is not installed come from the copy bundled in this package, so the row says what the skill is for rather than repeating "not installed" eight times.

### Fixed — The test suite no longer depends on the machine that runs it

Two `list` tests asserted the skill names and the `N/M installed` footer against the real `HOME`, so they only passed on a machine that already had skills installed. That is why 4.6.0 was tagged but never published: the tests passed locally and failed on the runner, which had none. The publish workflow is itself new in 4.6.0, so this was the first time `npm test` had ever run in a clean environment, and it caught a bug that had been latent for as long as the tests existed. Every `list` assertion now runs against a temporary `HOME` and both states are covered explicitly — empty, and seeded with a `SKILL.md`.

Note that 4.6.0 never reached npm — the failing tests blocked its publish. Its tag has since been deleted, so 4.5.0 is followed directly by 4.6.1. Everything listed under 4.6.0 below shipped inside 4.6.1.

## [4.6.0] - 2026-08-14

### Added — `titools list` wraps descriptions instead of truncating them

The list cut every description at the first sentence and, failing that, at 80 characters. Skill descriptions are written to trigger the agent, not to fit a terminal row, so most entries ended mid-thought. They now wrap to two lines aligned under the first, with an ellipsis only where the text genuinely runs past that.

### Added — The ESLint flat config the repo never had

`npm run lint` failed on every run with "couldn't find an eslint.config.js". The script had been dead since ESLint 9 dropped `.eslintrc` support, and the flat config that replaced it was never written — so a lint step that was listed, wired into `package.json` and presumably trusted had never once reported anything. It now covers `bin/`, `lib/` and `test/`; `skills/` is Markdown and templates and is ignored. Its first pass removed seven unused imports, a helper nothing referenced, and three assignments whose results were never read.

### Fixed — Skill descriptions that are YAML-quoted or written across two lines

Two bugs in the same regex. The quoted branch only matched double quotes, and every skill here is single-quoted because the descriptions contain colons and apostrophes — so the fallback branch ran instead and printed the wrapping quotes as part of the text. That fallback ended at the first newline, which silently dropped everything after line one of a multi-line description. The value now ends at the next top-level key, and both quote styles are resolved, including the doubled apostrophe that single-quoted YAML uses to escape.

### Changed — The `purgetss` skill now describes PurgeTSS 7.13.1

It described 7.11.1. PurgeTSS 7.13.0 restructured `purgetss brand` end to end and kept no flag aliases, so five references were not merely stale but wrong: every flag name, every config key, and three logo filenames had changed meaning underneath them. `logo-icon` is the trap — the name survived but now feeds `DefaultIcon.png`, while the Android launcher mark moved to `logo-adaptive`, so following the old text put the artwork on the wrong piece and let the launcher icons fall back to the main logo without complaint.

The branding reference is rewritten against the current guide: the 14 pieces, the per-piece `brand:` block, `--only`, `--optimize`, `LaunchLogo.png`, the 16 iPhone launch images, the 11 per-qualifier Android splashes, and the on-disk config migration that replaced the in-memory translation used from 7.10.2 to 7.12.1. Padding defaults come from `src/core/branding/pieces.js`, not from `purgetss brand --help`, whose strings still read 19 and 20 where the pipeline applies 18, 26 and 26 — a discrepancy the CLI reference now carries as a warning.

The Android launch-background setup moved into `launch-background.md`. It is a self-contained topic reached from three places, and keeping it inline pushed the branding reference past the 800-line cap.

### Added — Publishing to npm from GitHub Actions via trusted publishing

`.github/workflows/publish.yml` runs on a pushed `v*` tag, which is the last thing `/release` does, and publishes the package itself. There is no `NPM_TOKEN` and no secret of any kind: `permissions: id-token: write` lets the runner mint a short-lived OIDC credential that npm verifies against the publisher registered for this package, and npm attaches provenance to the publish automatically as a result. The stale `NPM_TOKEN` repository secret, left behind by a workflow that no longer exists, was deleted.

`npm login` has issued a two-hour session rather than a long-lived token since December 2025, when classic tokens were removed outright, so every release meant re-authenticating by hand. The remaining alternative — a granular access token with 2FA bypass — caps at 90 days, and loses direct publish capability around January 2027. Trusted publishing is the only option that does not expire.

The job refuses to publish a tag that disagrees with the version files: it compares the tag against `package.json` and `.claude-plugin/plugin.json` and exits before `npm ci` if any of the three differ. That is the check this repo needed when 2.6.0 went to npm while `plugin.json` still read 3.0.0 and the marketplace announced the wrong number.

The trusted publisher itself is registered on npmjs.com, under Settings → Trusted Publisher, and it names this workflow by filename. Renaming this file breaks publishing until the registration is updated to match.

## [4.5.0] - 2026-08-11

### Added — Compatibility matrix and release notes in `ti-guides`

`compatibility-matrix.md` answers which JDK, Node.js, Xcode and Android SDK a given Titanium SDK can build with — a question no reference in the repo could answer before. Titanium SDK 13.3.0 raised the JDK ceiling to 25 and dropped 12.0.0–12.7.0 to unsupported.

`sdk-release-notes.md` condenses 13.x down to what changes app code: ScrollableView moved to ViewPager2 on Android, `keepHardwareMode` on `Ti.UI.View`, `hideKeyboardAccessoryView` on WebView, AttributedString on Android, Xcode 27 / iOS 27, iOS multi-scene apps, and the groundwork for Android target SDK 36.

Both subtrees — plus `Editor_IDE/`, which is where the JetBrains plugin now listed in `resources.md` came from — sat outside every subtree mapped in the auditor's `source-map.md`, so upstream changes to them had been invisible to every audit run so far. The map now covers them, with a note that release notes are commit subjects and need confirming against the API metadata before becoming guidance.

### Added — Facebook Limited Login in `ti-api`

`loginTracking` is supported on Android as well as iOS, and Limited Login now returns an OIDC Authentication Token. Adds the `nonce`, `authenticationToken` and `advertiserTrackingEnabled` properties, the `LimitedLoginAuthenticationToken` struct behind `event.authenticationToken`, and the caveat that the `LoginButton` honors `loginTracking` on iOS only — on Android the flow has to go through `authorize()`.

### Fixed — `ti-api` no longer hides type definitions behind "Plus N more types"

Seven `### Related Types` blocks ended in a marker that dropped 22 types, three of them naming nothing at all. The cost was real: `openPhotoGallery`'s multi-select options and response shape were among the omissions, so the reference showed `allowMultipleSelections` but not `allowMultiple`, `maxImages`, `selectionLimit` or `pathOnly`, and gave no hint that `success` stops delivering `e.media` and starts delivering `{ images, videos, livePhotos }`. Confirming that behavior meant reading the native SDK source — for something the official `api.json` had documented all along.

Every referenced type is now either tabulated or named with a link to where it is tabulated. The blocks also gained a Platform column. Most of these properties are not cross-platform — 58 of the 97 in the `Ti.Media` types alone — which is what made `maxImages` (Android) and `selectionLimit` (iOS) look interchangeable.

### Fixed — wrong ScrollableView event name in `ti-ui`

`scrolling-views.md` listened for `dragEnd` on a ScrollableView. That event does not exist there: the SDK defines `dragend`, Android only. `ScrollView` is the type carrying both spellings. The example now uses the correct name and shows `scrollend` as the cross-platform alternative.

### Fixed — typo carried over from upstream

`ClusterAnnotationParams.memberAnnotations` read "recieved"; upstream corrected it.

## [4.4.2] - 2026-08-10

### Added — Sharing content out in `ti-expert`

`sharing.md` covers handing a link, a text or a file to the rest of the system: the iOS share sheet and the Android intent chooser.

The reference is built around the asymmetry that explains most of the confusing sharing code in older projects. Android does this with the core SDK — `Ti.Android.createIntent` plus `createIntentChooser`, no module. iOS does not: the SDK exposes nothing wrapping `UIActivityViewController`, so a native module is still required. Code written before that split settled routes both platforms through the module, or through a cross-platform wrapper that only ever needed to exist for iOS.

Alongside it: why `dk.napp.social` must come from the maintained `hansemannn` fork rather than the `viezel` repository search engines surface (archived April 2021, and 3.0.2 is the highest published release); why the same `public.data` conformance that makes tapping a file open your app is what stops `DocumentViewer` from previewing it; why passing `text` alongside `file` makes "Save to Files" write a stray `.txt` next to the document; why Android file shares need `FLAG_GRANT_READ_URI_PERMISSION`; and why iPad needs `activityPopover` with a source view, which changes the signature of any sharing service that takes only a URL.

Closes with a query against the installed SDK's `api.jsca` that settles what the SDK does and does not expose, and a symptom-to-cause table.

### Changed — Markdown is no longer hard-wrapped

Most of the documentation was wrapped at roughly 80 columns. One paragraph is now one line, so editing a word touches one line of diff instead of five and a sentence can be found with `grep`. Text layout only: with whitespace collapsed every file is byte-identical to its previous version, and no fenced code block changed.

## [4.4.1] - 2026-08-05

### Added — File type association in `ti-expert`

`file-type-association.md` covers making the OS hand a file to the app: exported versus imported UTIs on iOS, `CFBundleDocumentTypes`, the Android intent filter, and receiving a document from AirDrop, Quick Share or a file manager.

The reference is built around the failure mode that costs the most time, because nothing reports it. `LSSupportsOpeningDocumentsInPlace` is a root-level `Info.plist` key; nested inside the `CFBundleDocumentTypes` dict — where it reads as belonging — iOS ignores it silently. The app still registers as owner of the type, so the symptom is Files previewing the document instead of launching the app, which is indistinguishable from iOS refusing to launch third-party apps at all. That wrong conclusion is easy to reach and easy to build on.

Alongside it: why conforming to `public.zip-archive` makes Files list a backup's contents instead of opening it, why `UIFileSharingEnabled` is a product decision rather than a fix, why Android `pathPattern` needs one variant per dot in the filename, and why an `ACTION_SEND` filter can put an app in its own share sheet. Closes with `plutil -extract` and `cmd package query-activities` commands that check the built binary rather than what `tiapp.xml` says, and a symptom-to-cause table.

## [4.4.0] - 2026-08-03

### Added — Feedback surfaces and Widget contracts in `ti-expert`

Three new references cover the ground between "something happened" and "which proxy draws it": `feedback-surfaces.md` picks the surface from the meaning of the event (owner, blocking, reversibility, persistence, choice shape) rather than from whichever dialog is easiest to call, and draws the line between what an app may style and what must stay system-owned. `feedback-widget-contracts.md` fixes the public API and lifecycle of Snackbar, Dialog and Bottom Sheet as Alloy Widgets — exactly-once callbacks, FIFO queueing, idempotent `destroy()`, accessibility focus handling. `feedback-migration.md` replaces native dialogs one window at a time, migrating semantics instead of proxy names.

Ten existing references were revised alongside them. `theming.md` was rewritten around a semantic color contract and now defers utility naming to the `purgetss` skill instead of carrying its own copy.

The skill's `description` gained the feedback and Widget triggers, and kept the ones it had: auditing, memory leaks, migrating legacy apps, and adaptive layouts for tablets, foldables and large screens.

### Fixed — Documentation drift around `ti-expert`

The reference count said 21 in two places in the README; the skill has 24. The "When it activates" list omitted feedback surfaces, Widgets, adaptive layouts and theming — the adaptive-layouts gap had been open since v4.1.0. `EXAMPLE-PROMPTS.md`, which doubles as the activation smoke test, had no prompt exercising any of the new material.

Inside the skill, `examples.md` had started calling `$.dialog` and `$.bottomSheet` without saying anywhere that the app must build those Widgets first, so its snippets read as copy-ready when they are not. It now names their contract and the color convention its styles follow, and its index was regenerated to match.

## [4.3.0] - 2026-08-02

### Fixed — Unclosed code fences in 9 reference files

Nine references carried code fences that opened and never closed, a leftover from the conversion of the upstream Titanium docs. Rendered, the damage was severe: `api-services.md` opened a ```` ```xml ```` on line 17 and never closed it, so 684 of its 701 lines displayed as one code block. `api-ui-android.md` had 484 lines in the same state.

It also broke the boundary between content and structure that any tool reading these files depends on — the first draft of the TOC generator produced an 8-entry index for `api-core.md`, which has 16 headings, because an open fence swallowed the rest.

Two shapes, opposite fixes: 7 orphan fences whose example never survived the conversion were removed, and 8 blocks carrying real code got their terminator. Verified by comparing every file with fence lines excluded — the content is byte-identical.

`scripts/fix-fences.mjs` performs the repair and is idempotent.

### Added — Tables of contents in 83 long reference files

Skill references load on demand, so a 750-line file with no index costs the reading agent the whole file to reach one section. Following the skill-creator guidance (index anything over 300 lines), `scripts/generate-toc.mjs` adds a linked index to every reference past that threshold — 1,038 anchors, all verified to resolve against a real heading.

The generator refuses to index a file with malformed fences rather than emitting a silently truncated index, and delimits its output with `<!-- TOC-START -->` / `<!-- TOC-END -->` so re-running refreshes instead of duplicating.

Both scripts are maintainer tools: versioned, absent from the npm `files` allowlist.

### Changed — The maintainer-only auditor skill is now versioned

`.claude/skills/titools-skill-auditor/` sat under a gitignored path, so the tool used to keep the five doc-mirror skills aligned with upstream existed on one machine only. Same failure as the slash commands in 4.2.0.

`.gitignore` changes from `.claude/` to `.claude/*` plus `!.claude/skills/`, which keeps `settings.local.json` and local drafts out while tracking the skill. It stays in place rather than moving, so Claude Code still loads it automatically when working in this repo, and it is still excluded from the npm tarball.

## [4.2.0] - 2026-08-02

### Added — Slash commands actually ship

`/ti-check`, `/ti-new-screen` and `/ti-audit` lived in `.claude/commands/`, a path covered by the first line of `.gitignore`. They reached nobody: not marketplace users, since the plugin serves `commands/` from the repo, and not npm users, since the tarball only carries what `package.json` → `files` lists. The README documented all three under a "Plugin only" heading the whole time.

- Moved to `commands/`, versioned, and added to the npm `files` allowlist.
- `lib/config.js` gains `COMMANDS` / `LEGACY_COMMANDS`; `installer.js` gains `installCommand` / `installCommands`; `cleanup.js` gains `removeCommands`.
- `install`, `update` and `remove` handle them alongside skills and the agent. `remove` lists them as their own checkbox entry.
- `test/commands.test.js` fails if `COMMANDS` and the directory ever disagree, if a command's frontmatter `name` stops matching its filename, or if `commands/` falls out of `files`.

### Fixed — Having both channels installed no longer duplicates everything

TiTools ships through the npm CLI and the Claude Code marketplace plugin, and a user can have both. Nothing checked for that: `createSkillSymlinks` mirrored all 8 skills into `~/.claude/skills/` even when the plugin already served them, so every skill — and now every command — appeared twice in the autocomplete.

New `lib/claude-plugin.js` answers whether the plugin already provides a given skill or command. It requires the plugin to be **enabled and cached**, never merely cached: uninstalling a plugin removes it from `enabledPlugins` in `settings.json` but leaves the cache directory on disk. In the sibling project (aiskills v1.16.0), reading that leftover as proof of installation made the CLI skip every symlink and report `0/6 skills linked`, leaving Claude Code with no skills and no way to repair it by re-running install. That bug is covered here by tests rather than rediscovered.

Detection fails toward `false` on missing or malformed settings — a wrong `false` costs a duplicate entry, a wrong `true` costs the user every skill they have.

- `createSkillSymlinks` and `installCommands` skip plugin-served entries and remove any stale copy left by an earlier install; both return a `skipped` array.
- `install` and `update` report what was skipped instead of warning about a shortfall.
- `titools doctor` subtracts plugin-served skills from the expected total — a healthy marketplace install used to render as a wall of errors advising a command that correctly does nothing — and gained a "Marketplace plugin" section separating the three states: enabled, not installed, and uninstalled-with-cache-left-behind (printed with the `rm -rf` that clears it).
- `test/claude-plugin.test.js` covers both failure modes across 20 new assertions.

### Changed — Install output says what it is doing

"✓ Claude Code detected", printed alone, read as though Gemini and Codex had been looked for and not found. They never appear there: only assistants that need TiTools-managed mirrors are listed, and the rest read `~/.agents/skills/` directly — which the install has already done by that point.

### Fixed — README

- The `ti-expert` "Key features" list said 18 reference guides; there are 21. The table further down already said 21, so the file contradicted itself.
- The "Slash Commands (Plugin only)" section is now "Slash Commands (Claude Code)" and documents both channels.

## [4.1.0] - 2026-07-31

### Changed — `ti-expert` / `references/adaptive-layouts.md`

Orientation on Android was only covered from the layout side. Three days were lost on a portrait-locked app that kept rotating on a phone, so the reference now carries what was missing to diagnose it:

- The resizability restriction starts at **API 36**, not 37, with a temporary opt-out (`PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY`) that expires when targeting API 37.
- Table of which Titanium activity hosts what (`TiActivity`, `TiTranslucentActivity`, the camera and video ones), plus how to read the canonical list from the SDK's AAR instead of memorising it.
- Why `android:configChanges` and a lock on `TiTranslucentActivity` are better left undeclared — the second one throws `IllegalStateException` on Android 8–11.
- `orientationModes` (with form-factor queries) as the preferred way to lock orientation, since it is resolved from `physicalSizeCategory` rather than pixel widths.
- New anti-patterns: setting `activity.requestedOrientation` imperatively, which silently overrides the manifest, and detecting tablets by comparing `platformWidth` (pixels on Android) against a dp threshold.
- A debugging recipe based on `dumpsys activity activities | grep requestedOrientation`, which reports the *effective* orientation, plus `adb logcat | grep "Orientation request will be ignored"` (the SDK's own warning when Android drops the request on a large screen) and `adb shell am get-config` to read the device's size bucket.
- New anti-pattern: `orientationModes: []`. An empty array maps to `SCREEN_ORIENTATION_SENSOR`, so it unlocks rotation instead of clearing the setting — an existing `orientationModes` can be the bug rather than the fix.
- Corrected the `android:configChanges` advice: the CLI *removes* the attribute from TiBaseActivity-derived activities before the merge (`_build.js`), so a hand-written subset is dead weight rather than a hazard.
- Fixed the generated-manifest path: `build/android/app/src/main/AndroidManifest.xml`.

## [4.0.0] - 2026-07-15

### Breaking — Doc-based skills return to TiTools as canonical source

The five documentation-mirror skills that moved to `tidev/skills` in v3.0.0 are back in TiTools and ship with the CLI / plugin again:

- `ti-api` — Complete Titanium API reference
- `ti-guides` — SDK fundamentals (tiapp.xml, Hyperloop, distribution)
- `ti-howtos` — Native feature integration (location, push, media, platform APIs)
- `alloy-guides` — Alloy MVC framework reference
- `alloy-howtos` — Alloy CLI, configuration, debugging

This reverses the v3.0.0 donation strategy. The copies in `tidev/skills` stay community-maintained, but TiTools is the canonical source going forward — improvements land here first and propagate to users via `titools update`.

Users on v3.x will get the five skills reinstalled automatically on next `titools update`. Anyone preferring the v3.x behavior (skills installed only via `tidev/skills`) can pin to `@maccesar/titools@^3.3.0`.

### Changed — `lib/config.js`

- `SKILLS` now includes all 8 skills (3 opinionated + 5 doc-based).
- `LEGACY_SKILLS` no longer contains the five doc-based names.

### Changed — `titools-skill-auditor` synced with upstream improvements

Replaced the auditor in `.claude/skills/titools-skill-auditor/` with the latest content from `tidev/skills` (called `ti-skill-audit` there). Brings the Phase 6 cross-reference / orphan-content verification step (slug validation, residual content classification, SKILL.md quick-reference table sync) and the `metadata.internal: true` flag.

### Changed — Drop redundant Gemini CLI platform symlinks

Empirical evidence from running `gemini` confirmed it auto-discovers skills from `~/.agents/skills/` per the [agentskills.io](https://agentskills.io) standard — the same path Codex CLI reads. Up to v3.x, TiTools also created mirror symlinks at `~/.gemini/skills/`, which caused Gemini to report `Skill conflict detected: "X" from ".agents/skills/..." is overriding the same skill from ".gemini/skills/..."` for every installed skill on startup.

This release follows the same path taken for Codex in v3.1.0:

- `getPlatforms()` no longer lists Gemini CLI — installs no longer create `~/.gemini/skills/` symlinks.
- `cleanupLegacyArtifacts()` now also calls `removeGeminiRedundantSymlinks()`. The same routine is now invoked from `titools install` (previously only `titools update`), so users who already had `~/.gemini/skills/` symlinks from v3.x get them cleaned up the next time they run either command. This also fixes a latent issue from v3.1.0 where the equivalent Codex cleanup only ran during updates.
- The Knowledge Index emitted into `GEMINI.md` now points at `./.agents/skills` (local) or `~/.agents/skills` (global), matching where Gemini actually reads from.
- Claude Code is now the only platform that requires TiTools-managed symlinks. Gemini CLI and Codex CLI use the canonical `~/.agents/skills/` directly.

### Changed — README

Removed the v3.0.0-era "Doc-based skills moved to tidev/skills" section and expanded the Skills overview table to list all 8 skills. The Compatible platforms table and CLI install description were updated to reflect the new Gemini auto-discovery model.

### Added — `purgetss` references for the SVG pipeline and the property index split

- **`skills/purgetss/references/svg-pipeline.md`** — new reference for the SVG-aware compile-time image pipeline introduced in PurgeTSS v7.11.0 and refined in v7.11.1. Covers the post-purge step that scans views/controllers for `.svg` references sized by `w-*`/`h-*` classes and emits the 8 Titanium density PNGs, the runtime `.svg`→`.png` fallback, the `images.files` / `images.autoSync` config surface, the current-run cascade policy, symmetric width/height derivation, and the `purgetss/.cache/svg-images.json` cache.
- **`skills/purgetss/references/class-index-properties.md`** — the full A–Z property→class table, split out of `class-index.md` so both files stay under the 800-line reference limit. `class-index.md` keeps the naming conventions, prefix inventory, verification commands, and the PROHIBITED-classes section, and points at the new file.

### Changed — `purgetss` skill audited and aligned to PurgeTSS v7.11.1

Full 30-reference audit against the upstream `purgetss` (v7.11.1) and `purgetss-docs` documentation. The skill was previously aligned to v7.10.2.

- **v7.11.0 / v7.11.1 coverage:** `version-history.md` and `migration-guide.md` gained 7.11.0/7.11.1 entries; `multi-density-images.md` and `customization-deep-dive.md` now document `images.autoSync` / `images.files`, the `config.cjs` syntax validator (`theme.fontFamily` must be a string), and the recursive theme-nesting behavior.
- **Icon compile-time resolution:** `icon-fonts.md` and `custom-fonts.md` now state that resolved icon classes are written to the generated `app/styles/app.tss` (not `purgetss/styles/utilities.tss`), matching the upstream doc clarification.
- **Removed hallucinated classes:** the non-existent bare `center` class (in `ui-ux-design.md` and `EXAMPLES.md`) and `bg-translucent` (in `class-categories.md`) — both verified absent from `dist/utilities.tss` — were replaced with real patterns (`text-center` / composite-omit).
- **Corrections:** `class-index.md` class count refreshed (`21,236` → `23,000+`, framed as approximate); `cli-commands.md` gained four real flags (`create -m`, `shades -o`, `build --glossary`, `watch -d`); `custom-rules.md` "ESM-style" → "CommonJS-style"; restored lost FontAwesome/Material glyphs; version-header and license/citation nits.
- **Broken-anchor fixes:** `SKILL.md`'s PROHIBITED-classes link and `titanium-resets.md`'s cross-link now target existing section slugs.
- All `## Community-Discovered Patterns` sections preserved. `README.md` purgetss reference count updated (`31` → `33`).

## [3.3.0] - 2026-05-14

### Fixed — `purgetss` SKILL.md blockquote that swallowed the Reference Guides

The `> ` blockquote opened by the NO FLEXBOX callout (line 199 of `SKILL.md`) was never terminated by a blank non-quoted line. Every section after it — PLATFORM-SPECIFIC PROPERTIES, Other Mandatory Rules, Common Anti-Patterns, Class Verification Workflow, Reference Guides, Examples, Related Skills — rendered as nested quoted content in any CommonMark parser. The Reference Guides index (the file map the agent needs to load the right reference) was visually buried under a left-bar quote. The fix terminates the FLEXBOX callout cleanly and promotes the following 11 H2/H3 sections back to document-level headings. No content was removed; only the leading `> ` prefix was stripped from non-callout lines. Legitimate inline admonitions keep their callout formatting.

### Added — `skills/purgetss/references/custom-fonts.md`

PurgeTSS v7.10 docs were split upstream into `customization/7-custom-fonts.md` (build-fonts, brand fonts, user-defined icon fonts) and `customization/8-icon-fonts-libraries.md` (icon-library, the four bundled icon families). The skill now mirrors that split. `custom-fonts.md` is a port of the upstream custom-fonts page: the build-fonts command, fonts-folder organization, `-m` / `--module` CommonJS output (with both `exports.icons` and `exports.families`), the `-f` / `--font-class-from-filename` flag, and community patterns on PostScript renaming and Font Awesome duotone.

### Changed — `skills/purgetss/references/icon-fonts.md` rewritten

The previous file only covered "Recreate Removed Libraries" (Bootstrap Icons, Boxicons, LineIcons, Tabler Icons). The primary content — the 4 official families bundled with PurgeTSS — lived inside the `icon-library` section of `cli-commands.md`. The rewrite consolidates the primary content with the variant table (`.ms`/`.mso`/`.msr`/`.mss`, `.fa`/`.fas`/`.far`/`.fab`, `.mi`, `.f7`), the `icon-library` install flow, the full four-family XML/TSS example, and the Font Awesome Pro / Beta workflow. The "Recreating removed libraries" section was preserved.

### Changed — `skills/purgetss/references/cli-commands.md` trimmed

Went from 1158 to 773 lines (under the 800-line per-reference quality standard). The build-fonts (~220 lines) and icon-library (~200 lines) sections were replaced with short stub blocks that document the command signature and flags, then point to the dedicated `custom-fonts.md` and `icon-fonts.md` refs for the full guide. Also:

- Removed a 19-line "What's new in v7.5.3 / v7.6.x / v7.7.0 / v7.8.0 / v7.9.0" intro block that duplicated content already in `version-history.md`.
- Fixed a `-f` flag drift: the option name was `--filename` (incorrect); the actual flag is `--font-class-from-filename`.
- Bumped a TSS example header comment from `v7.2.7` to `v7.10.2` to match what current PurgeTSS emits.

### Changed — `skills/purgetss/references/version-history.md` refactored

PurgeTSS extracted its inline changelog (in `docs/index.md`) into its own dedicated changelog page at <https://purgetss.com/changelog>. The skill's `version-history.md` was duplicating the long narrative form, which meant double maintenance per release and risked drift.

Trimmed from 165 to 59 lines. Each release entry now reduces to 1-5 terse bullets answering *"what changed that the agent needs to know when suggesting classes or configuring `config.cjs`?"* — APIs renamed, breaking changes, new commands, new classes, fixes that affect user- facing behavior. Internal details (logger fixes, parser edge cases, dependency bumps) moved out. The top of the file now points to the canonical changelog for full release notes.

### Fixed — `skills/purgetss/references/installation-setup.md` anchors and example header

The "Place icon, serif, sans-serif, or monospace font files here" line linked to `cli-commands.md#purgetss-build-fonts-alias-bf`, an anchor slug that no longer existed (the current slug is `#build-fonts-command`). The link now points to `custom-fonts.md` as the primary target, with `cli-commands.md#build-fonts-command` as the terse flag-reference secondary. Also bumped a TSS example header comment from `v7.2.7` to `v7.10.2`.

### Documentation — README reference count

Bumped the `purgetss` reference count in the Skill contents summary table from `29 files` to `31 files` to reflect both the `version- history.md` introduced in 3.2.0 and the new `custom-fonts.md` introduced in this release.

## [3.2.0] - 2026-05-13

### Added — repo conventions and skill output contract

`AGENTS.md` lands at the repo root with the cross-agent conventions every TiTools skill must obey: frontmatter ≤ 1024 chars, descriptions that start with "Use when…", folder names matching the `name:` field, the citation output contract, design principles ("concrete file paths", "vendor-neutral", "verify before claiming success", "no backwards-compat noise"), and the mandatory release checklist. The doc complements the existing `CLAUDE.md` (Claude Code-specific notes) and is meant for Claude Code, Gemini CLI, Codex CLI, GitHub Copilot CLI, and any other agent contributing to the repo.

The `purgetss` skill adopts the **Required workflow output contract** that AGENTS.md prescribes for non-trivial skills: a task → reference table near the top of `SKILL.md`, a citation format (`[source: references/<file>.md]`) for every claim, and a `FROM_MEMORY (unverified):` prefix when the agent answers without consulting a reference. This makes non-compliance visible in the agent's own response — the strongest mitigation against agents answering from training data instead of from the skill.

### Added — `skills/purgetss/references/version-history.md`

The release-by-release record (v7.4.0 → v7.10.2) was extracted out of `SKILL.md` into a dedicated reference file per the AGENTS.md "no backwards-compat noise" rule. SKILL.md stays focused on current behavior; historical context now has its own page, with three new entries covering PurgeTSS v7.10.0–v7.10.2.

### Changed — skill descriptions follow the "Use when…" convention

`ti-expert`, `ti-ui`, and `purgetss` descriptions were rewritten to start with "Use when…" in third person, matching the AGENTS.md frontmatter convention. Future agents scan descriptions to decide whether to load the full skill; the imperative trigger-led form is easier to evaluate than the prior "expert in X" framing.

### Documentation — `purgetss` references aligned with PurgeTSS v7.10.0–v7.10.2

Ten reference files were updated against the upstream PurgeTSS docs after v7.10.0–v7.10.2 shipped. Highlights:

- `app-branding.md` — Google Play Feature Graphic (1024×500) generation via `purgetss brand`: `--feature-graphic-padding`, `--feature-logo`, `brand.padding.featureGraphic`, `brand.logos.featureGraphic`. Plus the v7.10.2 pre-7.7.0 brand config auto-migration (legacy flat schema normalized in memory before defaults apply) and the v7.10.0 `--padding` shortcut fix (now applies to BOTH Android paddings).
- `multi-density-images.md` — `--opacity`, `--padding`, `--output` flags (v7.10.0) for placeholder / default-ImageView workflows.
- `cli-commands.md` — refreshed `brand` and `images` flag tables and examples with the new v7.10.0 surface.
- `apply-directive.md` — new "Use icon font classes" section: since v7.10.0, `apply:` resolves bundled icon fonts (`fas`, `fa-*`, `mi-*`, `ms-*`, `f7-*`) from `dist/` without needing `build-fonts` first.
- `arbitrary-values.md` — arbitrary nesting depth in `theme` objects (v7.10.0): `theme.extend.colors.brand.primary.500` now emits recursively as `brand-primary-500` instead of being silently dropped at level 2. Also: the v7.10.1 rewording of the square-brackets error message.
- `migration-guide.md` — new upgrade sections for v7.7.0, v7.8.0, v7.9.0, and v7.10.x; updated quick checklist covering brand schema migration, Class Syntax Error pre-validation enforcement, glossary path rename, and the v7.10.x additions.
- `customization-deep-dive.md` — `featureGraphic` in the `brand` config block; explicit note that v7.10.0 image flags (`--opacity` / `--padding` / `--output`) are CLI-only by design.
- `EXAMPLES.md` — square-brackets section now points out that v7.8.0+ hard-fails the build with a structured `Class Syntax Error` block.
- `class-categories.md` — `large-title` boolean row now cross-references `ios-large-titles.md` for the full pattern.
- `dynamic-component-creation.md` — small typo cleanup (`valor:` placeholder removed).

Source of the alignment pass: PurgeTSS docs at `purgetss-docs-context7` (v7.10.2 head). Every change traces back to the official source; author additions (`## Community-Discovered Patterns` sections) preserved intact.

---

## [3.1.0] - 2026-05-11

### Changed — Codex CLI no longer gets a redundant platform symlink

Codex CLI auto-discovers skills from the canonical `~/.agents/skills/` per the agentskills.io standard, so the symlinks TiTools was creating at `~/.codex/skills/<skill>` were redundant — Codex never actually read from there. Verified against the [official Codex CLI skills documentation](https://developers.openai.com/codex/skills/), which lists `$HOME/.agents/skills` (not `~/.codex/skills/`) as the user-scope location.

Codex remains fully supported by TiTools; users simply don't need a platform-specific symlink.

### Removed

- Codex entry in `getPlatforms()` (`lib/config.js`). The platform detector and install/sync flow no longer treat Codex as a symlink target.
- `.codex/` fixture in `test/cli.test.js` (no longer relevant to the install flow).
- README references implying Codex needs `~/.codex/skills/` symlinks.

### Migration for existing users

`titools update` now removes any stale `~/.codex/skills/<skill>` symlinks that TiTools created in earlier versions (active and legacy skill names alike). The cleanup is scoped to TiTools-managed skill names, so symlinks placed there by other tools (for example `npx skills add`) are left alone.

No action is required from users — the next `titools update` cleans up automatically.

---

## [3.0.0] - 2026-05-09

### BREAKING — doc-based skills moved to `tidev/skills`

Five documentation-only skills (`ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`) have been migrated to the official community repository [`tidev/skills`](https://github.com/tidev/skills) and removed from TiTools. The first batch was accepted upstream by Hansemann (TiDev maintainer) in [tidev/skills#1](https://github.com/tidev/skills/pull/1) and `ti-howtos` followed in [tidev/skills#2](https://github.com/tidev/skills/pull/2).

After this update, those five skills are listed in `LEGACY_SKILLS`, which means **`titools update` will silently delete them** from `~/.agents/skills/` (and from the platform symlink directories) on the next run. To get them back, install `tidev/skills` directly:

```bash
git clone https://github.com/tidev/skills.git ~/Developer/git-clones/tidev-skills
ln -s ~/Developer/git-clones/tidev-skills/skills/ti-api        ~/.agents/skills/ti-api
ln -s ~/Developer/git-clones/tidev-skills/skills/ti-guides     ~/.agents/skills/ti-guides
ln -s ~/Developer/git-clones/tidev-skills/skills/ti-howtos     ~/.agents/skills/ti-howtos
ln -s ~/Developer/git-clones/tidev-skills/skills/alloy-guides  ~/.agents/skills/alloy-guides
ln -s ~/Developer/git-clones/tidev-skills/skills/alloy-howtos  ~/.agents/skills/alloy-howtos
```

Refer to the [`tidev/skills` README](https://github.com/tidev/skills#readme) for canonical install instructions, which may evolve independently.

### What stays in TiTools

The three *opinionated* skills remain — they reflect personal Titanium conventions and toolchain choices that don't belong in the upstream community repo:

- `ti-expert` — Architecture, patterns, controller/service structure
- `purgetss` — PurgeTSS utility-first styling (audited against PurgeTSS official docs but workflow-opinionated)
- `ti-ui` — UI/UX patterns, ListView performance, platform UI (includes Community-Discovered Patterns not in the official docs)

### Removed

- `skills/ti-api/` — moved to `tidev/skills`
- `skills/ti-guides/` — moved to `tidev/skills`
- `skills/ti-howtos/` — moved to `tidev/skills`
- `skills/alloy-guides/` — moved to `tidev/skills`
- `skills/alloy-howtos/` — moved to `tidev/skills`
- `scripts/build-ti-api.js` — obsolete generator (the upstream repo owns its own build pipeline)
- `scripts/titools-docs` entry in `package.json` `files` array — the path never existed on disk

### Changed

- `lib/config.js` — `SKILLS` array reduced from 8 to 3 entries; the five migrated skills appended to `LEGACY_SKILLS` so existing installations get cleaned up on the next `titools update`.
- `agents/ti-pro.md` — preloaded skills reduced from 7 to 3; agent now recommends consulting `tidev/skills` when API surface, native-feature how-tos, MVC reference, or SDK fundamentals are part of the question.
- `hooks/session-start.sh` — message updated to point at the 3 TiTools skills first and `tidev/skills` second (now including `ti-howtos`).
- `install.sh` — `SKILLS` array trimmed; `LEGACY_SKILLS` extended.
- `README.md` — full restructure: skill overview tables, hierarchy diagram, project detection table, slash-command descriptions, and contents summary all reflect the 3-skill TiTools surface plus a prominent migration section pointing at `tidev/skills`.
- `EXAMPLE-PROMPTS.md` — activation tests for the five migrated skills removed; cross-skill collaboration tests retained but updated to mention `tidev/skills` for doc-based references including `ti-howtos`.
- `AGENTS-VERCEL-RESEARCH.md` — split skill overview into two tables (3 TiTools opinionated, 5 `tidev/skills` doc-based); index examples updated.
- `.claude-plugin/plugin.json` — version synced to 3.0.0; description trimmed to remove the "native-feature how-tos" claim now covered by `tidev/skills`.

### Migration test

`test/config.test.js` now asserts that `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, and `alloy-howtos` are present in `LEGACY_SKILLS` and absent from `SKILLS`, preventing accidental re-introduction.

## [2.10.1] - 2026-05-06

### Fixed
- `update` command — when running from the home directory, local and global skill detection both pointed to the same `.agents/skills` dir and triggered a duplicate update prompt. Local detection is now skipped when `cwd === os.homedir()`.

### Changed — `purgetss` skill aligned with PurgeTSS v7.9.0 and v7.8.0

The official PurgeTSS docs were fully rewritten on 2026-05-05. This release re-aligns 17 existing references against the new content, without adding new reference files.

**v7.9.0 features now documented:**
- Opacity modifier on semantic colors (`bg-surface/65`) — PurgeTSS auto-derives `<originalKey>_<alphaPercent>` entries in `semantic.colors.json` for each mode. Native rebuild required; Liveview hot-reload alone does not refresh the file.
- `theme.Window` / `theme.View` / `theme.ImageView` presets now use **replace mode** — they no longer carry framework defaults (white background, `Ti.UI.SIZE`, iOS `hires: true`). Use `theme.extend.Window` etc. for **extend mode** (merge with defaults). Fixes gradient ghosting on preset Windows.
- Glossary path renamed: `purgetss/experimental/tailwind-classes/` → `purgetss/glossary/tailwind-classes/`.

**v7.8.0 features now documented:**
- `purgetss images --width <n>` — pin SVG output to a specific base width; per-density assets derive from the multiplier scale (×1 / ×1.5 / ×2 / ×3 / ×4). CLI-only, range `[1, 8192]`.
- Class syntax pre-validation — build emits a `Class Syntax Error` block for 5 detected patterns (inverted negatives, Tailwind brackets, empty parens, whitespace in parens, redundant `px`).
- Parser fix for negative values inside parentheses.

**Other corrections:**
- Removed `createAnimation` factory hallucination from `animation-advanced.md` — `purgetss.ui` does not export this function; only the native `Ti.UI.createAnimation()` exists.
- Reclassified a mislabeled "Community-Discovered Pattern — Pro tip" in `tikit-components.md` (the monospace fonts tip is officially documented in `tikit.md`).

22 `## Community-Discovered Patterns` sections preserved intact across the skill (all 22 verified — no silent deletions).

## [2.10.0] - 2026-04-25

### Added — `values-and-units.md` reference in `purgetss` skill

New reference file covering a foundational concept that was missing from the skill: PurgeTSS writes **unitless** numeric values into `app.tss`, and Titanium interprets them at runtime via `ti.ui.defaultunit` in `tiapp.xml`. Most Alloy projects use `dp`, not raw pixels, so saying `rounded-lg` gives you "8 pixels" is wrong unless the project explicitly opts into `px`.

The reference covers: the eight valid `ti.ui.defaultunit` values (`dp`, `dip`, `px`, `mm`, `cm`, `in`, `pt`, `system`), how explicit pixel suffixes (`'1px'`) override the project setting, percentage classes resolving against the parent size, and Titanium constants (`Ti.UI.SIZE`, `Ti.UI.FILL`) being unit-independent.

Sourced from PurgeTSS v7.7.0's new official doc (`best-practices/4-values-and-units.md`).

### Changed — `purgetss` skill aligned with PurgeTSS v7.7.0 brand restructure

PurgeTSS v7.7.0 reorganized the `brand:` config from a flat structure to purpose-based groups. The skill now documents the new shape across every brand-related reference:

- `brand.logos` — optional path overrides (`primary`, `androidLauncher`, `androidSplash`, `monochrome`, `iosDark`, `iosTinted`)
- `brand.padding` — separate `ios`, `androidLegacy`, `androidAdaptive` with new defaults (`19%` adaptive, `10%` legacy)
- `brand.android` — `splash` and `notification` toggles
- `brand.ios` — optional `dark`, `tinted`, `darkBackground` overrides
- `brand.colors` — `background` (renamed from flat `bgColor`)

New CLI flags now documented:

- `--icon-logo <path>` — dedicated square Android launcher mark for wordmark / non-square main logos
- `--splash-logo <path>` — Android 12+ `splash_icon.png` artwork override
- `--android-adaptive-padding <n>` — replaces the old single `--padding` for the adaptive foreground (default `19%`)
- `--android-legacy-padding <n>` — replaces the old single `--padding` for legacy `ic_launcher.png` (default `10%`)
- `--padding <n>` — now a one-shot shortcut that sets both Android paddings to the same value

New sections added to `references/app-branding.md`:

- "Android 12+ splash artwork" — explains `--splash` + `logo-splash.svg` and the Titanium splash-theme requirement to actually use the generated file
- "Android legacy splash fallback" — covers the v7.7.0 regeneration of `app/assets/android/default.png` (Alloy) / `Resources/android/default.png` (Classic) and why `cleanup-legacy` now keeps it on purpose

Files modified:

- `references/app-branding.md` — config restructured, new flags, two new sections, padding tables split into adaptive/legacy/iOS, three Community-Discovered Patterns added (wordmark logos need a separate launcher mark; the three Android assets serve different roles; iOS 18+ wiring lag in Titanium SDK)
- `references/cli-commands.md` — `brand` command flag tables grouped by purpose, `init` defaults updated, v7.7.0 + v7.6.x changes added to the header banner, "Android output groups" note clarifying `ic_launcher*` vs `splash_icon.png` vs `default.png`
- `references/customization-deep-dive.md` — `brand:` block in `init` defaults switched to v7.7.0 grouped structure
- `SKILL.md` — new "What's New in v7.7.0" section, expanded "What's New in v7.6.x" (covers v7.6.1 confirmation prompts and v7.6.2 Classic-project support for `semantic`), `values-and-units.md` link added to the Setup & Configuration group

## [2.9.0] - 2026-04-22

### Added — 5 new references in `purgetss` skill for v7.5.3 + v7.6.0 features

The `purgetss` skill now covers every feature shipped in PurgeTSS v7.5.3 and v7.6.0 with dedicated reference files:

- `appearance-module.md` — Light/Dark/System mode switching via the `Appearance` export (v7.5.3). Covers `init()`, `set(mode)`, `get()`, `toggle()`, startup wiring, and a full Settings-view example.
- `semantic-colors.md` — `semantic.colors.json` schema, `theme.extend.colors` mapping, the `[object Object]` nesting trap, the numeric 11-step tonal inversion pattern, alpha transparency, the `purgetss semantic` CLI (palette + single modes), and three runtime consumption patterns.
- `app-branding.md` — the `purgetss brand` command (v7.6.0): launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, monochrome layer handling, padding guidance, and troubleshooting. Replaces the removed `ti-branding` skill as the canonical reference.
- `multi-density-images.md` — the `purgetss images` command (v7.6.0): 4× master convention, multi-density output, format conversion, subdirectory preservation, and pipeline integration.
- `ios-large-titles.md` — the `autoAdjustScrollViewInsets` + `extendEdges` + `largeTitleEnabled` combo, global defaults pattern, `largeTitleDisplayMode` constants, and `large-title-display-mode-never` override for detail windows.

### Added — `What's New in v7.6.0` and `What's New in v7.5.3` sections

`skills/purgetss/SKILL.md` now surfaces the two most recent PurgeTSS releases at the top, with links to the new reference files and a summary of each release's additions.

### Added — `brand`, `images`, and `semantic` commands in CLI reference

`references/cli-commands.md` grew from ~800 to ~1000 lines to cover the three new v7.6.0 commands with full flag tables, positional arguments, config blocks, confirmation-prompt semantics, and examples. Each command links to its deep-dive reference.

### Fixed — hallucinated `z-10`/`z-50` classes removed from smart-mappings

`references/smart-mappings.md` incorrectly documented Tailwind-style `z-10`, `z-20`, …, `z-50` shorthand classes. Verification against `dist/utilities.tss` confirmed PurgeTSS only emits the `z-index-*` prefix (`z-index-0` through `z-index-50`). The file was rewritten under a `## Community-Discovered Patterns` heading with every claim cited against either official docs, `dist/utilities.tss` line numbers, or documented Titanium platform behavior.

### Changed — 18 existing references aligned with v7.5.3 / v7.6.0

- `migration-guide.md` — grew from 77 to 213 lines, now covers every release from v7.2.6 through v7.6.0. The prior "v7.4.0 backgroundGradient.colors serialization fix" claim could not be tied to the official changelog (which lists v7.4.0 as the Animation module expansion) and was moved into a Community-Discovered Patterns section with a `needs-confirmation` note instead of being silently deleted.
- `apply-directive.md` — added the three v7.5.0 `theme.extend.{Window, View, ImageView}` subsections (customizing defaults, shorthand `apply:` normalization, and "apply wins over static defaults").
- `customization-deep-dive.md` — corrected stale "two main sections" language to "four main sections" (`purge`, `brand`, `images`, `theme`); updated default `config.cjs` template to include the v7.6.0 `brand:` and `images:` blocks; added the v7.5.3 default `font-sans`/`font-serif`/`font-mono` subsection with per-platform values.
- `ui-ux-design.md` — updated ScrollView examples to use the v7.3+ `content-w-screen content-h-auto` pattern; added cross-references to the new Appearance, Semantic Colors, and Large Titles refs.
- `titanium-resets.md` — replaced the deprecated `theme.View.DEFAULT` override pattern with the v7.5.0 `theme.extend.View` shape; added the v7.5.3 default font family classes subsection; bumped the stale `v7.2.7` version stamp.
- `class-index.md`, `class-categories.md` — added the v7.5.3 default font family classes (`font-sans`/`font-serif`/`font-mono`) and the v7.4.0 snap/keep-z-index classes to their prefix inventories.
- `installation-setup.md` — added the v7.5.3 XML validation section (illegal `--` inside comments detection).
- `EXAMPLES.md` — added two new WRONG vs CORRECT pairs for the `content-w-screen content-h-auto` ScrollView pattern and the deprecated `theme.View.DEFAULT` vs `theme.extend.View` shape.
- `dynamic-component-creation.md` — added a top-of-file scope note clarifying the ref covers Alloy's `$.UI.create()` (not the `purgetss.ui` module); replaced decorative emoji callouts with blockquote admonitions.

### Changed — `## Community-Discovered Patterns` convention applied broadly

The convention that protects real-world patterns, workarounds, and verified best practices from aggressive auditor cleanup now covers 22 of 28 reference files (previously 4). Unlabeled author callouts (`> WARNING`, `> TIP`, platform caveats) were moved under the protected H2 heading to make their provenance explicit.

Files given a new `## Community-Discovered Patterns` section: `custom-rules.md`, `opacity-modifier.md`, `arbitrary-values.md`, `platform-modifiers.md`, `icon-fonts.md`, `configurable-properties.md`, `grid-layout.md`, `performance-tips.md`, `class-index.md`, `class-categories.md`, `EXAMPLES.md`, `dynamic-component-creation.md`, `tikit-components.md`, `smart-mappings.md`, `installation-setup.md`, `titanium-resets.md`, `ui-ux-design.md`, `customization-deep-dive.md`.

Existing protected sections in `apply-directive.md` and `migration-guide.md` were preserved and verified against current docs.

## [2.8.0] - 2026-04-21

### Removed — `ti-branding` skill (functionality merged into PurgeTSS)

The `ti-branding` skill has been removed. Its icon/splash generation functionality now lives inside PurgeTSS itself, so maintaining a separate skill duplicated effort and shipped a second source of truth.

Secondary reason: the skill's `description` field had grown to 1268 characters, above Codex CLI's 1024-char limit. Codex sessions on machines with TiTools installed logged `invalid description: exceeds maximum length of 1024 characters` warnings every startup. Rather than trim the description, we chose to retire the skill entirely.

Migration for existing users:

- `ti-branding` moved from `SKILLS` to `LEGACY_SKILLS` in `lib/config.js`. Running `titools update` (or the daily auto-update hook) on any machine that has the skill installed will remove it from `~/.agents/skills/` and drop the platform symlinks in `~/.claude/skills/`, `~/.gemini/skills/`, and `~/.codex/skills/`.
- For branding/icon/splash workflows, use PurgeTSS directly going forward.
- The Knowledge Index in `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` is rebuilt dynamically from `skills/*/references/`, so existing projects will drop the `ti-branding/` references automatically on their next `titools sync` or `titools update`.

Removed from the repo:

- `skills/ti-branding/` (entire directory, including scripts, references, assets, and SKILL.md)
- `test/ti-branding.test.js`
- Documentation sections in `README.md`, `EXAMPLE-PROMPTS.md`, and `CLAUDE.md` referring to the skill, its scripts, or the destructive `--cleanup-legacy` flag
- `branding` keyword from `.claude-plugin/plugin.json`

Skill count is now 8 (down from 9).

## [2.7.3] - 2026-04-18

### Fixed — `--in-place` no longer litters project root with temp files

Previous `--in-place` behavior wrote the intermediate master files (`_master_square.png`, `_master_tight.png`, plus `_master_mono_*` when using `--monochrome-master`) directly into the project root alongside the final branded icons. They were cleaned up at the end of a successful run, but the root was visibly polluted during the run (IDE file watchers, git status, `ls` all showed them) and the cleanup code missed the `_master_mono_*` variants — leaving them orphaned forever if the user used `--monochrome-master`.

New behavior routes temp files through `<projectRoot>/.ti-branding/` even in `--in-place` mode:

- Temp files are created inside `.ti-branding/` (hidden, tidy)
- If `.ti-branding/` did NOT exist before the run, the whole directory is removed at the end — no trace at all
- If `.ti-branding/` DID exist (prior staging run or user content), only the specific `_master_*.png` files we created are removed — user's own content inside `.ti-branding/` is untouched
- Project root never sees temp files, before or after the run

Staged mode behavior is unchanged (temp files stay in `.ti-branding/` alongside the final assets for review/debugging).

## [2.7.2] - 2026-04-18

### Fixed — v2.7.1 Android splash guidance was still too prescriptive

v2.7.1 over-corrected the v2.7.0 splash guidance by aggressively recommending the `android:theme="@style/Theme.App.Splash"` approach with a concrete snippet inheriting from `@style/Theme.Titanium.Light.NoTitle`. Two problems:

1. **Not every Titanium SDK exposes that parent theme.** Titanium SDK 13.1.1 does NOT have `Theme.Titanium.Light.NoTitle`. Users who copy-pasted got: `resource style/Theme.Titanium.Light.NoTitle not found` on `./gradlew`.
2. **`android:theme` on `<application>` is invasive.** It overrides whatever theme the project was using and affects every activity. If a project already has its own theme, the snippet stomps over it.

v2.7.2 reframes the `--notes` splash section:
- Marked **"OPTIONAL, advanced"** instead of "RECOMMENDED"
- Leads with "for most apps the default is enough — do nothing"
- Template uses placeholder `@style/YOUR_APP_PARENT_THEME` with clear "verify this exists in your SDK" guidance
- Lists `@style/Theme.Titanium.Light.Fullscreen` as known-working in SDK 13.2.0, with caveat to verify for the user's SDK version
- Explicit pre-flight checklist: (a) verify parent theme exists, (b) check whether your project already has a custom theme (extend, don't override), (c) test the build before committing tiapp.xml

The `--ios-padding` 4% default from v2.7.1 is preserved.

## [2.7.1] - 2026-04-18

### Fixed — Android splash screen guidance was misleading

The `--notes` output previously warned:
> ⚠ CRITICAL: NEVER set `android:theme="..."` on `<application>` or any `<activity>`.

This was overly absolute and actively steered users AWAY from the correct fix for the end-of-splash flicker on Android 12+. The narrower and correct rule is: don't inherit from `@android:style/Theme.DeviceDefault.NoActionBar` (that parent strips the ActionBar). Inheriting from a Titanium parent theme (`Theme.Titanium.Light`, `.Light.NoTitle`, `.Light.Fullscreen`, plus Dark variants) preserves the ActionBar AND is the standard working pattern in production Titanium apps.

The notes now:
- Lead with the flicker cause (system splash color mismatches the Titanium activity color → visible flash right before `index.js` renders)
- Recommend the Titanium-parent-theme approach as the primary fix
- Provide a complete snippet (splash_theme.xml + tiapp.xml wiring)
- List available Titanium parent themes with guidance on when to pick each
- Keep the narrower warning (don't inherit from `@android:style/*.NoActionBar`)
- Reference "LM - La Baraja" as a real-world app using this pattern in production with zero flicker

### Changed — default `--ios-padding` lowered from 8% to 4%

Per Apple's HIG and production app measurements (La Baraja uses ~2% per side, Mail/Safari/WhatsApp use 3-6%), iOS app icons typically fill 92-97% of the canvas. The previous default of 8% per side (84% fill) was noticeably more conservative than industry standard. iOS icons have no launcher mask — the padding is purely aesthetic breathing room, no cropping risk.

New default 4% per side (92% fill) matches Apple's own apps. Override:
- `--ios-padding 2` — aggressive, near-edge (matches La Baraja)
- `--ios-padding 8` — previous default, conservative breathing room

This affects: DefaultIcon.png, DefaultIcon-ios.png, iTunesConnect.png, MarketplaceArtwork.png. Android adaptive padding (`--padding`) stays at 20%.

## [2.7.0] - 2026-04-18

### Fixed — `ti-branding` skill alpha handling

The skill now matches what a fresh `titanium` / `alloy new` project ships by default. Previously the skill flattened alpha on marketplace artwork and only emitted `DefaultIcon-ios.png`, which diverged from Titanium's own templates.

- **`gen-ios.sh`** — now produces **both** `DefaultIcon.png` (1024², alpha preserved, the universal/Android source) **and** `DefaultIcon-ios.png` (1024², alpha flattened over `--bg-color`, for iOS/Apple). Previously only the flattened `-ios` variant was generated, leaving projects without the alpha-intact source that `ti create` ships.
- **`gen-marketplace.sh`** — `iTunesConnect.png` (1024²) and `MarketplaceArtwork.png` (512²) now preserve alpha. Previously both were flattened on `--bg-color`, which didn't match what Titanium's template generates and made compositing over different backgrounds impossible. Apple's App Store upload still rejects alpha, but that's a final-submission concern — the in-project template file keeps transparency so the developer can composite before upload.
- **`ti-branding` entry script** — "Next steps" copy command now includes `DefaultIcon.png` alongside the other root-level assets. Dry-run output enumerates `DefaultIcon.png` too.
- **`SKILL.md` asset table** updated to reflect the new alpha handling and the `DefaultIcon.png` addition.

The `ti-branding` skill and `imgconvert-cli` npm package converge on the same correct alpha behavior but remain fully independent: each is self-contained, with no runtime dependency between them. Two audiences (Claude Code users vs. npm CLI users), two delivery channels, one shared specification.

### Added — `--monochrome-master <path>` flag in `ti-branding`

Optional dedicated silhouette master for the monochrome-destination outputs:

- `mipmap-*/ic_launcher_monochrome.png` (Android 13+ themed icons)
- `drawable-*/ic_stat_notify.png` (status bar notification icon)

When `--monochrome-master` is provided, those two outputs render from the dedicated master (then whitened to pure white + preserved alpha). When not provided, fall back to the previous behavior — naively whiten the colored main master.

**Why this matters:** a naive color→white conversion collapses multi-color detail into a featureless white blob. Example: a painter's palette logo with 4 colored dots becomes 4 indistinguishable white splotches. By providing a monochrome variant designed with cutout holes / negative space where colors were, the dot-pattern detail survives in themed Android icons and in the notification status bar.

Works in both generation modes (`--in-place` and staged). When the mono master is used, intermediate files `_master_mono_square.png` and `_master_mono_tight.png` are tracked and cleaned up in `--in-place` mode like the main master intermediates.

### Changed — default `--padding` lowered from 22% to 20%

Material Design spec floor for Android adaptive icon safe-zone is 19.44% per side (108dp canvas with a 66dp keyline grid). The previous default of 22% sat 2.5% above the floor without real-world justification — it produced visibly smaller logos on device (~6% less width at xxxhdpi, 18px less at 432×432 canvas) in exchange for a "safety" margin that wasn't defending against any real masking scenario.

New default **20%** is:
- Just above the spec floor (0.56% buffer, still defensively rounded)
- A clean, memorable round number
- ~6% bigger logo across all densities
- Still safe for every mask type (circle, squircle, rounded square)

Override with `--padding N` when your logo warrants it:
- `--padding 16` — Google keyline grid (72dp viewport), maximum icon size
- `--padding 19` — spec exact floor, no buffer
- `--padding 25-30` — highly stylized logos with ornament in corners

### Changed — `--bg-color` now flattens marketplace artwork

When `--bg-color` is **explicitly provided**, `iTunesConnect.png` (1024²) and `MarketplaceArtwork.png` (512²) are now flattened onto the given color instead of keeping alpha. This prevents the dark-mode-muddy-icon problem in Play Store and macOS App Store listings when the master logo has significant transparent areas (e.g. a wordmark-only or icon-on-transparent master).

When `--bg-color` is **not provided**, both files keep alpha to match the `ti create` default template behavior. `DefaultIcon.png` always keeps alpha regardless — it is a source file that Titanium processes into the adaptive icon foreground layer at build time, and flattening it would break that.

### Added — `--notes` flag in `ti-branding`

New flag that gates the long-form post-generation output (padding tuning guide, iOS launch storyboard snippet, Android launcher wiring, Android 12+ splash theme with Options A/B + critical warning, FCM notification tint) behind an explicit opt-in. Default output is a compact summary (~15 lines) showing background color, padding, destination, and 3-line next-steps — with a hint pointing to `--notes` for the full snippets. Before this flag the full output (~100+ lines) was always printed, burying the key "next steps" under reference documentation most users only need once per project.

### Added — `--in-place` flag in `ti-branding`

New flag that skips the `.ti-branding/` staging directory and writes files directly into the project root. Designed for the "brand a fresh project" flow: right after `ti create`, run `ti-branding logo.svg --in-place --bg-color "#XXX"` to overwrite the default Titanium/Alloy icons in one command instead of having to `cp -R` from staging manually.

- Prints an explicit warning before writing: `⚠  --in-place mode: files in your project will be OVERWRITTEN. Commit first if you want a rollback.`
- `--output` takes precedence over `--in-place` when both are passed (avoids ambiguity).
- "Next steps" output adapts: instead of the `cp` copy-to-project command, it points at `git checkout -- .` as the restore path if something looks wrong.
- Intermediate master files (`_master_square.png` / `_master_tight.png`) are cleaned up at the end so only the 4 real branded icons remain in the project root.
- Works with both Alloy (`app/`) and Classic (`Resources/`) projects.

This is the skill-side counterpart to the `--in-place` flag added in `imgconvert-cli` v2.0.0. Both tools independently offer the same UX for the primary "just brand my project" use case, matching the project's independence constraint: no runtime dependency between the skill and the npm package, but equivalent feature surfaces for their respective audiences.

### Added — Plugin marketplace metadata

- **`plugin.json`** — added `keywords` array (`titanium`, `titanium-sdk`, `alloy`, `purgetss`, `mobile`, `ios`, `android`, `ui`, `api-reference`, `branding`) to improve discoverability in the Claude Code plugin marketplace.
- **`marketplace.json`** — added `category: "mobile-development"` and a `tags` array to the `titools` plugin entry so users can browse and filter more effectively.
- **`README.md`** — clarified auto-update behavior for third-party marketplaces. Claude Code disables auto-updates by default for non-Anthropic marketplaces; the README now documents how to opt in via `/plugin` → **Marketplaces** tab and the `/reload-plugins` prompt that follows each update.

## [2.6.1] - 2026-04-18

### Fixed
- **`plugin.json` version synced** with `package.json`. Published 2.6.0 shipped with `plugin.json` pinned at `3.0.0` (pre-existing value from the `feature/plugin-marketplace` branch), which meant npm and the Claude Code plugin marketplace announced different version numbers. Now both are `2.6.1`.
- **`CLAUDE.md` added at the repo root** so project-specific rules (release checklist, hooks format, ora async, aiskills parallel project, merge roadmap) travel with the repo. Previously these lived only in machine-local `~/.claude/projects/` memory and would be lost when cloning to a new machine.

## [2.6.0] - 2026-04-17

### Added
- **Claude Code Plugin Marketplace — officially shipped.** `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json` + `hooks/` are now committed to the repo, making `/plugin marketplace add macCesar/titools` + `/plugin install titools@maccesar-titools` work out of the box. Previously these files existed locally but were untracked, so the instructions in the README did not actually resolve.
- **`LICENSE` file** — MIT license boilerplate, making the warranty disclaimer explicit. `package.json` already declared `"license": "MIT"`, but the file itself was missing. Added so scanners, GitHub, and npm show the full MIT terms.
- **Safety & disclaimer** section in `README.md` — guidance for destructive operations (`--cleanup-legacy`, icon replacement) plus an AS-IS / no-warranty statement pointing to `LICENSE`.
- **Runtime disclaimer** in `--cleanup-legacy` output — prints a warning before the cleanup plan recommending a git commit beforehand and noting the AS-IS delivery.
- **`titools list`** (alias `titools ls`) — Enumerates available Titanium skills with their short description (first sentence of each skill's SKILL.md description). Shows install status per skill. Inspired by `tn list` for Titanium recipes.
- **`ti-branding` skill** — 9th skill in TiTools. Generates full icon and splash-screen asset sets for modern Titanium SDK 13.x projects from a single SVG or PNG master. Outputs:
  - `DefaultIcon-ios.png` (1024² no alpha), `iTunesConnect.png` (1024²), `MarketplaceArtwork.png` (512²)
  - Android adaptive icon triplet (foreground + background + monochrome) × 5 densities
  - Legacy `ic_launcher.png` × 5 densities (Android <8 fallback)
  - `mipmap-anydpi-v26/ic_launcher.xml` binder
  - Optional: `ic_stat_notify.png` × 5 (white+alpha for FCM), `splash_icon.png` × 5 (Android 12+ SplashScreen API)
- **Dual-padding model** in `ti-branding`: `--padding` (Android safe-zone, default 22%) and `--ios-padding` (iOS aesthetic breathing room, default 8%). Horizontal wordmarks fit Android's 66dp safe-zone while retaining proper margin in square iOS/marketplace icons.
- **`--cleanup-legacy` flag** in `ti-branding` — context-aware removal of obsolete branding artifacts (iOS launch images when storyboard is enabled, Android `default.png` and `appicon.png` when adaptive icons are present, `res-long-*`/`res-notlong-*` dead qualifiers, landscape variants when the app is portrait-only). Reads `tiapp.xml` to decide what's safe. `--aggressive` additionally removes `ldpi` folders (<1% global market). Runs standalone or combined with generation. Dogfooding on SNAP Gym freed ~5.5 MB (15 iOS `Default-*.png` + 2 Android legacy files + 11 Android fossil folders). Full write-up in `skills/ti-branding/references/cleanup-legacy.md`.
- **Post-generation guidance** — `ti-branding` prints context-aware notes: brand color reminder, padding adjustment tips, iOS storyboard snippet, Android launcher snippet, Android 12+ splash wire-up (BOTH native `@android:style/Theme.DeviceDefault.NoActionBar` and `androidx.core:core-splashscreen` library approaches, with tradeoffs), FCM notification icon wire-up.
- Explicit warnings baked into the output: `<application>` self-closing vs children-bearing form, and the Titanium `<application android:theme>` trap (splash themes set there strip the ActionBar globally — always register via `<meta-data android:name="io.tidev.titanium.splash.theme">`).
- Targets Ti SDK 13.0–13.2 minimums. No legacy iOS launch images (storyboard-driven). No `background.9.png` (obsolete).
- Delegates raster to ImageMagick + librsvg (system tools). Zero npm/pip dependencies.
- Eight reference files covering canonical paths, adaptive icon spec, iOS appiconset, notification rules, modern splash API, input guidelines, `tiapp.xml` snippets, and legacy cleanup rules.
- 13 tests covering package layout, CLI behavior, shell syntax, and cleanup-only mode.

## [2.5.1] - 2026-04-08

### Fixed
- **README** — Restored TiTools README that was accidentally overwritten with PurgeTSS content. npm was showing the wrong documentation.

## [2.5.0] - 2026-04-08

### Added
- **`titools status`** — Quick overview of installation: version, skills count, agent, hook, last update check, platform symlinks, and project Knowledge Index status.
- **`titools doctor`** — Diagnoses installation health: verifies each skill directory, validates symlinks (detects broken ones), checks Knowledge Index version, reports issues with fix suggestions.
- **Async spinner** — npm update now runs asynchronously so the spinner animates during download/install instead of freezing.

## [2.4.2] - 2026-04-08

### Fixed
- **Auto-update progress feedback** — Show intermediate steps ("Update available", "Downloading and installing") instead of jumping from "Checking" to "Updated". Show "Up to date" message on cache hit in non-silent mode.

## [2.4.1] - 2026-04-08

### Fixed
- **Hook format** — Claude Code hooks require `{ hooks: [{ type: "command", command: "..." }] }` format. The flat `{ command, timeout }` format used in v2.4.0 caused a settings validation error on session start.

## [2.4.0] - 2026-04-08

### Added
- **Auto-update command** (`titools auto-update`) — Full pipeline: checks npm for new versions, updates CLI, syncs skills to `~/.agents/skills/`, and refreshes Knowledge Index in existing MD files. Supports `--silent` flag for hook usage.
- **Claude Code SessionStart hook** — Automatically installed by `titools install` when Claude Code is selected. Runs `titools auto-update --silent` at session start to check for updates (at most once per day).
- **Update cache** (`~/.titools/last-check.json`) — Prevents hitting npm registry on every invocation. Checks at most once every 24 hours. TTL overridable via `TITOOLS_CACHE_TTL_MS` env var for testing.
- **Knowledge Index AUTO-UPDATE instruction** — Fallback for Gemini CLI and Codex CLI that don't support hooks. The instruction tells the AI to run `titools auto-update --silent` at session start.
- **Dev mode detection** — When running from a git repo (via `npm link`), skips the `npm update -g` step to avoid interfering with development.
- **Hook lifecycle management** — Hook is installed during `titools install` and removed during `titools remove`, along with cache cleanup.

## [2.3.0] - 2026-04-08

### Added
- **Community-Discovered Patterns** — New protected section type across skills for verified behavior not present in official Titanium documentation. These sections survive audits via a protection rule in `quality-standards.md`
- **ti-ui/platform-ui-ios.md**: Large Title + ScrollView property triad pattern — documents the interdependency between `largeTitleEnabled`, `extendEdges`, and `autoAdjustScrollViewInsets` including `largeTitleDisplayMode` options, TabGroup compatibility, rendering delay explanation, and global defaults via `app.tss`
- **ti-ui/scrolling-views.md**: ScrollView inside NavigationWindow (iOS) pattern with property table and code example
- **ti-expert/anti-patterns.md**: Anti-pattern #15 — using `extendEdges` without `autoAdjustScrollViewInsets` (iOS), with entry in quick reference table
- **ti-api/api-ui-windows-navigation.md**: Platform Implementation Notes for Ti.UI.Window — Large Title + ScrollView interdependency with `largeTitleDisplayMode` constants
- **purgetss/apply-directive.md**: Global Window defaults pattern using `apply` directive in `config.cjs` with PurgeTSS classes (`auto-adjust-scroll-view-insets`, `extend-edges-all`, `large-title-enabled`)
- **purgetss/class-categories.md**: Cross-reference on `large-title` entry linking to the apply directive pattern

## [2.2.13] - 2026-03-07

### Added
- **alloy-guides/MODELS.md**: Comprehensive Alloy data binding section
  - Collection-view binding with full attribute reference (`dataCollection`, `dataTransform`, `dataFilter`, `dataFunction`)
  - Repeater objects table for all supported view types (ListView, TableView, ScrollableView, Picker, etc.)
  - Model-view binding documentation
  - `$.destroy()` memory cleanup warning and pattern for global singletons
  - Complete collection-view binding example with album/ScrollableView
- **ti-guides/advanced-data-and-images.md**: Added database download pattern for first-boot hydration

### Changed
- **ti-expert/security-fundamentals.md**: Updated secure token storage to use unified `ti.identity` module — replaces platform-specific `Ti.Android.createKeyStore` / `Ti.KeychainItem` with `Identity.createKeychainItem()` (works on both iOS and Android)
- **alloy-guides**: Refreshed CONTROLLERS, VIEWS_DYNAMIC, VIEWS_STYLES, VIEWS_XML, WIDGETS
- **ti-expert**: Content refresh across code-conventions, error-handling, examples, performance-optimization, security-device, state-management, testing-e2e-ci, theming
- **ti-guides**: Content refresh across application-frameworks, coding-best-practices, commonjs-advanced, hello-world, hyperloop-native-access, javascript-primer, style-and-conventions
- **ti-howtos**: Content refresh across buffer-codec-streams, debugging-profiling, google-maps-v2, ios-map-kit, notification-services, webpack-build-pipeline
- **ti-ui/application-structures.md**: Minor content update
- **purgetss/icon-fonts.md**: Content refresh
- **alloy-howtos/samples.md**: Minor update

### Removed
- **ti-guides/SKILL.md**: Removed dead references (`alloy-cli-advanced.md`, `alloy-data-mastery.md`, `alloy-widgets-and-themes.md`)
- **ti-guides/tiapp-config.md**: Removed deprecated Appcelerator-only properties (`appc-sourcecode-encryption-policy`, `appc-security-jailbreak-detect`, `appc-security-debugger-detect`)

### Fixed
- **ti-guides/advanced-data-and-images.md**: Fixed markdown table alignment formatting

## [2.2.11] - 2026-02-12

### Changed
- **ti-guides/cli-reference.md**: Added `dist-macappstore` and `macos` targets to iOS build options
  - Documents Mac Catalyst distribution for Mac App Store
  - Includes examples for both development (`macos`) and distribution (`dist-macappstore`) targets
- **ti-guides/app-distribution.md**: Added comprehensive Mac Catalyst distribution section
  - Documents enabling Mac Catalyst for App IDs
  - Mac App Store Distribution Certificate setup
  - Build targets comparison table
  - Development and distribution build commands
  - Upload process to Mac App Store Connect
  - Mac Catalyst entitlements configuration
  - Common issues and troubleshooting
- **ti-expert/SKILL.md**: Added explicit organization policy for technical-type folders and flat `lib` structure
  - Enforces one-level depth: `lib/<type>/<file>.js`
  - Clarifies hybrid approach (technical grouping in `lib` + screen-aligned UI files)
  - Updated quick-start examples to use composed names (`userCard`, `userProfile`)
- **ti-expert/references/alloy-structure.md**: Unified structure recommendations and naming conventions
  - Replaced deep/feature-nested examples with flatter, predictable structure
  - Updated `lib` map with multiple files per technical folder (`api`, `services`, `actions`, `repositories`, `helpers`, `policies`, `providers`)
  - Updated flattening examples and `require()` paths to composed names (`authApi`, `authService`, `userRepository`)

### Fixed
- **Documentation gap**: Mac App Store distribution via Titanium CLI was not documented
  - The `dist-macappstore` target has existed since Titanium SDK 13.1.1.GA
  - No prompts required - automatically detects installed certificates
  - Archive is installed in Xcode Organizer for upload
- **ti-expert consistency**: Removed mixed naming examples (`picsum`, `client.js`) in structure docs
  - Examples now consistently use composed, technical-type names across all `lib` snippets

## [2.2.10] - 2026-02-05

### Added
- **update command**: New "Both locations" option to update global and local skills simultaneously
  - Prompt now shows when both local and global skills are detected
  - Users can update global, local, or both in a single run

### Changed
- **update command**: Refactored update logic into reusable `performUpdate()` function
  - Cleaner code structure for handling single vs dual-scope updates
  - Improved user messaging for update mode selection

## [2.2.8] - 2026-02-05

### Changed
- **Documentation refresh**: Simplified wording and standardized capitalization, headings, and bullet styles across README and all skill/reference docs
- **README**: Clarified product description and reordered skill tables for consistency
- **GitHub Actions CI/CD**: Automatic npm publish when package.json changes on main branch
  - Uses OIDC Trusted Publishing (no tokens required)
  - Auto-creates GitHub Release with generated notes

## [2.2.4] - 2026-02-03

### Fixed
- **update command**: Fixed bug where `titools update` would exit without syncing skills when CLI version matched GitHub version
  - Previously: "Already up to date" → exited immediately without updating skill files
  - Now: "CLI is up to date" → syncs skills, agents, and symlinks from installed package
- **update command**: Now only updates symlinks for platforms that already have them installed (respects user's initial platform selection)

### Changed
- **update command flow**: Two-stage update process
  - If newer version on GitHub → prompts user to run `npm update -g @maccesar/titools` first
  - If CLI is current → syncs skills from installed package without downloading from GitHub
- **update command**: Agents are now only synced if Claude Code has existing symlinks

## [2.2.3] - 2026-02-02

### Added
- **Semantic colors API**: New cross-platform semantic colors for Dark Mode support in `ti-ui` skill

## [2.2.2] - 2026-02-02

### Changed
- **Knowledge index format**: Removed code blocks and descriptive text wrapper — index is now injected as direct content per Vercel's research findings
- **MANDATORY instruction**: Added explicit directive stating training data is outdated and reference files are the single source of truth
- **Docs**: Updated README and AGENTS-VERCEL-RESEARCH.md examples to reflect the new index format

## [2.2.1] - 2026-02-02

### Changed
- **ti-pro agent**: Added `Bash` tool for directory/file inspection during research
- **Skills sorted alphabetically** in ti-pro agent, README, and AGENTS-VERCEL-RESEARCH
- **Docs cleanup**: Sentence case headings and concise wording across AGENTS-VERCEL-RESEARCH.md and EXAMPLE-PROMPTS.md

## [2.2.0] - 2026-02-02

### Added
- **ti-expert skill**: New skill replacing `alloy-expert` with 19 reference files + 1 asset (ControllerAutoCleanup.js) and new `cli-expert.md` reference
- **ti-pro agent**: New agent replacing `ti-researcher` for deep-dive research with all 7 skills preloaded and `Bash` tool access
- **purgetss/references/tikit-components.md**: New reference for TiKit component integration
- **lib/cleanup.js**: New module for legacy artifact cleanup
- **test/cleanup.test.js, test/cli.test.js**: New test files for cleanup and CLI functionality
- **AGENTS-VERCEL-RESEARCH.md**: Research document on AGENTS.md effectiveness (based on Vercel's evaluation)

### Changed
- **CLI refactor**: Migrated from `inquirer` to `@inquirer/prompts`, updated all dependencies to latest versions
- **CLI commands**: Simplified and streamlined `install`, `sync`, `update`, and `remove` commands
- **install.sh**: Simplified bash installer
- **Skill renames**: `alloy-expert` → `ti-expert`, agent `ti-researcher` → `ti-pro` throughout all code and documentation
- **All 7 skills updated**: Expanded and improved reference documentation across all skills
- **ti-guides**: Removed 3 Alloy-specific references (moved to alloy-guides/alloy-howtos), expanded Hyperloop and CLI reference docs, added new references (android-manifest.md, reserved-words.md, resources.md)
- **ti-howtos**: Expanded notification services, media APIs, tutorials, and platform deep-dives
- **ti-ui**: Expanded ListView performance, platform UI (Android/iOS), accessibility, orientation, and layouts docs
- **alloy-guides**: Updated all reference files with improved examples and clarity
- **alloy-howtos**: Expanded config_files.md with detailed configuration patterns
- **EXAMPLE-PROMPTS.md**: Rewrote all prompts as realistic developer requests, fixed incorrect reference file names
- **README.md**: Documented all CLI options for every command, fixed reference file counts, fixed EXAMPLE-PROMPTS.md path, merged duplicate Troubleshooting sections
- **CHANGELOG.md**: Fixed duplicate header, renamed all legacy references to current names
- **package.json**: Bumped to v2.2.0, updated all dependencies

### Removed
- **alloy-expert skill**: Replaced by `ti-expert` (legacy cleanup on install/update)
- **ti-researcher agent**: Replaced by `ti-pro` (legacy cleanup on install/update)
- **AGENTS-TEMPLATE.md**: No longer needed (content generated dynamically by CLI)
- **scripts/ti-docs-index**: Replaced by CLI commands
- **ti-guides/references/alloy-cli-advanced.md, alloy-data-mastery.md, alloy-widgets-and-themes.md**: Content moved to appropriate alloy-* skills

## [2.0.7] - 2026-01-30

### Fixed
- **Block Management (Global Cleanup)**: Updated `addOrUpdateBlock` to perform a global search and removal of all existing Titanium knowledge blocks before adding the new one. This ensures that any duplicated blocks from previous versions are completely cleaned up.

## [2.0.6] - 2026-01-30

### Fixed
- **Block Management (Final Fix)**: Migrated to static block markers (`START`/`END`) to prevent duplication. The version is now stored internally as a comment. This version also includes a robust Regex-based migration that cleans up any existing versioned blocks from previous releases.

## [2.0.5] - 2026-01-30

### Fixed
- **Block Management**: Updated block detection and removal to be version-agnostic using regex. This prevents duplicating documentation blocks in `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` when the package version changes.
- **Documentation**: Updated CHANGELOG and AGENTS research references to reflect recent releases.

## [2.0.4] - 2026-01-30

### Changed
- **Compressed Index**: Removed redundant "IMPORTANT" message from inside the compressed block (already present in Markdown header)
- **Token Efficiency**: Reduced block size for better AI performance

## [2.0.3] - 2026-01-30

### Fixed
- **Compatibility**: Used named import for `tar` package to support v7.x API changes

## [2.0.2] - 2026-01-30

### Refactored
- **Modernized**: Removed `node-fetch` dependency in favor of native `fetch` (requires Node.js 18+)

## [2.0.1] - 2026-01-30

### Fixed
- **Security**: Updated `tar` dependency to v7.4.3 to address vulnerabilities

## [2.0.0] - 2026-01-30

### Breaking Changes
- **Package renamed**: `@maccesar/titanium-skills` → `@maccesar/titools`
- **Repository renamed**: `macCesar/titanium-sdk-skills` → `macCesar/titools`
- **New CLI**: Complete NPM package with `titools` command
- **New command**: `titools agents` replaces `ti-docs-index` script
- **Version management**: Package version now used in documentation blocks (e.g., `<!-- TITANIUM-KNOWLEDGE-v2.0.0 -->`)

### Added
- **NPM package**: Full CLI implementation with Node.js
  - `titools install` - Install skills and agents globally
  - `titools agents` - Add AGENTS.md/CLAUDE.md/GEMINI.md to projects
  - `titools update` - Update to latest version from GitHub
  - `titools --version` - Show version
- **Cross-platform support**: Works on macOS, Linux, Windows
- **Smart content preservation**: `titools agents` preserves existing file content
- **Priority logic**: Automatically updates all AI files when multiple exist (CLAUDE.md > GEMINI.md > AGENTS.md)
- **Version detection**: Blocks include package version for tracking

### Removed
- **AGENTS-VERCEL-RESEARCH.md**: Informational only (content now generated dynamically by CLI)
- **ti-docs-index script**: Replaced by `titools agents` command

### Fixed
- **Symlink creation**: Fixed callback/promises issue in symlink creation
- **Permission handling**: Gracefully handles permission errors when writing to protected directories

### Migration from v1.x
```bash
# Uninstall old version
npm uninstall -g @maccesar/titanium-skills

# Install new version
npm install -g @maccesar/titools

# Run install
titools install

# Update your projects
cd /path/to/your/titanium/project
titools agents
```

---

## [1.6.5] - 2026-01-28

### Added
- **purgetss/references/ui-ux-design.md**: Added simplified icon button pattern examples
  - Single `Label` approach for circular icon buttons using `rounded-full-XX`
  - Eliminates need for wrapper `View`, reduces DOM depth
  - New "Header with Positioned Icon Buttons" example showing `ml-0`/`mr-2` positioning
  - Updated FAB (Floating Action Button) with simplified pattern
  - Added `SINGLE-LABEL ICON BUTTONS` tip box explaining the pattern

### Changed
- **purgetss/references/ui-ux-design.md**: Updated all icon button examples across sections
  - Icon Button section shows both simplified and verbose approaches
  - Circular Icon Button (Icons section) updated with simplified pattern
  - Accessibility examples updated with simplified pattern
  - Touch Target Sizes updated with simplified pattern

## [1.6.4] - 2026-01-28

### Fixed
- **ti-expert/references/alloy-structure.md**: Added critical documentation about `lib/` folder flattening
  - Alloy flattens `app/lib/` to `Resources/iphone/` during build
  - Require statements must omit `lib/` prefix: `require('services/picsum')` not `require('lib/services/picsum')`
  - Prevents "Module not found" errors at runtime
- **ti-expert/references/anti-patterns.md**: Added 4 new common pitfalls from real-world testing
  - #16: Using `lib/` prefix in require statements
  - #17: Wrong Window ID in Controller (`$.index.open()` vs `$.mainWindow.open()`)
  - #18: Using non-existent `Ti.UI.createNotification` API
  - #19: Using non-existent iOS Share APIs (`Ti.UI.iOS.createActivityPopover`)
- **purgetss/SKILL.md**: Added two new documentation sections
  - "NEW PROJECT: Clean Up Default app.tss" - Tip to delete default template for fresh start
  - "CRITICAL: Understanding Layout Composition" - Visual examples of `vertical`, `horizontal`, `composite` layouts
    - Addresses common issue where elements appear in unexpected positions
    - Explains that each container's layout affects only direct children
- **alloy-howtos/references/cli_reference.md**: Added "COMMON ti build PITFALLS" section
  - Explains `-C` flag requires UDID, prompts interactively without it
  - Documents correct patterns for simulator/device targeting
  - Provides common build command examples

### Changed
- **ti-expert/references/anti-patterns.md**: Updated Quick Reference Table with 3 new entries

## [1.6.3] - 2026-01-28

### Fixed
- **Auto-triggering**: All 7 skill descriptions now explicitly mention "Titanium" at the beginning
  - Previous descriptions assumed Titanium context but Claude Code needs explicit keywords
  - ti-expert: "Architecture..." → "**Titanium** Alloy architecture..."
  - purgetss: "PurgeTSS utility..." → "**Titanium** PurgeTSS utility..."
  - ti-ui: "UI/UX patterns..." → "**Titanium** SDK UI/UX patterns..."
  - ti-howtos: "Native feature..." → "**Titanium** SDK native feature..."
  - ti-guides: "Official SDK..." → "**Titanium** SDK official..."
  - alloy-guides: "Official Alloy..." → "**Titanium** Alloy MVC..."
  - alloy-howtos: "Alloy CLI..." → "**Titanium** Alloy CLI..."
- **Missing symlinks**: Created symlinks for ti-guides, ti-howtos, ti-ui in ~/.claude/skills/
  - These 3 skills were installed in ~/.agents/skills/ but not symlinked to Claude Code
  - All 7 skills are now properly available to Claude Code

## [1.6.2] - 2026-01-28

### Removed
- **Detection scripts**: Removed all `assets/detect.js` files from all 7 skills
  - These scripts were never used by Claude Code's auto-triggering mechanism
  - Auto-triggering uses the `description` field in skill.md frontmatter, not external scripts
  - Eliminates confusion about how skill activation works
  - Removed references from README.md and CHANGELOG.md

### Changed
- **README.md**: Removed manual detection command examples (lines 182-183, 555)
  - Users should mention technologies explicitly in prompts instead
  - Aligns documentation with actual auto-triggering mechanism

## [1.6.1] - 2026-01-28

### Changed
- **ti-pro agent model**: Upgraded from `haiku` to `sonnet` for improved analysis capabilities
  - Sonnet provides better reasoning for complex codebase analysis tasks
  - Maintains fast performance while delivering more comprehensive research results
- **ti-pro agent description**: Removed non-standard `TRIGGER KEYWORDS:` block from frontmatter
  - Keywords now integrated naturally in description for better Claude Code compatibility
  - Aligns with official Claude Code subagent format standards
- **ti-pro agent description**: Made description more specific to improve auto-triggering
  - Replaced generic "analyzing codebases" with specific "analyzing Titanium/Alloy codebases"
  - Added explicit trigger phrases: "Titanium", "Alloy", "mobile app", "architecture review"
  - Fixed issue where agent wasn't being triggered for Alloy projects

### Added
- **ti-pro Usage Examples section**: Documented example prompts for automatic and manual activation
  - Helps users understand how to trigger the agent effectively
  - Includes both proactive and explicit invocation patterns
  - Added tip about including "Titanium"/"Alloy" keywords in prompts

## [1.6.0] - 2026-01-28

### Changed
- **Refactored skill descriptions** across all 7 skills (from ~100 to ~37 words each, -63% average)
  - Removed explicit `TRIGGER KEYWORDS:` block (redundant - keywords integrated naturally)
  - Removed shared generic keywords: `titanium`, `alloy`, `mobile`, `ios`, `android` (caused ambiguity)
  - Removed component keywords: `ImageView`, `Button`, `Label`, etc. (not specific to single skill)
  - Removed generic terms: `how to`, `guide`, `tutorial`, `implement` (redundant)
  - Kept skill-specific keywords for better discrimination
  - Descriptions now use natural language instead of keyword lists

### Improved
- **Auto-triggering precision**: Shorter, more specific descriptions reduce false positives
- **Keyword discrimination**: Each skill now has unique, non-overlapping trigger terms
- **Description clarity**: Natural language flows better than explicit keyword lists

### Fixed
- **Keyword pollution**: v1.5.0 added shared keywords to all skills, causing trigger ambiguity
- **Missing keyword**: `analyze` was not in any skill (still not present - use specific terms like "architecture review" instead)

## [1.5.0] - 2026-01-28

### Changed
- **Shortened frontmatter descriptions** across all 7 skills (from ~400 to ~60 words each)
  - Improves auto-triggering precision by reducing metadata noise
  - Detailed coverage info moved to SKILL.md body for better progressive disclosure
  - All TRIGGER KEYWORDS preserved for discoverability
- **Removed MANDATORY INVOCATION sections** from all 7 skills
  - Confidence in TRIGGER KEYWORDS for reliable auto-triggering
  - Eliminates tension between "mandatory" and "automatic" invocation
  - Reduces SKILL.md size and context usage
- **Standardized platform-specific property warnings** across all 5 affected skills
  - Consistent format and structure for critical warnings
  - Added cross-references to related skills for expanded content
  - Maintains warnings in each skill for independence (no shared dependencies)
- **Improved project detection documentation** across all 7 skills
  - Clarified that detection is automatic (no manual command needed)
  - Documented behavior based on detection results
  - Better explanation of what happens when project type is detected/not detected

### Improved
- **Auto-triggering accuracy**: Shorter descriptions = more precise matching
- **Consistency**: Standardized warning format across skills
- **Clarity**: Detect.js integration now clearly explained as automatic
- **Best practices**: Changes follow skill-creator guidelines for optimal skill design

## [1.4.0] - 2025-01-28

### Added
- **CRITICAL Platform-Specific Property Warnings**: Added comprehensive warnings across all skills about using platform modifiers
  - `purgetss/SKILL.md`: Added "PLATFORM-SPECIFIC PROPERTIES REQUIRE MODIFIERS" critical section
  - `purgetss/references/platform-modifiers.md`: Added "🚨 CRITICAL" warning at top of file
  - `ti-ui/SKILL.md`: Added "Platform-Specific Properties" to Critical Rules section
  - `ti-ui/references/layouts-and-positioning.md`: Added "🚨 CRITICAL" warning at top of file
  - `alloy-guides/SKILL.md`: Added new "Critical Rules" section with platform-specific property warnings
  - `alloy-guides/references/VIEWS_STYLES.md`: Added critical warning in Platform-Specific Styles section
  - `ti-howtos/SKILL.md`: Added "Platform-Specific Properties" to Native Integration Rules section
  - Warnings explain the Michael Gangolf issue: iOS code added to Android build causing failures
  - Shows WRONG vs CORRECT patterns for all affected properties
- **Project Detection System**: All 7 skills now auto-detect project type before providing guidance
  - `purgetss`: Detects if project uses PurgeTSS (checks for `purgetss/` folder, `config.cjs`, `utilities.tss`)
  - `alloy-*` skills: Detects Alloy vs Classic projects (checks for `app/` vs `Resources/` structure)
  - `ti-*` skills: Detects Titanium projects (checks for `tiapp.xml`)
- **Detection scripts**: All `assets/detect.js` scripts removed (unused - auto-detection works via skill description matching)
- **MANDATORY INVOCATION section** to all skills with explicit invocation instructions
- **Project Detection section** to all skills explaining auto-detection behavior
- **AUTO-DETECTION** notation to all skill descriptions for transparency
- **Expanded TRIGGER KEYWORDS**: Added common Titanium/Alloy terms (`titanium`, `alloy`, `mobile`, `ios`, `android`, `ImageView`, `ScrollView`, `ListView`, `Window`, `View`, `Button`, `Label`, `createButton`, `createLabel`, `createImageView`, `createView`, `createScrollView`, `createWindow`, `aspect fit`, `aspect fill`, `scalingMode`, `zoom`, `contentWidth`, `contentHeight`, `w-screen`, `h-screen`, `bg-`, `rounded-`, `m-`, `mx-`, `my-`, `classes`, `utility`)
- **Bash(node *)** to all skills' `allowed-tools` for detection script execution
- **Edit, Write** to `alloy-guides`, `alloy-howtos`, `ti-ui`, `ti-guides` (previously read-only)

### Changed
- **Skills now verify project compatibility** before suggesting patterns
- **PurgeTSS skill**: Only suggests PurgeTSS classes when detected in project
- **Alloy skills**: Only provides Alloy-specific guidance when Alloy structure detected
- **Improved discoverability**: More trigger keywords mean skills activate more reliably
- **All skills now capable of applying changes** (not just suggestions)

### Fixed
- **Inconsistent tool permissions**: Some skills could only suggest changes, now all can apply changes
- **Classic Titanium projects**: Alloy skills now indicate incompatibility instead of suggesting wrong patterns

## [1.3.0] - 2025-01-28

### Added
- **TRIGGER KEYWORDS** to all 7 skills and ti-pro agent for improved AI discoverability
  - Explicit trigger phrases in YAML `description` field help match user queries to skills
  - Keywords based on skill-creator best practices for cross-platform compatibility
- **ti-pro**: Added trigger keywords for codebase analysis and research scenarios

### Changed
- **All skills**: Removed HTML comment trigger sections (only YAML description is used for matching)
  - Per skill-creator guidance: body content only loads AFTER skill triggers
  - Trigger keywords now centralized in YAML `description` field
- **Skill discoverability**: Enhanced with explicit user intent patterns (create, setup, debug, style, etc.)

### Removed
- **skills/TRIGGER-PATTERNS.md**: Redundant reference file (triggers now in each skill's description)

## [1.2.0] - 2025-01-28

### Added
- **ti-pro sub-agent**: Deep-dive research specialist for Claude Code that preloads all 7 titanium-* skills
  - Runs in isolated context with read-only tools (Read, Grep, Glob)
  - Ideal for codebase analysis, multi-feature research, and cross-skill queries
  - Uses Haiku model for fast, efficient research
- **allowed-tools field**: All skills now specify which tools can be used without permission prompts
- **argument-hint field**: All skills now have autocomplete hints for expected arguments
- **.gitignore**: Added macOS (.DS_Store) and editor-specific files (vim, vscode, idea)

### Changed
- **install.sh**: Now installs both skills and sub-agents
  - Skills → `~/.agents/skills/` (central location)
  - Agents → `~/.claude/agents/` (Claude Code only)
- **install.sh**: Cleaner output format with single-line progress indicators
  - Before: Per-item checkmarks and "Done" messages
  - After: `→ Installing skills... ✓` format
- **README.md**: Added comprehensive agents section with usage guide and comparison table
- **README.md**: Fixed uninstall command to only remove titanium-sdk-skills (was deleting entire `~/.agents/skills/` directory)

### Fixed
- **Installer**: Error indicator changed from "Failed" to ✗ for consistency with success ✓

## [1.1.0] - 2025-01-27

### Added
- **ti-expert**: "How to create a new Alloy project?" entry to Quick Decision Matrix
- **ti-guides**: `--alloy` flag documentation to `ti create` command reference
- **alloy-guides**: New "Creating a New Application" section recommending `ti create --alloy`

### Changed
- **Project creation documentation**: Now recommends `ti create --alloy` instead of `--classic` + `alloy new` pattern
- **URL updates**: Migrated docs.appcelerator.com links to titaniumsdk.com
- **Namespace updates**: Changed `com.appcelerator.*` examples to `com.titaniumsdk.*`
- **Repository links**: Updated to tidev organization (current Titanium SDK maintainers)
- **Removed legacy references**: Removed Appcelerator Studio IDE reference

## [1.1.0] - 2025-01-26

### Added
- **Centralized installer architecture**: Skills now install to `~/.agents/skills/` with symlinks to detected AI platforms
- **Local repository support**: Installer can use local repo when running from source directory
- **ControllerAutoCleanup.js**: Reusable utility asset for automatic controller memory cleanup in ti-expert
- **PurgeTSS class-index.md**: Complete inventory of 21,236 utility classes across 364 prefixes and 416 properties
- **PurgeTSS dynamic-component-creation.md**: Guide for `$.UI.create()` and `Alloy.createStyle()` runtime usage
- **ti-howtos automation-fastlane-appium.md**: CI/CD automation with Fastlane and Appium testing
- **ti-howtos buffer-codec-streams.md**: Binary data handling and stream processing
- **ti-howtos google-maps-v2.md**: Google Maps Android SDK integration guide
- **ti-howtos ios-map-kit.md**: Apple MapKit framework integration guide
- **ti-howtos webpack-build-pipeline.md**: Webpack configuration for Titanium builds

### Changed
- **Enhanced all SKILL.md descriptions**: Emphasized as PRIMARY SOURCE to improve LLM discoverability
- **Enhanced all SKILL.md files**: Added comprehensive table of contents and structured formatting
- **Improved ti-expert**: Expanded ES6+ patterns, security, testing, and performance documentation
- **Enhanced purgetss**: Clarified `app.tss` vs `_app.tss` workflow, strengthened animation and grid docs
- **Improved ti-guides**: Updated coding best practices and CommonJS patterns
- **Enhanced ti-howtos**: Restructured location/maps content, improved platform deep-dives
- **Improved ti-ui**: Better event handling, gestures, and platform-specific UI guides
- **Enhanced alloy-guides**: Expanded Models, Views, Controllers, and Widgets references
- **Improved alloy-howtos**: Strengthened CLI, config, and debugging documentation

### Added
- **Opinionated disclaimers**: ti-expert and purgetss now include notes reflecting personal coding preferences

### Removed
- **Deprecated Claude plugin files**: Removed `.claude-plugin/` directory in favor of standard Agent Skills format

## [1.0.2] - 2025-01-25

### Added
- Related Skills section to all 6 specialized skills for cross-skill collaboration
- `smart-mappings.md` reference to purgetss skill

### Changed
- README.md now includes complete user guide (merged from separate docs)
- Updated `titanium-resets.md` reference in purgetss

### Fixed
- YAML frontmatter in 4 SKILL.md files (quoted description values containing colons)

## [1.0.1] - 2025-01-25

### Changed
- Installer now prompts user to select platform(s) instead of installing to all automatically
- Compact installer output with cleaner formatting
- Added `--all` flag to install to all platforms without prompting

### Fixed
- Bash 3.x compatibility for macOS (removed associative arrays)

## [1.0.0] - 2025-01-25

### Added
- Initial release with 7 specialized skills:
  - **ti-expert**: Architecture + Implementation patterns (merged from alloy-architect and alloy-engineer)
  - **purgetss**: Utility-first styling toolkit
  - **ti-ui**: UI/UX patterns and platform components
  - **ti-howtos**: Native feature integration
  - **ti-guides**: SDK fundamentals, Hyperloop, distribution
  - **alloy-guides**: Alloy MVC framework reference
  - **alloy-howtos**: Alloy CLI and debugging
- Cross-platform installer supporting Claude Code, Gemini CLI, and Codex CLI
- 97 files with 28,627 lines of documentation
- Comprehensive README with usage examples

### Notes
- Some skills are **opinionated** and **biased** toward PurgeTSS (created by the author)
- `ti-expert` and `purgetss` reflect personal coding conventions
