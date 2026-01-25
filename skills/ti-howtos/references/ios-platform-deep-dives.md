# iOS Platform Deep Dives

## 1. Background Services

### Overview
Background services allow tasks to continue running after the app enters the background. iOS has strict limitations on background execution.

### Registration
```javascript
var service = Ti.App.iOS.registerBackgroundService({
  url: 'bg.js'
});
```

**bg.js**:
```javascript
// Background task code
Ti.API.info('Background service running');

// Example: Periodic check
setInterval(function() {
  checkForUpdates();
}, 60000);  // Every minute
```

### Background Modes
Enable specific background modes in `tiapp.xml`:

```xml
<ios>
  <plist>
    <dict>
      <key>UIBackgroundModes</key>
      <array>
        <string>audio</string>           <!-- Audio playback -->
        <string>location</string>        <!-- GPS tracking -->
        <string>fetch</string>           <!-- Background fetch -->
        <string>processing</string>      <!-- Background processing -->
        <string>remote-notification</string>  <!-- Push processing -->
      </array>
    </dict>
  </plist>
</ios>
```

### Common Use Cases

#### Audio Background Mode
For music/podcast streaming. Must set `allowBackground: true` on AudioPlayer.

#### Location Background Mode
For navigation/fitness tracking. Requires `NSLocationAlwaysAndWhenInUseUsageDescription` permission.

#### Background Fetch
iOS periodically launches app to fetch new content:

```javascript
// Set minimum fetch interval (in seconds)
Ti.App.iOS.setMinimumBackgroundFetchInterval(3600);  // 1 hour

// Handle fetch event
Ti.App.iOS.addEventListener('backgroundfetch', function(e) {
  // Fetch new data
  fetchData(function() {
    // Call when done
    e.performFetchWithResultHandler(Ti.App.iOS.BACKGROUND_FETCH_RESULT_NEW_DATA);
  });
});
```

### Background Service Limitations
- Limited execution time (usually 30 seconds to 3 minutes)
- System may terminate for resources
- Not suitable for continuous long-running tasks
- Use for: short downloads, cleanup, state saving

## 2. Core Motion Module

### Overview
Core Motion provides access to hardware sensors: accelerometer, gyroscope, magnetometer, and more.

**Requirements**:
- Add module to `tiapp.xml`:
```xml
<modules>
  <module platform="iphone">ti.coremotion</module>
</modules>
```

- **Can only test on device** - not simulator
- Motion Activity permission required for Activity API

### Basic Workflow

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
Accelerometer.setAccelerometerUpdateInterval(1000);  // 1 second
Accelerometer.startAccelerometerUpdates(function(e) {
  if (e.success) {
    var data = e.acceleration;
    Ti.API.info('X: ' + data.x + ' Y: ' + data.y + ' Z: ' + data.z);
  }
});
```

4. Stop when done:
```javascript
Accelerometer.stopAccelerometerUpdates();
```

### Coordinate System
Hold device in portrait mode, screen facing you:
- **X-axis**: Width (positive = right, negative = left)
- **Y-axis**: Height (positive = up, negative = down)
- **Z-axis**: Through screen (positive = toward screen, negative = behind)

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

**Use for**: Shake detection, device orientation, movement detection.

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

**Use for**: Rotation gestures, 3D motion tracking, enhanced UI.

### Magnetometer

Measures magnetic field strength (microteslas). Acts as digital compass.

```javascript
var Magnetometer = CoreMotion.createMagnetometer();

if (Magnetometer.isMagnetometerAvailable()) {
  Magnetometer.startMagnetometerUpdates();
  // Or poll manually:
  var data = Magnetometer.getMagnetometerData();
  Ti.API.info('Magnetic field: ' + JSON.stringify(data.magneticField));
}
```

**Use for**: Compass direction, magnetic field detection.

### Device Motion

Combines accelerometer, gyroscope, magnetometer for attitude and user acceleration.

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
      function(e) {
        if (e.success) {
          // Attitude: orientation (pitch, roll, yaw)
          var attitude = e.attitude;
          Ti.API.info('Pitch: ' + attitude.pitch + ' Roll: ' + attitude.roll + ' Yaw: ' + attitude.yaw);

          // User acceleration: force applied by user (not gravity)
          var userAccel = e.userAcceleration;
        }
      }
    );
  }
}
```

**Attitude formats**:
- Pitch/Roll/Yaw (Euler angles)
- Quaternion (w, x, y, z)
- Rotation Matrix (m11-m33)

**Reference Frames**:
- `ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_Z_VERTICAL` - Default
- `ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_CORRECTED_Z_VERTICAL` - Uses magnetometer for yaw
- `ATTITUDE_REFERENCE_FRAME_X_MAGNETIC_NORTH_Z_VERTICAL` - Magnetic north
- `ATTITUDE_REFERENCE_FRAME_X_TRUE_NORTH_Z_VERTICAL` - True north (requires location)

### Activity API

Determines user's motion activity (walking, running, automotive, stationary).

```javascript
var MotionActivity = CoreMotion.createMotionActivity();

MotionActivity.startActivityUpdates(function(e) {
  var activity = e.activity;

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

**Query historical activity**:
```javascript
var endDate = new Date();
var startDate = new Date(endDate.getTime() - 60 * 60 * 1000);  // 1 hour ago

MotionActivity.queryActivity({
  start: startDate,
  end: endDate
}, function(e) {
  var activities = e.activities;
  // Process historical data
});
```

**Requires Motion Activity permission** in tiapp.xml:
```xml
<key>NSMotionUsageDescription</key>
<string>Need motion data for fitness tracking</string>
```

### Pedometer

Counts steps, distance, floors ascended/descended.

```javascript
var Pedometer = CoreMotion.createPedometer();

if (Pedometer.isStepCountingAvailable()) {
  // Start live updates
  Pedometer.startPedometerUpdates({
    start: new Date(new Date().getTime() - 60 * 60 * 1000)  // From 1 hour ago
  }, function(e) {
    Ti.API.info('Steps: ' + e.numberOfSteps);
    Ti.API.info('Distance: ' + e.distance + ' meters');
    Ti.API.info('Floors up: ' + e.floorsAscended);
    Ti.API.info('Floors down: ' + e.floorsDescended);
  });
}

// Query historical data
var endDate = new Date();
var startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);  // 24 hours ago

Pedometer.queryPedometerData({
  start: startDate,
  end: endDate
}, function(e) {
  Ti.API.info('Steps in last 24h: ' + e.numberOfSteps);
});
```

**Use for**: Fitness apps, step challenges, activity tracking.

### Core Motion Best Practices

1. **Always check availability** - Not all devices have all sensors
2. **Set appropriate update intervals** - High frequency = more CPU/battery
3. **Stop updates when not needed** - Conserve battery
4. **Handle errors gracefully** - Sensor may fail or be unavailable
5. **Test on physical device** - Sensors don't work in simulator

## 3. Spotlight Search

### Overview
Spotlight Search allows iOS to index your app's content, making it searchable from the home screen.

### Creating Searchable Items

```javascript
var SearchableItem = Ti.App.iOS.SearchableItem;

var item1 = SearchableItem.createSearchableItem({
  uniqueIdentifier: 'article-123',
  domainIdentifier: 'articles',
  title: 'Titanium SDK Guide',
  contentDescription: 'Complete guide to Titanium SDK development',
  thumbnail: articleThumbnailImage,  // Ti.Blob
  keywords: ['titanium', 'mobile', 'javascript', 'ios', 'android']
});

var item2 = SearchableItem.createSearchableItem({
  uniqueIdentifier: 'product-456',
  domainIdentifier: 'products',
  title: 'Product Name',
  contentDescription: 'Product description here',
  keywords: ['product', 'shopping']
});
```

### Indexing Items

```javascript
var SearchableIndex = Ti.App.iOS.SearchableIndex;

SearchableIndex.indexSearchableItems([item1, item2], function(e) {
  if (e.success) {
    Ti.API.info('Indexing successful');
  } else {
    Ti.API.error('Indexing failed: ' + e.error);
  }
});
```

### Deleting from Index

```javascript
// Delete specific items
SearchableIndex.deleteSearchableItemsWithIdentifiers(['article-123'], function(e) {
  if (e.success) {
    Ti.API.info('Deleted successfully');
  }
});

// Delete all items in domain
SearchableIndex.deleteSearchableItemsWithDomainIdentifiers(['articles'], function(e) {
  if (e.success) {
    Ti.API.info('Deleted all articles');
  }
});

// Delete all
SearchableIndex.deleteAllSearchableItems(function(e) {
  if (e.success) {
    Ti.API.info('Cleared index');
  }
});
```

### Handling Search Results

When user taps a Spotlight result, your app opens with the `continueactivity` event:

```javascript
Ti.App.iOS.addEventListener('continueactivity', function(e) {
  if (e.activityType === 'com.apple.core SpotlightQuery') {
    var identifier = e.userInfo.identifier;
    var domain = e.userInfo.domainIdentifier;

    Ti.API.info('Spotlight search selected: ' + identifier);

    // Navigate to appropriate content
    if (domain === 'articles') {
      openArticle(identifier);
    } else if (domain === 'products') {
      openProduct(identifier);
    }
  }
});
```

**Important**: Use `NSUserActivityTypes` in tiapp.xml to declare supported activity types.

### Best Practices

1. **Index relevant content** - Don't index everything
2. **Use meaningful keywords** - Help users find content
3. **Provide thumbnails** - Improve visual recognition
4. **Keep index updated** - Re-index when content changes
5. **Delete obsolete items** - Don't clutter search results

## 4. Handoff User Activities

### Overview
Handoff allows users to start an activity on one device and continue on another (iPhone, iPad, Mac).

### Creating User Activities

```javascript
var UserActivity = Ti.App.iOS.createUserActivity({
  activityType: 'com.myapp.reading-article',
  title: 'Reading: Titanium SDK Guide',
  userInfo: {
    articleId: '123',
    scrollPosition: 450
  },
  webpageURL: 'https://myapp.com/articles/123'  // For web fallback
});

// Mark as current activity
UserActivity.becomeCurrent();
```

### Handling Incoming Handoff

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

### Invalidating Activities

```javascript
// When user closes article
UserActivity.invalidate();
```

### Declaring Activity Types in tiapp.xml

```xml
<key>NSUserActivityTypes</key>
<array>
  <string>com.myapp.reading-article</string>
  <string>com.myapp.editing-document</string>
  <string>com.myapp.viewing-product</string>
</array>
```

## 5. iCloud Services

### Keychain Storage

Securely sync small pieces of data (passwords, tokens) across user's devices.

```javascript
// Store value
Ti.App.iOS.setKeychainItem('username', 'john@example.com');
Ti.App.iOS.setKeychainItem('authToken', 'abc123token');

// Retrieve value
var username = Ti.App.iOS.getKeychainItem('username');

// Remove value
Ti.App.iOS.removeKeychainItem('authToken');
```

**Use for**: Syncing user credentials, preferences, small data.

**Requires** iCloud capability enabled in Xcode project.

### Document Picker

Access iCloud Drive or other document providers.

```javascript
var DocumentPicker = Ti.UI.iOS.createDocumentPicker({
  mode: Ti.UI.iOS.DOCUMENT_PICKER_MODE_OPEN
});

DocumentPicker.addEventListener('select', function(e) {
  var url = e.url;  // File URL
  Ti.API.info('Selected: ' + url);

  // Read file
  var file = Ti.Filesystem.getFile(url);
  var contents = file.read();
});

DocumentPicker.addEventListener('cancel', function(e) {
  Ti.API.info('Document picker canceled');
});

// Show picker
DocumentPicker.show();
```

**Modes**:
- `DOCUMENT_PICKER_MODE_OPEN` - Open existing document
- `DOCUMENT_PICKER_MODE_EXPORT` - Export to document provider
- `DOCUMENT_PICKER_MODE_IMPORT` - Import copy of document
- `DOCUMENT_PICKER_MODE_MOVE` - Move document to app's sandbox

### CloudKit

For more complex iCloud data sync, consider using CloudKit modules or Hyperloop.

## 6. WatchKit Integration

### Overview
Integrate Apple Watch apps built in Xcode with Titanium app.

### Integration Steps

1. **Create WatchKit app** in Xcode
2. **Add App Group** to both iOS and Watch targets
3. **Use App Group** for shared data:

```javascript
// In Titanium app, use App Group container
var container = 'group.com.myapp.shared';
var sharedDefaults = Ti.App.iOS.createUserDefaults({ suiteName: container });

sharedDefaults.setString('watchData', JSON.stringify(data));
```

4. **Watch app reads shared data** using same App Group container

### Watch Connectivity

For bidirectional communication, use Watch Connectivity framework via Hyperloop or modules.

## 7. SiriKit Integration

### Overview
SiriKit allows your app to handle specific intents via Siri voice commands.

### Supported Intents (iOS 10+)
- Messaging (send/read messages)
- Payments (send/request money)
- Workouts (start/stop/pause/resume)
- Rides (book ride)
- Photo (search/send photos)
- VoIP calling

### Implementation

Requires native module or Hyperloop to implement Intent Extension.

**Basic steps**:
1. Define supported intents in tiapp.xml
2. Create Intent Extension in Xcode
3. Handle intents in extension code
4. Provide UI for Siri interaction

### Voice Shortcuts (iOS 12+)

Add custom voice shortcuts for app actions:

```javascript
var INVoiceShortcut = Ti.UI.iOS.createINVoiceShortcut({
  phrase: 'Open My Article',
  activityType: 'com.myapp.reading-article',
  userInfo: { articleId: '123' }
});

// Present to user for recording
INVoiceShortcut.present();
```

## 8. Additional iOS Features

### 3D Touch (Force Touch)

```javascript
// Check for 3D Touch support
if (Ti.Platform.forceTouchSupported) {
  view.addEventListener('touchstart', function(e) {
    var force = e.force || 0;
    var maxForce = e.maximumForce || 1;

    if (force / maxForce > 0.75) {
      // Deep press - show quick actions
      showQuickActions();
    }
  });
}
```

### Haptic Feedback

```javascript
// Generate haptic feedback
var generator = Ti.UI.iOS.createHapticFeedbackGenerator();

// Impact feedback (light, medium, heavy)
generator.impactOccurred(Ti.UI.iOS.HAPTIC_FEEDBACK_IMPACT_STYLE_MEDIUM);

// Selection feedback
generator.selectionChanged();

// Notification feedback (success, warning, error)
generator.notificationOccurred(Ti.UI.iOS.HAPTIC_FEEDBACK_NOTIFICATION_TYPE_SUCCESS);
```

### Document Interaction

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

## Best Practices Summary

1. **Background Services**: Use sparingly, stop when done
2. **Core Motion**: Always check availability, test on device
3. **Spotlight**: Index content as it changes
4. **Handoff**: Provide web URL fallback
5. **iCloud**: Use for small synced data, not large files
6. **SiriKit**: Requires native extension, use only if beneficial
7. **Permissions**: Always include usage descriptions in tiapp.xml
8. **Testing**: Many features require physical device testing
