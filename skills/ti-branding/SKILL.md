---
name: ti-branding
description: "Generate complete app branding assets for modern Titanium SDK 13.x projects — launcher icons, adaptive icons, splash-screen icons, notification icons, and marketplace artwork — from a single SVG or PNG master. Use when the user asks to brand their app, update the app icon, set up splash screens, prepare store assets, fix generic/placeholder icons, add a notification icon, generate a launcher for Android 8+/13+, replace the TiTools default icon, or anything related to visual identity of a Titanium app (Alloy or Classic). Auto-detects Alloy vs Classic layout. Outputs iOS `DefaultIcon-ios.png` (flattened), Android adaptive triplet (foreground + background + monochrome) across 5 densities, Android legacy launcher × 5, marketplace artwork (1024² + 512²), and optionally notification icons and Android 12+ splash icons. Targets SDK 13.0–13.2 minimums without legacy cruft (post-Xcode 14 iOS minimums, no 9-patch splash, no pre-adaptive Android icons). Delegates raster work to ImageMagick + librsvg (system tools) — zero npm/pip dependencies. Invoke this skill whenever the user mentions icons, splash screens, branding, launcher, adaptive icon, mipmap, appiconset, DefaultIcon, iTunesConnect, Play Store artwork, or any visual asset for a Titanium app."
argument-hint: "[master-path] [--bg-color <hex>] [--padding <pct>] [--with-notification] [--with-splash-icon] [--cleanup-legacy] [--aggressive] [--dry-run]"
allowed-tools: Read, Glob, Bash, Write, Edit
---

# Titanium branding — icons and splash screens

Generate the full set of launcher icons, adaptive icons, splash icons, notification icons, and marketplace artwork for a Titanium SDK 13.x project from ONE master input. Non-destructive by default (dry-run first, confirm before overwriting).

## When to invoke this skill

Invoke proactively whenever the user's work touches any of:

- Replacing the generic/placeholder icon that ships with new Titanium projects
- Adding brand identity (logo-based launcher) to an app
- Fixing "my icon looks pixelated / pegado / cut-off on Android"
- Setting up the Android 12+ splash screen with a custom background color
- Generating notification icons for Firebase Cloud Messaging / local reminders
- Preparing App Store / Google Play artwork for a release build
- Updating icons after a rebrand or logo refresh
- Generating adaptive icon foreground / background / monochrome layers
- Migrating a legacy project to modern Android adaptive icons

## What gets generated

Every invocation produces (in a staging directory, reviewed before copy):

| Asset | Path in project | Why |
|---|---|---|
| `DefaultIcon-ios.png` (1024×1024, no alpha) | Project root | iOS SDK generates the full appiconset from this at build time. Flattened because Apple rejects alpha channels. |
| `iTunesConnect.png` (1024×1024, no alpha) | Project root | App Store submission requirement. |
| `MarketplaceArtwork.png` (512×512, no alpha) | Project root | Google Play submission requirement. |
| `ic_launcher_foreground.png` × 5 densities | `app/platform/android/res/mipmap-{m,h,x,xx,xxx}hdpi/` | Adaptive icon foreground layer. Logo centered in 108dp canvas with configurable padding (default 22% ≈ 66dp safe-zone). |
| `ic_launcher_background.png` × 5 densities | idem | Adaptive icon background layer — solid `--bg-color`. |
| `ic_launcher_monochrome.png` × 5 densities | idem | Android 13+ themed icons (all non-transparent pixels → white). |
| `ic_launcher.png` × 5 densities (legacy) | idem | Fallback for Android < 8 (~3% of users in 2026). |
| `ic_launcher.xml` | `app/platform/android/res/mipmap-anydpi-v26/` | Adaptive icon definition that binds the 3 layers. |

Optional (flags):

| Asset | Flag | Path |
|---|---|---|
| `ic_stat_notify.png` × 5 densities (white + alpha) | `--with-notification` | `app/platform/android/res/drawable-{m,h,x,xx,xxx}hdpi/` |
| `splash_icon.png` × 5 densities | `--with-splash-icon` | idem (drawable-*) — for Android 12+ `windowSplashScreenAnimatedIcon` |

For Classic projects (Resources/ layout), paths resolve to `Resources/android/...` instead of `app/platform/android/...`.

## Dependencies

- **ImageMagick 7.x** (required) — raster ops. `brew install imagemagick` / `apt install imagemagick`
- **librsvg** (optional, only if input is SVG) — SVG → PNG rasterization. `brew install librsvg` / `apt install librsvg2-bin`
- **Python 3** (optional, only for `--with-notification` alpha-mask extraction) — stdlib only, no pip install needed

The skill's `scripts/lib/deps.sh` detects missing tools and prints OS-specific install instructions. Do not attempt to auto-install.

## Invocation

Main entry point: `scripts/ti-branding`. The skill runs it via Bash and then handles the review/copy workflow in Claude.

```bash
bash scripts/ti-branding <master> [options]
```

Options:

| Flag | Default | Purpose |
|---|---|---|
| `--bg-color <hex>` | `#FFFFFF` | Solid color for adaptive background layer. Also used for iOS alpha flatten. |
| `--padding <pct>` | `22` | Safe-zone padding per side (Android official minimum is 19.44% — 22% adds a small buffer against launcher masking). Range 0–40. |
| `--with-notification` | off | Emit `ic_stat_notify.png` × 5 densities. |
| `--with-splash-icon` | off | Emit `splash_icon.png` × 5 densities (Android 12+ SplashScreen API). |
| `--cleanup-legacy` | off | After generating (or standalone), scan the project for legacy branding artifacts — iOS launch image PNGs, Android `default.png`, `appicon.png`, `res-long-*/res-notlong-*`, etc. — and remove them. Context-aware: reads `tiapp.xml` to decide what's safe. See `references/cleanup-legacy.md`. |
| `--aggressive` | off | With `--cleanup-legacy`, also remove `ldpi` density folders (<1% of active devices globally in 2026). Off by default to be conservative. |
| `--output <dir>` | `<project>/.ti-branding/` | Staging directory. Review before copying to `app/`. |
| `--dry-run` | off | Print what would be generated/removed without writing or deleting. Works with both generation and `--cleanup-legacy`. |

## Workflow

1. **Detect project layout** — look for `app/` (Alloy) or `Resources/` (Classic). If neither, error.
2. **Validate master** — run `scripts/lib/validate.sh` to confirm dimensions ≥ 1024×1024, square, and check for alpha-bleed at edges.
3. **Check dependencies** — `scripts/lib/deps.sh` verifies `magick` + (if SVG) `rsvg-convert`.
4. **Prepare master** — `scripts/lib/prepare-master.sh` converts SVG → 1024×1024 PNG with transparency preserved, or normalizes PNG input. Auto-crops transparent padding already in the source.
5. **Generate assets** — call `gen-ios.sh`, `gen-android-adaptive.sh`, `gen-android-legacy.sh`, `gen-marketplace.sh` (and optionally `gen-notification.sh`, `gen-splash-icon.sh`). All outputs land in the staging directory.
6. **Review with user** — show a diff of what will be overwritten in the project. Ask for explicit confirmation.

   When opening generated PNGs for visual review, use the OS-native **lightweight previewer** — not whatever app the user has configured as the default PNG handler. Otherwise heavy editors like Affinity, Photoshop, or GIMP launch for a simple 3-file preview, which is annoying. Commands by OS:

   - **macOS**: `open -a Preview <file>...` — Preview.app ships with every Mac, lightweight, always available.
   - **Linux**: `xdg-open <file>` — desktop-agnostic, honors the user's registered image viewer. If you need something specific, `eog` (GNOME) / `gwenview` (KDE) / `feh` are common lightweight viewers. Prefer `xdg-open` as the portable default.
   - **Windows**: `start "" <file>` (cmd) or `Invoke-Item <file>` (PowerShell). Windows doesn't ship a universal lightweight viewer equivalent to Preview — it uses whatever the user set (Photos app by default on Windows 10/11). Live with that.

   Only preview 2–3 representative assets (e.g. `DefaultIcon-ios.png`, the highest-density `ic_launcher_foreground.png`, and — if generated — `splash_icon.png`). Do not open all 20+ PNGs.
7. **Copy to project** — after confirmation, copy staging → target paths. Keep the staging directory for rollback.
8. **Print tiapp.xml snippets** — do NOT edit `tiapp.xml` automatically. Print exact XML blocks for the user to review and paste manually. See `references/tiapp-xml-snippets.md` for the blocks.
9. **Suggest verification build** — `ti clean && ti build -p android -T emulator` / `-p ios -T simulator`.

## Padding guidance (important)

The Android adaptive icon spec defines a 108dp canvas with a 66dp safe-zone. Expressed as padding: `(108-66)/2/108 ≈ 19.44%` per side. Anything inside the safe-zone is guaranteed to be visible regardless of the launcher's mask (circle, squircle, teardrop).

Defaults and recommendations:

| Padding | Logo fill | When to use |
|---|---|---|
| `19` (spec minimum) | 62% | Intricate logos needing maximum visible detail. Risky — leaves no buffer for aggressive launcher masks. |
| `22` (default) | 56% | Balanced: compliant with spec + 3% buffer. Recommended for most apps. |
| `25` | 50% | Logos with fine details near edges (wordmarks, thin strokes). |
| `28`–`32` | 44%–36% | Simple icons, single-letter monograms, bold shapes. Gives visual breathing room. |

If the user reports "my logo looks pegado / cramped / cut off on edges", increase padding. If the user reports "my logo looks tiny / lost in the middle", decrease padding.

## iOS notes (modern)

- iOS 13+ only. Targets Titanium SDK 13.0+.
- `DefaultIcon-ios.png` is 1024×1024 with **no alpha channel** — Apple rejects transparency. The skill flattens alpha over `--bg-color`.
- Xcode 14+ no longer requires the full 20-size appiconset. Titanium generates all required sizes from `DefaultIcon-ios.png` at build time into `build/iphone/Assets.xcassets/AppIcon.appiconset/` — the source project only needs the master.
- `DefaultIcon-Dark.png` and `DefaultIcon-Tinted.png` (iOS 18+) are out of scope for this skill's v1. The user can add them manually later.
- Launch images (`Default-*@3x.png`) are intentionally NOT generated. Modern Titanium uses `<enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>` which adapts to any resolution via the storyboard + `<default-background-color>`. Legacy PNG launch images are dead weight.

See `references/ios-appiconset.md` for full details.

## Android notes (modern)

- Minimum API: 21 (Lollipop). Target: API 34 (Android 14).
- Adaptive icons (API 26+) are the primary launcher icon. Legacy `ic_launcher.png` (flat) is included only as fallback for API 21–25.
- Monochrome layer (API 31+) is required for themed icons. The skill generates it by tinting all non-transparent foreground pixels to pure white (`RGB 255,255,255`, alpha preserved).
- Splash screen (API 31+) uses `windowSplashScreenBackground` + `windowSplashScreenAnimatedIcon` in the app theme. Pre-12 Android falls back to the launcher icon automatically. 9-patch `background.9.png` is obsolete — not generated.
- Notification icons (if `--with-notification`) must be white-on-transparent. Android applies a tint at runtime based on the notification's `color` property.

See `references/android-adaptive-icons.md` and `references/splash-screen-api.md` for depth.

## Reference files

Load these on-demand when implementing specific parts of the workflow:

- `references/ti-icon-paths.md` — Canonical paths for Alloy vs Classic layouts, per Titanium SDK version.
- `references/android-adaptive-icons.md` — Safe-zone math, densities, XML bind format, monochrome rules.
- `references/ios-appiconset.md` — Xcode 14+ minimums, DefaultIcon pipeline, alpha flattening.
- `references/notification-icons.md` — White-only rule, runtime tinting, size table.
- `references/splash-screen-api.md` — Android 12+ SplashScreen vs pre-12 legacy, iOS storyboard.
- `references/master-input-guidelines.md` — SVG best practices, PNG alpha handling, bbox auto-detection, padding ergonomics.
- `references/tiapp-xml-snippets.md` — Copy-paste blocks for `<default-background-color>`, splash theme overrides, adaptive icon manifest entries.
- `references/cleanup-legacy.md` — What `--cleanup-legacy` removes, why each artifact is obsolete, the `tiapp.xml`-driven safety rules, and real-world space savings from dogfooding on SNAP Gym.

## Non-goals

- Does not generate iOS launch image PNGs (`Default-*@3x.png`) — storyboard-driven, no longer needed.
- Does not generate Android `background.9.png` 9-patch splash — obsolete since Ti SDK 10+.
- Does not edit `tiapp.xml` — prints snippets only. User decides what to paste.
- **Does not create `values-v31/splash_theme.xml`, `values/colors.xml`, or any other resource XML file that depends on project-specific config (Gradle dependencies, existing themes, etc.).** Prints snippets for the user to paste after review. The only XML file the skill does write is `mipmap-anydpi-v26/ic_launcher.xml` — that one is pure adaptive-icon binding with no external library requirements.
- Does not install ImageMagick or librsvg — detects and instructs.
- Does not handle `DefaultIcon-Dark.png` / `DefaultIcon-Tinted.png` in v1. Leave for a future flag if users request it.
- Does not handle tab bar / toolbar icons. Those are in-app assets, not branding.

## Known limitations

### `--with-splash-icon` is "PNG-only" — wire-up is user's responsibility

Titanium SDK 13.x already generates a reasonable Android 12+ splash screen automatically, using the launcher icon you just created plus the `<default-background-color>` from `tiapp.xml`. For most apps this default is good enough and requires zero extra configuration.

The `--with-splash-icon` flag generates `splash_icon.png × 5 densities` for advanced users who want a splash icon visually distinct from the launcher icon. Wiring it up requires a custom theme, which has TWO flavors (both printed in the post-generation notes):

- **Native platform theme** (API 31+ only, no library): uses `parent="@android:style/Theme.DeviceDefault.NoActionBar"` with `android:windowSplashScreen*` attributes. Compiles out of the box. Pre-12 devices fall back to Titanium's default splash.
- **androidx.core:core-splashscreen library** (API 21+ backward-compat): uses `parent="Theme.SplashScreen"` with unqualified attributes. Requires adding `implementation 'androidx.core:core-splashscreen:1.0.1'` to `app/platform/android/build.gradle`.

The skill does NOT auto-pick or auto-create these resource files because:
1. The user may already have custom themes that conflict
2. The library flavor requires modifying Gradle config (can't be reversed cleanly)
3. `tiapp.xml` meta-data registration requires opening a possibly self-closing `<application>` tag

Print both options, explain the tradeoffs, let the user decide.

### Do NOT set the splash theme on `<application android:theme>` or on any `<activity>`

Tempting but wrong. Titanium's `Theme.AppDerived` inherits from the `<application>` theme. Setting a NoActionBar splash theme there propagates NoActionBar to every `TiActivity` in the app, stripping the ActionBar / TitleBar from every screen globally. The only correct registration is via `<meta-data android:name="io.tidev.titanium.splash.theme">`.

### `<application>` in `tiapp.xml` may be self-closing

When the project's `<application>` tag is self-closing (e.g. `<application android:icon="@mipmap/ic_launcher"/>`), users must expand it before adding `<meta-data>` children:

```xml
<!-- Before (self-closing) -->
<application android:icon="@mipmap/ic_launcher"/>

<!-- After (expanded) -->
<application android:icon="@mipmap/ic_launcher">
  <meta-data .../>
</application>
```

The skill's post-generation notes remind the user of this.

## Example invocations

```bash
# Minimal: PNG master, white background, default 22% padding
bash scripts/ti-branding ./logo.png

# SNAP Gym full kit: SVG master, navy background, notification + splash
bash scripts/ti-branding ./docs/snap-logo.svg \
    --bg-color "#0B1326" \
    --padding 22 \
    --with-notification \
    --with-splash-icon

# Tight padding for a detailed wordmark
bash scripts/ti-branding ./logo.svg --padding 19 --bg-color "#000000"

# Preview only (no files written)
bash scripts/ti-branding ./logo.svg --bg-color "#FF6600" --dry-run

# Cleanup-only mode — no master image needed, removes legacy artifacts
bash scripts/ti-branding --cleanup-legacy --dry-run
bash scripts/ti-branding --cleanup-legacy                # apply
bash scripts/ti-branding --cleanup-legacy --aggressive   # also ldpi

# One-shot: generate branding AND clean up legacy in a single invocation
bash scripts/ti-branding ./logo.svg --bg-color "#0B1326" --cleanup-legacy
```
