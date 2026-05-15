# Custom Fonts

Use the `purgetss/fonts/` folder and the `build-fonts` command to register any font in your Titanium app: brand typefaces, custom icon fonts, or community icon libraries that PurgeTSS no longer bundles.

For the 4 official icon families that ship with PurgeTSS (Font Awesome 7, Material Icons, Material Symbols, Framework7), see [Icon Fonts](./icon-fonts.md) — they use the `icon-library` command and do **not** require `build-fonts`.

## The `fonts` folder

Place `.ttf` or `.otf` files in `./purgetss/fonts/`. For icon fonts, also include the `.css` file that ships with the library. PurgeTSS reads it to extract the Unicode characters for each icon class.

This example uses [Bevan and Dancing Script](https://fonts.google.com/share?selection.family=Bevan:ital@0;1%7CDancing%20Script:wght@400;500;600;700) from Google Fonts:

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

### Organizing the fonts folder

If you prefer to keep things tidy, group each family in a subfolder. The output is the same.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ bevan
      ├─ Bevan-Italic.ttf
      └─ Bevan-Regular.ttf
   └─ dancing-script
      ├─ DancingScript-Bold.ttf
      ├─ DancingScript-Medium.ttf
      ├─ DancingScript-Regular.ttf
      └─ DancingScript-SemiBold.ttf
```

## The `build-fonts` command

```bash
$ purgetss build-fonts [-m] [-f]

# alias:
$ purgetss bf [-m] [-f]
```

What it does:

1. Creates `./purgetss/styles/fonts.tss` with one `fontFamily` class per file.
2. Copies the font files into `./app/assets/fonts/`, renamed to their PostScript names so they work on both iOS and Android.

After running `purgetss build-fonts` with the Bevan and Dancing Script example above:

`./purgetss/styles/fonts.tss`
```css
// Fonts TSS file generated with PurgeTSS
// https://purgetss.com/docs/customization/custom-fonts

'.bevan-italic': { font: { fontFamily: 'Bevan-Italic' } }
'.bevan-regular': { font: { fontFamily: 'Bevan-Regular' } }

'.dancingscript-bold': { font: { fontFamily: 'DancingScript-Bold' } }
'.dancingscript-medium': { font: { fontFamily: 'DancingScript-Medium' } }
'.dancingscript-regular': { font: { fontFamily: 'DancingScript-Regular' } }
'.dancingscript-semibold': { font: { fontFamily: 'DancingScript-SemiBold' } }
```

You can now use these classes on any Titanium component with a `font` property: Labels, Buttons, TextFields, TextAreas, ListItems, TableViewRows, and ActivityIndicators.

### Renaming the class

To use a shorter or different class name, rename the font file. For example:

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

Running `build-fonts` produces:

`./purgetss/styles/fonts.tss`
```css
'.script-bold': { font: { fontFamily: 'DancingScript-Bold' } }
'.script-medium': { font: { fontFamily: 'DancingScript-Medium' } }
'.script-regular': { font: { fontFamily: 'DancingScript-Regular' } }
'.script-semibold': { font: { fontFamily: 'DancingScript-SemiBold' } }
```

The class name changes, but the actual `fontFamily` value (the PostScript name) stays the same.

## Adding icon fonts

Any icon font that ships a `.ttf` (or `.otf`) plus a `.css` file with Unicode characters works the same way.

This example uses [map-icons](http://map-icons.com) and [microns](https://www.s-ings.com/projects/microns-icon-font/):

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ bevan
   └─ dancing-script
   └─ map-icons
      ├─ map-icons.css
      └─ map-icons.ttf
   └─ microns
      ├─ microns.css
      └─ microns.ttf
```

After `purgetss build-fonts`, the generated `fonts.tss` includes the family classes and one class per icon:

`./purgetss/styles/fonts.tss`
```css
// Fonts TSS file generated with PurgeTSS
// https://purgetss.com/docs/customization/custom-fonts

'.map-icons': { font: { fontFamily: 'map-icons' } }
'.microns': { font: { fontFamily: 'microns' } }

/* Unicode Characters */
/* To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties */

/* map-icons/map-icons.css */
'.map-icon-abseiling': { text: '', title: '' }
'.map-icon-accounting': { text: '', title: '' }
'.map-icon-airport': { text: '', title: '' }
'.map-icon-amusement-park': { text: '', title: '' }
'.map-icon-aquarium': { text: '', title: '' }
/* ... */

/* microns/microns.css */
'.mu-arrow-left': { text: '', title: '' }
'.mu-arrow-right': { text: '', title: '' }
'.mu-arrow-up': { text: '', title: '' }
'.mu-arrow-down': { text: '', title: '' }
'.mu-left': { text: '', title: '' }
/* ... */
```

## Options

Two optional flags adjust what `build-fonts` generates:

- `-m, --module`: generates a CommonJS module in `./app/lib/purgetss.fonts.js` that exposes each icon's Unicode string to JavaScript. Handy when you set `label.text` from a controller.
- `-f, --font-class-from-filename`: uses the font's filename as the font class name and icon prefix instead of the font family name. Useful when you want shorter prefixes. Replaces the old `-p` flag.

### Using `--module`

```bash
$ purgetss build-fonts --module

# alias:
$ purgetss bf -m
```

To avoid prefix conflicts between libraries, each icon keeps its prefix as a nested object. Both `icons` and `families` are exported:

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  // map-icons/map-icons.css
  'mapIcon': {
    'abseiling': '',
    'accounting': '',
    'airport': '',
    'amusementPark': '',
    // ...
  },
  // microns/microns.css
  'mu': {
    'arrowLeft': '',
    'arrowRight': '',
    'arrowUp': '',
    'arrowDown': '',
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

### Using `--font-class-from-filename`

When you want the class name and the icon prefix to come from the **filename** of the `.ttf` and `.css` instead of the font family, use `-f`.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ map-icons
      ├─ map.ttf
      └─ mp.css
   └─ microns
      ├─ mic.ttf
      └─ mc.css
```

`./purgetss/styles/fonts.tss`
```css
/* "fontFamily" classes use the font's filename */
'.map': { font: { fontFamily: 'map-icons' } }
'.mic': { font: { fontFamily: 'microns' } }

/* map-icons/mp.css */
'.mp-abseiling': { text: '', title: '' }
'.mp-accounting': { text: '', title: '' }
'.mp-airport': { text: '', title: '' }
'.mp-amusement-park': { text: '', title: '' }
'.mp-aquarium': { text: '', title: '' }
/* ... */

/* microns/mc.css */
'.mc-arrow-left': { text: '', title: '' }
'.mc-arrow-right': { text: '', title: '' }
'.mc-arrow-up': { text: '', title: '' }
'.mc-arrow-down': { text: '', title: '' }
'.mc-left': { text: '', title: '' }
/* ... */
```

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  // map-icons/mp.css
  'mp': {
    'abseiling': '',
    'accounting': '',
    'airport': '',
    'amusementPark': '',
    // ...
  },
  // microns/mc.css
  'mc': {
    'arrowLeft': '',
    'arrowRight': '',
    'arrowUp': '',
    'arrowDown': '',
    // ...
  }
};
exports.icons = icons;

const families = {
  // map-icons/mp.css
  'mp': 'map-icons',
  // microns/mc.css
  'mc': 'microns'
};
exports.families = families;
```

> 🛑 **DANGER**
> Make sure the new prefix is unique and does not conflict with other class prefixes. A duplicate prefix will silently overwrite earlier rules in the generated `fonts.tss`, leaving you with icons that render the wrong glyph at runtime.

## Custom proprietary icon fonts

If your design system ships its own icon font, treat it like any other icon library: drop the `.ttf` + `.css` pair into `./purgetss/fonts/<name>/` and run `build-fonts`. The classes are then available in your TSS.

## Community-Discovered Patterns

The following notes reflect community experience with `build-fonts` against real-world Titanium projects.

> **💡 PostScript renaming**
> `build-fonts` copies `.ttf`/`.otf` files into `./app/assets/fonts/` renamed to their **PostScript names**. iOS reads PostScript names while Android tolerates filenames; by renaming both platforms work from the same `fontFamily` value.

> **🛑 Font Awesome Duotone**
> Titanium cannot render Font Awesome duotone icons because each icon uses two glyphs. If you work with Font Awesome Pro, avoid documenting duotone as supported.

> **💡 Use `--module` to set `text`/`title` from JavaScript**
> Hardcoding `` in a controller is brittle. The `-m` flag generates a `purgetss.fonts.js` you can `require()` and reference by friendly name: `label.text = icons.fa.home`. Combine with `families` to set `font.fontFamily` programmatically.
