# Titanium CLI Reference

Complete reference for Titanium CLI commands, options, and configuration.

## Environment Setup

### Check Environment

```bash
ti setup check
```

Reports configured tools and potential issues.

### Get System Info

```bash
ti info
```

Detailed environment info (SDKs, certificates, provisioning profiles).

```bash
ti info -p android  # Android-specific info
ti info -p ios      # iOS-specific info
```

### Configure CLI

```bash
# Display current config
ti config

# Set option
ti config cli.logLevel info

# Append to path
ti config -a paths.hooks "/path/to/hook"

# Remove all Android options
ti config -r android
```

**Alternative methods:**
```bash
# Pass JSON string
ti build -p ios --config "{ paths: { hooks: '/path/to/hook' } }"

# Pass JSON file
ti build -p ios --config-file "/Users/me/customConfig.json"
```

---

## Project Commands

### Create Project

```bash
ti create -t app --id <APP_ID> -n <APP_NAME> -p <PLATFORMS> -d <WORKSPACE> -u <URL>
```

**Example:**
```bash
ti create -t app --id com.appcelerator.sample -n SampleProject -p android,ios -d ~/Documents/workspace -u https://titaniumsdk.com
```

**Parameters:**
- `-t, --type`: Project type (`app`)
- `--id`: App ID (reverse domain notation)
- `-n, --name`: App name
- `-p, --platforms`: Comma-separated platforms (`android`, `ios`, `ipad`, `iphone`)
- `-d, --dir`: Workspace directory
- `-u, --url`: App URL

### Build Project

```bash
ti build -p <PLATFORM> [OPTIONS]
```

---

## Build Commands

### Android Emulator

```bash
ti build -p android [-C <EMULATOR_NAME>]
```

**Example:**
```bash
ti build -p android -C "Google Nexus 7 - 4.4.2 - API 19 - 800x1280"
```

List emulators: `ti info -p android`

### Android Device

```bash
ti build -p android -T device -C <DEVICE_ID>
```

**Example:**
```bash
ti build -p android -T device -C deadbeef
```

Omit `-C` if only one device connected.

### iOS Simulator

```bash
ti build -p ios [-C <SIMULATOR_NAME>]
```

**Example:**
```bash
ti build -p ios -C "iPad Retina"
```

### iOS Device

```bash
ti build -p ios -T device -C <DEVICE_UDID> [-V "<CERT_NAME>" -P <PROFILE_UUID>]
```

**Example:**
```bash
ti build -p ios -T device -C itunes -V "Loretta Martin (GE7BAC5)" -P "11111111-2222-3333-4444-555555555555"
```

Omit `-V` and `-P` to be prompted.

### Clean Build

```bash
ti clean [-p <PLATFORM>]
```

**Examples:**
```bash
ti clean          # All platforms
ti clean -p ios   # iOS only
```

---

## Distribution Commands

### Google Play (Android)

```bash
ti build -p android -T dist-playstore [-K <KEYSTORE> -P <PASSWORD> -L <ALIAS> -O <OUTPUT>]
```

**Example:**
```bash
ti build -p android -T dist-playstore -K ~/android.keystore -P secret -L foo -O ./dist/
```

**If key password differs from keystore password:**
```bash
--key-password <KEYPASS>
```

### Ad Hoc (iOS)

```bash
ti build -p ios -T dist-adhoc [-R <CERT_NAME> -P <PROFILE_UUID> -O <OUTPUT>]
```

**Example:**
```bash
ti build -p ios -T dist-adhoc -R "Pseudo, Inc." -P "FFFFFFFF-EEEE-DDDD-CCCC-BBBBBBBBBBBB" -O ./dist/
```

### App Store (iOS)

```bash
ti build -p ios -T dist-appstore [-R <CERT_NAME> -P <PROFILE_UUID>]
```

**Example:**
```bash
ti build -p ios -T dist-appstore -R "Pseudo, Inc." -P "AAAAAAAA-0000-9999-8888-777777777777"
```

Installs package to Xcode Organizer.

---

## SDK Management

### List SDKs

```bash
ti sdk list
```

### Select SDK

```bash
ti sdk select
```

Interactive selection of default SDK.

---

## Configuration Options

### Android Options

| Option | Default | Description |
|--------|---------|-------------|
| `android.sdkPath` | auto | Android SDK path |
| `android.ndkPath` | auto | Android NDK path |
| `android.adb.port` | 5037 | ADB port number |
| `android.autoSelectDevice` | true | Auto-select device/emulator |
| `android.symlinkResources` | true (OS X) | Symlink vs copy resources |
| `android.buildTools.selectedVersion` | max | Build tools version |
| `android.javac.maxmemory` | "1024M" | JVM heap size |
| `android.javac.source` | "1.6" | Java source version |
| `android.javac.target` | "1.6" | Java target version |
| `android.mergeCustomAndroidManifest` | false | Merge custom AndroidManifest.xml |

### iOS Options

| Option | Default | Description |
|--------|---------|-------------|
| `ios.developerName` | - | Developer certificate name |
| `ios.distributionName` | - | Distribution certificate name |
| `ios.autoSelectDevice` | true | Auto-select device/simulator |
| `ios.symlinkResources` | true (OS X) | Symlink vs copy resources |

### CLI Options

| Option | Default | Description |
|--------|---------|-------------|
| `cli.logLevel` | trace | Log level: error, warning, info, debug, trace |
| `cli.colors` | true | Color output |
| `cli.progressBars` | true | Show progress bars |
| `cli.prompt` | true | Prompt for missing info |
| `cli.quiet` | false | Suppress all output |
| `cli.rejectUnauthorized` | true | Reject bad SSL certs |
| `cli.width` | 100 | Text wrap width |
| `cli.failOnWrongSDK` | false | Fail on SDK mismatch |
| `cli.hideCharEncWarning` | false | Hide encoding warnings |
| `cli.httpProxyServer` | - | Proxy server URL |

### SDK Options

| Option | Description |
|--------|-------------|
| `sdk.defaultInstallLocation` | SDK install location (OS-specific) |
| `sdk.selected` | Selected SDK version (REQUIRED) |

### Paths

| Option | Description |
|--------|-------------|
| `paths.commands` | Additional CLI command scripts |
| `paths.hooks` | CLI hook scripts |
| `paths.modules` | Module search paths |
| `paths.plugins` | Plugin search paths |
| `paths.sdks` | SDK search paths |
| `paths.xcode` | Xcode installation paths |

### Java Options

| Option | Description |
|--------|-------------|
| `java.home` | JDK directory |
| `java.executables.java` | java executable path |
| `java.executables.javac` | javac executable path |
| `java.executables.jarsigner` | jarsigner executable path |
| `java.executables.keytool` | keytool executable path |

### Genymotion Options

| Option | Description |
|--------|-------------|
| `genymotion.enabled` | Enable Genymotion support |
| `genymotion.path` | Genymotion app directory |
| `genymotion.executables.genymotion` | genymotion executable |
| `genymotion.executables.player` | player executable |
| `genymotion.executables.vboxmanage` | vboxmanage executable |

### Application Options

| Option | Description |
|--------|-------------|
| `app.idprefix` | Prefix for new app IDs |
| `app.publisher` | Default publisher |
| `app.url` | Default company URL |
| `app.workspace` | Default workspace directory |
| `app.skipAppIdValidation` | Skip app ID validation |
| `app.skipVersionValidation` | Skip version validation |

---

## Common Issues

### Android SDK Not Found

```bash
! sdk                Android SDK not found
! targets            no targets found
! avds               no avds found
```

**Solution:**
```bash
ti config android.sdkPath /path/to/android-sdk
```

### Xcode Too Old

```bash
! Xcode 4.3 is too old and is no longer supported by Titanium SDK 3.3.0
```

**Solution:** Install newer Xcode from Mac App Store.

### Clean Build Issues

```bash
ti clean -p ios
ti clean -p android
```

### ADB Device Issues

```bash
adb kill-server
adb start-server
adb devices
```

---

## Command Quick Reference

| Command | Description |
|---------|-------------|
| `ti setup check` | Check environment setup |
| `ti info` | Display system info |
| `ti info -p <PLATFORM>` | Platform-specific info |
| `ti config` | Display/set config |
| `ti create` | Create new project |
| `ti build` | Build project |
| `ti clean` | Clean build folder |
| `ti sdk list` | List installed SDKs |
| `ti sdk select` | Select default SDK |

---

## SDK Version Precedence

1. `tiapp.xml` `<sdk-version>` tag
2. `--sdk` CLI option
3. `app.sdk` config setting
4. Selected SDK (`ti sdk select`)

---

## References

- [Titanium CLI GitHub](https://github.com/appcelerator/titanium-cli)
- [Android SDK Manager](http://developer.android.com/sdk)
- [Xcode Downloads](https://developer.apple.com/xcode/downloads/)
