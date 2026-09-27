# PurgeTSS Color Commands

The three commands that turn colors into project files: `semantic` writes Light/Dark semantic colors, `shades` writes a Tailwind-style palette into `config.cjs`, and `color-module` exports the palette as a CommonJS module. Split out of [cli-commands.md](cli-commands.md), which covers every other command and the Alloy/Classic compatibility table.

## `semantic` Command

Introduced in v7.6.0. Generates Titanium semantic colors with Light/Dark support. Alloy writes `app/assets/semantic.colors.json` and utility mappings; Classic writes only `Resources/semantic.colors.json` and does not create `purgetss/`, `config.cjs`, TSS, `app/`, or a hook. The command dispatches between two modes based on `--single`.

> **Tip**
> This is a quick reference. See [semantic-colors.md](./semantic-colors.md) for the complete guide — mirror inversion math, Titanium semantic color spec, class mapping conventions, and strategies for purpose-based design systems.

### Palette mode (no `--single`)

One base hex, 11-shade tonal palette with mirror-by-index Light/Dark inversion anchored at shade `500`. Alloy writes the JSON plus the utility mapping in `config.cjs`; Classic writes only the native JSON entries.

```bash
purgetss semantic <hex> <name>
purgetss semantic '#15803d' amazon
```

Usage produces classes like `bg-amazon-50`, `text-amazon-500`, `border-amazon-950` that flip tonal contrast automatically with the system appearance.

### Single mode (`--single`)

Explicit per-mode hex values for purpose-based semantic colors (`surfaceColor`, `textColor`, `borderColor`, `overlayColor`, etc.). Alloy writes the JSON entry and maps it to a utility class in `config.cjs`; Classic writes only the native JSON entry and uses its key directly in Titanium color properties.

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
| `-o, --override` | Alloy only: place the mapping in `theme.colors` instead of `theme.extend.colors`. Ignored in Classic. |
| `-q, --quotes` | Alloy only: keep double quotes in `config.cjs`. Ignored in Classic. |
| `-l, --log` | Preview the JSON without writing any files. |

## `shades` Command

The `shades` command generates shades and tints for a given color and writes the palette to `config.cjs`.

Saving works in Alloy and Classic. In Classic, `config.cjs` is only a development-time color source for commands such as `color-module`; it does not install the PurgeTSS utility lifecycle or create empty brand, font, or image source folders. If `Resources/lib/purgetss.colors.js` already exists, saving refreshes it. `--log`, `--json`, and `--tailwind` write nothing and work outside a project.

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

This command creates `purgetss.colors.js` with all colors defined in `config.cjs`: `app/lib/` in Alloy or `Resources/lib/` in Classic. A missing config is created as the color source, but Classic receives no empty `purgetss/brand/`, `purgetss/fonts/`, or `purgetss/images/` folders, Alloy hook, or TSS.

Classic loads the result with `require('lib/purgetss.colors')`; see [Classic module paths](./classic-projects.md#loading-generated-modules-in-classic).

```bash
purgetss color-module

# alias:
purgetss cm
```

`app/lib/purgetss.colors.js` (Alloy) or `Resources/lib/purgetss.colors.js` (Classic)
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
