# Notifications

Based on the [current official guide](https://titaniumsdk.com/docs/build/notifications.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

Two kinds, and they share almost nothing in Titanium. A **local** notification
is scheduled by the app on the device. A **push** notification arrives from a
server through APNs or FCM.

Both need the user's permission on both platforms. Android has required it
since Android 13.

## Local notifications

The APIs are platform-specific, so this is one of the places you write both
halves.

**iOS**

```js
// Install the result listener before requesting permission.
Ti.App.iOS.addEventListener('usernotificationsettings', onSettings);
function onSettings(event) {
  Ti.App.iOS.removeEventListener('usernotificationsettings', onSettings);
  if (!event.types || event.types.length === 0) {
    Ti.API.warn('Notification presentation permission denied');
    return;
  }
  scheduleReminder();
}
Ti.App.iOS.registerUserNotificationSettings({
  types: [
    Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
    Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
    Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
  ]
});

function scheduleReminder() {
  Ti.App.iOS.scheduleLocalNotification({
  alertTitle: 'Standup',
  alertBody: 'Daily standup in five minutes',
    date: new Date(Date.now() + 5 * 60 * 1000)
  });
}
```

Use `Ti.App.iOS.UserNotificationCenter.getPendingNotifications()` and `removePendingNotifications()` to cancel pending alerts; `removeDeliveredNotifications()` clears delivered entries. The older `cancelLocalNotification`, `cancelAllLocalNotifications` and returned object's `cancel()` are deprecated since SDK 7.3.0. Canceling a delivered entry is different from canceling its future schedule.

**Android**

Declare `android.permission.POST_NOTIFICATIONS` in `<android><manifest>` and request Android 13+ permission from an opened window before posting. `Ti.Network.registerForPushNotifications({ success, error })` requests that permission on Android; its success callback does not supply an FCM token. Handle denial and settings restrictions.

```js
const channel = Ti.Android.NotificationManager.createNotificationChannel({
  id: 'reminders',
  name: 'Reminders',
  importance: Ti.Android.IMPORTANCE_DEFAULT
});

const notification = Ti.Android.createNotification({
  contentTitle: 'Standup',
  contentText: 'Daily standup in five minutes',
  channelId: 'reminders'
});

Ti.Android.NotificationManager.notify(1, notification);
```

The integer passed to `notify` is the notification's id: notify again with the
same one and it replaces rather than stacks.

> [!IMPORTANT]
> **Android needs a channel.** Since Android 8 a notification without a valid
> `channelId` is dropped by the system, with nothing in the log to say so. Create
> the channel once at startup - creating it again with the same id is a no-op.
>
> Channel importance is not freely reconfigured after creation. The user owns it
> from then on, and a release that wants a channel to behave differently needs a
> new id.

## Push notifications

APNs and FCM registration are platform-specific. Send the resulting platform token to your backend, which sends the notifications. The following core API example is for **iOS APNs**, after the `usernotificationsettings` callback; it is not an Android FCM registration recipe.

```js
Ti.Network.registerForPushNotifications({
  success(e) {
    Ti.API.info(`device token ${e.deviceToken}`);
    // POST it to your own server here.
  },
  error(e) {
    Ti.API.error(`push registration failed: ${e.error}`);
  },
  callback(e) {
    // A notification arrived. `e.data` is the payload.
    Ti.API.info(e.data);
  }
});
```

`callback` fires when a notification is received **and** when one is tapped, so
if opening a screen is the response, check whether the app was in the
foreground first - otherwise a notification arriving while someone is using the
app navigates them away from what they were doing.

On iOS, ask for notification permission with
`registerUserNotificationSettings` before registering for push. On Android, use a native FCM integration and its own token/message APIs. The guide mentions `google-services.json` and `ti.playservices`, but those alone do not implement FCM registration. Follow the selected integration's current installation instructions, including dependencies and configuration-file placement. Core `callback` / `success.deviceToken` are Apple-only.

The token changes. It changes on reinstall, on restore to a new device, and at
the platform's discretion. Send it on every launch rather than once.

## Testing

Use a signed device build to validate APNs end to end; simulator capabilities depend on the selected OS/Xcode environment. An Android emulator needs the required Play Services/FCM integration. Local notification testing does not prove remote delivery.

The most common "push is broken" causes, in the order worth checking:

1. **The wrong environment.** A development APNs token is not valid against the
   production gateway, and the failure is silent.
2. **No permission.** Handle permission denial and explain the relevant system settings; do not assume another request will always show a dialog.
3. **Missing channel on Android.** See above.
4. **The token is stale.** See above.

![An expanded notification in the Android shade, posted by an app called Hello. Its icon sits at the left, the title reads Standup and the body reads Daily standup in five minutes.](https://titaniumsdk.com/docs/guides/notification-shade-android.png)

## Next

[Using modules](https://titaniumsdk.com/docs/build/modules.md) covers adding capabilities the core SDK
does not have, which is what `ti.playservices` above is.

Contract corrections: [released Network API](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/apidoc/Titanium/Network/Network.yml), [UserNotificationCenter](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/apidoc/Titanium/App/iOS/UserNotificationCenter.yml), [NotificationManager](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/apidoc/Titanium/Android/NotificationManager/NotificationManager.yml).
