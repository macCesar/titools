# Titanium CLI Reference

Complete reference for Titanium CLI commands, options, and configuration.

## Environment Setup

### Check Environment

```bash
ti setup check
```

Reports configured tools and potential issues.

### Setup Wizard

```bash
ti setup
ti setup <section>
```

Runs the interactive setup wizard. The `<section>` can be one of: **quick**, **check**, **user**, **app**, **network**, **cli**, **sdk**, **ios**, **android**, and **paths**.

### Get System Info

```bash
ti info
```

Detailed environment info (SDKs, certificates, provisioning profiles).

```bash
ti info -p android  # Android-specific info
ti info -p ios      # iOS-specific info
```

#### Info Options

| Option | Description |
| --- | --- |
| `-o, --output <value>` | Output format: **report** or **json**. Defaults to **report**. |
| `-t, --types <value>` | Comma-separated list of types: **all**, **os**, **nodejs**, **titanium**, **ios**, **jdk**, **haxm**, **android**. Defaults to **all**. |

### Help

Displays the help screen for the CLI or a specific command.

```bash
ti help
ti help <command>
ti --help
ti <command> --help
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

#### Config Options

| Option | Description |
| --- | --- |
| `-a, --append` | Append a value to a key containing a list of values. |
| `-r, --remove` | Remove the specified config key and all its descendants. |
| `-o, --output <value>` | Output format: **report**, **json**, or **json-object**. Defaults to **report**. |

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

**For Alloy projects (recommended):**
```bash
ti create -t app --alloy --id <APP_ID> -n <APP_NAME> -p <PLATFORMS> -d <WORKSPACE> -u <URL>
```

**Example (Alloy):**
```bash
ti create -t app --alloy --id com.titaniumsdk.sample -n SampleProject -p android,ios -d ~/Documents/workspace -u https://titaniumsdk.com
```

**For Classic Titanium projects:**
```bash
ti create -t app --id <APP_ID> -n <APP_NAME> -p <PLATFORMS> -d <WORKSPACE> -u <URL>
```

**Parameters:**
- `--alloy`: Create an Alloy project (recommended for new projects)
- `-t, --type`: Project type: **app** (default), **applewatch**, **module** (or **timodule**)
- `--id`: App ID (reverse domain notation)
- `-n, --name`: App name
- `-p, --platforms`: Comma-separated platforms (`android`, `ios`, `ipad`, `iphone`)
- `-d, --workspace-dir`: Workspace directory
- `-u, --url`: App URL
- `-f, --force`: Force creation even if the path already exists
- `--template`: Project template to use (name, directory, ZIP file, or remote ZIP URL)
- `-s, --sdk`: Titanium SDK version to use

> **Note:** Always use the `--alloy` flag when creating new projects. The Alloy framework provides MVC structure, data binding, and modern development patterns. Use Classic (`--classic` or omitting `--alloy`) only when maintaining legacy projects.

### Build Project

```bash
ti build -p <PLATFORM> [OPTIONS]
```

### Project Management

```bash
ti project [OPTIONS] [<key>] [<value>]
```

Gets and sets `tiapp.xml` settings. When called with a key, returns the value. When called with a key and value, sets the value in `tiapp.xml`.

It also allows you to set the deployment-targets using a comma-separated list of platforms. If a specific platform is being enabled for the first time, it will also non-destructively copy that platform's default resources into your project's Resources folder.

**Examples:**
```bash
# Get a tiapp.xml value
ti project sdk-version

# Set a tiapp.xml value
ti project sdk-version 12.2.0.GA

# Set deployment targets (must list all desired platforms)
ti project deployment-targets iphone,ipad,android
```

**Tasks:**
- `scan`: Scan directory for Titanium projects.

**Options:**

| Option | Description |
| --- | --- |
| `-o, --output <value>` | Output format: **report**, **json**, or **text**. Defaults to **report**. |
| `--project-dir <directory>` | Directory containing the project. Defaults to current working directory. |

---

## Build Commands

### Generic Build Options and Flags

| Option | Description |
| --- | --- |
| `-b, --build-only` | Only perform the build; does not install or run the app. |
| `-f, --force` | Force a clean rebuild. |
| `--skip-js-minify` | Bypass JavaScript minification. Simulator builds are never minified. Only supported for Android and iOS. |
| `--log-level <level>` | Minimum logging level: **trace**, **debug**, **info**, **warn**, **error**. |
| `-p, --platforms <platform>` | Target build platform: **android** or **ios** (**iphone** and **ipad** are accepted as synonyms for **ios**). |
| `-d, --project-dir <directory>` | Directory containing the project. Defaults to current working directory. |
| `-s, --sdk <version>` | Titanium SDK version to build with. |

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

### Android Build Options

| Option | Description |
| --- | --- |
| `-A, --android-sdk <path>` | Path to the Android SDK. |
| `-C, --device-id <name>` | Name of the device or emulator. Use "all" with --target "device" to install on all connected devices. |
| `-D, --deploy-type <type>` | Controls optimization, encryption, analytics: **development**, **test**, **production**. |
| `-K, --keystore <path>` | Location of the keystore file. |
| `--key-password <keypass>` | Password of the keystore private key. Defaults to --store-password value. |
| `--liveview` | Start a LiveView session for live UI previews. |
| `-L, --alias <alias>` | Alias for the keystore. |
| `--no-launch` | Disable launching the app after installing. |
| `-O, --output-dir <dir>` | Output directory (used when target is **dist-playstore**). |
| `-P, --store-password <password>` | Password for the keystore. |
| `--sigalg <algorithm>` | Digital signature algorithm: **MD5withRSA**, **SHA1withRSA**, **SHA256withRSA**. |
| `-T, --target <value>` | Target: **emulator**, **device**, or **dist-playstore**. |

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

### iOS Build Options

| Option | Description |
| --- | --- |
| `-C, --device-id <name>` | Name of the device or simulator. Use "all" with --target "device" to install on all connected devices. |
| `-D, --deploy-type <type>` | Controls optimization, encryption, analytics: **development**, **test**, **production**. |
| `-F, --device-family <value>` | Device family: **iphone**, **ipad**, or **universal** (default). |
| `--force-copy` | Force files to be copied instead of symlinked (simulator builds only). |
| `-I, --ios-version <value>` | iOS SDK version to build for. Default: latest installed. |
| `-K, --keychain <value>` | Path to distribution keychain (for device/dist targets). |
| `--launch-bundle-id <id>` | After installing in simulator, launch a different app (useful for test runners). |
| `--launch-watch-app` | Launch both the watch app and main app (simulator only). |
| `--launch-watch-app-only` | Launch only the watch app (simulator only). |
| `-O, --output-dir <dir>` | Output directory (used when target is **dist-adhoc**). |
| `-P, --pp-uuid <uuid>` | Provisioning profile UUID (for device/dist targets). |
| `-R, --distribution-name <name>` | iOS Distribution Certificate (for dist targets). |
| `--sim-focus` | Focus the iOS Simulator after launching (default: true). Use --no-sim-focus to disable. |
| `-T, --target <value>` | Target: **simulator**, **device**, **dist-appstore**, or **dist-adhoc**. |
| `-V, --developer-name <name>` | iOS Developer Certificate (required for device target). |
| `-W, --watch-device-id <udid>` | Watch simulator UDID (simulator only). |
| `--watch-app-name <name>` | Name of the watch app to launch (simulator only). |
| `-Y, --sim-type <type>` | iOS Simulator type: **iphone** or **ipad** (simulator only). |

### Clean Build

```bash
ti clean [-p <PLATFORM>]
```

**Examples:**
```bash
ti clean          # All platforms
ti clean -p ios   # iOS only
```

#### Clean Options

| Option | Description |
| --- | --- |
| `-p, --platforms <platform>` | A single platform to clean: **android** or **ios**. |
| `-d, --project-dir <directory>` | Directory containing the project. Defaults to current working directory. |
| `-s, --sdk <version>` | Titanium SDK version. |
| `--log-level <level>` | Minimum logging level: **trace**, **debug**, **info**, **warn**, **error**. |

### Module Management

```bash
ti module [TASK] [OPTIONS]
```

**Tasks:**
- `create`: Create a new Titanium module.
- `list`: List installed Titanium modules.

#### Module Create

```bash
ti create -t module --id <MODULE_ID> -n <MODULE_NAME> -p <PLATFORMS> -d <WORKSPACE>
```

**Parameters:**
- `-t, --type`: Set to **module** (or **timodule**)
- `--id`: Module ID (reverse domain notation)
- `-n, --name`: Module name
- `-p, --platforms`: Target platforms
- `-d, --workspace-dir`: Workspace directory
- `-f, --force`: Force creation even if path already exists
- `--template`: Module template to use

#### Module List

Prints a list of installed modules.

```bash
ti module
ti module list
ti module list --project-dir /path/to/project
```

**Options:**

| Option | Description |
| --- | --- |
| `-o, --output <value>` | Output format: **report**, **json**, or **grid**. Defaults to **report**. |
| `--project-dir <value>` | Directory of the project to analyze. Defaults to current working directory. |

### Plugin Management

```bash
ti plugin [TASK] [OPTIONS]
```

#### Plugin List

Prints a list of installed plugins.

```bash
ti plugin
ti plugin list
ti plugin list --project-dir /path/to/project
```

**Options:**

| Option | Description |
| --- | --- |
| `-o, --output <value>` | Output format: **report**, **json**, or **grid**. Defaults to **report**. |
| `--project-dir <value>` | Directory of the project to analyze. Defaults to current working directory. |

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

**Options:**

| Option | Description |
| --- | --- |
| `-b, --branches` | Retrieve and print all branches. |
| `-r, --releases` | Retrieve and print all releases. |
| `-o, --output <value>` | Output format: **report** or **json**. Defaults to **report**. |

### Select SDK

```bash
ti sdk select [<version>]
```

Interactive selection of default SDK. This sets the SDK used to run CLI commands. If the `tiapp.xml` file does not contain an SDK version and the `app.sdk` setting is not set, the application will be built with this SDK.

### Install SDK

Downloads the latest Titanium SDK or a specific version.

```bash
ti sdk install [<version>] [--default] [--force] [--branch <branch_name>]
```

`<version>` may be a specific version number (e.g. `12.2.0.GA`), a URL to a ZIP file, or a local ZIP file path.

**Options:**

| Option | Description |
| --- | --- |
| `-d, --default` | Set as the default SDK. |
| `-f, --force` | Force reinstallation. |
| `-k, --keep-files` | Keep downloaded files after install. |
| `-b, --branch <branch_name>` | Branch to install from, or "latest". |

### Uninstall SDK

Uninstalls a specific Titanium SDK version.

```bash
ti sdk uninstall [<version>] [--force]
```

**Options:**

| Option | Description |
| --- | --- |
| `-f, --force` | Force uninstallation without confirmation. |

### Update SDK

Finds the latest version of the Titanium SDK and optionally installs it.

```bash
ti sdk update [--default] [--force] [--install] [--branch <branch_name>]
```

**Options:**

| Option | Description |
| --- | --- |
| `-d, --default` | Set as the default SDK. |
| `-f, --force` | Force reinstallation. |
| `-i, --install` | Install the latest version. |
| `-b, --branch <branch_name>` | Branch to update from. |

---

## Configuration Options

### Android Options

| Option | Default | Description |
| --- | --- | --- |
| `android.sdkPath` | auto | Android SDK path |
| `android.ndkPath` | auto | Android NDK path |
| `android.adb.port` | 5037 | ADB port number |
| `android.autoSelectDevice` | true | Auto-select device/emulator |
| `android.symlinkResources` | true (OS X) | Symlink vs copy resources |
| `android.buildTools.selectedVersion` | max | Build tools version |
| `android.javac.maxmemory` | "3072M" | JVM heap size |
| `android.javac.source` | "1.8" | Java source version |
| `android.javac.target` | "1.8" | Java target version |
| `android.mergeCustomAndroidManifest` | false | Merge custom AndroidManifest.xml |

> **Note:** The `android.javac.source` and `android.javac.target` defaults were originally "1.6" in earlier SDK versions. Modern Titanium SDK requires Java 1.8 or higher. These can be overridden per-project in `tiapp.xml` using `<property name="android.javac.source" type="string">1.8</property>`.

### iOS Options

| Option | Default | Description |
| --- | --- | --- |
| `ios.developerName` | - | Developer certificate name |
| `ios.distributionName` | - | Distribution certificate name |
| `ios.autoSelectDevice` | true | Auto-select device/simulator |
| `ios.symlinkResources` | true (OS X) | Symlink vs copy resources |
| `ios.keychain` | - | Specific keychain to search for certs |
| `ios.xcodePath` | auto | Path to Xcode installation |

### CLI Options

| Option | Default | Description |
| --- | --- | --- |
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
| --- | --- |
| `sdk.defaultInstallLocation` | SDK install location (OS-specific) |
| `sdk.selected` | Selected SDK version (REQUIRED) |

### Paths

| Option | Description |
| --- | --- |
| `paths.commands` | Additional CLI command scripts |
| `paths.hooks` | CLI hook scripts |
| `paths.modules` | Module search paths |
| `paths.plugins` | Plugin search paths |
| `paths.sdks` | SDK search paths |
| `paths.xcode` | Xcode installation paths |

### Java Options

| Option | Description |
| --- | --- |
| `java.home` | JDK directory |
| `java.executables.java` | java executable path |
| `java.executables.javac` | javac executable path |
| `java.executables.jarsigner` | jarsigner executable path |
| `java.executables.keytool` | keytool executable path |

### Genymotion Options

| Option | Description |
| --- | --- |
| `genymotion.enabled` | Enable Genymotion support |
| `genymotion.home` | Genymotion virtual machine data directory |
| `genymotion.path` | Genymotion app directory |
| `genymotion.executables.genymotion` | genymotion executable |
| `genymotion.executables.player` | player executable |
| `genymotion.executables.vboxmanage` | vboxmanage executable |

### Application Options

| Option | Description |
| --- | --- |
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
| --- | --- |
| `ti help` | Display help screen |
| `ti help <command>` | Display help for a specific command |
| `ti setup` | Run setup wizard |
| `ti setup check` | Check environment setup |
| `ti setup <section>` | Run specific setup section (quick, check, user, app, network, cli, sdk, ios, android, paths) |
| `ti info` | Display system info |
| `ti info -p <PLATFORM>` | Platform-specific info |
| `ti info -o json` | Output system info as JSON |
| `ti config` | Display/set config |
| `ti config -o json` | Output config as JSON |
| `ti create` | Create new project |
| `ti create -t module` | Create new module |
| `ti build` | Build project |
| `ti build -b` | Build only (no install/launch) |
| `ti build -f` | Force clean rebuild |
| `ti clean` | Clean build folder |
| `ti clean -p <PLATFORM>` | Clean specific platform |
| `ti project` | Get/set tiapp.xml settings |
| `ti module list` | List installed modules |
| `ti plugin list` | List installed plugins |
| `ti sdk list` | List installed SDKs |
| `ti sdk select` | Select default SDK |
| `ti sdk install` | Install latest SDK |
| `ti sdk install <version>` | Install specific SDK |
| `ti sdk uninstall <version>` | Uninstall specific SDK |
| `ti sdk update` | Check for SDK updates |

---

## SDK Version Precedence

1. `tiapp.xml` `<sdk-version>` tag
2. `--sdk` CLI option
3. `app.sdk` config setting
4. Selected SDK (`ti sdk select`)

---

## References

- [Titanium CLI GitHub](https://github.com/tidev/titanium-cli)
- [Android SDK Manager](http://developer.android.com/sdk)
- [Xcode Downloads](https://apps.apple.com/us/app/xcode/id497799835?mt=12/)
