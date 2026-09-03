# App Icons & Branding

The `purgetss brand` command generates the complete Titanium branding set from one main SVG or PNG logo: launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, and both splash sets. Per-piece overrides are available when needed. Alloy and Classic layouts are auto-detected, and since v7.14.0 a normal run follows the platforms enabled in `tiapp.xml`.

The command also creates Titanium-consumed Classic paths that a fresh Classic template does not seed, including the 11 Android `Resources/android/images/res-*` splash variants. An explicit `--only` is an intentional override that can prepare assets for a disabled deployment target.

For the terse flag reference, see the [`brand` command reference](./cli-commands.md#brand-command). For sibling UI assets, see [Multi-Density Images](./multi-density-images.md).

> **WARNING**
>
> Breaking changes in v7.13.0
> `--splash` → `--splash-icon`, `--notification` → `--notification-icon`, `--splash-logo` → `--splash-icon-logo`, `--feature-logo` → `--feature-graphic-logo`. `--icon-logo` now feeds the `icon` piece (the Android launcher source is `--adaptive-logo`). `--legacy-splash` is gone: the per-qualifier Android splashes belong to `android-splash` and are always generated. **No flag aliases were kept.** The `brand:` config block also changed shape, but that one updates itself — see [Older configs update themselves](#older-configs-update-themselves).

<!-- TOC-START -->
## Contents

- [Quick start](#quick-start)
- [The `purgetss/brand/` convention](#the-purgetssbrand-convention)
- [The `brand:` config section](#the-brand-config-section)
- [Brand config reference](#brand-config-reference)
- [Overwrite confirmation](#overwrite-confirmation)
- [What gets generated](#what-gets-generated)
- [Shrinking the generated files](#shrinking-the-generated-files)
- [Regenerating a single piece with `--only`](#regenerating-a-single-piece-with---only)
- [Android dark mode](#android-dark-mode)
- [Android 12+ splash artwork](#android-12-splash-artwork)
- [Android pre-12 splash](#android-pre-12-splash)
- [The iOS launch screen and LaunchLogo.png](#the-ios-launch-screen-and-launchlogopng)
- [iPhone launch images](#iphone-launch-images)
- [iOS 18+ Dark and Tinted variants](#ios-18-dark-and-tinted-variants)
- [Brand color](#brand-color)
- [Padding guidance](#padding-guidance)
- [Rounded non-icon artwork](#rounded-non-icon-artwork)
- [Cleanup legacy branding artifacts](#cleanup-legacy-branding-artifacts)
- [Troubleshooting](#troubleshooting)
- [Flag reference](#flag-reference)
- [Community-Discovered Patterns](#community-discovered-patterns)
- [See also](#see-also)

<!-- TOC-END -->

## Quick start

Drop a logo file into `purgetss/brand/`, then run the command.

```bash
mkdir -p purgetss/brand            # if the folder doesn't exist yet
cp docs/my-logo.svg purgetss/brand/logo.svg

purgetss brand
```

On a first run the command:

1. Creates `purgetss/config.cjs` from the canonical template if the file is missing, including in standalone Classic projects.
2. Creates or updates the `brand:` section with current defaults.
3. Generates branding files for the enabled deployment targets directly into the project.
4. Prints a compact summary of what was written.

Pass `--dry-run` to preview without writing any files:

```bash
purgetss brand --dry-run
```

You may also pass a source directly. When a standalone Classic project has no canonical `purgetss/brand/logo.{svg,png}`, the confirmed run moves that positional source into the convention and reports the destination. An existing canonical logo is never replaced silently.

## The `purgetss/brand/` convention

`init` creates `purgetss/brand/` (alongside `fonts/` and `images/`) so the folder is already there the first time you look for it, even before you've dropped in a logo.

PurgeTSS auto-discovers logo files under this folder, the same way `purgetss/fonts/` works for fonts. The naming rule is `logo-<piece>`, using the same piece names the CLI and the config use. Drop a file in and you're done:

```text
purgetss/brand/
├── logo.svg                   required — main logo (or logo.png), source for every piece
├── logo-mono.svg              optional — monochrome layer + notification icons
├── logo-icon.svg              optional — DefaultIcon.png + DefaultIcon-ios.png
├── logo-adaptive.svg          optional — square Android launcher mark
├── logo-dark.svg              optional — iOS 18+ dark variant
├── logo-tinted.svg            optional — iOS 18+ tinted variant
├── logo-launch.svg            optional — iOS launch screen logotype (LaunchLogo.png)
├── logo-splash-icon.svg       optional — Android 12+ splash icon override
├── logo-android-splash.svg    optional — Android <12 splash artwork
├── logo-ios-splash.svg        optional — iPhone launch images
├── logo-marketplace.svg       optional — App Store / Play Store artwork
├── logo-feature-graphic.svg   optional — Google Play Feature Graphic override
├── logo-legacy-icon.svg       optional — legacy ic_launcher.png
├── logo-appicon.svg           optional — appicon.png
└── logo-notification-icon.svg optional — notification icons
```

Only `logo.svg` (or `logo.png`) is required. Every other file is an override for one piece, and dropping it in is all it takes. There is no syntax to remember, and opening the folder shows what has been customized.

Every one of them has a CLI equivalent, `--<piece>-logo <path>`, and a config equivalent, `brand.<piece>.logo`, for artwork that lives outside `purgetss/brand/`.

The ones worth knowing about:

| File | What it's for | Fallback when omitted |
| --- | --- | --- |
| `logo-icon` | Alternate artwork for `DefaultIcon.png` / `DefaultIcon-ios.png`, when the universal icon should differ from the main logo. | Main logo. |
| `logo-adaptive` | A separate **square** mark for Android launcher icons. Use it when the main logo is a horizontal wordmark, a vertical lockup, or anything else that looks fine on a 1024×1024 canvas but feels cramped inside an Android launcher mask. | Main logo. |
| `logo-mono` | Silhouette for the Android adaptive monochrome layer (themed icons on Android 13+) and for notification icons. | Main logo, whitened automatically. |
| `logo-dark` | iOS 18+ dark mode. Provide your own when dark-mode brand guidelines use a different lockup or color treatment. | Main logo on a transparent background (Apple's recommended approach). |
| `logo-tinted` | iOS 18+ tinted mode. Provide your own when a simpler silhouette tints better than a grayscale of the colored version. | Grayscale of the main logo. |
| `logo-launch` | The only file that also **activates** a piece. Drop it in and `brand` writes `LaunchLogo.png`, so the iOS launch screen shows your logotype instead of the app icon. See [The iOS launch screen and LaunchLogo.png](#the-ios-launch-screen-and-launchlogopng). | Piece is not generated. |
| `logo-splash-icon` | Alternate artwork for Android 12+ `splash_icon.png`, when the splash should use a different composition than the launcher icon. | Launcher artwork. |
| `logo-feature-graphic` | Alternate logo for the Google Play Feature Graphic (1024×500 banner) — a logo-plus-tagline lockup, say, or wider artwork that uses the rectangular canvas instead of staying inside the centered square. | Main logo, centered with the configured vertical padding. |

> **INFO**
>
> Prefer SVG for the master
> SVG scales cleanly to every density Sharp needs to emit. A single `logo.svg` can be rasterized at every `res-*dpi` output. PNG masters should be at least **1024×1024** to avoid upscaling artifacts.

### Overriding auto-discovery

You can also pass a path directly or point to a logo from the config. Useful when your masters live in `docs/` or another workflow folder:

```bash
purgetss brand ./docs/snap-logo.svg
```

Or in `purgetss/config.cjs`, where each piece takes its own `logo`:

```javascript
brand: {
  adaptive: { logo: './docs/snap-app-icon.svg' },
  featureGraphic: { logo: './docs/snap-feature.svg' },
  monochromeLogo: './docs/snap-logo-mono.svg'
}
```

Precedence: **CLI flags win over config values, and config values win over auto-discovery.**

### How the work is divided between files and config

- **Files decide the artwork.** Dropping `logo-dark.svg` next to `logo.svg` is enough; open the folder and you can see what has been customized. This is the main path.
- **Config decides numbers, colors and activation**, none of which can be expressed with a filename.
- `logo:` inside a piece is there for artwork that lives outside `purgetss/brand/`.

## The `brand:` config section

On the first run, `purgetss brand` adds a `brand:` block to your existing `purgetss/config.cjs`, between `purge:` and `theme:`. It has **one block per piece**:

```javascript
brand: {
  background: '#FFFFFF',      // inherited by every piece that doesn't set its own
  artworkCornerRadius: '0%',  // rounded non-icon artwork: splashes, Feature Graphic and LaunchLogo
  confirmOverwrites: true,    // prompt before overwriting files (set false to skip)
  optimize: false,            // true = quantize the generated PNGs to a palette (lossy, ~71% smaller)

  // One block per piece. Artwork comes from purgetss/brand/logo-<piece>.{svg,png};
  // these keys are for numbers, colors and activation. Padding is never inherited.
  // Only iosSplash, androidSplash, featureGraphic and launchLogo accept cornerRadius.
  icon:             { padding: '0%' },    // DefaultIcon.png + DefaultIcon-ios.png
  dark:             { background: null }, // DefaultIcon-Dark.png
  tinted:           {},                   // DefaultIcon-Tinted.png
  iosSplash:        { padding: '26%' },   // assets/iphone/Default*.png × 16
  launchLogo:       { padding: '12%' },   // LaunchLogo.png (1024×1024)
  marketplace:      {},                   // iTunesConnect.png + MarketplaceArtwork.png
  featureGraphic:   { padding: '12%' },   // MarketplaceArtworkFeature.png (1024×500)
  adaptive:         { padding: '18%' },   // ic_launcher_{foreground,background,monochrome}.png × 5 + ic_launcher.xml
  legacyIcon:       { padding: '10%' },   // ic_launcher.png × 5
  appicon:          { padding: '10%' },   // appicon.png (128×128)
  androidSplash:    { padding: '26%' },   // assets/android/default.png + images/res-*/default.png × 11

  // Opt-in: inert until you edit the Android theme / FCM meta-data by hand.
  splashIcon:       { enabled: false },   // drawable-*/splash_icon.png × 5
  notificationIcon: { enabled: false },   // drawable-*/ic_stat_notify.png × 5
  ninePatch:        { enabled: false }    // background.9.png (not implemented yet)
}
```

Change only what you want to keep as a project default. CLI flags still win for one-off runs.

Use flags for temporary artwork, geometry, the shared background, selection, activation, and optimization. Keep persistent choices such as `confirmOverwrites`, permanent `enabled` values, and exceptional per-piece backgrounds in `config.cjs`.

### Older configs update themselves

PurgeTSS keeps `config.cjs` current the same way it renamed `config.js` to `config.cjs`: **on the file, once**. When the `brand:` block uses a shape from an earlier version, the next run rewrites it to the per-piece structure and carries over everything that had been customized (paddings, colors, logo paths, enabled flags), then lists each value it moved:

```text
::PurgeTSS:: Updated the brand: structure in ./purgetss/config.cjs.
  Your values were carried over:
    • brand.logos.androidLauncher → brand.adaptive.logo
    • brand.padding.androidAdaptive → brand.adaptive.padding
    • brand.android.splash → brand.splashIcon.enabled
    • brand.colors.background → brand.background
```

This happens on `purgetss brand`, and on any command that goes through the config: `build`, `watch`, `purge`, `shades`. Values that already matched a default are not written, so a block that was never customized comes out clean rather than cluttered with redundant keys.

Both earlier shapes are recognized: the original flat keys (`brand.padding` as a number, `brand.iosPadding`, `brand.bgColor`, `brand.darkBgColor`, top-level `brand.notification` / `brand.splash`) and the grouped sections from v7.7.0 (`logos` / `padding` / `android` / `ios` / `colors`). One key is dropped rather than moved: `brand.android.legacySplash`, because the per-qualifier splashes belong to `androidSplash` now and are always generated. The run says so when it happens.

The command itself understands exactly one structure. Nothing translates on the fly, so the day this migration is removed, nothing else changes.

> **INFO**
>
> This replaced the in-memory translation that ran from v7.10.2 to v7.12.1. Back then `normalizeLegacyBrand()` re-translated the old shape on **every** config read — every purge, watch and build, forever. Now the file is fixed once and every command afterwards reads one shape.

### Unknown keys are an error

A key `brand:` does not define stops the run before a single file is written, at both levels:

```text
Unknown key(s) in the brand: section of purgetss/config.cjs:
  • brand.adaptive.paddig

  Top-level keys: background, artworkCornerRadius, splashCornerRadius, confirmOverwrites,
                  optimize, logo, monochromeLogo
  Piece blocks:   icon, dark, tinted, iosSplash, launchLogo, marketplace, featureGraphic,
                  adaptive, legacyIcon, appicon, androidSplash, splashIcon,
                  notificationIcon, ninePatch
  Inside a piece: logo, padding, cornerRadius, background, enabled

  Check the spelling. Nothing was written.
```

A typo is deliberately **not** treated as an old structure: rewriting the block would drop it silently. And ignoring a misspelled `paddig` would be worse than stopping — the whole icon set would render at the wrong size and look perfectly plausible.

## Brand config reference

Every piece accepts the same five keys, where they apply:

| Key | What it does |
| --- | --- |
| `logo` | Path to this piece's artwork, when it lives outside `purgetss/brand/`. |
| `padding` | Inset per side, as a number or a percentage string like `'19%'`. **Never inherited.** |
| `cornerRadius` | Rounded artwork corners, only for `iosSplash`, `androidSplash`, `featureGraphic`, and `launchLogo`; integer or percentage string from `0` through `50`. |
| `background` | Hex color, or `null` for transparent. Inherited from `brand.background`. |
| `enabled` | `false` turns a default piece off; `true` turns an opt-in piece on. |

And these live at the top level:

| Key | Default | Purpose |
| --- | --- | --- |
| `background` | `'#FFFFFF'` | The background every piece inherits unless it declares its own: the Android adaptive background layer, the `DefaultIcon-ios.png` flatten, the splash canvases, and the marketplace flatten when a background is explicitly configured. |
| `artworkCornerRadius` | `'0%'` | Shared radius for the four supported non-icon artwork pieces. It never changes store or launcher icons. |
| `splashCornerRadius` | — | Optional splash-only override for `iosSplash` and `androidSplash`. |
| `confirmOverwrites` | `true` | Whether `brand` asks before overwriting project files in place. |
| `optimize` | `false` | Quantize the generated PNGs to a palette. Lossy — see [Shrinking the generated files](#shrinking-the-generated-files). |
| `logo` | — | Path override for the main logo. |
| `monochromeLogo` | — | Path override for the silhouette shared by the adaptive monochrome layer and the notification icons. |

### The pieces

| Piece | Config key | Generates | Default padding | On by default |
| --- | --- | --- | --- | --- |
| `icon` | `icon` | `DefaultIcon.png` + `DefaultIcon-ios.png` | `0%` | yes |
| `dark` | `dark` | `DefaultIcon-Dark.png` | `0%` | yes |
| `tinted` | `tinted` | `DefaultIcon-Tinted.png` | `0%` | yes |
| `ios-splash` | `iosSplash` | `assets/iphone/Default*.png` × 16 | `26%` | yes |
| `launch-logo` | `launchLogo` | `LaunchLogo.png` (1024×1024) | `12%` | when `logo-launch.*` exists |
| `marketplace` | `marketplace` | `iTunesConnect.png` + `MarketplaceArtwork.png` | `0%` | yes |
| `feature-graphic` | `featureGraphic` | `MarketplaceArtworkFeature.png` (1024×500) | `12%` | yes |
| `adaptive` | `adaptive` | `ic_launcher_{foreground,background,monochrome}.png` × 5 + `ic_launcher.xml` | `18%` | yes |
| `legacy-icon` | `legacyIcon` | `ic_launcher.png` × 5 | `10%` | yes |
| `appicon` | `appicon` | `appicon.png` (128×128) | `10%` | yes |
| `android-splash` | `androidSplash` | `assets/android/default.png` + `images/res-*/default.png` × 11 | `26%` | yes |
| `splash-icon` | `splashIcon` | `drawable-*/splash_icon.png` × 5 | — | `--splash-icon` |
| `notification-icon` | `notificationIcon` | `drawable-*/ic_stat_notify.png` × 5 | — | `--notification-icon` |
| `nine-patch` | `ninePatch` | `background.9.png` | — | `--nine-patch` (not implemented yet) |

`ic_launcher.xml` always travels inside `adaptive`; it is never generated on its own.

Only three pieces are opt-in, and for one reason: they produce nothing useful until you edit XML by hand. `splash_icon.png` is inert without `windowSplashScreenAnimatedIcon` in the theme, and `ic_stat_notify.png` is inert without the FCM `meta-data` entry.

### `background` is inherited, `padding` is not

Set `brand.background` once and every piece picks it up. Padding works the other way on purpose: the adaptive `18%` answers to the Android launcher mask, while finished iOS/store artwork defaults to full-bleed `0%`. A single inherited number could quietly break the launcher mask or frame finished square artwork, so padding is set per piece or not at all.

## Overwrite confirmation

`brand` writes directly into the project, so it asks before overwriting anything:

```text
In-place mode will OVERWRITE files in <project>. Commit first if you want a rollback.
Continue? [y/N/a]
```

- `y` / `yes` — write this time
- `N` / `no` / `Enter` — abort (nothing is written)
- `a` / `always` — write, then add `confirmOverwrites: false` to the `brand:` section of `config.cjs` so the prompt stays quiet on future runs

The prompt is skipped automatically when:

- `stdin` is not a TTY (the `alloy.jmk` hook, CI, a pipe)
- you pass `-y` / `--yes` — one-shot bypass
- `PURGETSS_YES=1` is set in the environment — lasts the whole shell session
- `confirmOverwrites: false` is already in the `brand:` config

```bash
purgetss brand -y                              # skip prompt once
PURGETSS_YES=1 purgetss brand                  # skip for the whole session
```

## What gets generated

The output is automatically routed to the right directory for your project layout.

**Alloy layout:**

```text
<project>/
├── DefaultIcon.png                 ← 1024×1024, universal fallback (brand.icon.padding)
├── DefaultIcon-ios.png             ← 1024×1024, iOS flattened on brand.background
├── DefaultIcon-Dark.png            ← 1024×1024, iOS 18+ dark (transparent per Apple HIG)
├── DefaultIcon-Tinted.png          ← 1024×1024, iOS 18+ tinted (grayscale on black)
├── iTunesConnect.png               ← 1024×1024, App Store submission
├── MarketplaceArtwork.png          ← 512×512, Google Play submission
├── MarketplaceArtworkFeature.png   ← 1024×500, Google Play Feature Graphic
└── app/
    ├── assets/iphone/
    │   ├── Default*.png            ← the 16 launch images the template ships
    │   └── LaunchLogo.png          ← 1024×1024, only when logo-launch.* exists
    ├── assets/android/
    │   ├── appicon.png             ← 128×128
    │   ├── default.png             ← Android <12 splash
    │   └── images/res-*/default.png ← the 11 per-qualifier splashes
    └── platform/android/res/
        ├── mipmap-mdpi/            ← 108×108 foreground + background + monochrome + legacy
        ├── mipmap-hdpi/            ← 162×162
        ├── mipmap-xhdpi/           ← 216×216
        ├── mipmap-xxhdpi/          ← 324×324
        ├── mipmap-xxxhdpi/         ← 432×432
        ├── drawable-*/             ← optional splash_icon.png with --splash-icon
        └── mipmap-anydpi-v26/
            └── ic_launcher.xml     ← adaptive-icon binder
```

**Classic layout:**

```text
<project>/
├── DefaultIcon.png  DefaultIcon-ios.png  ...     ← same root-level files as Alloy
├── MarketplaceArtworkFeature.png   ← 1024×500, Google Play Feature Graphic
├── Resources/
│   ├── iphone/Default*.png         ← the launch images the template ships
│   └── android/
│       ├── appicon.png             ← 128×128
│       ├── default.png             ← Android <12 splash
│       └── images/res-*/default.png ← 11 Titanium qualifier splashes
└── platform/
    └── android/res/
        ├── mipmap-*/               ← same 5 densities as Alloy
        ├── drawable-*/             ← optional splash_icon.png with --splash-icon
        └── mipmap-anydpi-v26/ic_launcher.xml
```

A fresh Classic project may not contain `images/res-*`, but `brand` creates all 11 `Resources/android/images/res-*` variants because Titanium consumes those qualifier paths.

The Android outputs are related, but they are not interchangeable:

- `ic_launcher*` drives the app icon, and by default it also feeds the Android 12+ system splash
- `splash_icon.png` is only generated when you ask for it with `--splash-icon`
- `default.png` and `images/res-*/default.png` are the Android <12 splash path
- `appicon.png` is the fallback Titanium uses for `tiapp.xml`'s `<icon>` when the manifest declares no `android:icon`

### Why files that "no longer matter" are regenerated

Several of these are read by nothing in a modern build. With `<enable-launch-screen-storyboard>` enabled — the default since Titanium 8 — iOS draws the storyboard and never opens the 16 `Default*.png`. `appicon.png` only comes into play when the Android manifest declares no `android:icon`.

They are regenerated anyway, because the alternative is worse: the template ships them with the grey Alloy logo, and deciding which ones to skip would mean asking you to keep track of which Titanium and OS version reads which file. If it is in the project tree, it carries your logo.

To skip the ones you know you don't need, use [`--only`](#regenerating-a-single-piece-with---only). To delete them outright, see [Cleanup legacy branding artifacts](#cleanup-legacy-branding-artifacts).

## Shrinking the generated files

`brand` writes truecolor PNGs. Logos are flat artwork with few distinct colors, which is exactly the case where a 256-color palette is indistinguishable from truecolor at a fraction of the size — the same trick TinyPNG and pngquant use.

It is off by default because it is lossy. Turn it on per run or for the project:

```bash
purgetss brand --optimize
```

```javascript
brand: {
  optimize: true
}
```

`--no-optimize` skips the pass on a single run even when the config asks for it.

On the reference project, the full set of 56 PNGs goes from **1.6 MB to 476 KB, 71% smaller**. Measured on the visible pixels of the generated icons, the difference against the truecolor version averages 0.08–0.19 out of 255, with no channel exceeding 16/255: indistinguishable in practice on flat artwork. Transparency survives too — `DefaultIcon-Dark.png` keeps its alpha channel and the same 67% transparent pixels.

### What "lossy" means here, in numbers

The loss is real: the generated icons carry between 950 and 4,300 distinct visible colors, not because the logo has that many, but because every curved edge and every letter of small text produces hundreds of intermediate tones through antialiasing. Quantization reduces all of that to at most 256.

Those intermediate tones are gradations between two or three base colors, which is exactly what a palette approximates well, and Sharp dithers the result. Measured on the visible pixels:

| Source | Colors | Average difference | Channels over 16/255 |
| --- | --- | --- | --- |
| Flat logo (the usual case) | 950–4,300 | 0.08–0.19 / 255 | 0% |
| Three-stop gradient (stress test) | 1,215 | 0.74 / 255 | 0.01% |

Even a full-circle gradient does not band measurably. Still, quantization is lossy by definition, so if your mark leans on wide, smooth gradients, compare a generated file before turning it on for the whole project. A file is only ever rewritten when the palette version comes out smaller.

> **WARNING**
>
> This is tuned for logo artwork. It is not meant for photographic sources.

For context on what the platforms already do: iOS re-encodes every PNG in the bundle with `pngcrush -iphone` when it packages the app, but that is **lossless**, so this saving is not something the SDK would have done for you. On Android, nothing in Titanium touches these files.

## Regenerating a single piece with `--only`

A full run rewrites every branding file. That is what you want the first time, and it is exactly what you don't want when only one piece changed and the others were tweaked by hand.

`--only` takes a comma-separated list of pieces, groups, or both:

```bash
purgetss brand                          # everything
purgetss brand --only icon              # just the DefaultIcon pair
purgetss brand --only ios               # icon, dark, tinted, ios-splash
purgetss brand --only ios,notification-icon
```

Groups are shorthand for the obvious sets:

| Group | Expands to |
| --- | --- |
| `ios` | `icon`, `dark`, `tinted`, `ios-splash` |
| `store` | `marketplace`, `feature-graphic` |
| `android` | `adaptive`, `legacy-icon`, `appicon`, `android-splash` |

Details worth knowing:

- Naming a piece generates it **even when its opt-in flag is absent**: `--only notification-icon` is enough on its own.
- A name that doesn't exist aborts the run before anything is written, printing the valid pieces and groups.
- `--dry-run` honors the same filter, so you can check the plan first.
- The order you type doesn't matter; generation always follows the pipeline order.

## Android dark mode

> **INFO**
>
> No separate "dark icon" file on Android
> Unlike iOS 18+, Android has no dedicated dark-mode icon file. Instead, Android 13+ uses the **monochrome layer** of the adaptive icon and tints it based on the user's wallpaper + theme.
>
> The `brand` command generates `ic_launcher_monochrome.png` at every density by default — you don't need any extra flags to get themed icon support.

If you want to provide a dedicated silhouette (recommended for detailed logos):

```bash
cp docs/my-logo-mono.svg purgetss/brand/logo-mono.svg
purgetss brand
```

The monochrome layer is pure white (`RGB 255,255,255`) with alpha preserved. Android applies the user's tint on top at render time.

## Android 12+ splash artwork

If you pass `--splash-icon`, PurgeTSS generates `drawable-*/splash_icon.png` across Android densities.

```bash
purgetss brand --splash-icon
```

If you want that artwork to differ from the launcher icon, provide `logo-splash-icon.svg` or set `brand.splashIcon.logo`:

```javascript
brand: {
  splashIcon: {
    enabled: true,
    logo: './docs/snap-splash-mark.svg'
  }
}
```

> **INFO**
>
> Generating `splash_icon.png` does not automatically switch Titanium to use it for the Android 12+ system splash. Titanium still needs a custom splash theme that points `android:windowSplashScreenAnimatedIcon` to `@drawable/splash_icon`. If you do nothing, Android keeps using `ic_launcher`. That inertness is exactly why the piece is opt-in.

Keep the theme already assigned to `<application>`. Define a launcher-only theme that inherits from `Theme.Titanium`, then assign it to Titanium's generated launcher Activity. The complete setup is in [Matching the launch background](#matching-the-launch-background).

> **WARNING**
>
> Android masks this icon into a circle
> The Android 12+ splash icon is drawn inside a circular mask. A wide wordmark that fills the canvas loses its corners. Use a square mark for `logo-splash-icon`, the same advice that applies to launcher icons.

Also, if you still see a brief flash during splash exit even with correct assets, do not assume the PNGs are wrong. That artifact can come from Titanium's splash theme or the system splash transition itself.

## Android pre-12 splash

Below Android 12 there is no system splash: the launch screen comes from the image Titanium maps into `drawable-*/background.png`, and that image comes from the project's own splash artwork.

`brand` regenerates the whole set on every run. It is the `android-splash` piece, on by default:

- `app/assets/android/default.png` (`Resources/android/default.png` in Classic)
- `app/assets/android/images/res-*/default.png` (`Resources/android/images/res-*/default.png` in Classic) — the 11 per-qualifier images Titanium consumes

Earlier versions regenerated only the first file and hid the other 11 behind a `--legacy-splash` flag, which is why a freshly branded project could still flash the grey Alloy logo on an older phone. That flag is gone: its output is part of `android-splash` and always generated.

> **INFO**
>
> A solid `windowBackground` wins
> If the launch theme sets `android:windowBackground` to a plain color — which is what [Matching the launch background](#matching-the-launch-background) recommends — that color takes precedence over this artwork on Android <12. Drop the `windowBackground` item if you want the image to show instead.

## The iOS launch screen and LaunchLogo.png

Titanium builds `LaunchLogo.imageset` itself on every iOS build, resizing one source into the five sizes it needs. It looks for `LaunchLogo.png` first and falls back to `DefaultIcon.png`.

So there is nothing for PurgeTSS to generate there, but there is something to choose. With only `DefaultIcon.png` around, the launch screen shows your app icon, safe-zone padding and all. Dropping a `logo-launch.svg` (or `.png`) into `purgetss/brand/` makes `brand` write a `LaunchLogo.png`, and the launch screen shows the full logotype instead:

```bash
cp docs/my-wordmark.svg purgetss/brand/logo-launch.svg
purgetss brand
```

The file is written at exactly **1024×1024**. That is not a style choice: the SDK validates the size and discards the file with a warning when it does not match.

The piece activates by convention (the presence of `logo-launch.*`) rather than through a flag, because `--<piece>-logo` already means "the source for this piece" everywhere else in the command. To generate it from a path without adding the file:

```bash
purgetss brand --launch-logo docs/my-wordmark.svg
purgetss brand --only launch-logo
purgetss brand --launch-logo-padding 18   # more breathing room around the logotype
```

The output keeps its alpha, so the storyboard's `<default-background-color>` shows through.

## iPhone launch images

The Alloy and Classic templates ship 16 `Default*.png` launch images under `app/assets/iphone/` or `Resources/iphone/`, from the 320×480 original iPhone size up to 2688×1242. `brand` regenerates all of them, scaling the logo against the **shorter side** of each canvas so portrait and landscape carry the same visual weight.

With `<enable-launch-screen-storyboard>` enabled (the default), iOS never reads these files. They are regenerated because they are in your project, they ship with the Alloy logo, and no one should have to audit their `tiapp.xml` to know whether that matters. If you are sure your project doesn't need them, [`--cleanup-legacy`](#cleanup-legacy-branding-artifacts) deletes them instead.

## iOS 18+ Dark and Tinted variants

iOS 18 added two appearance variants on top of the standard app icon: **Dark** (for the dark appearance of the Home Screen) and **Tinted** (for the user-accent-colored mode).

The `brand` command generates both by default:

- **`DefaultIcon-Dark.png`**: 1024×1024, **transparent by default** per Apple HIG. The system paints its own dark gradient behind the icon at render time. Override with `--dark-bg-color <hex>` to bake in an opaque dark tint instead.
- **`DefaultIcon-Tinted.png`**: 1024×1024, **grayscale on black (`#000000`)** per Apple HIG. iOS composites its own gradient background and multiplies the luminance by the user-selected accent color at render time.

### Skipping Dark or Tinted

```bash
purgetss brand --no-dark
purgetss brand --no-tinted
purgetss brand --no-dark --no-tinted
```

### Titanium SDK wiring status

> **WARNING**
>
> Upstream work in progress
> As of April 2026, Titanium SDK picks up `DefaultIcon-ios.png` automatically but does **not** yet wire `DefaultIcon-Dark.png` / `DefaultIcon-Tinted.png` into the generated iOS appiconset. Upstream tracking: [tidev/titanium-sdk#14122](https://github.com/tidev/titanium-sdk/issues/14122).
>
> Until that PR lands, after your first iOS build you may need to add the two PNGs manually into `build/iphone/Assets.xcassets/AppIcon.appiconset/` in Xcode (via the "Appearance" column in the asset catalog editor). Once #14122 merges, the command becomes fully end-to-end.

## Brand color

The `--bg-color` flag (or `brand.background` in config) controls the background across the generated branding assets:

1. The **Android adaptive background layer**: a solid color that fills the full 108dp canvas behind your logo.
2. The **iOS alpha flatten** for `DefaultIcon-ios.png`. Apple rejects transparent App Store icons, so the logo is flattened on this color.
3. The **marketplace flatten** for `iTunesConnect.png`, `MarketplaceArtwork.png`, and `MarketplaceArtworkFeature.png`.
4. **Every splash canvas**: `default.png`, the 11 `res-*/default.png`, and the 16 iPhone launch images.
5. `appicon.png`.

```bash
purgetss brand --bg-color "#0B1326"
```

Any piece can opt out with its own `background`. That is what `dark: { background: null }` does in the default config, which keeps `DefaultIcon-Dark.png` transparent per Apple HIG.

If you never pass the flag, background stays `#FFFFFF`. `iTunesConnect.png` and `MarketplaceArtwork.png` keep their alpha channel to match Titanium's default; `MarketplaceArtworkFeature.png` is always flattened for Google Play.

### Matching the launch background

`brand.background` bakes into the generated image pixels. It does **not** edit `tiapp.xml` or an Android theme. Carrying the same color into the native launch surfaces takes an iOS `<default-background-color>` entry plus a launcher-only Android theme — the complete, copy-ready setup is in [Matching the Launch Background](./launch-background.md).

`purgetss brand --notes` prints that setup with the project's current `brand.background` already filled in.


## Padding guidance

Padding belongs to the piece, not to the project. Each piece has its own key and its own flag:

| Piece | Config | Flag | Default |
| --- | --- | --- | --- |
| `adaptive` | `brand.adaptive.padding` | `--android-adaptive-padding` | `18%` |
| `legacy-icon` | `brand.legacyIcon.padding` | `--android-legacy-padding` | `10%` |
| `appicon` | `brand.appicon.padding` | `--appicon-padding` | `10%` |
| `icon` | `brand.icon.padding` | `--ios-padding` | `0%` |
| `feature-graphic` | `brand.featureGraphic.padding` | `--feature-graphic-padding` | `12%` |
| `launch-logo` | `brand.launchLogo.padding` | `--launch-logo-padding` | `12%` |
| `android-splash` | `brand.androidSplash.padding` | `--android-splash-padding` | `26%` |
| `ios-splash` | `brand.iosSplash.padding` | `--ios-splash-padding` | `26%` |

`--padding` is a shortcut for the two Android launcher paddings in a single run, and `--splash-padding` for the two splash paddings. `--ios-padding` moves the four square iOS/marketplace pieces together (`icon`, `dark`, `tinted`, `marketplace`); in config each of them has its own key.

There is deliberately **no global padding value that cascades down**. The defaults answer to different constraints: `18%` answers to the Android launcher mask, while finished square iOS/store artwork stays full-bleed at `0%`. One inherited number could silently break the launcher mask or add an unwanted frame to finished artwork. `background`, which has no such trap, is inherited from `brand.background`.

### How the source is read, and how sharp the output is

Two things are worth knowing about what happens to your `logo.svg` or `logo.png` before any padding is applied.

**The container is what counts, not the artwork's bounding box.** An SVG is read at its `viewBox`, a raster at its full canvas, and neither is trimmed to where the pixels actually are. So whatever margin a designer baked into the file **adds** to the padding configured per piece. A round logo exported inside a 2048×2048 PNG with 25% of its own air, generated at `adaptive: { padding: '18%' }`, ends up covering about 32% of the icon canvas, not 64%. If a mark comes out smaller than the numbers suggest, that is almost always why: crop the source or lower the padding.

**The masters are sized to the run.** The source is rasterized once into two intermediate masters, and every piece scales down from them, so their resolution is the ceiling on output sharpness. Rather than a fixed size, `brand` measures the largest number of pixels any selected piece will ask for and builds the masters at exactly that. A default run reports it:

```text
  • Masters at 942 px — the largest any selected piece asks for
```

Lower a padding and the figure rises with it (`--splash-padding 4` needs 1413 px), so output never goes soft against a fixed ceiling. Every destination is a reduction, never an upscale.

The one case this cannot fix is a raster source that is simply too small: a 512-px PNG cannot produce a sharp 942-px icon. Prefer SVG, or a PNG of at least 1024×1024.

### Splash padding

The 28 splash images (`default.png`, the 11 `res-*`, and the 16 iPhone launch images) share one rule: the logo is fitted into a square whose side is a share of the canvas's **shorter** side.

Measuring against the shorter side is what lets a single number work across canvases as different as 1440×2560 and 800×480: at 800×480 the limit comes from the height, at 240×400 from the width, and the logo keeps the same visual weight in portrait and in landscape.

| `androidSplash.padding` / `iosSplash.padding` | Logo | `default.png` (1440×2560) | `res-notlong-port-mdpi` (320×480) |
| --- | --- | --- | --- |
| `20%` | 60% of the shorter side | 864 px | 192 px |
| `26%` (default) | 48% | 691 px | 153 px |
| `30%` | 40% | 576 px | 128 px |
| `35%` | 30% | 432 px | 96 px |

The `26%` default is calibrated against the Titanium template itself: the Alloy logo in the stock `default.png` measures 665×488 px on a 1440×2560 canvas, so `26%` lands within 4% of the size Titanium ships.

Before v7.13.0 none of this was configurable: `default.png` used a hardcoded box of 72% × 26% of its own canvas, and the `res-*` set a separate hardcoded 60%. Two rules for the same piece, neither adjustable.

## Rounded non-icon artwork

`brand.artworkCornerRadius` rounds artwork only in the 16 iPhone launch images, Android `default.png` plus its 11 qualifier variants, `MarketplaceArtworkFeature.png`, and `LaunchLogo.png`. A piece may override it with `cornerRadius`; `brand.splashCornerRadius` is an optional shared override for the two legacy splash pieces.

Values are integer numbers or percentage strings from `0` through `50`, measured against the shorter side of the resized artwork. `0%` preserves the previous output byte for byte; `50%` makes square artwork circular and a wordmark capsule-shaped. Normal and `--dry-run` summaries report the effective padding and radius.

Precedence is:

- Feature Graphic / LaunchLogo: piece-specific flag → `--artwork-corner-radius` → piece config → `brand.artworkCornerRadius` → `0%`.
- Legacy splashes: platform flag → `--splash-corner-radius` → `--artwork-corner-radius` → piece config → `brand.splashCornerRadius` → `brand.artworkCornerRadius` → `0%`.

Store and launcher icons remain unmasked for platform processing. `cornerRadius` is rejected in `DefaultIcon*`, `iTunesConnect.png`, `MarketplaceArtwork.png`, adaptive, legacy, and app icons, Android 12+ `splash_icon.png`, notification icons, and any other unsupported piece; invalid, fractional, negative, non-numeric, or greater-than-50 values also abort before files are written.

### Adaptive icon padding

Android's adaptive canvas is 108 dp. The mask leaves roughly 72 dp visible, and the **guaranteed** safe area is a 66 dp circle inscribed in it. What each padding means in those terms:

| Padding | Logo | vs. the 66 dp safe circle | vs. the ~72 dp the mask shows |
| --- | --- | --- | --- |
| `15%` | 75.6 dp | outside | **outside** — clipped on any launcher |
| `16%` | 73.4 dp | outside | **outside** |
| `18%` | 69.1 dp | corners outside | inside — **the default** |
| `19.44%` | 66.0 dp | exactly on it | inside |
| `20%` | 64.8 dp | inside | inside — most conservative |

`18%` sits between the guaranteed circle and the mask edge: a logo that carries its own margin never reaches those corners, which is why it is a safe default in practice. Drop to `20%` if your mark runs edge to edge and you see clipping on a circular launcher.

A useful visual check is the "corners" heuristic: imagine a circle inscribed in your 1024×1024 canvas with the given padding. If your logo's outermost corners fit inside that circle, you're safe on circular launchers (Pixel default, Oppo Android 15). If they poke out, they'll be clipped.

The official Android spec floor is `19.44%` (108dp canvas, 66dp inscribed safe-zone circle). That is the theoretical worst-case for aggressive adaptive masks, which is why the adaptive default sits close to it.

### Legacy icon padding

Legacy `ic_launcher.png` does not go through the same adaptive mask, so it can usually run tighter. That is why the default for `brand.legacyIcon.padding` is `10%`.

## Cleanup legacy branding artifacts

Projects that predate Android adaptive icons (API 26+) or modern iOS launch storyboards often accumulate obsolete assets: `res-long-*/res-notlong-*` qualifiers dead since Android 3.0, legacy `Default-*.png` launch images ignored when the storyboard is enabled, pre-adaptive `appicon.png`, and similar files.

The `--cleanup-legacy` flag removes them with context-aware safety rules: it reads `tiapp.xml` to decide what is actually safe to delete for your project. Always preview first:

```bash
purgetss brand --cleanup-legacy --dry-run
```

Review the output, then remove `--dry-run` to apply:

```bash
purgetss brand --cleanup-legacy
```

Add `--aggressive` to also remove `ldpi` density folders (less than 1% of active Android devices globally in 2026):

```bash
purgetss brand --cleanup-legacy --aggressive
```

> **DANGER**
>
> Commit first
> `--cleanup-legacy` deletes files permanently. Commit your project to git before running without `--dry-run` so `git restore` is available as a rollback.

Files kept on purpose:

- `app/assets/android/default.png` in Alloy projects
- `Resources/android/default.png` in Classic projects

Those files are still valid Android <12 splash artwork.

> **INFO**
>
> `--cleanup-legacy` never deletes what the same run just generated
> Three cleanup rules target files `brand` now regenerates by default: the `res-long-*`/`res-notlong-*` folders (`android-splash`), the iPhone `Default*.png` images (`ios-splash`) and `appicon.png` (`appicon`). When `--cleanup-legacy` runs as part of a generating pass, those paths are skipped and the run reports how many it spared:
>
> ```text
> Keeping 28 path(s) this run just regenerated with your artwork.
> ```
>
> To actually delete them, exclude the piece that writes them. For example, `purgetss brand --only android --cleanup-legacy` regenerates the Android icons while letting cleanup remove the iPhone launch images.

## Troubleshooting

### The icon looks cropped or cramped on my phone

Your adaptive foreground is probably landing too close to the launcher mask. Increase `--android-adaptive-padding`:

```bash
purgetss brand --android-adaptive-padding 20
```

Or set it in the config:

```javascript
brand: {
  adaptive: { padding: '20%' }
}
```

### The icon looks tiny / lost in the middle

Adaptive padding is probably too generous. Lower it:

```bash
purgetss brand --android-adaptive-padding 17
```

### The monochrome version looks like a white blob

Your colored logo likely has multi-color detail that does not survive automatic whitening. Provide a dedicated silhouette:

```bash
cp docs/my-logo-mono.svg purgetss/brand/logo-mono.svg
purgetss brand
```

### iOS rejects the app icon upload ("contains transparency")

Apple requires App Store icons to have no alpha channel. `DefaultIcon-ios.png` is always flattened on `brand.background` for that reason. If you edited the file manually and reintroduced alpha, re-run `purgetss brand`.

### The dark variant doesn't show on my iPhone

Dark variants require iOS 18+ and Titanium SDK automatic wiring (tracked upstream in [titanium-sdk#14122](https://github.com/tidev/titanium-sdk/issues/14122)). Until that PR merges, you may need to add `DefaultIcon-Dark.png` and `DefaultIcon-Tinted.png` manually into the Xcode appiconset after the first iOS build.

### I get "Input image exceeds pixel limit" on an SVG from Affinity / Illustrator

Affinity Designer and Adobe Illustrator often bake transforms into the exported SVG's `viewBox`, so the intrinsic dimensions can end up at something like `29559×13542 pt`. Rasterized at 1× density, that exceeds Sharp's pixel limit and the command crashes.

PurgeTSS checks the `viewBox` on every SVG. When either side is over `4096 pt`, it prints a warning with the actual dimensions and switches to an adaptive density that caps the output pixel count regardless of input size. The warning tells you the source is oversized; the command still finishes.

If you want to clean up the source, re-export from the vector editor with a canvas-sized viewBox (`0 0 1024 1024`, for example). The rasterized output is identical either way, but a normalized viewBox keeps the SVG portable for other tools.

### A key in `brand:` aborts the run

`brand` rejects unknown keys instead of ignoring them. Check the spelling against the piece table above — see [Unknown keys are an error](#unknown-keys-are-an-error).

### I changed my bg color — do I need to regenerate the Android densities too?

Yes. `brand.background` bakes into every Android background layer, every splash canvas, and the iOS flatten. Re-run:

```bash
purgetss brand --bg-color "#NEW_COLOR"
```

All 5 Android densities, marketplace artwork, splash canvases, and iOS variants regenerate in one pass.

## Flag reference

Every flag lives in the terse reference: [`brand` command](./cli-commands.md#brand-command) — project & output, `--only`, padding and corner radius, optional asset types, the `--<piece>-logo` overrides, `--optimize`, appearance, legacy cleanup and diagnostics, with examples.

## Community-Discovered Patterns

- **Wordmark logos need a separate launcher mark.** When `logo.svg` is a wide wordmark or vertical lockup, it tends to look cramped inside Android launcher masks. Drop a square `logo-adaptive.svg` (or set `brand.adaptive.logo`) and the launcher icons get the dedicated mark while the rest of the brand set still uses the main logo. The same idea applies to the Android 12+ splash with `logo-splash-icon.svg`, which Android additionally masks into a circle. **Note the v7.13.0 rename:** the file that used to do this was `logo-icon.svg`; that name now feeds `DefaultIcon.png` instead.
- **Verify with `--dry-run` before a real run on a project with hand-tweaked assets.** A full `brand` run rewrites every branding file, so any icon touched by hand outside PurgeTSS is overwritten. Since v7.13.0 the surgical alternative is `--only <piece>`, which honors `--dry-run` too. Before v7.13.0 the only options were a full run or nothing.
- **The `[y/N/a]` prompt disappears in non-TTY contexts, including the `alloy.jmk` hook.** That is by design, but it means a `brand` invocation wired into the build pipeline silently overwrites without asking. Keep the project committed before wiring `brand` into `alloy.jmk`.

## See also

- [`brand` command reference](./cli-commands.md#brand-command) — terse flag list.
- [Multi-Density Images](./multi-density-images.md) — sibling `images` command for UI assets.
- [Customization Deep Dive](./customization-deep-dive.md) — the full `config.cjs` structure.
- [Version History](./version-history.md) — what changed in each release.
