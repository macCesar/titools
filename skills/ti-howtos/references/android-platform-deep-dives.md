# Android Platform Deep Dives

## 1. Android Intents

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
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW
});
```

#### Intent with Action and Data
```javascript
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  data: 'http://www.appcelerator.com'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Intent with Extras
```javascript
var intent = Ti.Android.createIntent({
  action: 'com.example.MY_ACTION',
  type: 'text/plain'
});
intent.addExtra('message', 'Hello from Titanium');
intent.addExtra('count', 42);
```

### Common Use Cases

#### Open URL in Browser
```javascript
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_VIEW,
  data: 'https://www.example.com'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Dial Phone Number
```javascript
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_DIAL,
  data: 'tel:5551234'
});
Ti.Android.currentActivity.startActivity(intent);
```

#### Send Email
```javascript
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SENDTO,
  data: 'mailto:user@example.com'
});
intent.addExtra(Intent.EXTRA_SUBJECT, 'Hello');
intent.addExtra(Intent.EXTRA_TEXT, 'Email body');
Ti.Android.currentActivity.startActivity(intent);
```

#### Share Content
```javascript
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_SEND,
  type: 'text/plain'
});
intent.addExtra(Intent.EXTRA_TEXT, 'Check this out!');
Ti.Android.currentActivity.startActivity(intent);
```

#### Open PDF File
```javascript
var intent = Ti.Android.createIntent({
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
var intent = Ti.Android.createIntent({
  action: Ti.Android.ACTION_MAIN,
  packageName: 'com.example.anotherapp',
  className: 'com.example.anotherapp.MainActivity'
});
try {
  Ti.Android.currentActivity.startActivity(intent);
} catch (e) {
  Ti.API.error('App not installed: ' + e.message);
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
var activity = Ti.Android.currentActivity;
var intent = activity.getIntent();

if (intent) {
  var action = intent.getAction();
  var data = intent.getData();

  if (data) {
    Ti.API.info('Received data: ' + data);
    // Handle URL or file path
  }

  // Get extras
  var extra = intent.getStringExtra('key');
  Ti.API.info('Extra value: ' + extra);
}
```

#### Listen for New Intents (Activity Restart)
```javascript
Ti.Android.currentActivity.addEventListener('newintent', function(e) {
  var intent = e.intent;
  var data = intent.getData();
  Ti.API.info('New intent received: ' + data);

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
  var parts = url.split('/');
  var productId = parts[parts.length - 1];
  openProductScreen(productId);
}

// Check on startup
var activity = Ti.Android.currentActivity;
var intent = activity.getIntent();
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
var batteryReceiver = Ti.Android.createBroadcastReceiver({
  onReceived: function(e) {
    var level = e.intent.getIntExtra(Ti.Android.EXTRA_BATTERY_LEVEL, -1);
    Ti.API.info('Battery level: ' + level + '%');

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
var networkReceiver = Ti.Android.createBroadcastReceiver({
  onReceived: function(e) {
    var connectivityManager = Ti.Android.getSystemService(
      Ti.Android.CONNECTIVITY_SERVICE
    );
    var networkInfo = connectivityManager.getActiveNetworkInfo();

    if (networkInfo && networkInfo.isConnected()) {
      Ti.API.info('Network connected: ' + networkInfo.getTypeName());
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
var intent = Ti.Android.createIntent({
  action: 'com.myapp.CUSTOM_EVENT'
});
intent.addExtra('data', 'Custom data here');
Ti.Android.currentActivity.sendBroadcast(intent);
```

#### Receiver for Custom Broadcast

```javascript
var customReceiver = Ti.Android.createBroadcastReceiver({
  onReceived: function(e) {
    var data = e.intent.getStringExtra('data');
    Ti.API.info('Received custom event: ' + data);
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
var service = Ti.Android.createService({
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
var xhr = Ti.Network.createHTTPClient({
  onload: function() {
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
var intent = Ti.Android.createServiceIntent({
  url: 'backgroundtask.js'
});

// Start service (runs once and stops)
Ti.Android.startService(intent);
```

**backgroundtask.js**:
```javascript
// Do work
var result = processHeavyTask();

// Optionally send result back to activity
var broadcast = Ti.Android.createBroadcastReceiver({
  onReceived: function() { /* ... */ }
});
// ...
```

### Foreground Service

For critical, long-running operations (must show notification):

```javascript
var notification = Ti.Android.createNotification({
  contentTitle: 'Service Running',
  contentText: 'Tracking location...',
  tickerText: 'Service started',
  icon: Ti.App.Android.R.drawable.app_icon
});

var intent = Ti.Android.createServiceIntent({
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
Ti.Android.currentActivity.addEventListener('pause', function() {
  // Optionally pause service
});

Ti.Android.currentActivity.addEventListener('destroy', function() {
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
var intent = Ti.Android.createServiceIntent({
  url: 'myservice.js'
});
intent.addExtra('command', 'pause');
Ti.Android.startService(intent);

// In service
var command = intent.getStringExtra('command');
if (command === 'pause') {
  // Handle pause command
}
```

## 5. Android Permissions

### Runtime Permissions (Android 6.0+)

Dangerous permissions require runtime request:

```javascript
function checkPermission() {
  var result = Ti.Android.checkSelfPermission(
    Ti.Android.PERMISSION_ACCESS_FINE_LOCATION
  );

  if (result === Ti.Android.RESULTS.GRANTED) {
    startLocationTracking();
  } else {
    Ti.Android.requestPermissions(
      [Ti.Android.PERMISSION_ACCESS_FINE_LOCATION],
      999,  // Request code
      function(e) {
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
