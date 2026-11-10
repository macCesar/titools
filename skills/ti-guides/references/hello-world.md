# Hello world: setup, project creation and first run

## Prepare the toolchain

Android builds work on macOS, Windows and Linux; iOS and Catalyst require macOS with Xcode. See [compatibility](compatibility-matrix.md) for the released SDK 13.4.1 baseline. The current CLI requires Node 22.19+ or 24; Node 24 avoids the SDK's Node 26 native-binding problem. Install Node with a version manager or an official installer, reopen the shell, and verify `node -v`. On Homebrew `node@24` is keg-only: add its `bin` directory to PATH. Windows LTS installers follow the current LTS, so check the installed version.

Install a JDK, for example Temurin 21, and set `JAVA_HOME` to its installation directory. On macOS `/usr/libexec/java_home -v 21` locates it; on Linux derive it from the resolved `javac` executable; on Windows set a user environment variable and reopen PowerShell. Verify both `javac -version` and the `javac` under `JAVA_HOME`; a shell and Gradle can otherwise use different JDKs.

```sh
npm install -g titanium
ti -v
ti sdk install 13.4.1.GA
ti sdk list
```

`titanium` and `ti` are the same command. `pnpm add -g titanium` is an alternative. Use a writable Node/npm installation or the appropriate permissions for its global directory. No SDK version installs the newest stable; an explicit version makes this walkthrough reproducible.

Install Android SDK Platform 36, Build Tools 35.0.0, Platform Tools and Emulator through Android Studio's SDK Manager or command-line tools. Extract command-line tools to `<sdk>/cmdline-tools/latest`, not directly into the SDK root:

```sh
sdkmanager "platforms;android-36" "build-tools;35.0.0" "platform-tools" "emulator"
ti setup android
```

The wizard records `android.sdkPath`. `ANDROID_SDK_ROOT` or `ANDROID_SDK` also work; `ANDROID_HOME` alone is not read by the app builder. Conventional SDK locations are `~/Library/Android/sdk` on macOS, `~/Android/Sdk` on Linux and `%LOCALAPPDATA%\Android\Sdk` on Windows. Keep SDK paths free of spaces/ampersands on Windows and writable by your user on Linux. Pin newer Build Tools with `ti config android.buildTools.selectedVersion 35.0.0` if an unsupported version causes failures.

Create an emulator through Android Studio Device Manager or `avdmanager`. Apple silicon uses an `arm64-v8a` image; Linux needs KVM and membership of its group (log out/in after changing it); Windows needs supported hardware acceleration such as Windows Hypervisor Platform. Physical Android devices need USB debugging/authorization, a vendor driver on Windows and suitable udev rules on Linux. A CPU virtualization flag alone does not prove working KVM access; check `/dev/kvm` permissions.

For iOS install a supported Xcode, open it once to complete setup, install command-line tools, and select the intended installation:

```sh
xcode-select --install
sudo xcode-select -s /Applications/Xcode.app
xcode-select -p
```

Install additional runtimes through Xcode Settings → Components. SDK 13.4.1 needs iOS 15+ devices/runtimes. Development devices need an Apple Development certificate plus a matching provisioning profile: add your Apple ID in Xcode Settings → Accounts, create the certificate in Manage Certificates, connect/register the device, and let Xcode create a profile. The private key must be in the keychain, not just a downloaded certificate. Distribution needs a paid account; simulator builds do not need signing.

Run `ti info` and fix actual errors before creating a project. `ti info -t ios` or `-t android` narrows detection. Newer-tool and unused-NDK warnings can be harmless. If `ti` is missing, reopen the terminal and check npm's global prefix is on PATH. Antivirus file locking on Windows may require excluding generated `build/`; do not disable protection for the whole machine.

## Create Classic or Alloy

Classic uses JavaScript directly. Alloy adds XML views, TSS styles, controllers, models and reusable widgets; it compiles to the same runtime API. Choose Alloy for a growing app and Classic for a small tool or prototype.

```sh
# Classic
ti create --type app --name Hello --id com.example.hello --platforms android,ios --workspace-dir .

# Alloy: install once, then create
npm install -g alloy
ti create --type app --alloy --name Hello --id com.example.hello --platforms android,ios --workspace-dir .
```

`--alloy` runs `alloy new` after creation and requires Alloy on PATH; without it the created project remains Classic. Existing Classic projects can be converted with `alloy new` after backing up source. Interactive creation prompts for values. In scripts add `--no-prompt` and explicitly provide `--type` and `--workspace-dir`.

Use a lower-case reverse-DNS app ID whose domain you control; it becomes the Android package and iOS bundle identifier. Avoid spaces, special characters and Java keywords. Changing it after publication creates a new listing. `--name` sets the project directory and display name. `--platforms ios` targets iPhone and iPad; `iphone` targets iPhone only. Pin `<sdk-version>13.4.1.GA</sdk-version>` in `tiapp.xml`; `--sdk` overrides it for one build.

## Source and generated files

| Purpose | Classic | Alloy |
| --- | --- | --- |
| Entry source | `Resources/app.js` | `app/alloy.js` for bootstrap; `app/controllers/index.js` for first controller |
| UI | JavaScript in `Resources/` | `app/views/`, `app/styles/`, `app/controllers/` |
| Libraries | `Resources/` CommonJS modules | `app/lib/` |
| Assets | `Resources/`, platform subdirectories | `app/assets/`, platform subdirectories |
| Native platform files | `platform/android/`, `platform/ios/` | `app/platform/android/`, `app/platform/ios/` |
| Alloy settings | Not applicable | `app/config.json` |

`tiapp.xml`, `i18n/`, `modules/`, `plugins/` and `hooks/` live at the project root. Alloy generates `Resources/`; editing that output is lost on the next compilation. `build/` is generated for both. Commit source and reproducible dependency declarations, not generated output or signing credentials. Asset paths are runtime-relative: `app/assets/images/logo.png` becomes `images/logo.png`.

## Run and change the app

```sh
cd Hello
ti build --platform android
ti build --platform ios
```

Defaults are Android emulator and iOS simulator. Multiple targets prompt for selection; get IDs from `ti info` and pass `--device-id`. `--build-only` compiles without installing/launching; `--liveview` reloads changes on save; Ctrl-C stops the command/log session. First builds are slower because subsequent builds reuse generated work.

For Classic put this in `Resources/app.js`:

```javascript
const win = Ti.UI.createWindow({ backgroundColor: 'white' });
const label = Ti.UI.createLabel({ text: 'Tap the button', top: 80 });
const button = Ti.UI.createButton({ title: 'Say hello', top: 140 });
button.addEventListener('click', () => {
  label.text = 'Hello from Titanium';
});
win.add(label);
win.add(button);
win.open();
```

For Alloy use a named root window so the controller route is explicit:

```xml
<Alloy>
  <Window id="index" backgroundColor="white">
    <Label id="label" top="80">Tap the button</Label>
    <Button top="140" onClick="sayHello">Say hello</Button>
  </Window>
</Alloy>
```

```javascript
function sayHello() {
  $.label.text = 'Hello from Titanium';
}
$.index.open();
```

A view `id` becomes `$.id` in the controller and `#id` in TSS. Template semantic colors come from `Resources/semantic.colors.json` or `app/assets/semantic.colors.json`; they resolve differently in light/dark mode, unlike arbitrary color names.

## Real devices and distribution

```sh
ti build -p android -T device --device-id <android-id>
ti build -p ios -T device --device-id <ios-udid>
```

Android: enable Developer options (usually tap Build number seven times), enable USB debugging, connect and accept authorization. Debug signing is generated automatically. iOS: unlock the phone, trust the computer, and use a profile/certificate matching the app ID and device; selection prompts if several match. Free provisioning expires quickly (typically seven days), paid profiles commonly last a year; inspect the actual profile expiry. Simulators/emulators do not reproduce camera, GPS, notifications, hardware or real network conditions. Test physical hardware before release.

Titanium analyzes/transpiles JavaScript, generates native projects, then invokes Gradle or `xcodebuild`. It still executes JavaScript through a runtime; it does not translate every JavaScript statement to native machine code. Test/production JavaScript encryption raises the cost of inspection and does not protect secrets. See [distribution](app-distribution.md), [frameworks](application-frameworks.md), and [official first app](https://titaniumsdk.com/docs/build/first-app.md).
