---
name: alloy-guides
description: 'Use when working with Alloy MVC projects: writing or reviewing Alloy controllers (`app/controllers/`), XML views (`app/views/`), TSS styles (`app/styles/`), Backbone models and collections (`app/models/`), sync adapters, migrations, widgets, or the Alloy compilation flow. Triggers include the `app/views/` + `app/controllers/` + `app/styles/` folder structure, or `app/models/` for data work. Alloy XML is not HTML; TSS is not CSS; controllers follow Alloy-specific patterns, not web MVC.'
---

# alloy-guides

## Overview

Reference for the Alloy MVC framework on top of Titanium SDK. Covers core concepts, controllers, models / collections / data binding, XML markup, TSS styling (static and dynamic), widgets, and the compile pipeline.

## When to use

Use this skill when:

- The project contains `app/views/`, `app/controllers/`, `app/styles/`, or `app/models/`
- Writing or reviewing Alloy XML markup (`<Alloy>`, `<Window>`, `<View>`, ...)
- Writing or reviewing TSS styles (static and conditional/dynamic)
- Defining Backbone models/collections, data binding, or sync adapters
- Creating, consuming, or packaging widgets
- Understanding the Alloy compilation pipeline (`alloy.jmk`, code generation)
- Diagnosing TSS, XML, or model schema issues

Do NOT use for:

- Alloy CLI usage and configuration files (use `alloy-howtos`)
- Titanium SDK fundamentals, `tiapp.xml`, distribution (use `ti-guides`)
- Looking up Titanium API surfaces (use `ti-api`)
- Native module dependency updates (use `ti-module-update`)

## Quick reference

| Topic | Reference |
|---|---|
| Core concepts, MVC, Backbone.js, conventions | [CONCEPTS.md](references/CONCEPTS.md) |
| Controllers, events, conditional code, arguments | [CONTROLLERS.md](references/CONTROLLERS.md) |
| Models, collections, data binding | [MODELS.md](references/MODELS.md) |
| Sync adapters, migrations, plain Backbone, Backbone version migration | [MODELS_ADVANCED.md](references/MODELS_ADVANCED.md) |
| XML markup, elements, attributes, events | [VIEWS_XML.md](references/VIEWS_XML.md) |
| TSS styling, themes, platform-specific styles | [VIEWS_STYLES.md](references/VIEWS_STYLES.md) |
| Dynamic styles, autostyle, runtime styling | [VIEWS_DYNAMIC.md](references/VIEWS_DYNAMIC.md) |
| Controllers-less views, patterns | [VIEWS_WITHOUT_CONTROLLERS.md](references/VIEWS_WITHOUT_CONTROLLERS.md) |
| Creating and using widgets | [WIDGETS.md](references/WIDGETS.md) |
| CLI commands, code generation | [CLI_TASKS.md](references/CLI_TASKS.md) |
| PurgeTSS integration (optional addon) | [PURGETSS.md](references/PURGETSS.md) |

## Project structure

Standard Alloy project layout:

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

## MVC quick start

**Controller** (`app/controllers/index.js`)
```javascript
function doClick (e) {
    alert($.label.text);
}
$.index.open();
```

**View** (`app/views/index.xml`)
```xml
<Alloy>
    <Window class="container">
        <Label id="label" onClick="doClick">Hello, World</Label>
    </Window>
</Alloy>
```

**Style** (`app/styles/index.tss`)
```javascript
'.container': { backgroundColor: 'white' }
'Label': { color: '#000' }
```

## Key concepts

- **Models / Collections** — Backbone.js objects with sync adapters (`sql`, `properties`)
- **Views** — XML markup with TSS styling
- **Controllers** — JavaScript logic with `$` reference to view components
- **Data Binding** — Bind collections to UI components automatically
- **Widgets** — Reusable components with their own MVC structure
- **Conventions** — File naming and placement drive code generation

## Critical rules

### Platform-specific properties in TSS

> **Warning: Platform-specific properties require modifiers**
>
> Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties in TSS without platform modifiers causes cross-platform compilation failures.
>
> ```tss
> // WRONG — adds Ti.UI.iOS to Android project
> '#mainWindow': {
>     statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT  // FAILS on Android
> }
>
> // CORRECT — only adds to iOS
> '#mainWindow[platform=ios]': {
>     statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
> }
>
> // CORRECT — only adds to Android
> '#mainWindow[platform=android]': {
>     actionBar: { displayHomeAsUp: true }
> }
> ```
>
> Properties that always require platform modifiers:
>
> - **iOS:** `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, anything under `Ti.UI.iOS.*`
> - **Android:** `actionBar` config, anything under `Ti.UI.Android.*`
>
> Available modifiers: `[platform=ios]`, `[platform=android]`, `[formFactor=handheld]`, `[formFactor=tablet]`, `[if=Alloy.Globals.<expression>]`
>
> See [VIEWS_DYNAMIC.md](references/VIEWS_DYNAMIC.md) for the full set of conditional / platform modifier patterns.

## Common patterns

### Creating a model

```bash
alloy generate model book sql title:string author:string
```

### Data binding

```xml
<Collection src="book" />
<TableView dataCollection="book">
    <TableViewRow title="{title}" />
</TableView>
```

### Platform-specific code

```javascript
if (OS_IOS) {
    // iOS-only code
}
if (OS_ANDROID) {
    // Android-only code
}
```

### Widget usage

```xml
<Widget src="mywidget" id="foo" />
```

## Compilation process

1. **Cleanup** — `Resources` folder cleaned
2. **Build config** — `alloy.jmk` loaded (`pre:load` task)
3. **Framework files** — Backbone.js, Underscore.js, sync adapters copied
4. **MVC generation** — Models, widgets, views, controllers compiled to JS
5. **Main app** — `app.js` generated from template
6. **Optimization** — UglifyJS optimization, platform-specific code removal

## Related skills

| Task | Use this skill |
|---|---|
| Alloy CLI, `alloy.jmk`, `config.json`, debugging compilation | `alloy-howtos` |
| Titanium SDK config, Hyperloop, app distribution | `ti-guides` |
| Titanium API lookup (Ti.UI, Ti.Network, modules) | `ti-api` |
| Native module dependency updates | `ti-module-update` |
