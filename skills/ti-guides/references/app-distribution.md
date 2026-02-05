# App distribution guide

Guide for distributing Titanium apps to Google Play (Android) and the App Store (iOS).

## Android distribution

### 1. Generate keystore and certificate

Create a keystore for signing your app:

```bash
keytool -genkeypair -v -keystore android.keystore -alias helloworld -keyalg RSA -sigalg SHA1withRSA -validity 10000
```

Requirements:
- `keyalg`: RSA (required by Google Play)
- `sigalg`: SHA1withRSA (Android 4.3-) or SHA256withRSA (Android 4.4+)
- `validity`: 10000 days minimum (~25 years)

Save your keystore password securely. If it is lost, you cannot release updates.

### 2. Verify keystore

```bash
keytool -list -v -keystore android.keystore
```

### 3. Build for Google Play

CLI command:
```bash
ti build -p android -T dist-playstore [-K <KEYSTORE_FILE> -P <KEYSTORE_PASSWORD> -L <KEYSTORE_ALIAS> -O <OUTPUT_DIRECTORY>]
```

Example:
```bash
ti build -p android -T dist-playstore -K ~/android.keystore -P secret -L foo -O ./dist/
```

Output files:
- `.apk`: legacy format (still supported)
- `.aab`: Android App Bundle (preferred, smaller downloads). Requires Titanium 9.0.0+. An AAB file cannot be installed directly on a device. After upload, Google Play generates device-specific APKs split by CPU architecture and image density.

### 4. Verify APK signing

```bash
jarsigner -verify -verbose path/yourapp.apk
```

### 5. Deploy to device for testing

Using CLI:
```bash
ti build -p android -T device --device-id "<DEVICE_ID>"
```

Using adb:
```bash
adb install -r your_project/build/android/bin/app.apk
adb uninstall com.your.appid
```

Remote testing:
- Host the APK on a web server or Dropbox and email a link
- Use HockeyKit/HockeyApp for beta distribution

### 6. Google Play submission requirements

Required assets:
- At least 2 screenshots (320x480, 480x800, or 480x854)
- High-res icon (512x512)
- Title, description (4000 chars max)
- Promo text (80 chars max)
- Category and content rating
- Contact information

Versioning in `tiapp.xml`:
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest android:versionCode="2" android:versionName="1.0.1"/>
</android>
```

- `versionCode`: must be a 32-bit integer and increment for each update. No floating point values.
- `versionName`: string in any format you choose

### 7. SD card installation

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
   <manifest android:installLocation="preferExternal"/>
</android>
```

Values: `preferExternal`, `auto`, `internalOnly`

---

## iOS distribution

### 1. Distribution types

- App Store: public distribution via App Store (formerly iTunes Connect, now App Store Connect)
- Ad Hoc: limited testing (max 100 devices per year; devices cannot be removed once registered, so use care when registering)
- In House: enterprise distribution for employees (Enterprise program only)

### 2. Create distribution certificate

Certificate types:
- Development certificate: each developer can have their own, used for test builds.
- Distribution certificate: a single certificate for the entire team. Only the Team Agent (account owner) can create it.

Steps:
1. Log in to Apple Developer Member Center as Team Agent or Admin.
2. Go to Certificates, Identifiers & Profiles, then Certificates.
3. Click +, then choose App Store and Ad Hoc.
4. Create a CSR (Certificate Signing Request) in Keychain Access.
5. Upload the CSR and generate the certificate.
6. Download and install the `.cer` file.
7. Export the private key as a `.p12` file (File > Export Items).

### 3. Create distribution provisioning profile

1. In Member Center, go to Provisioning Profiles.
2. Click + and select the distribution type.
3. Select an App ID.
4. Select the distribution certificate.
5. For Ad Hoc, select test devices.
6. Name the profile (include "distribution" or "ad hoc").
7. Download the `.mobileprovision` file and install it (drag to Xcode).

### 4. Create App ID on App Store Connect

App Store Connect is the portal for app distribution management.

1. Log in to App Store Connect.
2. Go to Manage Your Apps, then Add New App.
3. Provide:
   - App name
   - SKU number (unique ID)
   - Bundle ID (must match App ID from Developer Portal)
4. Configure:
   - Availability date
   - Price tier
   - Version number
   - Description (4000 chars max)
   - Category, keywords (100 chars max)
   - Copyright
   - Support URL
   - Rating info
   - High-res icon: 1024x1024, 72 DPI, RGB, flat artwork
   - Screenshots:
     - iPhone (3.5"): 960x640, 960x600, 640x960, or 640x920
     - iPhone (4"): 1136x640, 1136x600, 640x1136, or 640x1096
     - iPad: 1024x768, 1024x748, 768x1024, 768x1004, 2048x1536, 2048x1496, 1536x2048, or 1536x2008
5. Click Ready to Upload Binary.

### 5. Build and package

CLI command - Ad Hoc:
```bash
ti build -p ios -T dist-adhoc [-R <DISTRIBUTION_CERTIFICATE_NAME> -P <PROVISIONING_PROFILE_UUID> -O <OUTPUT_DIRECTORY>]
```

Example:
```bash
ti build -p ios -T dist-adhoc -R "Pseudo, Inc." -P "FFFFFFFF-EEEE-DDDD-CCCC-BBBBBBBBBBBB" -O ./dist/
```

CLI command - App Store:
```bash
ti build -p ios -T dist-appstore [-R <DISTRIBUTION_CERTIFICATE_NAME> -P <PROVISIONING_PROFILE_UUID>]
```

Example:
```bash
ti build -p ios -T dist-appstore -R "Pseudo, Inc." -P "AAAAAAAA-0000-9999-8888-777777777777"
```

The CLI installs the package to Xcode's Organizer.

### 6. Upload to App Store Connect

1. Open Xcode, then Window, then Organizer.
2. Select your app archive.
3. Click Verify to validate against the App Store Connect app definition.
4. Click Submit to upload.
5. Status changes to Waiting for Review.

### 7. Ad Hoc distribution

Testers need:
- The `.mobileprovision` file installed on their device
- The `.ipa` package file

Installation method:
1. Connect the device to a Mac.
2. Open Xcode, then Window, then Devices.
3. Select the device, then Installed Apps, then +.
4. Select the IPA file.
