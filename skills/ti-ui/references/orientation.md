# Orientation

## 1. Overview

Orientation is whether the app displays in portrait or landscape, and how it reacts when the device rotates.

## 2. Design principles

- Do not mix orientations on iPhone or iPod. Pick portrait or landscape for the whole app. Switching mid-flow feels jarring.
- Do not support portrait upside-down on iPhone. A phone call can appear upside-down, which is confusing and risky.
- iPad should support all orientations. Apple’s HIG expects it and users rotate their iPads often.
- These principles apply to Android as well. Android is more permissive, but consistency still matters.

## 3. Orientation modes

### Supported orientations

| Mode                    | Description                      |
| ----------------------- | -------------------------------- |
| `Ti.UI.PORTRAIT`        | Upright, home button at bottom   |
| `Ti.UI.UPSIDE_PORTRAIT` | Upright, home button at top      |
| `Ti.UI.LANDSCAPE_LEFT`  | Landscape, home button on right  |
| `Ti.UI.LANDSCAPE_RIGHT` | Landscape, home button on left   |
| `Ti.UI.FACE_UP`         | Device face up (flat on table)   |
| `Ti.UI.FACE_DOWN`       | Device face down (flat on table) |
| `Ti.UI.AUTO`            | Let system decide                |

## 4. Locking orientation

### Lock to a specific orientation

In `tiapp.xml` (preferred):

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

iOS plist iPhone vs iPad keys: You can define separate orientations for iPhone and iPad:
- `UISupportedInterfaceOrientations~iphone` for iPhone (default: portrait only)
- `UISupportedInterfaceOrientations~ipad` for iPad (default: all four)
- `UISupportedInterfaceOrientations` applies to both if device-specific keys are absent

```xml
<android>
  <manifest>
    <activity>
      <android:screenOrientation="portrait"/>
    </activity>
  </manifest>
</android>
```

### Android orientation values

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

Common values:
- `portrait` for portrait mode
- `landscape` for landscape mode
- `sensor` uses the accelerometer
- `fullSensor` allows all four orientations
- `nosensor` ignores the accelerometer
- `user` follows the user preference

Warning: Android set vs get mismatch. You can set four specific orientations, but you only get two values back (portrait or landscape). Meaning also varies between phones and tablets based on sensor orientation.

### Runtime orientation lock (iOS)

```javascript
// Set orientation at runtime
Ti.UI.iPhone.setStatusBarStyle(Ti.UI.iPhone.StatusBar.DEFAULT);

// Note: In iOS, orientation is primarily controlled by Info.plist
// Use tiapp.xml configuration for consistent behavior
```

## 5. Handling orientation changes

### Detect orientation change

```javascript
Ti.Gesture.addEventListener('orientationchange', (e) => {
  Ti.API.info(`Orientation changed to: ${e.orientation}`);

  if (e.orientation === Ti.UI.PORTRAIT) {
    adjustForPortrait();
  } else if (e.orientation === Ti.UI.LANDSCAPE_LEFT ||
             e.orientation === Ti.UI.LANDSCAPE_RIGHT) {
    adjustForLandscape();
  }

  // Ti.Gesture helper methods - convenience booleans
  Ti.API.info(`Is portrait: ${e.source.isPortrait()}`);
  Ti.API.info(`Is landscape: ${e.source.isLandscape()}`);
});
```

Anti-pattern warning: Do not use `orientationchange` listeners to force an orientation. It causes the wrong orientation to flash, repeated firing, and bad behavior. Use `tiapp.xml` or window `orientationModes`.
...
### Window orientation events

```javascript
const win = Ti.UI.createWindow();

win.addEventListener('focus', () => {
  Ti.API.info(`Current orientation: ${Ti.Gesture.orientation}`);
});

win.addEventListener('orientationchange', (e) => {
  Ti.API.info('Window orientation changed');
});
```

## 6. Adapting UI to orientation

### Responsive layout example

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

### Orientation-specific components

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

## 7. Platform differences

### iOS orientation

- Controlled by `UISupportedInterfaceOrientations` in Info.plist
- Shake to rotate can be disabled
- Status bar orientation matches window orientation
- Supports all orientations, including upside-down

### Android orientation

- Controlled by `screenOrientation` in AndroidManifest.xml
- Can be set per activity
- More granular control (sensor, user, nosensor)
- May ignore upside-down depending on device

## 8. Checking current orientation

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

## 9. Disabling orientation change

### Disable all rotation

iOS (tiapp.xml):
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

Android (tiapp.xml):
```xml
<android>
  <manifest>
    <activity android:screenOrientation="portrait"/>
  </manifest>
</android>
```

### Disable rotation for a specific window (iOS)

```javascript
const win = Ti.UI.createWindow({
  orientationModes: [Ti.UI.PORTRAIT]
});
```

Note: Window-level control is limited. App-level configuration is more reliable.

## 10. Orientation lock limitations

Runtime orientation locking is not reliable across platforms.

- iOS: Orientation is controlled by `tiapp.xml` plist keys and window-level `orientationModes`. There is no API to lock or unlock at runtime.
- Android: Use `android:screenOrientation` in `tiapp.xml`. Changing orientation programmatically at runtime is not supported through Titanium APIs.

If you need a specific orientation for one screen (for example, landscape video playback), create a dedicated window with `orientationModes` set at creation time:

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

## 11. Modal window constraints (iOS)

Note: Modal windows should not support orientations unsupported by the parent window. It can cause redraw glitches after dismissal. Also, setting `orientationModes` on non-modal windows inside a `NavigationWindow` or `TabGroup` is bad practice. Only the root window’s orientation settings are respected.

## 12. Splash screen configuration

Splash screens need orientation-specific images:
- Android uses `default.png` (lowercase d) in `Resources/android/images/`.
- iOS uses `Default.png` (uppercase D) and orientation variants like `Default-Landscape.png` and `Default-Portrait.png` for iPad and Universal apps.

See `icons-and-splash-screens.md` for full naming and size details.

## 13. Best practices

1. Test on multiple devices. Orientation behavior varies.
2. Test rotation scenarios. See how your UI adapts.
3. Consider user preference. Allow rotation when it makes sense.
4. Lock when needed, like video, games, or camera capture.
5. Use responsive layouts.
6. Test upside-down. Some devices support it, some do not.
7. Handle edge cases like phone calls.
8. Consider tablets. Default orientation can differ.

## 14. Common issues

### Orientation not changing

Problem: App does not rotate when the device rotates.

Solutions:
1. Check `tiapp.xml` orientation settings.
2. Ensure all orientations are enabled.
3. Test on physical device (simulator may not reflect real behavior).
4. Check for custom orientation locking code.

### UI does not adapt

Problem: App rotates but layout does not adjust.

Solutions:
1. Implement `orientationchange` listeners.
2. Use responsive layout techniques.
3. Test portrait and landscape layouts.
4. Consider different layouts per orientation.

### Upside-down orientation

Problem: App appears upside-down.

Solutions:
1. Add `UIInterfaceOrientationPortraitUpsideDown` on iOS.
2. Use `reversePortrait` or `fullSensor` on Android.
3. Decide if upside-down is needed for your use case.
