# Gestures

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
var view = Ti.UI.createView({
  backgroundColor: 'blue',
  width: 200, height: 200
});

view.addEventListener('touchstart', function(e) {
  Ti.API.info('Touch started at: ' + e.x + ', ' + e.y);
});

view.addEventListener('touchmove', function(e) {
  Ti.API.info('Moving to: ' + e.x + ', ' + e.y);
});

view.addEventListener('touchend', function(e) {
  Ti.API.info('Touch ended at: ' + e.x + ', ' + e.y);
});

view.addEventListener('touchcancel', function(e) {
  Ti.API.info('Touch cancelled (incoming call, etc.)');
});
```

### Touch Event Properties

| Property | Description |
|----------|-------------|
| `x` | X coordinate in view's coordinate system |
| `y` | Y coordinate in view's coordinate system |
| `globalPoint` | Screen coordinates (iOS only) |

### Android Note

On Android, `longpress` and `swipe` cancel touch events - `touchend` may not fire after `touchstart`.

## 3. Swipe Gesture

### Basic Swipe

```javascript
var view = Ti.UI.createView({
  backgroundColor: 'yellow',
  width: Ti.UI.FILL,
  height: 100
});

view.addEventListener('swipe', function(e) {
  Ti.API.info('Swiped direction: ' + e.direction);
  // e.direction can be: 'left', 'right', 'up', 'down'
});
```

### Swipe Direction Detection

```javascript
view.addEventListener('swipe', function(e) {
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
var view = Ti.UI.createView({
  backgroundColor: 'green',
  width: 300, height: 300
});

view.addEventListener('pinch', function(e) {
  Ti.API.info('Pinch scale: ' + e.scale);
  // e.scale < 1.0 = pinch together
  // e.scale > 1.0 = pinch apart
});
```

### Pinch to Zoom

```javascript
var imageView = Ti.UI.createImageView({
  image: 'photo.jpg',
  width: 300, height: 300,
  width: 300, height: 300
});

var currentScale = 1.0;

imageView.addEventListener('pinch', function(e) {
  currentScale = e.scale;
  imageView.transform = Ti.UI.create2DMatrix().scale(currentScale);
});
```

**Note**: Pinch is iOS-only. Android support is experimental/in development.

## 5. Long Press Gesture

### Basic Long Press

```javascript
var view = Ti.UI.createView({
  backgroundColor: 'orange',
  width: 200, height: 200
});

view.addEventListener('longpress', function(e) {
  Ti.API.info('Long press at: ' + e.x + ', ' + e.y);
  showContextMenu(e);
});
```

### Long Press Duration

Default long press duration varies by platform. Custom handling:

```javascript
var pressTimer = null;
var PRESS_DURATION = 1000; // 1 second

view.addEventListener('touchstart', function(e) {
  pressTimer = setTimeout(function() {
    showContextMenu(e);
  }, PRESS_DURATION);
});

view.addEventListener('touchend', function(e) {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
});

view.addEventListener('touchmove', function(e) {
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
view.addEventListener('longpress', function(e) {
  var dialog = Ti.UI.createAlertDialog({
    title: 'Options',
    message: 'What would you like to do?',
    buttonNames: ['Edit', 'Delete', 'Share', 'Cancel']
  });
  dialog.addEventListener('click', function(e) {
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
Ti.Gesture.addEventListener('shake', function(e) {
  Ti.API.info('Device shaken at ' + e.timestamp);

  // Refresh content, undo action, etc.
  refreshData();
});
```

### Shake Example

```javascript
// Use shake to refresh data
var scrollView = Ti.UI.createScrollView({
  contentHeight: Ti.UI.SIZE
});

Ti.Gesture.addEventListener('shake', function() {
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
var labelX = Ti.UI.createLabel({ text: 'X: 0' });
var labelY = Ti.UI.createLabel({ text: 'Y: 0', top: 30 });
var labelZ = Ti.UI.createLabel({ text: 'Z: 0', top: 60 });

Ti.Accelerometer.addEventListener('update', function(e) {
  labelX.text = 'X: ' + e.x.toFixed(2);
  labelY.text = 'Y: ' + e.y.toFixed(2);
  labelZ.text = 'Z: ' + e.z.toFixed(2);
});
```

### Accelerometer Properties

| Property | Description | Range |
|----------|-------------|-------|
| `x` | X-axis acceleration | G-force (±9.81 m/s²) |
| `y` | Y-axis acceleration | G-force |
| `z` | Z-axis acceleration | G-force |
| `timestamp` | When event occurred | Timestamp |

### Using Accelerometer for Control

```javascript
var sensitivity = 2.0;
var lastX = 0, lastY = 0;

Ti.Accelerometer.addEventListener('update', function(e) {
  var deltaX = e.x - lastX;
  var deltaY = e.y - lastY;

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
var samples = [];
var SAMPLE_SIZE = 10;

Ti.Accelerometer.addEventListener('update', function(e) {
  samples.push({ x: e.x, y: e.y, z: e.z });

  if (samples.length >= SAMPLE_SIZE) {
    // Calculate average
    var avgX = samples.reduce(function(sum, s) { return sum + s.x; }, 0) / samples.length;
    var avgY = samples.reduce(function(sum, s) { return sum + s.y; }, 0) / samples.length;
    var avgZ = samples.reduce(function(sum, s) { return sum + s.z; }, 0) / samples.length;

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
var accelerometerAdded = false;
var accelerometerCallback = function(e) {
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
  Ti.Android.currentActivity.addEventListener('pause', function() {
    stopTracking();
  });

  Ti.Android.currentActivity.addEventListener('resume', function() {
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
var view = Ti.UI.createView({
  width: 300, height: 300,
  backgroundColor: 'cyan'
});

// Swipe for navigation
view.addEventListener('swipe', function(e) {
  if (e.direction === 'left') {
    showPrevious();
  } else if (e.direction === 'right') {
    showNext();
  }
});

// Long press for options
view.addEventListener('longpress', function(e) {
  showOptions();
});

// Double tap for like
view.addEventListener('doubletap', function(e) {
  likeContent();
});

// Pinch to zoom (iOS)
view.addEventListener('pinch', function(e) {
  if (e.scale > 1.0) {
    zoomIn();
  } else {
    zoomOut();
  }
});
```

### Preventing Gesture Conflicts

```javascript
var touchStartTime = 0;

view.addEventListener('touchstart', function(e) {
  touchStartTime = Date.now();
});

view.addEventListener('touchend', function(e) {
  var touchDuration = Date.now() - touchStartTime;

  if (touchDuration < 200) {
    // Short tap - treat as click
    handleClick();
  } else if (touchDuration > 500) {
    // Long touch - already handled by longpress
    // Ignore
  }
});
```
