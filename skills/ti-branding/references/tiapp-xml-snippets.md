# tiapp.xml snippets

The skill prints these blocks after generating assets. The user reviews and pastes them manually — `tiapp.xml` often contains sensitive info (API keys, signing identities, staging URLs) and automated editing would be fragile.

## Block 1 — iOS background color (for storyboard splash)

Under the `<ios>` element:

```xml
<ios>
  <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>
  <default-background-color>#0B1326</default-background-color>
</ios>
```

Replace `#0B1326` with the user's `--bg-color`.

## Block 2 — Android application icon reference

Under `<android><manifest><application>`:

```xml
<android>
  <manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:icon="@mipmap/ic_launcher"
                 android:usesCleartextTraffic="false"/>
  </manifest>
</android>
```

The `android:icon="@mipmap/ic_launcher"` tells Android to use the adaptive icon XML (via `mipmap-anydpi-v26/ic_launcher.xml` on API 26+) with automatic fallback to the flat `mipmap-*dpi/ic_launcher.png` on older devices.

## Block 3 — Android 12+ splash screen (optional, requires `--with-splash-icon`)

Requires three changes:

### 3a. Splash theme resource

Create `app/platform/android/res/values-v31/splash_theme.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">#0B1326</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splash_icon</item>
    <item name="postSplashScreenTheme">@style/Theme.AppDerived</item>
  </style>
</resources>
```

### 3b. Manifest meta-data (NOT a theme on `<application>` or `<activity>`)

Under `<android><manifest><application>`:

```xml
<meta-data android:name="io.tidev.titanium.splash.theme"
           android:value="@style/Theme.App.SplashScreen"/>
```

### 3c. DO NOT do this

Setting `android:theme="@style/Theme.App.SplashScreen"` on `<application>` or `<activity>` will strip the ActionBar / TitleBar from every screen in the app because Titanium's `Theme.AppDerived` inherits from the application theme. The SplashScreen API is designed to work through the manifest meta-data entry above, not through activity theming.

## Block 4 — Firebase Cloud Messaging notification icon (optional, requires `--with-notification`)

Create `app/platform/android/res/values/colors.xml` (if it doesn't exist) with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="notification_tint">#FDD900</color>
</resources>
```

Then under `<android><manifest><application>`:

```xml
<meta-data android:name="com.google.firebase.messaging.default_notification_icon"
           android:resource="@drawable/ic_stat_notify"/>
<meta-data android:name="com.google.firebase.messaging.default_notification_color"
           android:resource="@color/notification_tint"/>
```

## What the skill reports

After generation, the skill prints only the blocks relevant to the flags used and the project's current state:

- Always prints Block 2 if `android:icon="@mipmap/ic_launcher"` is missing from tiapp.xml
- Always prints Block 1 if `<default-background-color>` is missing
- Prints Block 3 only if `--with-splash-icon` was used
- Prints Block 4 only if `--with-notification` was used
