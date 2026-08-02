# The `apply` Directive

<!-- TOC-START -->
## Contents

- [Create Complex Classes and IDs](#create-complex-classes-and-ids)
- [Set Any ID, Class, or Ti Element](#set-any-id-class-or-ti-element)
- [Use Default Classes](#use-default-classes)
- [Use Icon Font Classes (v7.10.0)](#use-icon-font-classes-v7100)
- [Use Arbitrary Values](#use-arbitrary-values)
- [Use Newly Defined Classes in `config.cjs`](#use-newly-defined-classes-in-configcjs)
- [Set a String of Classes or an Array of Classes](#set-a-string-of-classes-or-an-array-of-classes)
- [Combine with Platform, Device, or Conditional Blocks](#combine-with-platform-device-or-conditional-blocks)
- [Customizing Window, View, and ImageView](#customizing-window-view-and-imageview)
- [Platform-Specific Classes](#platform-specific-classes)
- [Community-Discovered Patterns](#community-discovered-patterns)

<!-- TOC-END -->

## Create Complex Classes and IDs

> **INFO**
> Use `apply` to bundle classes into a new class, or to extract a repeated pattern into a reusable class.

- Set any ID, class, or Ti Element.
- Use any of the default classes.
- Use arbitrary values.
- Use any newly defined class in `config.cjs`.
- Set a string of classes or an array of classes.
- Combine it with any platform, device, or conditional-block properties.

## Set Any ID, Class, or Ti Element

`./purgetss/config.cjs`
```javascript
theme: {
  extend: {},
  Label: {
    apply: 'text-base font-bold text-gray-700'
  },
  fontWeight: {
    bold: 'bold'
  },
  fontFamily: {
    'saira-condensed': 'SairaCondensed-Regular'
  },
  '#carrousel': {
    apply: 'w-screen h-auto bg-teal-200 mx-2 my-4 horizontal'
  },
  '.my-custom-class': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  }
}
```

`./purgetss/styles/utilities.tss`
```tss
'Label': { color: '#374151', textColor: '#374151', font: { fontSize: 16, fontWeight: 'bold' } }

/* Custom Classes */
'#carrousel': { backgroundColor: '#99f6e4', height: Ti.UI.SIZE, layout: 'horizontal', right: 8, left: 8, top: 16, bottom: 16, width: Ti.UI.FILL }
'.my-custom-class': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontFamily: 'SairaCondensed-Regular', fontWeight: 'bold' } }
'.font-saira-condensed': { font: { fontFamily: 'SairaCondensed-Regular' } }
'.font-bold': { font: { fontWeight: 'bold' } }
```

## Use Default Classes

`./purgetss/config.cjs`
```javascript
theme: {
  '.btn': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  },
  '.btn-primary': {
    apply: 'bg-green-500 text-green-100 border-green-200'
  }
}
```

`./purgetss/styles/utilities.tss`
```tss
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontFamily: 'SairaCondensed-Regular', fontWeight: 'bold' } }
'.btn-primary': { backgroundColor: '#22c55e', borderColor: '#bbf7d0', color: '#dcfce7', textColor: '#dcfce7' }
```

## Use Icon Font Classes (v7.10.0)

Since v7.10.0, icon fonts bundled with PurgeTSS — FontAwesome (`fas`, `fab`, `fa-*`), Material Icons (`mi-*`), Material Symbols (`ms-*`), and Framework7 (`f7-*`) — can be referenced inside `apply` **without running `build-fonts` first**. The directive resolves these classes against the bundled `dist/*.tss` files, so the font family and the glyph are merged into the generated rule alongside the rest of the utilities.

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    '.close-button': {
      apply: 'fas fa-times-circle wh-12 text-gray-700'
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
'.close-button': { color: '#374151', textColor: '#374151', width: 48, height: 48, font: { fontFamily: 'FontAwesome7Free-Solid' }, text: '\uf057', title: '\uf057' }
```

The same lookup runs for `mi-*`, `ms-*`, and `f7-*` classes. If the project ships its own `purgetss/styles/fontawesome.tss` (for example, FontAwesome Pro or Beta), that file takes precedence over the bundled default — matching the precedence order used when the same icon class appears directly in XML.

> **PRE-v7.10.0 BEHAVIOR**
> Before v7.10.0, those icon font classes were silently dropped from `apply`-generated rules. `apply: 'fas fa-times-circle wh-12 ...'` produced every utility **except** the FontAwesome family and the icon glyph. If a project worked around this by running `build-fonts` first, that workaround is no longer required.

## Use Arbitrary Values

You can use [Arbitrary Values](./arbitrary-values.md) to define your custom classes.

`./purgetss/config.cjs`
```javascript
theme: {
  extend: {},
  '.progress': {
    apply: 'h-(1rem) horizontal bg-(#e9ecef) text-(.75rem) rounded-(.25rem)'
  }
}
```

`./purgetss/styles/utilities.tss`
```tss
/* Custom Classes */
'.progress': { backgroundColor: '#e9ecef', borderRadius: 4, height: 16, layout: 'horizontal', font: { fontSize: 12 } }
```

## Use Newly Defined Classes in `config.cjs`

In the following example, we are creating `corporate` color classes so we can use them in the `apply` directive with `bg-corporate-500`, `text-corporate-100`, and `border-corporate-200`.

`./purgetss/config.cjs`
```javascript
theme: {
  extend: {
    colors: {
      // New color values that will generate bg-colors, text-colors, border-colors classes.
      corporate: {
        100: '#dddfe1', 200: '#babfc4', 500: '#53606b'
      }
    }
  },
  '.btn': {
    apply: 'wh-auto font-bold border-2 rounded my-0.5'
  },
  '.btn-corporate': {
    // Newly created classes (see extend.colors.corporate)
    apply: 'bg-corporate-500 text-corporate-100 border-corporate-200'
  }
}
```

`./purgetss/styles/utilities.tss`
```tss
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
/* ... */
/* color Property */
'.text-corporate-100': { color: '#dddfe1', textColor: '#dddfe1' }
'.text-corporate-200': { color: '#babfc4', textColor: '#babfc4' }
'.text-corporate-500': { color: '#53606b', textColor: '#53606b' }
/* backgroundColor Property */
'.bg-corporate-100': { backgroundColor: '#dddfe1' }
'.bg-corporate-200': { backgroundColor: '#babfc4' }
'.bg-corporate-500': { backgroundColor: '#53606b' }
/* borderColor Property */
'.border-corporate-100': { borderColor: '#dddfe1' }
'.border-corporate-200': { borderColor: '#babfc4' }
'.border-corporate-500': { borderColor: '#53606b' }
```

## Set a String of Classes or an Array of Classes

`./purgetss/config.cjs`
```javascript
theme: {
  extend: {
    colors: {
      corporate: {
        100: '#dddfe1', 200: '#babfc4', 500: '#53606b'
      }
    }
  },
  // Use a string of classes
  '.btn': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5'
  },
  // or an array of classes
  '.btn-corporate': {
    apply: [
      'bg-corporate-500',
      'text-corporate-100',
      'border-corporate-200'
    ]
  }
}
```

`./purgetss/styles/utilities.tss`
```tss
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
```

## Combine with Platform, Device, or Conditional Blocks

`./purgetss/config.cjs`
```javascript
theme: {
  '.btn': {
    // Default .btn
    apply: 'font-bold border-2 rounded wh-auto my-0.5',

    // Specific to iOS devices
    ios: {
      apply: 'w-screen mx-4'
    },

    // Specific to handheld devices
    handheld: {
      apply: 'h-20'
    },

    // Specific to iPhoneX (if Alloy.Globals.iPhoneX is set)
    '[if=Alloy.Globals.iPhoneX]': {
      apply: 'mb-12'
    }
  }
}
```

`./purgetss/styles/utilities.tss`
```tss
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn[platform=ios]': { right: 16, left: 16, width: Ti.UI.FILL }
'.btn[formFactor=handheld]': { height: 80 }
'.btn[if=Alloy.Globals.iPhoneX]': { bottom: 48 }
```

## Customizing Window, View, and ImageView

`Window`, `View`, and `ImageView` have built-in defaults (white Window background, `Ti.UI.SIZE` on View, `hires: true` on ImageView for iOS). To change those defaults globally, put the customization under `theme.extend` — the same place you would extend `colors` or `spacing`:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    extend: {
      Window: {
        apply: 'exit-on-close-false bg-blue-500'
      }
    }
  }
};
```

Now every `<Window>` in the project picks up `backgroundColor: '#3b82f6'` and `exitOnClose: false`.

The same pattern works for `View` and `ImageView`. For example, to make all `ImageView` elements use `hires: true` on iOS (which PurgeTSS already does by default on iOS), or to set a different default for `View`:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    extend: {
      ImageView: {
        ios: {
          apply: 'hires-true'
        }
      },
      View: {
        apply: 'wh-auto'
      }
    }
  }
};
```

### Shorthand: no `default:` wrapper needed

The examples above use `{ apply: '...' }` directly. Internally that gets normalized to `{ default: { apply: '...' } }`, so both forms produce the same TSS:

```javascript
// Both of these work
Window: { apply: 'exit-on-close-false bg-blue-500' }
Window: { default: { apply: 'exit-on-close-false bg-blue-500' } }
```

Use the explicit `default:` wrapper when you also need platform blocks (`ios:`, `android:`) next to it. For the common case of one bundle of defaults, the shorthand reads better.

### Extend mode vs replace mode

> **HEADLINE CHANGE — v7.9.0**
> This is the headline change of PurgeTSS v7.9.0. Before v7.9.0, `theme.Window` / `theme.View` / `theme.ImageView` still had the framework defaults merged in, which caused gradient ghosting and other surprising overrides. v7.9.0 makes top-level (non-`extend`) configs behave as true replace mode.
>
> If you previously used `theme.Window` (no `extend`) and depended on the white background or the iOS `hires: true` / `Ti.UI.SIZE` defaults still being there, you will need to either move that config under `theme.extend.Window` (extend mode) or add the previously-implicit utilities back into your `apply` string.

The three Ti Elements that ship with framework defaults — `Window`, `View`, and `ImageView` — support two declaration modes depending on where they are placed in `config.cjs`:

- **Extend mode** — `theme.extend.Window`, `theme.extend.View`, `theme.extend.ImageView`. Your customization **merges** with the framework defaults. The white Window `backgroundColor`, `Ti.UI.SIZE` width/height on `View`, and iOS `hires: true` on `ImageView` stay in place unless you override them with `apply`. Use this when you want to add to the defaults, not replace them.
- **Replace mode** — `theme.Window`, `theme.View`, `theme.ImageView` (top level, no `extend`). Your config **replaces** the framework defaults entirely. The white Window background is omitted, the `Ti.UI.SIZE` width/height on `View` is omitted, and the iOS `hires: true` on `ImageView` is omitted. Your `apply` becomes the source of truth for that Ti Element.

Use replace mode when you want full control and do not want a preset mixed in. The canonical case is a Window declared at `theme.Window` with a `backgroundGradient`, where the previously-merged white `backgroundColor` would render on top of the gradient and produce a "ghost" white wash.

`./purgetss/config.cjs - replace mode (v7.9.0+)`
```javascript
module.exports = {
  theme: {
    Window: {
      apply: 'bg-gradient-to-b from-blue-500 to-purple-600'
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
'Window': { backgroundGradient: { type: 'linear', colors: [...], startPoint: ..., endPoint: ... } }
```

Note the missing `backgroundColor: '#FFFFFF'`. Replace mode skipped the framework default, so the gradient renders cleanly. Before v7.9.0 the same config produced:

```tss
/* Pre-v7.9.0 — ghost white background covering the gradient */
'Window': { backgroundColor: '#FFFFFF', backgroundGradient: { type: 'linear', colors: [...] } }
```

If you wanted the framework white background **and** something else on top, that is what extend mode is for:

`./purgetss/config.cjs - extend mode`
```javascript
module.exports = {
  theme: {
    extend: {
      Window: {
        apply: 'exit-on-close-false'
      }
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
/* Framework default backgroundColor is preserved, exitOnClose merged in */
'Window': { backgroundColor: '#FFFFFF', exitOnClose: false }
```

The same extend-vs-replace distinction applies to `View` (`Ti.UI.SIZE` width/height defaults) and `ImageView` (iOS `hires: true` default).

### Apply Wins Over Static Defaults

If `apply` sets a property that the component already has as a built-in default, the applied value replaces the original instead of both ending up in the final TSS:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    extend: {
      Window: { apply: 'bg-blue-500' }
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
/* Before dedup: { backgroundColor: '#FFFFFF', backgroundColor: '#3b82f6' } */
/* After dedup:                                                           */
'Window': { backgroundColor: '#3b82f6' }
```

Without the dedup, both `backgroundColor` entries would land in the file; the last one would win at runtime anyway, but reading the TSS with two copies of the same property is confusing. The builder keeps only the applied value.

## Platform-Specific Classes

Several classes in `utilities.tss` are platform-specific (e.g., `clip-enabled`, `status-bar-style-light-content`). These only exist with a `[platform=ios]` or `[platform=android]` suffix.

When you use these classes inside a platform block (`ios:` or `android:`), PurgeTSS automatically finds the platform-specific version -- no prefix needed:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    '.my-view': {
      ios: {
        apply: 'bg-green-500 wh-32 clip-enabled'
      }
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
/* Custom Classes */
'.my-view[platform=ios]': { backgroundColor: '#22c55e', clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED, width: 128, height: 128 }
```

The `ios:` / `android:` prefix still works from a non-platform block (e.g., `default`), but use it with caution:

> **WARNING -- Cross-Platform Apps**
> Using `ios:` or `android:` in a `default` block applies the property on **all platforms**. Some iOS-only or Android-only properties can cause errors on the other platform at compile time or when the view opens. For cross-platform apps, always use platform blocks instead.

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    // For single-platform apps, the prefix works from default:
    '.my-view': {
      apply: 'wh-32 bg-green-500 ios:clip-enabled'
    },

    // For cross-platform apps, use platform blocks instead:
    '.my-view': {
      apply: 'wh-32 bg-green-500',
      ios: {
        apply: 'clip-enabled'
      }
    }
  }
};
```

### Classes Outside Platform Blocks

If a platform-specific class is used outside a platform block (without the `ios:` or `android:` prefix), PurgeTSS will not find it because it only exists with the platform suffix in `utilities.tss`:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    '.my-view': {
      // clip-enabled only exists as '.clip-enabled[platform=ios]' in utilities.tss
      // Without a platform block or ios: prefix, it will not be found
      apply: 'wh-32 clip-enabled bg-green-500'
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
/* clip-enabled was not resolved because no platform context was available */
'.my-view': { backgroundColor: '#22c55e', width: 128, height: 128 }
```

## Community-Discovered Patterns

### Titanium Fill Rule

When composing layout utilities inside `apply`, prefer `w-screen` for fill behavior. `w-full` maps to `100%`, not `Ti.UI.FILL`. In Titanium, `Ti.UI.FILL` is the layout primitive that makes a view fill its parent; a literal `100%` can behave unexpectedly inside nested containers.

### Platform-Specific Constants in `apply`

Constants like `Ti.UI.iOS.CLIP_MODE_ENABLED` or `Ti.UI.iOS.StatusBar.LIGHT_CONTENT` only exist on the platform that defines them. PurgeTSS utility classes such as `clip-enabled` or `status-bar-style-light-content` therefore only exist with a `[platform=ios]` or `[platform=android]` suffix in `utilities.tss`. When you reference them from `apply`, put them inside the correct platform block (`ios:` / `android:`) so PurgeTSS resolves them — otherwise the class silently drops on the wrong platform and can throw a runtime error if it reaches it. See the "Platform-Specific Classes" section above for the resolution rules.

### Global Window defaults for Large Titles + ScrollView (iOS)

**See the dedicated reference: [`ios-large-titles.md`](./ios-large-titles.md)** — it covers the full pattern (three-property pairing, global-defaults recipe, TabGroup implicit NavigationWindow behavior, detail-window opt-out, and the ScrollView `content-w-screen` / `content-h-auto` pairing).

Minimal recap — when Large Titles are in use, set the base iOS Window defaults once via `apply` in `config.cjs` rather than repeating them in every XML view:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    Window: {
      ios: {
        apply: 'auto-adjust-scroll-view-insets extend-edges-all large-title-enabled'
      }
    }
  }
};
```

The `ios:` block (not an inline `ios:` prefix) is required because these classes only exist with a `[platform=ios]` suffix — see "Platform-Specific Classes" above. The *why* (rendering delay vs content-behind-nav-bar), the display-mode constants, and per-window overrides live in [`ios-large-titles.md`](./ios-large-titles.md) and in the official PurgeTSS docs at [Best Practices → Large Titles on iOS](https://purgetss.com/docs/best-practices/3-large-titles-on-ios).
