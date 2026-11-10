# Alloy controllers

A controller runs when `Alloy.createController()` constructs it. XML elements with IDs are available as `$.<id>`. The top-level element uses the controller filename as its ID unless XML supplies another ID: `$.index` is therefore not guaranteed when the root has an explicit ID.

## Arguments and events

Read arguments at the top of the controller, including arguments received through `<Require>`:

```javascript
// app/controllers/detail.js
const noteId = $.args.id;
$.title.text = `Note ${noteId}`;
```

Use a named top-level function for an XML event handler:

```javascript
function doGo() {
    $.greeting.text = 'Going';
}
```

The view binds it with `onClick="doGo"`. See [XML views](./VIEWS_XML.md) for a complete screen.

## Creating and opening

A controller is not a Window. Construct it, then open its top-level Window:

```javascript
const detail = Alloy.createController('detail', { id: 42 });
detail.getView().open();
```

`getView()` returns the first top-level element. Alternatively, let the controller export the operation:

```javascript
// app/controllers/detail.js
exports.open = () => {
    $.detail.open();
};
```

The caller uses `detail.open()`. Do not also open the Window at controller top level: the two approaches would open it twice. Anything on `exports` is exposed on the returned controller.

## Cleaning up

Alloy does not automatically dispose of controllers. External listeners, timers and geolocation subscriptions can outlive the Window. Remove listeners using the same function reference, clear timers and stop subscriptions when their owner closes. `$.destroy()` removes generated model/view bindings; it does not remove your external listeners.

After completing location setup and authorization through `ti-howtos`, this illustrates listener ownership:

```javascript
function onLocation(event) {
    Ti.API.info(event);
}

Ti.Geolocation.addEventListener('location', onLocation);
$.index.addEventListener('close', () => {
    Ti.Geolocation.removeEventListener('location', onLocation);
    $.destroy();
});
```

Here `index.xml` must own a Window addressed as `$.index`. A child controller without that lifecycle needs cleanup coordinated by its owner. Keep each controller's cleanup separate from any shared model still used by another screen.

## Shared code

`app/lib/` contains CommonJS modules:

```javascript
const format = require('/format');
```

The slash resolves against the application root, not the filesystem. Modules are available to controllers and widgets. Initialize shared state in `app/alloy.js`, before the first controller:

```javascript
Alloy.Globals.apiRoot = 'https://example.com/api';
```

For compiler constants, use [configuration](../../alloy-howtos/references/config_files.md#compile-time-constants).

Source: [controllers](https://titaniumsdk.com/docs/alloy/controllers.md).
