# Titanium compatibility matrix

## Released baseline: SDK 14.0.0.GA

These are the declared ranges for **14.0.0.GA**, not promises about every future release. Check the [rendered compatibility tables](https://titaniumsdk.com/docs/reference/compatibility.md) and the [versioned API](https://titaniumsdk.com/docs/sdk/14.0.0) for another SDK. Raw website Markdown contains generated-table directives; read the rendered page to obtain the actual rows. The [released toolchain data](https://github.com/tidev/titaniumsdk.com/blob/main/registry/sdk/14.0.0/toolchain.json) identifies the SDK source commit behind these requirements.

| Component | SDK 14.0.0 declaration |
| --- | --- |
| Node.js used by SDK | >=22.19.0 |
| Titanium CLI | >=9.1.0 |
| JDK | >=17.x |
| Android SDK platforms | 23.x through 36.x |
| Android Build Tools | 30.0.2 through 35.x |
| Android Platform Tools | 33.x |
| Android SDK Tools | <=35.x |
| Android NDK, for native compilation | r21 through r22b |
| Xcode | 16.0 through 27.x |
| iOS SDK | 18.0 through 27.x |

A platform that can be detected is not necessarily the runtime floor or the default compile target. For 14.0.0 the Android minimum runtime is API 24, default compile/target is API 36, iOS minimum runtime is 16.0, and watchOS minimum is 8.0. Setting a lower `min-ios-ver` does not lower the SDK floor. Module compatibility is separate: check each native module's supported SDK, architecture and platform versions.

## SDK and CLI requirements differ

SDK 14.0.0 and CLI 9.1.0 both declare Node >=22.19.0. The setup guide recommends Node 22.19+ in the 22 line or Node 24. SDK 14 uses `ioslib` 6.0.2 and CoreDevice (`xcrun devicectl`) for physical iOS devices; it no longer depends on `node-ios-device`. A lower-bound-only declaration still does not prove every newer Node release has been tested.

For an older SDK 13.4.1 project, keep its separate pairing rules: the SDK declares Node >=20.18.1 and CLI >=8.0.0, but CLI 9.1.0 raises the Node floor to 22.19.0. Its `ioslib` 5.3.0 / `node-ios-device` 1.13.0 bindings are prebuilt only through Node 24, so Node 26 can fail when rebuilding/loading them. That older SDK needs iOS 15.0+, Xcode 15.0–26.x and iOS SDK 17.0–26.x. Use the selected release's requirements rather than applying these historical limits to SDK 14.

JDK source/target bytecode settings such as `android.javac.source` do not identify the JDK that runs Gradle. Check `javac -version`, `JAVA_HOME` and `ti info` independently.

## Host platforms and native tooling

| Host | Android | iOS and Mac Catalyst |
| --- | --- | --- |
| macOS | Yes | Yes, through Xcode |
| Windows | Yes | No |
| Linux | Yes | No |

The host OS must also support the installed Node, JDK, Android tools and Xcode; old archive claims such as Windows 7 or macOS 10.11 are not current installation advice. On macOS open Xcode once, finish its installation, and select the intended copy with `sudo xcode-select -s /Applications/Xcode.app`.

Components newer than the SDK's tested range can produce warnings while builds continue; a warning alone does not establish either failure or support. Diagnose a failing build with the tested version first. Pin Android Build Tools with `ti config android.buildTools.selectedVersion 35.0.0` when needed. NDK warnings are irrelevant to ordinary app builds that do not compile native code.

## Verify the selected environment

```sh
node -v
javac -version
ti -v
ti sdk list
ti info
```

Use `ti info -t ios` or `ti info -t android` to narrow detection. Pin `<sdk-version>14.0.0.GA</sdk-version>` in `tiapp.xml` for reproducible builds; an explicit `--sdk` overrides it for one invocation. Development snapshots and release candidates are for testing, not a replacement for a supported GA production baseline.
