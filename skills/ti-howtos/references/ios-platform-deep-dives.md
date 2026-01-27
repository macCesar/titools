# iOS Platform Deep Dives

## Table of Contents

- [iOS Platform Deep Dives](#ios-platform-deep-dives)
  - [Table of Contents](#table-of-contents)
  - [1. iOS 17+ Privacy Requirements (Critical)](#1-ios-17-privacy-requirements-critical)
    - [PrivacyInfo.xcprivacy File](#privacyinfoxcprivacy-file)
  - [2. Background Services \& Silent Push](#2-background-services--silent-push)
    - [Overview](#overview)
    - [Silent Push (Background Update)](#silent-push-background-update)
  - [3. iCloud Services \& Backup Control](#3-icloud-services--backup-control)
    - [Disable Individual Backup (Best Practice)](#disable-individual-backup-best-practice)
    - [Recursive Folder Backup Disable](#recursive-folder-backup-disable)
  - [4. WatchKit \& Ti.WatchSession](#4-watchkit--tiwatchsession)
    - [Activate Session](#activate-session)
    - [Send Message (Immediate)](#send-message-immediate)
    - [Receive Data from Watch](#receive-data-from-watch)
  - [5. SiriKit \& Siri Intents](#5-sirikit--siri-intents)
    - [Configuration in tiapp.xml](#configuration-in-tiappxml)
    - [Siri Extensions](#siri-extensions)
  - [6. Spotlight Search (Core Spotlight)](#6-spotlight-search-core-spotlight)
  - [7. Core Motion Module](#7-core-motion-module)
    - [Overview](#overview-1)
    - [Basic Workflow](#basic-workflow)
    - [Coordinate System](#coordinate-system)
    - [Accelerometer](#accelerometer)
    - [Gyroscope](#gyroscope)
    - [Magnetometer](#magnetometer)
    - [Device Motion](#device-motion)
    - [Activity API](#activity-api)
    - [Pedometer](#pedometer)
    - [Core Motion Best Practices](#core-motion-best-practices)
  - [3. Spotlight Search](#3-spotlight-search)
    - [Overview](#overview-2)
    - [Creating Searchable Items](#creating-searchable-items)
    - [Indexing Items](#indexing-items)
    - [Deleting from Index](#deleting-from-index)
    - [Handling Search Results](#handling-search-results)
    - [Best Practices](#best-practices)
  - [8. Handoff User Activities](#8-handoff-user-activities)
    - [Handling Incoming Handoff](#handling-incoming-handoff)
    - [Invalidating Activities](#invalidating-activities)
    - [Declaring Activity Types in tiapp.xml](#declaring-activity-types-in-tiappxml)
  - [5. iCloud Services](#5-icloud-services)
    - [Keychain Storage](#keychain-storage)
    - [Document Picker](#document-picker)
    - [CloudKit](#cloudkit)
  - [6. WatchKit Integration](#6-watchkit-integration)
    - [Overview](#overview-3)
    - [Integration Steps](#integration-steps)
    - [Watch Connectivity](#watch-connectivity)
  - [7. SiriKit Integration](#7-sirikit-integration)
    - [Overview](#overview-4)
    - [Supported Intents (iOS 10+)](#supported-intents-ios-10)
    - [Implementation](#implementation)
    - [Voice Shortcuts (iOS 12+)](#voice-shortcuts-ios-12)
  - [8. Additional iOS Features](#8-additional-ios-features)
    - [3D Touch (Force Touch)](#3d-touch-force-touch)
    - [Haptic Feedback](#haptic-feedback)
    - [Document Interaction](#document-interaction)
  - [Best Practices Summary](#best-practices-summary)

---

## 1. iOS 17+ Privacy Requirements (Critical)
Apple requires declaring the use of certain APIs to prevent "fingerprinting".

### PrivacyInfo.xcprivacy File
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
*Common categories: `UserDefaults` (Ti.App.Properties), `FileTimestamp` (file.createdAt), `SystemBootTime`.*

## 2. Background Services & Silent Push

### Overview
iOS allows limited background execution. For large downloads, use the `com.appcelerator.urlSession` module.

### Silent Push (Background Update)
Allows waking up the app to download content without showing a notification to the user.

**tiapp.xml**:
```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

**app.js**:
```javascript
Ti.App.iOS.addEventListener('silentpush', (e) => {
    // Start download or update
    Ti.API.info(`Data received: ${JSON.stringify(e)}`);
    
    // Mandatory to call upon completion (max 30 seconds)
    Ti.App.iOS.endBackgroundHandler(e.handlerId);
});
```

## 3. iCloud Services & Backup Control

### Disable Individual Backup (Best Practice)
Apple rejects apps that upload unnecessary data to iCloud. Disable backup for temporary or recreatable files.

```javascript
const file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'cache.dat');
file.remoteBackup = false; // Prevents upload to iCloud/iTunes
```

### Recursive Folder Backup Disable
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

## 4. WatchKit & Ti.WatchSession

For watchOS 2+, use `Ti.WatchSession` for bidirectional communication.

### Activate Session
```javascript
if (Ti.WatchSession.isSupported) {
    Ti.WatchSession.activateSession();
}
```

### Send Message (Immediate)
```javascript
if (Ti.WatchSession.isReachable) {
    Ti.WatchSession.sendMessage({
        orderId: '123',
        status: 'shipped'
    });
}
```

### Receive Data from Watch
```javascript
Ti.WatchSession.addEventListener('receivemessage', (e) => {
    Ti.API.info(`Message from Watch: ${e.message}`);
});
```

## 5. SiriKit & Siri Intents

Allows your app to respond to Siri voice commands (Messaging, Payments, Workouts).

### Configuration in tiapp.xml
```xml
<key>NSSiriUsageDescription</key>
<string>Siri will use your voice to send messages in this app.</string>
```

### Siri Extensions
Requires creating an **Intents Extension** in Xcode and adding it to the `extensions/` folder of your project. Then register it in `tiapp.xml`:
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

## 6. Spotlight Search (Core Spotlight)

Indexes your app's content to appear in global iOS search results.

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

## 7. Core Motion Module

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

```javascript
const Pedometer = CoreMotion.createPedometer();


if (Pedometer.isStepCountingAvailable()) {
  // Start live updates
  Pedometer.startPedometerUpdates({
    start: new Date(new Date().getTime() - (60 * 60 * 1000))  // From 1 hour ago
  }, (e) => {
    Ti.API.info(`Steps: ${e.numberOfSteps}`);
    Ti.API.info(`Distance: ${e.distance} meters`);
    Ti.API.info(`Floors up: ${e.floorsAscended}`);
    Ti.API.info(`Floors down: ${e.floorsDescended}`);
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

## 8. Handoff User Activities

```javascript
const UserActivity = Ti.App.iOS.createUserActivity({
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

```javascript
const DocumentPicker = Ti.UI.iOS.createDocumentPicker({
  mode: Ti.UI.iOS.DOCUMENT_PICKER_MODE_OPEN
});

DocumentPicker.addEventListener('select', (e) => {
  const url = e.url;  // File URL
  Ti.API.info(`Selected: ${url}`);

  // Read file
  const file = Ti.Filesystem.getFile(url);
  const contents = file.read();
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

### Haptic Feedback

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
