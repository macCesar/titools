# Custom Rules

Custom rules in PurgeTSS let you style Titanium elements, IDs, and classes from `config.cjs`. They are the bridge between the utility-first classes you write in XML and the platform-, device-, or condition-specific overrides Titanium projects often need. Because everything lives in a single `config.cjs`, projects that span iOS and Android can keep one source of truth for styling instead of fragmenting rules across multiple `.tss` files.

This file mirrors the official rewrite — section names, examples, and ordering match the upstream docs so cross-referencing stays cheap.

## Classes, IDs, and Ti Elements

Whether you want to style a Ti Element (a markup element such as `Label`), a custom ID prefixed with `#`, or a custom class prefixed with `.`, the structure inside `config.cjs` is the same. You always declare a key (the selector) whose value is an object containing one or more block keys (`DEFAULT`, `ios`, `android`, `tablet`, `handheld`, or `[if=...]`).

### Modifier Key

- For Titanium elements, use the **exact name** of the element, such as `Label`, `Button`, or `ScrollView`. The casing must match Titanium's API (e.g. `TextField`, not `textfield` or `Text Field`).
- For IDs, use `camelCase` to match Alloy's JavaScript convention (e.g. `mainBanner` referenced in XML as `id="mainBanner"`). The selector key inside `config.cjs` includes the `#` prefix.
- For classes, use `kebab-case` to stay compatible with PurgeTSS v6.x and above. Use `.my-custom-class-name`, not `.myCustomClassName`. The kebab-case requirement is what most legacy projects trip over when they upgrade.

> **CAUTION — Migrating from PurgeTSS v4 or v5 to v7+**
>
> If your project started on PurgeTSS v5 or earlier and you are now on 7.x.x or later, the class-naming convention changed (`camelCase` -> `kebab-case`) and the config moved to ESM-style `config.cjs`. The recommended upgrade path is:
>
> 1. **Audit current usage.** Set `purge.options.missing` to `true` in `config.cjs`. PurgeTSS will append a list of missing classes at the end of `app.tss` after the next compile — every entry is a class name you still need to migrate.
> 2. **Rename selectors.** Convert every `.myCustomClassName` to `.my-custom-class-name` in both XML markup and `config.cjs`. The old camelCase names will not match anymore.
> 3. **Convert config to `.cjs`.** If your project still uses `purgetss.config.js` or a CommonJS-style file with the old layout, rename the file to `config.cjs` and ensure it sits in `./purgetss/`. The single export must be `module.exports = { theme: { ... } }`.
> 4. **Re-run `purgetss build`.** Verify the missing-classes list at the end of `app.tss` is empty before turning `missing` back off.
>
> Skipping any of these steps tends to surface as silently dropped styles at runtime — the app compiles, but selectors no longer match.

### Default, Platform, Device, or Conditional Blocks

Inside any selector you can declare one or more of the following block keys. They translate to TSS query suffixes at compile time:

- **Global style**: use either the lowercase `default` or the uppercase `DEFAULT` keyword. This becomes the bare selector with no platform/device qualifier.
- **Specific platform**: use `ios` or `android`. These compile to `[platform=ios]` and `[platform=android]` query suffixes.
- **Specific device**: use `tablet` or `handheld`. These compile to `[formFactor=tablet]` and `[formFactor=handheld]`.
- **Conditional via global variable**: use `[if=globalVariableName]`. The exact key is preserved in the generated TSS, so you can reference any `Alloy.Globals.*` boolean.

### Property Values

The way you write property values determines how PurgeTSS emits them in the generated TSS. Pay particular attention to quoting — it is the single most common source of confusion.

- For `Titanium` constants, `Alloy` configuration values, or global variables, **always enclose them in quotes** in `config.cjs` (e.g. `'Ti.UI.SIZE'`, `'Alloy.CFG.iPhoneXNotchSize'`). The quotes are stripped in the generated TSS so the constant resolves at runtime — without them, JavaScript would try to evaluate the constant inside `config.cjs`, which fails because Titanium's globals are not available there.
- For `color` values, you can use `hex`, `8-digit hex` (with alpha), `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent`, or any standard color name. Prefer hex values when you plan to use opacity modifiers — `rgba()` and named colors interact awkwardly with opacity utilities.
- For `spacing` values you can mix unit types. Each unit follows a specific conversion rule:
  - `%`, `px`, `cm`, and `in` are passed through to TSS without conversion.
  - `em` and `rem` values are converted with the formula `value * 16` (so `1rem` becomes `16`).
  - `dp` removes the unit and keeps the numeric value as-is, since Titanium treats unit-less numeric values as density-independent pixels by default.

## `config.cjs` File Example

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    '#main-banner': {
      DEFAULT: {
        width: '300px',
        height: '80px'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED'
      }
    },
    '.gallery': {
      DEFAULT: {
        height: 'Ti.UI.SIZE'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      android: {
        hiddenBehavior: 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      },
      handheld: {
        width: '250px'
      },
      tablet: {
        width: '500px'
      }
    },
    TextField: {
      DEFAULT: {
        top: 10,
        left: 20,
        right: 20,
        bottom: 0
      },
      '[if=Alloy.Globals.iPhoneX]': {
        bottom: 'Alloy.CFG.iPhoneXNotchSize'
      },
      android: {
        touchFeedback: true
      }
    }
  }
};
```

## Custom `./purgetss/styles/utilities.tss` File

PurgeTSS reads `config.cjs` and emits a single `utilities.tss` file that Alloy then merges with the rest of the project's styling. The file below shows what the example above generates — note how block keys translate into TSS query suffixes (`[platform=android]`, `[formFactor=tablet]`, `[if=...]`).

```tss
/* Property: TextField */
/* Description: A single line text field. */
'TextField': { top: 10, left: 20, right: 20, bottom: 0 }
'TextField[if=Alloy.Globals.iPhoneX]': { bottom: Alloy.CFG.iPhoneXNotchSize }
'TextField[platform=android]': { touchFeedback: true }

/* Custom Classes */
'#main-banner': { width: '300px', height: '80px' }
'#main-banner[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }

'.gallery': { height: Ti.UI.SIZE }
'.gallery[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.gallery[platform=android]': { hiddenBehavior: Ti.UI.HIDDEN_BEHAVIOR_GONE }
'.gallery[formFactor=handheld]': { width: '250px' }
'.gallery[formFactor=tablet]': { width: '500px' }
```

## Community-Discovered Patterns

The following guidance comes from community experience using PurgeTSS custom rules in real projects. It is not part of the official reference but addresses common pitfalls.

> **Platform-Specific Constants**
> If a rule uses `Ti.UI.iOS.*` or `Ti.UI.Android.*` constants, keep that property inside the matching `ios` or `android` block to avoid cross-platform compilation failures.
