---
name: alloy-howtos
description: Comprehensive Alloy MVC Framework guide covering best practices, CLI commands, configuration files, debugging, and code samples. Use when Claude needs to help with Alloy development tasks - creating/configuring Alloy projects, using Alloy CLI commands (new, generate, compile, etc.), configuring alloy.jmk/config.json/widget.json, debugging Alloy compilation or runtime errors, implementing conditional views and data-binding, following Alloy coding best practices and naming conventions, using Backbone.Events for communication instead of Ti.App.fireEvent, or creating custom XML tags for reusable components.
---

# Titanium Alloy How-tos

Comprehensive guide for the Alloy MVC Framework in Titanium SDK.

## Quick Reference

| Topic | Reference |
|-------|-----------|
| Best Practices & Naming Conventions | [best_practices.md](references/best_practices.md) |
| CLI Commands (new, generate, compile) | [cli_reference.md](references/cli_reference.md) |
| Configuration Files (alloy.jmk, config.json) | [config_files.md](references/config_files.md) |
| Custom XML Tags & Reusable Components | [custom_tags.md](references/custom_tags.md) |
| Debugging & Common Errors | [debugging_troubleshooting.md](references/debugging_troubleshooting.md) |
| Code Samples & Conditionals | [samples.md](references/samples.md) |

## Critical Best Practices

### Naming Conventions
- **Never use double underscore prefixes** (`__foo`) - reserved for Alloy
- **Never use JavaScript reserved words as IDs**

### Global Events - Use Backbone.Events
**AVOID** `Ti.App.fireEvent` / `Ti.App.addEventListener` - causes memory leaks and poor performance.

**USE** Backbone.Events pattern:
```javascript
// In alloy.js
Alloy.Events = _.clone(Backbone.Events);

// Listener
Alloy.Events.on('updateMainUI', refreshData);
// Clean up on close
$.controller.addEventListener('close', function() {
    Alloy.Events.off('updateMainUI');
});

// Trigger
Alloy.Events.trigger('updateMainUI');
```

### Global Variables in Non-Controller Files
Always require Alloy modules:
```javascript
var Alloy = require('alloy');
var Backbone = require('alloy/backbone');
var _ = require('alloy/underscore')._;
```

## Conditional Views

Use IF attributes in XML for conditional rendering (evaluated before render):

```xml
<Alloy>
    <Window>
        <View if="Alloy.Globals.isLoggedIn()" id="notLoggedIn">
             <Label text="Not logged in" />
        </View>
        <View if="!Alloy.Globals.isLoggedIn()" id="loggedIn">
            <Label text="Logged in" />
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

## Common Error Solutions

| Error | Solution |
|-------|----------|
| `No app.js found` | Run `alloy compile --config platform=<platform>` |
| Android assets not showing | Use absolute paths (prepend `/`) |
| `Alloy is not defined` (non-controller) | Add `var Alloy = require('alloy');` |
| iOS `invalid method passed to UIModule` | Creating Android-only object - use `platform` attribute |

## CLI Quick Reference

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

# Copy/move/remove controllers
alloy copy <old> <new>
alloy move <old> <new>
alloy remove <name>
```

## Configuration Files Priority

**config.json precedence:** `os:ios` > `env:production` > `global`

Access at runtime: `Alloy.CFG.yourKey`

## Custom XML Tags

Create reusable components without widgets - just drop a file in `app/lib/`:

**app/lib/checkbox.js**
```javascript
exports.createCheckBox = function(args) {
    var wrapper = Ti.UI.createView({ layout: "horizontal", checked: false });
    var box = Ti.UI.createView({ width: 15, height: 15, borderWidth: 1 });
    // ... build component, return Ti.UI.* object
    return wrapper;
};
```

**view.xml**
```xml
<CheckBox module="checkbox" id="terms" caption="I agree" onChange="onCheck" />
```

Key: `module` attribute points to file in `app/lib/` (without `.js`), function must be `create<TagName>`.

See [custom_tags.md](references/custom_tags.md) for complete examples.

## Resources

### references/

Complete documentation for each topic area:
- **best_practices.md** - Coding standards, naming conventions, global events patterns
- **cli_reference.md** - All CLI commands with options and model schema format
- **config_files.md** - alloy.jmk tasks, config.json structure, widget.json format
- **custom_tags.md** - Creating reusable custom XML tags without widgets
- **debugging_troubleshooting.md** - Common errors with solutions
- **samples.md** - Controller examples, conditional views, data-binding patterns

## Related Skills

For tasks beyond Alloy CLI and configuration, use these complementary skills:

| Task | Use This Skill |
|------|----------------|
| Modern architecture, services, patterns | `alloy-expert` |
| Alloy MVC concepts, models, data binding | `alloy-guides` |
| SDK config, Hyperloop, app distribution | `ti-guides` |
| Utility-first styling with PurgeTSS | `purgetss` |
