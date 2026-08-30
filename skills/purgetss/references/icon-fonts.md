# Icon Font Libraries

PurgeTSS ships with four official icon font families. Alloy projects can use their preconfigured TSS classes; Classic projects can install the same fonts and use `fontFamily` plus Unicode directly or through the optional CommonJS modules.

For user-defined fonts (Google Fonts, brand typefaces, community icon libraries like map-icons or microns), see [Custom Fonts](./custom-fonts.md) — those use `build-fonts`, not `icon-library`.

> ℹ️ **INFO — Official Icon Fonts for PurgeTSS**
> - [Font Awesome 7 Free](https://fontawesome.com) (upgrade with `purgetss il -v=fa`)
> - [Framework 7 Icons](https://framework7.io/icons/)
> - [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)
> - [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols)
>
> Older versions of PurgeTSS bundled additional libraries (Bootstrap Icons, Boxicons, LineIcons, Tabler Icons). They were removed to keep maintenance under control, but you can [recreate them at the bottom of this page](#recreating-removed-icon-libraries).

## Icon families reference

Each family ships one or more variant classes, each pointing to a specific font file. Combine a variant class with an icon class to render a glyph. For example, `msr ms-home` uses the Material Symbols Rounded font with the `home` icon.

| Family | Variant | Class | `fontFamily` |
|---|---|---|---|
| **Material Symbols** | Outlined (default) | `.ms` | `MaterialSymbolsOutlined-Regular` |
| Material Symbols | Outlined (alias) | `.mso` | `MaterialSymbolsOutlined-Regular` |
| Material Symbols | Rounded | `.msr` | `MaterialSymbolsRounded-Regular` |
| Material Symbols | Sharp | `.mss` | `MaterialSymbolsSharp-Regular` |
| **Font Awesome** | Solid (default) | `.fa` | `FontAwesome7Free-Solid` |
| Font Awesome | Solid (alias) | `.fas` | `FontAwesome7Free-Solid` |
| Font Awesome | Regular | `.far` | `FontAwesome7Free-Regular` |
| Font Awesome | Brands | `.fab` | `FontAwesome7Brands-Regular` |
| **Material Icons** | Regular | `.mi` | `MaterialIcons-Regular` |
| **Framework 7** | Regular | `.f7` | `Framework7-Icons` |

> 💡 **TIP — Icon class names**
> Across a family, the icon class is shared by every variant. For Material Symbols, there is one `ms-home` class; pair it with `.ms`, `.mso`, `.msr`, or `.mss` to pick the shape (outlined, rounded, or sharp). FontAwesome works the same way: `fa-home` pairs with `.fa`/`.fas` (Solid) or `.far` (Regular), while brand icons like `fa-github` need `.fab`. **The variant class chooses the font file. The icon class chooses the glyph.**

### Full class lists

The complete class definitions live in the PurgeTSS `dist/` folder:

- [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/main/dist/fontawesome.tss)
- [materialicons.tss](https://github.com/macCesar/purgeTSS/blob/main/dist/materialicons.tss)
- [materialsymbols.tss](https://github.com/macCesar/purgeTSS/blob/main/dist/materialsymbols.tss)
- [framework7icons.tss](https://github.com/macCesar/purgeTSS/blob/main/dist/framework7icons.tss)

## Installing the icon fonts

Run `icon-library` to copy the font files to `app/assets/fonts/` (Alloy) or `Resources/fonts/` (Classic). Alloy can then use the icon classes from the table; Classic does not run class resolution.

```bash
# All four families
$ purgetss icon-library

# Selective install
$ purgetss il -v=fa,mi,ms,f7
```

> ℹ️ **INFO — You do not need the `.tss` files in `./purgetss/styles/`**
> PurgeTSS already knows every official icon class and resolves them at compile time from its own bundled `dist/` files. You do not need `fontawesome.tss`, `materialsymbols.tss`, `materialicons.tss`, or `framework7icons.tss` inside `./purgetss/styles/` for `class="fas fa-home"` (or any other icon class) to work in your XML and controllers. Install the `.ttf` files with `icon-library` and the classes are ready.
>
> The resolved Alloy classes are written to generated `app/styles/app.tss`, not `purgetss/styles/utilities.tss`. Classic receives only native fonts and any requested JavaScript module.

### Optional flags

Two optional flags adjust what `icon-library` copies into your project:

- `-s, --styles`: Alloy only. Copies the official `.tss` sources into `purgetss/styles/` for reference. Classic skips this output.
- `-m, --module`: copies the matching CommonJS module into `app/lib/` (Alloy) or `Resources/lib/` (Classic), exposing Unicode strings and stable font-family aliases.

```bash
# Add either flag when you want them
$ purgetss il -s
$ purgetss il -m
$ purgetss il -m -s
```

### Vendor aliases

`--vendor` accepts the short or long forms:

- `fa`, `fontawesome` = Font Awesome Icons
- `mi`, `materialicons` = Material Icons
- `ms`, `materialsymbol` = Material Symbols
- `f7`, `framework7` = Framework7 Icons

### CommonJS modules in Classic

Each module exposes its existing icon lookup API plus a `families` object with `families.default`. Direct aliases are also available:

| Module | Direct aliases |
| --- | --- |
| `fontawesome` | `solid`, `regular`, `brands` |
| `materialicons` | `regular`, `outlined`, `round`, `sharp`, `twoTone` |
| `materialsymbols` | `outlined`, `rounded`, `sharp` |
| `framework7icons` | `fontFamily` |

```javascript
const fontAwesome = require('fontawesome')

const home = Ti.UI.createLabel({
  text: fontAwesome.icons.home,
  font: {
    fontFamily: fontAwesome.solid,
    fontSize: 24
  }
})
```

The direct alias and `families` values agree, for example `fontAwesome.solid === fontAwesome.families.solid`; `families.default` provides the library's default variant.

## Using icons in Alloy XML

The variant class sets the `fontFamily`. The icon class sets the glyph (`text` / `title`). Apply both together:

`index.xml`
```xml
<Alloy>
  <Window>
    <View class="grid">
      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <!-- Material Symbols variants -->
        <Label class="mt-2 text-gray-700" text="Material Symbols" />
        <Button class="ms ms-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="msr ms-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="mss ms-home my-1 h-10 w-10 text-xl text-blue-500" />
      </View>

      <View class="vertical mx-auto grid-cols-2 gap-y-2">
        <!-- FontAwesome variants -->
        <Label class="mt-2 text-gray-700" text="Font Awesome" />
        <Button class="fas fa-home my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="far fa-bell my-1 h-10 w-10 text-xl text-blue-500" />
        <Button class="fab fa-github my-1 h-10 w-10 text-xl text-blue-500" />
      </View>
    </View>
  </Window>
</Alloy>
```

## Complete example with all four families

A side-by-side example using all four official families.

To use this file:

- Copy the content of `index.xml` into a new Alloy project.
- Install the official icon font files using `purgetss icon-library` (without `--vendor`, PurgeTSS copies all official icon fonts).
- Run `purgetss` once to generate the required files.
- Compile your app as usual.
- Use `liveview` if you want faster testing.

`index.xml`
```xml
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
        <!-- Material Symbols -->
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

Generated `app.tss` excerpt:
```css
// PurgeTSS v7.10.2
// Created by César Estrada
// https://purgetss.com

/* Ti Elements */
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#FFFFFF' }

/* Default Font Awesome */
'.fa': { font: { fontFamily: 'FontAwesome7Free-Solid' } }
'.fa-home': { text: '', title: '' }

/* Material Icons */
'.mi': { font: { fontFamily: 'MaterialIcons-Regular' } }
'.mi-home': { text: '', title: '' }

/* Material Symbols */
'.ms': { font: { fontFamily: 'MaterialSymbolsOutlined-Regular' } }
'.ms-home': { text: '', title: '' }

/* Framework7 */
'.f7': { font: { fontFamily: 'Framework7-Icons' } }
'.f7-house': { text: 'house', title: 'house' }
```

## Customizing Font Awesome

If you have a [Font Awesome Pro account](https://fontawesome.com/pro) or want to try the Beta, PurgeTSS can generate a custom `./purgetss/styles/fontawesome.tss` with the Pro or Beta classes.

### Font Awesome Pro

After setting the [@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro) with your token, install it in your project's root folder with `npm init` and `npm install --save-dev @fortawesome/fontawesome-pro` (current version 7.1.0).

To generate a new `purgetss/styles/fontawesome.tss`, run `purgetss build`. It also copies the Pro font files into `./app/assets/fonts` if needed.

Note: Titanium cannot use Font Awesome duotone icons because each icon uses two glyphs.

### Font Awesome 7 Beta

To generate a custom `fontawesome.tss` file from [Font Awesome 7 Beta](https://fontawesome.com/download):

Move the `css` and `webfonts` folders from `fontawesome-pro-7.0.0-beta3-web/`:

```bash
fontawesome-pro-7.0.0-beta3-web
└─ css
└─ webfonts
```

Into `./purgetss/fontawesome-beta`:

```bash
purgetss
└─ fontawesome-beta
   ├─ css
   └─ webfonts
```

Then run `purgetss build` to generate your custom `fontawesome.tss` file and test the new icons.

## Recreating removed icon libraries

Older versions of PurgeTSS bundled Bootstrap Icons, Boxicons, LineIcons, and Tabler Icons. The list was trimmed to make maintenance easier, but you can rebuild any of them:

1. Download the library from its official site:
   - [Bootstrap Icons](https://icons.getbootstrap.com)
   - [Boxicons](https://boxicons.com)
   - [LineIcons](https://lineicons.com/icons/?type=free)
   - [Tabler Icons](https://tabler-icons.io)
2. Place the `.ttf`/`.otf` and `.css` files into `./purgetss/fonts/<library>/`.
3. Run `purgetss build-fonts`.

For the underlying mechanics (how `build-fonts` reads the `.css`, options like `-m` and `-f`), see [Custom Fonts](./custom-fonts.md).

### `fonts.tss` example

```css
'.boxicons': { font: { fontFamily: 'boxicons' } }
'.lineicons': { font: { fontFamily: 'LineIcons' } }

/* Unicode Characters */
/* To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties */

/* boxicons.css */
'.bxl-meta': { text: '', title: '' }
'.bx-lemon': { text: '', title: '' }
/* ... */

/* lineicons.css */
'.lni-500px': { text: '', title: '' }
'.lni-add-files': { text: '', title: '' }
/* ... */
```

## Community-Discovered Patterns

The following note reflects community experience working with icon fonts that depend on multiple glyphs per icon.

> 🛑 **DANGER — Font Awesome Duotone**
> Titanium cannot render Font Awesome duotone icons correctly because each icon uses two glyphs. If you work with Font Awesome Pro, avoid documenting duotone as supported.

> 💡 **Mixing variant + icon in `class=`**
> A common mistake is omitting the variant class and writing just `class="fa-github"`. The icon class only sets `text`/`title` (the glyph) — without the variant class (`.fa`, `.fas`, `.fab`, etc.) the `fontFamily` is missing and the glyph renders as the system font's fallback character. Always include both: `class="fab fa-github"` or `class="msr ms-home"`.
