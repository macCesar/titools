# Event handling

## 1. Event listener pattern

### Basic pattern

```javascript
element.addEventListener('event_type', (e) => {
  // code here runs when event fires
  // 'e' is the event object
  Ti.API.info(`The ${e.type} event happened`);
});
```
...
### Events that bubble

All user input events defined by `Ti.UI.View` bubble up the view hierarchy: `click`, `dblclick`, `doubletap`, `longclick`, `longpress`, `pinch`, `singletap`, `swipe`, `touchcancel`, `touchend`, `touchmove`, `touchstart`, `twofingertap`. The only `Ti.UI.View` event that does not bubble is `postlayout`.

Event synonyms: `singletap` is a synonym for `click`, and `doubletap` is a synonym for `dblclick`.

Events that represent view-specific state, such as `focus`, `scroll`, and `postlayout`, do not bubble. Only user input events bubble.

### Bubbling boundaries

Bubbling stops at these container boundaries: `Window`, `NavigationWindow`, `SplitWindow`, `Tab`, and `TabGroup`.

`TableViewSection` is a logical (non-view) container that still participates in bubbling. Events from rows bubble through the section to the `TableView`.

### Native event handling precedence

Event bubbling happens after native event handling. UI effects like highlighting already happened before handlers run.

### Controlling event bubbling

```javascript
// Check if event bubbles
Ti.API.info(`Bubbles: ${e.bubbles}`);

// Stop further bubbling - cancelBubble is always false when an event handler is invoked
e.cancelBubble = true;

// Prevent view from bubbling to parent
view.bubbleParent = false;
```

Note: Each event type is handled separately. If the user lifting their finger triggers `touchend`, `singletap`, and `click`, setting `cancelBubble` on one does not affect the others.

### Bubbling example

```javascript
const win = Ti.UI.createWindow({
  backgroundColor: 'white'
});

const container = Ti.UI.createView({
  backgroundColor: 'yellow',
  width: 200, height: 200
});

const button = Ti.UI.createButton({
  title: 'Click Me',
  width: 100, height: 50
});

button.addEventListener('click', (e) => {
  Ti.API.info(`Button received: ${e.type}`);
  // e.cancelBubble = true; // Would stop here
});

container.addEventListener('click', (e) => {
  Ti.API.info(`Container received: ${e.type}`);
});

win.addEventListener('click', (e) => {
  Ti.API.info(`Window received: ${e.type}`);
});

container.add(button);
win.open();
```

Output order: Button -> Container -> Window

## 3. Firing events

### Fire custom event

```javascript
// Fire event without data
button.fireEvent('customEvent');

// Fire event with data
button.fireEvent('customEvent', {
  message: 'Hello',
  count: 42
});

// Handle it
button.addEventListener('customEvent', (e) => {
  Ti.API.info(`Message: ${e.message}`);
  Ti.API.info(`Count: ${e.count}`);
});
```
...
### Listening to app events

```javascript
// Listen anywhere in app
Ti.App.addEventListener('db_updated', (e) => {
  Ti.API.info(`DB updated at: ${e.timestamp}`);
  tableView.setData(getCurrentRecords());
});
```

### Memory warning

Global event listeners persist for the app lifetime and prevent garbage collection:

```javascript
// Good: Remove when done
const handler = (e) => { /* ... */ };
Ti.App.addEventListener('myEvent', handler);
// Later:
Ti.App.removeEventListener('myEvent', handler);
```

## 5. Touch events

### Touch event lifecycle

```javascript
view.addEventListener('touchstart', (e) => {
  Ti.API.info(`Touch started at: ${e.x}, ${e.y}`);
});

view.addEventListener('touchmove', (e) => {
  Ti.API.info(`Dragging to: ${e.x}, ${e.y}`);
});

view.addEventListener('touchend', (e) => {
  Ti.API.info(`Touch ended at: ${e.x}, ${e.y}`);
});

view.addEventListener('touchcancel', (e) => {
  Ti.API.info('Touch cancelled (phone call, etc.)');
});
```

### Touch enabled

Views must have `touchEnabled: true` to react to touch events. It is true by default for most components.

```javascript
view.touchEnabled = false; // Disable touch for this view
```

If a view has `touchEnabled: false`, touch events pass to the next view in the stack.

## 6. Named vs anonymous functions

### Anonymous function (one-time use)

```javascript
button.addEventListener('click', function(e) {
  Ti.API.info('Clicked');
});
```

### Named function (reusable)

```javascript
function handleClick(e) {
  Ti.API.info(`Clicked: ${e.type}`);
}

button1.addEventListener('click', handleClick);
button2.addEventListener('click', handleClick);

// Can also remove:
button1.removeEventListener('click', handleClick);
```

## 7. Removing event listeners

### Must match function reference

```javascript
function myHandler(e) {
  Ti.API.info('Handler called');
}

button.addEventListener('click', myHandler);
// Later:
button.removeEventListener('click', myHandler);
```

Important: Anonymous functions cannot be removed.

## 8. Android hardware button events

### Available events

| Event            | Fired when             |
| ---------------- | ---------------------- |
| `androidback`    | Back button released   |
| `androidhome`    | Home button released   |
| `androidsearch`  | Search button released |
| `androidcamera`  | Camera button released |
| `androidfocus`   | Camera half-pressed    |
| `androidvolup`   | Volume-up released     |
| `androidvoldown` | Volume-down released   |

### Handling back button

```javascript
const win = Ti.UI.createWindow({ backgroundColor: 'white' });

win.addEventListener('androidback', (e) => {
  // Prevent default behavior
  e.bubbles = false;

  // Custom back behavior
  const dialog = Ti.UI.createAlertDialog({
    message: 'Exit app?',
    buttonNames: ['Yes', 'No'],
    cancel: 1
  });
  dialog.addEventListener('click', (e) => {
    if (e.index === 0) {
      // Close app
      const activity = Ti.Android.currentActivity;
      activity.finish();
    }
  });
  dialog.show();
});
```

### Note: Window types

Since 3.2.0, all windows are heavyweight by default and you cannot control the type of window created. All windows can receive hardware button events.

## 9. Android menu

### Create options menu

```javascript
const activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = (e) => {
  const menu = e.menu;

  // Add menu items
  const menuItem = menu.add({
    title: 'Refresh',
    icon: Ti.App.Android.R.drawable.ic_menu_refresh,
    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
  });
  menuItem.addEventListener('click', () => {
    refreshData();
  });
};

activity.onPrepareOptionsMenu = (e) => {
  // Update menu before showing
  const menu = e.menu;
  // Modify items based on state
};

activity.onOptionsItemSelected = (e) => {
  // Handle menu item selection
  if (e.itemId === SOME_ID) {
    return true; // Event handled
  }
  return false; // Event not handled
};
```

## 10. Event listener best practices

### Define before the event may fire

```javascript
// GOOD: Define before opening
win.addEventListener('open', () => {
  Ti.API.info('Window opened');
});
win.open();

// BAD: Might miss event
win.open();
win.addEventListener('open', function(e) {
  // May not fire
});
```

### Global event memory leaks

```javascript
// BAD: Global listener with local reference
function init() {
  const localData = 'some data';

  Ti.App.addEventListener('update', () => {
    // 'localData' stays in memory forever
    Ti.API.info(localData);
  });
}

// GOOD: Remove when done
function init() {
  const handler = () => {
    Ti.API.info('data');
  };

  Ti.App.addEventListener('update', handler);

  // Later, when done:
  // Ti.App.removeEventListener('update', handler);
}
```

### Remove listeners on window close

```javascript
const win = Ti.UI.createWindow();
const handler = (e) => { /* ... */ };

someComponent.addEventListener('event', handler);

win.addEventListener('close', () => {
  someComponent.removeEventListener('event', handler);
});
```

## 11. Special considerations

### Platform-specific events

Some events only work on certain platforms:
- `pinch` - iOS only
- `globalPoint` property - iOS only
- Hardware buttons - Android only

### Shake event

The `Ti.Gesture` module enables listening for the `shake` event, which fires when the device detects a shake motion:

```javascript
Ti.Gesture.addEventListener('shake', (e) => {
  Ti.API.info(`Device shaken at timestamp: ${e.timestamp}`);
});
```

### Event naming

Warning: Do not use spaces in custom event names. It can break libraries like Backbone.js.

```javascript
// BAD
Ti.App.fireEvent('my event');

// GOOD
Ti.App.fireEvent('my_event');
```

### Custom properties on events

```javascript
button.whichObj = 'button';

button.addEventListener('click', function(e) {
  Ti.API.info('Source: ' + e.source.whichObj);
});
```

## Best practices summary

1. Use app-level events for cross-context communication.
2. Remove global listeners when no longer needed.
3. Use named functions when you might need to remove listeners later.
4. Understand bubbling to control event propagation.
5. Define listeners early, before events are likely to fire.
6. Handle Android back button for custom navigation.
7. Test touch events on device. Simulator may not support all gestures.
