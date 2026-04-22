# App Icons & Branding

The `purgetss brand` command (shipped in PurgeTSS v7.6.0) generates the complete Titanium branding set from a single SVG or PNG logo: launcher icons across every Android density, the adaptive-icon trio (foreground + background + monochrome), iOS 18+ Dark and Tinted variants, marketplace artwork, and optional notification/splash icons. Alloy and Classic layouts are auto-detected.

For the terse flag reference, see the [`brand` command reference](./cli-commands.md#brand-command). For sibling UI assets, see [Multi-Density Images](./multi-density-images.md).

> **INFO**
>
> The `brand` command at a glance
> `purgetss brand` turns one logo into every asset a Titanium app needs to ship — launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, and optional notification/splash icons. Works on both Alloy and Classic projects.

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
├── logo-mono.svg         optional — monochrome layer + notifications
├── logo-dark.svg         optional — iOS 18+ dark variant
└── logo-tinted.svg       optional — iOS 18+ tinted variant
```

Only `logo.svg` (or `logo.png`) is required. The other three are **opt-in refinements**:

| File | Required? | What it's for | Fallback when omitted |
| --- | --- | --- | --- |
| `logo.svg` / `logo.png` | **Required** | Main colored logo. Feeds every density and variant. | — |
| `logo-mono.svg` / `.png` | Optional | Android adaptive monochrome layer (themed icons on Android 13+) and notification icons. | Main logo is whitened automatically. |
| `logo-dark.svg` / `.png` | Optional | iOS 18+ Dark appearance variant. | Main logo on a transparent background (Apple HIG default). |
| `logo-tinted.svg` / `.png` | Optional | iOS 18+ Tinted appearance variant. | Grayscale of the main logo on black. |

Provide a dedicated `logo-mono` when the colored logo has detail that would collapse into a featureless blob under naive whitening (e.g. a painter's palette with colored dots — the monochrome variant should have cutouts instead).

Provide a dedicated `logo-dark` when dark-mode brand guidelines use a different lockup or color treatment; provide `logo-tinted` when you want a pre-simplified silhouette that tints better than a naive grayscale of the colored version.

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
  logo: './docs/snap-logo.svg',
  monochromeLogo: './docs/snap-logo-mono.svg'
}
```

Precedence: **CLI flags win over config values, and config values win over auto-discovery.**

## The `brand:` config section

On the first run, `purgetss brand` injects a `brand:` block into your existing `purgetss/config.cjs` (between `purge:` and `theme:`) with these defaults:

```javascript
brand: {
  splash: false,           // also generate splash_icon.png × 5
  padding: '15%',          // Android safe-zone. Range: 12% tight (mature logos) — 20% conservative. Spec floor 19.44%.
  iosPadding: '4%',        // iOS aesthetic. Range: 2% bold — 8% conservative. No launcher mask.
  darkBgColor: null,       // opaque dark bg for DefaultIcon-Dark.png (null = transparent per Apple HIG)
  bgColor: '#FFFFFF',      // Android adaptive bg + iOS/marketplace flatten
  notification: false,     // also generate ic_stat_notify.png × 5
  confirmOverwrites: true  // prompt before overwriting files (set false to skip)
}
```

| Key | Default | Purpose |
| --- | --- | --- |
| `splash` | `false` | When `true`, also emits `splash_icon.png` × 5 densities. |
| `padding` | `'15%'` | Per-side safe-zone padding inside the 1024×1024 Android canvas. |
| `iosPadding` | `'4%'` | Aesthetic padding for the iOS square icon. Smaller than Android because iOS has no launcher mask. |
| `darkBgColor` | `null` | Opaque background baked into `DefaultIcon-Dark.png`. `null` = transparent per Apple HIG (iOS paints its own gradient). |
| `bgColor` | `'#FFFFFF'` | Triple-purpose (see [Brand color](#brand-color) below). |
| `notification` | `false` | When `true`, also emits `ic_stat_notify.png` × 5 densities. |
| `confirmOverwrites` | `true` | When `false`, the `[y/N/a]` prompt is skipped. |

Change whatever you want to override globally; CLI flags still win for one-off runs.

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
└── app/
    └── assets/android/res/
        ├── mipmap-mdpi/            ← 108×108 foreground + background + monochrome + legacy
        ├── mipmap-hdpi/            ← 162×162
        ├── mipmap-xhdpi/           ← 216×216
        ├── mipmap-xxhdpi/          ← 324×324
        ├── mipmap-xxxhdpi/         ← 432×432
        └── mipmap-anydpi-v26/
            └── ic_launcher.xml     ← adaptive-icon binder
```

**Classic layout:**

```text
<project>/
├── DefaultIcon.png  DefaultIcon-ios.png  ...     ← same root-level files as Alloy
└── platform/
    └── android/res/
        ├── mipmap-*/               ← same 5 densities as Alloy
        └── mipmap-anydpi-v26/ic_launcher.xml
```

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

The `--bg-color` flag (or `brand.bgColor` in config) controls three things at once:

1. The **Android adaptive background layer**: a solid color that fills the full 108dp canvas behind your logo.
2. The **iOS alpha flatten** for `DefaultIcon-ios.png`. Apple rejects transparent App Store icons, so the logo is flattened on this color.
3. The **marketplace flatten** for `iTunesConnect.png` and `MarketplaceArtwork.png` when you pass a non-default value explicitly.

```bash
purgetss brand --bg-color "#0B1326"
```

If you never pass the flag, background stays `#FFFFFF` and the marketplace artwork keeps its alpha channel (matches Titanium's default).

## Padding guidance

`--padding` controls how much safe-zone padding (per side, expressed as a percentage) surrounds the logo inside the Android adaptive canvas. The default `15%` matches real-world production apps like Gmail and Chrome.

| Padding | Logo fill | When to use |
| ------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `12%`   | 76%       | Logos with built-in breathing room (circular wordmarks, letterforms inside a shape). Tight, bold look. |
| `15%`   | 70%       | **Default**. Balanced, safe on Pixel, Oppo, Samsung, OneUI, and Nova. |
| `18%`   | 64%       | Defensive: for intricate logos, fine serifs, multi-element designs. |
| `20%`   | 60%       | Conservative, spec-compliant. Safe on every launcher, including legacy aggressive masks. |

A useful visual check is the "corners" heuristic: imagine a circle inscribed in your 1024×1024 canvas with the given padding. If your logo's outermost corners fit inside that circle, you're safe on circular launchers (Pixel default, Oppo Android 15). If they poke out, they'll be clipped.

The official Android spec floor is `19.44%` (108dp canvas, 66dp inscribed safe-zone circle). Modern launchers are more permissive: Gmail and Chrome ship at 10–14%, which is why `15%` is the default. The 19.44% floor is the theoretical worst-case for aggressive masks; if you're worried about legacy Samsung teardrop masks or similar, bump to `--padding 20` to stay inside the spec.

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

## Troubleshooting

### The icon looks cropped or cramped on my phone

Your logo is probably landing too close to the launcher mask. Increase `--padding`:

```bash
purgetss brand --padding 20
```

Or set it in the config:

```javascript
brand: { padding: '20%' }
```

### The icon looks tiny / lost in the middle

Padding is too generous. Lower it:

```bash
purgetss brand --padding 12
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
| `--padding <n>` | Android safe-zone % (range `12–20`, default `15`). |
| `--ios-padding <n>` | iOS aesthetic padding % (range `2–8`, default `4`). |

**Optional asset types**

| Flag | Purpose |
| --- | --- |
| `--notification` | Also emit `ic_stat_notify.png × 5`. |
| `--splash` | Also emit `splash_icon.png × 5`. |

**Logo variants & overrides**

| Flag | Purpose |
| --- | --- |
| `--monochrome-logo <path>` | Override `purgetss/brand/logo-mono.{svg,png}`. |
| `--dark-logo <path>` | Override `purgetss/brand/logo-dark.{svg,png}`. |
| `--dark-bg-color <hex>` | Opaque dark bg for `DefaultIcon-Dark.png` (default: transparent per Apple HIG). |
| `--tinted-logo <path>` | Override `purgetss/brand/logo-tinted.{svg,png}`. |
| `--no-dark` | Skip `DefaultIcon-Dark.png`. |
| `--no-tinted` | Skip `DefaultIcon-Tinted.png`. |

**Legacy cleanup**

| Flag | Purpose |
| --- | --- |
| `--cleanup-legacy` | Remove obsolete branding artifacts (reads `tiapp.xml` for safety rules). |
| `--aggressive` | With `--cleanup-legacy`, also remove `ldpi` density folders. |

**Diagnostics**

| Flag | Purpose |
| --- | --- |
| `--notes` | Print full `tiapp.xml` snippets + padding tuning guide. |
| `--debug` | Print extra diagnostics. |

### Examples

```bash
purgetss brand                                         # uses purgetss/brand/logo.svg + config
purgetss brand --bg-color "#0B1326"                    # override bg color
purgetss brand --notification --splash                 # add notification + splash
purgetss brand --no-tinted                             # skip iOS 18+ tinted variant
purgetss brand --dry-run                               # preview without writing
purgetss brand --cleanup-legacy --dry-run              # preview legacy cleanup
```

## Community-Discovered Patterns

- **Titanium SDK wiring lag for iOS 18+ variants.** Titanium SDK currently wires `DefaultIcon-ios.png` into the generated appiconset automatically, but `DefaultIcon-Dark.png` and `DefaultIcon-Tinted.png` are not picked up yet. Until [tidev/titanium-sdk#14122](https://github.com/tidev/titanium-sdk/issues/14122) merges, the practical workaround is: run `ti build -p ios` once, then open `build/iphone/Assets.xcassets/AppIcon.appiconset/` in Xcode and drag the two PNGs into the "Appearance" column of the asset catalog editor. The generated PNGs are already named and sized correctly — no resizing needed.
- **Modern launchers ship tighter than the spec.** The Android adaptive-icon spec floor is `19.44%` padding, but shipped apps like Gmail and Chrome use `10–14%`. PurgeTSS's `15%` default sits in that real-world range rather than the conservative spec floor, which is why icons look tight-but-balanced out of the box.

## See also

- [`brand` command reference](./cli-commands.md#brand-command) — terse flag list.
- [Multi-Density Images](./multi-density-images.md) — sibling `images` command for UI assets.
