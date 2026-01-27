# Creating Custom Tags in Titanium with Alloy

Custom tags allow you to create reusable UI components without the overhead of widgets. They are an incredibly fast way to build a suite of controls that are as easy to use as dropping a file into the `app/lib` folder.

## Table of Contents

- [Creating Custom Tags in Titanium with Alloy](#creating-custom-tags-in-titanium-with-alloy)
  - [Table of Contents](#table-of-contents)
  - [Why Use Custom Tags?](#why-use-custom-tags)
  - [Basic Setup](#basic-setup)
  - [Robust Example: CheckBox](#robust-example-checkbox)
  - [Global Module Override](#global-module-override)
  - [Key Points](#key-points)
  - [Custom Tags vs Widgets](#custom-tags-vs-widgets)

---

## Why Use Custom Tags?

When building cross-platform applications, you often need specific UI controls (like a web-style checkbox) that don't exist natively. You have three main approaches:

1.  **Direct XML/JS:** Copy-pasting code into every view. Not reusable and messy.
2.  **Widgets:** Highly reusable but requires a folder structure and `dependencies` in `config.json`.
3.  **Custom Tags:** Single file in `app/lib/`, no config dependency, and very simple to share. They reduce the amount of platform-specific code in your views, keeping them simple and readable.

## Basic Setup

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
The `module` attribute tells Alloy to look in `checkbox.js` for a `createCheckBox` function, pass it the arguments from XML/TSS, and expect a `Ti.UI.*` component back.

## Robust Example: CheckBox

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

## Global Module Override

Apply a module to all tags in a view by updating the `Alloy` tag. Alloy will check your specified file for any tag creation overrides before falling back to default implementations:

```xml
<Alloy module="ui">
    <Window>
        <CustomButton />  <!-- Looks for createCustomButton in app/lib/ui.js -->
        <Label />         <!-- Checks ui.js for createLabel first -->
    </Window>
</Alloy>
```
This is powerful for adding default colors or properties (like a black default color for Android Labels) across an entire project.

## Key Points

| Aspect        | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| File location | `app/lib/<module_name>.js`                                    |
| Function name | `create<TagName>` (e.g., `createCheckBox` for `<CheckBox>`)   |
| Return value  | Must return a `Ti.UI.*` component (View, Button, Label, etc.) |
| Arguments     | Receives all XML/TSS attributes in a single `args` object     |

## Custom Tags vs Widgets

| Custom Tags                           | Widgets                                  |
| ------------------------------------- | ---------------------------------------- |
| Single file in `app/lib/`             | Separate folder structure                |
| No `config.json` dependency needed    | Requires `dependencies` in `config.json` |
| Simpler for single-component controls | Better for complex multi-view components |
| Easier to share across projects       | More formal packaging                    |
