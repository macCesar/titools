# The `apply` Directive

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

> **Titanium Fill Rule**
> When composing layout utilities inside `apply`, prefer `w-screen` for fill behavior. `w-full` maps to `100%`, not `Ti.UI.FILL`.

## Community-Discovered Patterns

### Global Window defaults for Large Titles + ScrollView (iOS)

When using `largeTitleEnabled` with a ScrollView inside NavigationWindow or TabGroup, three Window properties must work together: `auto-adjust-scroll-view-insets`, `extend-edges-all`, and `large-title-enabled`. Without all three, the ScrollView content overlaps behind the navigation bar — or the large title renders with a visible delay.

Instead of repeating these classes on every Window XML, use `apply` in `config.cjs` to set the base properties as global defaults:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    Window: {
      ios: {
        apply: 'auto-adjust-scroll-view-insets extend-edges-all status-bar-style-light-content'
      }
    }
  }
};
```

`./purgetss/styles/utilities.tss`
```tss
'Window[platform=ios]': { autoAdjustScrollViewInsets: true, extendEdges: [ Ti.UI.EXTEND_EDGE_ALL ], statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT }
```

Then in each view XML, only add `largeTitleEnabled` and `largeTitleDisplayMode` as needed:

```xml
<Window title="Home" class="large-title-enabled">
  <ScrollView class="vertical w-screen" contentHeight="Ti.UI.SIZE">
    <!-- Content starts below the nav bar automatically -->
  </ScrollView>
</Window>
```

This works for both NavigationWindow and TabGroup — on iOS, TabGroup wraps each Tab in an implicit NavigationWindow.

| Class | Property | Value |
|---|---|---|
| `auto-adjust-scroll-view-insets` | `autoAdjustScrollViewInsets` | `true` |
| `extend-edges-all` | `extendEdges` | `[ Ti.UI.EXTEND_EDGE_ALL ]` |
| `large-title-enabled` | `largeTitleEnabled` | `true` |
| `large-title-display-mode` | `largeTitleDisplayMode` | Uses `LARGE_TITLE_DISPLAY_MODE_*` constants |

> **Why `ios:` block instead of inline `ios:` prefix?** The three classes (`auto-adjust-scroll-view-insets`, `extend-edges-all`, `status-bar-style-light-content`) are platform-specific — they only exist with `[platform=ios]` suffix in `utilities.tss`. Using the `ios:` block in `config.cjs` ensures PurgeTSS resolves them correctly. See "Platform-Specific Classes" above.
