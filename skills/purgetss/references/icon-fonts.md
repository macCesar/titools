# Icon Font Libraries

> ℹ️ **INFO — Official Icon Fonts for PurgeTSS**
>
> Older versions of PurgeTSS bundled additional icon font libraries — Bootstrap Icons, Boxicons, LineIcons, and Tabler Icons among them. **Those libraries have been deprecated and removed from the official distribution** to keep maintenance under control. They are still usable, but you must rebuild them yourself with `build-fonts` (see below).
>
> The icon fonts officially supported and shipped by PurgeTSS today are:
>
> - [Font Awesome 7 Free](https://fontawesome.com) (upgrade with `purgetss il -v=fa`)
> - [Framework 7](https://framework7.io/icons/)
> - [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)
> - [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols)

For the official install flow for the supported vendors, see [CLI Commands](./cli-commands.md#icon-library-command).

## Recreate Removed Libraries

You can recreate any deprecated library using the `build-fonts` command.

### 1. Download the Libraries

Start by downloading the libraries from their official websites:

- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Boxicons](https://boxicons.com)
- [LineIcons](https://lineicons.com/icons/?type=free)
- [Tabler Icons](https://tabler-icons.io)

### 2. The `fonts` Folder

Put the desired libraries in the `./purgetss/fonts` folder.

> ℹ️ **INFO**
> Copy the TrueType or OpenType font files and the `.css` file.

```bash
purgetss
└─ fonts
   └─ boxicons
      ├─ boxicons.css
      └─ boxicons.ttf
   └─ lineicons
      ├─ lineicons.css
      └─ lineicons.ttf
```

### 3. The `build-fonts` Command

Run the `build-fonts` command to create a custom `fonts.tss` file.

```bash
purgetss build-fonts [--modules]

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
/* To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties */

/* boxicons.css */
'.bxl-meta': { text: '', title: '' }
'.bx-lemon': { text: '', title: '' }
/* ... */

/* lineicons.css */
'.lni-500px': { text: '', title: '' }
'.lni-add-files': { text: '', title: '' }
/* ... */
```

### Rename the Style Rule Name

PurgeTSS uses the font file name as the style rule name. You can change it by renaming the font file.

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

### The `--modules` Option

When you use the `--modules` option, it generates a `./app/lib/purgetss.fonts.js` CommonJS module file.

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  /* boxicons */
  boxicons: {
    bxlMeta: '',
    bxLemon: ''
    /* ... */
  },
  /* lineicons */
  lni: {
    '500px': '',
    addFiles: ''
    /* ... */
  }
};
exports.icons = icons;
```

### The `--prefix` Option

PurgeTSS determines the group's prefix for each icon family and class name. Use `--prefix` to apply the style's filename as the prefix for class names in `fonts.tss` and property names in `purgetss.fonts.js`.

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
'.li-zoom-out': { text: '', title: '' }
'.li-zoom-in': { text: '', title: '' }
/* ... */
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

> 🛑 **DANGER**
>
> Make sure the new prefix stays unique so it does not collide with other class prefixes. A duplicate prefix will silently overwrite earlier rules in the generated `fonts.tss`, leaving you with icons that render the wrong glyph at runtime.

## Community-Discovered Patterns

The following note reflects community experience working with icon fonts that depend on multiple glyphs per icon.

> 🛑 **DANGER — Font Awesome Duotone**
> Titanium cannot render Font Awesome duotone icons correctly because each icon uses two glyphs. If you work with Font Awesome Pro, avoid documenting duotone as supported.
