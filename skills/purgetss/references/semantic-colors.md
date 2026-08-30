# Semantic Colors

Semantic colors let your app respond to Light / Dark mode changes without any extra runtime code. You define color **names** once, give each name a `light` and `dark` hex value, and Titanium resolves the right one at render time based on `Ti.UI.overrideUserInterfaceStyle`. PurgeTSS's contribution is the `theme.extend.colors` mapping in `config.cjs` that turns those names into utility classes like `bg-surface` or `text-on-surface`.

This file covers the full workflow: the JSON schema, the `config.cjs` mapping, nesting rules (and the `[object Object]` trap), the numeric 11-step tonal-inversion pattern, alpha transparency, the `purgetss semantic` CLI, and three patterns for consuming semantic colors from controllers at runtime.

For the mode-switching runtime that drives all of this (`Appearance.init()`, `Appearance.set(...)`, persistence), see [appearance-module.md](./appearance-module.md).

> **INFO**
>
> Semantic color resolution is a **Titanium** feature, not PurgeTSS magic. Titanium natively reads `semantic.colors.json` (at `app/assets/` on Alloy, `Resources/` on Classic) and resolves any color-accepting property whose value matches a key in that file. In Alloy, PurgeTSS also generates utility mappings that point at those keys; Classic uses the keys directly. The switching behavior is native in both layouts.

<!-- TOC-START -->
## Contents

- [Setting up `semantic.colors.json`](#setting-up-semanticcolorsjson)
- [Registering in `config.cjs`](#registering-in-configcjs)
- [Numeric 11-step tonal-inversion palette](#numeric-11-step-tonal-inversion-palette)
- [The `semantic` CLI command](#the-semantic-cli-command)
- [Using semantic classes in Alloy views](#using-semantic-classes-in-alloy-views)
- [Using semantic colors in controllers](#using-semantic-colors-in-controllers)
- [Recommended starter palette](#recommended-starter-palette)
- [Related](#related)
- [Community-Discovered Patterns](#community-discovered-patterns)

<!-- TOC-END -->

## Setting up `semantic.colors.json`

Create the `semantic.colors.json` file with your color definitions. The file location depends on your project type, per the TiDev convention:

- **Alloy** → `app/assets/semantic.colors.json`
- **Classic** → `Resources/semantic.colors.json`

> **INFO**
>
> The `semantic` command (covered later on this page) auto-detects the project layout and writes to the right location — you don't need to specify it manually. The path examples below use the Alloy location; Classic users get their output under `Resources/` automatically.

Each top-level key is a color name; each value is an object with `light` and `dark` hex strings.

`app/assets/semantic.colors.json`
```json
{
  "surfaceColor": {
    "light": "#F9FAFB",
    "dark":  "#0f172a"
  },
  "surfaceHighColor": {
    "light": "#FFFFFF",
    "dark":  "#1e293b"
  },
  "textColor": {
    "light": "#111827",
    "dark":  "#f1f5f9"
  },
  "textSecondaryColor": {
    "light": "#6B7280",
    "dark":  "#94a3b8"
  },
  "borderColor": {
    "light": "#E5E7EB",
    "dark":  "#334155"
  },
  "accentColor": {
    "light": "#3B82F6",
    "dark":  "#60a5fa"
  }
}
```

This is a reasonable 6-color starter palette: background, elevated surfaces, primary text, secondary text, borders, and an accent. Most apps can ship with just these and extend later.

### Alpha transparency — the 8-digit format

Titanium accepts the `#RRGGBBAA` 8-digit hex format anywhere a color is expected. Use it in either mode to produce translucent surfaces like overlays or glass sheets:

```json
{
  "overlayColor": {
    "light": "#00000080",
    "dark":  "#000000CC"
  },
  "glassColor": {
    "light": "#FFFFFFB3",
    "dark":  "#0F172AB3"
  }
}
```

The last two hex digits are the alpha channel: `00` is fully transparent, `FF` is fully opaque, `80` is ~50%, `B3` is ~70%, `CC` is ~80%.

## Registering in `config.cjs`

Titanium resolves `surfaceColor` at runtime, but PurgeTSS needs to know which **class name** should emit that color. Map the JSON keys to class names under `theme.extend.colors`:

`purgetss/config.cjs`
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'surfaceColor',
          high:    'surfaceHighColor'
        },
        'on-surface':         'textColor',
        'on-surface-variant': 'textSecondaryColor',
        border:               'borderColor',
        accent:               'accentColor'
      }
    }
  }
}
```

This generates `bg-surface`, `bg-surface-high`, `text-on-surface`, `text-on-surface-variant`, `bg-border`, `text-accent`, `bg-accent`, etc. Any utility that takes a color — `bg-*`, `text-*`, `border-*`, `placeholder-*`, tint classes — can reference the name.

### Nested pattern with `DEFAULT`

One level of nesting is supported, and it must include a `DEFAULT` key for the base variant:

```js
// Correct -- generates bg-surface and bg-surface-high
surface: {
  DEFAULT: 'surfaceColor',
  high:    'surfaceHighColor'
}
```

`bg-surface` resolves to `surfaceColor` (the `DEFAULT`), and `bg-surface-high` resolves to `surfaceHighColor`.

> **DANGER**
>
> Common error: nested objects without `DEFAULT`
>
> ```js
> // Wrong -- generates [object Object] instead of a color
> surface: {
>   regular: 'surfaceColor',
>   high:    'surfaceHighColor'
> }
> ```
>
> If you nest without a `DEFAULT` key and then use the base class (`bg-surface`), PurgeTSS serializes the whole nested object with `String(...)`, producing the literal string `[object Object]` as the color value. Titanium can't parse that, and the view renders with whatever fallback the platform has. Always include `DEFAULT` for the base variant, or use a flat structure.

### Flat structure alternative

If you prefer not to nest at all, every class name is a top-level key:

```js
colors: {
  surface:        'surfaceColor',
  'surface-high': 'surfaceHighColor',
  'on-surface':   'textColor',
  border:         'borderColor',
  accent:         'accentColor'
}
```

Both approaches work. The nested form groups related shades under one namespace; the flat form avoids the `DEFAULT` trap. Pick whichever reads better in your `config.cjs`.

## Numeric 11-step tonal-inversion palette

Instead of purpose-based names, you can model a color as an 11-step tonal scale (`50` through `950`) where each light-mode value **inverts** in dark mode. This gives you a full tonal range from a single palette and keeps dark-mode contrast in lockstep with light mode.

`app/assets/semantic.colors.json`
```json
{
  "color50":  { "light": "#030712", "dark": "#f9fafb" },
  "color100": { "light": "#111827", "dark": "#f3f4f6" },
  "color200": { "light": "#1f2937", "dark": "#e5e7eb" },
  "color300": { "light": "#374151", "dark": "#d1d5db" },
  "color400": { "light": "#4b5563", "dark": "#9ca3af" },
  "color500": { "light": "#6b7280", "dark": "#6b7280" },
  "color600": { "light": "#9ca3af", "dark": "#4b5563" },
  "color700": { "light": "#d1d5db", "dark": "#374151" },
  "color800": { "light": "#e5e7eb", "dark": "#1f2937" },
  "color900": { "light": "#f3f4f6", "dark": "#111827" },
  "color950": { "light": "#f9fafb", "dark": "#030712" }
}
```

Mapped as a nested `primary` palette:

`purgetss/config.cjs`
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'color50',
          100: 'color100',
          200: 'color200',
          300: 'color300',
          400: 'color400',
          500: 'color500',
          600: 'color600',
          700: 'color700',
          800: 'color800',
          900: 'color900',
          950: 'color950'
        }
      }
    }
  }
}
```

You get `bg-primary-50`, `text-primary-950`, `border-primary-500`, etc. — and the tonal contrast automatically flips with the appearance.

### How the inversion works

| Role                  | Light     | Dark      | Notes                                       |
| --------------------- | --------- | --------- | ------------------------------------------- |
| `color50`  (extreme)  | `#030712` | `#f9fafb` | Darkest in light mode, lightest in dark     |
| `color500` (middle)   | `#6b7280` | `#6b7280` | Anchor — identical in both modes            |
| `color950` (mirror)   | `#f9fafb` | `#030712` | Mirror of `color50` — extremes reversed     |

The stops mirror by index: `50` <-> `950`, `100` <-> `900`, `200` <-> `800`, and so on. `500` is the anchor and is identical in both modes.

> **INFO**
>
> The numeric pattern and the purpose-based pattern can coexist in the same project. A common layout is: numeric scale for one brand family (`primary`, `secondary`), purpose-based names for surfaces and text (`surfaceColor`, `textColor`, `borderColor`). Use whichever expresses intent most clearly per role.

## The `semantic` CLI command

Writing the 11 JSON entries by hand (palette) or each purpose-based color (single) is mechanical and error-prone. The `purgetss semantic` command does both. Dispatch is by `--single` — omit it for palette mode, include it for single mode.

### Palette mode — auto-generated tonal scale

One base hex plus a family name produces 11 JSON entries with mirror inversion, plus a matching `config.cjs` mapping, in one step:

```bash
purgetss semantic '#15803d' amazon
```

In Alloy, this:

1. Generates `amazon50` through `amazon950` using the same algorithm as the `shades` command.
2. Writes `semantic.colors.json` under `app/assets/` with mirror-by-index values — 50 ↔ 950, 100 ↔ 900, …, 500 as the identical anchor.
3. Writes the `{ 50: 'amazon50', 100: 'amazon100', ... }` mapping into `config.cjs`.
4. Strips any prior keys for the `amazon` family before writing — re-runs cleanly replace, never duplicate.

In Classic, the same command writes only the native `Resources/semantic.colors.json` entries. It does not create `purgetss/`, `config.cjs`, utility mappings, TSS, `app/`, or an Alloy hook. Use keys such as `amazon50` directly in Titanium color properties.

Useful flags:

- `--log` (`-l`) — preview the JSON on the console without writing anything.
- `--override` (`-o`) — place the mapping in `theme.colors` instead of `theme.extend.colors`.
- `--random` (`-r`) with `--name` (`-n`) — pick a random base color for a named family.

```bash
purgetss semantic '#15803d' amazon --log         # preview only
purgetss semantic '#15803d' amazon --override    # goes into theme.colors
purgetss semantic --random --name brand          # random base, named family
```

### Single mode — purpose-based with explicit per-mode hex

For colors like `surfaceColor`, `textColor`, `borderColor`, or `overlayColor` — where light and dark values are hand-picked from the design system, not derived algorithmically. Pass `--single`, the light hex, the name, and optionally `--dark` and `--alpha`:

```bash
purgetss semantic --single '#F9FAFB' surfaceColor       --dark '#0f172a'
purgetss semantic --single '#FFFFFF' surfaceHighColor   --dark '#1e293b'
purgetss semantic --single '#111827' textColor          --dark '#f1f5f9'
purgetss semantic --single '#6B7280' textSecondaryColor --dark '#94a3b8'
purgetss semantic --single '#E5E7EB' borderColor        --dark '#334155'
purgetss semantic --single '#3B82F6' accentColor        --dark '#60a5fa'
purgetss semantic --single '#000000' overlayColor       --alpha 50
```

The name is preserved verbatim as the JSON key (camelCase is respected). When `--dark` is omitted, it defaults to the light hex — useful for overlays where alpha is the only variation between modes.

In Alloy, single mode writes **both files** in one shot. The class name is auto-derived from the semantic key by stripping the conventional `Color` suffix and kebab-casing the rest, so `surfaceHighColor` becomes the `surface-high` class. In Classic, it writes only the native JSON entry and code uses the semantic key directly:

`./purgetss/config.cjs` (auto-generated)
```js
theme: {
  extend: {
    colors: {
      surface:          'surfaceColor',
      'surface-high':   'surfaceHighColor',
      text:             'textColor',
      'text-secondary': 'textSecondaryColor',
      border:           'borderColor',
      accent:           'accentColor',
      overlay:          'overlayColor'
    }
  }
}
```

After the batch above you can use `bg-surface`, `bg-surface-high`, `text-text`, `bg-accent`, `bg-overlay`, etc. immediately. If your design system uses different class names (for example `on-surface` instead of `text`, or the nested `surface: { DEFAULT, high }` form from earlier in this page), edit `config.cjs` after running the commands.

> **INFO**
>
> Smart in-place updates
>
> If a `--single` name matches an existing palette shade — for example `pt semantic --single '#000' amazon500` while the `amazon` palette exists — the entry is updated in place in the JSON (preserving its position) and `config.cjs` is left untouched. The palette already maps to that key, so the operation is interpreted as "edit one shade", not "create a duplicate top-level color".

### Alpha details

Alpha follows the Titanium spec exactly: range `0.0-100.0`, stored as a **string**, wrapped per-mode as `{ color, alpha }`. Without `--alpha`, values stay as bare hex strings. Out-of-range values are rejected before any file is written.

## Using semantic classes in Alloy views

Once the JSON and the `config.cjs` mapping are in place, you use the semantic classes like any other PurgeTSS utility:

```xml
<Window class="bg-surface" title="Settings">
  <ScrollView class="vertical content-w-screen content-h-auto">
    <Label class="text-on-surface font-bold" text="Title" />
    <Label class="text-on-surface-variant text-sm" text="Subtitle" />
    <View class="h-px w-screen bg-border" />
  </ScrollView>
</Window>
```

Classic has no utility mapping. Use the native semantic key directly:

```javascript
const window = Ti.UI.createWindow({
  backgroundColor: 'surfaceColor'
})
```

When the appearance changes — whether from `Appearance.set(...)` or a system-level toggle — Titanium resolves each semantic color name to its `light` or `dark` value automatically. No event listeners, no manual repaint.

### Opacity modifier auto-derivation

As of PurgeTSS v7.9.0, you can apply the `/N` opacity modifier to **any class that resolves to a semantic name** in `semantic.colors.json`, and PurgeTSS will derive a new semantic key with that alpha pre-applied for both `light` and `dark` modes. This works for `bg-*`, `text-*`, `border-*`, and any other color-accepting utility whose class is mapped through `theme.extend.colors` in `config.cjs`.

```xml
<View class="bg-surface/65" />
<Label class="text-on-surface/80" text="Subtle" />
<View class="border border-accent/40" />
```

On the next `purgetss build` (or plain `purgetss`) run, the toolchain executes a three-step flow:

1. **Detects the mapping** — PurgeTSS sees that, for example, `bg-surface` is mapped to the semantic name `surfaceColor` via `config.cjs`.
2. **Derives a new key** — it adds `surfaceColor_65` (naming convention: `<originalKey>_<alphaPercent>`, underscore + integer percent) to `semantic.colors.json`, copying the original hex values for both modes and tagging each with `alpha: "65"`:

   ```json
   "surfaceColor_65": {
     "light": { "color": "#F9FAFB", "alpha": "65" },
     "dark":  { "color": "#0f172a", "alpha": "65" }
   }
   ```

3. **Emits the rule against the derived key** — for example, `'.bg-surface/65': { backgroundColor: 'surfaceColor_65' }`. Light/Dark switching keeps working because Titanium handles the lookup like any other semantic color. The same flow runs for opacity inside an `apply:` string in `config.cjs`.

#### Idempotency and the `Conflict` error

Re-runs are idempotent: existing derived keys are reused, never duplicated. If you manually edit a derived key with values that disagree with what PurgeTSS would generate (different base color, different alpha, different shape), the next build halts with a `Conflict` error instead of silently overwriting your edits — you have to either revert the manual change or remove the derived key so it can be regenerated cleanly.

> **DANGER**
>
> **Native rebuild required for new alpha entries**
>
> `semantic.colors.json` is read at **native build time**, not at runtime. The first time a brand-new opacity variant is auto-derived (a class like `bg-surface/65` you've never used before), the running app **will not see it** until the next full Titanium build. Liveview hot-reload alone does **not** refresh `semantic.colors.json` for the running app — only the native binary does.
>
> In practice: after introducing a new opacity class, run `purgetss build` once, then start a fresh native build (`appc run` / `ti build`) before resuming your usual Liveview cycle. Subsequent runs of the *same* `/N` value reuse the existing derived key and need no extra rebuild.

#### Constraints

- **Alpha range**: integer `0–100`, matching the standard opacity modifier syntax. Values outside this range are rejected.
- **Base key must exist**: the semantic name behind the class (`surfaceColor` in the example) must already exist in `semantic.colors.json`. If it doesn't, PurgeTSS emits a warning for direct XML usage or throws an Error for `apply:` directives, with three concrete suggestions in the message.
- **Naming is fixed**: the derived key is always `<originalKey>_<alphaPercent>` — underscore + integer percent. This mirrors the `/65` you typed and stays quote-free in `config.cjs` if you ever need to reference it manually.

## Using semantic colors in controllers

Semantic colors also work from JavaScript. Three patterns cover the cases you'll hit.

### Option 1 — Direct assignment by semantic name

Titanium resolves the semantic name at runtime, so you can assign it straight to any color-accepting property. This skips PurgeTSS entirely and is the shortest path when you only need one or two changes:

```js
$.titleLabel.color           = 'textColor'
$.card.backgroundColor       = 'surfaceHighColor'
$.divider.backgroundColor    = 'borderColor'
```

### Option 2 — `$.UI.create()` with PurgeTSS classes

When you build a component dynamically and want the full set of utilities (colors included), use `$.UI.create()`:

```js
const card = $.UI.create('View', {
  classes: ['bg-surface-high', 'rounded-lg', 'mx-4', 'my-2']
})

const title = $.UI.create('Label', {
  text:    'Settings',
  classes: ['text-on-surface', 'font-bold', 'text-lg']
})

card.add(title)
```

### Option 3 — `Alloy.createStyle()` + `applyProperties()`

To swap styles on an **existing** component — reacting to a state change, for example — build the style and apply it:

```js
const setActive = (isActive) => {
  const style = Alloy.createStyle('index', {
    apiName: 'Ti.UI.Label',
    classes: isActive
      ? ['text-accent', 'font-bold']
      : ['text-on-surface-variant', 'font-normal']
  })

  $.statusLabel.applyProperties(style)
}
```

> **INFO**
>
> When to use which
>
> - **Option 1** — single property change, no other utilities needed.
> - **Option 2** — creating new components from scratch.
> - **Option 3** — restyling components that already exist in the view.

## Recommended starter palette

A minimal semantic palette that covers most app surfaces:

| Purpose            | Semantic name        | Light     | Dark      | Classes generated          |
| ------------------ | -------------------- | --------- | --------- | -------------------------- |
| Background         | `surfaceColor`       | `#F9FAFB` | `#0f172a` | `bg-surface`               |
| Cards / elevated   | `surfaceHighColor`   | `#FFFFFF` | `#1e293b` | `bg-surface-high`          |
| Primary text       | `textColor`          | `#111827` | `#f1f5f9` | `text-on-surface`          |
| Secondary text     | `textSecondaryColor` | `#6B7280` | `#94a3b8` | `text-on-surface-variant`  |
| Muted text         | `textMutedColor`     | `#9CA3AF` | `#64748b` | `text-muted`               |
| Borders / dividers | `borderColor`        | `#E5E7EB` | `#334155` | `bg-border`                |
| Accent             | `accentColor`        | `#3B82F6` | `#60a5fa` | `text-accent`, `bg-accent` |

Start with these 6-7 colors and add more only when the design requires it. Fewer semantic colors means easier maintenance.

## Related

- [appearance-module.md](./appearance-module.md) — `Appearance.init()`, `set(...)`, `get()`, `toggle()` — the runtime that switches the whole palette.
- [cli-commands.md#semantic-command](./cli-commands.md#semantic-command) — full reference for `purgetss semantic` (palette and single modes, all flags).
- [customization-deep-dive.md](./customization-deep-dive.md) — full `config.cjs` structure, including `theme.extend` vs `theme.colors` and the rest of the extendable keys.

## Community-Discovered Patterns

- **The `[object Object]` crash is always a missing `DEFAULT`.** Any time a view renders with a mysterious fallback color and the class was something like `bg-surface`, check `config.cjs` first: if `surface` is a nested object without a `DEFAULT` key, PurgeTSS serializes the whole object and emits `[object Object]` as the color value. The fix is either to add `DEFAULT: 'surfaceColor'` inside the nested object or flatten the structure.
- **Semantic resolution is Titanium-native, not PurgeTSS.** This matters when debugging: if a semantic name doesn't resolve, the problem is usually the `semantic.colors.json` file (wrong filename, wrong key, malformed JSON, or wrong location — Alloy expects `app/assets/`, Classic expects `Resources/`). PurgeTSS generates the file in both layouts and an additional utility mapping only in Alloy.
- **Re-running `purgetss semantic` on the same family is safe.** The CLI strips prior keys for that family from both the JSON and `config.cjs` before writing, so switching between palette and single forms — or changing the base hex — does not leave orphans. Other palettes and manually-defined entries are untouched.
