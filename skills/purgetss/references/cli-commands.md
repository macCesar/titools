# PurgeTSS CLI Commands

> **️ℹ️ Version Notes**
> - Node.js 20+ is required.
> - `utilities.tss` is the generated utilities file. Replace any references that still use the previous output filename.
> - Font Awesome 7 is supported, including the new CSS custom properties format.

This page lists the commands available in PurgeTSS.

## Setup Commands

- `init`: Initializes PurgeTSS on an existing Alloy project.
- `create`: Creates a new Alloy project with PurgeTSS already set up.

## Development Commands

- `build`: Generates `utilities.tss` from `config.cjs`.
- `watch`: Runs `purgetss` automatically on each project compile.

## Asset Commands

- `icon-library`: Copies the official icon fonts into `./app/assets/fonts`.
- `build-fonts`: Generates `./purgetss/styles/fonts.tss` with class definitions and `fontFamily` selectors for custom fonts.

## Utility Commands

- `shades`: Generates shades and tints for a color and writes the palette to `config.cjs`.
- `color-module`: Creates `./app/lib/purgetss.colors.js` with the colors defined in `config.cjs`.
- `module`: Installs `purgetss.ui.js` in the `lib` folder.

## Maintenance Commands

- `update`: Updates PurgeTSS to the latest version.
- `sudo-update`: Updates PurgeTSS using `sudo` to install npm modules if needed.

## `init` Command

The `init` command sets up PurgeTSS by creating `./purgetss/config.cjs` at the root of an existing Alloy project.

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
  theme: {
    extend: {}
  }
};
```

> **💡 TIP**
> PurgeTSS looks for `./purgetss/config.cjs`. Each section is optional and can be customized. Missing sections use the default configuration.

## `create` Command

The `create` command generates a new Alloy project with PurgeTSS already set up.

### Arguments

- Enclose the project name in single or double quotes. Required.

### Options

- `-f, --force` to overwrite an existing project.
- `-d, --dependencies` to install ESLint and Tailwind CSS.
- `-v, --vendor [fa,mi,ms,f7]` to copy the selected fonts into your project and add the CommonJS module in `./app/lib/`.

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

Installing these dependencies adds linting and editor support for projects using PurgeTSS.

```bash
purgetss create 'Name of the Project' [--dependencies]

# alias:
purgetss c 'Name of the Project' [-d]
```

This option installs ESLint for code quality, Tailwind CSS for editor tooling, and setup files for Visual Studio Code.

> **⚠️ WARNING**
> Tailwind CSS is installed here for editor support and related tooling. PurgeTSS remains a separate Titanium styling toolkit.

Recommended VSCode extensions:

- [XML Tools](https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml): XML formatting.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Linting and coding standards.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): Editor support for class completion workflows.
- [Tailwind Raw Reorder (v4)](https://marketplace.visualstudio.com/items?itemName=KevinYouu.tailwind-raw-reorder-tw4): Class sorting for XML and JS files.
- [Intellisense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion): Class completion based on your `purgetss/config.cjs`, including `fonts.tss` and `utilities.tss`.

### List of Commands Used

Running `purgetss create "Name of the Project" [--dependencies --vendor=fa,mi,ms,f7]` executes:

- `ti config app.idprefix && ti config app.workspace`
- `ti create -t app -p all -n "Name of the Project" --no-prompt --id "the-prefix-id-and-the-name-of-the-project"`
- `cd app.workspace/"Name of the Project"`
- `alloy new`
- `purgetss w`
- `purgetss b`
- `[--vendor=fa,mi,ms,f7]`
- `[--dependencies]`
- `code .`, `subl .`, or `open .`

## `install-dependencies` Command

This command installs dev dependencies and configuration files in existing PurgeTSS projects, and sets up Visual Studio Code support.

```bash
purgetss install-dependencies

# alias:
purgetss id
```

> **⚠️ CAUTION**
> This command overwrites any existing `extensions.json` and `settings.json` files. Back them up if you want to keep your current versions.

## `icon-library` Command

The `icon-library` command copies the free font files for Font Awesome, Material Icons, Material Symbols, and Framework7 Icons into `./app/assets/fonts`.

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

After copying the fonts, you can use them in Buttons and Labels. For example, for Font Awesome, set the font family to `fa` and use a class like `fa-home`.

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
- `ms`, `materialsymbols` = Material Symbols
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

If you have a [Font Awesome Pro account](https://fontawesome.com/pro), you can generate a custom `./purgetss/styles/fontawesome.tss` file with the Pro-only classes, except duotone icons.

After setting the [@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro) with your token, install it in your project's root folder:

```bash
npm init
npm install --save-dev @fortawesome/fontawesome-pro
```

To generate a new `purgetss/styles/fontawesome.tss`, run:

```bash
purgetss build
```

> **⚠️ CAUTION**
> Titanium cannot use Font Awesome duotone icons because they have two separate glyphs for each icon.

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

Then run `purgetss build` to generate your custom `fontawesome.tss` file.

### Font Example File

To use this file:

1. Copy the content of `index.xml` into a new Alloy project.
2. Install the official icon font files using `purgetss icon-library`.
3. Run `purgetss` once to generate the required files.
4. Compile your app as usual.

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
 * Created by César Estrada
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

```bash
purgetss build-fonts

# alias:
purgetss bf
```

1. This creates `./purgetss/styles/fonts.tss` with all class definitions and `fontFamily` selectors.
2. It also copies the font files into `./app/assets/fonts`.
3. PurgeTSS renames the font files to match their PostScript names so they work on both iOS and Android.

In this example, we use Bevan and Dancing Script from Google Fonts.

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

After running `purgetss build-fonts` you will have the following classes:

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

For better organization, you can group each font family in subfolders. For example:

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

This generates the same `fonts.tss` file while keeping the `fonts` folder organized.

### Renaming `fontFamily` Classes

If you want to use a shorter or different name for any of the font classes, rename the font file.

For example:

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
/* To use your icon fonts in Buttons and Labels each class sets `text` and `title` */

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
- `-f, --filename`: Use filenames as both font class names and icon prefixes.

### CommonJS Module

You can use the `--module` option to generate a CommonJS module called `purgetss.fonts.js` in `./app/lib/`.

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

Use the `--filename` option to apply the style's filename as both the font class name and the prefix for icon class names in `fonts.tss` and property names in `purgetss.fonts.js`.

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

> **️ℹ️ INFO**
> More than 66% of `utilities.tss` classes are related to color properties, so `shades` is a practical way to extend color choices.

Basic usage:

```bash
purgetss shades 53606b Primary

# alias:
purgetss s 53606b Primary
```

The generated color shades will be added to your `config.cjs` file, which subsequently generates `utilities.tss` with the newly added colors.

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

> **️ℹ️ INFO**
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

## `build` Command

The `build` command generates `utilities.tss` from `config.cjs`. Run it after you change `config.cjs`.

```bash
purgetss build

# alias:
purgetss b
```

When `purgetss` runs, manually or via `watch`, it checks for changes in `config.cjs` and regenerates `utilities.tss` when needed.

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
task('pre:compile', function(event, logger) {
  require('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));
});
```

> **️ℹ️ INFO**
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

PurgeTSS updates include new features, updated dependencies, and bug fixes.

## `sudo-update` Command

The `sudo-update` command is the same as `update`, but uses `sudo` to install npm modules when needed.

```bash
purgetss sudo-update

# alias:
purgetss su
```
