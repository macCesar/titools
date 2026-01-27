# PurgeTSS CLI Commands Guide

PurgeTSS provides a comprehensive suite of CLI commands for project setup, asset management, and development workflow automation.

:::info What's New in v7.2.x
**FontAwesome 7 & Major Optimization**: PurgeTSS v7.2 introduces full support for **FontAwesome 7**, including the new CSS custom properties format. This version also features a significant reduction in installation size and a complete internal restructuring for better performance and maintainability.

**Key Changes:**
- **Node.js 20+** required (due to "inquirer" v13 upgrade)
- **FontAwesome 7 Support**: Full compatibility with the new CSS custom properties format
- **Titanium SDK 13.1 Support**: Updated definitions to support new properties in Titanium SDK 13.1.0.GA
- **Removed deprecated commands**: "copy-fonts" and "build-legacy" are completely gone
- **Reduced Installation Size**: Reduced by approximately **45MB** by moving non-essential assets to dev dependencies
- **Improved Unicode Extraction**: Enhanced support for various Unicode formats and direct character mappings
:::

## Table of Contents

- [PurgeTSS CLI Commands Guide](#purgetss-cli-commands-guide)
  - [Table of Contents](#table-of-contents)
  - [Setup Commands](#setup-commands)
    - [`purgetss init` (alias: `i`)](#purgetss-init-alias-i)
    - [`purgetss create` (alias: `c`)](#purgetss-create-alias-c)
    - [`purgetss install-dependencies` (alias: `id`)](#purgetss-install-dependencies-alias-id)
  - [Development Commands](#development-commands)
    - [`purgetss build` (alias: `b`)](#purgetss-build-alias-b)
    - [`purgetss watch` (alias: `w`)](#purgetss-watch-alias-w)
  - [Asset Commands](#asset-commands)
    - [`purgetss icon-library` (alias: `il`)](#purgetss-icon-library-alias-il)
      - [CommonJS Module](#commonjs-module)
      - [Font Awesome Pro](#font-awesome-pro)
      - [Font Awesome 7 Beta](#font-awesome-7-beta)
      - [Font Example File](#font-example-file)
    - [`purgetss build-fonts` (alias: `bf`)](#purgetss-build-fonts-alias-bf)
      - [For Text Fonts (Google Fonts, etc.)](#for-text-fonts-google-fonts-etc)
      - [For Icon Fonts (Custom Libraries)](#for-icon-fonts-custom-libraries)
      - [CommonJS Module for Custom Fonts](#commonjs-module-for-custom-fonts)
  - [Utility Commands](#utility-commands)
    - [`purgetss shades` (alias: `s`)](#purgetss-shades-alias-s)
    - [`purgetss color-module` (alias: `cm`)](#purgetss-color-module-alias-cm)
    - [`purgetss module` (alias: `m`)](#purgetss-module-alias-m)
  - [Maintenance Commands](#maintenance-commands)
    - [`purgetss update` (alias: `u`)](#purgetss-update-alias-u)
    - [`purgetss sudo-update` (alias: `su`)](#purgetss-sudo-update-alias-su)
  - [Command Quick Reference](#command-quick-reference)
  - [Advanced Usage](#advanced-usage)
    - [Combining Commands for New Projects](#combining-commands-for-new-projects)
    - [Setting Up an Existing Project](#setting-up-an-existing-project)
    - [Quick Reference: New Project Setup Commands](#quick-reference-new-project-setup-commands)
    - [Safelist for Large Projects](#safelist-for-large-projects)
    - [Disabling Specific Classes](#disabling-specific-classes)
  - [Troubleshooting Commands](#troubleshooting-commands)
    - [Verifying Installation](#verifying-installation)
    - [Debug Mode](#debug-mode)

---

## Setup Commands

### `purgetss init` (alias: `i`)

Initializes PurgeTSS in an existing Alloy project by creating the `purgetss/config.cjs` file.

```bash
purgetss init
# or
purgetss i
```

**What it does:**
- Creates `./purgetss/config.cjs` with minimal configuration
- Does NOT modify `alloy.jmk` (use `purgetss` for full initialization)

**Generated `config.cjs`:**
```javascript
// ./purgetss/config.cjs
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
  theme: {
    extend: {}
  }
};
```

:::tip
Use this to create a fresh config.cjs if you want to start over. For first-time setup, just run `purgetss` without any arguments. PurgeTSS looks for the file `./purgetss/config.cjs`, where each section is optional and can be customized. Missing sections will use the default configuration.
:::

### `purgetss create` (alias: `c`)

Creates a new Alloy project with PurgeTSS already configured.

```bash
purgetss create 'Name of the Project' [options]
# or
purgetss c 'Name of the Project' [options]
```

**Arguments:**
- Project name (required) - Enclose in single or double quotes

**Options:**
- `-f, --force` - Overwrite existing project without prompting
- `-d, --dependencies` - Install ESLint and Tailwind CSS dev dependencies
- `-v, --vendor [fa,mi,ms,f7]` - Copy icon fonts (FontAwesome, Material Icons, Material Symbols, Framework7)

**Example:**
```bash
purgetss create 'My Awesome App' --dependencies --vendor=fa,mi
```

:::caution Requirements
Ensure that `app.idprefix` and `app.workspace` are configured in Titanium's `config.json`:

```bash
ti config app.idprefix 'com.yourdomain'
ti config app.workspace '/path/to/workspace/folder'
```
:::

### `purgetss install-dependencies` (alias: `id`)

Simplifies the enhancement of your development workflow in existing projects already using PurgeTSS. It automates the installation of dev dependencies and configuration files.

```bash
purgetss install-dependencies
# or
purgetss id
```

**What it installs:**
- **ESLint** with Titanium-specific configuration (`eslint-config-axway`, `eslint-plugin-alloy`)
- **Tailwind CSS** for IntelliSense support
- Configuration files: `.editorconfig`, `eslint.config.js`, `tailwind.config.js`
- VS Code configuration: `.vscode/extensions.json`, `.vscode/settings.json`

**Recommended VS Code Extensions:**
- [XML Tools](https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml) - For XML formatting
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Consistent code quality
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Intelligent PurgeTSS class support
- [Tailwind RAW Reorder](https://marketplace.visualstudio.com/items?itemName=KevinYouu.tailwind-raw-reorder-tw4) - Opinionated class sorter for XML and JS files
- [Intellisense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) - Class name completion based on workspace definitions

:::caution
This command will overwrite existing `extensions.json` and `settings.json` files. Create a backup if you want to preserve them.
:::

## Development Commands

### `purgetss build` (alias: `b`)

Manually regenerates `tailwind.tss` based on `config.cjs`.

```bash
purgetss build
# or
purgetss b
```

**Use cases:**
- After updating `config.cjs`
- After adding custom fonts to `purgetss/fonts/`
- When `tailwind.tss` seems out of sync

### `purgetss watch` (alias: `w`)

Automatically runs PurgeTSS every time the project is compiled. You won't need to manually execute the `build` command each time you make changes.

```bash
purgetss watch
# or
purgetss w

# To deactivate:
purgetss watch --off
# or
purgetss w -o
```

**Default behavior:** Activates auto-purge (runs on every compile)

This functionality is particularly valuable when used with LiveView, as it automatically purges your project whenever you make changes, providing immediate feedback and significantly speeding up your prototyping process.

**What it installs in `alloy.jmk`:**
```javascript
task('pre:compile', function(event, logger) {
  require('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));
});
```

:::info
This feature is exclusively compatible with regular Alloy projects compiled using the `ti build` command. It hasn't been tested with other project types like those built using Webpack or Vue.
:::

## Asset Commands

### `purgetss icon-library` (alias: `il`)

Simplifies the process of copying free font versions of Font Awesome, Material Icons, Material Symbols, and Framework7 Icons to the `./app/assets/fonts` folder.

```bash
purgetss icon-library [--vendor=fa,mi,ms,f7] [--module] [--styles]
# or
purgetss il [-v=fa,mi,ms,f7] [-m] [-s]
```

**Vendors (names and aliases):**
- `fa`, `fontawesome` - Font Awesome Icons
- `mi`, `materialicons` - Material Icons
- `ms`, `materialsymbols` - Material Symbols
- `f7`, `framework7` - Framework7 Icons

**Options:**
- `-v, --vendor [fa,mi,ms,f7]` - Copy specific font vendors
- `-m, --module` - Copy the corresponding CommonJS module into `./app/lib/`
- `-s, --styles` - Copy the corresponding TSS files into `./purgetss/styles/` for review

**Installed font files:**
```bash
./app/assets/fonts/
├─ FontAwesome7Brands-Regular.ttf
├─ FontAwesome7Free-Regular.ttf
├─ FontAwesome7Free-Solid.ttf
├─ Framework7-Icons.ttf
├─ MaterialIcons-Regular.ttf
├─ MaterialIconsOutlined-Regular.otf
├─ MaterialIconsRound-Regular.otf
├─ MaterialIconsSharp-Regular.otf
├─ MaterialIconsTwoTone-Regular.otf
├─ MaterialSymbolsOutlined-Regular.ttf
├─ MaterialSymbolsRounded-Regular.ttf
└─ MaterialSymbolsSharp-Regular.ttf
```

**Examples:**
```bash
# Install Font Awesome only
purgetss icon-library --vendor=fa

# Install multiple vendors with module
purgetss il -v=fa,mi,ms -m

# Install all available vendors with styles
purgetss icon-library -v=fa,mi,ms,f7 -m -s

# Full vendor names also work
purgetss icon-library --vendor="fontawesome, materialicons, materialsymbols, framework7"
```

**Available Font Classes (TSS files):**
- [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/fontawesome.tss)
- [materialicons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/materialicons.tss)
- [materialsymbols.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/materialsymbols.tss)
- [framework7icons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/framework7icons.tss)

#### CommonJS Module

Use the `--module` option to copy the corresponding CommonJS module into `./app/lib/`. Each library includes a CommonJS module that exposes Unicode strings for the fonts.

All prefixes are stripped from their class names and camel-cased:
- **Font Awesome**: `fa-flag` becomes `flag`
- **Material Icons**: `mi-flag` becomes `flag`
- **Material Symbols**: `ms-flag` becomes `flag`
- **Framework7 Icons**: `f7-alarm_fill` becomes `alarmFill` or `f7-clock_fill` becomes `clockFill`

```bash
purgetss icon-library --module [--vendor="fontawesome, materialicons, materialsymbols, framework7"]
# or
purgetss il -m [-v=fa,mi,ms,f7]
```

#### Font Awesome Pro

If you have a [Font Awesome Pro Account](https://fontawesome.com/pro), you can generate a customized `./purgetss/styles/fontawesome.tss` file containing all the extra classes that the Pro version provides (except duotone icons).

**Setup:**

1. Set the [@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro) with your token
2. Install in your project's root folder:
```bash
npm init
npm install --save-dev @fortawesome/fontawesome-pro
```

3. Generate the customized TSS file:
```bash
purgetss build
```

This will also automatically copy the Pro font files into `./app/assets/fonts` if necessary.

:::caution
Titanium cannot use FontAwesome's duotone icons because they have two separate glyphs for each individual icon.
:::

#### Font Awesome 7 Beta

Generate a customized `fontawesome.tss` file from Font Awesome 7 Beta:

1. Download from [Font Awesome](https://fontawesome.com/download)
2. Move the `css` and `webfonts` folders from `fontawesome-pro-7.0.0-beta3-web/`:

```bash
fontawesome-pro-7.0.0-beta3-web/
├─ css/
└─ webfonts/
```

3. Into `./purgetss/fontawesome-beta/`:

```bash
purgetss/
└─ fontawesome-beta/
   ├─ css/
   └─ webfonts/
```

4. Run `purgetss build` to generate your customized `fontawesome.tss` file and beta-test your new icons!

#### Font Example File

A complete example demonstrating all official icon fonts:

```xml
<!-- index.xml -->
<Alloy>
  <Window>
    <View class="grid">
      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <!-- FontAwesome -->
        <Label class="mt-2 text-gray-700" text="FontAwesome" />
        <Button class="fa fa-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="fa fa-home my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <!-- Material Icons -->
        <Label class="mt-2 text-gray-700" text="Material Icons" />
        <Button class="mi mi-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="mi mi-home my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <!-- Material Symbol -->
        <Label class="mt-2 text-gray-700" text="Material Symbol" />
        <Button class="ms ms-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="ms ms-home my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <!-- Framework7-Icons -->
        <Label class="mt-2 text-gray-700" text="Framework7-Icons" />
        <Button class="f7 f7-house my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="f7 f7-house my-1 h-10 w-10 rounded bg-blue-500 text-xl text-white" />
      </View>
    </View>
  </Window>
</Alloy>
```

**To use this example:**
1. Copy the content into a new Alloy project
2. Install the official icon fonts: `purgetss icon-library` (without `--vendor` copies all fonts)
3. Run `purgetss` to generate the necessary files
4. Compile your app

:::tip
Use LiveView to speed up testing and development time.
:::

### `purgetss build-fonts` (alias: `bf`)

Generates TSS file with class definitions for **text fonts** (Google Fonts, custom fonts) and **icon fonts** (any library with `.ttf` + `.css`).

```bash
purgetss build-fonts [options]
# or
purgetss bf [options]
```

**Options:**
- `-m, --module` - Generates `purgetss.fonts.js` CommonJS module
- `-f, --filename` - Uses filenames as class names and icon prefixes

#### For Text Fonts (Google Fonts, etc.)

**Only need `.ttf` or `.otf` files** - download from [Google Fonts](https://fonts.google.com) or any font provider:

```bash
./purgetss/fonts/
├─ Bevan-Italic.ttf
├─ Bevan-Regular.ttf
├─ DancingScript-Bold.ttf
├─ DancingScript-Medium.ttf
└─ DancingScript-Regular.ttf
```

```bash
purgetss bf
```

**What happens:**
1. Creates `./purgetss/styles/fonts.tss` with class definitions
2. Copies fonts to `./app/assets/fonts/`
3. **Renames fonts to PostScript names** for iOS & Android compatibility

**Generated classes:**
```tss
'.bevan-italic': { font: { fontFamily: 'Bevan-Italic' } }
'.bevan-regular': { font: { fontFamily: 'Bevan-Regular' } }
'.dancingscript-bold': { font: { fontFamily: 'DancingScript-Bold' } }
```

**Usage in XML:**
```xml
<Label class="bevan-regular text-2xl" text="Hello World" />
<Label class="dancingscript-bold text-xl text-blue-500" text="Elegant" />
```

**Organize in subfolders** for cleaner structure:
```bash
./purgetss/fonts/
└─ bevan/
   ├─ Bevan-Italic.ttf
   └─ Bevan-Regular.ttf
└─ dancing-script/
   └─ DancingScript-Bold.ttf
```

:::tip PRO TIP: Rename Files = Rename Classes
The **filename becomes the class name**. Rename `DancingScript-Bold.ttf` to `Script-Bold.ttf` to get `.script-bold` instead of `.dancingscript-bold`. The `fontFamily` value still uses the internal PostScript name.
:::

#### For Icon Fonts (Custom Libraries)

**Need `.ttf`/`.otf` AND `.css` with Unicode mappings:**

```bash
./purgetss/fonts/
└─ map-icons/
   ├─ map-icons.css    # Contains Unicode mappings
   └─ map-icons.ttf
```

**Generated classes include Unicode characters:**
```tss
'.map-icons': { font: { fontFamily: 'map-icons' } }
'.map-icon-home': { text: '\ue800', title: '\ue800' }
'.map-icon-search': { text: '\ue801', title: '\ue801' }
```

:::tip
- **Text fonts**: Only `.ttf` needed → generates `fontFamily` classes
- **Icon fonts**: Need `.ttf` + `.css` → generates `fontFamily` + Unicode classes
:::

#### CommonJS Module for Custom Fonts

Use the `--module` option to generate a CommonJS module called `purgetss-fonts.js` in `./app/lib/`.

```bash
purgetss build-fonts --module
# or
purgetss bf -m
```

**Generated module example:**
```javascript
// ./app/lib/purgetss.fonts.js
const icons = {
  // map-icons/map-icons.css
  'mapIcon': {
    'abseiling': '\ue800',
    'accounting': '\ue801',
    'airport': '\ue802',
    'amusementPark': '\ue803',
    // ...
  },
  // microns/microns.css
  'mu': {
    'arrowLeft': '\ue700',
    'arrowRight': '\ue701',
    'arrowUp': '\ue702',
    'arrowDown': '\ue703',
    // ...
  }
};
exports.icons = icons;

const families = {
  // map-icons/map-icons.css
  'mapIcon': 'map-icons',
  // microns/microns.css
  'mu': 'microns'
};
exports.families = families;
```

:::tip PRO TIP: Using Filenames for Class Names and Icon Prefixes
Use the `--filename` option to apply the style's filename as both the font class name and the prefix for icon class names in `fonts.tss` and property names in `purgetss.fonts.js`.

```bash
./purgetss/fonts/
└─ map-icons/
   └─ map.ttf
   └─ mp.css
└─ microns/
   └─ mic.ttf
   └─ mc.css
```

This generates:
```css
/* fontFamily classes use the font's filename */
'.map': { font: { fontFamily: 'map-icons' } }
'.mic': { font: { fontFamily: 'microns' } }

/* Icon classes use the CSS filename as prefix */
'.mp-abseiling': { text: '\ue800', title: '\ue800' }
'.mc-arrow-left': { text: '\ue700', title: '\ue700' }
```

Make sure the new prefix remains unique to avoid conflicts with other class prefixes.
:::

## Utility Commands

### `purgetss shades` (alias: `s`)

Generates shades and tints for a given color and outputs the corresponding color palette in the `config.cjs` file.

```bash
purgetss shades [hexcode] [name] [options]
# or
purgetss s [hexcode] [name] [options]
```

**Arguments:**
- `[hexcode]` - The base hexcode value. Omit this to create a random color.
- `[name]` - The name of the color. Omit this and a name based on the color's hue will be automatically selected.

**Options:**
- `-n, --name` - Specifies the name of the color
- `-q, --quotes` - Retains double quotes in the `config.cjs` file
- `-r, --random` - Generates shades from a random color
- `-s, --single` - Generates a single color definition
- `-t, --tailwind` - Logs the generated shades with a `tailwind.config.js` compatible structure
- `-l, --log` - Logs the generated shades instead of saving them
- `-j, --json` - Logs a JSON compatible structure for `config.json`

:::info
More than 66% of all `tailwind.tss` classes are related to color properties, making a tool like `shades` a valuable addition to PurgeTSS for extending color choices!
:::

**Basic usage:**
```bash
purgetss shades 53606b Primary
# or
purgetss s 53606b Primary

# Output: ::PurgeTSS:: "Primary" (#53606b) saved in config.cjs
```

**Result in `config.cjs`:**
```javascript
module.exports = {
  // ...
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

**Log to console instead of saving:**
```bash
purgetss shades 53606b Primary --log
# or
purgetss s 53606b Primary -l

# Output:
# ::PurgeTSS:: "Primary" (#53606b)
# {
#   colors: {
#     primary: {
#       '50': '#f4f6f7',
#       '100': '#e3e7ea',
#       ...
#       default: '#53606b'
#     }
#   }
# }
```

**Tailwind-compatible structure:**
```bash
purgetss shades 000f3d --tailwind
# or
purgetss s 000f3d -t

# Output:
# ::PurgeTSS:: "Stratos" (#000f3d)
# {
#   colors: {
#     stratos: {
#       '50': '#e5f4ff',
#       '100': '#cfecff',
#       ...
#       '900': '#000f3d'
#     }
#   }
# }
```

**Generate random color:**
```bash
purgetss shades -rl

# Output:
# ::PurgeTSS:: "Harlequin" (#44ed20)
# {
#   colors: {
#     harlequin: {
#       '50': '#ecffe6',
#       '100': '#d5fec9',
#       ...
#       default: '#44ed20'
#     }
#   }
# }
```

**JSON-compatible structure (for Titanium's config.json):**
```bash
purgetss shades '#65e92c' -j
# or
purgetss s '#65e92c' -j

# Output:
# ::PurgeTSS:: "Lima" (#65e92c)
# {
#   global: {
#     colors: {
#       lima: #65e92c,
#       lima-50: #f0fee7,
#       lima-100: #dcfdca,
#       ...
#       lima-900: #215413
#     }
#   }
# }
```

:::tip
The `shades` command is the first one that writes to the `config.cjs` file. If you experience any issues, please report them!
:::

### `purgetss color-module` (alias: `cm`)

Creates a file named `purgetss.colors.js` in the `lib` folder, which includes all the colors defined in the `config.cjs` file.

```bash
purgetss color-module
# or
purgetss cm
```

**Generated file example:**
```javascript
// ./app/lib/purgetss.colors.js
module.exports = {
  harlequin: {
    '50': '#ecffe6',
    '100': '#d5fec9',
    '200': '#adfd99',
    '300': '#7bf85e',
    '400': '#44ed20',
    '500': '#2ed40e',
    '600': '#1daa06',
    '700': '#19810a',
    '800': '#18660e',
    '900': '#175611',
    default: '#44ed20'
  },
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
```

**Usage in JavaScript:**
```javascript
// In your controller
var colors = require('purgetss.colors');

// Access color palettes
var primaryColor = colors.primary.default;  // '#53606b'
var primaryLight = colors.primary['200'];   // '#cad2d7'
var primaryDark = colors.primary['800'];    // '#3e444c'

// Use in code
$.myView.backgroundColor = colors.harlequin['500'];
$.myLabel.color = colors.primary.default;
```

:::tip
This feature is useful if you want to use your configured colors within your app's code. By importing the `purgetss.colors.js` file, you can avoid hardcoding colors across multiple locations.
:::

### `purgetss module` (alias: `m`)

Installs the `<Animation>` component into `app/lib/`.

```bash
purgetss module
# or
purgetss m
```

**What it installs:**
- `purgetss.ui.js` in `app/lib/`
- Declarative animation component
- Support for `play()`, `apply()`, `open`/`close` states, and draggable logic

See [Animation Component](animation-system.md) for usage details.

## Maintenance Commands

### `purgetss update` (alias: `u`)

Updates PurgeTSS to the latest version.

```bash
purgetss update
# or
purgetss u
```

### `purgetss sudo-update` (alias: `su`)

Updates PurgeTSS using sudo (for systems requiring elevated permissions).

```bash
purgetss sudo-update
# or
purgetss su
```

:::caution
Use `sudo-update` only if standard `npm install -g` requires sudo on your system.
:::

## Command Quick Reference

| Command                         | Alias | Purpose                                     |
| ------------------------------- | ----- | ------------------------------------------- |
| `purgetss init`                 | `i`   | Create fresh config.cjs                     |
| `purgetss create`               | `c`   | New Alloy project with PurgeTSS             |
| `purgetss install-dependencies` | `id`  | Install dev dependencies and VS Code config |
| `purgetss build`                | `b`   | Regenerate tailwind.tss                     |
| `purgetss watch`                | `w`   | Toggle auto-purge                           |
| `purgetss icon-library`         | `il`  | Install icon fonts                          |
| `purgetss build-fonts`          | `bf`  | Generate custom font classes                |
| `purgetss shades`               | `s`   | Generate color palette                      |
| `purgetss color-module`         | `cm`  | Generate JS color module                    |
| `purgetss module`               | `m`   | Install Animation component                 |
| `purgetss update`               | `u`   | Update to latest version                    |
| `purgetss sudo-update`          | `su`  | Update with sudo                            |

## Advanced Usage

### Combining Commands for New Projects

```bash
# Create project with all bells and whistles
purgetss create 'MyApp' --dependencies --vendor=fa,mi

# This is equivalent to running:
# 1. ti config app.idprefix && ti config app.workspace - retrieves the related values
# 2. ti create -t app -p all -n "MyApp" --no-prompt --id "the-prefix-id-and-name" - creates App project
# 3. cd app.workspace/"MyApp" - changes to the newly created folder
# 4. alloy new - converts it to an Alloy Project
# 5. purgetss w - autoruns purgetss every time you compile
# 6. purgetss b - builds a new ./purgetss/styles/tailwind.tss file
# 7. [--vendor=fa,mi] - copies the selected fonts, including CommonJS module into ./app/lib/
# 8. [--dependencies] - installs:
#    - npm i -D tailwindcss && npx tailwindcss init
#    - npm i -D eslint eslint-config-axway eslint-plugin-alloy
#    - Copies: .editorconfig, eslint.config.js, tailwind.config.js
#    - Creates: .vscode/extensions.json and .vscode/settings.json
# 9. Opens the project in VS Code, Sublime Text, or Finder
```

### Setting Up an Existing Project

```bash
# Navigate to your existing Alloy project
cd /path/to/existing/project

# Initialize PurgeTSS
purgetss init

# Enable auto-purging on compile
purgetss watch

# Install icon fonts with CommonJS module
purgetss icon-library -v=fa,mi -m

# Install dev dependencies
purgetss install-dependencies

# Build the initial tailwind.tss
purgetss build
```

### Quick Reference: New Project Setup Commands

```bash
# Minimum setup
purgetss create 'MyApp'

# With icon fonts
purgetss create 'MyApp' -v=fa,mi

# Full setup with dev dependencies
purgetss create 'MyApp' -d -v=fa,mi,ms,f7

# Force overwrite existing project
purgetss create 'MyApp' -f -d -v=fa
```

### Safelist for Large Projects

For projects with many classes that should always be included:

```javascript
// ./purgetss/safelist.js
exports.safelist = [
  // Ti Elements
  'Label', 'Button', 'Window', 'ListView', 'TableView', 'ScrollView',
  // Color palette
  'bg-indigo-50', 'bg-indigo-100', /* ... */,
  'bg-indigo-800', 'bg-indigo-900',
  // Custom classes
  'btn-primary', 'card-shadow', /* ... */
];

// ./purgetss/config.cjs
module.exports = {
  purge: {
    options: {
      safelist: require('./safelist')
    }
  }
}
```

:::tip
If you need to keep a large list of classes and elements, you can create a CommonJS module with an array of all the styles and require it in `config.cjs`. You should put the safelist inside the `purgetss` folder to keep everything organized.
:::

### Disabling Specific Classes

To disable entire property plugins:

```javascript
module.exports = {
  purge: {
    options: {
      plugins: [
        'opacity',      // Disable all opacity classes
        'borderRadius'  // Disable all border-radius classes
      ]
    }
  }
}
```

This removes these classes from generation to reduce `app.tss` size.

## Troubleshooting Commands

### Verifying Installation

```bash
# Check PurgeTSS version
purgetss --version

# Verify global installation
which purgetss

# List all available commands
purgetss --help
```

### Debug Mode

Set `purge.options.missing` to `true` in `config.cjs` to see missing classes at the end of `app.tss`:

```javascript
module.exports = {
  purge: {
    options: {
      missing: true  // Reports missing/misspelled classes
    }
  }
}
```

:::info
Set `missing` to `true` if you want to get a list of any missing or misspelled classes at the end of the `app.tss` file. This is very useful if you want to check if you forgot to add a class definition or if you forgot to remove non-existing classes from your views, especially if you have upgraded from PurgeTSS v5 to v6.
:::
