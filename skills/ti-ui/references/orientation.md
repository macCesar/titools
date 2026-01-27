# Orientation

## Table of Contents

- [Orientation](#orientation)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Orientation Modes](#2-orientation-modes)
    - [Supported Orientations](#supported-orientations)
  - [3. Locking Orientation](#3-locking-orientation)
    - [Lock to Specific Orientation](#lock-to-specific-orientation)
    - [Android Orientation Values](#android-orientation-values)
    - [Runtime Orientation Lock (iOS)](#runtime-orientation-lock-ios)
  - [4. Handling Orientation Changes](#4-handling-orientation-changes)
    - [Detect Orientation Change](#detect-orientation-change)
    - [Window Orientation Events](#window-orientation-events)
  - [5. Adapting UI to Orientation](#5-adapting-ui-to-orientation)
    - [Responsive Layout Example](#responsive-layout-example)
    - [Orientation-Specific Components](#orientation-specific-components)
  - [6. Platform Differences](#6-platform-differences)
    - [iOS Orientation](#ios-orientation)
    - [Android Orientation](#android-orientation)
  - [7. Checking Current Orientation](#7-checking-current-orientation)
  - [8. Disabling Orientation Change](#8-disabling-orientation-change)
    - [Disable All Rotation](#disable-all-rotation)
    - [Disable Rotation for Specific Window (iOS)](#disable-rotation-for-specific-window-ios)
  - [9. Orientation Lock During Specific Operation](#9-orientation-lock-during-specific-operation)
    - [Temporarily Lock Orientation](#temporarily-lock-orientation)
  - [10. Best Practices](#10-best-practices)
  - [11. Common Issues](#11-common-issues)
    - [Orientation Not Changing](#orientation-not-changing)
    - [UI Doesn't Adapt](#ui-doesnt-adapt)
    - [Upside-Down Orientation](#upside-down-orientation)

---

## 1. Overview

Orientation refers to whether the app displays in portrait or landscape mode, and how to handle orientation changes.

## 2. Orientation Modes

### Supported Orientations

| Mode                    | Description                      |
| ----------------------- | -------------------------------- |
| `Ti.UI.PORTRAIT`        | Upright, home button at bottom   |
| `Ti.UI.UPSIDE_PORTRAIT` | Upright, home button at top      |
| `Ti.UI.LANDSCAPE_LEFT`  | Landscape, home button on right  |
| `Ti.UI.LANDSCAPE_RIGHT` | Landscape, home button on left   |
| `Ti.UI.FACE_UP`         | Device face up (flat on table)   |
| `Ti.UI.FACE_DOWN`       | Device face down (flat on table) |
| `Ti.UI.AUTO`            | Let system decide                |

## 3. Locking Orientation

### Lock to Specific Orientation

**In tiapp.xml** (preferred):

```xml
<ios>
  <plist>
    <dict>
      <key>UISupportedInterfaceOrientations</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
      </array>
    </dict>
  </plist>
</ios>

<android>
  <manifest>
    <activity>
      <android:screenOrientation="portrait"/>
    </activity>
  </manifest>
</android>
```

### Android Orientation Values

```xml
<activity android:screenOrientation="portrait"/>
<activity android:screenOrientation="landscape"/>
<activity android:screenOrientation="reversePortrait"/>
<activity android:screenOrientation="reverseLandscape"/>
<activity android:screenOrientation="sensorPortrait"/>
<activity android:screenOrientation="sensorLandscape"/>
<activity android:screenOrientation="fullSensor"/>
<activity android:screenOrientation="nosensor"/>
<activity android:screenOrientation="userPortrait"/>
<activity android:screenOrientation="userLandscape"/>
<activity android:screenOrientation="sensor"/>
```

**Common values**:
- `portrait` - Portrait mode
- `landscape` - Landscape mode
- `sensor` - Uses accelerometer to determine
- `fullSensor` - All 4 orientations (including upside-down)
- `nosensor` - Ignores accelerometer (orientation changes only)
- `user` - User's preference

### Runtime Orientation Lock (iOS)

```javascript
// Set orientation at runtime
Ti.UI.iPhone.setStatusBarStyle(Ti.UI.iPhone.StatusBar.DEFAULT);

// Note: In iOS, orientation is primarily controlled by Info.plist
// Use tiapp.xml configuration for consistent behavior
```

## 4. Handling Orientation Changes

### Detect Orientation Change

```javascript
Ti.Gesture.addEventListener('orientationchange', (e) => {
  Ti.API.info(`Orientation changed to: ${e.orientation}`);

  if (e.orientation === Ti.UI.PORTRAIT) {
    adjustForPortrait();
  } else if (e.orientation === Ti.UI.LANDSCAPE_LEFT ||
             e.orientation === Ti.UI.LANDSCAPE_RIGHT) {
    adjustForLandscape();
  }
});
```
...
### Window Orientation Events

```javascript
const win = Ti.UI.createWindow();

win.addEventListener('focus', () => {
  Ti.API.info(`Current orientation: ${Ti.Gesture.orientation}`);
});

win.addEventListener('orientationchange', (e) => {
  Ti.API.info('Window orientation changed');
});
```

## 5. Adapting UI to Orientation

### Responsive Layout Example

```javascript
const container = Ti.UI.createView({
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  layout: 'vertical'
});

function updateLayout() {
  const orientation = Ti.Gesture.orientation;

  if (orientation === Ti.UI.PORTRAIT ||
      orientation === Ti.UI.UPSIDE_PORTRAIT) {
    // Portrait layout
    container.width = Ti.UI.FILL;
    container.height = Ti.UI.FILL;
    container.layout = 'vertical';
  } else {
    // Landscape layout
    container.width = Ti.UI.FILL;
    container.height = Ti.UI.FILL;
    container.layout = 'horizontal';
  }
}

Ti.Gesture.addEventListener('orientationchange', updateLayout);
```

### Orientation-Specific Components

```javascript
function createPortraitLayout() {
  return Ti.UI.createView({
    layout: 'vertical'
  });
}

function createLandscapeLayout() {
  return Ti.UI.createView({
    layout: 'horizontal'
  });
}

let currentLayout;

function switchLayout() {
  const orientation = Ti.Gesture.orientation;
  const isPortrait = (orientation === Ti.UI.PORTRAIT ||
                   orientation === Ti.UI.UPSIDE_PORTRAIT);

  const newLayout = isPortrait ? createPortraitLayout() : createLandscapeLayout();

  if (currentLayout) {
    win.remove(currentLayout);
  }

  currentLayout = newLayout;
  win.add(currentLayout);
}

Ti.Gesture.addEventListener('orientationchange', switchLayout);
```

## 6. Platform Differences

### iOS Orientation

- Controlled by `UISupportedInterfaceOrientations` in Info.plist
- Shake to rotate can be disabled
- Status bar orientation matches window orientation
- Supports all orientations including upside-down

### Android Orientation

- Controlled by `screenOrientation` in AndroidManifest.xml
- Can be set per-activity
- More granular control (sensor, user, nosensor)
- May ignore upside-down depending on device

## 7. Checking Current Orientation

```javascript
// Get current orientation
const currentOrientation = Ti.Gesture.orientation;

Ti.API.info(`Current: ${currentOrientation}`);

// Check if portrait
const isPortrait = (currentOrientation === Ti.UI.PORTRAIT ||
                 currentOrientation === Ti.UI.UPSIDE_PORTRAIT);

// Check if landscape
const isLandscape = (currentOrientation === Ti.UI.LANDSCAPE_LEFT ||
                   currentOrientation === Ti.UI.LANDSCAPE_RIGHT);
```

## 8. Disabling Orientation Change

### Disable All Rotation

**iOS (tiapp.xml)**:
```xml
<ios>
  <plist>
    <dict>
      <key>UISupportedInterfaceOorientations</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
      </array>
    </dict>
  </plist>
</ios>
```

**Android (tiapp.xml)**:
```xml
<android>
  <manifest>
    <activity android:screenOrientation="portrait"/>
  </manifest>
</android>
```

### Disable Rotation for Specific Window (iOS)

```javascript
const win = Ti.UI.createWindow({
  orientationModes: [Ti.UI.PORTRAIT]
});
```

**Note**: Window-level orientation control is limited; app-level configuration is preferred.

## 9. Orientation Lock During Specific Operation

### Temporarily Lock Orientation

```javascript
let originalOrientation = null;

function lockOrientation() {
  // Save current orientation
  originalOrientation = Ti.Gesture.orientation;

  // Force portrait
  if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
    // iOS doesn't support runtime orientation lock
    // This is controlled at app level
    Ti.API.warn('iOS orientation must be locked in tiapp.xml');
  }
}

function unlockOrientation() {
  // Would restore orientation
  // Not fully supported on all platforms
}

// Use case: During video playback
const videoPlayer = Ti.Media.createVideoPlayer({
  url: 'video.mp4'
});

videoPlayer.addEventListener('playbackstart', () => {
  lockOrientation();
});

videoPlayer.addEventListener('playbackcomplete', () => {
  unlockOrientation();
});
```

## 10. Best Practices

1. **Test on multiple devices** - Orientation behavior varies
2. **Test rotation scenarios** - How does your UI adapt?
3. **Consider user preference** - Allow rotation when appropriate
4. **Lock when needed** - Video, games, camera capture
5. **Use responsive layouts** - Adapt UI to orientation
6. **Test upside-down** - Some devices support it, some don't
7. **Handle edge cases** - What happens during phone calls?
8. **Consider tablets** - Default orientation may differ

## 11. Common Issues

### Orientation Not Changing

**Problem**: App doesn't rotate when device rotates.

**Solutions**:
1. Check `tiapp.xml` orientation settings
2. Ensure all orientations are enabled
3. Test on physical device (simulator may not reflect real behavior)
4. Check for custom orientation locking code

### UI Doesn't Adapt

**Problem**: App rotates but layout doesn't adjust.

**Solutions**:
1. Implement `orientationchange` event listener
2. Use responsive layout techniques
3. Test both portrait and landscape layouts
4. Consider using different layouts for each orientation

### Upside-Down Orientation

**Problem**: App appears upside-down.

**Solutions**:
1. Add `UIInterfaceOrientationPortraitUpsideDown` to supported orientations (iOS)
2. Use `reversePortrait` or `fullSensor` (Android)
3. Consider whether upside-down is needed for your use case
