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

---

## Mac Catalyst distribution (Mac App Store)

Mac Catalyst allows you to run your iPad app on macOS. Titanium SDK 13.1.1.GA and later supports building for Mac Catalyst.

### 1. Enable Mac Catalyst for your App ID

1. Go to [Apple Developer → Identifiers](https://developer.apple.com/account/resources/identifiers/list)
2. Select your App ID or create a new one
3. Enable **Mac Catalyst** capability
4. Save the changes

### 2. Create Mac App Store Distribution Certificate

1. Go to [Apple Developer → Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click **+** to create a new certificate
3. Select **Mac App Store Distribution**
4. Upload your CSR (Certificate Signing Request)
5. Download and install the certificate

### 3. Mac Catalyst build targets

Titanium provides two targets for Mac Catalyst:

| Target | Description | Configuration |
|--------|-------------|---------------|
| `macos` | Development builds for testing on Mac | Debug-maccatalyst |
| `dist-macappstore` | Production builds for Mac App Store | Release-maccatalyst |

### 4. Build for Mac Catalyst (Development)

```bash
ti build -p ios -T macos
```

The `.app` bundle will be created at:
```
build/iphone/build/Products/Debug-maccatalyst/AppName.app
```

For a production-ready build:
```bash
ti build -p ios -T macos --deploy-type production
```

The `.app` bundle will be at:
```
build/iphone/build/Products/Release-maccatalyst/AppName.app
```

### 5. Build for Mac App Store (Distribution)

```bash
ti build -p ios -T dist-macappstore [-R <CERTIFICATE_NAME>]
```

Example:
```bash
ti build -p ios -T dist-macappstore -R "Apple Distribution: Your Team Name (TEAM_ID)"
```

If you omit the `-R` flag, Titanium will prompt you to select a certificate.

**What happens during the build:**
- Uses `Release-maccatalyst` configuration
- Sets code signing to Manual with identity `-`
- Creates a `.xcarchive` for Mac App Store
- Installs the archive in Xcode's Organizer
- Destination: `generic/platform=macOS`

### 6. Upload to Mac App Store Connect

1. Open Xcode → Window → Organizer
2. Select your Mac Catalyst archive
3. Click **Validate App** to check for issues
4. Click **Distribute App**
5. Select **Mac App Store**
6. Follow the prompts to upload

### 7. Create app listing in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps → + → New App**
3. Select **Mac** as platform
4. Enter app details:
   - Name
   - Primary Language
   - Bundle ID (must match your App ID with Mac Catalyst enabled)
   - SKU
5. Complete required metadata:
   - Description
   - Keywords
   - Screenshots (Mac-specific sizes)
   - Category
   - Age rating

### 8. Mac Catalyst entitlements

Add Mac-specific entitlements in `tiapp.xml`:

```xml
<ios>
  <entitlements>
    <dict>
      <!-- File access for saving to Downloads -->
      <key>com.apple.security.files.user-selected.read-write</key>
      <true/>
      <key>com.apple.security.files.downloads.read-write</key>
      <true/>

      <!-- App sandbox (required for Mac App Store) -->
      <key>com.apple.security.app-sandbox</key>
      <true/>

      <!-- Network access -->
      <key>com.apple.security.network.client</key>
      <true/>

      <!-- Additional entitlements as needed -->
      <key>com.apple.security.print</key>
      <true/>
    </dict>
  </entitlements>
</ios>
```

### 9. Common issues

**Issue**: "No suitable signing certificate found"
- Ensure you have a **Mac App Store Distribution Certificate** (not iOS Distribution)
- The certificate must be installed in your Keychain

**Issue**: Build fails with code signing errors
- Verify your App ID has Mac Catalyst enabled
- Check that the certificate matches the App ID
- Try cleaning the build: `ti clean -p ios`

**Issue**: App crashes on launch
- Verify entitlements are correctly configured
- Check Console.app for crash logs
- Ensure all required capabilities are enabled

### 10. Versioning

Update version numbers in `tiapp.xml`:

```xml
<ti:app xmlns:ti="http://ti.tidev.io">
  <id>com.yourcompany.yourapp</id>
  <name>Your App Name</name>
  <version>1.0.0</version>
  <publisher>Your Company</publisher>
  ...
</ti:app>
```

- `version`: Display version (e.g., "1.0.0")
- For iOS, use `pv-version-code` in `<ios>` section for build number
- For Mac, the build number can be set in Xcode or via `CFBundleVersion`

### 11. Testing on Mac

Before submitting to Mac App Store:

1. Build with `macos` target for testing
2. Run the app on different Mac architectures (Intel and Apple Silicon)
3. Test all features that use file system, network, and other sandboxed resources
4. Verify entitlements are working correctly
5. Test on macOS versions you plan to support

---
