# Icon Font Libraries

> **️ℹ️ Official Icon Fonts for PurgeTSS**
> Previous versions of PurgeTSS included several icon font libraries such as Bootstrap Icons, Boxicons, LineIcons, and Tabler Icons. To keep maintenance manageable, the official icon fonts are now:
>
> - [Font Awesome 7 Free](https://fontawesome.com)
> - [Framework7](https://framework7.io/icons/)
> - [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)
> - [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols)

For the official install flow for those vendors, see [CLI Commands](./cli-commands.md#icon-library-command).

## Recreate Removed Libraries

You can recreate removed libraries with the `build-fonts` command.

### 1. Download the Libraries

Start by downloading the libraries from their official websites:

- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Boxicons](https://boxicons.com)
- [LineIcons](https://lineicons.com/icons/?type=free)
- [Tabler Icons](https://tabler-icons.io)

### 2. The `fonts` Folder

Put the desired libraries in the `./purgetss/fonts` folder.

> **️ℹ️ INFO**
> Copy the TrueType or OpenType font files and the `.css` file.

```bash
purgetss
└─ fonts
   ├─ boxicons
   │  ├─ boxicons.css
   │  └─ boxicons.ttf
   └─ lineicons
      ├─ lineicons.css
      └─ lineicons.ttf
```

### 3. The `build-fonts` Command

Run the `build-fonts` command to create a custom `fonts.tss` file.

```bash
purgetss build-fonts [--module]

# alias:
purgetss bf [-m]
```

### The `fonts.tss` File

The `build-fonts` command generates `./purgetss/styles/fonts.tss` with Unicode characters and style rules.

`./purgetss/styles/fonts.tss`
```tss
'.boxicons': { font: { fontFamily: 'boxicons' } }
'.lineicons': { font: { fontFamily: 'LineIcons' } }

/* Unicode Characters */
/* To use your icon fonts in Buttons and Labels each class sets `text` and `title` */

/* boxicons.css */
'.bxl-meta': { text: '\uef27', title: '\uef27' }
'.bx-lemon': { text: '\uef28', title: '\uef28' }
'.bxs-lemon': { text: '\uef29', title: '\uef29' }

/* lineicons.css */
'.lni-500px': { text: '\uea03', title: '\uea03' }
'.lni-add-files': { text: '\uea01', title: '\uea01' }
'.lni-adobe': { text: '\uea06', title: '\uea06' }
```

### Rename the Style Rule Name

PurgeTSS uses the font filename as the style rule name. You can change it by renaming the font file.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ boxicons
      └─ bx.ttf
```

New style rule name: `'.bx'`

```tss
'.bx': { font: { fontFamily: 'boxicons' } }
```

### The `assets/fonts` Folder

The `build-fonts` command copies the font files to `./app/assets/fonts` and renames them to their PostScript names so they work on both iOS and Android.

```bash
app
└─ assets
   └─ fonts
      ├─ boxicons.ttf
      └─ LineIcons.ttf
```

### The `--module` Option

When you use the `--module` option, it generates a `./app/lib/purgetss.fonts.js` CommonJS module file.

```javascript
const icons = {
  /* boxicons */
  boxicons: {
    bxlMeta: '\uef27',
    bxLemon: '\uef28',
    bxsLemon: '\uef29'
  },
  /* lineicons */
  lni: {
    '500px': '\uea03',
    addFiles: '\uea01',
    adobe: '\uea06'
  }
};
exports.icons = icons;
```

### The `--filename` Option

PurgeTSS determines the group's prefix for each icon family and class name. Use `--filename` to apply the style's filename as the prefix for class names in `fonts.tss` and property names in `purgetss.fonts.js`.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ lineicons
      └─ li.css
```

New group prefix: `li`

`./purgetss/styles/fonts.tss`
```tss
/* lineicons/li.css */
'.li-zoom-out': { text: '\uea02', title: '\uea02' }
'.li-zoom-in': { text: '\uea03', title: '\uea03' }
'.li-zip': { text: '\uea04', title: '\uea04' }
```

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  /* lineicons/li.css */
  li: {
    /* ... */
  }
};
exports.icons = icons;
```

> **🚨 DANGER**
> Make sure the new prefix remains unique to avoid conflicts with other class prefixes.

> **⚠️ Font Awesome Duotone**
> Titanium cannot render Font Awesome duotone icons correctly because each icon uses two glyphs. If you work with Font Awesome Pro, avoid documenting duotone as supported.
