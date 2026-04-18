# Splash screens (modern)

## Two strategies by platform

### iOS — storyboard-driven (iOS 14+)

Modern iOS uses `LaunchScreen.storyboard`. Titanium enables this via `tiapp.xml`:

```xml
<ios>
  <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>
  <default-background-color>#0B1326</default-background-color>
</ios>
```

The storyboard is a single layout that scales dynamically to any device. No per-device PNG launch images are needed. The `<default-background-color>` sets both the storyboard background AND the gap-color between the storyboard and the first view.

This skill does NOT generate iOS launch images. It prints the `<default-background-color>` snippet for the user to paste.

### Android 12+ — SplashScreen API (API 31+)

Android 12 introduced a system-managed splash that replaces the old "put a PNG in drawable/background.png" approach. It's theme-driven:

```xml
<!-- platform/android/res/values-v31/splash_theme.xml -->
<resources>
  <style name="Theme.SnapGym.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">#0B1326</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splash_icon</item>
    <item name="postSplashScreenTheme">@style/Theme.AppDerived</item>
  </style>
</resources>
```

With a matching `AndroidManifest.xml` entry (inside `<application>`):

```xml
<meta-data android:name="io.tidev.titanium.splash.theme"
           android:value="@style/Theme.SnapGym.SplashScreen"/>
```

Critical: **do NOT apply this theme to `<application android:theme>` or to a specific `<activity>`** — it only affects the system SplashScreen via the manifest meta-data. Applying it to the application breaks the ActionBar / TitleBar in every subsequent screen (as SNAP Gym learned the hard way).

### Android <12 — fallback to launcher icon

On API <31, the system uses the launcher icon as the splash. No extra file needed. The `background.9.png` 9-patch pattern is obsolete in Titanium SDK 13+.

## splash_icon.png canvas (Android 12+)

The SplashScreen API spec:

- Total canvas: **288 dp**
- Icon safe-zone: **192 dp centered** (≈ 67% of canvas)
- OS applies a circular mask automatically — keep content centered

Density sizes:

| Density  | Total canvas | Icon area |
|----------|--------------|-----------|
| mdpi     | 288          | 192       |
| hdpi     | 432          | 288       |
| xhdpi    | 576          | 384       |
| xxhdpi   | 864          | 576       |
| xxxhdpi  | 1152         | 768       |

The skill's `gen-splash-icon.sh` places the logo at `192/288 ≈ 67%` of the canvas with transparent padding around it.

## Why we don't generate `background.9.png`

The old 9-patch splash pattern works like this:

- PNG with 1px borders marked as stretchable regions
- Titanium references it as `background.9.png` in `drawable-*dpi/`
- SDK pre-13 used it as `windowBackground` for the root activity

Titanium 13+ handles splash via the modern SplashScreen API on 12+ and via the launcher icon itself on older versions. `background.9.png` produces worse results on 12+ (competing with the SplashScreen API) and offers no benefit on older versions that the launcher fallback can't provide.

## References

- Android: [Splash screens](https://developer.android.com/develop/ui/views/launch/splash-screen)
- Apple: [Configuring your app's launch screen](https://developer.apple.com/documentation/xcode/configuring-your-apps-launch-screen)
