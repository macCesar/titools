# App Icons & Branding

The `purgetss brand` command (introduced in PurgeTSS v7.6.0, restructured in v7.7.0, extended in v7.10.0 with the Google Play Feature Graphic) generates the complete Titanium branding set from a single SVG or PNG logo — with optional Android-specific overrides when you need them: launcher icons across every Android density, the adaptive-icon trio (foreground + background + monochrome), iOS 18+ Dark and Tinted variants, marketplace artwork (including the 1024×500 Feature Graphic for Google Play), and optional notification/splash icons. Alloy and Classic layouts are auto-detected.

For the terse flag reference, see the [`brand` command reference](./cli-commands.md#brand-command). For sibling UI assets, see [Multi-Density Images](./multi-density-images.md).

> **INFO**
>
> The `brand` command at a glance
> `purgetss brand` turns one logo into every asset a Titanium app needs to ship — launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, and optional notification/splash icons. Works on both Alloy and Classic projects.

<!-- TOC-START -->
## Contents

- [Quick start](#quick-start)
- [The `purgetss/brand/` convention](#the-purgetssbrand-convention)
- [The `brand:` config section (v7.7.0 grouped structure)](#the-brand-config-section-v770-grouped-structure)
- [Overwrite confirmation](#overwrite-confirmation)
- [What gets generated](#what-gets-generated)
- [Android dark mode](#android-dark-mode)
- [Android 12+ splash artwork](#android-12-splash-artwork)
- [Android legacy splash fallback](#android-legacy-splash-fallback)
- [iOS 18+ Dark and Tinted variants](#ios-18-dark-and-tinted-variants)
- [Google Play Feature Graphic (v7.10.0)](#google-play-feature-graphic-v7100)
- [Brand color](#brand-color)
- [Padding guidance](#padding-guidance)
- [Cleanup legacy branding artifacts](#cleanup-legacy-branding-artifacts)
- [Troubleshooting](#troubleshooting)
- [Full flag reference](#full-flag-reference)
- [Community-Discovered Patterns](#community-discovered-patterns)
- [See also](#see-also)

<!-- TOC-END -->

## Quick start

Drop a logo file into `purgetss/brand/`, then run the command. That's the whole workflow.

```bash
mkdir -p purgetss/brand            # if the folder doesn't exist yet
cp docs/my-logo.svg purgetss/brand/logo.svg

purgetss brand
```

On a first run the command:

1. Creates the `brand:` section in `purgetss/config.cjs` with sensible defaults (if missing).
2. Generates every branding file directly into the project (in-place).
3. Prints a compact summary of what was written.

Pass `--dry-run` to preview without writing any files:

```bash
purgetss brand --dry-run
```

## The `purgetss/brand/` convention

`init` creates `purgetss/brand/` (alongside `fonts/` and `images/`) so the folder is already there the first time you look for it, even before you've dropped in a logo.

PurgeTSS auto-discovers logo files under this folder, the same way `purgetss/fonts/` works for fonts. Drop files with these names and you're done — no flags, no config:

```text
purgetss/brand/
├── logo.svg              required — main logo (or logo.png)
├── logo-icon.svg         optional — square Android launcher mark
├── logo-mono.svg         optional — monochrome layer + notifications
├── logo-dark.svg         optional — iOS 18+ dark variant
├── logo-splash.svg       optional — Android 12+ splash icon override
├── logo-tinted.svg       optional — iOS 18+ tinted variant
└── logo-feature.svg      optional — Google Play Feature Graphic (1024×500) override
```

Only `logo.svg` (or `logo.png`) is required. Everything else is **opt-in refinement**:

| File | Required? | What it's for | Fallback when omitted |
| --- | --- | --- | --- |
| `logo.svg` / `logo.png` | **Required** | Main colored logo. Feeds every density and variant. | — |
| `logo-icon.svg` / `.png` | Optional | Square Android launcher mark — use when `logo.svg` is a wide wordmark or non-square lockup. | Main logo is reused for Android launcher icons. |
| `logo-mono.svg` / `.png` | Optional | Android adaptive monochrome layer (themed icons on Android 13+) and notification icons. | Main logo is whitened automatically. |
| `logo-splash.svg` / `.png` | Optional | Android 12+ `splash_icon.png` artwork (only used when `--splash` / `android.splash: true`). | Falls back to the launcher artwork. |
| `logo-dark.svg` / `.png` | Optional | iOS 18+ Dark appearance variant. | Main logo on a transparent background (Apple HIG default). |
| `logo-tinted.svg` / `.png` | Optional | iOS 18+ Tinted appearance variant. | Grayscale of the main logo on black. |
| `logo-feature.svg` / `.png` | Optional | Google Play Feature Graphic (1024×500). Use when the Play Store banner should differ from the main app icon (e.g. logo + tagline lockup that fills the wider rectangular canvas). | Main logo is centered inside the banner with configured vertical padding. |

Provide a dedicated `logo-icon` when the main logo is a horizontal wordmark, a vertical lockup, or anything else that looks fine in a 1024×1024 branding canvas but feels cramped inside an Android launcher mask.

Provide a dedicated `logo-mono` when the colored logo has detail that would collapse into a featureless blob under naive whitening (e.g. a painter's palette with colored dots — the monochrome variant should have cutouts instead).

Provide a dedicated `logo-splash` when the Android 12+ splash should use a different composition than the launcher icon. PurgeTSS generates the file, but Titanium still needs a custom Android splash theme if you want the system splash to use it instead of `ic_launcher`.

Provide a dedicated `logo-dark` when dark-mode brand guidelines use a different lockup or color treatment; provide `logo-tinted` when you want a pre-simplified silhouette that tints better than a naive grayscale of the colored version.

Provide a dedicated `logo-feature` when the Google Play Feature Graphic (1024×500) should use a different composition than the main app icon — for example a logo-plus-tagline lockup or a wider artwork that takes advantage of the rectangular canvas instead of being constrained to the centered square.

> **INFO**
>
> Prefer SVG for the master
> SVG scales losslessly to every density Sharp needs to emit. A single `logo.svg` rasterizes perfectly at every `res-*dpi` output. PNG masters should be at least **1024×1024** to avoid upscaling artifacts.

### Overriding auto-discovery

You can also pass a path directly or point to a logo from the config. Useful when your masters live in `docs/` or another workflow folder:

```bash
purgetss brand ./docs/snap-logo.svg
```

Or in `purgetss/config.cjs`:

```javascript
brand: {
  logos: {
    primary: './docs/snap-logo.svg',
    androidLauncher: './docs/snap-app-icon.svg',
    monochrome: './docs/snap-logo-mono.svg',
    featureGraphic: './docs/snap-feature.svg'   // optional — Google Play Feature Graphic
  }
}
```

Precedence: **CLI flags win over config values, and config values win over auto-discovery.**

## The `brand:` config section (v7.7.0 grouped structure)

On the first run, `purgetss brand` injects a `brand:` block into your existing `purgetss/config.cjs` (between `purge:` and `theme:`) with these defaults. The structure is grouped by purpose:

```javascript
brand: {
  logos: {
    // Optional overrides. If omitted, PurgeTSS auto-discovers files from purgetss/brand/:
    // primary: './docs/logo.svg',
    // androidLauncher: './docs/app-icon.svg',
    // androidSplash: './docs/splash.svg',
    // monochrome: './docs/logo-mono.svg',
    // iosDark: './docs/logo-dark.svg',
    // iosTinted: './docs/logo-tinted.svg'
  },
  padding: {
    ios: '4%',              // iOS aesthetic padding. Range 2-8%. No launcher mask.
    androidLegacy: '10%',   // legacy ic_launcher.png padding %
    androidAdaptive: '19%', // adaptive icon safe-zone %. Spec floor 19.44%.
    featureGraphic: '12%'   // vertical padding for MarketplaceArtworkFeature.png (1024×500)
  },
  android: {
    splash: false,         // also generate splash_icon.png × 5
    notification: false    // also generate ic_stat_notify.png × 5
  },
  colors: {
    background: '#FFFFFF'  // Android adaptive bg + iOS/marketplace flatten
  },
  // Optional iOS overrides:
  // ios: {
  //   dark: false,           // skip DefaultIcon-Dark.png
  //   tinted: false,         // skip DefaultIcon-Tinted.png
  //   darkBackground: '#111' // opaque dark bg for DefaultIcon-Dark.png (null = transparent per Apple HIG)
  // },
  confirmOverwrites: true  // prompt before overwriting files (set false to skip)
}
```

The recommended workflow is convention-first: drop files in `purgetss/brand/`, let auto-discovery pick them up, and only set `brand.logos.*` when you have a persistent override. CLI flags still win for one-off runs.

### `brand.logos`

All `logos.*` keys are optional path overrides. If you omit them, PurgeTSS auto-discovers files from `purgetss/brand/`.

| Key | Auto-discovers | Purpose |
| --- | --- | --- |
| `logos.primary` | `purgetss/brand/logo.svg` | Main brand source. |
| `logos.androidLauncher` | `purgetss/brand/logo-icon.svg` | Square Android launcher mark — use when the main logo is a wordmark. |
| `logos.androidSplash` | `purgetss/brand/logo-splash.svg` | Android 12+ splash artwork. |
| `logos.monochrome` | `purgetss/brand/logo-mono.svg` | Android themed icons + notification icons. |
| `logos.iosDark` | `purgetss/brand/logo-dark.svg` | iOS dark variant. |
| `logos.iosTinted` | `purgetss/brand/logo-tinted.svg` | iOS tinted variant. |
| `logos.featureGraphic` | `purgetss/brand/logo-feature.svg` | Google Play Feature Graphic source (1024×500 rectangular canvas). |

### `brand.padding`

All padding values accept either numbers or percentage strings like `'19%'`.

| Key | Default | Purpose |
| --- | --- | --- |
| `padding.ios` | `'4%'` | Visual inset for `DefaultIcon-ios.png`, `DefaultIcon-Dark.png`, `DefaultIcon-Tinted.png`, marketplace artwork. |
| `padding.androidLegacy` | `'10%'` | Visual inset for legacy `ic_launcher.png`. |
| `padding.androidAdaptive` | `'19%'` | Visual inset for adaptive Android foreground (`ic_launcher_foreground.png`). Adjust this first when icons look cropped inside launcher masks. |
| `padding.featureGraphic` | `'12%'` | Vertical padding (top + bottom) for `MarketplaceArtworkFeature.png` (1024×500 Google Play banner). The logo is rendered as a square block of side `500 - 2 × pad` centered horizontally and vertically. Lower it for a more impactful banner; raise it if the logo looks cramped against the top or bottom edge on smaller Play Store crops. |

### `brand.android`

| Key | Default | Purpose |
| --- | --- | --- |
| `android.splash` | `false` | When `true`, also generates `drawable-*/splash_icon.png`. |
| `android.notification` | `false` | When `true`, also generates `drawable-*/ic_stat_notify.png`. |

### `brand.ios` (optional)

If omitted, PurgeTSS behaves as if `ios.dark = true`, `ios.tinted = true`, `ios.darkBackground = null`.

| Key | Default | Purpose |
| --- | --- | --- |
| `ios.dark` | `true` | Set to `false` to skip `DefaultIcon-Dark.png`. |
| `ios.tinted` | `true` | Set to `false` to skip `DefaultIcon-Tinted.png`. |
| `ios.darkBackground` | `null` | When `null`, `DefaultIcon-Dark.png` stays transparent per Apple HIG. Set a hex to bake in an opaque dark background. |

### `brand.colors`

| Key | Default | Purpose |
| --- | --- | --- |
| `colors.background` | `'#FFFFFF'` | Triple-purpose: Android adaptive background layer, iOS alpha flatten for `DefaultIcon-ios.png`, marketplace flatten for `iTunesConnect.png` / `MarketplaceArtwork.png` when overridden. |

### `brand.confirmOverwrites`

| Key | Default | Purpose |
| --- | --- | --- |
| `confirmOverwrites` | `true` | When `false`, the `[y/N/a]` prompt is skipped. |

### Upgrading from pre-7.7.0 configs

In v7.7.0, the `brand:` block was reorganized into grouped subsections (`logos`, `padding`, `android`, `ios`, `colors`). Since **v7.10.2**, if your `config.cjs` still uses the original flat layout, PurgeTSS auto-migrates it **in memory on every run** — your old config keeps working without any change on disk.

| Pre-7.7.0 flat key | Current grouped key |
| --- | --- |
| `brand.padding: <number\|string>` (single value) | `brand.padding.androidLegacy` **and** `brand.padding.androidAdaptive` (same value applied to both) |
| `brand.iosPadding` | `brand.padding.ios` |
| `brand.bgColor` | `brand.colors.background` |
| `brand.darkBgColor` | `brand.ios.darkBackground` |
| `brand.notification` | `brand.android.notification` |
| `brand.splash` | `brand.android.splash` |

If both legacy and grouped keys are present for the same property, the **grouped key wins**.

On first encounter per session, PurgeTSS prints a one-time deprecation notice listing the legacy keys it migrated:

```text
::PurgeTSS:: Legacy brand: schema detected in purgetss/config.cjs — auto-migrated in memory:
     • brand.padding: 15 → brand.padding.androidLegacy + brand.padding.androidAdaptive
     • brand.iosPadding → brand.padding.ios
     • brand.bgColor → brand.colors.background
     Update purgetss/config.cjs to the new grouped schema to silence this warning.
```

The notice is suppressed once you update the file to the grouped layout. Auto-migration is purely transitional and may be removed in a future major version, so a one-time update to your `config.cjs` is recommended.

Prior to v7.10.2, projects on the flat layout crashed auto-purge with `TypeError: Cannot create property 'ios' on number '15'` because `brand.padding` was a number rather than an object. v7.10.2 normalizes the shape before defaults are applied.

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
├── DefaultIcon.png                 ← 1024×1024, universal fallback (Android-safe padding)
├── DefaultIcon-ios.png             ← 1024×1024, iOS flattened on bgColor
├── DefaultIcon-Dark.png            ← 1024×1024, iOS 18+ dark (transparent per Apple HIG)
├── DefaultIcon-Tinted.png          ← 1024×1024, iOS 18+ tinted (grayscale on black)
├── iTunesConnect.png               ← 1024×1024, App Store submission
├── MarketplaceArtwork.png          ← 512×512, Google Play submission
├── MarketplaceArtworkFeature.png   ← 1024×500, Google Play Feature Graphic (v7.10.0)
└── app/
    └── assets/android/
        ├── default.png             ← legacy Titanium Android splash fallback (v7.7.0)
        └── res/
            ├── mipmap-mdpi/        ← 108×108 foreground + background + monochrome + legacy
            ├── mipmap-hdpi/        ← 162×162
            ├── mipmap-xhdpi/       ← 216×216
            ├── mipmap-xxhdpi/      ← 324×324
            ├── mipmap-xxxhdpi/     ← 432×432
            ├── drawable-*/         ← optional splash_icon.png when --splash is enabled
            └── mipmap-anydpi-v26/
                └── ic_launcher.xml ← adaptive-icon binder
```

**Classic layout:**

```text
<project>/
├── DefaultIcon.png  DefaultIcon-ios.png  ...     ← same root-level files as Alloy
├── MarketplaceArtworkFeature.png   ← 1024×500, Google Play Feature Graphic (v7.10.0)
├── Resources/
│   └── android/default.png         ← legacy Titanium Android splash fallback (v7.7.0)
└── platform/
    └── android/res/
        ├── mipmap-*/               ← same 5 densities as Alloy
        ├── drawable-*/             ← optional splash_icon.png when --splash is enabled
        └── mipmap-anydpi-v26/ic_launcher.xml
```

The Android outputs are related, but they are not interchangeable:

- `ic_launcher*` drives the app icon, and by default also feeds the Android 12+ system splash
- `splash_icon.png` is only generated when you ask for it with `--splash`
- `default.png` is the older Titanium Android splash fallback (regenerated since v7.7.0)

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

If you pass `--splash`, PurgeTSS generates `drawable-*/splash_icon.png` across Android densities.

```bash
purgetss brand --splash
```

If you want that artwork to differ from the launcher icon, provide `logo-splash.svg` or set `brand.logos.androidSplash`:

```javascript
brand: {
  android: {
    splash: true
  },
  logos: {
    androidSplash: './docs/snap-splash-mark.svg'
  }
}
```

> **INFO**
>
> Generating `splash_icon.png` does not automatically switch Titanium to use it for the Android 12+ system splash. Titanium still needs a custom splash theme that points `android:windowSplashScreenAnimatedIcon` to `@drawable/splash_icon`. If you do nothing, Android keeps using `ic_launcher`.

> **WARNING**
>
> Merge splash settings into the existing Android theme
> If your app already has a custom Android theme block in `tiapp.xml`, **merge** the new splash settings (the `android:windowSplashScreenAnimatedIcon` entry and any sibling theme attributes) into that existing theme. Do **not** append a second `<application>` element or a duplicate theme block — Titanium will only honor one theme definition, and the duplicate silently shadows or overrides the original, leading to "my settings were ignored" debugging sessions. Always edit the existing `<application>` / theme block in place.

> **INFO**
>
> A brief flash on splash exit is usually the system, not your PNGs
> If you still see a brief flash or abrupt exit transition during splash dismissal even with correct assets in place, **do not assume the PNGs PurgeTSS generates are wrong**. That artifact commonly comes from Android 12+'s system splash exit transition (or from Titanium's splash theme handoff to your first window), not from the splash icon files themselves. Regenerating `splash_icon.png` will not change it — the fix lives in the splash theme animation, not in the icon assets.

## Android legacy splash fallback

Since v7.7.0, PurgeTSS regenerates `app/assets/android/default.png` in Alloy projects and `Resources/android/default.png` in Classic projects.

That file still matters as a fallback on older Titanium Android splash paths, which is why `cleanup-legacy` no longer removes it.

> **INFO**
>
> Older Android splash theme assets are left out on purpose
> The older Android splash **theme** assets `background.png` / `background.9.png` are intentionally **not** part of the normal `brand` flow. `brand` targets the modern Titanium icon pipeline (iOS app icons, Android adaptive icons, optional Android 12+ splash artwork), so if a project still depends on those legacy nine-patch theme assets, manage them manually. (Source: upstream `app-assets/1-app-icons-and-branding.md` ~lines 334, 386.)

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

## Google Play Feature Graphic (v7.10.0)

Since v7.10.0, `purgetss brand` also generates `MarketplaceArtworkFeature.png` — the **1024×500** banner that Google Play shows above the app description on the Play Store listing. It's submission artwork only: the file is written to the project root for upload via Play Console; it is **not** bundled into the APK.

### How the source is chosen

PurgeTSS resolves the Feature Graphic source in this order (first match wins):

1. CLI `--feature-logo <path>` for the current run.
2. `brand.logos.featureGraphic` in `config.cjs`.
3. Auto-discovered `purgetss/brand/logo-feature.{svg,png}`.
4. The main logo (centered inside the 1024×500 canvas with the configured vertical padding).

```bash
purgetss brand --feature-logo ./docs/feature.svg
```

Drop a dedicated logo when you want a logo + tagline lockup or a wider artwork that takes advantage of the rectangular canvas. Otherwise the main `logo.svg` is centered as a square block — fine for most apps.

### Padding

The default vertical padding is `12%` (top + bottom). Override per run with `--feature-graphic-padding <n>` (integer `0-40`), or persist it in `brand.padding.featureGraphic`:

```bash
purgetss brand --feature-graphic-padding 8
```

```javascript
brand: {
  padding: {
    featureGraphic: '8%'
  }
}
```

The logo is rendered as a square block of side `500 - 2 × pad` and centered horizontally on the 1024-wide canvas. Lower the padding for a more impactful banner; raise it if the logo looks cramped against the top or bottom edge on smaller Play Store crops.

## Brand color

The `--bg-color` flag (or `brand.colors.background` in config) controls three things at once:

1. The **Android adaptive background layer**: a solid color that fills the full 108dp canvas behind your logo.
2. The **iOS alpha flatten** for `DefaultIcon-ios.png`. Apple rejects transparent App Store icons, so the logo is flattened on this color.
3. The **marketplace flatten** for `iTunesConnect.png` and `MarketplaceArtwork.png` when you pass a non-default value explicitly.

```bash
purgetss brand --bg-color "#0B1326"
```

If you never pass the flag, background stays `#FFFFFF` and the marketplace artwork keeps its alpha channel (matches Titanium's default).

## Padding guidance

Since v7.7.0, PurgeTSS treats Android adaptive and Android legacy launcher icons as two related but different cases:

- `brand.padding.androidAdaptive` or `--android-adaptive-padding` for the adaptive foreground
- `brand.padding.androidLegacy` or `--android-legacy-padding` for `ic_launcher.png`
- `--padding` is a one-shot **shortcut** that sets both Android paddings to the same value for one run

The adaptive default is `19%`, which stays close to the Android safe-zone. The legacy default is `10%`, so the flat `ic_launcher.png` can keep a little more visual weight.

### Adaptive icon padding

| Padding | Logo fill | When to use                                                                                            |
| ------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `15%`   | 70%       | Aggressive. Better for square symbols with lots of built-in breathing room.                            |
| `18%`   | 64%       | Defensive: for intricate logos, fine serifs, multi-element designs.                                    |
| `19%`   | 62%       | **Default**. Close to the Android safe-zone and safer for adaptive masks.                              |
| `20%`   | 60%       | Conservative, spec-compliant. Safe on every launcher, including aggressive masks.                      |

A useful visual check is the "corners" heuristic: imagine a circle inscribed in your 1024×1024 canvas with the given padding. If your logo's outermost corners fit inside that circle, you're safe on circular launchers (Pixel default, Oppo Android 15). If they poke out, they'll be clipped.

The official Android spec floor is `19.44%` (108dp canvas, 66dp inscribed safe-zone circle). That is the theoretical worst-case for aggressive adaptive masks, which is why the adaptive default now sits close to it.

### Legacy icon padding

Legacy `ic_launcher.png` does not go through the same adaptive mask, so it can usually run tighter. That is why the default for `brand.padding.androidLegacy` is `10%`.

### iOS padding

`--ios-padding` is a separate lever — iOS has no launcher mask, so the range is different:

| iOS padding | When to use |
| --- | --- |
| `2%` | Bold, edge-to-edge logos. |
| `4%` | **Default**. Balanced aesthetic. |
| `8%` | Conservative, generous whitespace around the mark. |

## Cleanup legacy branding artifacts

Projects that predate Android adaptive icons (API 26+) or modern iOS launch storyboards often accumulate obsolete assets: `res-long-*/res-notlong-*` qualifiers dead since Android 3.0, legacy `Default-*.png` launch images ignored when the storyboard is enabled, pre-adaptive `appicon.png`, and so on.

The `--cleanup-legacy` flag removes them with context-aware safety rules: it reads `tiapp.xml` to decide what's safe to delete based on your project's configuration. Always preview first:

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

> **INFO**
>
> Files kept on purpose
> `--cleanup-legacy` intentionally does **not** remove the following files, even when modern adaptive launcher icons and splash assets are already in place:
>
> - `app/assets/android/default.png` (Alloy projects)
> - `Resources/android/default.png` (Classic projects)
>
> These remain because they are still required by Titanium framework defaults — older Android splash code paths fall back to `default.png`, and removing it can cause build warnings or a missing-asset error on certain Titanium SDK versions even when modern splash assets exist. Treat them as part of the baseline asset set, not as legacy clutter.

## Troubleshooting

### The icon looks cropped or cramped on my phone

Your adaptive foreground is probably landing too close to the launcher mask. Increase `--android-adaptive-padding`:

```bash
purgetss brand --android-adaptive-padding 20
```

Or set it in the config:

```javascript
brand: {
  padding: {
    androidAdaptive: '20%'
  }
}
```

### The icon looks tiny / lost in the middle

Adaptive padding is probably too generous. Lower it:

```bash
purgetss brand --android-adaptive-padding 17
```

### The monochrome version looks like a white blob

Your colored logo likely has multi-color detail that doesn't survive a naive whitening. Provide a dedicated silhouette:

```bash
cp docs/my-logo-mono.svg purgetss/brand/logo-mono.svg
purgetss brand
```

### iOS rejects the app icon upload ("contains transparency")

That's Apple's rule: App Store icons must have no alpha channel. `DefaultIcon-ios.png` is always flattened on `bgColor` for that reason. If you edited the file manually and reintroduced alpha, re-run `purgetss brand` to regenerate.

### The dark variant doesn't show on my iPhone

Dark variants require iOS 18+ and Titanium SDK automatic wiring (tracked upstream in [titanium-sdk#14122](https://github.com/tidev/titanium-sdk/issues/14122)). Until that PR merges, you may need to add `DefaultIcon-Dark.png` and `DefaultIcon-Tinted.png` manually into the Xcode appiconset after the first iOS build.

### I get "Input image exceeds pixel limit" on an SVG from Affinity / Illustrator

Affinity Designer and Adobe Illustrator often bake transforms into the exported SVG's `viewBox`, so the intrinsic dimensions end up at something absurd like `29559×13542 pt`. Rasterized at 1× density, that blows past Sharp's pixel limit and the command crashes.

PurgeTSS checks the `viewBox` on every SVG. When either side is over `4096 pt`, it prints a warning with the actual dimensions and switches to an adaptive density that caps the output pixel count regardless of input size. The warning tells you the source is oversized; the command still finishes.

If you want to clean up the source, re-export from the vector editor with a canvas-sized viewBox (`0 0 1024 1024`, for example). The rasterized output is identical either way, but a normalized viewBox keeps the SVG portable for other tools.

### I changed my bg color — do I need to regenerate the Android densities too?

Yes. `bgColor` bakes into every Android background layer and the iOS flatten. Re-run:

```bash
purgetss brand --bg-color "#NEW_COLOR"
```

All 5 Android densities, marketplace artwork, and iOS variants regenerate in one pass.

## Full flag reference

**Project & output**

| Flag | Purpose |
| --- | --- |
| `--project <path>` | Project root (defaults to cwd). |
| `--dry-run` | Preview what would be generated without writing any files. |
| `--output <dir>` | Stage into `<dir>` instead of writing in place. |
| `-y`, `--yes` | Skip the overwrite confirmation prompt for this invocation. |

**Visual customization**

| Flag | Purpose |
| --- | --- |
| `--bg-color <hex>` | Background color for Android adaptive + iOS/marketplace flatten. |
| `--padding <n>` | Shortcut: sets BOTH Android paddings to the same value for one run. Fixed in v7.10.0 — previously only fed `androidAdaptivePadding`, leaving `androidLegacyPadding` at its own config value. |
| `--android-adaptive-padding <n>` | Adaptive icon safe-zone % (default `19`). |
| `--android-legacy-padding <n>` | Legacy `ic_launcher.png` padding % (default `10`). |
| `--ios-padding <n>` | iOS aesthetic padding % (range `2–8`, default `4`). |
| `--feature-graphic-padding <n>` | (v7.10.0) Vertical padding for `MarketplaceArtworkFeature.png` (range `0-40`, default `12`). |

**Optional asset types**

| Flag | Purpose |
| --- | --- |
| `--notification` | Also emit `ic_stat_notify.png × 5`. |
| `--splash` | Also emit `splash_icon.png × 5`. |

**Logo variants & overrides**

| Flag | Purpose |
| --- | --- |
| `--icon-logo <path>` | Override `purgetss/brand/logo-icon.{svg,png}` for Android launcher icons. |
| `--monochrome-logo <path>` | Override `purgetss/brand/logo-mono.{svg,png}`. |
| `--dark-logo <path>` | Override `purgetss/brand/logo-dark.{svg,png}`. |
| `--dark-bg-color <hex>` | Opaque dark bg for `DefaultIcon-Dark.png` (default: transparent per Apple HIG). |
| `--splash-logo <path>` | Override `purgetss/brand/logo-splash.{svg,png}` for Android 12+ splash artwork. |
| `--tinted-logo <path>` | Override `purgetss/brand/logo-tinted.{svg,png}`. |
| `--feature-logo <path>` | (v7.10.0) Override `purgetss/brand/logo-feature.{svg,png}` for the Google Play Feature Graphic. |
| `--no-dark` | Skip `DefaultIcon-Dark.png`. |
| `--no-tinted` | Skip `DefaultIcon-Tinted.png`. |

**Legacy cleanup**

| Flag | Purpose |
| --- | --- |
| `--cleanup-legacy` | Remove obsolete branding artifacts (reads `tiapp.xml` for safety rules). Keeps `default.png` on purpose. |
| `--aggressive` | With `--cleanup-legacy`, also remove `ldpi` density folders. |

**Diagnostics**

| Flag | Purpose |
| --- | --- |
| `--notes` | Print full `tiapp.xml` snippets + padding tuning guide. |
| `--debug` | Print extra diagnostics. |

### Examples

```bash
purgetss brand                                            # uses purgetss/brand/logo.svg + config
purgetss brand --bg-color "#0B1326"                       # override bg color
purgetss brand --icon-logo ./docs/app-icon.svg            # dedicated square Android launcher mark
purgetss brand --splash --splash-logo ./docs/splash.svg   # custom Android 12+ splash artwork
purgetss brand --feature-logo ./docs/feature.svg          # custom Google Play Feature Graphic (v7.10.0)
purgetss brand --feature-graphic-padding 8                # tighter Feature Graphic padding (v7.10.0)
purgetss brand --notification --splash                    # add notification + splash
purgetss brand --no-tinted                                # skip iOS 18+ tinted variant
purgetss brand --dry-run                                  # preview without writing
purgetss brand --cleanup-legacy --dry-run                 # preview legacy cleanup
```

## Community-Discovered Patterns

- **Titanium SDK wiring lag for iOS 18+ variants.** Titanium SDK currently wires `DefaultIcon-ios.png` into the generated appiconset automatically, but `DefaultIcon-Dark.png` and `DefaultIcon-Tinted.png` are not picked up yet. Until [tidev/titanium-sdk#14122](https://github.com/tidev/titanium-sdk/issues/14122) merges, the practical workaround is: run `ti build -p ios` once, then open `build/iphone/Assets.xcassets/AppIcon.appiconset/` in Xcode and drag the two PNGs into the "Appearance" column of the asset catalog editor. The generated PNGs are already named and sized correctly — no resizing needed.
- **Wordmark logos need a separate launcher mark.** When `logo.svg` is a wide wordmark or vertical lockup, it tends to look cramped inside Android launcher masks. Drop a square `logo-icon.svg` (or set `brand.logos.androidLauncher`) and the launcher icons get the dedicated mark while the rest of the brand set still uses the main logo. Same idea applies to Android 12+ splash with `logo-splash.svg`.
- **Three Android assets, three different jobs.** `ic_launcher*` drives the app icon and the default Android 12+ splash; `splash_icon.png` is generated only when you pass `--splash` and Titanium needs an explicit splash theme to actually use it; `default.png` is the older Titanium Android splash fallback (regenerated since v7.7.0, intentionally kept by `cleanup-legacy`). Knowing which file does what saves a lot of "but the icon didn't change" debugging.

## See also

- [`brand` command reference](./cli-commands.md#brand-command) — terse flag list.
- [Multi-Density Images](./multi-density-images.md) — sibling `images` command for UI assets.
