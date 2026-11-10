# tiapp.xml


Every element the build reads, verified against Titanium SDK 13.4.1. For what
`tiapp.xml` is and where it sits, see
[project structure](https://titaniumsdk.com/docs/build/project-structure).

Edit it in a text editor, or from a script with `ti project`. Elements are
children of the root `<ti:app>` unless the table says otherwise.

> [!IMPORTANT]
> An element the SDK does not recognise is not an error. A misspelled top-level
> element is parsed and then never read; a misspelled child of `<ios>` or
> `<android>` is discarded outright. Either way the build succeeds and your
> setting does nothing, so check the spelling here before assuming a bug.

## Identity

```xml
<ti:app xmlns:ti="http://ti.titaniumsdk.com">
  <id>com.example.hello</id>
  <name>Hello</name>
  <version>1.0</version>
  <guid>f0391a5d-2689-47cf-a6aa-df0f849fbe50</guid>
  <icon>appicon.png</icon>
</ti:app>
```

| Element   | Value               | What it controls                                                  |
| --------- | ------------------- | ----------------------------------------------------------------- |
| `id`      | reverse-DNS string  | Android package name and iOS bundle identifier. Required          |
| `name`    | string              | The name under the icon. Required                                 |
| `version` | `1`, `1.0`, `1.0.0` | The version shown in the stores. Defaults to `1.0`                |
| `guid`    | UUID                | Generated per project. Required, and rejected if it is not a UUID |
| `icon`    | filename            | Must end in `.png`. Falls back to `appicon.png`                   |

`version` has to start with a whole number greater than zero, so `0.9` is
rejected and `1.0.0.beta1` is accepted. Set the property
`ti.skipVersionValidation` to bypass that check, and `ti.skipAppIdValidation`
to bypass the app id one.

> [!IMPORTANT]
> Changing `id` after publishing means a **new listing** in both stores rather
> than an update. Set it to a domain you control when you create the project.

`guid` identifies the project, so copying a `tiapp.xml` from another app carries
its guid along. Change it when you do that.

`publisher`, `url`, `description` and `copyright` are also accepted. Nothing
reads them: no build uses them and neither store shows them. `ti create` writes
`not specified` into all four.

## What gets built

```xml
<sdk-version>13.4.1.GA</sdk-version>
<deployment-targets>
  <target device="android">true</target>
  <target device="iphone">true</target>
  <target device="ipad">false</target>
</deployment-targets>
```

`sdk-version` pins which installed SDK builds the project, and `--sdk` overrides
it for one build. A project without it uses the newest installed SDK, which
means two machines can build the same commit differently.

`deployment-targets` is which platforms and device families are built. The
`device` values are `android`, `iphone` and `ipad`; turning `ipad` off is what
`--platforms iphone` does at creation. On iOS the two Apple entries decide the
device family the app declares.

## Application settings

Top-level switches. Each says which platform reads it, because most of them are
read by one platform and silently ignored by the other.

| Element                | Value  | Platform | Effect                                                        |
| ---------------------- | ------ | -------- | ------------------------------------------------------------- |
| `fullscreen`           | bool   | Android  | Hides the status bar, through the generated theme             |
| `navbar-hidden`        | bool   | Android  | Hides the title bar                                           |
| `override-permissions` | bool   | Android  | Stops the build adding permissions it inferred from your code |
| `defaultLang`          | string | Android  | Which i18n locale becomes the unsuffixed resource directory   |
| `statusbar-hidden`     | bool   | both     | `UIStatusBarHidden` on iOS; hides the status bar on Android   |
| `statusbar-style`      | string | iOS      | `UIStatusBarStyle`. See below                                 |
| `persistent-wifi`      | bool   | iOS      | `UIRequiresPersistentWiFi`                                    |
| `prerendered-icon`     | bool   | iOS      | `UIPrerenderedIcon`                                           |
| `transpile`            | bool   | both     | Transpiles your JavaScript. **On unless set to `false`**      |
| `source-maps`          | bool   | both     | Emits source maps. `--source-maps` overrides it               |

`statusbar-style` is matched loosely: `opaque_black`, `opaque` or `black` give
`UIStatusBarStyleBlackOpaque`, and `translucent_black`, `transparent` or
`translucent` give `UIStatusBarStyleBlackTranslucent`. Anything else, including
a typo, gives the default style.

The element is `source-maps`. `sourcemaps` without the hyphen is one of the
unrecognised elements above: accepted, and then ignored.

## Runtime properties

```xml
<property name="ti.ui.defaultunit" type="string">dp</property>
<property name="apiRoot" type="string">https://example.com/api</property>
<property name="cacheSeconds" type="int">300</property>
```

Everything here is written into the app and readable at runtime through
`Ti.App.Properties`. `name` is required; a `<property>` without one is ignored.

| `type`   | Parsed as                    |
| -------- | ---------------------------- |
| `bool`   | `true` only for `true`       |
| `int`    | Whole number, `0` on failure |
| `double` | Decimal, `0` on failure      |
| omitted  | String                       |

Any other `type` is treated as a string, so `type="boolean"` silently gives you
the string `"true"` rather than a boolean. Reading a property with a getter that
does not match its type returns the default instead of converting.

Properties the SDK itself reads:

| Property                    | What it does                                                  |
| --------------------------- | ------------------------------------------------------------- |
| `ti.ui.defaultunit`         | What a bare number means in a layout. `ti create` writes `dp` |
| `ti.skipAppIdValidation`    | Skips the app id format check                                 |
| `ti.skipVersionValidation`  | Skips the `version` format check                              |
| `ti.facebook.appid`         | Wires the Facebook URL scheme into `Info.plist`               |
| `ti.android.debug`          | Debug logging in the Android runtime. Off unless `true`       |
| `ti.android.loadfromsdcard` | Loads JavaScript off the SD card, for development             |
| `android.javac.maxMemory`   | Heap for the Java compiler, when a large project runs out     |

`ti.ui.defaultunit` accepts `system`, `px`, `dp`, `dip`, `mm`, `cm` and `in`,
and defaults to `system`.

> [!NOTE]
> `run-on-main-thread` is in the default template and does nothing. It has been
> ignored since 8.0.0, when running on the main thread became the only
> behaviour. Deleting it changes nothing either.

## Modules and plugins

```xml
<modules>
  <module platform="android" version="5.7.0">ti.map</module>
  <module platform="iphone">ti.map</module>
</modules>

<plugins>
  <plugin version="1.0">ti.alloy</plugin>
</plugins>
```

A module on disk that is not listed here is not built in, and the failure is a
`require` returning nothing. `platform` and `version` are both optional; without
a version the newest installed is used. See [using modules](https://titaniumsdk.com/docs/build/modules).

`ti.alloy` in `plugins` is what makes a project an Alloy project, and
`alloy new` adds it. A plugin listed here that is not installed fails the build
rather than being skipped.

## iOS

Children of `<ios>`. Anything else inside `<ios>` is discarded without a
warning.

| Element                           | Value     | Effect                                                                    |
| --------------------------------- | --------- | ------------------------------------------------------------------------- |
| `plist`                           | dict      | Merged over `Info.plist`, last. See below                                 |
| `entitlements`                    | dict      | Merged into `Entitlements.plist`                                          |
| `capabilities`                    | element   | Only `<app-groups>` is understood, giving app group entitlements          |
| `extensions`                      | element   | App extensions to build alongside the app                                 |
| `min-ios-ver`                     | `15.0`    | Raises the deployment target. **Only honored above the SDK's own floor**  |
| `team-id`                         | string    | Apple Developer team, when your account has more than one                 |
| `default-background-color`        | `#rrggbb` | Background of the generated launch storyboard                             |
| `use-app-thinning`                | bool      | App thinning and asset catalogs. Off unless set to `true`                 |
| `use-jscore-framework`            | bool      | Apple's JavaScriptCore instead of the bundled one. **On unless `false`**  |
| `use-autolayout`                  | bool      | Auto Layout. Off unless set to `true`                                     |
| `use-new-build-system`            | bool      | Xcode's new build system. On for Xcode 10 and later                       |
| `enable-launch-screen-storyboard` | bool      | Generates a launch storyboard instead of launch images                    |
| `exclude-dir-from-asset-catalog`  | bool      | Keeps a directory of images out of the asset catalog                      |
| `log-server-port`                 | int       | Port for the log server, 1024 to 65535. Derived from the app id otherwise |

The SDK's own iOS floor is 15.0 in 13.4.1, so a `min-ios-ver` below that is
ignored rather than applied. The floor per release is on
[compatibility](https://titaniumsdk.com/docs/reference/compatibility).

`<plist>` takes `Info.plist` keys verbatim, which is where permission strings
and orientations go:

```xml
<ios>
  <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>
  <plist>
    <dict>
      <key>NSCameraUsageDescription</key>
      <string>Attach a photo to a note.</string>
      <key>UISupportedInterfaceOrientations~iphone</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
      </array>
    </dict>
  </plist>
</ios>
```

A missing usage string is an App Store rejection and, before that, a permission
dialog that never appears. See [media](https://titaniumsdk.com/docs/build/media).

Keys the build owns are stripped from `<plist>` before the merge:
`CFBundleDisplayName`, `CFBundleExecutable`, `CFBundleIconFile`,
`CFBundleIdentifier`, `CFBundleInfoDictionaryVersion`, `CFBundleName`,
`CFBundlePackageType`, `CFBundleSignature` and `LSRequiresIPhoneOS`. Setting one
of those here does nothing; set `<id>` and `<name>` instead.

## Android

Children of `<android>`. As with `<ios>`, anything else is discarded. The
`xmlns:android` declaration belongs on the `<android>` element.

| Element          | Value           | Effect                                                              |
| ---------------- | --------------- | ------------------------------------------------------------------- |
| `manifest`       | XML             | Merged into the generated `AndroidManifest.xml`                     |
| `tool-api-level` | int             | The API level the app is compiled against                           |
| `abi`            | comma-separated | Which ABIs to package. `all` packages every one                     |
| `activities`     | element         | Extra activities, each keyed by the JavaScript file it opens        |
| `services`       | element         | Extra services. `type="quicksettings"` builds a quick settings tile |

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest android:versionCode="1">
    <uses-permission android:name="android.permission.CAMERA"/>
    <application android:icon="@mipmap/ic_launcher"/>
  </manifest>
  <abi>arm64-v8a,x86_64</abi>
</android>
```

`android:versionCode` is the integer Google Play orders releases by, and it has
to increase on every upload. `<version>` above is the human one; these are
separate numbers and both matter.

Restricting `abi` shrinks the APK and is the usual reason to set it. An ABI you
drop is a device the app will not install on.

## Elements that no longer work

| Element            | State                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| `<iphone>`         | **Removed in 7.0.0.** The iOS build stops with an error if it is present |
| `<code-processor>` | Parsed and never read. Nothing in the SDK acts on it                     |
| `<webpack>`        | Parsed and never read by the SDK                                         |

`<iphone>` is the only one that fails a build. Move its contents into `<ios>`.

## timodule.xml

A native or CommonJS module carries `timodule.xml` instead of `tiapp.xml`, and
the SDK parses it with the same code, so it accepts the same vocabulary. It does
not act on the same vocabulary: an app building a module reads exactly two
things out of it.

| Element               | Effect on the app that includes the module             |
| --------------------- | ------------------------------------------------------ |
| `<modules>`           | Modules this module needs, added to the app's own list |
| `<android><manifest>` | Merged into the app's `AndroidManifest.xml`            |

Both are Android only. The iOS build reads nothing from `timodule.xml`: an iOS
module's `Info.plist` and entitlements come from its own files.

```xml
<ti:app xmlns:ti="http://ti.titaniumsdk.com">
  <modules>
    <module platform="android">ti.playservices</module>
  </modules>
  <android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
      <uses-permission android:name="android.permission.VIBRATE"/>
    </manifest>
  </android>
</ti:app>
```

Anything else you put in a `timodule.xml` is accepted by the parser and acted on
by nothing, so a module cannot set an app's `<property>` or its `<ios>` settings.
A module's own identity comes from its `manifest` file, not from here.

It is covered on this page rather than its own because two elements are not a
page, and both of them are the elements documented above behaving the same way
in a different file. See [native modules](https://titaniumsdk.com/docs/extend/modules) for writing one.

## Verification boundaries

Use the selected SDK's parser/compiler to verify a setting when a current guide and observed behavior disagree. Source-code encryption is not secure credential storage. On SDK 13.4.1 the `ti.crypt` encryption selector shown elsewhere on the website is not supported by the builders; use the released configuration, and defer SDK 14 changes until GA.
