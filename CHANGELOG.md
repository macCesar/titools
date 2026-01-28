# Changelog

All notable changes to Titanium SDK Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
