# Gestures

## 1. Overview

Titanium supports more than simple taps.
- Touch events for low-level tracking.
- Swipe for left and right drags.
- Pinch for zoom (iOS only).
- Long press for extended presses.
- Shake for device shake detection.
- Accelerometer for device orientation and movement.

## 2. Touch events

### Touch lifecycle

```javascript
const view = Ti.UI.createView({
  backgroundColor: 'blue',
  width: 200, height: 200
});

view.addEventListener('touchstart', (e) => {
  Ti.API.info(`Touch started at: ${e.x}, ${e.y}`);
});

view.addEventListener('touchmove', (e) => {
  Ti.API.info(`Moving to: ${e.x}, ${e.y}`);
});

view.addEventListener('touchend', (e) => {
  Ti.API.info(`Touch ended at: ${e.x}, ${e.y}`);
});

view.addEventListener('touchcancel', (e) => {
  Ti.API.info('Touch cancelled (incoming call, etc.)');
});
```

### Touch event properties

| Property      | Description                              |
| ------------- | ---------------------------------------- |
| `x`           | X coordinate in view's coordinate system |
| `y`           | Y coordinate in view's coordinate system |
| `globalPoint` | Screen coordinates (iOS only)            |

### Android note

On Android, `longpress` and `swipe` cancel touch events. `touchend` may not fire after `touchstart`.

## 3. Swipe gesture

### Basic swipe

```javascript
const view = Ti.UI.createView({
  backgroundColor: 'yellow',
  width: Ti.UI.FILL,
  height: 100
});

view.addEventListener('swipe', (e) => {
  Ti.API.info(`Swiped direction: ${e.direction}`);
  // e.direction can be: 'left', 'right', 'up', 'down'
});
```

### Swipe direction detection

```javascript
view.addEventListener('swipe', (e) => {
  switch(e.direction) {
    case 'left':
      Ti.API.info('Swiped left');
      showPreviousPage();
      break;
    case 'right':
      Ti.API.info('Swiped right');
      showNextPage();
      break;
    case 'up':
      Ti.API.info('Swiped up');
      break;
    case 'down':
      Ti.API.info('Swiped down');
      break;
  }
});
```

### Swipe vs scroll

- Swipe is a quick flick, usually left or right.
- Scroll is a sustained drag, usually up or down.

## 4. Pinch gesture (iOS only)

```javascript
const view = Ti.UI.createView({
  backgroundColor: 'green',
  width: 300, height: 300
});

view.addEventListener('pinch', (e) => {
  Ti.API.info(`Pinch scale: ${e.scale}`);
  // e.scale < 1.0 = pinch together
  // e.scale > 1.0 = pinch apart
});
```

### Pinch to zoom

```javascript
const imageView = Ti.UI.createImageView({
  image: 'photo.jpg',
  width: 300, height: 300
});

let currentScale = 1.0;

imageView.addEventListener('pinch', (e) => {
  currentScale = e.scale;
  imageView.transform = Ti.UI.create2DMatrix().scale(currentScale);
});
```

## 5. Long press gesture

### Basic long press

```javascript
const view = Ti.UI.createView({
  backgroundColor: 'orange',
  width: 200, height: 200
});

view.addEventListener('longpress', (e) => {
  Ti.API.info(`Long press at: ${e.x}, ${e.y}`);
  showContextMenu(e);
});
```

### Long press duration

Default duration varies by platform. You can roll your own:

```javascript
let pressTimer = null;
const PRESS_DURATION = 1000; // 1 second

view.addEventListener('touchstart', (e) => {
  pressTimer = setTimeout(() => {
    showContextMenu(e);
  }, PRESS_DURATION);
});

view.addEventListener('touchend', () => {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
});

view.addEventListener('touchmove', () => {
  // Cancel long press if moved significantly
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
});
```

### Android long press convention

On Android, long press usually shows a context menu:

```javascript
view.addEventListener('longpress', (e) => {
  const dialog = Ti.UI.createAlertDialog({
    title: 'Options',
    message: 'What would you like to do?',
    buttonNames: ['Edit', 'Delete', 'Share', 'Cancel']
  });
  dialog.addEventListener('click', (e) => {
    switch(e.index) {
      case 0: editItem(); break;
      case 1: deleteItem(); break;
      case 2: shareItem(); break;
    }
  });
  dialog.show();
});
```

## 6. Shake gesture

### Detecting shake

```javascript
Ti.Gesture.addEventListener('shake', (e) => {
  Ti.API.info(`Device shaken at ${e.timestamp}`);

  // Refresh content, undo action, etc.
  refreshData();
});
```

### Shake example

```javascript
// Use shake to refresh data
const scrollView = Ti.UI.createScrollView({
  contentHeight: Ti.UI.SIZE
});

Ti.Gesture.addEventListener('shake', () => {
  // Refresh data
  loadDataFromServer();
});

function loadDataFromServer() {
  // ...
  Ti.API.info('Data refreshed due to shake');
}
```

### Testing shake

- iOS Simulator: Hardware > Shake Device
- Android Emulator: not supported, test on physical device
- Physical device: shake the device

## 7. Accelerometer as input

### Basic accelerometer

```javascript
const labelX = Ti.UI.createLabel({ text: 'X: 0' });
const labelY = Ti.UI.createLabel({ text: 'Y: 0', top: 30 });
const labelZ = Ti.UI.createLabel({ text: 'Z: 0', top: 60 });

Ti.Accelerometer.addEventListener('update', (e) => {
  labelX.text = `X: ${e.x.toFixed(2)}`;
  labelY.text = `Y: ${e.y.toFixed(2)}`;
  labelZ.text = `Z: ${e.z.toFixed(2)}`;
});
```

### Accelerometer properties

| Property    | Description         | Range                |
| ----------- | ------------------- | -------------------- |
| `x`         | X-axis acceleration | G-force (±9.81 m/s²) |
| `y`         | Y-axis acceleration | G-force              |
| `z`         | Z-axis acceleration | G-force              |
| `timestamp` | When event occurred | Timestamp            |

### Using accelerometer for control

```javascript
const sensitivity = 2.0;
let lastX = 0, lastY = 0;

Ti.Accelerometer.addEventListener('update', (e) => {
  const deltaX = e.x - lastX;
  const deltaY = e.y - lastY;

  if (Math.abs(deltaX) > sensitivity) {
    if (deltaX > 0) {
      moveRight();
    } else {
      moveLeft();
    }
  }

  lastX = e.x;
  lastY = e.y;
});
```

### Smoothing accelerometer data

Accelerometer data is noisy. Smooth it:

```javascript
let samples = [];
const SAMPLE_SIZE = 10;

Ti.Accelerometer.addEventListener('update', (e) => {
  samples.push({ x: e.x, y: e.y, z: e.z });

  if (samples.length >= SAMPLE_SIZE) {
    // Calculate average
    const avgX = samples.reduce((sum, s) => sum + s.x, 0) / samples.length;
    const avgY = samples.reduce((sum, s) => sum + s.y, 0) / samples.length;
    const avgZ = samples.reduce((sum, s) => sum + s.z, 0) / samples.length;

    // Use averaged values
    updatePosition(avgX, avgY, avgZ);

    // Clear samples
    samples = [];
  }
});
```

## 8. Gesture lifecycle management

### Battery considerations

Global gesture events (`Ti.Gesture`, `Ti.Accelerometer`) keep hardware powered and drain battery. Remove listeners when not needed.

```javascript
let accelerometerAdded = false;
const accelerometerCallback = (e) => {
  // Process accelerometer data
};

function startTracking() {
  if (!accelerometerAdded) {
    Ti.Accelerometer.addEventListener('update', accelerometerCallback);
    accelerometerAdded = true;
  }
}

function stopTracking() {
  if (accelerometerAdded) {
    Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
    accelerometerAdded = false;
  }
}

// Android: Manage with app lifecycle
if (Ti.Platform.osname === 'android') {
  Ti.Android.currentActivity.addEventListener('pause', () => {
    stopTracking();
  });

  Ti.Android.currentActivity.addEventListener('resume', () => {
    startTracking();
  });
}
```

## 9. Platform-specific considerations

### iOS

- Pinch is fully supported.
- Simulator shake: Hardware > Shake Device.
- More touch events are supported.
- Gesture recognition is smoother.

### Android

- Pinch support is limited or experimental.
- No simulator shake. Test on device.
- Long press opens context menus (standard pattern).
- Hardware button events are available.

## 10. Best practices

1. Test on physical devices. Simulators do not support all gestures.
2. Remove global gesture listeners when not needed to save battery.
3. Smooth accelerometer data with averaging.
4. Use the right gesture for the task. Long press for context menus, swipe for navigation.
5. Consider accessibility. Make sure gestures do not conflict with screen readers.
6. Handle edge cases like touch cancel and gesture interruptions.
7. Provide alternatives. Not all users can perform all gestures.

## 11. Combining gestures

### Multiple gesture types

```javascript
const view = Ti.UI.createView({
  width: 300, height: 300,
  backgroundColor: 'cyan'
});

// Swipe for navigation
view.addEventListener('swipe', (e) => {
  if (e.direction === 'left') {
    showPrevious();
  } else if (e.direction === 'right') {
    showNext();
  }
});

// Long press for options
view.addEventListener('longpress', (e) => {
  showOptions();
});

// Double tap for like
view.addEventListener('doubletap', (e) => {
  likeContent();
});

// Pinch to zoom (iOS)
view.addEventListener('pinch', (e) => {
  if (e.scale > 1.0) {
    zoomIn();
  } else {
    zoomOut();
  }
});
```

### Preventing gesture conflicts

```javascript
let touchStartTime = 0;

view.addEventListener('touchstart', (e) => {
  touchStartTime = Date.now();
});

view.addEventListener('touchend', (e) => {
  const touchDuration = Date.now() - touchStartTime;

  if (touchDuration < 200) {
    // Short tap - treat as click
    handleClick();
  } else if (touchDuration > 500) {
    // Long touch - already handled by longpress
    // Ignore
  }
});
```
