---
name: ti-guides
description: "Official SDK fundamentals and configuration. Use when working with Hyperloop native access, app distribution (App Store/Google Play), tiapp.xml configuration, CLI commands, memory management, bridge optimization, CommonJS modules, SQLite transactions, or coding standards. Applies to both Alloy and Classic projects."
argument-hint: "[topic]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# Titanium SDK Guide Expert

This skill ensures Titanium projects follow TiDev standards for stability, performance, and cross-platform reliability.

## Project Detection

:::info AUTO-DETECTS TITANIUM PROJECTS
This skill automatically detects Titanium projects when invoked and provides SDK-specific guidance.

**Detection occurs automatically** - no manual command needed.

**Titanium project indicator:**
- `tiapp.xml` file (definitive indicator)

**Applicable to BOTH:**
- **Alloy projects** (app/ folder)
- **Classic projects** (Resources/ folder)

**Behavior based on detection:**
- **Titanium detected** → Provides official Titanium SDK guidance, memory management best practices, app distribution help
- **Not detected** → Indicates this is for Titanium projects only
:::

## Table of Contents

- [Titanium SDK Guide Expert](#titanium-sdk-guide-expert)
  - [Project Detection](#project-detection)
  - [Table of Contents](#table-of-contents)
  - [Core Workflow](#core-workflow)
  - [Procedural Rules (Low Freedom)](#procedural-rules-low-freedom)
  - [Reference Guides (Progressive Disclosure)](#reference-guides-progressive-disclosure)
  - [Related Skills](#related-skills)
  - [Response Format](#response-format)

---

## Core Workflow

1.  **Architecture Check**: Validate that the project follows a modular pattern (CommonJS or Alloy).
2.  **Memory Review**: Ensure all global listeners are removed and heavy objects are nulled during cleanup.
3.  **Bridge Optimization**: Identify and cache frequently accessed native properties to minimize bridge crossings.
4.  **Native Integration**: Use Hyperloop for specialized native functionality, ensuring proper casting and thread management.
5.  **Asset Management**: Optimize database operations with transactions and manage image memory footprints.

## Procedural Rules (Low Freedom)

-   **Memory Hygiene**: Always remove `Ti.App` and `Ti.Geolocation` listeners in the controller cleanup phase.
-   **No Bridge Calls in Loops**: Never access `Ti.Platform` or `Ti.DisplayCaps` inside loops; store values in local variables.
-   **Hyperloop Naming**: Concatenate selectors accurately (e.g., `addAttribute:value:range:` -> `addAttributeValueRange`).
-   **DB Persistence**: Always close resultsets and database handles after every transaction block.

## Reference Guides (Progressive Disclosure)

-   **[Hello World](references/hello-world.md)**: Project creation, structure, and getting started with Alloy or Classic Titanium.
-   **[JavaScript Primer](references/javascript-primer.md)**: JavaScript fundamentals, learning resources, best practices, and ES6+ features.
-   **[Application Frameworks](references/application-frameworks.md)**: Alloy vs Classic Titanium, architectural patterns, and framework selection.
-   **[Coding Best Practices](references/coding-best-practices.md)**: Memory leaks, bridge efficiency, event naming, security, and lazy loading.
-   **[CommonJS Advanced](references/commonjs-advanced.md)**: Stateful modules, caching, ES6+ support, and antipatterns.
-   **[Advanced Data & Images](references/advanced-data-and-images.md)**: SQLite transactions and image memory optimization.
-   **[Hyperloop Native Access](references/hyperloop-native-access.md)**: Objective-C/Swift/Java syntax, casting, debugging, XIB/Storyboards.
-   **[Style & Conventions](references/style-and-conventions.md)**: Naming standards and formatting rules.
-   **[Reserved Words](references/reserved-words.md)**: ECMAScript, iOS, and Alloy reserved keywords to avoid.
-   **[Alloy CLI Reference](references/alloy-cli-advanced.md)**: extract-i18n, code generation, and build hooks.
-   **[Alloy Data Mastery](references/alloy-data-mastery.md)**: Sync adapters, data binding, and Backbone collections.
-   **[Alloy Widgets & Themes](references/alloy-widgets-and-themes.md)**: Widget structure, styling priorities, and theming.
-   **[Android Manifest](references/android-manifest.md)**: Custom AndroidManifest.xml, permissions, and manifest merge.
-   **[App Distribution](references/app-distribution.md)**: Google Play (APK/AAB), App Store (IPA), certificates, provisioning, and deployment.
-   **[tiapp.xml Configuration](references/tiapp-config.md)**: Complete reference for tiapp.xml and timodule.xml, including all elements, properties, and platform-specific settings.
-   **[CLI Reference](references/cli-reference.md)**: Titanium CLI commands, options, tasks, configuration, and build processes.
-   **[Resources](references/resources.md)**: Community support, modules, sample code, Slack, and learning materials.

## Related Skills

For tasks beyond SDK fundamentals, use these complementary skills:

| Task                                     | Use This Skill |
| ---------------------------------------- | -------------- |
| Project architecture, services, patterns | `alloy-expert` |
| Native features (location, push, media)  | `ti-howtos`    |
| Alloy CLI, configuration, debugging      | `alloy-howtos` |
| UI layouts, ListViews, gestures          | `ti-ui`        |

## Response Format

1.  **Technical Recommendation**: Cite the specific TiDev best practice.
2.  **Optimized Implementation**: Provide modern ES6+ code without semicolons.
3.  **Rationale**: Briefly explain the performance or memory impact.
