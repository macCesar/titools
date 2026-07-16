# Custom AndroidManifest.xml

For most Android manifest settings, use `tiapp.xml`. Only create a custom manifest when you really need it.

## Preferred method: tiapp.xml

Add manifest entries in `tiapp.xml` inside the `<android>` section:

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
        <!-- SDK version -->
        <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

        <!-- Screen support -->
        <supports-screens
            android:smallScreens="false"
            android:normalScreens="true"
            android:largeScreens="true"
            android:xlargeScreens="true"
        />

        <!-- Permissions -->
        <uses-permission android:name="android.permission.CAMERA" />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

        <!-- Application attributes (merged, not replaced) -->
        <application android:debuggable="true" />
    </manifest>
</android>
```

## How merging works

- Most elements are replaced by your entry.
- The `<application>` element is merged additively by attribute.
- Activities and services are added to existing ones.

## Custom manifest (rare cases)

If you need full control, create `platform/android/AndroidManifest.xml`:

```
MyApp/
├── app/
├── platform/
│   └── android/
│       └── AndroidManifest.xml  # Custom manifest
└── tiapp.xml
```

Warning: you must maintain this file manually through SDK updates.

## Common use cases

### Camera permission
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

### Hardware requirements
```xml
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

### Launch mode
```xml
<application android:launchMode="singleTask" />
```

### Deep links
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" android:host="path" />
</intent-filter>
```

## Debugging

To see the generated manifest:
```bash
ti build -p android
# Check: build/android/AndroidManifest.xml.gen
```

## Enable manifest merge (CLI 7.0+)

If you use a custom manifest, enable merge in `tiapp.xml`:

```bash
ti config android.mergeCustomAndroidManifest true
```

This merges your custom manifest with the generated one instead of replacing it.
