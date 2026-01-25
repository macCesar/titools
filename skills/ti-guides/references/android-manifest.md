# Custom AndroidManifest.xml

For most Android manifest settings, use `tiapp.xml`. Only create a custom manifest when absolutely necessary.

## Preferred Method: tiapp.xml

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

## How Merging Works

- **Most elements**: Replaced by your entry
- **`<application>` element**: Attributes are merged additively
- **Activities/Services**: Added to existing ones

## Custom Manifest (Rare Cases)

If you need full control, create `platform/android/AndroidManifest.xml`:

```
MyApp/
├── app/
├── platform/
│   └── android/
│       └── AndroidManifest.xml  # Custom manifest
└── tiapp.xml
```

**Warning**: You must maintain this file manually through SDK updates.

## Common Use Cases

### Camera Permission
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

### Hardware Requirements
```xml
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

### Launch Mode
```xml
<application android:launchMode="singleTask" />
```

### Deep Links
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

## Enable Manifest Merge (CLI 7.0+)

If using custom manifest, enable merge in `tiapp.xml`:

```bash
ti config android.mergeCustomAndroidManifest true
```

This merges your custom manifest with the generated one instead of replacing it.
