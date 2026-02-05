# Custom fonts and attributed strings

## 1. Custom fonts overview

Titanium supports TrueType (`.ttf`) and OpenType (`.otf`) fonts on iOS and Android. Custom fonts are a practical way to match a brand or add a distinct tone to your UI.

### Font sources

- [Google Fonts](https://fonts.google.com) - Free, open source fonts
- [FontSquirrel](https://www.fontsquirrel.com) - Free fonts, often licensed for commercial use

## 2. Platform-specific font loading

### Key difference

| Platform | fontFamily value                            |
| -------- | ------------------------------------------- |
| Android  | Font file name without extension            |
| iOS      | Font PostScript name (embedded in the file) |

### Example

For a file named `BurnstownDam-Regular.otf`:
- Android: `fontFamily: 'burnstown_dam'` (filename without extension)
- iOS: `fontFamily: 'BurnstownDam-Regular'` (PostScript name)

## 3. Alloy projects

### Directory structure

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

### XML usage

```xml
<Alloy>
  <View>
    <Label id="customFont">This uses a custom font</Label>
  </View>
</Alloy>
```

### TSS styling

```javascript
"#customFont": {
  font: {
    fontFamily: 'CustomFont-Regular',  // iOS PostScript name
    fontSize: 24
  }
}
```

### Cross-platform solution 1: rename the font file

Rename the font file to match the PostScript name and use one value.

```javascript
// File renamed from "burnstown_dam.otf" to "BurnstownDam-Regular.otf"

"#customFont": {
  font: {
    fontFamily: 'BurnstownDam-Regular',  // Works on both platforms
    fontSize: 24
  }
}
```

### Cross-platform solution 2: platform-specific styles

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

## 4. Classic Titanium projects

### Directory structure

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

### Runtime platform switching

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

### Platform-switching helper function

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

## 5. Finding the PostScript name

### Using Font Book (macOS)

1. Open Font Book.
2. Select the font.
3. Press Cmd+I to view font info.
4. Look for the PostScript name field.

The PostScript name is embedded in the font file and does not change if you rename the file.

### Common font patterns

| Friendly name   | PostScript name pattern     |
| --------------- | --------------------------- |
| Arial           | ArialMT or Arial-BoldMT     |
| Helvetica       | Helvetica or Helvetica-Bold |
| Times New Roman | TimesNewRomanPSMT           |
| Custom-Regular  | CustomName-Regular          |

## 6. iOS platform notes

### Automatic Info.plist registration

All fonts in `Resources/fonts/` are automatically added to the iOS Info.plist.

Important: Put Android-only fonts in `Resources/android/fonts/` to avoid iOS registration errors.

### Using system fonts

Check available system fonts before adding custom fonts.

- [iOS Fonts](http://iosfonts.com/)
- [Android Fonts](https://github.com/android/platform_frameworks_base/tree/master/data/fonts)

## 7. Attributed strings

Attributed strings let you style ranges within a string. They work with Labels, TextAreas, and TextFields.

### Basic syntax

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

### Important warning

If you use `attributedString` or `attributedHintText`, do not set other text properties like `font` or `color`. Titanium does not support mixing attributed strings with other text properties.

### Property equivalents

| Component | AttributedString property | Equivalent |
| --------- | ------------------------- | ---------- |
| Label     | `attributedString`        | `text`     |
| TextArea  | `attributedString`        | `value`    |
| TextField | `attributedString`        | `value`    |
| TextField | `attributedHintText`      | `hintText` |

## 8. Attribute types

### Font attribute

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

### Foreground color

```javascript
{
  type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
  value: 'cyan',
  range: [start, length]
}
```

### Background color

```javascript
{
  type: Ti.UI.ATTRIBUTE_BACKGROUND_COLOR,
  value: "yellow",
  range: [start, length]
}
```

### Underline

Android: single line only, `value` ignored.

iOS: multiple styles and patterns. You can OR constants together (for example, `STYLE_DOUBLE | PATTERN_DOT`).

```javascript
{
  type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
  value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_DOUBLE |
         Ti.UI.ATTRIBUTE_UNDERLINE_PATTERN_DOT,
  range: [start, length]
}
```

iOS underline styles:
- `ATTRIBUTE_UNDERLINE_STYLE_NONE`
- `ATTRIBUTE_UNDERLINE_STYLE_SINGLE`
- `ATTRIBUTE_UNDERLINE_STYLE_THICK` (iOS 7+)
- `ATTRIBUTE_UNDERLINE_STYLE_DOUBLE` (iOS 7+)

iOS patterns (iOS 7+):
- `ATTRIBUTE_UNDERLINE_PATTERN_SOLID`
- `ATTRIBUTE_UNDERLINE_PATTERN_DOT`
- `ATTRIBUTE_UNDERLINE_PATTERN_DASH`
- `ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT`
- `ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT_DOT`
- `ATTRIBUTE_UNDERLINE_BY_WORD` (Draw lines only under characters, not spaces)

iOS underline color (iOS 7+):
```javascript
{
  type: Ti.UI.ATTRIBUTE_UNDERLINE_COLOR,
  value: 'blue',
  range: [start, length]
}
```

### Strikethrough

Android: single line through text only.

iOS: supports the same styles and patterns as underline.

iOS strikethrough color (iOS 7+):
```javascript
{
  type: Ti.UI.ATTRIBUTE_STRIKETHROUGH_COLOR,
  value: 'red',
  range: [start, length]
}
```

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

Note: Prior to Titanium Release 4.0, the `link` event was only triggered by a long press on iOS.

## 9. iOS-exclusive attributes

### Ligature

```javascript
{
  type: Ti.UI.ATTRIBUTE_LIGATURE,
  value: 1,  // 1 = enabled, 0 = disabled (default)
  range: [start, length]
}
```

### Kerning (character spacing)

```javascript
{
  type: Ti.UI.ATTRIBUTE_KERN,
  value: 5.0,  // Distance in points. Positive = wider, 0 = default, negative = tighter
  range: [start, length]
}
```

### Stroke text (iOS 7+)

```javascript
// Positive value = outline only, negative = filled with stroke
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

### Letterpress effect (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_TEXT_EFFECT,
  value: Ti.UI.ATTRIBUTE_LETTERPRESS_STYLE,
  range: [start, length]
}
```

### Writing direction (iOS 7+)

Controls text direction for a specific range. You can OR a direction with a behavior (Embedding or Override).

```javascript
{
  type: Ti.UI.ATTRIBUTE_WRITING_DIRECTION,
  value: Ti.UI.ATTRIBUTE_WRITING_DIRECTION_RIGHT_TO_LEFT |
         Ti.UI.ATTRIBUTE_WRITING_DIRECTION_OVERRIDE,
  range: [start, length]
}
```

Direction constants:
- `ATTRIBUTE_WRITING_DIRECTION_NATURAL`: Uses the Unicode Bidirectional Algorithm.
- `ATTRIBUTE_WRITING_DIRECTION_LEFT_TO_RIGHT`
- `ATTRIBUTE_WRITING_DIRECTION_RIGHT_TO_LEFT`

Behavior modifiers:
- `ATTRIBUTE_WRITING_DIRECTION_EMBEDDING`: Use embedded direction.
- `ATTRIBUTE_WRITING_DIRECTION_OVERRIDE`: Force the direction.

### Baseline offset (iOS 7+)

```javascript
{
  type: Ti.UI.ATTRIBUTE_BASELINE_OFFSET,
  value: 10,  // Pixels. Positive = above, negative = below baseline
  range: [start, length]
}
```

### Oblique or skew (iOS 7+)

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

## 10. Multiple attributes example

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

## 11. Best practices

### Custom fonts

1. Test on real devices. Simulators can render fonts differently.
2. Check licensing. Make sure the font is licensed for mobile apps.
3. Consider file size. Custom fonts increase the app size.
4. Use system fonts when possible. They load faster.
5. Provide fallbacks. Always include a fallback `fontFamily`.

### Attributed strings

1. Do not mix with other properties. Use attributed strings or plain text styling.
2. Use consistent range calculations. Off-by-one errors are easy to introduce.
3. Test on both platforms. Attributes differ between iOS and Android.
4. Keep performance in mind. Complex attributed strings can slow scrolling.

## 12. Common issues

### Font not showing

Problem: A custom font does not appear.

Solutions:
1. Check the PostScript name (iOS) and filename (Android).
2. Verify the font file is in the correct directory.
3. Clean and rebuild the project.
4. Check that the font file is not corrupted.

### Wrong font on one platform

Problem: The font works on one platform but not the other.

Solution: You are likely using the wrong naming convention. Use platform-specific styles or rename the font file to match the PostScript name.

### Attributed string not displaying

Problem: Text shows as plain instead of formatted.

Solution: Remove conflicting properties like `font` and `color` when using `attributedString`.
