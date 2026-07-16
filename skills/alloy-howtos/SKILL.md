---
name: alloy-howtos
description: Use when an Alloy MVC project needs help with the Alloy CLI (`alloy new`, `alloy generate`, `alloy compile`, `alloy extract-i18n`), configuration files (`alloy.jmk` build hooks, `config.json` env/platform precedence, `widget.json`), conditional views (`if=` attribute in XML/TSS), custom XML tags via `app/lib/`, Backbone.Events for cross-controller communication, or debugging Alloy compilation errors. Triggers include `app/views/` + `app/controllers/`, `alloy.jmk`, or `config.json` in the project root.
---

# alloy-howtos

## Overview

Practical reference for Titanium Alloy MVC projects: CLI usage, project configuration, conditional rendering, custom XML tags, cross-controller communication, and common compilation/runtime errors. Reference-style — load the relevant file from `references/` for deeper detail.

## When to use

Use this skill when:

- The project contains `app/views/` + `app/controllers/`, `alloy.jmk`, or `config.json`
- Running or scripting the Alloy CLI (`alloy new`, `alloy generate`, `alloy compile`, ...)
- Configuring `alloy.jmk` build hooks or `config.json` environment / platform precedence
- Writing conditional views with `if=` in XML or TSS
- Building reusable custom XML tags in `app/lib/`
- Wiring cross-controller communication via `Backbone.Events`
- Diagnosing Alloy compilation errors or platform-specific runtime issues

Do NOT use for:

- Alloy MVC concepts, controllers, models, or data binding (use `alloy-guides`)
- Titanium SDK fundamentals, `tiapp.xml`, Hyperloop, or app distribution (use `ti-guides`)
- Native module dependency updates (use `ti-module-update`)

## Quick reference

| Topic | Reference |
|---|---|
| Coding standards, naming, global events patterns | [best_practices.md](references/best_practices.md) |
| All CLI commands with options and model schema format | [cli_reference.md](references/cli_reference.md) |
| `alloy.jmk` tasks, `config.json` structure, `widget.json` format | [config_files.md](references/config_files.md) |
| Creating reusable custom XML tags without widgets | [custom_tags.md](references/custom_tags.md) |
| Common errors with solutions | [debugging_troubleshooting.md](references/debugging_troubleshooting.md) |
| Controller examples, conditional views, data-binding patterns | [samples.md](references/samples.md) |

## Key practices

### Naming conventions

- **Never use double underscore prefixes** (`__foo`) — reserved for Alloy
- **Never use JavaScript reserved words as IDs**

### Global events — use Backbone.Events

Avoid `Ti.App.fireEvent` / `Ti.App.addEventListener`. They cross the native-JS bridge and can cause memory leaks and slower execution.

Use the Backbone.Events pattern:

```javascript
// In alloy.js
Alloy.Events = _.clone(Backbone.Events);

// Listener
Alloy.Events.on('updateMainUI', refreshData);

// Clean up on close
$.controller.addEventListener('close', () => {
    Alloy.Events.off('updateMainUI');
});

// Trigger
Alloy.Events.trigger('updateMainUI');
```

### Global variables in non-controller files

Always require Alloy modules:

```javascript
const Alloy = require('alloy');
const Backbone = require('alloy/backbone');
const _ = require('alloy/underscore')._;
```

## Conditional views

Use `if` attributes in XML for conditional rendering (evaluated before render):

```xml
<Alloy>
    <Window>
        <View if="Alloy.Globals.isLoggedIn()" id="loggedIn">
            <Label text="Logged in" />
        </View>
        <View if="!Alloy.Globals.isLoggedIn()" id="notLoggedIn">
            <Label text="Not logged in" />
        </View>
    </Window>
</Alloy>
```

Conditional TSS styles:

```tss
"#info[if=Alloy.Globals.isIos7Plus]": {
    font: { textStyle: Ti.UI.TEXT_STYLE_FOOTNOTE }
}
```

Data-binding conditionals:

```xml
<TableViewRow if="$model.shouldShowCommentRow()">
```

## Common error solutions

| Error | Solution |
|---|---|
| `No app.js found` | Run `alloy compile --config platform=<platform>` |
| Android assets not showing | Use absolute paths (prepend `/`) |
| `Alloy is not defined` (non-controller) | Add `const Alloy = require('alloy');` |
| iOS `invalid method passed to UIModule` | Creating Android-only object — use `platform` attribute |

## CLI quick reference

```bash
# New project
alloy new [path] [template]

# Generate components
alloy generate controller <name>
alloy generate model <name> <adapter> <schema>
alloy generate style --all

# Compile
alloy compile [--config platform=android,deploytype=test]

# Extract i18n strings
alloy extract-i18n en --apply

# Copy / move / remove controllers
alloy copy <old> <new>
alloy move <old> <new>
alloy remove <name>
```

## Configuration files priority

`config.json` precedence: `os:<platform>` > `env:<environment>` > `global`

Access at runtime: `Alloy.CFG.<key>`

## Custom XML tags

Reusable components without the overhead of widgets. Drop a file in `app/lib/`:

**`app/lib/checkbox.js`**
```javascript
exports.createCheckBox = args => {
    const wrapper = Ti.UI.createView({ layout: 'horizontal', checked: false });
    const box = Ti.UI.createView({ width: 15, height: 15, borderWidth: 1 });
    // ... build component, return Ti.UI.* object
    return wrapper;
};
```

**`view.xml`**
```xml
<CheckBox module="checkbox" id="terms" caption="I agree" onChange="onCheck" />
```

The `module` attribute points to the file in `app/lib/` (without `.js`). The function must be `create<TagName>`.

See [custom_tags.md](references/custom_tags.md) for the complete worked example.

## Related skills

| Task | Use this skill |
|---|---|
| Alloy MVC concepts, controllers, models, data binding | `alloy-guides` |
| Titanium SDK config, Hyperloop, app distribution | `ti-guides` |
| Titanium API lookup (Ti.UI, Ti.Network, modules) | `ti-api` |
| Native module dependency updates | `ti-module-update` |
