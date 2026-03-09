# Platform and Device Modifiers

Platform and device modifiers let you specify different styles depending on the platform and device your app runs on.

- Platform modifiers:
  - `ios:`
  - `android:`
- Device modifiers:
  - `tablet:`
  - `handheld:`

You can combine them with arbitrary values. Examples: `ios:bg-(#53606b)`, `ios:text-(20px)`, `android:bg-(#8fb63e)`, and `android:text-(24px)`.

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

:::warning Platform-Specific Properties
If a style relies on `Ti.UI.iOS.*` or `Ti.UI.Android.*` constants, scope it with the matching `ios:` or `android:` modifier, or with the equivalent platform block in `config.cjs`.
:::
