# Creating custom tags in Titanium with Alloy

Custom tags let you create reusable UI components without the overhead of widgets. You can keep controls in a single file under `app/lib`.

## Why use custom tags?

When building cross-platform apps, you often need UI controls (like a web-style checkbox) that do not exist natively. You have three approaches:

1.  **Direct XML/JS:** Copy and paste code into each view. Not reusable and easy to drift.
2.  **Widgets:** Reusable, but require a folder structure and `dependencies` in `config.json`.
3.  **Custom tags:** Single file in `app/lib/`, no config dependency, easy to share. They reduce platform-specific code in views.

## Basic setup

1.  Create a file in `app/lib/` (e.g., `checkbox.js`)
2.  Export a `create<TagName>` function
3.  Use in XML with the `module` attribute

**view.xml**
```xml
<CheckBox module="checkbox" id="termsAccepted"
    caption="I agree to the terms of use"
    underline="true"
    onCaptionClick="doShowTerms"
    onChange="onCheckChange" />
```
The `module` attribute tells Alloy to look in `checkbox.js` for a `createCheckBox` function. Alloy passes the XML/TSS arguments and expects a `Ti.UI.*` component back.

## Robust example: CheckBox

**app/lib/checkbox.js**
```javascript
exports.createCheckBox = args => {
    // Wrapper view for all components
    const wrapper = Ti.UI.createView({
        top: args.top || 5,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        layout: "horizontal",
        left: args.left || 20,
        right: args.right || null,
        checked: args.checked || false
    });

    // The box itself
    const box = Ti.UI.createView({
        width: 15,
        height: 15,
        borderWidth: 1,
        borderColor: "#02A9F4"
    });

    // Attributed string for styled caption (e.g. underline)
    const attr = Ti.UI.createAttributedString({
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

    const caption = Ti.UI.createLabel({
        color: "#000",
        attributedString: attr,
        left: 10,
        text: args.caption,
        font: { fontSize: 10 }
    });

    // The tick (using Unicode to avoid assets)
    const tick = Ti.UI.createLabel({
        text: "\u2713",
        left: 1,
        color: "#02A9F4",
        font: { fontWeight: "bold" },
        visible: args.checked || false
    });

    // Handle clicks
    caption.addEventListener("click", () => {
        wrapper.fireEvent("captionClick");
    });

    box.addEventListener("click", () => {
        tick.visible = !tick.visible;
        wrapper.checked = !wrapper.checked;
        wrapper.fireEvent("change", { checked: wrapper.checked });
    });

    box.add(tick);
    wrapper.add(box);
    wrapper.add(caption);

    return wrapper;
};
```

## Global module override

Apply a module to all tags in a view by updating the `Alloy` tag. Alloy checks your file for tag creation overrides before using default implementations:

```xml
<Alloy module="ui">
    <Window>
        <CustomButton />  <!-- Looks for createCustomButton in app/lib/ui.js -->
        <Label />         <!-- Checks ui.js for createLabel first -->
    </Window>
</Alloy>
```
This is useful for adding default colors or properties (for example, a black default color for Android Labels) across a project.

## Key points

| Aspect        | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| File location | `app/lib/<module_name>.js`                                    |
| Function name | `create<TagName>` (e.g., `createCheckBox` for `<CheckBox>`)   |
| Return value  | Must return a `Ti.UI.*` component (View, Button, Label, etc.) |
| Arguments     | Receives all XML/TSS attributes in a single `args` object     |

## Using Custom Tags Without Alloy XML

You can also use custom tags from plain JavaScript via `require()`:

```javascript
const checkbox = require("checkbox").createCheckBox({
    caption: "I agree",
    underline: true
});
win.add(checkbox);
```

This works because custom tags are standard CommonJS modules. The `module` attribute in XML is a convenience.

## Custom tags vs widgets

| Custom Tags                           | Widgets                                  |
| ------------------------------------- | ---------------------------------------- |
| Single file in `app/lib/`             | Separate folder structure                |
| No `config.json` dependency needed    | Requires `dependencies` in `config.json` |
| Simpler for single-component controls | Better for complex multi-view components |
| Easier to share across projects       | More formal packaging                    |
