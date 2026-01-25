---
name: alloy-guides
description: Comprehensive guide for the Alloy MVC framework for Titanium SDK. Use when working with Titanium Alloy applications - creating or modifying Alloy MVC components (models, views, controllers), implementing data binding with Backbone.js models and collections, styling with TSS (Titanium Style Sheets), working with widgets and components, using the Alloy CLI for code generation, implementing migrations and sync adapters, integrating PurgeTSS for utility-first styling. This skill contains the complete official Alloy documentation.
---

# Alloy MVC Framework Guide

Complete reference for building Titanium mobile applications with the Alloy MVC framework and Backbone.js.

## Quick Reference

| Topic | Reference File |
|-------|---------------|
| Core concepts, MVC, Backbone.js, conventions | [CONCEPTS.md](references/CONCEPTS.md) |
| Controllers, events, conditional code, arguments | [CONTROLLERS.md](references/CONTROLLERS.md) |
| Models, collections, data binding, migrations | [MODELS.md](references/MODELS.md) |
| XML markup, elements, attributes, events | [VIEWS_XML.md](references/VIEWS_XML.md) |
| TSS styling, themes, platform-specific styles | [VIEWS_STYLES.md](references/VIEWS_STYLES.md) |
| Dynamic styles, autostyle, runtime styling | [VIEWS_DYNAMIC.md](references/VIEWS_DYNAMIC.md) |
| Controllers-less views, patterns | [VIEWS_WITHOUT_CONTROLLERS.md](references/VIEWS_WITHOUT_CONTROLLERS.md) |
| Creating and using widgets | [WIDGETS.md](references/WIDGETS.md) |
| CLI commands, code generation | [CLI_TASKS.md](references/CLI_TASKS.md) |
| PurgeTSS integration and features | [PURGETSS.md](references/PURGETSS.md) |

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
