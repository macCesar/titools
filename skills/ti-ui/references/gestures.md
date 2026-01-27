# Gestures

## Table of Contents

- [Gestures](#gestures)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Touch Events](#2-touch-events)
    - [Touch Lifecycle](#touch-lifecycle)
    - [Touch Event Properties](#touch-event-properties)
    - [Android Note](#android-note)
  - [3. Swipe Gesture](#3-swipe-gesture)
    - [Basic Swipe](#basic-swipe)
    - [Swipe Direction Detection](#swipe-direction-detection)
    - [Swipe vs Scroll](#swipe-vs-scroll)
  - [4. Pinch Gesture (iOS Only)](#4-pinch-gesture-ios-only)
    - [Pinch to Zoom](#pinch-to-zoom)
  - [5. Long Press Gesture](#5-long-press-gesture)
    - [Basic Long Press](#basic-long-press)
    - [Long Press Duration](#long-press-duration)
    - [Android Long Press Convention](#android-long-press-convention)
  - [6. Shake Gesture](#6-shake-gesture)
    - [Detecting Shake](#detecting-shake)
    - [Shake Example](#shake-example)
    - [Testing Shake](#testing-shake)
  - [7. Accelerometer as Input](#7-accelerometer-as-input)
    - [Basic Accelerometer](#basic-accelerometer)
    - [Accelerometer Properties](#accelerometer-properties)
    - [Using Accelerometer for Control](#using-accelerometer-for-control)
    - [Smoothing Accelerometer Data](#smoothing-accelerometer-data)
  - [8. Gesture Lifecycle Management](#8-gesture-lifecycle-management)
    - [Battery Considerations](#battery-considerations)
  - [9. Platform-Specific Considerations](#9-platform-specific-considerations)
    - [iOS](#ios)
    - [Android](#android)
  - [10. Best Practices](#10-best-practices)
  - [11. Combining Gestures](#11-combining-gestures)
    - [Multiple Gesture Types](#multiple-gesture-types)
    - [Preventing Gesture Conflicts](#preventing-gesture-conflicts)

---

## 1. Overview

Titanium supports various gestures beyond simple taps:
- **Touch Events** - Low-level touch tracking
- **Swipe** - Left/right drag gestures
- **Pinch** - Zoom gestures (iOS only)
- **Long Press** - Extended press gesture
- **Shake** - Device shake detection
- **Accelerometer** - Device orientation/movement

## 2. Touch Events

### Touch Lifecycle

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

### Touch Event Properties

| Property      | Description                              |
| ------------- | ---------------------------------------- |
| `x`           | X coordinate in view's coordinate system |
| `y`           | Y coordinate in view's coordinate system |
| `globalPoint` | Screen coordinates (iOS only)            |

### Android Note

On Android, `longpress` and `swipe` cancel touch events - `touchend` may not fire after `touchstart`.

## 3. Swipe Gesture

### Basic Swipe

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

### Swipe Direction Detection

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

### Swipe vs Scroll

- **Swipe**: Quick flick gesture (left/right mainly)
- **Scroll**: Sustained drag gesture (up/down mainly)

## 4. Pinch Gesture (iOS Only)

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

### Pinch to Zoom

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

## 5. Long Press Gesture

### Basic Long Press

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

### Long Press Duration

Default long press duration varies by platform. Custom handling:

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

### Android Long Press Convention

On Android, long press typically shows context menu:

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

## 6. Shake Gesture

### Detecting Shake

```javascript
Ti.Gesture.addEventListener('shake', (e) => {
  Ti.API.info(`Device shaken at ${e.timestamp}`);

  // Refresh content, undo action, etc.
  refreshData();
});
```

### Shake Example

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

### Testing Shake

- **iOS Simulator**: Hardware > Shake Device
- **Android Emulator**: Not supported - test on physical device
- **Physical Device**: Just shake the device

## 7. Accelerometer as Input

### Basic Accelerometer

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

### Accelerometer Properties

| Property    | Description         | Range                |
| ----------- | ------------------- | -------------------- |
| `x`         | X-axis acceleration | G-force (±9.81 m/s²) |
| `y`         | Y-axis acceleration | G-force              |
| `z`         | Z-axis acceleration | G-force              |
| `timestamp` | When event occurred | Timestamp            |

### Using Accelerometer for Control

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

### Smoothing Accelerometer Data

Accelerometer data is very sensitive. Apply smoothing:

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

## 8. Gesture Lifecycle Management

### Battery Considerations

Global gesture events (`Ti.Gesture`, `Ti.Accelerometer`) keep hardware powered and drain battery.

**Always remove listeners when not needed:**

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

## 9. Platform-Specific Considerations

### iOS

- **Pinch gesture** fully supported
- **Simulator shake**: Hardware > Shake Device
- **More touch events** supported
- **Smoother gesture recognition**

### Android

- **Pinch** limited/experimental support
- **No simulator shake** - must test on device
- **Long press** for context menus (standard pattern)
- **Hardware button events** available

## 10. Best Practices

1. **Test on physical devices** - Simulators don't support all gestures
2. **Remove global gesture listeners** when not needed to save battery
3. **Smooth accelerometer data** - Use averaging/rounding
4. **Use appropriate gesture for context** - Long press for context menus, swipe for navigation
5. **Consider accessibility** - Ensure gestures don't conflict with screen readers
6. **Handle edge cases** - Touch cancel, gesture interruptions
7. **Provide alternatives** - Not all users can perform all gestures

## 11. Combining Gestures

### Multiple Gesture Types

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

### Preventing Gesture Conflicts

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
