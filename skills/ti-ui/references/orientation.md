# Orientation

## 1. Overview

Orientation refers to whether the app displays in portrait or landscape mode, and how to handle orientation changes.

## 2. Design Principles

- **Don't mix orientations on iPhone/iPod** — Pick either portrait or landscape for your entire app; switching between them mid-flow creates a jarring user experience.
- **Don't support portrait-upside-down on iPhone** — If a user receives a phone call while the device is upside-down, the call UI appears upside-down, which is disorienting and risky.
- **iPad should support all orientations** — Apple's HIG expects iPad apps to work in every orientation. Users frequently rotate their iPads.
- **These principles apply equally to Android** — While Android is more permissive, the same UX considerations hold. Consistency within your app matters.

## 3. Orientation Modes

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

## 4. Locking Orientation

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
```

**iOS plist iPhone vs iPad keys**: You can specify different supported orientations for iPhone and iPad using device-specific keys:
- `UISupportedInterfaceOrientations~iphone` — iPhone-specific orientations (default: portrait only)
- `UISupportedInterfaceOrientations~ipad` — iPad-specific orientations (default: all four orientations)
- `UISupportedInterfaceOrientations` (without suffix) — applies to both if device-specific keys are absent

```xml
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

> **Warning — Android set-vs-get value mismatch**: On Android, the orientation values you SET don't match those you GET. You can set 4 values (portrait upright, landscape right, portrait upside-down, landscape left) but only get 2 values back (portrait or landscape). Also, "portrait" and "landscape" meaning varies between phones and tablets based on sensor orientation — on most phones portrait is the default, but on some tablets landscape is the default sensor position.

### Runtime Orientation Lock (iOS)

```javascript
// Set orientation at runtime
Ti.UI.iPhone.setStatusBarStyle(Ti.UI.iPhone.StatusBar.DEFAULT);

// Note: In iOS, orientation is primarily controlled by Info.plist
// Use tiapp.xml configuration for consistent behavior
```

## 5. Handling Orientation Changes

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

  // Ti.Gesture helper methods — convenience booleans
  Ti.API.info(`Is portrait: ${e.source.isPortrait()}`);
  Ti.API.info(`Is landscape: ${e.source.isLandscape()}`);
});
```

> **Anti-pattern warning**: Do NOT use `orientationchange` event listeners to force an orientation. This causes: (1) the wrong orientation showing briefly before the forced one kicks in, (2) potential memory leaks from repeated listener firing, and (3) improper technique. Use `tiapp.xml` or window `orientationModes` instead.
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

## 6. Adapting UI to Orientation

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

## 7. Platform Differences

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

## 8. Checking Current Orientation

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

## 9. Disabling Orientation Change

### Disable All Rotation

**iOS (tiapp.xml)**:
```xml
<ios>
  <plist>
    <dict>
      <key>UISupportedInterfaceOrientations</key>
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

## 10. Orientation Lock Limitations

**Important:** Runtime orientation locking is NOT reliably supported across platforms.

- **iOS**: Orientation is controlled exclusively via `tiapp.xml` plist keys and window-level `orientationModes`. There is no API to lock/unlock orientation at runtime.
- **Android**: Use `android:screenOrientation` in `tiapp.xml` manifest. Changing orientation programmatically at runtime is not supported through Titanium APIs.

If you need a specific orientation for a particular screen (e.g., landscape for video playback), create a dedicated window with the desired `orientationModes` set at creation time:

```javascript
// Landscape-only video window
const videoWin = Ti.UI.createWindow({
  orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
});

const videoPlayer = Ti.Media.createVideoPlayer({
  url: 'video.mp4'
});

videoWin.add(videoPlayer);
videoWin.open();
```

## 11. Modal Window Constraints (iOS)

> **Note**: Modal windows should not support orientations unsupported by the parent window. This can cause bad visual/redraw behavior after the modal is dismissed. Additionally, setting `orientationModes` on non-modal windows inside a `NavigationWindow` or `TabGroup` is bad practice — only the root window's orientation settings are respected.

## 12. Splash Screen Configuration

Splash screens need orientation-specific image variants:

- **Android**: Uses `default.png` (lowercase `d`) placed in `Resources/android/images/`.
- **iOS**: Uses `Default.png` (uppercase `D`) with orientation variants like `Default-Landscape.png` and `Default-Portrait.png` for iPad and Universal apps.

See the `icons-and-splash-screens.md` reference for full details on naming conventions and required sizes.

## 13. Best Practices

1. **Test on multiple devices** - Orientation behavior varies
2. **Test rotation scenarios** - How does your UI adapt?
3. **Consider user preference** - Allow rotation when appropriate
4. **Lock when needed** - Video, games, camera capture
5. **Use responsive layouts** - Adapt UI to orientation
6. **Test upside-down** - Some devices support it, some don't
7. **Handle edge cases** - What happens during phone calls?
8. **Consider tablets** - Default orientation may differ

## 14. Common Issues

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
