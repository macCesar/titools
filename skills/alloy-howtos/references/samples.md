# Current Alloy examples

For a full maintained app, use [KitchenSink-v2](https://github.com/tidev/kitchensink-v2).

## A working screen

```xml
<!-- app/views/index.xml -->
<Alloy>
    <Window>
        <Label id="label" top="80">Tap the button</Label>
        <Button id="button" top="140" onClick="sayHello">Say hello</Button>
    </Window>
</Alloy>
```

```tss
// app/styles/index.tss
"Window": {
    backgroundColor: "backgroundColor"
},
"#label": {
    color: "textColor"
}
```

```javascript
// app/controllers/index.js
function sayHello() {
    $.label.text = 'Hello from Titanium';
}
$.index.open();
```

The semantic color names must exist in `app/assets/semantic.colors.json`; they resolve differently in light and dark mode. Rebuild and tap the button. Use `ti build --platform android --liveview` to reload JavaScript changes while iterating.

For a complete persistent list with model definition, XML binding, filtering, transformation, fetch and cleanup, read [models and collections](../../alloy-guides/references/MODELS.md). For a reusable component, read [widgets](../../alloy-guides/references/WIDGETS.md).

Sources: [first app](https://titaniumsdk.com/docs/build/first-app.md), [models](https://titaniumsdk.com/docs/alloy/models.md), [widgets](https://titaniumsdk.com/docs/alloy/widgets.md).
