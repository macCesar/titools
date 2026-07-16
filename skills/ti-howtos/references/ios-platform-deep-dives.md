# iOS platform deep dives

## 1. iOS 17+ privacy requirements (critical)
Apple requires declaring the use of certain APIs to prevent fingerprinting.

### PrivacyInfo.xcprivacy file
Create this file in `app/assets/iphone/` (Alloy) or `Resources/iphone/` (Classic):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array><string>AC6B.1</string></array>
        </dict>
    </array>
</dict>
</plist>
```
Common categories: `UserDefaults` (Ti.App.Properties), `FileTimestamp` (file.createdAt), `SystemBootTime`.

## 2. Background services and silent push

### Overview
iOS allows limited background execution. For large downloads, use the `com.titaniumsdk.urlSession` module.

### Silent push (background update)
Wakes up the app to download content without showing a notification.

`tiapp.xml`:
```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

`app.js`:
```javascript
Ti.App.iOS.addEventListener('silentpush', (e) => {
  // Start download or update
  Ti.API.info(`Data received: ${JSON.stringify(e)}`);

  // Mandatory to call upon completion (max 30 seconds)
  Ti.App.iOS.endBackgroundHandler(e.handlerId);
});
```

### Background fetch
```javascript
// Enable in tiapp.xml:
// <key>UIBackgroundModes</key>
// <array><string>fetch</string></array>

// Set minimum fetch interval
Ti.App.iOS.setMinimumBackgroundFetchInterval(Ti.App.iOS.BACKGROUNDFETCHINTERVAL_MIN);

Ti.App.iOS.addEventListener('backgroundfetch', (e) => {
  // Fetch new data
  Ti.API.info('Background fetch triggered');

  // Must call endBackgroundHandler when done (max 30 seconds)
  Ti.App.iOS.endBackgroundHandler(e.handlerId);
});

// To disable background fetch:
// Ti.App.iOS.setMinimumBackgroundFetchInterval(Ti.App.iOS.BACKGROUNDFETCHINTERVAL_NEVER);
```

### URL Session module
For large downloads that continue even if the app is suspended, use `com.titaniumsdk.urlSession`:

```javascript
const urlSession = require('com.titaniumsdk.urlSession');

const config = urlSession.createSessionConfiguration({
  identifier: 'com.myapp.downloads'
});

const session = urlSession.createSession({
  configuration: config
});

// Start a download task
session.downloadTask({
  url: 'https://example.com/largefile.zip'
});

// Monitor progress
session.addEventListener('downloadprogress', (e) => {
  Ti.API.info(`Progress: ${e.totalBytesWritten}/${e.totalBytesExpectedToWrite}`);
});

session.addEventListener('downloadcompleted', (e) => {
  Ti.API.info(`Download saved to: ${e.data}`);
});

session.addEventListener('sessioncompleted', (e) => {
  if (!e.success) {
    Ti.API.error(`Session error: ${e.errorDescription}`);
  }
});

// Invalidate session when no longer needed
session.invalidateAndCancel();
```

## 3. iCloud services and backup control

### Disable individual backup (best practice)
Apple rejects apps that upload unnecessary data to iCloud. Disable backup for temporary or recreatable files.

```javascript
const file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cache.dat');
file.remoteBackup = false; // Prevents upload to iCloud/iTunes
```

### Recursive folder backup disable
```javascript
function disableiCloudBackup(folder) {
  const dir = Ti.Filesystem.getFile(folder);
  const files = dir.getDirectoryListing();
  files.forEach((name) => {
    const f = Ti.Filesystem.getFile(folder, name);
    f.remoteBackup = false;
    if (f.isDirectory()) disableiCloudBackup(f.nativePath);
  });
}
```

## 4. WatchKit and Ti.WatchSession

For watchOS 2+, use `Ti.WatchSession` for bidirectional communication.

### Activate session
```javascript
if (Ti.WatchSession.isSupported) {
  Ti.WatchSession.activateSession();
}
```

### Send message (immediate)
```javascript
if (Ti.WatchSession.isReachable) {
  Ti.WatchSession.sendMessage({
    orderId: '123',
    status: 'shipped'
  });
}
```

### Receive data from Watch
```javascript
Ti.WatchSession.addEventListener('receivemessage', (e) => {
  Ti.API.info(`Message from Watch: ${e.message}`);
});
```

### Provisioning profiles for Watch
Both the iOS app and WatchKit extension need separate provisioning profiles. Configure in `tiapp.xml`:
```xml
<ios>
    <extensions>
        <extension projectPath="extensions/WatchApp/WatchApp.xcodeproj">
            <target name="WatchApp Extension">
                <provisioning-profiles>
                    <device>WATCH_DEV_PROFILE_UUID</device>
                    <dist-appstore>WATCH_DIST_PROFILE_UUID</dist-appstore>
                </provisioning-profiles>
            </target>
        </extension>
    </extensions>
</ios>
```

Note: for Xcode 8+, ensure your Team ID matches across all targets.

## 5. SiriKit and Siri intents

Allows your app to respond to Siri voice commands (Messaging, Payments, Workouts).

### Configuration in tiapp.xml
```xml
<key>NSSiriUsageDescription</key>
<string>Siri will use your voice to send messages in this app.</string>
```

### Siri extensions
Create an Intents Extension in Xcode and add it to the `extensions/` folder. Then register it in `tiapp.xml`:
```xml
<ios>
    <extensions>
        <extension projectPath="extensions/SiriIntent/SiriIntent.xcodeproj">
            <target name="SiriIntent">
                <provisioning-profiles>
                    <device>PROVISIONING_PROFILE_UUID</device>
                </provisioning-profiles>
            </target>
        </extension>
    </extensions>
</ios>
```

### Implementation steps
1. Register App ID with SiriKit capability in Apple Developer Portal.
2. Create Intents Extension in Xcode (File > New > Target > Intents Extension).
3. Configure entitlements (add `com.apple.developer.siri`).
4. Add extension to project (place in `extensions/` folder).
5. Register in `tiapp.xml` with provisioning profiles for the extension target.
6. Handle intents in the native extension code (Swift/Objective-C).

Note: SiriKit requires native code in the Intent Extension. The Titanium app receives results via `continueactivity` events.

## 6. Spotlight search (Core Spotlight)

Indexes your app content to appear in global iOS search results.

```javascript
const itemAttr = Ti.App.iOS.createSearchableItemAttributeSet({
  itemContentType: Ti.App.iOS.UTTYPE_TEXT,
  title: 'My Article',
  contentDescription: 'Content description...',
  keywords: ['titanium', 'help']
});

const item = Ti.App.iOS.createSearchableItem({
  uniqueIdentifier: 'id-123',
  domainIdentifier: 'articles',
  attributeSet: itemAttr
});

const indexer = Ti.App.iOS.createSearchableIndex();
indexer.addToDefaultSearchableIndex([item], (e) => {
  if (e.success) Ti.API.info('Indexed!');
});
```

## 7. Core Motion module

### Overview
Core Motion provides access to hardware sensors: accelerometer, gyroscope, magnetometer, and more.

Requirements:
- Add module to `tiapp.xml`:
```xml
<modules>
  <module platform="iphone">ti.coremotion</module>
</modules>
```

- Can only test on device, not simulator
- Motion Activity permission required for Activity API

### Basic workflow

1. Require the module:
```javascript
var CoreMotion = require('ti.coremotion');
```

2. Check availability:
```javascript
var Accelerometer = CoreMotion.createAccelerometer();
if (Accelerometer.isAccelerometerAvailable()) {
  // Use accelerometer
}
```

3. Start updates:
```javascript
Accelerometer.setAccelerometerUpdateInterval(1000); // 1 second
Accelerometer.startAccelerometerUpdates((e) => {
  if (e.success) {
    const data = e.acceleration;
    Ti.API.info(`X: ${data.x} Y: ${data.y} Z: ${data.z}`);
  }
});
```

4. Stop when done:
```javascript
Accelerometer.stopAccelerometerUpdates();
```

### Coordinate system
Hold device in portrait mode, screen facing you:
- X-axis: width (positive = right, negative = left)
- Y-axis: height (positive = up, negative = down)
- Z-axis: through screen (positive = toward screen, negative = behind)

### Accelerometer

Measures g-force acceleration along three axes.

```javascript
var CoreMotion = require('ti.coremotion');
var Accelerometer = CoreMotion.createAccelerometer();

if (Accelerometer.isAccelerometerAvailable()) {
  Accelerometer.setAccelerometerUpdateInterval(100);
  Accelerometer.startAccelerometerUpdates(function(e) {
    if (e.success) {
      var data = e.acceleration;
      updateDisplay(data.x, data.y, data.z);
    }
  });
}
```

Use for: shake detection, device orientation, movement detection.

### Gyroscope

Measures rotational rate along three axes (radians).

```javascript
var Gyroscope = CoreMotion.createGyroscope();

if (Gyroscope.isGyroAvailable()) {
  Gyroscope.setGyroUpdateInterval(100);
  Gyroscope.startGyroUpdates(function(e) {
    if (e.success) {
      var data = e.rotationRate;
      Ti.API.info('Rotation: X=' + data.x + ' Y=' + data.y + ' Z=' + data.z);
    }
  });
}
```

Use for: rotation gestures, 3D motion tracking, enhanced UI.

### Magnetometer

Measures magnetic field strength (microteslas). Acts as a digital compass.

```javascript
var Magnetometer = CoreMotion.createMagnetometer();

if (Magnetometer.isMagnetometerAvailable()) {
  Magnetometer.startMagnetometerUpdates();
  // Or poll manually:
  var data = Magnetometer.getMagnetometerData();
  Ti.API.info('Magnetic field: ' + JSON.stringify(data.magneticField));
}
```

Use for: compass direction, magnetic field detection.

### Device motion

Combines accelerometer, gyroscope, and magnetometer for attitude and user acceleration.

```javascript
var DeviceMotion = CoreMotion.createDeviceMotion();

if (DeviceMotion.isDeviceMotionAvailable()) {
  DeviceMotion.setDeviceMotionUpdateInterval(500);

  // Check available reference frames
  var frames = DeviceMotion.availableAttitudeReferenceFrames();

  if (frames & CoreMotion.ATTITUDE_REFERENCE_FRAME_X_TRUE_NORTH_Z_VERTICAL) {
    // Use true north reference
    DeviceMotion.startDeviceMotionUpdatesUsingReferenceFrame(
      { referenceFrame: CoreMotion.ATTITUDE_REFERENCE_FRAME_X_TRUE_NORTH_Z_VERTICAL },
      (e) => {
        if (e.success) {
          // Attitude: orientation (pitch, roll, yaw)
          const attitude = e.attitude;
          Ti.API.info(`Pitch: ${attitude.pitch} Roll: ${attitude.roll} Yaw: ${attitude.yaw}`);

          // User acceleration: force applied by user (not gravity)
          const userAccel = e.userAcceleration;
        }
      }
    );
  }
}
```

Attitude formats:
- Pitch/Roll/Yaw (Euler angles)
- Quaternion (w, x, y, z)
- Rotation Matrix (m11-m33)

Reference frames:
- `ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_Z_VERTICAL` - default
- `ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_CORRECTED_Z_VERTICAL` - uses magnetometer for yaw
- `ATTITUDE_REFERENCE_FRAME_X_MAGNETIC_NORTH_Z_VERTICAL` - magnetic north
- `ATTITUDE_REFERENCE_FRAME_X_TRUE_NORTH_Z_VERTICAL` - true north (requires location)

### Activity API

```javascript
const MotionActivity = CoreMotion.createMotionActivity();

MotionActivity.startActivityUpdates((e) => {
  const activity = e.activity;

  // Check confidence
  if (activity.confidence !== CoreMotion.MOTION_ACTIVITY_CONFIDENCE_LOW) {
    if (activity.walking) {
      Ti.API.info('User is walking');
    } else if (activity.running) {
      Ti.API.info('User is running');
    } else if (activity.automotive) {
      Ti.API.info('User in vehicle');
    } else if (activity.stationary) {
      Ti.API.info('Device stationary');
    }
  }
});
```

Query historical activity:
```javascript
var endDate = new Date();
var startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // 1 hour ago

MotionActivity.queryActivity({
  start: startDate,
  end: endDate
}, function(e) {
  var activities = e.activities;
  // Process historical data
});
```

Requires Motion Activity permission in `tiapp.xml`:
```xml
<key>NSMotionUsageDescription</key>
<string>Need motion data for fitness tracking</string>
```

### Pedometer

```javascript
const Pedometer = CoreMotion.createPedometer();

if (Pedometer.isStepCountingAvailable()) {
  // Start live updates
  Pedometer.startPedometerUpdates({
    start: new Date(new Date().getTime() - (60 * 60 * 1000)) // From 1 hour ago
  }, (e) => {
    Ti.API.info(`Steps: ${e.numberOfSteps}`);
    Ti.API.info(`Distance: ${e.distance} meters`);
    Ti.API.info(`Floors up: ${e.floorsAscended}`);
    Ti.API.info(`Floors down: ${e.floorsDescended}`);
  });
}

// Query historical data
var endDate = new Date();
var startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

Pedometer.queryPedometerData({
  start: startDate,
  end: endDate
}, function(e) {
  Ti.API.info('Steps in last 24h: ' + e.numberOfSteps);
});
```

Use for: fitness apps, step challenges, activity tracking.

### Core Motion best practices

1. Always check availability; not all devices have all sensors.
2. Set appropriate update intervals; high frequency means more CPU/battery.
3. Stop updates when not needed to conserve battery.
4. Handle errors gracefully; sensors can fail or be unavailable.
5. Test on physical devices; sensors do not work in simulator.

## 8. Handoff user activities

```javascript
const UserActivity = Ti.App.iOS.createUserActivity({
  activityType: 'com.myapp.reading-article',
  title: 'Reading: Titanium SDK Guide',
  userInfo: {
    articleId: '123',
    scrollPosition: 450
  },
  webpageURL: 'https://myapp.com/articles/123' // For web fallback
});

// Mark as current activity
UserActivity.becomeCurrent();
```

### Handling incoming Handoff

```javascript
Ti.App.iOS.addEventListener('continueactivity', function(e) {
  if (e.activityType === 'com.myapp.reading-article') {
    var userInfo = e.userInfo;

    // Restore activity state
    openArticle(userInfo.articleId, {
      scrollTo: userInfo.scrollPosition
    });
  }
});
```

### Invalidating activities

```javascript
// When user closes article
UserActivity.invalidate();
```

### Declaring activity types in tiapp.xml

```xml
<key>NSUserActivityTypes</key>
<array>
  <string>com.myapp.reading-article</string>
  <string>com.myapp.editing-document</string>
  <string>com.myapp.viewing-product</string>
</array>
```

### Requirements
- Both devices must be signed into the same iCloud account
- Bluetooth LE must be enabled on both devices
- Both devices must be on the same Wi-Fi network
- Test with Safari first to verify Handoff works between your devices

## 9. Additional iOS features

### 3D Touch (Force Touch)

```javascript
// Check for 3D Touch support
if (Ti.Platform.forceTouchSupported) {
  view.addEventListener('touchstart', (e) => {
    const force = e.force || 0;
    const maxForce = e.maximumForce || 1;

    if (force / maxForce > 0.75) {
      // Deep press
      showQuickActions();
    }
  });
}
```

### Haptic feedback

```javascript
// Generate haptic feedback
const generator = Ti.UI.iOS.createHapticFeedbackGenerator();

// Impact feedback (light, medium, heavy)
generator.impactOccurred(Ti.UI.iOS.HAPTIC_FEEDBACK_STYLE_MEDIUM);

// Selection feedback
generator.selectionChanged();

// Notification feedback (success, warning, error)
generator.notificationOccurred(Ti.UI.iOS.HAPTIC_FEEDBACK_TYPE_SUCCESS);
```

### Document interaction

Open documents in other apps:

```javascript
var docController = Ti.UI.iOS.createDocumentViewer({
  url: file.nativePath
});

docController.addEventListener('complete', function(e) {
  Ti.API.info('Document interaction complete');
});

win.add(docController);
```

## Best practices summary

1. Background services: use sparingly; stop when done.
2. Core Motion: check availability and test on device.
3. Spotlight: index content as it changes.
4. Handoff: provide a web URL fallback.
5. iCloud: use for small synced data, not large files.
6. SiriKit: requires native extension; use only if beneficial.
7. Permissions: always include usage descriptions in `tiapp.xml`.
8. Testing: many features require physical device testing.
