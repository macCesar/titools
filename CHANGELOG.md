# Changelog

All notable changes to Titanium SDK Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.6.3] - 2026-01-28

### Fixed
- **Auto-triggering**: All 7 skill descriptions now explicitly mention "Titanium" at the beginning
  - Previous descriptions assumed Titanium context but Claude Code needs explicit keywords
  - alloy-expert: "Architecture..." → "**Titanium** Alloy architecture..."
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
- **ti-researcher agent model**: Upgraded from `haiku` to `sonnet` for improved analysis capabilities
  - Sonnet provides better reasoning for complex codebase analysis tasks
  - Maintains fast performance while delivering more comprehensive research results
- **ti-researcher agent description**: Removed non-standard `TRIGGER KEYWORDS:` block from frontmatter
  - Keywords now integrated naturally in description for better Claude Code compatibility
  - Aligns with official Claude Code subagent format standards
- **ti-researcher agent description**: Made description more specific to improve auto-triggering
  - Replaced generic "analyzing codebases" with specific "analyzing Titanium/Alloy codebases"
  - Added explicit trigger phrases: "Titanium", "Alloy", "mobile app", "architecture review"
  - Fixed issue where agent wasn't being triggered for Alloy projects

### Added
- **ti-researcher Usage Examples section**: Documented example prompts for automatic and manual activation
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
  - `purgetss`: Detects if project uses PurgeTSS (checks for `purgetss/` folder, `config.cjs`, `tailwind.tss`)
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
- **TRIGGER KEYWORDS** to all 7 skills and ti-researcher agent for improved AI discoverability
  - Explicit trigger phrases in YAML `description` field help match user queries to skills
  - Keywords based on skill-creator best practices for cross-platform compatibility
- **ti-researcher**: Added trigger keywords for codebase analysis and research scenarios

### Changed
- **All skills**: Removed HTML comment trigger sections (only YAML description is used for matching)
  - Per skill-creator guidance: body content only loads AFTER skill triggers
  - Trigger keywords now centralized in YAML `description` field
- **Skill discoverability**: Enhanced with explicit user intent patterns (create, setup, debug, style, etc.)

### Removed
- **skills/TRIGGER-PATTERNS.md**: Redundant reference file (triggers now in each skill's description)

## [1.2.0] - 2025-01-28

### Added
- **ti-researcher sub-agent**: Deep-dive research specialist for Claude Code that preloads all 7 titanium-* skills
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
- **alloy-expert**: "How to create a new Alloy project?" entry to Quick Decision Matrix
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
- **ControllerAutoCleanup.js**: Reusable utility asset for automatic controller memory cleanup in alloy-expert
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
- **Improved alloy-expert**: Expanded ES6+ patterns, security, testing, and performance documentation
- **Enhanced purgetss**: Clarified `app.tss` vs `_app.tss` workflow, strengthened animation and grid docs
- **Improved ti-guides**: Updated coding best practices and CommonJS patterns
- **Enhanced ti-howtos**: Restructured location/maps content, improved platform deep-dives
- **Improved ti-ui**: Better event handling, gestures, and platform-specific UI guides
- **Enhanced alloy-guides**: Expanded Models, Views, Controllers, and Widgets references
- **Improved alloy-howtos**: Strengthened CLI, config, and debugging documentation

### Added
- **Opinionated disclaimers**: alloy-expert and purgetss now include notes reflecting personal coding preferences

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
  - **alloy-expert**: Architecture + Implementation patterns (merged from alloy-architect and alloy-engineer)
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
- `alloy-expert` and `purgetss` reflect personal coding conventions
