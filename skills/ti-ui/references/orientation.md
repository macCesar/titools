# Orientation

## 1. Overview

Orientation refers to whether the app displays in portrait or landscape mode, and how to handle orientation changes.

## 2. Orientation Modes

### Supported Orientations

| Mode | Description |
|------|-------------|
| `Ti.UI.PORTRAIT` | Upright, home button at bottom |
| `Ti.UI.UPSIDE_PORTRAIT` | Upright, home button at top |
| `Ti.UI.LANDSCAPE_LEFT` | Landscape, home button on right |
| `Ti.UI.LANDSCAPE_RIGHT` | Landscape, home button on left |
| `Ti.UI.FACE_UP` | Device face up (flat on table) |
| `Ti.UI.FACE_DOWN` | Device face down (flat on table) |
| `Ti.UI.AUTO` | Let system decide |

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
Ti.Gesture.addEventListener('orientationchange', function(e) {
  Ti.API.info('Orientation changed to: ' + e.orientation);

  if (e.orientation === Ti.UI.PORTRAIT) {
    adjustForPortrait();
  } else if (e.orientation === Ti.UI.LANDSCAPE_LEFT ||
             e.orientation === Ti.UI.LANDSCAPE_RIGHT) {
    adjustForLandscape();
  }
});
```

### Orientation Event Properties

| Property | Description |
|----------|-------------|
| `orientation` | New orientation constant |
| `source` | View that triggered event |

### Window Orientation Events

```javascript
var win = Ti.UI.createWindow();

win.addEventListener('focus', function() {
  Ti.API.info('Current orientation: ' + Ti.Gesture.orientation);
});

win.addEventListener('orientationchange', function(e) {
  Ti.API.info('Window orientation changed');
});
```

## 5. Adapting UI to Orientation

### Responsive Layout Example

```javascript
var container = Ti.UI.createView({
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  layout: 'vertical'
});

function updateLayout() {
  var orientation = Ti.Gesture.orientation;

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

var currentLayout;

function switchLayout() {
  var orientation = Ti.Gesture.orientation;
  var isPortrait = (orientation === Ti.UI.PORTRAIT ||
                   orientation === Ti.UI.UPSIDE_PORTRAIT);

  var newLayout = isPortrait ? createPortraitLayout() : createLandscapeLayout();

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
var currentOrientation = Ti.Gesture.orientation;

Ti.API.info('Current: ' + currentOrientation);

// Check if portrait
var isPortrait = (currentOrientation === Ti.UI.PORTRAIT ||
                 currentOrientation === Ti.UI.UPSIDE_PORTRAIT);

// Check if landscape
var isLandscape = (currentOrientation === Ti.UI.LANDSCAPE_LEFT ||
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
var win = Ti.UI.createWindow({
  orientationModes: [Ti.UI.PORTRAIT]
});
```

**Note**: Window-level orientation control is limited; app-level configuration is preferred.

## 9. Orientation Lock During Specific Operation

### Temporarily Lock Orientation

```javascript
var originalOrientation = null;

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
var videoPlayer = Ti.Media.createVideoPlayer({
  url: 'video.mp4'
});

videoPlayer.addEventListener('playbackstart', function() {
  lockOrientation();
});

videoPlayer.addEventListener('playbackcomplete', function() {
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
