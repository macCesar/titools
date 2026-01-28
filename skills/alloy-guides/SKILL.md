---
name: alloy-guides
description: "Official Alloy MVC framework reference. Use when working with models, views, controllers, Backbone.js data binding, TSS styling, widgets, Alloy CLI, sync adapters, migrations, or MVC compilation. Explains how Backbone.js models and collections work in Alloy."
argument-hint: "[concept]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# Alloy MVC Framework Guide

Complete reference for building Titanium mobile applications with the Alloy MVC framework and Backbone.js.

## Project Detection

:::info AUTO-DETECTS ALLOY PROJECTS
This skill automatically detects Alloy projects when invoked and provides framework-specific guidance.

**Detection occurs automatically** - no manual command needed.

**Alloy project indicators:**
- `app/` folder (MVC structure)
- `app/views/`, `app/controllers/` folders
- `app/models/` folder

**Behavior based on detection:**
- **Alloy detected** → Provides Alloy MVC documentation, Backbone.js patterns, TSS styling, widgets
- **Not detected** → Indicates this skill is for Alloy projects only, does not suggest Alloy-specific features
:::

## Table of Contents

- [Alloy MVC Framework Guide](#alloy-mvc-framework-guide)
  - [Project Detection](#project-detection)
  - [Table of Contents](#table-of-contents)
  - [Quick Reference](#quick-reference)
  - [Project Structure](#project-structure)
  - [MVC Quick Start](#mvc-quick-start)
  - [Key Concepts](#key-concepts)
  - [Critical Rules](#critical-rules)
    - [Platform-Specific Properties in TSS](#platform-specific-properties-in-tss)
  - [Common Patterns](#common-patterns)
    - [Creating a Model](#creating-a-model)
    - [Data Binding](#data-binding)
    - [Platform-Specific Code](#platform-specific-code)
    - [Widget Usage](#widget-usage)
  - [Compilation Process](#compilation-process)
  - [References](#references)
  - [Related Skills](#related-skills)

---

## Quick Reference

| Topic                                            | Reference File                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| Core concepts, MVC, Backbone.js, conventions     | [CONCEPTS.md](references/CONCEPTS.md)                                   |
| Controllers, events, conditional code, arguments | [CONTROLLERS.md](references/CONTROLLERS.md)                             |
| Models, collections, data binding, migrations    | [MODELS.md](references/MODELS.md)                                       |
| XML markup, elements, attributes, events         | [VIEWS_XML.md](references/VIEWS_XML.md)                                 |
| TSS styling, themes, platform-specific styles    | [VIEWS_STYLES.md](references/VIEWS_STYLES.md)                           |
| Dynamic styles, autostyle, runtime styling       | [VIEWS_DYNAMIC.md](references/VIEWS_DYNAMIC.md)                         |
| Controllers-less views, patterns                 | [VIEWS_WITHOUT_CONTROLLERS.md](references/VIEWS_WITHOUT_CONTROLLERS.md) |
| Creating and using widgets                       | [WIDGETS.md](references/WIDGETS.md)                                     |
| CLI commands, code generation                    | [CLI_TASKS.md](references/CLI_TASKS.md)                                 |
| PurgeTSS integration and features                | [PURGETSS.md](references/PURGETSS.md)                                   |

## Project Structure

Standard Alloy project structure:

```
app/
├── alloy.js              # Initializer file
├── alloy.jmk             # Build configuration
├── config.json           # Project configuration
├── assets/               # Images, fonts, files (→ Resources/)
├── controllers/          # Controller files (.js)
├── i18n/                 # Localization strings (→ i18n/)
├── lib/                  # CommonJS modules
├── migrations/           # DB migrations (<DATETIME>_<name>.js)
├── models/               # Model definitions (.js)
├── platform/             # Platform-specific resources (→ platform/)
├── specs/                # Test-only files (dev/test only)
├── styles/               # TSS files (.tss)
├── themes/               # Theme folders
├── views/                # XML markup files (.xml)
└── widgets/              # Widget components
```

## MVC Quick Start

**Controller** (`app/controllers/index.js`):
```javascript
function doClick(e) {
    alert($.label.text);
}
$.index.open();
```

**View** (`app/views/index.xml`):
```xml
<Alloy>
    <Window class="container">
        <Label id="label" onClick="doClick">Hello, World</Label>
    </Window>
</Alloy>
```

**Style** (`app/styles/index.tss`):
```javascript
".container": { backgroundColor: "white" }
"Label": { color: "#000" }
```

## Key Concepts

- **Models/Collections**: Backbone.js objects with sync adapters (sql, properties)
- **Views**: XML markup with TSS styling
- **Controllers**: JavaScript logic with `$` reference to view components
- **Data Binding**: Bind collections to UI components automatically
- **Widgets**: Reusable components with MVC structure
- **Conventions**: File naming and placement drive code generation

## Critical Rules

### Platform-Specific Properties in TSS

:::danger CRITICAL: Platform-Specific Properties Require Modifiers
Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties in TSS WITHOUT platform modifiers causes cross-platform compilation failures.

**Example of the damage:**
```tss
// ❌ WRONG - Adds Ti.UI.iOS to Android project
"#mainWindow": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT  // FAILS on Android!
}
```

**CORRECT approach - Use platform modifiers:**
```tss
// ✅ CORRECT - Only adds to iOS
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}

// ✅ CORRECT - Only adds to Android
"#mainWindow[platform=android]": {
  actionBar: {
    displayHomeAsUp: true
  }
}
```

**Properties that ALWAYS require platform modifiers:**
- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
- Android: `actionBar` config, any `Ti.UI.Android.*` constant

**Available modifiers:** `[platform=ios]`, `[platform=android]`, `[formFactor=handheld]`, `[formFactor=tablet]`, `[if=Alloy.Globals.customVar]`

**For more platform-specific patterns, see** [Platform Modifiers (purgetss)](skills/purgetss/references/platform-modifiers.md) or [Platform UI guides (ti-ui)](skills/ti-ui/references/platform-ui-ios.md).
:::

## Common Patterns

### Creating a Model
```bash
alloy generate model book sql title:string author:string
```

### Data Binding
```xml
<Collection src="book" />
<TableView dataCollection="book">
    <TableViewRow title="{title}" />
</TableView>
```

### Platform-Specific Code
```javascript
if (OS_IOS) {
    // iOS-only code
}
if (OS_ANDROID) {
    // Android-only code
}
```

### Widget Usage
```xml
<Widget src="mywidget" id="foo" />
```

## Compilation Process

1. **Cleanup**: Resources folder cleaned
2. **Build Config**: alloy.jmk loaded (pre:load task)
3. **Framework Files**: Backbone.js, Underscore.js, sync adapters copied
4. **MVC Generation**: Models, widgets, views, controllers compiled to JS
5. **Main App**: app.js generated from template
6. **Optimization**: UglifyJS optimization, platform-specific code removal

## References

Read detailed documentation from the reference files listed above based on your specific task.

## Related Skills

For tasks beyond Alloy MVC basics, use these complementary skills:

| Task                                      | Use This Skill |
| ----------------------------------------- | -------------- |
| Modern architecture, services, patterns   | `alloy-expert` |
| Alloy CLI, config files, debugging errors | `alloy-howtos` |
| Utility-first styling with PurgeTSS       | `purgetss`     |
| Native features (location, push, media)   | `ti-howtos`    |
