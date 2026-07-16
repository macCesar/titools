# Android platform deep dives

## 1. Android intent filters (advanced)

To receive implicit intents (for example, opening a PDF file or a web link), register a filter in the manifest.

### Critical step: copy root activity
Before declaring an `intent-filter`, copy the `<activity>` node of your main activity from `build/android/AndroidManifest.xml` into the `<android>` section of your `tiapp.xml`:

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

### Retrieving intent data
```javascript
const intent = Ti.Android.currentActivity.getIntent();
if (intent.hasExtra(Ti.Android.EXTRA_TEXT)) {
  const sharedText = intent.getStringExtra(Ti.Android.EXTRA_TEXT);
}
```

## 2. Broadcast intents with permissions

You can restrict which apps receive your broadcast messages.

### Sending with permission
```javascript
const intent = Ti.Android.createBroadcastIntent({
  action: 'com.mycompany.SECURE_ACTION'
});
// Only apps with the permission 'com.mycompany.SPECIAL_PERMISSION' will receive it
Ti.Android.currentActivity.sendBroadcastWithPermission(intent, 'com.mycompany.SPECIAL_PERMISSION');
```

### Declaring permission in tiapp.xml
```xml
<android>
    <manifest>
        <permission android:name="com.mycompany.SPECIAL_PERMISSION" />
        <uses-permission android:name="com.mycompany.SPECIAL_PERMISSION" />
    </manifest>
</android>
```

## 3. FusedLocationProvider (TiSDK 7.1.0+)

For battery-efficient location tracking on Android, use the fused provider.

Requirement: include the `ti.playservices` module in your project.
```xml
<module platform="android">ti.playservices</module>
```
Titanium will switch to Google Play Services for geolocation, which reduces power consumption.

## 4. Android intents

### Overview
Intents are message objects that specify actions to perform. They can start activities, broadcasts, or services.

### Intent structure
- Action: what to do (for example, `ACTION_VIEW`, `ACTION_SEND`)
- Data: URI the intent operates on (URL, file path)
- Type: MIME type of data
- Category: additional categorization
- Extras: key-value pairs for additional data

### Creating intents

#### Simple intent (action only)
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW
});
```

#### Intent with action and data
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  data: 'https://titaniumsdk.com'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Intent with extras
```javascript
const intent = Ti.Android.createIntent({
  action: 'com.example.MY_ACTION',
  type: 'text/plain'
});
intent.putExtra('message', 'Hello from Titanium');
intent.putExtra('count', 42);
```

### Common use cases

#### Open URL in browser
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  data: 'https://www.example.com'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Dial phone number
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_DIAL,
  data: 'tel:5551234'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Send email
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SENDTO,
  data: 'mailto:user@example.com'
});
intent.putExtra(Ti.Android.EXTRA_SUBJECT, 'Hello');
intent.putExtra(Ti.Android.EXTRA_TEXT, 'Email body');
Ti.Android.currentActivity.startActivity(intent);
```

#### Share content
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SEND,
  type: 'text/plain'
});
intent.putExtra(Ti.Android.EXTRA_TEXT, 'Check this out!');
Ti.Android.currentActivity.startActivity(intent);
```

#### Open PDF file
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  type: 'application/pdf',
  data: file.nativePath // Ti.Filesystem.File object
});
intent.addFlags(Ti.Android.FLAG_GRANT_READ_URI_PERMISSION);
Ti.Android.currentActivity.startActivity(intent);
```

### Starting other apps
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

### Intent chooser
Force the system to show an app chooser dialog (even if a default is set):
```javascript
const intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SEND,
  type: 'text/plain'
});
intent.putExtra(Ti.Android.EXTRA_TEXT, 'Share this text');

Ti.Android.currentActivity.startActivity(
  Ti.Android.createIntentChooser(intent, 'Share via...')
);
```

### Getting results from activities
```javascript
const intent = Ti.Android.createIntent({
  action: 'android.media.action.IMAGE_CAPTURE'
});

Ti.Android.currentActivity.startActivityForResult(intent, (e) => {
  if (e.resultCode === Ti.Android.RESULT_OK) {
    const imageUri = e.intent.data;
    Ti.API.info(`Captured image: ${imageUri}`);
  } else if (e.resultCode === Ti.Android.RESULT_CANCELED) {
    Ti.API.info('User canceled');
  }
});
```

## 5. Intent filters

### Overview
Intent filters advertise your app's capability to handle certain actions and data types. They enable deep linking, file handling, and inter-app communication.

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

### Handling incoming intents

#### Get intent data on startup
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

#### Listen for new intents (activity restart)
```javascript
Ti.Android.currentActivity.addEventListener('newintent', (e) => {
  const intent = e.intent;
  const data = intent.getData();
  Ti.API.info(`New intent received: ${data}`);

  // Handle the new intent
  handleDeepLink(data);
});
```

### Deep linking example

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

## 6. Broadcast intents and receivers

### Overview
Broadcast intents allow system-wide or app-wide messaging. Apps can send broadcasts and register receivers to listen for them.

### System broadcasts

Common system broadcasts:
- `android.intent.action.BATTERY_LOW` - battery low warning
- `android.intent.action.BATTERY_CHANGED` - battery status changed
- `android.intent.action.ACTION_POWER_CONNECTED` - power connected
- `android.intent.action.ACTION_POWER_DISCONNECTED` - power disconnected
- `android.intent.action.BOOT_COMPLETED` - system boot completed
- `android.net.conn.CONNECTIVITY_CHANGE` - network connection changed
- `android.intent.action.USER_PRESENT` - user unlocked device
- `android.intent.action.PACKAGE_INSTALL` / `PACKAGE_REMOVED` - package changes

### Registering broadcast receivers

#### Dynamic registration (in code)

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

// Later: unregister when no longer needed
Ti.Android.unregisterBroadcastReceiver(batteryReceiver);
```

#### Network change listener

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

### Sending custom broadcasts

```javascript
// Send broadcast within your app
const intent = Ti.Android.createIntent({
  action: 'com.myapp.CUSTOM_EVENT'
});
intent.putExtra('data', 'Custom data here');
Ti.Android.currentActivity.sendBroadcast(intent);
```

#### Receiver for custom broadcast

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

### Boot receiver

In `tiapp.xml`:
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

## 7. Android services

### Overview
Services are background components that run independently of the UI. Useful for long-running operations like music playback, location tracking, or network polling.

### Service types

1. Regular service: runs in background until stopped
2. IntentService: queues work requests and processes sequentially
3. Foreground service: shows persistent notification, higher priority

### Creating a service

```javascript
// Create service
const service = Ti.Android.createService({
  url: 'myservice.js',
  interval: 60000 // Check every 60 seconds
});

// Start service
service.start();

// Stop service when done
service.stop();
```

`myservice.js`:
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

`backgroundtask.js`:
```javascript
// Do work
const result = processHeavyTask();

// Optionally send result back to activity
const broadcast = Ti.Android.createBroadcastReceiver({
  onReceived: () => { /* ... */ }
});
// ...
```

### Foreground service

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

### Service lifecycle management

Important: always stop services when no longer needed to conserve resources.

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

### Inter-service communication

```javascript
// From activity to service
const intent = Ti.Android.createServiceIntent({
  url: 'myservice.js'
});
intent.putExtra('command', 'pause');
Ti.Android.startService(intent);

// In service
const command = intent.getStringExtra('command');
if (command === 'pause') {
  // Handle pause command
}
```

## 8. Android permissions

### Runtime permissions (Android 6.0+)

Dangerous permissions require a runtime request:

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
      999, // Request code
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

### Common dangerous permissions
- `ACCESS_FINE_LOCATION` - GPS location
- `ACCESS_COARSE_LOCATION` - network location
- `CAMERA` - camera access
- `READ_EXTERNAL_STORAGE` - read files
- `WRITE_EXTERNAL_STORAGE` - write files
- `RECORD_AUDIO` - microphone
- `CALL_PHONE` - make phone calls
- `SEND_SMS` / `READ_SMS` - SMS access

## Best practices

1. Always unregister broadcast receivers when no longer needed.
2. Stop services explicitly to conserve battery.
3. Use IntentService for one-off background tasks.
4. Use foreground services for user-visible long operations.
5. Handle runtime permissions gracefully on Android 6.0+.
6. Validate intent data before processing.
7. Use proper intent flags for navigation behavior.
8. Test intent filters with ADB: `adb shell am start -W -a android.intent.action.VIEW -d "myapp://path"`.
