# Android adaptive icons (API 26+)

## Canvas and safe-zone

Adaptive icons use a fixed 108×108 dp virtual canvas composed of two layers:

- **Foreground**: the logo/glyph with transparency outside the safe-zone
- **Background**: solid color, gradient, or pattern filling the full canvas

The OS launcher applies a mask (circle, squircle, teardrop, rounded square — up to the OEM) and clips both layers to that shape. Only the central **66×66 dp safe-zone** is guaranteed to remain visible regardless of the mask.

Translation to padding:

```
safe-zone:    66 / 108 = 61.1% of canvas
min padding:  (108 - 66) / 2 / 108 = 19.44% per side
```

Anything beyond 66dp toward the edge is at the launcher's discretion — some masks (circle) hide more, some (squircle) hide less.

## Density sizes

One pixel unit equals `density_scale × 1 dp`:

| Density  | Scale | Canvas size (108 dp) |
|----------|-------|----------------------|
| mdpi     | 1.0×  | 108 px               |
| hdpi     | 1.5×  | 162 px               |
| xhdpi    | 2.0×  | 216 px               |
| xxhdpi   | 3.0×  | 324 px               |
| xxxhdpi  | 4.0×  | 432 px               |

Ship all five. The OS picks the closest match for the user's screen density.

## Monochrome layer (API 31+)

Android 13 introduced themed icons: the user can tell the launcher to re-color all app icons with the system accent color. The OS uses the `monochrome` drawable for this treatment.

Rules for the monochrome drawable:

- All non-transparent pixels become pure white at build time — the OS tint replaces white with the theme color at render time
- Alpha channel must be preserved (same silhouette as foreground, transparency intact)
- Do NOT include color information — it will be discarded

The skill generates monochrome by taking the foreground and running ImageMagick's `-channel RGB -fill white -colorize 100 +channel` which replaces RGB with white while leaving the alpha untouched.

## XML bind

One file ties the three layers together. Ships to `mipmap-anydpi-v26/ic_launcher.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@mipmap/ic_launcher_background"/>
  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
  <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
```

The `v26` qualifier ensures only API 26+ devices use this file. Older devices fall through to the legacy `mipmap-*/ic_launcher.png` flat drawable.

## Legacy flat icon

For API 21–25 (~3% of active users in 2026) the launcher still uses a flat PNG:

| Density  | Size |
|----------|------|
| mdpi     | 48   |
| hdpi     | 72   |
| xhdpi    | 96   |
| xxhdpi   | 144  |
| xxxhdpi  | 192  |

Fill more of the canvas here — legacy launchers don't apply adaptive masking. The skill reduces the padding by 40% for this composite.

## Verifying

- Android Studio has a Resource Manager that previews adaptive icons with multiple masks. Point it at `app/platform/android/res/` to inspect.
- On a device/emulator running API 26+, long-press the launcher icon and the animated wiggle reveals whether the adaptive layers are wired correctly.
- On API 31+, toggle "Themed icons" in the launcher settings to verify the monochrome layer.

## References

- Android Developer: [Adaptive icons](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- Android Developer: [Themed app icons](https://developer.android.com/about/versions/13/features#themed-app-icons)
