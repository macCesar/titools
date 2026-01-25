# App Distribution Guide

Complete guide for distributing Titanium apps to Google Play (Android) and App Store (iOS).

## Android Distribution

### 1. Generate Keystore and Certificate

Create a keystore for signing your app:

```bash
keytool -genkeypair -v -keystore android.keystore -alias helloworld -keyalg RSA -sigalg SHA1withRSA -validity 10000
```

**Requirements:**
- `keyalg`: RSA (required by Google Play)
- `sigalg`: SHA1withRSA (Android 4.3-) or SHA256withRSA (Android 4.4+)
- `validity`: 10000 days minimum (~25 years)

**CRITICAL**: Save your keystore password securely. If lost, you cannot release updates.

### 2. Verify Keystore

```bash
keytool -list -v -keystore android.keystore
```

### 3. Build for Google Play

**CLI command:**
```bash
ti build -p android -T dist-playstore [-K <KEYSTORE_FILE> -P <KEYSTORE_PASSWORD> -L <KEYSTORE_ALIAS> -O <OUTPUT_DIRECTORY>]
```

**Example:**
```bash
ti build -p android -T dist-playstore -K ~/android.keystore -P secret -L foo -O ./dist/
```

**Output files:**
- `.apk` - Legacy format (still supported)
- `.aab` - Android App Bundle (preferred, smaller downloads)

### 4. Verify APK Signing

```bash
jarsigner -verify -verbose path/yourapp.apk
```

### 5. Deploy to Device for Testing

**Using CLI:**
```bash
ti build -p android -T device --device-id "<DEVICE_ID>"
```

**Using adb:**
```bash
adb install -r your_project/build/android/bin/app.apk
adb uninstall com.your.appid
```

**Remote testing:**
- Host APK on web/Dropbox and email link
- Use HockeyKit/HockeyApp for beta distribution

### 6. Google Play Submission Requirements

**Required assets:**
- Minimum 2 screenshots (320x480, 480x800, or 480x854)
- High-res icon (512x512)
- Title, description (4000 chars max)
- Promo text (80 chars max)
- Category and content rating
- Contact information

**Versioning in tiapp.xml:**
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest android:versionCode="2" android:versionName="1.0.1"/>
</android>
```

- `versionCode`: Integer, must increment for each update
- `versionName`: String, any format you prefer

### 7. SD Card Installation

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
   <manifest android:installLocation="preferExternal"/>
</android>
```

Values: `preferExternal`, `auto`, `internalOnly`

---

## iOS Distribution

### 1. Distribution Types

- **App Store**: Public distribution via iTunes Store
- **Ad Hoc**: Limited testing (max 100 devices)
- **In House**: Enterprise distribution for employees (Enterprise program only)

### 2. Create Distribution Certificate

1. Log in to [Apple Developer Member Center](https://developer.apple.com/membercenter/)
2. Go to **Certificates, Identifiers & Profiles** > **Certificates**
3. Click **+** > **App Store and Ad Hoc**
4. Create a CSR (Certificate Signing Request) in Keychain Access
5. Upload CSR and generate certificate
6. Download and install the `.cer` file
7. **CRITICAL**: Export private key as `.p12` file (File > Export Items)

### 3. Create Distribution Provisioning Profile

1. In [Member Center](https://developer.apple.com/membercenter/), go to **Provisioning Profiles**
2. Click **+** > select distribution type
3. Select App ID
4. Select distribution certificate
5. For Ad Hoc: select test devices
6. Name profile (include "distribution" or "ad hoc")
7. Download `.mobileprovision` and install (drag to Xcode icon)

### 4. Create App ID on iTunes Connect

1. Log in to [iTunes Connect](https://itunesconnect.apple.com)
2. **Manage Your Apps** > **Add New App**
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
5. Click **Ready to Upload Binary**

### 5. Build and Package

**CLI command - Ad Hoc:**
```bash
ti build -p ios -T dist-adhoc [-R <DISTRIBUTION_CERTIFICATE_NAME> -P <PROVISIONING_PROFILE_UUID> -O <OUTPUT_DIRECTORY>]
```

**Example:**
```bash
ti build -p ios -T dist-adhoc -R "Pseudo, Inc." -P "FFFFFFFF-EEEE-DDDD-CCCC-BBBBBBBBBBBB" -O ./dist/
```

**CLI command - App Store:**
```bash
ti build -p ios -T dist-appstore [-R <DISTRIBUTION_CERTIFICATE_NAME> -P <PROVISIONING_PROFILE_UUID>]
```

**Example:**
```bash
ti build -p ios -T dist-appstore -R "Pseudo, Inc." -P "AAAAAAAA-0000-9999-8888-777777777777"
```

The CLI installs the package to Xcode's Organizer.

### 6. Upload to iTunes Connect

1. Open Xcode > **Window** > **Organizer**
2. Select your app archive
3. Click **Verify** (validates against iTunes Connect app definition)
4. Click **Submit** (uploads app)
5. Status changes to **Waiting for Review**

### 7. Ad Hoc Distribution

Testers need:
- The `.mobileprovision` file installed on their device
- The `.ipa` package file

**Installation method:**
1. Connect device to Mac
2. Open Xcode > **Window** > **Devices**
3. Select device > **Installed Apps** > **+**
4. Select IPA file

### 8. App Store Requirements

Apple's guidelines include:
- Apps must be useful, well-designed, and error-free
- No downloading/executing code
- You must own all copyrights and trademarks
- No hidden features or non-public APIs
- [Full guidelines](http://developer.apple.com/appstore/resources/approval/guidelines.html)

---

## Device Deployment Testing

### Android Device Setup

1. Enable **Developer options** (tap **Build number** 7 times in **About**)
2. Enable **USB debugging** in **Developer options**
3. Enable **Unknown sources** in **Security**
4. Connect via USB (use data cable, not power-only)
5. Allow USB debugging when prompted

**Windows only**: Install [OEM USB drivers](http://developer.android.com/sdk/oem-usb.html)

### iOS Device Setup

Requires development certificate and provisioning profile. See [Deploying to iOS devices](#ios-distribution).

---

## Troubleshooting

### Android: Device Not Recognized

```bash
adb devices        # Check connected devices
adb kill-server    # Restart adb
adb start-server
adb devices        # Verify
```

### Android: Check Platform Compatibility

```bash
ti info -p android
```

### iOS: Mavericks Permission Issues

Grant CLI access in **System Preferences** > **Security & Privacy** > **Privacy**

### General: Clean Build Folder

```bash
ti clean [-p <PLATFORM>]
```

---

## References

- [Google Play Developer Policies](http://play.google.com/about/developer-content-policy.html)
- [Google Play Graphic Assets](http://support.google.com/googleplay/android-developer/bin/answer.py?hl=en&answer=1078870)
- [iTunes Connect Developer Guide](http://developer.apple.com/library/mac/#documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/)
- [iOS App Store Review Guidelines](http://developer.apple.com/appstore/resources/approval/guidelines.html)
