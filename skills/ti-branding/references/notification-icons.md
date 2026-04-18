# Notification icons

## The white-only rule

Android notification icons, since API 21 (Lollipop), must be **white pixels on a transparent background**. The system applies a runtime tint based on the notification's `color` property — color in the source image is discarded.

If the icon is not white+alpha, it renders as a blank white square on API 21+ (a common bug symptom when developers reuse their launcher icon as the notification icon).

## Generation

The skill's `gen-notification.sh`:

1. Scales the foreground logo down to the notification size
2. Runs ImageMagick's `-channel RGB -fill white -colorize 100 +channel` to force all RGB channels to 255 while preserving alpha
3. Pads transparently to match the target canvas size

## Sizes

| Density  | Size |
|----------|------|
| mdpi     | 24   |
| hdpi     | 36   |
| xhdpi    | 48   |
| xxhdpi   | 72   |
| xxxhdpi  | 96   |

## File naming

Titanium has no hard convention, but the de-facto name is `ic_stat_notify.png`. The skill emits this name. To reference it:

**In JavaScript (local notification)**:

```js
Ti.Android.NotificationManager.notify(1, Ti.Android.createNotification({
  contentTitle: 'Hello',
  contentText: 'Hi there',
  icon: Ti.App.Android.R.drawable.ic_stat_notify  // white+alpha
}))
```

**In `platform/android/AndroidManifest.xml` (Firebase default)**:

```xml
<meta-data
  android:name="com.google.firebase.messaging.default_notification_icon"
  android:resource="@drawable/ic_stat_notify"/>
<meta-data
  android:name="com.google.firebase.messaging.default_notification_color"
  android:resource="@color/notification_tint"/>
```

With a matching `values/colors.xml`:

```xml
<color name="notification_tint">#FDD900</color>
```

The `default_notification_color` is the tint the runtime applies to the white pixels.

## References

- Android: [Notifications overview](https://developer.android.com/develop/ui/views/notifications)
- Firebase: [Setting the default notification icon](https://firebase.google.com/docs/cloud-messaging/android/client#manifest)
