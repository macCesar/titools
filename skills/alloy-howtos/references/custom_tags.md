# Creating Custom Tags in Titanium with Alloy

Custom tags allow you to create reusable UI components without widgets. They're simpler to share - just drop a file in `app/lib`.

## Basic Setup

1. Create a file in `app/lib/` (e.g., `checkbox.js`)
2. Export a `create<TagName>` function
3. Use in XML with `module` attribute

**app/lib/checkbox.js**
```javascript
exports.createCheckBox = function(args) {
    var wrapper = Ti.UI.createView({
        top: args.top || 5,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        layout: "horizontal",
        left: args.left || 20,
        checked: args.checked || false
    });

    var box = Ti.UI.createView({
        width: 15,
        height: 15,
        borderWidth: 1,
        borderColor: "#02A9F4"
    });

    var tick = Ti.UI.createLabel({
        text: "\u2713",
        left: 1,
        color: "#02A9F4",
        font: { fontWeight: "bold" },
        visible: false
    });

    var caption = Ti.UI.createLabel({
        color: "#000",
        left: 10,
        text: args.caption,
        font: { fontSize: 10 }
    });

    // Toggle checkbox state
    box.addEventListener("click", function() {
        tick.visible = !tick.visible;
        wrapper.checked = !wrapper.checked;
        wrapper.fireEvent("change", { checked: wrapper.checked });
    });

    // Caption click for linking (e.g., terms)
    caption.addEventListener("click", function() {
        wrapper.fireEvent("captionClick");
    });

    box.add(tick);
    wrapper.add(box);
    wrapper.add(caption);

    return wrapper;
};
```

**view.xml**
```xml
<CheckBox module="checkbox" id="termsAccepted"
    caption="I agree to the terms of use"
    underline="true"
    onCaptionClick="doShowTerms"
    onChange="onCheckChange" />
```

## Key Points

| Aspect | Description |
|--------|-------------|
| File location | `app/lib/<module_name>.js` |
| Function name | `create<TagName>` (e.g., `createCheckBox` for `<CheckBox>`) |
| XML attribute | `module="<module_name>"` (without `.js`) |
| Return value | Must return a `Ti.UI.*` component (View, Button, Label, etc.) |
| Arguments | Receives all XML/TSS attributes in `args` object |

## Global Module Override

Apply a module to all tags in a view:

```xml
<Alloy module="ui">
    <!-- All tags check app/lib/ui.js first -->
    <Window>
        <CustomButton />  <!-- Looks for createCustomButton in ui.js -->
    </Window>
</Alloy>
```

## Attributed Strings in Custom Tags

Add text styling support (underline, colors, etc.):

```javascript
exports.createCheckBox = function(args) {
    var attr = Ti.UI.createAttributedString({
        text: args.caption
    });

    if (args.underline) {
        attr.applyProperties({
            attributes: [{
                type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
                value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
                range: [0, args.caption.length]
            }]
        });
    }

    var caption = Ti.UI.createLabel({
        attributedString: attr,
        // ...
    });
    // ...
};
```

## Using Without Alloy XML

Custom tags can be used directly in JavaScript:

```javascript
var checkbox = require("checkbox").createCheckBox({
    caption: "Accept terms",
    underline: true
});
win.add(checkbox);
```

## Custom Tags vs Widgets

| Custom Tags | Widgets |
|-------------|---------|
| Single file in `app/lib/` | Separate folder structure |
| No config.json dependency needed | Requires `dependencies` in config.json |
| Simpler for single-component controls | Better for complex multi-view components |
| Easier to share across projects | More formal packaging |

## Use Cases

- Custom TextFields with icons and validation
- Styled buttons with consistent branding
- Accordion/collapsible containers
- Platform-specific UI wrappers
- Form controls (checkbox, radio, toggle)
