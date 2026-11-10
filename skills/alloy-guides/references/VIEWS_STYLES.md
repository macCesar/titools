# Alloy styles and themes

TSS uses Titanium property names. It resembles JSON with selectors, not browser CSS. Select an element (`Label`), class (`.container`) or ID (`#greeting`):

```tss
"Window": {
    backgroundColor: "white"
},
".container": {
    layout: "vertical",
    top: 20
},
"#greeting": {
    color: "#333",
    font: { fontSize: 18, fontWeight: "bold" }
}
```

## Scope and precedence

`app/styles/app.tss` applies throughout the app; `app/styles/<name>.tss` applies to the matching view. Use global styles for shared typography and palette, local styles for a screen.

The current guide describes these layers from weakest to strongest: global TSS, the view's own TSS, XML attributes, then controller assignments. Within a stylesheet, IDs outrank classes, classes outrank element selectors, and later equally specific rules win. An XML value can therefore explain why changing a TSS value appears to do nothing.

## Queries

```tss
"Button[platform=android]": {
    backgroundColor: "#2f6f4f"
},
"Button[platform=ios]": {
    color: "#0b6bcb"
},
"#hero[formFactor=tablet]": {
    height: 400
},
"Label[platform=ios formFactor=handheld]": {
    font: { fontSize: 14 }
},
"#banner[if=Alloy.Globals.isPromo]": {
    visible: true
}
```

Queries combine with spaces. Platform conditions can be resolved while compiling; device form factor and global flags are evaluated when views/styles are created. Set `Alloy.Globals.isPromo` in `app/alloy.js` before constructing the controller. Changing that variable later does not itself restyle an existing view.

## Themes

A theme lives under `app/themes/<name>/`. Its `styles/app.tss` merges over base styles, and its assets replace same-path assets:

```text
app/themes/dark/styles/app.tss
app/themes/dark/assets/images/logo.png
```

Select one at build time:

```json
{
    "global": { "theme": "dark" }
}
```

Rebuild to change the theme. For a runtime light/dark response, use semantic colors in `app/assets/semantic.colors.json`, as described in the [first app](https://titaniumsdk.com/docs/build/first-app.md); a build-time theme is not a runtime switch.

For runtime class changes, see [dynamic styles](./VIEWS_DYNAMIC.md).

Source: [styles and themes](https://titaniumsdk.com/docs/alloy/styles.md).
