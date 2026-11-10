# Alloy widgets

A widget packages views, styles, controllers, assets and a manifest for reuse between apps. Use `<Require>` to reuse part of one app; use a widget for a component shared across apps.

## Create and declare

```bash
alloy generate widget com.example.rating
```

The default controller is named `widget`, with these files under `app/widgets/com.example.rating/`:

```text
controllers/widget.js
views/widget.xml
styles/widget.tss
assets/
widget.json
```

```json
{
    "id": "com.example.rating",
    "name": "rating",
    "version": "1.0.0",
    "platforms": "android,ios"
}
```

The reverse-DNS ID must be unique across the app's widgets. Declare it in `app/config.json`, including when copying its directory from another project:

```json
{
    "dependencies": {
        "com.example.rating": "1.0.0"
    }
}
```

The generator creates a dependency; inspect it for the actual generated version. A declaration does not fetch files. Copy the widget directory or populate `app/widgets` with a build step, including one from an npm package. The current guide provides no registry workflow.

## Use and communicate

```xml
<Alloy>
    <Window>
        <Widget src="com.example.rating" id="rating" score="4" />
    </Window>
</Alloy>
```

The widget reads `$.args.score`. Or construct it from JavaScript:

```javascript
const rating = Alloy.createWidget('com.example.rating', { score: 4 });
$.index.add(rating.getView());
```

The containing view must provide the `$.index` Window. Expose methods with `exports`, and send events with `$.trigger()`:

```javascript
// Widget controller; its view provides a Label with id="stars".
exports.setScore = (score) => {
    $.stars.text = '*'.repeat(score);
};
```

```javascript
// App controller, after constructing rating.
rating.setScore(4);
rating.on('changed', (event) => {
    Ti.API.info(event.score);
});
```

The widget emits `$.trigger('changed', { score: 3 })` when its state changes, after listeners have been attached. Events emitted during construction can precede the caller's subscription. Clean up subscriptions with their owning controller.

## Isolation and styling

Keep widget styles and assets with the component and pass values such as `tint` in arguments rather than coupling it to one app's `Alloy.Globals`. The published guide describes stylesheet isolation, but released Alloy 3.0.1 includes matching app `app.tss` rules in widget styles: do not rely on a widget being shielded from global selectors. Use explicit widget styles and deliberate configuration to control its appearance. Keep assets in the widget's own directory; verify exact asset resolution for the target Alloy version when integrating an asset-heavy widget.

Source: [widgets](https://titaniumsdk.com/docs/alloy/widgets.md).
