# Changelog

All notable changes to titools will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
