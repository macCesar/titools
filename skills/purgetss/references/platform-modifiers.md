# Platform and Device Modifiers

Platform and Device modifiers (also called variants or prefixes) allow you to specify different styles for an element depending on the platform (iOS or Android) and device (tablet or handheld) that the app is running on.

## Available Modifiers

### Platform Modifiers

Target specific OS engines directly in the XML:

- **`ios:`** - Applies only to Apple devices (iPhone, iPad)
- **`android:`** - Applies only to Android devices

```xml
<View class="mt-4 ios:mt-10 android:mt-5" />
<Label class="ios:text-blue-600 android:text-gray-600" />
```

### Device (Form Factor) Modifiers

Target device categories based on screen size:

- **`tablet:`** - iPads and Android Tablets
- **`handheld:`** - Phones (iPhone and Android phones)

```xml
<View class="w-screen tablet:w-1/2 handheld:w-full" />
```

## Usage in XML

### Basic Platform Targeting

```xml
<Alloy>
  <Window class="tablet:bg-green-500 handheld:bg-blue-500">
    <View class="h-32 tablet:bg-green-100 handheld:bg-blue-100">
      <Label class="w-screen h-auto text-center ios:text-blue-800 ios:text-xl android:text-green-800 android:text-2xl">
        This is a Test
      </Label>
    </View>
  </Window>
</Alloy>
```

### Combining with Arbitrary Values

You can combine platform/device modifiers with arbitrary values for precise control:

```xml
<Label class="ios:bg-(#53606b) ios:text-(20px) android:bg-(#8fb63e) android:text-(24px)" />
```

### Multiple Modifiers on Same Element

```xml
<View class="ios:tablet:bg-white ios:handheld:bg-gray-100 android:bg-gray-200" />
```

## Generated TSS Output

PurgeTSS generates platform-specific selectors in `app.tss`:

```tss
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

## Custom Conditional Modifiers

You can create custom conditional modifiers using global variables:

### Syntax

```xml
<View class="[if=Alloy.Globals.isIPhoneX]:pb-24" />
```

The `[if=...]` syntax evaluates Alloy.Globals or controller arguments.

### Example with iPhone X Notch

```xml
<View class="[if=Alloy.Globals.iPhoneX]:bottom-(34) [if=Alloy.Globals.iPhoneX]:bg-white" />
```

### Setting Up Conditional Variables

In your controller or `alloy.js`:

```javascript
// Detect iPhone X
if (OS_IOS && Ti.Platform.displayCaps.platformHeight === 812 && Ti.Platform.displayCaps.platformWidth === 375) {
  Alloy.Globals.isIPhoneX = true;
}
```

## Modifiers in config.cjs

Platform and device modifiers can also be defined within `config.cjs` for centralized theme logic.

### Custom Class with Platform Variants

```javascript
'.my-view': {
  DEFAULT: {
    apply: 'bg-white'
  },
  ios: {
    apply: 'shadow-lg'
  },
  android: {
    apply: 'elevation-4'
  }
}
```

### Ti Element with Platform and Device Variants

```javascript
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
```

### Complex Example with All Variants

```javascript
module.exports = {
  theme: {
    '.feature-card': {
      DEFAULT: {
        width: 'Ti.UI.FILL',
        height: '100px',
        backgroundColor: '#ffffff'
      },
      ios: {
        borderRadius: 12
      },
      android: {
        borderRadius: 8
      },
      tablet: {
        width: '50%'
      },
      handheld: {
        width: '100%'
      }
    }
  }
}
```

## Platform-Specific Properties

Some Titanium properties are platform-specific and should be used with platform modifiers:

### iOS-Specific Properties

```xml
<View class="ios:clip-mode-disabled" />
<Label class="ios:adjusts-font-size-to-fit" />
```

### Android-Specific Properties

```xml
<View class="android:touch-feedback" />
<TextField class="android:soft-keyboard-hide-on-focus" />
```

## Interaction Modifiers

### Active State Modifier

Style applied while the element is being touched/clicked:

```xml
<Button class="active:bg-brand-700 active:scale-95" />
<View class="active:opacity-80" onTouchstart="doSomething" />
```

:::info
The `active:` modifier works with elements that have touch event handlers. The style is applied during the touch interaction and removed when the touch ends.
:::

## Best Practices

### 1. Use Modifiers for Platform Differences

```xml
<!-- Good: Platform-specific styling -->
<View class="ios:shadow-lg android:elevation-4 bg-white" />

<!-- Avoid: Creating separate views -->
<Window>
  <View platform="ios" class="shadow-lg bg-white" />
  <View platform="android" class="elevation-4 bg-white" />
</Window>
```

### 2. Combine with Default Styles

Always provide a default style, then override with modifiers:

```xml
<!-- Good: Default + overrides -->
<Label class="text-lg ios:text-xl android:text-2xl text-gray-800" />

<!-- Less clear: Only modifiers -->
<Label class="ios:text-xl android:text-2xl ios:text-gray-800 android:text-gray-800" />
```

### 3. Use Device Modifiers for Layout Adaptation

```xml
<!-- Adaptive layout based on form factor -->
<View class="horizontal w-screen">
  <View class="tablet:w-1/3 handheld:w-full bg-white">
    <!-- Sidebar on tablet, full content on phone -->
  </View>
  <View class="tablet:w-2/3 handheld:w-full bg-gray-100">
    <!-- Main content -->
  </View>
</View>
```

### 4. Leverage config.cjs for Complex Platform Logic

For complex platform-specific rules, define them in `config.cjs` rather than cluttering XML:

```javascript
// In config.cjs
'.navigation-header': {
  DEFAULT: { height: 56 },
  ios: { height: 44 },
  tablet: { height: 64 }
}

// In XML - clean and simple
<View class="navigation-header" />
```

## Common Patterns

### iOS Shadow / Android Elevation

```xml
<View class="ios:shadow-md android:elevation-2 bg-white rounded-lg" />
```

### Different Font Sizes per Platform

```xml
<Label class="text-gray-800 ios:text-base android:text-sm font-semibold" />
```

### Safe Area Handling for iPhone X

```xml
<View class="[if=Alloy.Globals.isIPhoneX]:pt-12 pt-4" />
```

### Adaptive Spacing

```xml
<View class="p-4 tablet:p-8 handheld:p-4" />
```

### Platform-Specific Colors

```xml
<Button class="bg-brand-500 ios:bg-blue-600 android:bg-green-600 text-white" />
```

## Troubleshooting

### Modifiers Not Applying

**Problem**: Platform modifier classes not generating in `app.tss`

**Solution**: Ensure `purge.mode` is set to `'all'` in `config.cjs`:

```javascript
module.exports = {
  purge: {
    mode: 'all' // Required to parse all class attributes
  }
}
```

### Conditional Modifiers Not Working

**Problem**: `[if=Alloy.Globals...]` modifiers not applying

**Solution**: Verify the global variable exists before the view is created:

```javascript
// In alloy.js or controller
Alloy.Globals.isIPhoneX = /* detection logic */;

console.log(Alloy.Globals.isIPhoneX); // Should be true/false
```

### Platform Detection Issues

**Problem**: Styles applying to wrong platform

**Solution**: Check generated `app.tss` for correct selector:

```tss
/* Should be platform-specific selector */
'.ios:bg-blue-500[platform=ios]': { backgroundColor: '#3b82f6' }
'.android:bg-blue-500[platform=android]': { backgroundColor: '#3b82f6' }
```

## Modifier Reference Table

| Modifier | Target | Example | Generated Selector |
|----------|--------|---------|-------------------|
| `ios:` | iOS devices only | `ios:bg-blue-500` | `[platform=ios]` |
| `android:` | Android devices only | `android:bg-green-500` | `[platform=android]` |
| `tablet:` | Tablets only | `tablet:w-1/2` | `[formFactor=tablet]` |
| `handheld:` | Phones only | `handheld:w-full` | `[formFactor=handheld]` |
| `[if=varName]:` | Custom conditional | `[if=Alloy.Globals.isIPhoneX]:pt-12` | `[if=Alloy.Globals.isIPhoneX]` |
| `active:` | Touch interaction | `active:opacity-80` | `active` state |

## Complete Example

```xml
<Alloy>
  <Window class="bg-white">
    <!-- Header with platform-specific styling -->
    <View class="h-16 ios:shadow-sm android:elevation-2 bg-white">
      <Label class="w-screen h-auto text-center ios:text-xl android:text-lg font-bold text-gray-800">
        Platform Demo
      </Label>
    </View>

    <!-- Adaptive content layout -->
    <View class="p-4 tablet:p-8">
      <View class="horizontal w-screen">
        <!-- Tablet: sidebar, Phone: full width cards -->
        <View class="tablet:w-1/3 handheld:w-full bg-gray-100 rounded-lg p-4">
          <Label text="Sidebar" class="text-center" />
        </View>
        <View class="tablet:w-2/3 handheld:w-full bg-white rounded-lg p-4 ml-4">
          <Label text="Main Content" class="text-center" />
        </View>
      </View>
    </View>

    <!-- iPhone X safe area handling -->
    <View class="[if=Alloy.Globals.isIPhoneX]:h-8 bg-transparent" />
  </Window>
</Alloy>
```
