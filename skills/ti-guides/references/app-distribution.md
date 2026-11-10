# App distribution guide

## Release prerequisites and identities

Use a shipped SDK and compatible native modules, keep the app ID stable, and build distributed artifacts with `--deploy-type production`. Distribution targets imply production; development leaves debugging enabled. Android needs a developer account and signing keystore; iOS needs macOS, paid Apple Developer membership, a distribution certificate/private key and a profile matching the app ID and distribution method. Uploading an artifact is separate from submitting review or rolling out a release.

Back up signing credentials and passwords securely; exclude keystores, `.p12` files, provisioning files and secrets from source control. A certificate downloaded without its private key cannot sign. Export an encrypted `.p12` from the originating keychain when moving a team identity to another Mac. Xcode Settings → Accounts → Manage Certificates or the developer portal creates identities; available actions depend on account role, not an unconditional “only Team Agent” rule. Inspect detected certificates/profile UUIDs with `ti info -t ios`.

## Android: keystore, bundle and release track

```sh
keytool -genkeypair -v -keystore myapp.keystore -alias myapp -keyalg RSA -keysize 2048 -validity 10000
keytool -list -v -keystore myapp.keystore
ti build -p android -T dist-playstore -K /secure/myapp.keystore -L myapp -O ./dist
```

Let the CLI prompt for the password. CI can supply `--store-password` and, when distinct, `--key-password` from its secret system; command-line values can appear in logs/history. VS Code can remember `titanium.android.keystorePath` and `titanium.android.keystoreAlias`; do not put the password in settings. Avoid legacy SHA-1 generation advice.

Current Google Play submissions use an `.aab` Android App Bundle. Play creates device-specific APKs; an AAB cannot be installed with `adb install`. Test the actual bundle through a Play internal track or Google's bundletool, not only a debug APK. A locally installable APK can be checked with `apksigner verify --verbose --print-certs app.apk`; `jarsigner` alone does not verify every modern APK signature scheme.

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest android:versionCode="2" android:versionName="1.0.1"/>
</android>
```

Increase the integer `android:versionCode` on every upload. The human `<version>`/versionName is separate. Check the current Play Console limit and annual target API policy; SDK 13.4.1 defaults to API 36. Compile API (`tool-api-level`) and target API are distinct settings. Provide store text/artwork, content rating, privacy policy and Data safety responses reflecting actual app/module collection and merged permissions. Screenshot/device requirements change; use Console's current required slots rather than archived 320×480 rules.

Upload to internal, closed, open or production track, then explicitly roll out that track. For direct device development use `ti build -p android -T device --device-id <id>`; a test APK installs with `adb install -r app.apk`. Uninstalling first deletes local data and is not a harmless update step.

Play App Signing holds the app-signing key and lets you use a separate upload key. Losing a resettable upload key is different from losing the only self-managed app-signing key; check the app's signing setup before concluding updates are impossible. Follow [Google's signing and upload-key reset procedure](https://support.google.com/googleplay/android-developer/answer/9842756). Retain independent backups even with managed signing.

## iOS: provisioning, archive and review

Create an App ID matching `<id>`, a distribution certificate, then a profile for that App ID/certificate. Ad Hoc profiles must contain every tester UDID; device quotas and annual registration rules are controlled by Apple. Download/install the profile and verify the certificate's private key in Keychain.

```sh
ti build -p ios -T dist-appstore -R "Apple Distribution: Example Ltd (ABCDE12345)" -P <profile-uuid> -O ./dist
ti build -p ios -T dist-adhoc -R "Apple Distribution: Example Ltd (ABCDE12345)" -P <adhoc-profile-uuid> -O ./dist
```

The App Store target creates an archive for Xcode Organizer and exports an IPA to the output directory; inspect the build log for actual archive/export paths. Validate and distribute through Xcode Organizer, or upload an exported signed IPA through Transporter using the supported Apple workflow. Uploading does not submit review: create/select the App Store Connect app record (name, language, SKU and matching bundle ID), attach the processed build to a version, complete metadata/privacy/export answers, and submit. Ad Hoc IPA installation requires a device listed in the embedded profile; use Xcode's device tooling or a supported installation service. TestFlight is the normal store-managed beta path.

Keep marketing version `<version>` and upload build number distinct. Set `CFBundleVersion` in `<ios><plist><dict>` to increase build numbers without unnecessarily changing the marketing version. Do not reuse a build number already uploaded for that version.

Before submission verify:

- Real permission purpose strings under `<ios><plist><dict>`, plus runtime permission requests. Missing required strings can crash permission access; generic reasons can fail review.
- A correct `PrivacyInfo.xcprivacy` based on actual required-reason APIs and data collection. For the 13.4.1 bundle resource pipeline use `Resources/iphone/PrivacyInfo.xcprivacy` (Classic), or `app/assets/iphone/PrivacyInfo.xcprivacy` (Alloy). Verify it exists at the built app's root. Bare `platform/ios/PrivacyInfo.xcprivacy` goes to the native build directory, not automatically the app bundle root.
- Required screenshots, icon, categories, age rating, support/privacy URLs, login/demo access, and device-family/OS support. Current App Store Connect requirements replace archive-era 3.5-inch screenshot tables.
- The selected capabilities, profile and entitlements agree, and the release launches on real supported devices.

## JavaScript encryption and debugging

SDK 13.4.1 uses `ti.cloak` internally. Development does not encrypt; test and production encrypt/minify, while test keeps debugging and production disables it. `dist-appstore` and `dist-playstore` use production. The new website's alternative `<encryption>ti.crypt</encryption>` selector is not present in the 13.4.1 builders and must not be offered as GA configuration.

Encryption deters casual inspection; the application must decrypt its code to run, so it is not a security boundary. Embedded server secrets remain recoverable in JavaScript, JSON, properties or `tiapp.xml`. Keep them on a server and use appropriate native secure storage for user credentials. Reproduce encryption-specific bugs with test deploy type; preserve source maps securely when emitting them.

Complete Apple's encryption/export declaration according to the app's actual cryptography. `ITSAppUsesNonExemptEncryption=false` belongs in `<ios><plist><dict>` only when the app qualifies for that answer; do not set it universally because a template did. Consult Apple's current criteria for the specific app.

Sources: [distribution](https://titaniumsdk.com/docs/distribute.md), [signing](https://titaniumsdk.com/docs/distribute/signing.md), [iOS](https://titaniumsdk.com/docs/distribute/ios.md), [Android](https://titaniumsdk.com/docs/distribute/android.md), [encryption](https://titaniumsdk.com/docs/distribute/encryption.md), and [Apple certificates](https://developer.apple.com/help/account/certificates/certificates-overview).
