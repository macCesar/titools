# Alloy XML views

Wrap every view in `<Alloy>`, which is a compiler element rather than a native View. Element names normally select `Ti.UI.create*`: `<Label>` creates a Label, `<ListView>` creates a ListView, and nesting adds children to their container.

## A complete screen

```xml
<!-- app/views/index.xml -->
<Alloy>
    <Window class="container">
        <Label id="greeting">Hello</Label>
        <Button id="go" onClick="doGo">Continue</Button>
    </Window>
</Alloy>
```

```javascript
// app/controllers/index.js
function doGo() {
    $.greeting.text = 'Going';
}
$.index.open();
```

`id="greeting"` exposes `$.greeting` and selects `#greeting` in TSS. `class="row highlighted"` applies two TSS classes. An element without an ID is created and added, but has no public handle. The root defaults to the filename (`$.index`) only if it has no explicit ID.

Text content sets the element's text property: Label `text`, Button `title`. Attribute values become numbers or booleans when recognized, so `top="20"` is numeric and `visible="false"` is false. Put structured dictionaries in TSS or JavaScript.

## Namespaces and native modules

For an object outside `Ti.UI`, specify its namespace:

```xml
<Module id="player" ns="Ti.Media" method="createVideoPlayer" />
```

For a native module, install its compatible binary and declare it in `tiapp.xml` before using it; see `ti-guides` for module setup. Alloy requires the named module:

```xml
<Module id="map" module="ti.map" method="createView" />
```

## Conditional elements

`platform="android"` or `platform="ios"` excludes other-platform elements from the compiled build. Lists such as `platform="ios,android"` are OR conditions; `platform="!ios"` negates the selection.

```xml
<Alloy>
    <Window>
        <Button platform="android" title="Android only" />
        <Button platform="ios" title="iOS only" />
        <Label formFactor="tablet">Wide layout</Label>
    </Window>
</Alloy>
```

`formFactor` accepts `tablet` or `handheld`. Unlike the platform branch, released Alloy evaluates this using `Alloy.isTablet` at runtime; a universal app can contain both device layouts.

## Composing screens

```xml
<Alloy>
    <Window>
        <Require src="header" id="header" />
        <Label>Body</Label>
    </Window>
</Alloy>
```

Provide the `header` view/controller in the app. `$.header` is its controller, so exported methods are reachable there. Its top-level native view is `$.header.getView()`. Arguments are read from `$.args` in that controller.

| Compiler element | Purpose |
| --- | --- |
| `Alloy` | Required root |
| `Require` | Embed another app controller |
| `Widget` | Embed a reusable widget |
| `Module` | Create an object from another namespace or native module |
| `Collection` | Declare a collection for data binding |
| `Model` | Declare a model for data binding |

Continue with [styles](./VIEWS_STYLES.md), [models](./MODELS.md) and [widgets](./WIDGETS.md).

Source: [views](https://titaniumsdk.com/docs/alloy/views.md). The form-factor caveat corrects that page's compile-time wording against released Alloy 3.0.1.
