# PurgeTSS CLI Commands

This page lists the commands available in PurgeTSS. For release-by-release feature additions and behavior changes, see [Version History](./version-history.md).

## Setup Commands

- `init`: Initializes PurgeTSS on an existing Alloy project.
- `create`: Creates a new Alloy project with PurgeTSS already set up.
- `brand`: Generates the Titanium branding set from a single logo. See [`brand` Command](#brand-command).
- `images`: Generates multi-density UI images from sources in `./purgetss/images/`. See [`images` Command](#images-command).

## Development Commands

- `build`: Generates `utilities.tss` from `config.cjs`.
- `watch`: Runs `purgetss` automatically on each project compile (defaults to `--on`).

## Asset Commands

- `icon-library`: Copies the official icon fonts into `./app/assets/fonts`.
- `build-fonts`: Generates `./purgetss/styles/fonts.tss` with class definitions and `fontFamily` selectors for custom fonts.

## Utility Commands

- `shades`: Generates shades and tints for a color and writes the palette to `config.cjs`.
- `semantic`: Generates Titanium semantic colors (Light/Dark) into `app/assets/semantic.colors.json`. See [`semantic` Command](#semantic-command).
- `color-module`: Creates `./app/lib/purgetss.colors.js` with the colors defined in `config.cjs`.
- `module`: Installs `purgetss.ui.js` in the `lib` folder.

## Maintenance Commands

- `update`: Updates PurgeTSS to the latest version.
- `sudo-update`: Updates PurgeTSS using `sudo` to install npm modules if needed.

## `init` Command

The `init` command sets up PurgeTSS by creating `./purgetss/config.cjs` at the root of an existing Alloy project.

No arguments or options are needed. The command creates the file inside `./purgetss/`.

```bash
purgetss init

# alias:
purgetss i
```

`./purgetss/config.cjs`
```javascript
module.exports = {
  purge: {
    mode: 'all',
    method: 'sync', // How to execute the auto-purging task: sync or async

    // These options are passed directly to PurgeTSS
    options: {
      missing: true, // Reports missing classes
      widgets: false, // Purges widgets too
      safelist: [], // Array of classes to keep
      plugins: [] // Array of properties to ignore
    }
  },
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
      ios: '4%',             // iOS aesthetic padding. Range 2-8%.
      androidLegacy: '10%',  // legacy ic_launcher.png padding %
      androidAdaptive: '19%' // adaptive icon safe-zone %. Spec floor 19.44%.
    },
    android: {
      splash: false,         // also generate splash_icon.png × 5
      notification: false    // also generate ic_stat_notify.png × 5
    },
    ios: {
      dark: true,            // emit DefaultIcon-Dark.png (set false to skip)
      tinted: true,          // emit DefaultIcon-Tinted.png (set false to skip)
      darkBackground: null   // null = transparent per Apple HIG; set a hex like '#111111' for an opaque dark bg
    },
    colors: {
      background: '#FFFFFF'  // Android adaptive bg + iOS/marketplace flatten
    },
    confirmOverwrites: true  // prompt before overwriting files (set false to skip)
  },
  images: {
    quality: 85,             // JPEG/WebP/AVIF quality (0-100)
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    confirmOverwrites: true  // prompt before overwriting files (set false to skip)
  },
  theme: {
    extend: {}
  }
};
```

`init` also creates empty `purgetss/fonts/`, `purgetss/brand/`, and `purgetss/images/` folders so you can see where each kind of asset goes.

> **Tip**
> PurgeTSS looks for `./purgetss/config.cjs`. Each section is optional and can be customized. Missing sections use the default configuration. The `brand:` and `images:` sections are auto-injected into older configs on first run in v7.6.0+.

## `create` Command

The `create` command generates a new Alloy project with PurgeTSS already set up.

### Arguments

- Enclose the project name in single or double quotes. Required.

### Options

- `-f, --force` to overwrite an existing project.
- `-d, --dependencies` to install ESLint and Tailwind CSS.
- `-m, --module` to install the `purgetss.ui.js` module in the project's `./app/lib/` folder.
- `-v, --vendor [fa,mi,ms,f7]` to copy the selected fonts into your project and add the CommonJS module in `./app/lib/`. See the `icon-library` command for available fonts.

If a project with the same name already exists, the command will prompt you to confirm whether you want to overwrite it.

```bash
purgetss create 'Name of the Project' [--vendor="fontawesome, materialicons, materialsymbols, framework7"]

# alias:
purgetss c 'Name of the Project' [-v=fa,mi,ms,f7]
```

### Requirements

Ensure that `app.idprefix` and `app.workspace` are configured in Titanium's `config.json`.

```bash
# A name in reverse domain name format.
app.idprefix = "com.yourdomain"

# Path to use as the workspace directory for new projects.
app.workspace = "/<full-path-to>/<workspace>/<folder>"
```

Use `ti config` to set up both settings:

```bash
ti config app.idprefix 'com.yourdomain'
ti config app.workspace 'the-full-path/to-the-workspace-folder'
```

### Installing Dev Dependencies

Adds linting and editor support to an existing project.

```bash
purgetss create 'Name of the Project' [--dependencies]

# alias:
purgetss c 'Name of the Project' [-d]
```

This option installs ESLint for code quality, Tailwind CSS for utility classes, and setup files for Visual Studio Code.

> **Warning**
> Tailwind CSS is installed here for editor support and related tooling. PurgeTSS remains a separate Titanium styling toolkit.

Recommended VSCode extensions:

- [XML Tools](https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml): XML formatting.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Linting and coding standards.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): PurgeTSS class support.
- [Tailwind Raw Reorder (v4)](https://marketplace.visualstudio.com/items?itemName=KevinYouu.tailwind-raw-reorder-tw4): Class sorting for XML and JS files.
- [Intellisense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion): Class completion based on your `purgetss/config.cjs`, including `fonts.tss` and `utilities.tss`.

### Commands Executed Internally

`purgetss create "Name of the Project" [--dependencies --vendor=fa,mi,ms,f7]` runs: `ti config` (reads idprefix/workspace), `ti create -t app -p all -n "Name"`, `alloy new`, `purgetss w`, `purgetss b`, optional `--vendor` (copies fonts + CommonJS module), optional `--dependencies` (installs Tailwind CSS, ESLint with Titanium plugins, and config files), then opens the project in VS Code, Sublime Text, or Finder.

## `brand` Command

Introduced in v7.6.0, restructured in v7.7.0. Generates the complete Titanium branding set (launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, optional notification/splash icons) from a single logo image — with optional Android-specific logo overrides when you need them. Alloy and Classic projects are auto-detected.

> **Tip**
> This is a quick reference. See [app-branding.md](./app-branding.md) for the complete guide — workflow, padding guidance, Android dark mode, iOS 18+ variants, alpha channel handling, and troubleshooting.

```bash
purgetss brand                              # uses purgetss/brand/logo.{svg,png} + config
purgetss brand path/to/logo.svg             # positional logo path override
```

### Flags

**Project & output**

| Flag | Purpose |
| --- | --- |
| `--project <path>` | Project root (defaults to cwd). |
| `--dry-run` | Preview what would be generated without writing any files. |
| `--output <dir>` | Stage into `<dir>` instead of writing in place. |
| `-y, --yes` | Skip the overwrite confirmation prompt for this invocation. |

**Visual customization**

| Flag | Purpose |
| --- | --- |
| `--bg-color <hex>` | Background color for Android adaptive + iOS/marketplace flatten. |
| `--padding <n>` | Shortcut: sets BOTH Android paddings to the same value for one run. Fixed in v7.10.0 — previously only fed `androidAdaptivePadding`, leaving `androidLegacyPadding` at its own config value. |
| `--android-adaptive-padding <n>` | Adaptive icon safe-zone % (default `19`). |
| `--android-legacy-padding <n>` | Legacy `ic_launcher.png` padding % (default `10`). |
| `--ios-padding <n>` | iOS aesthetic padding % (range `2-8`, default `4`). |
| `--feature-graphic-padding <n>` | (v7.10.0) Vertical padding for `MarketplaceArtworkFeature.png` (range `0-40`, default `12`). |

**Optional asset types**

| Flag | Purpose |
| --- | --- |
| `--notification` | Also emit `ic_stat_notify.png × 5`. |
| `--splash` | Also emit `splash_icon.png × 5`. |

**Logo variants & overrides**

| Flag | Purpose |
| --- | --- |
| `--icon-logo <path>` | Override `purgetss/brand/logo-icon.{svg,png}` for Android launcher icons (square mark for non-square main logos). |
| `--monochrome-logo <path>` | Override `purgetss/brand/logo-mono.{svg,png}`. |
| `--dark-logo <path>` | Override `purgetss/brand/logo-dark.{svg,png}`. |
| `--dark-bg-color <hex>` | Opaque dark bg for `DefaultIcon-Dark.png` (default: transparent per Apple HIG). |
| `--splash-logo <path>` | Override `purgetss/brand/logo-splash.{svg,png}` for Android 12+ splash artwork. |
| `--tinted-logo <path>` | Override `purgetss/brand/logo-tinted.{svg,png}`. |
| `--feature-logo <path>` | (v7.10.0) Override `purgetss/brand/logo-feature.{svg,png}` for the Google Play Feature Graphic (1024×500). |
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

### Positional argument

- `[logo-path]` (optional) — overrides auto-discovery of `purgetss/brand/logo.{svg,png}`.

### Config block (v7.7.0 grouped structure)

Defaults live under `brand:` in `purgetss/config.cjs` and are injected automatically:

```javascript
brand: {
  logos: {
    // Optional overrides. If omitted, PurgeTSS auto-discovers files from purgetss/brand/:
    // primary: './docs/logo.svg',
    // androidLauncher: './docs/app-icon.svg',
    // androidSplash: './docs/splash.svg',
    // monochrome: './docs/logo-mono.svg',
    // iosDark: './docs/logo-dark.svg',
    // iosTinted: './docs/logo-tinted.svg',
    // featureGraphic: './docs/logo-feature.svg'  // Google Play 1024×500 banner (v7.10.0)
  },
  padding: {
    ios: '4%',              // iOS aesthetic padding. Range 2-8%.
    androidLegacy: '10%',   // legacy ic_launcher.png padding %
    androidAdaptive: '19%', // adaptive icon safe-zone %. Spec floor 19.44%.
    featureGraphic: '12%'   // MarketplaceArtworkFeature.png vertical padding (v7.10.0)
  },
  android: {
    splash: false,         // also generate splash_icon.png × 5
    notification: false    // also generate ic_stat_notify.png × 5
  },
  ios: {
    dark: true,            // emit DefaultIcon-Dark.png (set false to skip)
    tinted: true,          // emit DefaultIcon-Tinted.png (set false to skip)
    darkBackground: null   // null = transparent per Apple HIG; set a hex like '#111' for an opaque dark bg
  },
  colors: {
    background: '#FFFFFF'  // Android adaptive bg + iOS/marketplace flatten
  },
  confirmOverwrites: true  // prompt before overwriting files
}
```

The recommended workflow is convention-first: drop files in `purgetss/brand/`, let auto-discovery pick them up. Treat `brand.logos.*` as optional overrides for one-off paths or when masters live outside `purgetss/brand/`.

### Confirmation prompt

`brand` writes in place, so it asks `Continue? [y/N/a]` before overwriting anything. Choose `a` (always) to write `confirmOverwrites: false` into `config.cjs` and silence the prompt on future runs. The prompt is skipped automatically when `stdin` is not a TTY (`alloy.jmk` hook, CI, pipes), when `-y`/`--yes` is passed, or when `PURGETSS_YES=1` is set.

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

### Android output groups

`brand` writes three Android-facing asset groups, each with a different job:

- `ic_launcher*` for the app icon and the default Android 12+ system splash path
- `splash_icon.png` when you pass `--splash` and want custom Android 12+ splash artwork
- `default.png` as the older Titanium Android splash fallback (regenerated since v7.7.0)

## `images` Command

Introduced in v7.6.0. Generates multi-density variants of your UI images (buttons, illustrations, logos, screen graphics) from a single high-resolution source per image. Alloy and Classic projects are auto-detected.

> **Tip**
> This is a quick reference. See [multi-density-images.md](./multi-density-images.md) for the complete guide — 4× source convention, re-processing single files, format conversion, subdirectory preservation, and troubleshooting.

```bash
purgetss images                                       # uses purgetss/images/ + config
purgetss images background/pink-texture.png           # re-process one file (short path)
purgetss images background/                           # re-process one subfolder
```

### Flags

| Flag | Purpose |
| --- | --- |
| `--android` | Only emit Android density variants. Mutually exclusive with `--ios`. |
| `--ios` | Only emit iPhone scale variants. Mutually exclusive with `--android`. |
| `--format <ext>` | Convert all outputs to `webp`, `jpeg`, `png`, `avif`, `gif`, or `tiff`. Default: keep source format. |
| `--quality <n>` | Quality `0-100` for lossy formats. Default `85`. |
| `--width <n>` | (v7.8.0) Pin Android `mdpi` (= iPhone `@1x`) to `<n>` pixels wide. Larger scales derive as ×1.5, ×2, ×3, ×4 from that base; height stays proportional to the source's aspect ratio. Integer in `[1, 8192]`. |
| `--opacity <n>` | (v7.10.0) Multiply alpha of every density by `n/100`. Integer in `[0, 100]`. With `--format jpeg`, alpha flattens on white. |
| `--padding <n>` | (v7.10.0) Shrink the rendered image inside each density canvas by `n%` symmetric borders. Integer in `[0, 40]`. |
| `--output <relpath>` | (v7.10.0) Override the basename and subpath relative to each platform's `images/` root. |
| `--dry-run` | Preview without writing any files. |
| `--project <path>` | Project root (defaults to cwd). |
| `-y, --yes` | Skip the overwrite confirmation prompt. |
| `--debug` | Print extra diagnostics. |

### Positional argument

- `[source]` (optional) — path to override auto-discovery. Resolves first against `purgetss/images/` (short paths like `buttons/btn.png`), then against cwd.

### When to use `--width`

Use `--width <n>` for SVG sources from vector editors with disproportionate viewBoxes — common in Affinity, Illustrator, and other design tools where the viewBox does not match the intended display size. Without the flag, every scale derives from the source's natural pixel size as a 4× master, which can produce unexpected output sizes.

When you pass an SVG without `--width`, the command prints a one-time hint and falls back to the legacy 4× behavior. This is CLI-only; there is no matching `images:` config property because the right width is per-asset.

### When to use `--opacity`, `--padding`, `--output` (v7.10.0)

The three v7.10.0 flags are designed for **placeholder / default ImageView** workflows where the source asset is a brand or logo you want to re-render at reduced opacity and/or with extra breathing room — without editing the source file itself.

- `--opacity` is a runtime alpha multiplier. JPEG flattens the result on white; PNG/WebP/AVIF keep alpha.
- `--padding` shrinks the rendered image inside each density canvas, keeping the canvas dimensions and filling the difference with transparent pixels.
- `--output` retargets the basename and subpath, useful when the source lives outside `purgetss/images/` (e.g. `purgetss/brand/`).

All three are **CLI-only by design** — no `config.cjs` equivalent — because they describe per-asset render decisions, not project-wide settings.

### Config block

Defaults live under `images:` in `purgetss/config.cjs`:

```javascript
images: {
  quality: 85,             // JPEG/WebP/AVIF quality (0-100)
  format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' | 'avif' | 'gif' | 'tiff'
  confirmOverwrites: true  // prompt before overwriting files
}
```

Like `brand`, `images` writes in place and asks `Continue? [y/N/a]` before overwriting. Selecting `a` flips `confirmOverwrites: false` in `config.cjs`. Skipped automatically when `stdin` is not a TTY, when `-y`/`--yes` is passed, or when `PURGETSS_YES=1` is set.

### Examples

```bash
purgetss images                                        # uses purgetss/images/ + config
purgetss images background/pink-texture.png            # re-process one file (short path)
purgetss images background/                            # re-process one subfolder
purgetss images --android                              # only Android densities
purgetss images --format webp --quality 90             # convert all outputs to WebP
purgetss images logo.svg --width 256                   # pin SVG output to 256 px @1x/mdpi
purgetss images logo.svg --opacity 50 --format png     # 50% alpha placeholder (v7.10.0)
purgetss images logo.svg --padding 15 --format png     # add 15% breathing room (v7.10.0)
purgetss images purgetss/brand/logo.svg \
    --opacity 30 --padding 15 \
    --output 'logos/default-image' --format png         # placeholder under custom path (v7.10.0)
purgetss images --dry-run                              # preview
```

## `semantic` Command

Introduced in v7.6.0. Generates Titanium semantic colors (Light/Dark mode aware) into `app/assets/semantic.colors.json`. The command dispatches between two distinct modes based on whether `--single` is passed.

> **Tip**
> This is a quick reference. See [semantic-colors.md](./semantic-colors.md) for the complete guide — mirror inversion math, Titanium semantic color spec, class mapping conventions, and strategies for purpose-based design systems.

### Palette mode (no `--single`)

One base hex, 11-shade tonal palette with mirror-by-index Light/Dark inversion anchored at shade `500`. Writes both files in one step: the JSON gets 11 entries, and `config.cjs` gets the family mapped to those semantic keys.

```bash
purgetss semantic <hex> <name>
purgetss semantic '#15803d' amazon
```

Usage produces classes like `bg-amazon-50`, `text-amazon-500`, `border-amazon-950` that flip tonal contrast automatically with the system appearance.

### Single mode (`--single`)

Explicit per-mode hex values for purpose-based semantic colors (`surfaceColor`, `textColor`, `borderColor`, `overlayColor`, etc.). Writes the JSON entry AND auto-maps it to a class in `config.cjs` by stripping the conventional `Color` suffix (e.g. `surfaceColor` → class `surface`).

```bash
purgetss semantic --single <hex> <name> [--dark <hex>] [--alpha <0-100>]

# Examples:
purgetss semantic --single '#F9FAFB' surfaceColor     --dark '#0f172a'
purgetss semantic --single '#111827' textColor        --dark '#f1f5f9'
purgetss semantic --single '#3B82F6' accentColor      --dark '#60a5fa' --alpha 80
purgetss semantic --single '#000000' overlayColor     --alpha 50
```

When `--dark` is omitted, it defaults to the light hex — useful for overlays/glass surfaces where alpha is the only variation.

### Customizing the class name

The auto-mapping uses the most literal Titanium-style transform: strip `Color`, then kebab-case the rest (e.g. `surfaceColor` → `surface`, `textSecondaryColor` → `text-secondary`). If your design system prefers different names — for example `on-surface` instead of `text`, or nesting the surface family under `DEFAULT` / `high` — edit `config.cjs` after running the `--single` batch:

`./purgetss/config.cjs`
```javascript
theme: {
  extend: {
    colors: {
      surface: { DEFAULT: 'surfaceColor', high: 'surfaceHighColor' },
      'on-surface': 'textColor',
      'on-surface-variant': 'textSecondaryColor',
      muted: 'textMutedColor',
      border: 'borderColor',
      accent: 'accentColor',
      overlay: 'overlayColor'
    }
  }
}
```

The next `purgetss build` picks up the renamed classes. Editing one generated mapping is faster than typing the whole structure from scratch. See [semantic-colors.md](./semantic-colors.md) for the full nested-vs-flat discussion (including the `[object Object]` pitfall when nesting without `DEFAULT`).

### Smart in-place updates

If a `--single` name matches an existing palette shade — e.g. `purgetss semantic --single '#000' amazon500` while palette `amazon` exists — PurgeTSS narrows the operation to an in-place JSON value edit. The entry stays in its original position, and `config.cjs` is left untouched (the palette already maps to that key).

Re-running on the same palette family fully replaces it: PurgeTSS strips prior keys belonging to that family (bare name + 11 shade keys) before writing the new entries. Unrelated palettes and manually-defined entries survive.

### Flags

| Flag | Purpose |
| --- | --- |
| `-s, --single` | Generate a single purpose-based semantic color (requires explicit per-mode hex). |
| `-d, --dark <hex>` | With `--single`, the dark-mode hex (defaults to the light value). |
| `-a, --alpha <0-100>` | With `--single`, wraps both modes in `{ color, alpha }` per the Titanium spec. |
| `-n, --name <name>` | Specify the name (alternative to the positional argument). |
| `-r, --random` | Palette mode — use a random base color. |
| `-o, --override` | Place the mapping in `theme.colors` instead of `theme.extend.colors`. |
| `-q, --quotes` | Keep double quotes in `config.cjs`. |
| `-l, --log` | Preview the JSON without writing any files. |

## `install-dependencies` Command

This command installs dev dependencies and configuration files in existing PurgeTSS projects, and sets up Visual Studio Code support.

```bash
purgetss install-dependencies

# alias:
purgetss id
```

> **Caution**
> This command overwrites any existing `extensions.json` and `settings.json` files. Back them up if you want to keep your current versions.

## `icon-library` Command

Copies the bundled free font files (Font Awesome 7, Material Icons, Material Symbols, Framework7 Icons) into `./app/assets/fonts/`. Once the fonts are in place, every official icon class (`fa-home`, `ms-home`, `mi-home`, `f7-house`, etc.) works out of the box — PurgeTSS resolves them at compile time from its own bundled `dist/` files.

```bash
purgetss icon-library [--vendor=fa,mi,ms,f7] [--module] [--styles]

# alias:
purgetss il [-v=fa,mi,ms,f7] [-m] [-s]
```

### Flags

| Flag | Purpose |
| --- | --- |
| `-v, --vendor [fa,mi,ms,f7]` | Copy specific font vendors only (default copies all four). |
| `-m, --module` | Copy the matching CommonJS module into `./app/lib/` so you can reference icons by name from controllers (`icons.fa.home`). |
| `-s, --styles` | Copy the official `.tss` source files into `./purgetss/styles/` for reference only — not needed for the classes to work. |

Vendor aliases: `fa`/`fontawesome`, `mi`/`materialicons`, `ms`/`materialsymbol`, `f7`/`framework7`.

> **Tip**
> This is a quick reference. See [Icon Fonts](./icon-fonts.md) for the complete guide — variant tables (`.ms`/`.mso`/`.msr`/`.mss`, `.fa`/`.fas`/`.far`/`.fab`), XML usage patterns, the side-by-side four-family example, Font Awesome Pro / Beta workflow, and instructions for recreating removed libraries.

## `build-fonts` Command

Generates `./purgetss/styles/fonts.tss` with class definitions and `fontFamily` selectors for any user-defined fonts dropped into `./purgetss/fonts/` (Google Fonts, brand typefaces, community icon libraries with `.ttf` + `.css` pairs).

```bash
purgetss build-fonts [-m] [-f]

# alias:
purgetss bf [-m] [-f]
```

### Flags

| Flag | Purpose |
| --- | --- |
| `-m, --module` | Also generates a CommonJS module in `./app/lib/purgetss.fonts.js` exposing `exports.icons` and `exports.families` for use from controllers. |
| `-f, --font-class-from-filename` | Uses the font filename as the class name and icon prefix instead of the font family. Replaces the old `-p` flag. |

### What it does

1. Creates `./purgetss/styles/fonts.tss` with one `fontFamily` class per file.
2. Copies the font files into `./app/assets/fonts/`, renamed to their PostScript names so they work on both iOS and Android.

> **Tip**
> This is a quick reference. See [Custom Fonts](./custom-fonts.md) for the complete guide — folder organization, class renaming, adding icon libraries, the `--module` output structure, and `--font-class-from-filename` workflow.

> **Note**
> `build-fonts` is for **user-defined fonts only**. The 4 official icon families (Font Awesome 7, Material Icons, Material Symbols, Framework7) are bundled with PurgeTSS and installed via [`icon-library`](#icon-library-command), not `build-fonts`. See [Icon Fonts](./icon-fonts.md).

## `shades` Command

The `shades` command generates shades and tints for a given color and writes the palette to `config.cjs`.

```bash
purgetss shades [hexcode] [name]

# alias:
purgetss s [hexcode] [name]
```

### Arguments

- `[hexcode]`: The base hexcode value. Omit this to create a random color.
- `[name]`: The name of the color. Omit this and a name based on the color's hue will be automatically selected.

### Options

- `-n, --name`: Specifies the name of the color.
- `-q, --quotes`: Retains double quotes in the `config.cjs` file.
- `-r, --random`: Generates shades from a random color.
- `-o, --override`: Places the new shades in `theme.colors` (instead of `theme.extend.colors`) to override default colors.
- `-s, --single`: Generates a single color definition.
- `-t, --tailwind`: Logs the generated shades with a `tailwind.config.js` compatible structure.
- `-l, --log`: Logs the generated shades instead of saving them.
- `-j, --json`: Logs a JSON compatible structure, which can be used in `./app/config.json`.

> **Info**
> More than 66% of `utilities.tss` classes are related to color properties, so `shades` is a practical way to extend color choices.

Basic usage:

```bash
purgetss shades 53606b Primary

# alias:
purgetss s 53606b Primary
```

The shades are added to `config.cjs`. Next time `purgetss` runs, `utilities.tss` picks them up.

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f4f6f7',
          '100': '#e3e7ea',
          '200': '#cad2d7',
          '300': '#a6b3ba',
          '400': '#7a8b96',
          '500': '#5f707b',
          '600': '#53606b',
          '700': '#464f58',
          '800': '#3e444c',
          '900': '#373c42',
          default: '#53606b'
        }
      }
    }
  }
}
```

Use the `--log` option to output to the console instead of saving to `config.cjs`.

```bash
purgetss shades 53606b Primary --log

# alias:
purgetss s 53606b Primary -l
```

Use the `--tailwind` option to output the generated shades with a `tailwind.config.js` compatible structure.

```bash
purgetss shades 000f3d --tailwind

# alias:
purgetss s 000f3d -t
```

To generate a random color value, use `--random`. Here, `--log` logs it to the console:

```bash
purgetss shades -rl
```

To log a Titanium `config.json` compatible structure to the console, use `--json`:

```bash
purgetss shades '#65e92c' -j

# alias:
purgetss s '#65e92c' -j
```

> **Info**
> The `shades` command is the first one that writes to `config.cjs`. If you run into issues, please report them.

## `color-module` Command

This command creates `purgetss.colors.js` in the `lib` folder with all colors defined in `config.cjs`.

```bash
purgetss color-module

# alias:
purgetss cm
```

`./lib/purgetss.colors.js`
```javascript
module.exports = {
  primary: {
    '50': '#f4f6f7',
    '100': '#e3e7ea',
    '200': '#cad2d7',
    '300': '#a6b3ba',
    '400': '#7a8b96',
    '500': '#5f707b',
    '600': '#53606b',
    '700': '#464f58',
    '800': '#3e444c',
    '900': '#373c42',
    default: '#53606b'
  }
  // ...additional colors from config.cjs
}
```

This is handy for using colors in code without hardcoding values in multiple places.

## `build` Command

The `build` command generates `utilities.tss` from `config.cjs`. Run it after you change `config.cjs`.

```bash
purgetss build

# alias:
purgetss b
```

When `purgetss` runs (manually or via `watch`), it checks for changes in `config.cjs` and regenerates `utilities.tss` when needed.

### Options

- `--glossary`: Creates a glossary folder with all generated classes.

## `watch` Command

The `watch` command runs PurgeTSS on each project compile. You do not need to run `build` manually after each change.

```bash
purgetss watch

# alias:
purgetss w
```

This works well with LiveView since it re-runs on changes such as adding or removing styles in views.

The command installs a task in `alloy.jmk`:

```javascript
task('pre:compile', (event, logger) => {
  require('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));
});
```

> **Info**
> This feature works with standard Alloy projects compiled using `ti build`. It has not been tested with project types built using Webpack or Vue.

To deactivate it, use `--off`.

```bash
purgetss watch --off

# alias:
purgetss w -o
```

To completely remove the Auto-Purging hook from `alloy.jmk`, use `-d, --delete`.

```bash
purgetss watch --delete

# alias:
purgetss w -d
```

## `module` Command

The `module` command installs `purgetss.ui.js` in the `lib` folder.

```bash
purgetss module

# alias:
purgetss m
```

The PurgeTSS module includes:

- Animation: Methods for playing or applying basic animations and transformations to Alloy objects.

See [Animation System](./animation-system.md) for details.

## `update` Command

The `update` command upgrades PurgeTSS to the latest version.

```bash
purgetss update

# alias:
purgetss u
```

Runs `npm install -g purgetss@latest`.

## `sudo-update` Command

The `sudo-update` command is the same as `update`, but uses `sudo` to install npm modules when needed.

```bash
purgetss sudo-update

# alias:
purgetss su
```

## Community-Discovered Patterns

### v7.2.x environment notes

These items were surfaced in community threads during the v7.2.x rollout and remain relevant operational context for anyone upgrading from pre-v7.2 installs:

- Node.js 20+ required (due to the `inquirer` v13 upgrade).
- Font Awesome 7 support, including the CSS custom properties format.
- Titanium SDK 13.1.x support, with new properties from 13.1.0.GA.
- Removed deprecated commands: `copy-fonts` and `build-legacy` are no longer available — scripts referencing either will fail.
- Install size reduced by ~45MB (non-essential assets moved to dev dependencies).
- Improved Unicode extraction for more formats and direct character mappings in `build-fonts`.
