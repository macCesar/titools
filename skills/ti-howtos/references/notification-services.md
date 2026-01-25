# Push and Local Notifications

Comprehensive guide for local and push notifications on iOS and Android.

## Table of Contents
1. [Local Notifications Android](#local-notifications-android)
2. [Local Notifications iOS](#local-notifications-ios)
3. [Interactive Notifications iOS](#interactive-notifications-ios)
4. [Push Notifications](#push-notifications)

---

## Local Notifications Android

### Notification Display Locations

- **Notification Drawer**: Swipe down from status bar
- **Lock Screen**: Android 5.0+ (API 21+)
- **Status Bar**: Icon and ticker text

### Create a Notification

**Basic Layout:**
```javascript
var notification = Ti.Android.createNotification({
    contentTitle: 'Notification Title',
    contentText: 'Notification message',
    contentIntent: Ti.Android.createPendingIntent({
        intent: Ti.Android.createIntent({})
    }),
    icon: Ti.App.Android.R.drawable.warn,  // or '/images/warn.png'
    number: 5,           // Badge number
    when: new Date(),    // Timestamp (does NOT schedule)
    tickerText: 'Text in status bar when notification first appears'
});

// Send immediately
Ti.Android.NotificationManager.notify(1, notification);
```

**Icon paths:**
- Density-specific: `/app/assets/android/images/` (Alloy) or `/Resources/android/images/` (Classic), reference as `/images/filename.png`
- Drawable folder: `/platform/android/res/drawable/filename.png`, reference as `Ti.App.Android.R.drawable.filename`

### Sound

```javascript
var notification = Ti.Android.createNotification({
    // ... other properties
    sound: Ti.Filesystem.getResRawDirectory() + 'sound.wav'
});
```

Play only once (add flag):
```javascript
notification.flags |= Ti.Android.FLAG_ONLY_ALERT_ONCE;
```

### Custom Layout with RemoteViews

**1. Create XML Layout** (`/platform/android/res/layout/customview.xml`):
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal">
    <TextView android:id="@+id/message"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Default text" />
    <Button android:id="@+id/okbutton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="OK" />
</LinearLayout>
```

**2. Create RemoteViews and bind intents:**
```javascript
var customView = Ti.Android.createRemoteViews({
    layoutId: Ti.App.Android.R.layout.customview
});

// Modify text
customView.setTextViewText(Ti.App.Android.R.id.message, "Update available!");

// Bind intents to buttons
var downloadIntent = Ti.Android.createPendingIntent({intent: Ti.Android.createIntent()});
customView.setOnClickPendingIntent(Ti.App.Android.R.id.okbutton, downloadIntent);

var notification = Ti.Android.createNotification({
    contentView: customView  // Avoid setting contentTitle/contentText or they override this
});
```

### Additional Properties

**Defaults (device settings):**
```javascript
notification.defaults = Ti.Android.DEFAULT_ALL;  // or DEFAULT_SOUND, DEFAULT_VIBRATE, DEFAULT_LIGHTS
```

**Flags (behavior):**
```javascript
notification.flags |= Ti.Android.FLAG_AUTO_CANCEL;     // Clear on tap
notification.flags |= Ti.Android.FLAG_INSISTENT;       // Repeat sound until canceled
notification.flags |= Ti.Android.FLAG_NO_CLEAR;        // Don't clear with "clear all"
notification.flags |= Ti.Android.FLAG_ONGOING_EVENT;   // Ongoing event (e.g., music player)
notification.flags |= Ti.Android.FLAG_ONLY_ALERT_ONCE; // Don't replay sound/vibrate
notification.flags |= Ti.Android.FLAG_SHOW_LIGHTS;     // Use LED (if device allows)
```

**Priority** (Android 4.1+):
```javascript
notification.priority = Ti.Android.PRIORITY_HIGH;  // or PRIORITY_MAX, PRIORITY_DEFAULT, PRIORITY_LOW, PRIORITY_MIN
```

**Category** (Android 5.0+):
```javascript
notification.category = Ti.Android.CATEGORY_MESSAGE;  // or CATEGORY_ALARM, CALL, EMAIL, ERROR, EVENT, etc.
```

**Visibility** (Android 5.0+ - lock screen):
```javascript
notification.visibility = Ti.Android.VISIBILITY_PUBLIC;     // Show all
// or VISIBILITY_PRIVATE (hide content), VISIBILITY_SECRET (don't show)
```

### Update Notification

```javascript
notification.setLatestEventInfo('New Title', 'New Message', notification.contentIntent);
```

### Remove Notifications

```javascript
// Remove specific notification
Ti.Android.NotificationManager.cancel(1);

// Remove all notifications
Ti.Android.NotificationManager.cancelAll();
```

### Respond to Notification Tap

**Launch app when tapped:**
```javascript
var intent = Ti.Android.createIntent({
    action: Ti.Android.ACTION_MAIN,
    className: 'com.appcelerator.testapp.MyappActivity',  // ProjectName + Activity
    packageName: 'com.appcelerator.testapp'
});
intent.flags |= Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP;
intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

notification.contentIntent = Ti.Android.createPendingIntent({intent: intent});
```

### Schedule Future Notification (Background Service)

**tiapp.xml:**
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <services>
        <service url="ExampleService.js" type="interval" />
    </services>
</android>
```

**ExampleService.js:**
```javascript
var service = Ti.Android.currentService;
var serviceIntent = service.getIntent();
var timestamp = new Date(serviceIntent.getStringExtra('timestamp'));

if (new Date() > timestamp) {
    var title = serviceIntent.getStringExtra('title');
    var message = serviceIntent.getStringExtra('message');

    var notification = Ti.Android.createNotification({
        contentTitle: title,
        contentText: message,
        contentIntent: Ti.Android.createPendingIntent({intent: Ti.Android.createIntent()})
    });

    Ti.Android.NotificationManager.notify(1, notification);
    Ti.Android.stopService(serviceIntent);
}
```

**Main app:**
```javascript
var intent = Ti.Android.createServiceIntent({url: 'ExampleService.js'});
intent.putExtra('interval', 5000);  // Check every 5 seconds
intent.putExtra('timestamp', new Date(new Date().getTime() + 30 * 1000));  // Fire in 30 seconds
intent.putExtra('title', 'Scheduled Notification');
intent.putExtra('message', 'This was scheduled!');
Ti.Android.startService(intent);
```

---

## Local Notifications iOS

### Notification Display Locations

- **Alert Dialog**: "Open" or "Close" buttons (background, unlocked)
- **Banner Message**: Swipe down for actions, tap to launch (background, unlocked)
- **Lock Screen**: Swipe right to launch
- **Notification Center**: Queued notifications
- **Badge**: Number on app icon
- **Sound**: Audio alert

### Register for Notifications (iOS 8+)

```javascript
if (Ti.Platform.name === 'iPhone OS' && parseInt(Ti.Platform.version.split('.')[0]) >= 8) {
    Ti.App.iOS.registerUserNotificationSettings({
        types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
        // Add 'categories' for interactive notifications
    });
}
```

### Schedule Local Notification

```javascript
var notification = Ti.App.iOS.scheduleLocalNotification({
    date: new Date(new Date().getTime() + 3000),  // 3 seconds from now
    alertBody: 'New content available!',
    alertAction: 'update',  // Changes "slide to view" to "slide to update" or "Open" to "Update"
    alertLaunchImage: 'splash.png',  // Custom splash image
    badge: 1,             // Set badge number (negative to clear)
    sound: '/alert.wav',  // Sound file in Resources or app/assets
    category: 'CATEGORY_ID',  // For interactive notifications
    repeat: 'daily',      // or 'weekly', 'monthly', 'yearly'
    timezone: 'America/Los_Angeles',  // Optional (default: system timezone)
    userInfo: { url: 'http://example.com/data.json', id: '123' }  // Custom data
});
```

### Monitor Notifications

**While app is in foreground or returns to foreground:**
```javascript
Ti.App.iOS.addEventListener('notification', function(e) {
    // Process custom data
    if (e.userInfo && e.userInfo.url) {
        // Handle URL
    }

    // Reset badge
    if (e.badge > 0) {
        Ti.App.iOS.scheduleLocalNotification({
            date: new Date(),
            badge: -1
        });
    }
});
```

### Cancel Notifications

```javascript
// Cancel all
Ti.App.iOS.cancelAllLocalNotifications();

// Cancel specific notification
var notification = Ti.App.iOS.scheduleLocalNotification({...});
notification.cancel();

// Or by ID
Ti.App.iOS.scheduleLocalNotification({
    userInfo: {id: 'foo'},
    alertBody: 'Test'
});
Ti.App.iOS.cancelLocalNotification('foo');
```

---

## Interactive Notifications iOS (iOS 8+)

### Create Notification Actions

```javascript
var acceptAction = Ti.App.iOS.createUserNotificationAction({
    identifier: 'ACCEPT_IDENTIFIER',
    title: 'Accept',
    activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,  // or BACKGROUND
    destructive: false,
    authenticationRequired: true  // Require device unlock
});

var rejectAction = Ti.App.iOS.createUserNotificationAction({
    identifier: 'REJECT_IDENTIFIER',
    title: 'Reject',
    activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
    destructive: true,  // Red background in lock screen/notification center
    authenticationRequired: false
});
```

### Create Notification Category

```javascript
var category = Ti.App.iOS.createUserNotificationCategory({
    identifier: 'INVITE_CATEGORY',
    actionsForDefaultContext: [acceptAction, rescheduleAction, delayAction, rejectAction],  // Alert dialog (4 max)
    actionsForMinimalContext: [acceptAction, rejectAction]  // Other styles (2 max)
});
```

### Register Categories

```javascript
Ti.App.iOS.registerUserNotificationSettings({
    types: [
        Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
    ],
    categories: [category]
});
```

### Monitor Interactive Notifications

**Local notifications:**
```javascript
Ti.App.iOS.addEventListener('localnotificationaction', function(e) {
    // e.category: category identifier
    // e.identifier: action identifier
    // e.userInfo: custom data

    if (e.category === 'INVITE_CATEGORY' && e.identifier === 'ACCEPT_IDENTIFIER') {
        // Handle accept
        if (e.userInfo && e.userInfo.url) {
            // Process URL
        }
    }

    // Reset badge
    if (e.badge > 0) {
        Ti.App.iOS.scheduleLocalNotification({ date: new Date(), badge: -1 });
    }
});
```

**Push notifications:**
```javascript
Ti.App.iOS.addEventListener('remotenotificationaction', function(e) {
    // e.category: category identifier
    // e.identifier: action identifier
    // e.data: push notification payload (JSON)

    if (e.category === 'DOWNLOAD_CATEGORY' && e.identifier === 'ACCEPT_IDENTIFIER') {
        if (e.data && e.data.url) {
            // Process URL
        }
    }
});
```

### Schedule Interactive Local Notification

```javascript
Ti.App.iOS.scheduleLocalNotification({
    date: new Date(new Date().getTime() + 3000),
    alertBody: 'New content available! Download now?',
    badge: 1,
    userInfo: {url: 'http://example.com/data.json'},
    category: 'INVITE_CATEGORY'  // Must match registered category identifier
});
```

### Send Interactive Push Notification

**Payload format:**
```json
{
    "alert": "New content available! Download now?",
    "badge": 1,
    "url": "http://example.com/data.json",
    "category": "INVITE_CATEGORY"
}
```

---

## Push Notifications

### Overview

Push notifications allow server-to-device communication. Infrastructure differs by platform:

- **Android**: Firebase Cloud Messaging (FCM) or Google Cloud Messaging (GCM)
- **iOS**: Apple Push Notification service (APNs)

### Register for Push Notifications

```javascript
Ti.Network.registerForPushNotifications({
    success: function(e) {
        // e.deviceToken: token to send to your push server
        Ti.API.info('Device Token: ' + e.deviceToken);
        // Send this token to your server
    },
    error: function(e) {
        Ti.API.error('Push registration error: ' + e.error);
    },
    callback: function(e) {
        // Incoming push notification
        // e.data: push payload (iOS)
        // e.data: JSON object (Android)
        Ti.API.info('Push received: ' + JSON.stringify(e.data));
    }
});
```

### Configure Push Services

**Android (FCM/GCM):**
1. Create project in Firebase Console or Google API Console
2. Get API key/Sender ID
3. Configure with your push provider (e.g., ArrowDB, ACS, or custom server)

**iOS (APNs):**
1. Create App ID in Apple Developer Portal
2. Enable Push Notifications
3. Create SSL certificate (development/production)
4. Configure with your push provider

### Push Notification Payload Format

**iOS:**
```json
{
    "aps": {
        "alert": "Message text",
        "badge": 1,
        "sound": "default"
    },
    "custom_field": "custom_value"
}
```

**Android:**
```json
{
    "message": "Message text",
    "title": "Notification Title",
    "custom_field": "custom_value"
}
```

### Subscribe to Channels

**Using Arrow/ACS:**
```javascript
Cloud.PushNotifications.subscribeToken({
    device_token: deviceToken,
    channel: 'news',
    type: Ti.Platform.name === 'iPhone OS' ? 'ios' : 'android'
}, function(e) {
    if (e.success) {
        Ti.API.info('Subscribed to news channel');
    }
});
```

### Send Push Notifications

**Using Arrow/ACS:**
```javascript
Cloud.PushNotifications.notify({
    channel: 'news',
    payload: 'Hello subscribers!',
    title: 'News Update'
}, function(e) {
    if (e.success) {
        Ti.API.info('Push sent successfully');
    }
});
```

**Direct API call:**
Send to your push server with device tokens and payload.

### Best Practices

1. **Permissions**: iOS requires user permission (prompted on first call to `registerForPushNotifications`)
2. **Device Tokens**: Cache and send to your server; can change on app updates
3. **Background Handling**: Use proper activation modes for interactive notifications
4. **Badge Management**: Always reset badge after processing notification
5. **Error Handling**: Handle registration failures gracefully
6. **Testing**: Use development certificates/sandbox for testing iOS

---

## Common Patterns

### Check Notification Permissions

```javascript
// Android 4.1+ can disable notifications per app
// Check via Settings or handle gracefully (notification may not be shown)
```

### PendingIntent for Notification Actions

```javascript
var intent = Ti.Android.createIntent({
    action: 'com.example.MY_ACTION',
    // Add data/flags
});
var pendingIntent = Ti.Android.createPendingIntent({
    intent: intent,
    flags: Ti.Android.FLAG_UPDATE_CURRENT
});
```

### Notification Groups (Android 7.0+)

```javascript
// Requires API 24+; check documentation for latest implementation
```

### Rich Notifications (iOS 10+)

Use `UNMutableNotificationContent` with attachments (images, video, audio).

### Silent Push

```javascript
// iOS: include "content-available": 1 in payload
// Android: use data messages (FCM)
```

---

## Platform-Specific Notes

### Android

- **Service lifecycle**: Services may be killed if app is swiped away
- **Notification channels**: Android 8.0+ requires notification channels
- **Limitations**: Legacy MapView only supports single map view

### iOS

- **Sandbox vs Production**: Use correct certificates and endpoints
- **Background app refresh**: May be needed for certain push scenarios
- **LiveView**: Callbacks only work properly when LiveView is enabled
