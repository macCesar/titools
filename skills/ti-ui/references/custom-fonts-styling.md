# Custom Fonts and Attributed Strings

## Table of Contents

- [Custom Fonts and Attributed Strings](#custom-fonts-and-attributed-strings)
  - [Table of Contents](#table-of-contents)
  - [1. Custom Fonts Overview](#1-custom-fonts-overview)
    - [Font Sources](#font-sources)
  - [2. Platform-Specific Font Loading](#2-platform-specific-font-loading)
    - [Key Difference](#key-difference)
    - [Example](#example)
  - [3. Alloy Projects](#3-alloy-projects)
    - [Directory Structure](#directory-structure)
    - [XML Usage](#xml-usage)
    - [TSS Styling](#tss-styling)
    - [Cross-Platform Solution 1: Rename Font File](#cross-platform-solution-1-rename-font-file)
    - [Cross-Platform Solution 2: Platform-Specific Styles](#cross-platform-solution-2-platform-specific-styles)
  - [4. Classic Titanium Projects](#4-classic-titanium-projects)
    - [Directory Structure](#directory-structure-1)
    - [Runtime Platform Switching](#runtime-platform-switching)
    - [Platform-Switching Helper Function](#platform-switching-helper-function)
  - [5. Finding PostScript Name](#5-finding-postscript-name)
    - [Using FontBook (macOS)](#using-fontbook-macos)
    - [Common Font Patterns](#common-font-patterns)
  - [6. iOS Platform Notes](#6-ios-platform-notes)
    - [Automatic Info.plist Registration](#automatic-infoplist-registration)
    - [Using System Fonts](#using-system-fonts)
  - [7. Attributed Strings](#7-attributed-strings)
    - [Basic Syntax](#basic-syntax)
    - [Important Warning](#important-warning)
    - [Property Equivalents](#property-equivalents)
  - [8. Attribute Types](#8-attribute-types)
    - [Font Attribute](#font-attribute)
    - [Foreground Color](#foreground-color)
    - [Background Color](#background-color)
    - [Underline](#underline)
    - [Strikethrough](#strikethrough)
    - [Links (iOS 7+)](#links-ios-7)
  - [9. iOS-Exclusive Attributes](#9-ios-exclusive-attributes)
    - [Ligature](#ligature)
    - [Kerning (Character Spacing)](#kerning-character-spacing)
    - [Stroke Text (iOS 7+)](#stroke-text-ios-7)
    - [Shadow (iOS 7+)](#shadow-ios-7)
    - [Letterpress Effect (iOS 7+)](#letterpress-effect-ios-7)
    - [Writing Direction (iOS 7+)](#writing-direction-ios-7)
    - [Baseline Offset (iOS 7+)](#baseline-offset-ios-7)
    - [Oblique/Skew (iOS 7+)](#obliqueskew-ios-7)
    - [Expansion (iOS 7+)](#expansion-ios-7)
  - [10. Multiple Attributes Example](#10-multiple-attributes-example)
  - [11. Best Practices](#11-best-practices)
    - [Custom Fonts](#custom-fonts)
    - [Attributed Strings](#attributed-strings)
  - [12. Common Issues](#12-common-issues)
    - [Font Not Showing](#font-not-showing)
    - [Wrong Font on One Platform](#wrong-font-on-one-platform)
    - [Attributed String Not Displaying](#attributed-string-not-displaying)

---

## 1. Custom Fonts Overview

Titanium supports TrueType (.ttf) and OpenType (.otf) fonts on both iOS and Android. Custom fonts are a quick way to personalize or brand your application.

### Font Sources

- [Google Fonts](https://fonts.google.com) - Free open source fonts
- [FontSquirrel](https://www.fontsquirrel.com) - Free commercial fonts

## 2. Platform-Specific Font Loading

### Key Difference

| Platform    | fontFamily Value                               |
| ----------- | ---------------------------------------------- |
| **Android** | Font file name without extension               |
| **iOS**     | Font's PostScript name (embedded in font file) |

### Example

For a file named `BurnstownDam-Regular.otf`:
- **Android**: `fontFamily: 'burnstown_dam'` (filename without extension)
- **iOS**: `fontFamily: 'BurnstownDam-Regular'` (PostScript name)

## 3. Alloy Projects

### Directory Structure

Place fonts in platform-specific assets:

```
app/
  assets/
    android/
      fonts/
        CustomFont.ttf
    iphone/
      fonts/
        CustomFont.ttf
```

### XML Usage

```xml
<Alloy>
  <View>
    <Label id="customFont">This uses a custom font</Label>
  </View>
</Alloy>
```

### TSS Styling

```javascript
"#customFont": {
  font: {
    fontFamily: 'CustomFont-Regular',  // iOS PostScript name
    fontSize: 24
  }
}
```

### Cross-Platform Solution 1: Rename Font File

Rename font file to match PostScript name, then use same value:

```javascript
// File renamed from "burnstown_dam.otf" to "BurnstownDam-Regular.otf"

"#customFont": {
  font: {
    fontFamily: 'BurnstownDam-Regular',  // Works on both platforms
    fontSize: 24
  }
}
```

### Cross-Platform Solution 2: Platform-Specific Styles

```javascript
// Use platform-specific TSS
"#customFont[platform=ios]": {
  font: {
    fontFamily: 'BurnstownDam-Regular'  // iOS PostScript name
  }
},
"#customFont[platform=android]": {
  font: {
    fontFamily: 'burnstown_dam'  // Android filename
  }
}
```

## 4. Classic Titanium Projects

### Directory Structure

```
Resources/
  fonts/
    CustomFont.ttf
  iphone/
    fonts/
      iOSFont.ttf
  android/
    fonts/
      AndroidFont.ttf
```

### Runtime Platform Switching

```javascript
let fontFamilyName;

if (Ti.Platform.osname === 'android') {
  // Android: use filename without extension
  fontFamilyName = 'CustomFont-Regular';
} else {
  // iOS: use PostScript name
  fontFamilyName = 'CustomFont';
}

const label = Ti.UI.createLabel({
  text: 'Custom Font Text',
  font: {
    fontFamily: fontFamilyName,
    fontSize: 24
  }
});
```

### Platform-Switching Helper Function

```javascript
// Helper function from Tweetanium pattern
const os = (map) => {
  const def = map.def || null;
  if (map[Ti.Platform.osname]) {
    return (typeof map[Ti.Platform.osname] === 'function')
      ? map[Ti.Platform.osname]()
      : map[Ti.Platform.osname];
  }
  return (typeof def === 'function') ? def() : def;
};

// Usage
const label = Ti.UI.createLabel({
  text: 'Custom Font Text',
  font: {
    fontFamily: os({
      iphone: 'CustomFont',
      ipad: 'CustomFont',
      android: 'CustomFont-Regular'
    }),
    fontSize: 24
  }
});
```

## 5. Finding PostScript Name

### Using FontBook (macOS)

1. Open FontBook application
2. Select desired font
3. Press Cmd+I to view font info
4. Find **PostScript name** field

The PostScript name is embedded in the font file and doesn't change if you rename the file.

### Common Font Patterns

| Friendly Name   | PostScript Name Pattern     |
| --------------- | --------------------------- |
| Arial           | ArialMT or Arial-BoldMT     |
| Helvetica       | Helvetica or Helvetica-Bold |
| Times New Roman | TimesNewRomanPSMT           |
| Custom-Regular  | CustomName-Regular          |

## 6. iOS Platform Notes

### Automatic Info.plist Registration

All fonts in `Resources/fonts/` are automatically added to iOS Info.plist.

**Important**: Place Android-only fonts in `Resources/android/fonts/` to avoid iOS registration errors.

### Using System Fonts

Check available system fonts before adding custom fonts:

- [iOS Fonts](http://iosfonts.com/)
- [Android Fonts](https://github.com/android/platform_frameworks_base/tree/master/data/fonts)

## 7. Attributed Strings

Attributed strings allow applying different formatting to character ranges within text. Supports Labels, TextAreas, and TextFields.

### Basic Syntax

```javascript
const text = "Have you tried hyperloop yet?";
const attr = Ti.UI.createAttributedString({
  text: text,
  attributes: [
    {
      type: Ti.UI.ATTRIBUTE_BACKGROUND_COLOR,
      value: "yellow",
      range: [text.indexOf('hyperloop'), ('hyperloop').length]
    }
  ]
});

const label = Ti.UI.createLabel({
  attributedString: attr
});
```

### Important Warning

If using `attributedString` or `attributedHintText`, **do not** set other text-modifying properties (`font`, `color`, etc.). Titanium does not support mixing attributed strings with other text properties.

### Property Equivalents

| Component | AttributedString Property | Equivalent |
| --------- | ------------------------- | ---------- |
| Label     | `attributedString`        | `text`     |
| TextArea  | `attributedString`        | `value`    |
| TextField | `attributedString`        | `value`    |
| TextField | `attributedHintText`      | `hintText` |

## 8. Attribute Types

### Font Attribute

```javascript
const attr = Ti.UI.createAttributedString({
  text: text,
  attributes: [
    {
      type: Ti.UI.ATTRIBUTE_FONT,
      value: {
        fontSize: 24,
        fontFamily: 'Didot'
      },
      range: [text.indexOf('hyperloop'), ('hyperloop').length]
    }
  ]
});
```

### Foreground Color

```javascript
{
  type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
  value: 'cyan',
  range: [start, length]
}
```

### Background Color

```javascript
{
  type: Ti.UI.ATTRIBUTE_BACKGROUND_COLOR,
  value: "yellow",
  range: [start, length]
}
```

### Underline

**Android**: Single line only, `value` ignored.

**iOS**: Multiple styles and patterns. You can logically-OR constants together (e.g., `STYLE_DOUBLE | PATTERN_DOT`).

```javascript
{
  type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
  value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_DOUBLE |
         Ti.UI.ATTRIBUTE_UNDERLINE_PATTERN_DOT,
  range: [start, length]
}
```

**iOS Underline Styles**:
- `ATTRIBUTE_UNDERLINE_STYLE_NONE`
- `ATTRIBUTE_UNDERLINE_STYLE_SINGLE`
- `ATTRIBUTE_UNDERLINE_STYLE_THICK` (iOS 7+)
- `ATTRIBUTE_UNDERLINE_STYLE_DOUBLE` (iOS 7+)

**iOS Patterns** (iOS 7+):
- `ATTRIBUTE_UNDERLINE_PATTERN_SOLID`
- `ATTRIBUTE_UNDERLINE_PATTERN_DOT`
- `ATTRIBUTE_UNDERLINE_PATTERN_DASH`
- `ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT`
- `ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT_DOT`
- `ATTRIBUTE_UNDERLINE_BY_WORD` (Draw lines only under characters, not spaces)

**iOS Underline Color** (iOS 7+):
```javascript
{
  type: Ti.UI.ATTRIBUTE_UNDERLINE_COLOR,
  value: 'blue',
  range: [start, length]
}
```

### Strikethrough

**Android**: Single line through text only.

**iOS**: Supports same styles and patterns as Underline.

### Links (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_LINK,
  value: "https://github.com/tidev/hyperloop",
  range: [start, length]
}
```

Handle link clicks:

```javascript
label.addEventListener('link', (e) => {
  Ti.API.info(`Link clicked: ${e.url}`);
});
```

**Note**: Prior to Titanium Release 4.0, the `link` event was only triggered by a long press on iOS.

## 9. iOS-Exclusive Attributes

### Ligature

```javascript
{
  type: Ti.UI.ATTRIBUTE_LIGATURE,
  value: 1,  // 1 = enabled, 0 = disabled (default)
  range: [start, length]
}
```

### Kerning (Character Spacing)

```javascript
{
  type: Ti.UI.ATTRIBUTE_KERN,
  value: 5.0,  // Distance in points. Positive = wider, 0 = default, negative = tighter
  range: [start, length]
}
```

### Stroke Text (iOS 7+)

```javascript
// Positive value = outline only, Negative = filled with stroke
{
  type: Ti.UI.ATTRIBUTE_STROKE_WIDTH,
  value: 3.0,
  range: [start, length]
}

// Stroke color
{
  type: Ti.UI.ATTRIBUTE_STROKE_COLOR,
  value: 'red',
  range: [start, length]
}
```

### Shadow (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_SHADOW,
  value: {
    color: 'green',
    offset: { width: 10, height: 5 },
    blurRadius: 3.0  // 0 = no blur
  },
  range: [start, length]
}
```

### Letterpress Effect (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_TEXT_EFFECT,
  value: Ti.UI.ATTRIBUTE_LETTERPRESS_STYLE,
  range: [start, length]
}
```

### Writing Direction (iOS 7+)

Controls text direction for a specific range. Can logically-OR direction with behavior (Embedding or Override).

```javascript
{
  type: Ti.UI.ATTRIBUTE_WRITING_DIRECTION,
  value: Ti.UI.ATTRIBUTE_WRITING_DIRECTION_RIGHT_TO_LEFT |
         Ti.UI.ATTRIBUTE_WRITING_DIRECTION_OVERRIDE,
  range: [start, length]
}
```

**Direction Constants**:
- `ATTRIBUTE_WRITING_DIRECTION_NATURAL`: Uses Unicode Bidirectional Algorithm.
- `ATTRIBUTE_WRITING_DIRECTION_LEFT_TO_RIGHT`
- `ATTRIBUTE_WRITING_DIRECTION_RIGHT_TO_LEFT`

**Behavior Modifiers**:
- `ATTRIBUTE_WRITING_DIRECTION_EMBEDDING`: Use embedded direction.
- `ATTRIBUTE_WRITING_DIRECTION_OVERRIDE`: Force the direction.

### Baseline Offset (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_BASELINE_OFFSET,
  value: 10,  // Pixels. Positive = above, negative = below baseline
  range: [start, length]
}
```

### Oblique/Skew (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_OBLIQUENESS,
  value: 0.25,  // 0 = no skew
  range: [start, length]
}
```

### Expansion (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_EXPANSION,
  value: 0.25,  // Log of expansion factor, 0 = none
  range: [start, length]
}
```

## 10. Multiple Attributes Example

```javascript
const text = "Have you tried hyperloop yet?";
const attr = Ti.UI.createAttributedString({
  text: text,
  attributes: [
    // Background color
    {
      type: Ti.UI.ATTRIBUTE_BACKGROUND_COLOR,
      value: "yellow",
      range: [text.indexOf('hyperloop'), ('hyperloop').length]
    },
    // Bold font
    {
      type: Ti.UI.ATTRIBUTE_FONT,
      value: { fontSize: 24, fontWeight: 'bold' },
      range: [text.indexOf('hyperloop'), ('hyperloop').length]
    },
    // Red text
    {
      type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
      value: 'red',
      range: [text.indexOf('hyperloop'), ('hyperloop').length]
    }
  ]
});
```

## 11. Best Practices

### Custom Fonts

1. **Test on real devices** - Simulator may not reflect actual font rendering
2. **Check licensing** - Ensure fonts are licensed for mobile app distribution
3. **Consider file size** - Custom fonts increase app size
4. **Use system fonts when possible** - Faster loading, smaller app size
5. **Provide fallbacks** - Always include a fallback fontFamily

### Attributed Strings

1. **Don't mix with other properties** - Use only attributed string OR text properties
2. **Use consistent range calculations** - Off-by-one errors are common
3. **Test on both platforms** - Some attributes differ between iOS and Android
4. **Performance consideration** - Complex attributed strings can impact scrolling performance

## 12. Common Issues

### Font Not Showing

**Problem**: Custom font not appearing

**Solutions**:
1. Check PostScript name (iOS) vs filename (Android)
2. Verify font file is in correct directory
4. Clean and rebuild project
5. Check font file isn't corrupted

### Wrong Font on One Platform

**Problem**: Font works on one platform but not the other

**Solution**: You're likely using the wrong naming convention. Use platform-specific styles or rename font file to match PostScript name.

### Attributed String Not Displaying

**Problem**: Text appears plain instead of formatted

**Solution**: Remove conflicting properties like `font`, `color`, etc. when using `attributedString`.
