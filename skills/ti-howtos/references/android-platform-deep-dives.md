# Android Platform Deep Dives

## Table of Contents

- [Android Platform Deep Dives](#android-platform-deep-dives)
  - [Table of Contents](#table-of-contents)
  - [1. Android Intent Filters (Advanced)](#1-android-intent-filters-advanced)
    - [Critical Step: Copy Root Activity](#critical-step-copy-root-activity)
    - [Retrieving Intent Data](#retrieving-intent-data)
  - [2. Broadcast Intents with Permissions](#2-broadcast-intents-with-permissions)
    - [Sending with Permission](#sending-with-permission)
    - [Declaring Permission in tiapp.xml](#declaring-permission-in-tiappxml)
  - [3. FusedLocationProvider (TiSDK 7.1.0+)](#3-fusedlocationprovider-tisdk-710)
  - [4. Android Intents](#4-android-intents)
    - [Overview](#overview)
    - [Intent Structure](#intent-structure)
    - [Creating Intents](#creating-intents)
      - [Simple Intent (Action only)](#simple-intent-action-only)
      - [Intent with Action and Data](#intent-with-action-and-data)
      - [Intent with Extras](#intent-with-extras)
    - [Common Use Cases](#common-use-cases)
      - [Open URL in Browser](#open-url-in-browser)
      - [Dial Phone Number](#dial-phone-number)
      - [Send Email](#send-email)
      - [Share Content](#share-content)
      - [Open PDF File](#open-pdf-file)
    - [Starting Other Apps](#starting-other-apps)
  - [2. Intent Filters](#2-intent-filters)
    - [Overview](#overview-1)
    - [Configuring in tiapp.xml](#configuring-in-tiappxml)
    - [Handling Incoming Intents](#handling-incoming-intents)
      - [Get Intent Data on Startup](#get-intent-data-on-startup)
      - [Listen for New Intents (Activity Restart)](#listen-for-new-intents-activity-restart)
    - [Deep Linking Example](#deep-linking-example)
  - [3. Broadcast Intents and Receivers](#3-broadcast-intents-and-receivers)
    - [Overview](#overview-2)
    - [System Broadcasts](#system-broadcasts)
    - [Registering Broadcast Receivers](#registering-broadcast-receivers)
      - [Dynamic Registration (in code)](#dynamic-registration-in-code)
      - [Network Change Listener](#network-change-listener)
    - [Sending Custom Broadcasts](#sending-custom-broadcasts)
      - [Receiver for Custom Broadcast](#receiver-for-custom-broadcast)
    - [Boot Receiver](#boot-receiver)
  - [4. Android Services](#4-android-services)
    - [Overview](#overview-3)
    - [Service Types](#service-types)
    - [Creating a Service](#creating-a-service)
    - [IntentService](#intentservice)
    - [Foreground Service](#foreground-service)
    - [Service Lifecycle Management](#service-lifecycle-management)
    - [Inter-Service Communication](#inter-service-communication)
  - [5. Android Permissions](#5-android-permissions)
    - [Runtime Permissions (Android 6.0+)](#runtime-permissions-android-60)
    - [Common Dangerous Permissions](#common-dangerous-permissions)
  - [Best Practices](#best-practices)
    - [Common Dangerous Permissions](#common-dangerous-permissions-1)
  - [Best Practices](#best-practices-1)

---

## 1. Android Intent Filters (Advanced)

To allow your app to receive implicit intents (e.g., opening a PDF file or a web link), you must register the filter in the manifest.

### Critical Step: Copy Root Activity
Before declaring an `intent-filter`, you must copy the `<activity>` node of your main activity from `build/android/AndroidManifest.xml` to the `<android>` section of your `tiapp.xml`:

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
        <application>
            <!-- Copy this from build/android/AndroidManifest.xml -->
            <activity android:name=".YourAppActivity" android:label="My App" android:configChanges="keyboardHidden|orientation">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN" />
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>

                <!-- Your new filter here -->
                <intent-filter android:label="Open with My App">
                    <action android:name="android.intent.action.VIEW" />
                    <category android:name="android.intent.category.DEFAULT" />
                    <data android:mimeType="application/pdf" />
                </intent-filter>
            </activity>
        </application>
    </manifest>
</android>
```

### Retrieving Intent Data
```javascript
const intent = Ti.Android.currentActivity.getIntent();
if (intent.hasExtra(Ti.Android.EXTRA_TEXT)) {
    const sharedText = intent.getStringExtra(Ti.Android.EXTRA_TEXT);
}
```

## 2. Broadcast Intents with Permissions

You can restrict who receives your broadcast messages for enhanced security.

### Sending with Permission
```javascript
const intent = Ti.Android.createBroadcastIntent({
    action: 'com.mycompany.SECURE_ACTION'
});
// Only apps with the permission 'com.mycompany.SPECIAL_PERMISSION' will receive it
Ti.Android.currentActivity.sendBroadcastWithPermission(intent, 'com.mycompany.SPECIAL_PERMISSION');
```

### Declaring Permission in tiapp.xml
```xml
<android>
    <manifest>
        <permission android:name="com.mycompany.SPECIAL_PERMISSION" />
        <uses-permission android:name="com.mycompany.SPECIAL_PERMISSION" />
    </manifest>
</android>
```

## 3. FusedLocationProvider (TiSDK 7.1.0+)

For battery-efficient location tracking on Android, use the "fused" provider.

**Requirement**: Include the `ti.playservices` module in your project.
```xml
<module platform="android">ti.playservices</module>
```
Titanium will automatically switch to Google Play Services for geolocation, optimizing power consumption.

## 4. Android Intents

### Overview
Intents are message objects that specify actions to perform. They can start activities, broadcasts, or services.

### Intent Structure
- **Action**: What to do (e.g., `ACTION_VIEW`, `ACTION_SEND`)
- **Data**: URI operating on (e.g., URL, file path)
- **Type**: MIME type of data
- **Category**: Additional categorization
- **Extras**: Key-value pairs for additional data

### Creating Intents

#### Simple Intent (Action only)
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW
});
```

#### Intent with Action and Data
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  data: 'https://www.appcelerator.com'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Intent with Extras
```javascript
const intent = Ti.Android.createIntent({
  action: 'com.example.MY_ACTION',
  type: 'text/plain'
});
intent.addExtra('message', 'Hello from Titanium');
intent.addExtra('count', 42);
```

### Common Use Cases

#### Open URL in Browser
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  data: 'https://www.example.com'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Dial Phone Number
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_DIAL,
  data: 'tel:5551234'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Send Email
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SENDTO,
  data: 'mailto:user@example.com'
});
intent.addExtra(Ti.Android.EXTRA_SUBJECT, 'Hello');
intent.addExtra(Ti.Android.EXTRA_TEXT, 'Email body');
Ti.Android.currentActivity.startActivity(intent);
```

#### Share Content
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SEND,
  type: 'text/plain'
});
intent.addExtra(Ti.Android.EXTRA_TEXT, 'Check this out!');
Ti.Android.currentActivity.startActivity(intent);
```

#### Open PDF File
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  type: 'application/pdf',
  data: file.nativePath  // Ti.Filesystem.File object
});
intent.addFlags(Ti.Android.FLAG_GRANT_READ_URI_PERMISSION);
Ti.Android.currentActivity.startActivity(intent);
```

### Starting Other Apps
```javascript
// Open specific app by package name
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_MAIN,
  packageName: 'com.example.anotherapp',
  className: 'com.example.anotherapp.MainActivity'
});
try {
  Ti.Android.currentActivity.startActivity(intent);
} catch (e) {
  Ti.API.error(`App not installed: ${e.message}`);
}
```

## 2. Intent Filters

### Overview
Intent Filters advertise your app's capability to handle certain actions and data types. Enable deep linking, file handling, and inter-app communication.

### Configuring in tiapp.xml

```xml
<android>
  <manifest>
    <application>
      <activity>
        <intent-filter>
          <action android:name="android.intent.action.VIEW"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <category android:name="android.intent.category.BROWSABLE"/>
          <data android:scheme="myapp"/>
        </intent-filter>

        <!-- Handle PDF files -->
        <intent-filter>
          <action android:name="android.intent.action.VIEW"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <data android:mimeType="application/pdf"/>
        </intent-filter>

        <!-- Handle HTTP URLs -->
        <intent-filter>
          <action android:name="android.intent.action.VIEW"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <category android:name="android.intent.category.BROWSABLE"/>
          <data android:scheme="http" android:host="www.example.com"/>
        </intent-filter>
      </activity>
    </application>
  </manifest>
</android>
```

### Handling Incoming Intents

#### Get Intent Data on Startup
```javascript
const activity = Ti.Android.currentActivity;
const intent = activity.getIntent();

if (intent) {
  const action = intent.getAction();
  const data = intent.getData();

  if (data) {
    Ti.API.info(`Received data: ${data}`);
    // Handle URL or file path
  }

  // Get extras
  const extra = intent.getStringExtra('key');
  Ti.API.info(`Extra value: ${extra}`);
}
```

#### Listen for New Intents (Activity Restart)
```javascript
Ti.Android.currentActivity.addEventListener('newintent', (e) => {
  const intent = e.intent;
  const data = intent.getData();
  Ti.API.info(`New intent received: ${data}`);

  // Handle the new intent
  handleDeepLink(data);
});
```

### Deep Linking Example

```xml
<!-- In tiapp.xml -->
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="myapp" android:host="product"/>
</intent-filter>
```

```javascript
// In app.js
function handleDeepLink(url) {
  // Parse URL like: myapp://product/123
  const parts = url.split('/');
  const productId = parts[parts.length - 1];
  openProductScreen(productId);
}

// Check on startup
const activity = Ti.Android.currentActivity;
const intent = activity.getIntent();
if (intent && intent.getData()) {
  handleDeepLink(intent.getData());
}
```

## 3. Broadcast Intents and Receivers

### Overview
Broadcast Intents allow system-wide or app-wide messaging. Apps can send broadcasts and register receivers to listen for them.

### System Broadcasts

Common system broadcasts:
- `android.intent.action.BATTERY_LOW` - Battery low warning
- `android.intent.action.BATTERY_CHANGED` - Battery status changed
- `android.intent.action.ACTION_POWER_CONNECTED` - Power connected
- `android.intent.action.ACTION_POWER_DISCONNECTED` - Power disconnected
- `android.intent.action.BOOT_COMPLETED` - System boot completed
- `android.net.conn.CONNECTIVITY_CHANGE` - Network connection changed
- `android.intent.action.USER_PRESENT` - User unlocked device
- `android.intent.action.PACKAGE_INSTALL` / `PACKAGE_REMOVED` - Package changes

### Registering Broadcast Receivers

#### Dynamic Registration (in code)

```javascript
// Create receiver
const batteryReceiver = Ti.Android.createBroadcastReceiver({
  onReceived: (e) => {
    const level = e.intent.getIntExtra(Ti.Android.EXTRA_BATTERY_LEVEL, -1);
    Ti.API.info(`Battery level: ${level}%`);

    if (level < 20) {
      showLowBatteryWarning();
    }
  }
});

// Register for battery low
Ti.Android.registerBroadcastReceiver(batteryReceiver, [
  Ti.Android.ACTION_BATTERY_LOW
]);

// Later: Unregister when no longer needed
Ti.Android.unregisterBroadcastReceiver(batteryReceiver);
```

#### Network Change Listener

```javascript
const networkReceiver = Ti.Android.createBroadcastReceiver({
  onReceived: (e) => {
    const connectivityManager = Ti.Android.getSystemService(
      Ti.Android.CONNECTIVITY_SERVICE
    );
    const networkInfo = connectivityManager.getActiveNetworkInfo();

    if (networkInfo && networkInfo.isConnected()) {
      Ti.API.info(`Network connected: ${networkInfo.getTypeName()}`);
      // Retry pending operations
    } else {
      Ti.API.info('Network disconnected');
      // Show offline mode
    }
  }
});

Ti.Android.registerBroadcastReceiver(networkReceiver, [
  'android.net.conn.CONNECTIVITY_CHANGE'
]);
```

### Sending Custom Broadcasts

```javascript
// Send broadcast within your app
const intent = Ti.Android.createIntent({
  action: 'com.myapp.CUSTOM_EVENT'
});
intent.addExtra('data', 'Custom data here');
Ti.Android.currentActivity.sendBroadcast(intent);
```

#### Receiver for Custom Broadcast

```javascript
const customReceiver = Ti.Android.createBroadcastReceiver({
  onReceived: (e) => {
    const data = e.intent.getStringExtra('data');
    Ti.API.info(`Received custom event: ${data}`);
  }
});

Ti.Android.registerBroadcastReceiver(customReceiver, [
  'com.myapp.CUSTOM_EVENT'
]);
```

### Boot Receiver

**In tiapp.xml**:
```xml
<android>
  <manifest>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <application>
      <receiver
        android:name="com.myapp.BootReceiver"
        android:enabled="true">
        <intent-filter>
          <action android:name="android.intent.action.BOOT_COMPLETED"/>
        </intent-filter>
      </receiver>
    </application>
  </manifest>
</android>
```

## 4. Android Services

### Overview
Services are background components that run independently of the UI. Useful for long-running operations like music playback, location tracking, or network polling.

### Service Types

1. **Regular Service**: Runs in background until stopped
2. **IntentService**: Queues work requests and processes sequentially
3. **Foreground Service**: Shows persistent notification, higher priority

### Creating a Service

```javascript
// Create service
const service = Ti.Android.createService({
  url: 'myservice.js',
  interval: 60000  // Check every 60 seconds
});

// Start service
service.start();

// Stop service when done
service.stop();
```

**myservice.js**:
```javascript
Ti.API.info('Service running');

// Perform work
const xhr = Ti.Network.createHTTPClient({
  onload: () => {
    Ti.API.info('Data updated');
    // Send notification if needed
  }
});
xhr.open('GET', 'https://api.example.com/update');
xhr.send();
```

### IntentService

For one-off or queued work:

```javascript
const intent = Ti.Android.createServiceIntent({
  url: 'backgroundtask.js'
});

// Start service (runs once and stops)
Ti.Android.startService(intent);
```

**backgroundtask.js**:
```javascript
// Do work
const result = processHeavyTask();

// Optionally send result back to activity
const broadcast = Ti.Android.createBroadcastReceiver({
  onReceived: () => { /* ... */ }
});
// ...
```

### Foreground Service

For critical, long-running operations (must show notification):

```javascript
const notification = Ti.Android.createNotification({
  contentTitle: 'Service Running',
  contentText: 'Tracking location...',
  tickerText: 'Service started',
  icon: Ti.App.Android.R.drawable.app_icon
});

const intent = Ti.Android.createServiceIntent({
  url: 'trackingservice.js'
});

intent.addFlags(Ti.Android.FLAG_ACTIVITY_CLEAR_TOP);
intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

// Start as foreground service
Ti.Android.startForegroundService(intent, 101, notification);
```

To stop:
```javascript
Ti.Android.stopForegroundService(intent);
```

### Service Lifecycle Management

**Important**: Always stop services when no longer needed to conserve resources.

```javascript
// In activity
Ti.Android.currentActivity.addEventListener('pause', () => {
  // Optionally pause service
});

Ti.Android.currentActivity.addEventListener('destroy', () => {
  // Always stop service
  if (service) {
    service.stop();
    service = null;
  }
});
```

### Inter-Service Communication

```javascript
// From activity to service
const intent = Ti.Android.createServiceIntent({
  url: 'myservice.js'
});
intent.addExtra('command', 'pause');
Ti.Android.startService(intent);

// In service
const command = intent.getStringExtra('command');
if (command === 'pause') {
  // Handle pause command
}
```

## 5. Android Permissions

### Runtime Permissions (Android 6.0+)

Dangerous permissions require runtime request:

```javascript
function checkPermission() {
  const result = Ti.Android.checkSelfPermission(
    Ti.Android.PERMISSION_ACCESS_FINE_LOCATION
  );

  if (result === Ti.Android.RESULTS.GRANTED) {
    startLocationTracking();
  } else {
    Ti.Android.requestPermissions(
      [Ti.Android.PERMISSION_ACCESS_FINE_LOCATION],
      999,  // Request code
      (e) => {
        if (e.granted[0] === true) {
          startLocationTracking();
        } else {
          alert('Location permission denied');
        }
      }
    );
  }
}

checkPermission();
```

### Common Dangerous Permissions
- `ACCESS_FINE_LOCATION` - GPS location
- `ACCESS_COARSE_LOCATION` - Network location
- `CAMERA` - Camera access
- `READ_EXTERNAL_STORAGE` - Read files
- `WRITE_EXTERNAL_STORAGE` - Write files
- `RECORD_AUDIO` - Microphone
- `CALL_PHONE` - Make phone calls
- `SEND_SMS` / `READ_SMS` - SMS access

## Best Practices

1. **Always unregister** broadcast receivers when no longer needed
2. **Stop services** explicitly to conserve battery
3. **Use IntentService** for one-off background tasks
4. **Use foreground services** for user-visible long operations
5. **Handle runtime permissions** gracefully on Android 6.0+
6. **Validate intent data** before processing
7. **Use proper Intent Flags** for navigation behavior
8. **Test intent filters** with ADB: `adb shell am start -W -a android.intent.action.VIEW -d "myapp://path"`

### Common Dangerous Permissions
- `ACCESS_FINE_LOCATION` - GPS location
- `ACCESS_COARSE_LOCATION` - Network location
- `CAMERA` - Camera access
- `READ_EXTERNAL_STORAGE` - Read files
- `WRITE_EXTERNAL_STORAGE` - Write files
- `RECORD_AUDIO` - Microphone
- `CALL_PHONE` - Make phone calls
- `SEND_SMS` / `READ_SMS` - SMS access

## Best Practices

1. **Always unregister** broadcast receivers when no longer needed
2. **Stop services** explicitly to conserve battery
3. **Use IntentService** for one-off background tasks
4. **Use foreground services** for user-visible long operations
5. **Handle runtime permissions** gracefully on Android 6.0+
6. **Validate intent data** before processing
7. **Use proper Intent Flags** for navigation behavior
8. **Test intent filters** with ADB: `adb shell am start -W -a android.intent.action.VIEW -d "myapp://path"`
