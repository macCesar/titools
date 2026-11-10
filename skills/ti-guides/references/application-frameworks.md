# Project structure


`ti create` writes about a dozen files, and which ones you edit depends on
whether the project is Classic or Alloy. This page is the tour.

## What ti create generates


### Classic

```
Hello/
  Resources/            your code and assets
    app.js              the entry point
    semantic.colors.json
    assets/images/      shared images
    android/            Android-only assets
    iphone/             iOS-only assets
  platform/
    android/            files copied verbatim into the native build
  DefaultIcon.png       source image for the generated iOS app icons
  tiapp.xml             app configuration
  LICENSE
  README.md
  .vscode/              recommended extensions and settings
```

Everything you write lives in `Resources`. `app.js` runs first, and anything it
requires resolves relative to `Resources`.

### Alloy

```
Hello/
  app/                  your code
    views/              XML layouts
      index.xml
    styles/             TSS styles
      app.tss           applies to the whole app
      index.tss         applies to index.xml
    controllers/        JavaScript behaviour
      index.js
    models/             data models and collections
    assets/             images, and semantic.colors.json
    platform/           files copied verbatim into the native build
    alloy.js            runs before the first controller
    config.json         per-environment and per-platform settings
  plugins/ti.alloy/     the compiler hook, installed by alloy new
  Resources/            generated at build time, not yours to edit
  DefaultIcon.png       source image for the generated iOS app icons
  tiapp.xml             app configuration
  .gitignore
```

Everything you write lives in `app`. `Resources` is Alloy's output: each build
compiles `app` into Classic JavaScript and writes it there, overwriting what was
there before.

`ti create --alloy` leaves the Classic template's `Resources/app.js` behind on
first run. It is ignored from the next build onwards, and the generated
`.gitignore` excludes the whole directory.


Two files at the root exist for the app stores rather than the build:
`MarketplaceArtwork.png` and `iTunesConnect.png`, both placeholders Alloy adds.

## Where each kind of file goes

**Code** goes in `Resources` (Classic) or `app` (Alloy).

**Images and other assets** go under `Resources/` in Classic or `app/assets/` in Alloy. Runtime paths are relative to the resource root: `Resources/assets/images/logo.png` uses `assets/images/logo.png`, while `app/assets/images/logo.png` becomes `images/logo.png`.

**Platform-specific assets** go in a directory named for the platform:
`Resources/android`, `Resources/iphone`, `app/assets/android`,
`app/assets/iphone`. Titanium picks the matching one at build time and leaves
the rest out of the package, so an Android build does not carry iOS artwork.

**Native project files** go in `platform` (Classic) or `app/platform` (Alloy).
Contents are copied into the generated native project without being processed,
which is how the template ships `platform/android/build.gradle` and the launcher
icon resources. Use it when you need to reach the native build directly.

**Icons** are not shared between the platforms, despite the name. iOS
generates its whole icon set from `DefaultIcon.png` at the project root.
Android never reads that file: its launcher icon is the adaptive-icon set under
`platform/android/res/mipmap-*`, which `tiapp.xml` points at with
`android:icon="@mipmap/ic_launcher"`. See
[Icons and launch screens](https://titaniumsdk.com/docs/build/ui/icons-and-launch-screens).

## tiapp.xml

`tiapp.xml` is the app's configuration: identity, which platforms it targets,
which SDK builds it, and the settings that end up in the native manifests. Both
project types use it unchanged.

```xml
<ti:app xmlns:ti="http://ti.titaniumsdk.com">
  <id>com.example.hello</id>
  <name>Hello</name>
  <version>1.0</version>
  <guid>f0391a5d-2689-47cf-a6aa-df0f849fbe50</guid>
  <icon>appicon.png</icon>
  <property name="ti.ui.defaultunit" type="string">dp</property>
  <deployment-targets>
    <target device="android">true</target>
    <target device="iphone">true</target>
    <target device="ipad">false</target>
  </deployment-targets>
  <sdk-version>13.4.1.GA</sdk-version>
</ti:app>
```

| Element | What it controls |
| ------- | ---------------- |
| `id` | The Android package name and the iOS bundle identifier |
| `name` | The name under the app icon |
| `version` | The version shown in the stores |
| `guid` | Generated per project, and how tooling recognises this app |
| `sdk-version` | Which installed SDK builds the project |
| `deployment-targets` | Which platforms and device families to build for |
| `property` | Values readable at runtime through `Ti.App.Properties` |
| `modules` | Native modules the app uses |
| `plugins` | Build-time plugins, which is how `ti.alloy` is wired in |

> [!IMPORTANT]
> Changing `id` after publishing means a new listing in both stores rather than
> an update to the existing one. Set it to a domain you control when you create
> the project.

`guid` is generated for each project. Copying a `tiapp.xml` from another app
carries its guid along, so change it when you do that.

Two elements hold native configuration directly. `<ios><plist>` takes `Info.plist`
keys, which is where permission usage strings and supported orientations go.
`<android><manifest>` takes `AndroidManifest.xml` fragments, for permissions,
activities and services. Titanium merges both into the generated native project.

Every element is documented in the
[tiapp.xml reference](https://titaniumsdk.com/docs/reference/tiapp-xml).

## Generated directories

`build/` appears on the first build and holds the generated native project: an
Xcode project for iOS, a Gradle project for Android, and the compiled output.
Nothing in it is yours to edit, because the next build overwrites it.

Deleting `build/` forces a full rebuild, which is the fix when a build fails in
a way the source does not explain. `ti clean` does the same thing.

In an Alloy project `Resources/` is generated too, from `app/`.

## What to commit

Commit `tiapp.xml`, your source, your assets, `DefaultIcon.png` and `platform/`.

Do not commit `build/`, and in an Alloy project do not commit `Resources/` or
the top-level `platform/` and `i18n/` directories, which Alloy moved under
`app/`. The `.gitignore` that `alloy new` writes covers all of these. A Classic
project gets no `.gitignore`, so add one with `build/` in it.

Keystores and signing credentials do not belong in the repository at all.

## Next

[User interface](https://titaniumsdk.com/docs/build/ui) covers building screens: layout, lists, and
where the platforms differ.

## Framework choice

Classic creates UI with JavaScript calls. Alloy compiles XML views, TSS styles and JavaScript controllers into the same runtime, with model/collection binding and widgets. For the complete current MVC workflow load `alloy-guides`; for creation and first run use [project creation](hello-world.md). `app/config.json` is the Alloy configuration file and `app/lib/foo.js` is required as `require('foo')`.
