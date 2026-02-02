# Event Handling

## 1. Event Listener Pattern

### Basic Pattern

```javascript
element.addEventListener('event_type', (e) => {
  // code here runs when event fires
  // 'e' is the event object
  Ti.API.info(`The ${e.type} event happened`);
});
```
...
### Events That Bubble

All user input events defined by `Ti.UI.View` bubble up the view hierarchy: `click`, `dblclick`, `doubletap`, `longclick`, `longpress`, `pinch`, `singletap`, `swipe`, `touchcancel`, `touchend`, `touchmove`, `touchstart`, `twofingertap`. The **only** `Ti.UI.View` event that does NOT bubble is `postlayout`.

> **Event synonyms**: `singletap` is a synonym for `click`, and `doubletap` is a synonym for `dblclick`.

Events representing view-specific state — such as `focus`, `scroll`, and `postlayout` — do **not** bubble. Only user input events bubble.

### Bubbling Boundaries

Bubbling stops at these special container boundaries: `Window`, `NavigationWindow`, `SplitWindow`, `Tab`, and `TabGroup`.

Note that `TableViewSection` is a logical (non-view) container that still participates in bubbling — events from rows bubble through the section to the `TableView`.

### Native Event Handling Precedence

Event bubbling happens after native event handling. Native UI effects (such as highlighting) have already occurred before any event handler fires.

### Controlling Event Bubbling

```javascript
// Check if event bubbles
Ti.API.info(`Bubbles: ${e.bubbles}`);

// Stop further bubbling — cancelBubble is always false when an event handler is invoked
e.cancelBubble = true;

// Prevent view from bubbling to parent
view.bubbleParent = false;
```

> **Note**: Multiple events of different types are treated separately. If the user lifting their finger triggers `touchend`, `singletap`, and `click`, setting `cancelBubble` on one does not affect the others.

### Bubbling Example

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

**Output order**: Button → Container → Window

## 3. Firing Events

### Fire Custom Event

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
### Listening to App Events

```javascript
// Listen anywhere in app
Ti.App.addEventListener('db_updated', (e) => {
  Ti.API.info(`DB updated at: ${e.timestamp}`);
  tableView.setData(getCurrentRecords());
});
```

### Memory Warning

Global event listeners persist for app lifetime, preventing garbage collection:

```javascript
// Good: Remove when done
const handler = (e) => { /* ... */ };
Ti.App.addEventListener('myEvent', handler);
// Later:
Ti.App.removeEventListener('myEvent', handler);
```

## 5. Touch Events

### Touch Event Lifecycle

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

### Touch Enabled

Views must have `touchEnabled: true` to react to touch events (default is true for most components):

```javascript
view.touchEnabled = false; // Disable touch for this view
```

If a view has `touchEnabled: false`, touch events pass to next view in stack.

## 6. Named vs Anonymous Functions

### Anonymous Function (One-time use)

```javascript
button.addEventListener('click', function(e) {
  Ti.API.info('Clicked');
});
```

### Named Function (Reusable)

```javascript
function handleClick(e) {
  Ti.API.info(`Clicked: ${e.type}`);
}

button1.addEventListener('click', handleClick);
button2.addEventListener('click', handleClick);

// Can also remove:
button1.removeEventListener('click', handleClick);
```

## 7. Removing Event Listeners

### Must Match Function Signature

```javascript
function myHandler(e) {
  Ti.API.info('Handler called');
}

button.addEventListener('click', myHandler);
// Later:
button.removeEventListener('click', myHandler);
```

**Important**: Anonymous functions cannot be removed!

## 8. Android Hardware Button Events

### Available Events

| Event            | Fired When             |
| ---------------- | ---------------------- |
| `androidback`    | Back button released   |
| `androidhome`    | Home button released   |
| `androidsearch`  | Search button released |
| `androidcamera`  | Camera button released |
| `androidfocus`   | Camera half-pressed    |
| `androidvolup`   | Volume-up released     |
| `androidvoldown` | Volume-down released   |

### Handling Back Button

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

### Note: Window Types

Since 3.2.0, all windows are heavyweight by default and you cannot control the type of window created. All windows can receive hardware button events.

## 9. Android Menu

### Create Options Menu

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

## 10. Event Listener Best Practices

### Define Before Event May Fire

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

### Global Event Memory Leaks

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

### Remove Listeners on Window Close

```javascript
const win = Ti.UI.createWindow();
const handler = (e) => { /* ... */ };

someComponent.addEventListener('event', handler);

win.addEventListener('close', () => {
  someComponent.removeEventListener('event', handler);
});
```

## 11. Special Considerations

### Platform-Specific Events

Some events only work on certain platforms:
- `pinch` - iOS only
- `globalPoint` property - iOS only
- Hardware buttons - Android only

### Shake Event

The `Ti.Gesture` module enables listening for the `shake` event, which fires when the device detects a shake motion:

```javascript
Ti.Gesture.addEventListener('shake', (e) => {
  Ti.API.info(`Device shaken at timestamp: ${e.timestamp}`);
});
```

### Event Naming

**WARNING**: Do NOT use spaces in custom event names (causes issues with libraries like Backbone.js):

```javascript
// BAD
Ti.App.fireEvent('my event');

// GOOD
Ti.App.fireEvent('my_event');
```

### Custom Properties on Events

```javascript
button.whichObj = 'button';

button.addEventListener('click', function(e) {
  Ti.API.info('Source: ' + e.source.whichObj);
});
```

## Best Practices Summary

1. **Use app-level events** for cross-context communication
2. **Remove global listeners** when no longer needed to prevent memory leaks
3. **Use named functions** when you might need to remove listeners later
4. **Understand bubbling** to control event propagation
5. **Define listeners early** - before events are likely to fire
6. **Handle Android back button** for custom navigation
7. **Test touch events** on device - simulator may not support all gestures
