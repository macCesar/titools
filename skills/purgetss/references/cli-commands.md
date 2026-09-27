# PurgeTSS CLI Commands

This page lists the commands available in PurgeTSS. For release-by-release feature additions and behavior changes, see [Version History](./version-history.md).

<!-- TOC-START -->
## Contents

- [Alloy and Classic Compatibility](#alloy-and-classic-compatibility)
- [`init` Command](#init-command)
- [`create` Command](#create-command)
- [`brand` Command](#brand-command)
- [`images` Command](#images-command)
- [`semantic` Command](#semantic-command)
- [`install-dependencies` Command](#install-dependencies-command)
- [`icon-library` Command](#icon-library-command)
- [`build-fonts` Command](#build-fonts-command)
- [`shades` Command](#shades-command)
- [`color-module` Command](#color-module-command)
- [`build` Command](#build-command)
- [`watch` Command](#watch-command)
- [`module` Command](#module-command)
- [`update` Command](#update-command)
- [`sudo-update` Command](#sudo-update-command)
- [Community-Discovered Patterns](#community-discovered-patterns)

<!-- TOC-END -->

## Alloy and Classic Compatibility

The utility-class lifecycle remains Alloy-only. Classic projects can use independent asset and CommonJS commands without installing an `alloy.jmk` hook or adding PurgeTSS to their compilation flow.

| Command | Alloy | Classic | Classic behavior |
| --- | :---: | :---: | --- |
| `brand` | yes | yes | Uses Classic asset paths and follows `tiapp.xml` deployment targets; `--only` is an explicit override. |
| `images` | yes | yes | Writes under `Resources/` and follows deployment targets unless `--android` or `--ios` is explicit. |
| `semantic` | yes | yes | Writes only `Resources/semantic.colors.json`; no utility setup is created. |
| `shades` | yes | yes | Console modes work anywhere; saving creates or updates development-time `purgetss/config.cjs`. |
| `color-module`, `module` | yes | yes | Writes CommonJS modules to `app/lib/` or `Resources/lib/`. |
| `icon-library`, `build-fonts` | yes | yes | Writes fonts to `Resources/fonts/` and optional modules to `Resources/lib/`; Classic receives no TSS. |
| Root `purgetss`, `--all`, `init`, `create`, `install-dependencies`, `build`, `watch` | yes | no | Alloy utility-class lifecycle only. |
| `update`, `sudo-update` | yes | yes | Global CLI maintenance; no project layout is required. |

The output-only modes `shades --log`, `shades --json`, `shades --tailwind`, and `semantic --log` write nothing and also work outside a project.

The root command is `purgetss [-a|--all] [--debug]`: without options it purges the Alloy project; `--all` runs `build`, `build-fonts`, and the purge in sequence; `--debug` displays execution time for each process.

See [Classic Project Support](./classic-projects.md) for the complete boundary and audit checklist.

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
    background: '#FFFFFF',      // inherited by every piece that doesn't set its own
    artworkCornerRadius: '0%',  // splashes, Feature Graphic and LaunchLogo
    confirmOverwrites: true,    // prompt before overwriting files (set false to skip)
    optimize: false,            // true = quantize the generated PNGs to a palette (lossy)

    // One block per piece — see the `brand` Command section for the full list.
    icon: { padding: '0%' }, dark: { background: null }, tinted: {},
    iosSplash: { padding: '26%' }, launchLogo: { padding: '12%' },
    marketplace: {}, featureGraphic: { padding: '12%' },
    adaptive: { padding: '18%' }, legacyIcon: { padding: '10%' },
    appicon: { padding: '10%' }, androidSplash: { padding: '26%' },

    // Opt-in: splash_icon stays inert until the Android theme points at it.
    // notificationicon is read by firebase.cloudmessaging, by that exact name.
    splashIcon: { enabled: false }, notificationIcon: { enabled: false },
    ninePatch: { enabled: false }
  },
  // Sources in purgetss/images/ are 4x masters: a 1024px file yields
  // 256 (mdpi/@1x), 384 (hdpi), 512 (xhdpi/@2x), 768 (xxhdpi/@3x), 1024 (xxxhdpi).
  // There is no width to configure here — the source's own pixels decide.
  // SVGs have no natural pixels; pin theirs in files: [] below.
  images: {
    quality: 85,             // webp/jpeg/avif/tiff quality (0-100); PNG and GIF ignore it
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    autoSync: true,          // false = SVG pipeline computes dims but doesn't write to images.files
    confirmOverwrites: true, // prompt before overwriting files (set false to skip)
    files: []                // per-file overrides: [{ filename: 'images/<sub>/<name>.<ext>', width, height? }]
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
- `-v, --vendor <fa,mi,ms,f7>` to copy the selected fonts into your project and add the CommonJS module in `./app/lib/`. See the `icon-library` command for available fonts.

If a project with the same name already exists, the command will prompt you to confirm whether you want to overwrite it.

```bash
purgetss create 'Name of the Project' [--vendor="fontawesome, materialicons, materialsymbol, framework7"]

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

`purgetss create "Name of the Project" [--dependencies --vendor=fa,mi,ms,f7]` runs: `ti config` (reads idprefix/workspace), `ti create -t app -p all -n "Name"`, `alloy new`, `purgetss w`, `purgetss b`, optional `--vendor` (copies fonts + CommonJS module), optional `--dependencies` (installs Tailwind CSS and ESLint, and copies the config files — see [`install-dependencies`](#install-dependencies-command)), then opens the project in VS Code, Sublime Text, or Finder.

## `brand` Command

Introduced in v7.6.0 and fully standalone in Classic since v7.14.0. Generates the complete Titanium branding set from one main logo: launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, and both splash sets. Alloy and Classic projects are auto-detected. A normal run follows `<deployment-targets>` in `tiapp.xml`; explicit `--only` intentionally overrides that filter.

> **Tip**
> This is a quick reference. See [app-branding.md](./app-branding.md) for the complete guide — workflow, padding guidance, Android dark mode, iOS 18+ variants, the launch-background setup, and troubleshooting. It also carries the full `brand:` config reference.

```bash
purgetss brand                              # uses purgetss/brand/logo.{svg,png} + config
purgetss brand path/to/logo.svg             # positional logo path override
```

The 14 pieces, their config keys and what each one writes are tabulated in [app-branding.md → The pieces](./app-branding.md#the-pieces). Groups for `--only`: `ios` (icon, dark, tinted, ios-splash), `store` (marketplace, feature-graphic), `android` (adaptive, legacy-icon, appicon, android-splash).

### Flags

**Project & output**

| Flag | Purpose |
| --- | --- |
| `--project <path>` | Project root (defaults to cwd). |
| `--dry-run` | Preview what would be generated without writing any files. |
| `-o, --output <dir>` | Stage into `<dir>` instead of writing in place. |
| `-y, --yes` | Skip the overwrite confirmation prompt for this invocation. |

**Selecting what to generate**

| Flag | Purpose |
| --- | --- |
| `--only <pieces>` | Comma-separated pieces or groups. Generates a named piece even when its opt-in flag is absent; an unknown name aborts before writing anything. `--dry-run` honors the same filter. |

**Visual customization**

| Flag | Purpose |
| --- | --- |
| `--bg-color <hex>` | Background inherited by every piece that doesn't set its own. |
| `--padding <n>` | Shortcut: sets both Android launcher paddings to the same value for one run. |
| `--android-adaptive-padding <n>` | Adaptive icon safe-zone % (default `18`). |
| `--android-legacy-padding <n>` | Legacy `ic_launcher.png` padding % (default `10`). |
| `--appicon-padding <n>` | `appicon.png` padding % (default `10`). |
| `--ios-padding <n>` | Padding % for the four square iOS/marketplace pieces — `icon`, `dark`, `tinted`, `marketplace` (default `0`, full-bleed). |
| `--feature-graphic-padding <n>` | Vertical padding % for `MarketplaceArtworkFeature.png` (range `0-40`, default `12`). |
| `--launch-logo-padding <n>` | Padding % for `LaunchLogo.png` (default `12`). |
| `--splash-padding <n>` | Shortcut: sets both splash paddings to the same value for one run. |
| `--android-splash-padding <n>` | Padding % for `default.png` and the 11 `res-*` splashes (default `26`). |
| `--ios-splash-padding <n>` | Padding % for the 16 iPhone launch images (default `26`). |
| `--artwork-corner-radius <n>` / `--splash-corner-radius <n>` | Shared non-icon radius, or a splash-only one-run override (range `0-50`, default `0`). |
| `--ios-splash-corner-radius <n>` / `--android-splash-corner-radius <n>` | Per-platform legacy splash artwork radius (range `0-50`). |
| `--feature-graphic-corner-radius <n>` / `--launch-logo-corner-radius <n>` | Per-piece Feature Graphic or LaunchLogo artwork radius (range `0-50`). |

Splash padding is a share of the canvas's **shorter** side, so one number keeps the logo at the same visual weight in portrait and in landscape: the `26%` default leaves it at 48% of the shorter side.

Radius precedence: the piece-specific flag, then `--splash-corner-radius` (splashes only), then `--artwork-corner-radius`, then the piece's `cornerRadius`, then `brand.splashCornerRadius` (splashes only), then `brand.artworkCornerRadius`, and finally `0%`. `DefaultIcon*`, `iTunesConnect.png`, `MarketplaceArtwork.png`, adaptive/legacy/app icons, and `splash_icon.png` stay unmasked. Normal and `--dry-run` summaries report effective padding and radius.
**Optional asset types**

| Flag | Purpose |
| --- | --- |
| `--notification-icon` | Also emit `notificationicon.png × 5`. |
| `--splash-icon` | Also emit `splash_icon.png × 5`. |
| `--nine-patch` | Declared but not implemented yet; prints a warning and writes nothing. |
**Logo variants & overrides**

Every piece has a `--<piece>-logo <path>` flag — with no exceptions since v7.13.0 — each overriding the matching `purgetss/brand/logo-<piece>.{svg,png}`:

`--icon-logo`, `--dark-logo`, `--tinted-logo`, `--ios-splash-logo`, `--launch-logo`, `--marketplace-logo`, `--feature-graphic-logo`, `--adaptive-logo`, `--legacy-icon-logo`, `--appicon-logo`, `--android-splash-logo`, `--splash-icon-logo`, `--notification-icon-logo`.

`--launch-logo` is the one that also **activates** its piece. Two more sources are not pieces: `--monochrome-logo <path>` (the silhouette shared by the adaptive monochrome layer and the notification icons, `logo-mono.{svg,png}`) and the positional `<logo>` argument (the main logo).
**Output size**

| Flag | Purpose |
| --- | --- |
| `--optimize` | Re-encode every generated PNG with a quantized palette. Lossy, ~71% smaller on a full brand set. Also settable as `brand.optimize`. |
| `--no-optimize` | Skip that pass even when `brand.optimize` is `true`. |

**Appearance**

| Flag | Purpose |
| --- | --- |
| `--dark-bg-color <hex>` | Opaque dark bg for `DefaultIcon-Dark.png` (default: transparent per Apple HIG). |
| `--no-dark` | Skip `DefaultIcon-Dark.png`. |
| `--no-tinted` | Skip `DefaultIcon-Tinted.png`. |

**Legacy cleanup**

| Flag | Purpose |
| --- | --- |
| `--cleanup-legacy` | Remove obsolete branding artifacts (reads `tiapp.xml` for safety rules). Keeps `default.png` on purpose, and never deletes what the same run just regenerated. |
| `--aggressive` | With `--cleanup-legacy`, also remove `ldpi` density folders. |

**Diagnostics**

| Flag | Purpose |
| --- | --- |
| `--notes` | Print the complete platform launch/theme snippets + padding tuning guide. |
| `--debug` | Print extra diagnostics. |

> **Warning**
> Breaking renames in v7.13.0: `--splash` → `--splash-icon`, `--notification` → `--notification-icon`, `--splash-logo` → `--splash-icon-logo`, `--feature-logo` → `--feature-graphic-logo`. `--icon-logo` now feeds the `icon` piece; the Android launcher source is `--adaptive-logo`. `--legacy-splash` is gone. **No aliases were kept.**

### Positional argument

- `[logo-path]` (optional) — main source for every piece without an override. In an in-place run (Alloy or Classic; not with `--output`) where no canonical logo exists, PurgeTSS moves this source to `purgetss/brand/logo.{svg,png}` after confirmation and reports the destination.

### Config block (v7.13.0 per-piece structure)

Defaults live under `brand:` in `purgetss/config.cjs`. Since v7.14.0, a standalone Classic run creates it when missing. Each piece accepts `logo`, `padding`, `cornerRadius`, `background`, and `enabled` where applicable; radius is valid only for the two legacy splashes, Feature Graphic, and LaunchLogo. Top-level settings include shared `artworkCornerRadius`, optional `splashCornerRadius`, background, persistence, optimization, and logo values.

An unknown key aborts the run before a single file is written. A `brand:` block written for an older PurgeTSS is **rewritten on disk** on the next run, carrying over every customized value.

Full annotated block and per-key reference: [app-branding.md → The `brand:` config section](./app-branding.md#the-brand-config-section). Use flags for one-run sources, geometry, selection, activation, background, or optimization; keep persistent preferences in `config.cjs`.

### Confirmation prompt

`brand` writes in place, so it asks `Continue? [y/N/a]` before overwriting anything. Choose `a` (always) to write `confirmOverwrites: false` into `config.cjs` and silence the prompt on future runs. The prompt is skipped automatically when `stdin` is not a TTY (`alloy.jmk` hook, CI, pipes), when `-y`/`--yes` is passed, or when `PURGETSS_YES=1` is set.

### Examples

```bash
purgetss brand                                            # uses purgetss/brand/logo.svg + config
purgetss brand --only icon                                # just the DefaultIcon pair
purgetss brand --only ios,notification-icon               # a group plus one opt-in piece
purgetss brand --bg-color "#0B1326"                       # override bg color
purgetss brand --adaptive-logo ./docs/app-icon.svg        # dedicated square Android launcher mark
purgetss brand --splash-icon --splash-icon-logo ./docs/splash.svg  # custom Android 12+ splash artwork
purgetss brand --launch-logo ./docs/wordmark.svg          # iOS launch screen logotype
purgetss brand --feature-graphic-logo ./docs/feature.svg  # custom Google Play Feature Graphic
purgetss brand --artwork-corner-radius 22                 # round supported non-icon artwork
purgetss brand --splash-corner-radius 18                  # override both legacy splash sets
purgetss brand --appicon-padding 14                       # temporary appicon.png inset
purgetss brand --notification-icon --splash-icon          # add notification + splash icons
purgetss brand --optimize                                 # quantize the generated PNGs
purgetss brand --dry-run                                  # preview without writing
```

### Android output groups

`brand` writes four Android-facing asset groups with different jobs — `ic_launcher*`, `appicon.png`, `default.png` + `images/res-*/default.png`, and the opt-in `splash_icon.png`. What each one is actually read by is spelled out in [app-branding.md → What gets generated](./app-branding.md#what-gets-generated).

`brand.background` is baked into the generated assets, but `brand` does not edit the iOS LaunchScreen or the Android theme. Run `purgetss brand --notes` to print the snippets with the current color; see [launch-background.md](./launch-background.md).

## `images` Command

Introduced in v7.6.0 and standalone in Classic since v7.15.0. Generates multi-density variants of UI images from one high-resolution source. Alloy and Classic projects are auto-detected. With neither platform flag, the command follows `<deployment-targets>` in `tiapp.xml`; `--android` and `--ios` are explicit overrides.

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
| `--quality <n>` | Quality `0-100` for `webp`, `jpeg`, `avif` and `tiff`. PNG and GIF ignore it. Default `85`. |
| `--width <n>` | (v7.8.0) Pin Android `mdpi` (= iPhone `@1x`) to `<n>` pixels wide. Larger scales derive as ×1.5, ×2, ×3, ×4 from that base; height stays proportional to the source's aspect ratio. Integer in `[1, 1024]`. |
| `--opacity <n>` | (v7.10.0) Multiply alpha of every density by `n/100`. Integer in `[0, 100]`. With `--format jpeg`, alpha flattens on white. |
| `--padding <n>` | (v7.10.0) Shrink the rendered image inside each density canvas by `n%` symmetric borders. Integer in `[0, 40]`. |
| `--output <relpath>` | (v7.10.0) Override the basename and subpath relative to each platform's `images/` root. |
| `--dry-run` | Preview without writing any files. |
| `--project <path>` | Project root (defaults to cwd). |
| `-y, --yes` | Skip the overwrite confirmation prompt. |
| `--debug` | Print extra diagnostics. |

### Positional argument

- `[source]` (optional) — path to override auto-discovery. Resolves first against `purgetss/images/` (short paths like `buttons/btn.png`), then against cwd.

Alloy outputs go under `app/assets/{android,iphone}/images/`; Classic outputs go under `Resources/{android,iphone}/images/`. Passing an existing external source in Classic does not bootstrap an empty `purgetss/images/` folder or config file.

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
  quality: 85,             // webp/jpeg/avif/tiff quality (0-100); PNG and GIF ignore it
  format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' | 'avif' | 'gif' | 'tiff'
  autoSync: true,          // false = SVG pipeline computes dims but doesn't write to images.files
  confirmOverwrites: true, // prompt before overwriting files
  files: []                // per-file overrides: [{ filename, width, height? }]
}
```

Those five keys are the whole section. Since v7.17.0 any other key — including `width`, `opacity`, `padding` and `output`, which are CLI flags — aborts the run before writing anything, and so does a `files[]` entry with an unknown key or no `filename`. See [Unknown keys are an error](./multi-density-images.md#unknown-keys-are-an-error-v7170).

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

Documented in [color-commands.md](color-commands.md#semantic-command).

## `install-dependencies` Command

This Alloy-only command installs dev dependencies and configuration files for the utility-class workflow and sets up Visual Studio Code support. Do not run it in Classic.

```bash
purgetss install-dependencies

# alias:
purgetss id
```

### What it installs (v7.17.0)

`npm i -D eslint @eslint/js` plus a flat `eslint.config.mjs` in the project root, `.editorconfig`, `.vscode/{extensions,settings}.json` when the `code` command exists, and `tailwindcss@3` for IntelliSense. `create --dependencies` runs the same ESLint and Tailwind steps. `eslint-config-axway` and `eslint-plugin-alloy` are no longer installed.

The shipped config declares the Titanium and Alloy globals itself (`Ti`, `Titanium`, `Alloy`, `Backbone`, `$`, `$model`, `_`, `L`, `Widget`, `OS_*`, `ENV_*`, `DIST_*`, `console`, `alert`, the timer functions, and `task` for `alloy.jmk`). It lints `app/**/*.js` and ignores `Resources/`, `build/`, `node_modules/`, `purgetss/`, plus the six libraries PurgeTSS copies into `app/lib/`, listed by name so the developer's own files there keep being linted. `no-unused-vars` is a **warning**: Alloy wires handlers from the XML view, so a controller function with no caller in the JS may still be in use.

> **Warning**
> Before v7.17.0 this command shipped an `.eslintrc.js` extending `eslint-config-axway/env-alloy` and installed `eslint-plugin-alloy`. That setup cannot run under ESLint 9 — it stopped reading `.eslintrc.*`, axway removed `env-alloy` in `eslint-config-axway@10.0.0`, and the unmaintained plugin throws `This method cannot be used with flat config`. Projects scaffolded between December 2025 and v7.17.0 have a lint that never ran; re-run `purgetss install-dependencies` to replace it.

> **Caution**
> This command overwrites any existing `extensions.json` and `settings.json` files. Back them up if you want to keep your current versions.

## `icon-library` Command

Copies the bundled free font files (Font Awesome 7, Material Icons, Material Symbols, Framework7 Icons) to `app/assets/fonts/` in Alloy or `Resources/fonts/` in Classic. Alloy resolves the official utility classes at compile time; Classic uses the installed `fontFamily` plus Unicode directly or through the optional CommonJS module.

```bash
purgetss icon-library [--vendor=fa,mi,ms,f7] [--module] [--styles]

# alias:
purgetss il [-v=fa,mi,ms,f7] [-m] [-s]
```

### Flags

| Flag | Purpose |
| --- | --- |
| `-v, --vendor <fa,mi,ms,f7>` | Copy specific font vendors only (default copies all four). |
| `-m, --module` | Copy the matching CommonJS module into `app/lib/` (Alloy) or `Resources/lib/` (Classic). |
| `-s, --styles` | Alloy only: copy official `.tss` sources into `purgetss/styles/` for reference. Classic skips this output. |

Vendor aliases: `fa`/`fontawesome`, `mi`/`materialicons`, `ms`/`materialsymbol`/`materialsymbols` (v7.18.0), `f7`/`framework7`. An unknown value stops the command before it writes anything and lists the valid ones (v7.18.0).

Every installed module exposes `families.default`. Direct variant aliases are `solid`/`regular`/`brands` for Font Awesome; `regular`/`outlined`/`round`/`sharp`/`twoTone` for Material Icons; `outlined`/`rounded`/`sharp` for Material Symbols; and `fontFamily` for Framework7.

> **Tip**
> This is a quick reference. See [Icon Fonts](./icon-fonts.md) for the complete guide — variant tables (`.ms`/`.mso`/`.msr`/`.mss`, `.fa`/`.fas`/`.far`/`.fab`), XML usage patterns, the side-by-side four-family example, Font Awesome Pro / Beta workflow, and instructions for recreating removed libraries.

## `build-fonts` Command

Installs user-defined fonts dropped into `purgetss/fonts/`. Alloy also generates `purgetss/styles/fonts.tss`; Classic copies only native fonts to `Resources/fonts/` and generates no TSS or utility definitions.

```bash
purgetss build-fonts [-m] [-f]

# alias:
purgetss bf [-m] [-f]
```

### Flags

| Flag | Purpose |
| --- | --- |
| `-m, --module` | Also generates `app/lib/purgetss.fonts.js` (Alloy) or `Resources/lib/purgetss.fonts.js` (Classic). `exports.families` contains every processed TTF/OTF PostScript name; icon CSS additionally populates `exports.icons`. |
| `-f, --font-class-from-filename` | Uses the font filename as the class name and icon prefix instead of the font family. Replaces the old `-p` flag. |

### What it does

1. Copies font files to `app/assets/fonts/` (Alloy) or `Resources/fonts/` (Classic), renamed to their PostScript names.
2. In Alloy only, creates `purgetss/styles/fonts.tss` with the TSS class definitions.
3. With `--module`, creates the CommonJS module even for text-only font collections. Classic loads it with `require('lib/purgetss.fonts')`; see the [Classic module path table](./classic-projects.md#loading-generated-modules-in-classic).

`Resources/app.js`
```javascript
const customFonts = require('lib/purgetss.fonts')

const title = Ti.UI.createLabel({
  text: 'Custom typography',
  font: { fontFamily: customFonts.families.poppinsSemiBold }
})
```

> **Tip**
> This is a quick reference. See [Custom Fonts](./custom-fonts.md) for the complete guide — folder organization, class renaming, adding icon libraries, the `--module` output structure, and `--font-class-from-filename` workflow.

> **Note**
> `build-fonts` is for **user-defined fonts only**. The 4 official icon families (Font Awesome 7, Material Icons, Material Symbols, Framework7) are bundled with PurgeTSS and installed via [`icon-library`](#icon-library-command), not `build-fonts`. See [Icon Fonts](./icon-fonts.md).

## `shades` Command

Documented in [color-commands.md](color-commands.md#shades-command).

## `color-module` Command

Documented in [color-commands.md](color-commands.md#color-module-command).

## `build` Command

The Alloy-only `build` command generates `utilities.tss` from `config.cjs`. It is not part of a Classic standalone workflow.

```bash
purgetss build

# alias:
purgetss b
```

When `purgetss` runs (manually or via `watch`), it checks for changes in `config.cjs` and regenerates `utilities.tss` when needed.

### Options

- `--glossary`: Creates a glossary folder with all generated classes.

## `watch` Command

The Alloy-only `watch` command runs PurgeTSS on each Alloy project compile. Classic projects do not install this hook.

```bash
purgetss watch

# alias:
purgetss w
```

This works well with LiveView since it re-runs on changes such as adding or removing styles in views.

The command installs a task in `alloy.jmk`:

```javascript
task('pre:compile', (event, logger) => {
  logger.warn(`::PurgeTSS:: Auto-Purging ${event.dir.project}`)
  try {
    require('child_process').execSync('purgetss', { stdio: 'inherit' })
  } catch (error) {
    logger.error('::PurgeTSS:: Auto-Purge failed. Run `purgetss` from the project root to see the cause.')
    throw error
  }
})
```

The default synchronous hook inherits CLI output so validation details appear before Alloy's generic failure. Async mode forwards `stdout` and `stderr` and prints the same final hint. `init` refreshes old active or disabled hooks without changing their state; invoking `watch` normally enables a disabled hook.

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

The `module` command installs the self-contained `purgetss.ui.js` in `app/lib/` (Alloy) or `Resources/lib/` (Classic). Classic executes that generated file but needs no PurgeTSS CLI/package at build time or as an app dependency.

Classic loads it with `require('lib/purgetss.ui')`; see [Classic module paths](./classic-projects.md#loading-generated-modules-in-classic).

```bash
purgetss module

# alias:
purgetss m
```

The module exports `AnimationProperties`, `createAnimation(args)`, `Appearance`, `deviceInfo()`, and `saveComponent()`. Its animation object exposes 15 state, drag, collision, position, feedback, and layout methods. See [Animation System](./animation-system.md) for Alloy or [`purgetss.ui` in Classic](./purgetss-ui-classic.md) for native JavaScript.

## `update` Command

The `update` command upgrades PurgeTSS to the latest version.

```bash
purgetss update

# alias:
purgetss u
```

Runs `npm update -g purgetss`.

## `sudo-update` Command

The `sudo-update` command is the same as `update`, but runs `sudo npm update -g purgetss` for installs that need elevated permissions.

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
