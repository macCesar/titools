# Icons and splash screens

## 1. Overview

App icons and splash screens are required for app store submissions and give users a branded first impression.

Tools for asset generation:
- [TiCons website](http://ticons.fokkezb.nl/)
- [TiCons CLI](https://www.npmjs.org/package/ticons)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/index.html)

## 2. Asset locations

| Platform        | Classic project                         | Alloy project                             |
| --------------- | --------------------------------------- | ----------------------------------------- |
| Shared          | `Resources/`                            | `app/assets/`                             |
| iOS             | `Resources/iphone/` or `Resources/ios/` | `app/assets/iphone/` or `app/assets/ios/` |
| Android         | `Resources/android/`                    | `app/assets/android/`                     |
| Android density | `platform/android/res/drawable-*dpi/`   | `app/platform/android/res/drawable-*dpi/` |

## 3. DefaultIcon.png (recommended)

Place a single `DefaultIcon.png` (1024x1024 px) in the project root. Titanium auto-generates missing icon sizes.

Requirements:
- Square (equal height and width)
- No alpha channel
- PNG format
- At least 1024x1024 px

## 4. iOS icons

### App icons

| Device          | Dimensions | Filename              |
| --------------- | ---------- | --------------------- |
| iPhone 4/5/6    | 120x120    | `appicon-60@2x.png`   |
| iPhone 6 Plus+  | 180x180    | `appicon-60@3x.png`   |
| iPad non-retina | 76x76      | `appicon-76.png`      |
| iPad retina     | 152x152    | `appicon-76@2x.png`   |
| iPad Pro        | 167x167    | `appicon-83.5@2x.png` |

### Spotlight and Settings icons

| Device               | Purpose   | Dimensions | Filename                  |
| -------------------- | --------- | ---------- | ------------------------- |
| Universal non-retina | Spotlight | 40x40      | `appicon-Small-40.png`    |
| Universal retina     | Spotlight | 80x80      | `appicon-Small-40@2x.png` |
| iPhone 6 Plus+       | Spotlight | 120x120    | `appicon-Small-40@3x.png` |
| Universal non-retina | Settings  | 29x29      | `appicon-Small.png`       |
| Universal retina     | Settings  | 58x58      | `appicon-Small@2x.png`    |
| iPhone 6 Plus+       | Settings  | 87x87      | `appicon-Small@3x.png`    |

App thinning note: Application icons and launch images are added to the Asset Catalog. You cannot reference launch image assets from the filesystem, so you cannot set `backgroundImage` to a launch image file.

### iOS splash screens

| Device                                  | Dimensions | Filename                         |
| --------------------------------------- | ---------- | -------------------------------- |
| iPhone 4/4S                             | 640x960    | `Default@2x.png`                 |
| iPhone 5/5C/5S                          | 640x1136   | `Default-568h@2x.png`            |
| iPhone 6/7/8 portrait                   | 750x1334   | `Default-667h@2x.png`            |
| iPhone 6/7/8 landscape                  | 1334x750   | `Default-Landscape-1134@2x.png`  |
| iPhone 6/7/8 Plus portrait              | 1242x2208  | `Default-Portrait-736h@3x.png`   |
| iPhone 6/7/8 Plus landscape             | 2208x1242  | `Default-Landscape-736h@3x.png`  |
| iPhone X/Xs portrait                    | 1125x2436  | `Default-Portrait-2436h@3x.png`  |
| iPhone X/Xs landscape                   | 2436x1125  | `Default-Landscape-2436h@3x.png` |
| iPhone Xr portrait                      | 828x1792   | `Default-Portrait-1792h@2x.png`  |
| iPhone Xr landscape                     | 1792x828   | `Default-Landscape-1792h@2x.png` |
| iPhone Xs Max portrait                  | 1242x2688  | `Default-Portrait-2688h@3x.png`  |
| iPhone Xs Max landscape                 | 2688x1242  | `Default-Landscape-2688h@3x.png` |
| iPhone 12/13/14 portrait                | 1170x2532  | `Default-Portrait-2532@3x.png`   |
| iPhone 12/13/14 landscape               | 2532x1170  | `Default-Landscape-2532@3x.png`  |
| iPhone 12/13 Pro Max, 14 Plus portrait  | 1284x2778  | `Default-Portrait-2778@3x.png`   |
| iPhone 12/13 Pro Max, 14 Plus landscape | 2778x1284  | `Default-Landscape-2778@3x.png`  |
| iPhone 14 Pro portrait                  | 1179x2556  | `Default-Portrait-2556@3x.png`   |
| iPhone 14 Pro landscape                 | 2556x1179  | `Default-Landscape-2556@3x.png`  |
| iPhone 14 Pro Max portrait              | 1290x2796  | `Default-Portrait-2796@3x.png`   |
| iPhone 14 Pro Max landscape             | 2796x1290  | `Default-Landscape-2796@3x.png`  |
| iPad non-retina landscape               | 1024x768   | `Default-Landscape.png`          |
| iPad non-retina portrait                | 768x1024   | `Default-Portrait.png`           |
| iPad retina landscape                   | 2048x1536  | `Default-Landscape@2x.png`       |
| iPad retina portrait                    | 1536x2048  | `Default-Portrait@2x.png`        |

### iTunes artwork (ad-hoc builds)

| Dimensions | Filename                          |
| ---------- | --------------------------------- |
| 512x512    | `iTunesArtwork` (no extension)    |
| 1024x1024  | `iTunesArtwork@2x` (no extension) |

Note: Do not include in App Store builds.

### iTunes Connect requirements

| Purpose        | Dimensions      | Format                   |
| -------------- | --------------- | ------------------------ |
| Large app icon | 1024x1024       | JPG/PNG, no transparency |
| Screenshots    | Device-specific | JPG/PNG, no transparency |

## 5. Android icons

### Launcher icons

| Density | DPI | Dimensions | Location                                            |
| ------- | --- | ---------- | --------------------------------------------------- |
| ldpi    | 120 | 36x36      | `platform/android/res/drawable-ldpi/appicon.png`    |
| mdpi    | 160 | 48x48      | `platform/android/res/drawable-mdpi/appicon.png`    |
| hdpi    | 240 | 72x72      | `platform/android/res/drawable-hdpi/appicon.png`    |
| xhdpi   | 320 | 96x96      | `platform/android/res/drawable-xhdpi/appicon.png`   |
| xxhdpi  | 480 | 144x144    | `platform/android/res/drawable-xxhdpi/appicon.png`  |
| xxxhdpi | 640 | 512x512    | `platform/android/res/drawable-xxxhdpi/appicon.png` |

The filename must match the `icon` element in your `tiapp.xml`. By default, new projects use `Resources/android/appicon.png`.

### Action bar icons

| Density | Dimensions | Classic location                        | Alloy location                           |
| ------- | ---------- | --------------------------------------- | ---------------------------------------- |
| ldpi    | 18x18      | `Resources/android/images/res-ldpi/`    | `app/assets/android/images/res-ldpi/`    |
| mdpi    | 24x24      | `Resources/android/images/res-mdpi/`    | `app/assets/android/images/res-mdpi/`    |
| hdpi    | 36x36      | `Resources/android/images/res-hdpi/`    | `app/assets/android/images/res-hdpi/`    |
| xhdpi   | 48x48      | `Resources/android/images/res-xhdpi/`   | `app/assets/android/images/res-xhdpi/`   |
| xxhdpi  | 72x72      | `Resources/android/images/res-xxhdpi/`  | `app/assets/android/images/res-xxhdpi/`  |
| xxxhdpi | 144x144    | `Resources/android/images/res-xxxhdpi/` | `app/assets/android/images/res-xxxhdpi/` |

### Small and contextual icons

Used for status bar icons and other small UI elements:

| Density | Dimensions |
| ------- | ---------- |
| ldpi    | 12x12      |
| mdpi    | 16x16      |
| hdpi    | 24x24      |
| xhdpi   | 32x32      |

### Notification icons

Important: Use white-only shapes on transparent backgrounds.

Same density and location structure as action bar icons, but in `platform/android/res/drawable-*dpi/`.

### Google Play requirements

| Purpose         | Dimensions | Format              |
| --------------- | ---------- | ------------------- |
| Large app icon  | 512x512    | PNG/JPG, max 1024KB |
| Screenshots     | 320-3840px | PNG/JPG, no alpha   |
| Feature graphic | 1024x500   | PNG/JPG, no alpha   |
| Promotional     | 180x120    | PNG/JPG, no alpha   |

## 6. Android splash screens

### Android 12+ (SDK 12.0.0+)

Android 12 uses the app icon as the splash screen automatically. Use adaptive icons for best results.

Customize splash background color via theme:

```xml
<!-- tiapp.xml -->
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application>
      <activity android:name="com.myapp.MyAppActivity"
                android:theme="@style/Theme.Custom.Splash" />
    </application>
  </manifest>
</android>
```

```xml
<!-- platform/android/res/values/splash_theme.xml -->
<resources>
  <style name="Theme.Custom.Splash" parent="@style/Theme.MaterialComponents.NoActionBar">
    <item name="android:windowBackground">@drawable/background_splash</item>
    <item name="android:windowSplashScreenBackground">@color/splash_bg</item>
  </style>

  <color name="splash_bg">#FF5722</color>
</resources>
```

```xml
<!-- platform/android/res/drawable/background_splash.xml -->
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/splash_bg"/>
  <item>
    <bitmap android:src="@drawable/splash_logo" android:gravity="center"/>
  </item>
</layer-list>
```

### Android < 12 (legacy)

Use `default.png` or nine-patch images. Android expects `default.png` (lowercase d) for splash screens. iOS uses `Default.png` with an uppercase D.

Warning: Do not use `<supports-screens/>` with `android:anyDensity` set to false. It can cause scaling issues with splash screens.

#### Nine-patch images (recommended)

Nine-patch images define stretchable regions for different screen sizes.

Creating:
1. Create a PNG with a 1 px transparent or white border.
2. Mark stretchable areas with black pixels on the top and left borders.
3. Mark content areas with black pixels on the right and bottom borders.
4. Name the file with a `.9.png` extension.

Usage:
```javascript
// Reference without .9 in code
const button = Ti.UI.createButton({
  backgroundImage: '/images/myimage.png'  // myimage.9.png on disk
});
```

#### Density-specific splash screens

```
platform/android/res/
├── drawable-ldpi/background.9.png
├── drawable-mdpi/background.9.png
├── drawable-hdpi/background.9.png
├── drawable-xhdpi/background.9.png
├── drawable-xxhdpi/background.9.png
├── drawable-xxxhdpi/background.9.png
└── drawable-nodpi/background.9.png  (universal fallback)
```

Warning: Do not use `drawable/` (without suffix). It causes scaling issues. Use `drawable-nodpi/` for universal images.

#### Custom theme splash screen

```xml
<!-- platform/android/res/values/mytheme.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <style name="Theme.MyTheme" parent="Theme.AppCompat">
    <item name="windowBackground">@drawable/background</item>
    <item name="android:windowBackground">@drawable/background</item>
  </style>
</resources>
```

```xml
<!-- tiapp.xml - override root activity theme -->
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application>
      <activity android:name=".YourapplicationnameActivity"
                android:theme="@style/Theme.MyTheme"
                android:configChanges="keyboardHidden|orientation|screenSize">
        <intent-filter>
          <action android:name="android.intent.action.MAIN"/>
          <category android:name="android.intent.category.LAUNCHER"/>
        </intent-filter>
      </activity>
    </application>
  </manifest>
</android>
```

## 7. Localized splash screens

### Android localization

Place images in `res-<lang>` folders:

```
Resources/android/images/
├── res-en/default.png
├── res-es/default.png
├── res-fr-long-land-hdpi/default.png
└── res-long-land-hdpi/default.png
```

Localized images take precedence over non-localized ones.

### iOS localization

Place them in `i18n/<lang>/`:

```
i18n/
├── en/
│   ├── Default@2x.png
│   └── Default-568h@2x.png
└── es/
    ├── Default@2x.png
    └── Default-568h@2x.png
```

## 8. Adaptive icons (Android 8.0+)

Adaptive icons use foreground and background layers.

Structure:
```
platform/android/res/
├── mipmap-anydpi-v26/
│   └── appicon.xml
├── drawable/
│   ├── ic_launcher_foreground.xml
│   └── ic_launcher_background.xml
```

appicon.xml:
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@drawable/ic_launcher_background"/>
  <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
```

## 9. Common issues

### Build fails - missing icons

If any app icon files are missing, the build fails. If launch image files (prefixed with `Default`) are missing, the build does not fail. If you have a `DefaultIcon.png` in the project root, the Titanium SDK auto-generates missing iTunesArtwork files.

Solution: Add `DefaultIcon.png` (1024x1024) to the project root for auto-generation.

### Android splash stretched or distorted

Solution: Use nine-patch images or the `drawable-nodpi` folder.

### iOS icons not updating

Solution:
1. Clean the project.
2. Delete the `build/` folder.
3. Rebuild.

### Android 12 splash not showing custom image

Solution: Android 12+ uses the app icon by default. You can only customize the background color via `windowSplashScreenBackground`.

## 11. iOS launch files (storyboards)

Since iOS 8, Apple recommends launch storyboards instead of multiple `Default*.png` images. You get one file that works across device sizes and a smaller IPA.

### Enabling launch storyboards

In the `<ios>` section of `tiapp.xml`:

```xml
<enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>
```

### Customizing background color

Set a default background color for the launch screen and the gap before the first view opens:

```xml
<default-background-color>#C7172C</default-background-color>
```

### Using images in storyboards

To use an image in a native Storyboard:
1. Set the Image View's `Image` property to the path under `app/assets/` without extension or modifiers.
2. App thinning note: If `use-app-thinning` is enabled, use the generated asset catalog name.
   - Build the app.
   - Find the `[hash].imageset` under `build/iphone/Assets.xcassets/`.
   - Use that hash value in the Storyboard.

### Launch file cache

iOS caches launch screen snapshots. If changes do not appear:
1. Reset Content and Settings in the Simulator.
2. Run `ti clean` or Project > Clean.

## Best practices

1. Use `DefaultIcon.png` for automatic icon generation.
2. Use nine-patch for Android splash screens.
3. Test on multiple densities, especially Android.
4. Keep icons simple. Details vanish at small sizes.
5. No alpha channel on app icons.
6. Square icons only.
7. Clean the project after icon changes.
8. Use adaptive icons for Android 8.0+.
