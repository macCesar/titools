# PurgeTSS CLI Commands

> **Info: What's new in v7.5.3 / v7.6.x / v7.7.0**
> - **`brand:` config grouped (v7.7.0)** — the flat `brand:` block from v7.6.0 was reorganized into purpose-based sections: `brand.logos`, `brand.padding`, `brand.android`, `brand.ios`, and `brand.colors`. Old projects keep working — newly-generated configs use the grouped form.
> - **Separate Android brand inputs (v7.7.0)** — `brand` can now use one logo for the general brand set, another for Android launcher icons (`logos.androidLauncher` / `--icon-logo`), and another for Android 12+ splash artwork (`logos.androidSplash` / `--splash-logo`). Drop `logo-icon.*` and `logo-splash.*` into `purgetss/brand/` or set the paths in `config.cjs`.
> - **Legacy Android splash fallback (v7.7.0)** — `purgetss brand` now regenerates `app/assets/android/default.png` (Alloy) or `Resources/android/default.png` (Classic). `cleanup-legacy` no longer removes `default.png`.
> - **`semantic` works in Classic projects (v7.6.2)** — writes to `Resources/semantic.colors.json` for Classic, keeps writing to `app/assets/semantic.colors.json` for Alloy.
> - **Confirmation prompt for destructive writes (v7.6.1)** — `brand` and `images` ask `[y/N/a]` before overwriting (auto-skipped on non-TTY, with `-y`/`--yes`, or `PURGETSS_YES=1`).
> - **New `brand` command (v7.6.0)** — generates the complete Titanium branding set (launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, optional notification/splash) from a single SVG or PNG logo. See [`brand` Command](#brand-command) and the deep-dive [app-branding.md](./app-branding.md).
> - **New `images` command (v7.6.0)** — generates multi-density UI images (Android `res-*` densities + iPhone `@1x`/`@2x`/`@3x` scales) from sources in `./purgetss/images/`. See [`images` Command](#images-command) and the deep-dive [multi-density-images.md](./multi-density-images.md).
> - **New `semantic` command (v7.6.0)** — generates Titanium semantic colors (Light/Dark) into `app/assets/semantic.colors.json` with two modes (tonal palette vs. single purpose-based color). See [`semantic` Command](#semantic-command) and the deep-dive [semantic-colors.md](./semantic-colors.md).
> - **`brand:` and `images:` config sections** auto-injected into `purgetss/config.cjs` on first run. Percentages may be written as quoted strings like `'15%'` or as plain numbers.
> - **Default font family classes (v7.5.3)** — `font-sans`, `font-serif`, and `font-mono` generated automatically with platform-appropriate values.
> - **XML validation (v7.5.3)** — detects illegal `--` sequences inside XML comments during pre-validation.

This page lists the commands available in PurgeTSS.

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
    colors: {
      background: '#FFFFFF'  // Android adaptive bg + iOS/marketplace flatten
    },
    // Optional iOS overrides:
    // ios: {
    //   dark: false,
    //   tinted: false,
    //   darkBackground: '#111111'
    // },
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
| `--padding <n>` | Shortcut: sets BOTH Android paddings to the same value for one run. |
| `--android-adaptive-padding <n>` | Adaptive icon safe-zone % (default `19`). |
| `--android-legacy-padding <n>` | Legacy `ic_launcher.png` padding % (default `10`). |
| `--ios-padding <n>` | iOS aesthetic padding % (range `2-8`, default `4`). |

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
  colors: {
    background: '#FFFFFF'  // Android adaptive bg + iOS/marketplace flatten
  },
  // Optional iOS overrides:
  // ios: {
  //   dark: false,           // skip DefaultIcon-Dark.png
  //   tinted: false,         // skip DefaultIcon-Tinted.png
  //   darkBackground: '#111' // opaque dark bg for DefaultIcon-Dark.png
  // },
  confirmOverwrites: true  // prompt before overwriting files
}
```

The recommended workflow is convention-first: drop files in `purgetss/brand/`, let auto-discovery pick them up. Treat `brand.logos.*` as optional overrides for one-off paths or when masters live outside `purgetss/brand/`.

### Confirmation prompt

`brand` writes in place, so it asks `Continue? [y/N/a]` before overwriting anything. Choose `a` (always) to write `confirmOverwrites: false` into `config.cjs` and silence the prompt on future runs. The prompt is skipped automatically when `stdin` is not a TTY (`alloy.jmk` hook, CI, pipes), when `-y`/`--yes` is passed, or when `PURGETSS_YES=1` is set.

### Examples

```bash
purgetss brand                                          # uses purgetss/brand/logo.svg + config
purgetss brand --bg-color "#0B1326"                     # override bg color
purgetss brand --icon-logo ./docs/app-icon.svg          # dedicated square Android launcher mark
purgetss brand --splash --splash-logo ./docs/splash.svg # custom Android 12+ splash artwork
purgetss brand --notification --splash                  # add notification + splash
purgetss brand --no-tinted                              # skip iOS 18+ tinted variant
purgetss brand --dry-run                                # preview without writing
purgetss brand --cleanup-legacy --dry-run               # preview legacy cleanup
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
| `--dry-run` | Preview without writing any files. |
| `--project <path>` | Project root (defaults to cwd). |
| `-y, --yes` | Skip the overwrite confirmation prompt. |
| `--debug` | Print extra diagnostics. |

### Positional argument

- `[source]` (optional) — path to override auto-discovery. Resolves first against `purgetss/images/` (short paths like `buttons/btn.png`), then against cwd.

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

The `icon-library` command copies the free font files for Font Awesome, Material Icons, Material Symbols, and/or Framework7 Icons into `./app/assets/fonts`.

```bash
purgetss icon-library [--vendor=fa,mi,ms,f7] [--module] [--styles]

# alias:
purgetss il [-v=fa,mi,ms,f7] [-m] [-s]
```

### Options and Flags

- `-v, --vendor [fa,mi,ms,f7]` to copy specific font vendors.
- `-m, --module` to copy the corresponding CommonJS module into the `./app/lib/` folder.
- `-s, --styles` to copy the corresponding `.tss` files into the `./purgetss/styles/` folder for your review.

`./app/assets/fonts/`
```bash
FontAwesome7Brands-Regular.ttf
FontAwesome7Free-Regular.ttf
FontAwesome7Free-Solid.ttf
Framework7-Icons.ttf
MaterialIcons-Regular.ttf
MaterialIconsOutlined-Regular.otf
MaterialIconsRound-Regular.otf
MaterialIconsSharp-Regular.otf
MaterialIconsTwoTone-Regular.otf
MaterialSymbolsOutlined-Regular.ttf
MaterialSymbolsRounded-Regular.ttf
MaterialSymbolsSharp-Regular.ttf
```

After copying the fonts, you can use them in Buttons and Labels. For example, for Font Awesome, set the font family to `fa` (Solid icons) and use a class like `fa-home`.

### Available Font Classes

- [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/fontawesome.tss)
- [materialicons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/materialicons.tss)
- [materialsymbols.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/materialsymbols.tss)
- [framework7icons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/framework7icons.tss)

### Copying Specific Font Vendors

```bash
purgetss icon-library --vendor="fontawesome, materialicons, materialsymbols, framework7"

# alias:
purgetss il -v=fa,mi,ms,f7
```

Available names and aliases:

- `fa`, `fontawesome` = Font Awesome Icons
- `mi`, `materialicons` = Material Icons
- `ms`, `materialsymbol` = Material Symbols
- `f7`, `framework7` = Framework7 Icons

### CommonJS Module

You can use the `--module` option to copy the corresponding CommonJS module into the `./app/lib/` folder.

```bash
purgetss icon-library --module [--vendor="fontawesome, materialicons, materialsymbols, framework7"]

# alias:
purgetss il -m [-v=fa,mi,ms,f7]
```

Each library includes a CommonJS module that exposes Unicode strings for the icon fonts.

All prefixes are stripped from their class names and camel-cased. For example:

- Font Awesome: `fa-flag` becomes `flag`.
- Material Icons: `mi-flag` becomes `flag`.
- Material Symbols: `ms-flag` becomes `flag`.
- Framework7 Icons: `f7-alarm_fill` becomes `alarmFill` and `f7-clock_fill` becomes `clockFill`.

### Font Awesome Pro

If you have a [Font Awesome Pro account](https://fontawesome.com/pro), you can generate a custom `./purgetss/styles/fontawesome.tss` file with the Pro-only classes (except duotone icons; see note below).

After setting the [@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro) with your token, install it in your project's root folder using `npm init` and `npm install --save-dev @fortawesome/fontawesome-pro` (current version 7.1.0).

To generate a new `purgetss/styles/fontawesome.tss`, run `purgetss build`. It also copies the Pro font files into `./app/assets/fonts` if needed.

> **Caution**
> Titanium cannot use Font Awesome duotone icons because each icon uses two glyphs.

### Font Awesome 7 Beta

To generate a custom `fontawesome.tss` file from [Font Awesome 7 Beta](https://fontawesome.com/download):

Move the `css` and `webfonts` folders from `fontawesome-pro-7.0.0-beta3-web/`:

```bash
fontawesome-pro-7.0.0-beta3-web/
├─ css/
└─ webfonts/
```

Into `./purgetss/fontawesome-beta/`:

```bash
purgetss/
└─ fontawesome-beta/
   ├─ css/
   └─ webfonts/
```

Then run `purgetss build` to generate your custom `fontawesome.tss` file and test the new icons.

### Font Example File

To use this file:

1. Copy the content of `index.xml` into a new Alloy project.
2. Install the official icon font files using `purgetss icon-library`.
   - Without `--vendor`, PurgeTSS copies all official icon fonts.
3. Run `purgetss` once to generate the required files.
4. Compile your app as usual.
5. Use `liveview` for faster testing.

```xml
<Alloy>
  <Window>
    <View class="grid">
      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <Label class="mt-2 text-gray-700" text="FontAwesome" />
        <Button class="fa fa-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="fa fa-home my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <Label class="mt-2 text-gray-700" text="Material Icons" />
        <Button class="mi mi-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="mi mi-home my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <Label class="mt-2 text-gray-700" text="Material Symbol" />
        <Button class="ms ms-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="ms ms-home my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <Label class="mt-2 text-gray-700" text="Framework7-Icons" />
        <Button class="f7 f7-house my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="f7 f7-house my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>
    </View>
  </Window>
</Alloy>
```

```tss
/* PurgeTSS v7.2.7
 * Created by Cesar Estrada
 * https://github.com/macCesar/purgeTSS
*/

/* Ti Elements */
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.bg-blue-500': { backgroundColor: '#3b82f6' }
'.gap-y-2': { top: 8, bottom: 8 }
'.grid': { layout: 'horizontal', width: '100%' }
'.grid-cols-2': { width: '50%' }
'.h-10': { height: 40 }
'.mt-2': { top: 8 }
'.mx-auto': { right: null, left: null }
'.my-1': { top: 4, bottom: 4 }
'.rounded': { borderRadius: 4 }
'.text-blue-500': { color: '#3b82f6', textColor: '#3b82f6' }
'.text-gray-700': { color: '#374151', textColor: '#374151' }
'.text-white': { color: '#ffffff', textColor: '#ffffff' }
'.text-xl': { font: { fontSize: 20 } }
'.vertical': { layout: 'vertical' }
'.w-10': { width: 40 }

/* Default Font Awesome */
'.fa': { font: { fontFamily: 'FontAwesome7Free-Solid' } }
'.fa-home': { text: '\uf015', title: '\uf015' }

/* Material Icons */
'.mi': { font: { fontFamily: 'MaterialIcons-Regular' } }
'.mi-home': { text: '\ue88a', title: '\ue88a' }

/* Material Symbols */
'.ms': { font: { fontFamily: 'MaterialSymbolsOutlined-Regular' } }
'.ms-home': { text: '\ue88a', title: '\ue88a' }

/* Framework7 */
'.f7': { font: { fontFamily: 'Framework7-Icons' } }
'.f7-house': { text: 'house', title: 'house' }
```

## `build-fonts` Command

The `build-fonts` command generates a `fonts.tss` file with class definitions and `fontFamily` selectors for serif, sans-serif, cursive, fantasy, or monospace fonts.

Place all `.ttf` or `.otf` files in `./purgetss/fonts/`, then run the command. You can also use `--module` to generate a CommonJS module in `./app/lib/`.

```bash
purgetss build-fonts

# alias:
purgetss bf
```

1. Creates `./purgetss/styles/fonts.tss` with all class definitions and `fontFamily` selectors.
2. Copies the font files into `./app/assets/fonts`.
3. Renames the font files to match their PostScript names so they work on both iOS and Android.

Example using Bevan and Dancing Script from Google Fonts.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   ├─ Bevan-Italic.ttf
   ├─ Bevan-Regular.ttf
   ├─ DancingScript-Bold.ttf
   ├─ DancingScript-Medium.ttf
   ├─ DancingScript-Regular.ttf
   └─ DancingScript-SemiBold.ttf
```

After running `purgetss build-fonts`:

`./purgetss/styles/fonts.tss`
```tss
/* Fonts TSS file generated with PurgeTSS
 * https://github.com/macCesar/purgeTSS
*/

'.bevan-italic': { font: { fontFamily: 'Bevan-Italic' } }
'.bevan-regular': { font: { fontFamily: 'Bevan-Regular' } }

'.dancingscript-bold': { font: { fontFamily: 'DancingScript-Bold' } }
'.dancingscript-medium': { font: { fontFamily: 'DancingScript-Medium' } }
'.dancingscript-regular': { font: { fontFamily: 'DancingScript-Regular' } }
'.dancingscript-semibold': { font: { fontFamily: 'DancingScript-SemiBold' } }
```

### Organizing the Fonts Folder

For better organization, group each font family in subfolders:

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   ├─ bevan
   │  ├─ Bevan-Italic.ttf
   │  └─ Bevan-Regular.ttf
   └─ dancing-script
      ├─ DancingScript-Bold.ttf
      ├─ DancingScript-Medium.ttf
      ├─ DancingScript-Regular.ttf
      └─ DancingScript-SemiBold.ttf
```

Subfolders don't change the output -- you get the same `fonts.tss` as the flat layout above.

### Renaming `fontFamily` Classes

To use a shorter or different class name, rename the font file.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ dancing-script
      ├─ Script-Bold.ttf
      ├─ Script-Medium.ttf
      ├─ Script-Regular.ttf
      └─ Script-SemiBold.ttf
```

Running `build-fonts` adjusts the class name accordingly:

```tss
'.script-bold': { font: { fontFamily: 'DancingScript-Bold' } }
'.script-medium': { font: { fontFamily: 'DancingScript-Medium' } }
'.script-regular': { font: { fontFamily: 'DancingScript-Regular' } }
'.script-semibold': { font: { fontFamily: 'DancingScript-SemiBold' } }
```

### Icon Font Libraries

You can add any icon font library that includes a `.ttf` or `.otf` file and a `.css` file with Unicode characters.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   ├─ bevan
   ├─ dancing-script
   ├─ map-icons
   │  ├─ map-icons.css
   │  └─ map-icons.ttf
   └─ microns
      ├─ microns.css
      └─ microns.ttf
```

After running `purgetss build-fonts`, `fonts.tss` will include the `fontFamily` class definitions and Unicode characters.

`./purgetss/styles/fonts.tss`
```tss
/* Fonts TSS file generated with PurgeTSS */
/* https://github.com/macCesar/purgeTSS */

'.map-icons': { font: { fontFamily: 'map-icons' } }
'.microns': { font: { fontFamily: 'microns' } }

/* Unicode Characters */
/* To use your Icon Fonts in Buttons and Labels each class sets 'text' and 'title' properties */

/* map-icons/map-icons.css */
'.map-icon-abseiling': { text: '\ue800', title: '\ue800' }
'.map-icon-accounting': { text: '\ue801', title: '\ue801' }
'.map-icon-airport': { text: '\ue802', title: '\ue802' }
'.map-icon-amusement-park': { text: '\ue803', title: '\ue803' }
'.map-icon-aquarium': { text: '\ue804', title: '\ue804' }

/* microns/microns.css */
'.mu-arrow-left': { text: '\ue700', title: '\ue700' }
'.mu-arrow-right': { text: '\ue701', title: '\ue701' }
'.mu-arrow-up': { text: '\ue702', title: '\ue702' }
'.mu-arrow-down': { text: '\ue703', title: '\ue703' }
'.mu-left': { text: '\ue704', title: '\ue704' }
```

### Options

- `-m, --module`: Generate a CommonJS module in `./app/lib/`.
- `-f, --filename`: Use filenames as both font class names and icon prefixes (replaces the old `-p` flag).

### CommonJS Module

Use the `--module` option to generate a CommonJS module called `purgetss.fonts.js` in `./app/lib/`.

To avoid conflicts with other icon libraries, PurgeTSS keeps each icon's prefix.

```bash
purgetss build-fonts --module

# alias:
purgetss bf -m
```

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  // map-icons/map-icons.css
  mapIcon: {
    abseiling: '\ue800',
    accounting: '\ue801',
    airport: '\ue802',
    amusementPark: '\ue803'
  },
  // microns/microns.css
  mu: {
    arrowLeft: '\ue700',
    arrowRight: '\ue701',
    arrowUp: '\ue702',
    arrowDown: '\ue703'
  }
};
exports.icons = icons;

const families = {
  // map-icons/map-icons.css
  mapIcon: 'map-icons',
  // microns/microns.css
  mu: 'microns'
};
exports.families = families;
```

### Using Filenames for Class Names and Icon Prefixes

The `--filename` option uses the style's filename as both the font class name and the icon prefix in `fonts.tss` and `purgetss.fonts.js`.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   ├─ map-icons
   │  ├─ map.ttf
   │  └─ mp.css
   └─ microns
      ├─ mic.ttf
      └─ mc.css
```

This generates:

```tss
/* fontFamily classes use the font's filename */
'.map': { font: { fontFamily: 'map-icons' } }
'.mic': { font: { fontFamily: 'microns' } }

/* map-icons/mp.css */
'.mp-abseiling': { text: '\ue800', title: '\ue800' }
'.mp-accounting': { text: '\ue801', title: '\ue801' }

/* microns/mc.css */
'.mc-arrow-left': { text: '\ue700', title: '\ue700' }
'.mc-arrow-right': { text: '\ue701', title: '\ue701' }
```

Make sure the new prefix is unique and does not conflict with other class prefixes.

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
