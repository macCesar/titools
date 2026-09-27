# Platform and Device Modifiers

Platform and device modifiers (also called variants or prefixes) apply styles conditionally based on platform (iOS or Android) and device type (tablet or handheld):

- Platform modifiers:
  - `ios:`
  - `android:`
- Device modifiers:
  - `tablet:`
  - `handheld:`

You can set different background colors and font sizes per platform and device, and combine them with arbitrary values. Examples: `ios:bg-(#53606b)`, `ios:text-(20)`, `android:bg-(#8fb63e)`, and `android:text-(24)`.

```xml
<Alloy>
  <Window class="tablet:bg-green-500 handheld:bg-blue-500">
    <View class="h-32 tablet:bg-green-100 handheld:bg-blue-100">
      <Label class="w-screen h-auto text-center ios:text-blue-800 ios:text-xl android:text-green-800 android:text-2xl">This is a Test</Label>
    </View>
  </Window>
</Alloy>
```

```tss
/* Ti Elements */
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.h-32': { height: 128 }
'.h-auto': { height: Ti.UI.SIZE }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.w-screen': { width: Ti.UI.FILL }

/* Platform and Device Modifiers */
'.android:text-2xl[platform=android]': { font: { fontSize: 24 } }
'.android:text-green-800[platform=android]': { color: '#166534', textColor: '#166534' }
'.handheld:bg-blue-100[formFactor=handheld]': { backgroundColor: '#dbeafe' }
'.handheld:bg-blue-500[formFactor=handheld]': { backgroundColor: '#3b82f6' }
'.ios:text-blue-800[platform=ios]': { color: '#1e40af', textColor: '#1e40af' }
'.ios:text-xl[platform=ios]': { font: { fontSize: 20 } }
'.tablet:bg-green-100[formFactor=tablet]': { backgroundColor: '#dcfce7' }
'.tablet:bg-green-500[formFactor=tablet]': { backgroundColor: '#22c55e' }
```

## Combining a platform and a device

Since v7.18.0, stack one platform modifier and one device modifier, in either order. Both conditions go in a single bracket, because Alloy's styler keeps only the last `[...]` of a selector.

```xml
<View class="ios:tablet:bg-red-500 tablet:ios:mt-4" />
```

```tss
'.ios:tablet:bg-red-500[platform=ios formFactor=tablet]': { backgroundColor: '#ef4444' }
'.tablet:ios:mt-4[formFactor=tablet platform=ios]': { top: 16 }
```

A platform modifier that contradicts a platform-scoped class generates nothing and leaves a comment in `app.tss`:

```tss
// Conflicting modifiers, class not generated: '.android:status-bar-dark' (platform is already ios)
```

Before v7.18.0, a stacked class was not generated, and `tablet:` on an iOS-only class produced `[platform=ios][formFactor=tablet]`, which Alloy read as tablet-only on both platforms.

## Community-Discovered Patterns

The following guidance comes from community experience combining platform modifiers with platform-specific Titanium constants.

> **Platform-Specific Properties**
> If a style relies on `Ti.UI.iOS.*` or `Ti.UI.Android.*` constants, scope it with the matching `ios:` or `android:` modifier, or with the equivalent platform block in `config.cjs`. Built-in classes that use those constants already ship scoped in `utilities.tss` (for example `'.clip-enabled[platform=ios]'` and `'.large-title-display-mode-never[platform=ios]'`), so this matters most for custom rules and arbitrary values.
