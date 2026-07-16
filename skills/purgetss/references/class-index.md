# PurgeTSS Class Index

**Based on the actual PurgeTSS `utilities.tss` file - 23,000+ unique utility classes across 364 unique prefixes covering 416 Titanium properties** (class count grows with each Titanium SDK / Font Awesome release; prefix and property counts are stable)

Before suggesting ANY class, verify it exists:
```bash
grep -E "PATTERN" ./purgetss/styles/utilities.tss
```

## PurgeTSS Naming Conventions

### How Classes Are Generated from Titanium Properties

Every PurgeTSS class follows systematic naming rules derived from Titanium SDK property names:

#### 1. Basic Conversion: camelCase → kebab-case

```javascript
// Titanium Property → PurgeTSS Class
keepSectionsInSearch        → keep-sections-in-search
backgroundColor            → bg-*
keyboardType               → keyboard-type-*
returnKeyType              → return-key-type-*
```

#### 2. Boolean Properties: `property` and `property-false`

```javascript
// Property: editable
'.editable':               { editable: true }
'.editable-false':         { editable: false }

// Property: enabled
'.enabled':                { enabled: true }
'.enabled-false':          { enabled: false }

// Property: visible
'.visible':                { visible: true }
'.visible-false':          { visible: false }
'.hidden':                 { visible: false }  // alias
```

#### 3. Color Properties: Special Word Replacements

| Pattern             | Property                 | Class Example          |
| ------------------- | ------------------------ | ---------------------- |
| `*BackgroundColor`  | `resultsBackgroundColor` | `results-bg-gray-900`  |
| `*Background*Color` | `barBackgroundColor`     | `bar-bg-gray-900`      |
| `*Color`            | `titleColor`             | `title-gray-900`       |
| `*TextColor`        | `titleTextColor`         | `title-text-gray-900`  |
| `TintColor`         | `activeTintColor`        | `active-tint-gray-900` |

**Color Word Replacements:**
- `Background` → `bg-`
- `Color` → (omitted, color value follows)
- `TextColor` → `text-`
- `TintColor` → `tint-`

#### 4. No kebab-case Conversion

Some properties use distinct class names (no kebab-case conversion):

```javascript
// Property: autocapitalization
'.uppercase':              { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_ALL }
'.normal-case':            { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE }
'.capitalize':             { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS }
'.sentences':              { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES }
```

### Finding Properties in utilities.tss

Each property section in the file includes documentation:

```tss
// Property(ies): contentWidth, contentHeight
// Component(s): Ti.UI.ScrollView
'.content-w-screen': { contentWidth: Ti.UI.FILL }
'.content-h-screen': { contentHeight: Ti.UI.FILL }
```

**Comment Patterns:**
- `// Property: propertyName` - Single property
- `// Property(ies): prop1, prop2` - Multiple properties
- `// Component(s): Ti.UI.View, ...` - Which components use these classes
- `// Description: ...` - Optional description

**Exception:** Only `// debug` exists without a `Property:` label.

Search for any property to see its available classes:
```bash
# Find by property name
grep -A 20 "// Property: keyboardType" ./purgetss/styles/utilities.tss

# Find by multiple properties
grep -A 20 "// Property(ies): contentWidth, contentHeight" ./purgetss/styles/utilities.tss

# Find by component
grep -B 2 "Component(s): Ti.UI.TextField" ./purgetss/styles/utilities.tss

# Find all properties for a component
grep -B 2 "Component(s):.*Ti.UI.ListView" ./purgetss/styles/utilities.tss | grep "// Property"
```

---

## Multiple Properties Grouped Together

Some PurgeTSS classes combine multiple Titanium properties under a single class prefix:

| Class Prefix             | Properties                                                     | Description                |
| ------------------------ | -------------------------------------------------------------- | -------------------------- |
| `anchor-point-*`         | `anchorPoint`                                                  | Animation/View positioning |
| `autocapitalization-*`   | `autocapitalization`                                           | Text capitalization        |
| `bg-gradient-*`          | `backgroundGradient`                                           | Linear gradients           |
| `bg-radial-*`            | `backgroundGradient`                                           | Radial gradients (iOS)     |
| `clip-mode-*`            | `clipMode`                                                     | iOS clipping               |
| `content-*`              | `contentWidth`, `contentHeight`                                | ScrollView content size    |
| `curve-*`                | `curve`                                                        | Animation easing           |
| `dragging-*`             | `draggingType`                                                 | Animation module dragging  |
| `filter-attribute-*`     | `filterAttribute`                                              | ListView filtering         |
| `flip-*`                 | `flip`                                                         | Animation flipping         |
| `font-*`                 | `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`            | Typography (v7.5.3+: `font-sans`, `font-serif`, `font-mono` family classes) |
| `grid-*`                 | Various                                                        | Grid layout system         |
| `h-*`                    | `height`                                                       | All components             |
| `hint-*`                 | `hintTextColor`                                                | TextField placeholder      |
| `keep-z-index`           | `animationProperties.keepZIndex` (v7.4.0+)                     | Preserves z-order during drag when used with `transition` |
| `layout-*`               | `layout`                                                       | View layout modes          |
| `minimum-font-size-*`    | `minimumFontSize`                                              | Label auto-shrink          |
| `navigation-*`           | `navigationMode`                                               | Navigation modes           |
| `orientation-modes-*`    | `orientationModes`                                             | Supported orientations     |
| `origin-*`               | `anchorPoint`                                                  | Transform origin           |
| `padding-*`              | `padding`                                                      | Android-specific padding   |
| `rotate-*`               | `rotate`                                                       | 2D Matrix rotation         |
| `scale-*`                | `scale`                                                        | 2D Matrix scaling          |
| `scroll-type-*`          | `scrollType`                                                   | Android scroll type        |
| `shadow-*`               | `shadowOffset`, `shadowRadius`, `shadowColor`                  | Box shadows                |
| `show-*scroll-indicator` | `showHorizontalScrollIndicator`, `showVerticalScrollIndicator` | ScrollView                 |
| `snap-*`                 | `animationProperties.snap.{back, center, magnet}` (v7.4.0+)    | Draggable drop behaviors   |
| `status-bar-style-*`     | `statusBarStyle`                                               | iOS status bar             |
| `tint-*`                 | `tintColor`                                                    | View/Button tinting        |
| `title-*`                | `titleAttributes: color/shadow`                                | iOS title styling          |
| `toggle-*`               | `toggle`                                                       | Animation toggle           |
| `w-*`                    | `width`                                                        | All components             |
| `wh-*`                   | `width`, `height`                                              | Combined width/height      |


---

## All 416 Titanium Properties with Classes

The full A–Z property→class table is maintained in a dedicated reference to keep this index scannable:

➡️ **[class-index-properties.md](./class-index-properties.md)** — every Titanium property with its PurgeTSS class prefix (A–Z).

---

## Community-Discovered Patterns

The rest of this document collects conventions, prohibitions, and insights surfaced by PurgeTSS users in real Titanium projects. They reflect how the utility system is actually used, not just how it is defined.

### PROHIBITED: CSS Classes (DO NOT EXIST)

| CSS Class         | Issue                             | PurgeTSS Alternative                        |
| ----------------- | --------------------------------- | ------------------------------------------- |
| `flex-row`        | Flexbox not supported             | `horizontal`                                |
| `flex-col`        | Flexbox not supported             | `vertical`                                  |
| `flex`            | Flexbox not supported             | `horizontal` or `vertical`                  |
| `justify-between` | Flexbox not supported             | Use margins/positioning                     |
| `justify-center`  | Flexbox not supported             | Use margins/positioning                     |
| `items-center`    | Different meaning in Titanium     | Use layout + sizing                         |
| `w-full`          | Different meaning than Tailwind   | Use `w-full` for 100%, `w-screen` for FILL  |
| `flex-wrap`       | Flexbox not supported             | Not supported                               |
| `flex-grow`       | Flexbox not supported             | Not supported                               |
| `flex-shrink`     | Flexbox not supported             | Not supported                               |
| `rounded-full`    | Requires size suffix              | `rounded-full-12` (size × 4 = diameter)     |
| `space-x-*`       | Space utilities not like Tailwind | Use `gap-*`                                 |
| `space-y-*`       | Space utilities not like Tailwind | Use `gap-*`                                 |
| `leading-*`       | Uses different prefix             | Use `line-h-multiple-*` or `line-spacing-*` |
| `tracking-*`      | Uses different prefix             | Use `letter-spacing-*`                      |

### Key Insights from Real Data

1. **21,236 unique classes** across **364 unique prefixes** - Far more than initially documented
2. **Extensive state management** - Hundreds of `*enabled`, `*-false` classes for UI states
3. **Platform-specific classes** - Many iOS/Android specific variants (like `[platform=ios]`)
4. **Complete color coverage** - All 22 Tailwind v3 colors with 11 shades each (50-950) = 242 color variants per prefix
5. **Boolean class pattern** - For properties like `editable`, `enabled`, `visible` → `class` and `class-false`
6. **UI component state variants** - `selected-*`, `badge-*`, `title-*`, `disabled-*` with full color coverage
7. **Keyboard toolbar styling** - Extensive `keyboard-toolbar-*` classes for custom keyboard accessories
8. **Status bar & navigation** - `status-bar-*`, `tabs-*`, `nav-*` for system UI customization
9. **Accessibility support** - `accessibility-*` classes for a11y properties
10. **Animation system** - `duration-*`, `delay-*`, `rotate-*`, `scale-*` for PurgeTSS Animation component

---

## All 364 Unique Prefixes (Alphabetical)

> **NOTE**: Recent additions — v7.4.0 introduced `snap-back`, `snap-back-false`, `snap-center`, `snap-center-false`, `snap-magnet`, `snap-magnet-false`, `keep-z-index`, and `keep-z-index-false` for the Animation module drop/drag system. v7.5.3 introduced font-family classes `font-sans`, `font-serif`, `font-mono` alongside the existing weight classes.


```
accessibility, accessory, accuracy, action, active, activity, alignment, all, allow, allows,
amber, anchor, animated, app, arrow, aspect, audio, authentication, auto, autocapitalization,
autocorrect, autofill, autohide, autoplay, autorepeat, autoreverse, autorotate, availability,
available, backfill, background, backward, badge, bar, battery, bg, black, block, blue, border,
bottom, break, bubble, bubbles, button, bypass, cache, calendar, camera, can, cancel,
cancelable, canceled, capitalize, case, charset, checkable, checked, clear, clip, closed,
code, col, colors, compact, composite, compression, connected, contacts, content, continuous,
count, current, curve, custom, cyan, date, debug, delay, destructive, dim, disable, disabled,
display, drag, drawer, drop, duration, ease, editable, editing, elevation, eligible, ellipsize,
emerald, enable, enabled, exact, exit, experimental, extend, fast, filter, fixed, flag, flip,
focusable, font, footer, force, format, format24, frequency, from, fuchsia, fullscreen, gap,
generated, getters, gray, green, grid, group, grouping, h, handle, has, header, hidden, hide,
hides, highlighted, hint, hires, home, horizontal, hour12, html, httponly, hyphenation, icon,
iconified, idle, ignore, image, in, include, indention, indicator, indigo, input, inputs,
inset, interactive, is, italic, items, java, keep, keyboard, kind, landscape, large, launch,
layer, lazy, left, letter, light, lime, line, lines, list, loading, location, login, looping,
m, main, manual, master, max, maximum, mb, media, method, min, minimum, mixed, ml, modal,
mode, move, moveable, movie, moving, mr, mt, multiple, mx, my, native, nav, navigation,
needs, network, neutral, no, normal, not, numeric, object, on, online, opacity, opaque,
opaquebackground, opaquebg, orange, orientation, origin, outputs, overflow, overlay, override,
p, padding, page, paging, paragraph, password, path, pause, pb, persistent, picture, pink,
pl, placeholder, platform, playback, pointer, portrait, position, pr, prevent, proximity,
prune, pt, pull, purple, px, py, ready, recording, red, remote, repeat, requires, results,
return, reverse, right, role, rose, rotate, rounded, row, running, save, scale, scales,
scaling, scroll, scrollable, scrolling, scrolls, search, section, secure, selected, selection,
sentences, separator, shadow, shift, show, shows, shuffle, size, sky, slate, smooth, snap, sorted,
source, split, state, status, stone, stopped, style, submit, subtitle, success, suppress,
suppresses, sustained, swipe, swipeable, tab, tabs, target, teal, text, theme, throw, thumb,
timeout, tint, title, tls, to, toggle, toolbar, top, torch, touch, trace, track, translucent,
transparent, treat, type, unique, update, uppercase, upright, upside, use, user, valid,
validates, value, vertical, video, view, violet, visibility, visible, w, waits, wh, which,
white, will, wobble, wraps, x, y, yellow, z, zinc, zoom
```

---

## Quick Verification Commands

```bash
# Search for a specific prefix
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/utilities.tss | sed "s/'\.//;s/':$//" | grep "^bg-" | sort -u

# Search for keyboard classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/utilities.tss | sed "s/'\.//;s/':$//" | grep "^keyboard-type-" | sort -u

# Search for text classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/utilities.tss | sed "s/'\.//;s/':$//" | grep "^text-" | sort -u

# Search for margin classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/utilities.tss | sed "s/'\.//;s/':$//" | grep "^m-" | sort -u

# Search for boolean/state classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/utilities.tss | sed "s/'\.//;s/':$//" | grep -E "^(editable|enabled|visible|hidden)$"

# Count total classes
grep -o "'\.[a-zA-Z0-9_/-']*':" ./purgetss/styles/utilities.tss | wc -l

# Count unique classes
grep -o "'\.[a-zA-Z0-9_/-']*':" ./purgetss/styles/utilities.tss | sort -u | wc -l

# Get all unique prefixes
grep -o "'\.[a-zA-Z0-9_/-']*':" ./purgetss/styles/utilities.tss | sed "s/'\.//;s/':$//" | while read line; do echo "${line%%-*}"; done | sort -u
```

---

## When to Use Direct Properties (No Classes)

These properties are NOT styled with classes in PurgeTSS - use as XML attributes:

| Property       | Use As Attribute                  | Notes                    |
| -------------- | --------------------------------- | ------------------------ |
| `id`           | `id="myId"`                       | Component identification |
| `onClick`      | `onClick="functionName"`          | Event handlers           |
| `onPostlayout` | `onPostlayout="handlePostlayout"` | Event handlers           |
| `hintText`     | `hintText="Email"`                | Placeholder text         |
| `passwordMask` | `passwordMask="true"`             | Password masking         |
| `value`        | `value="value"`                   | Component value          |
| `text`         | `text="Label text"`               | Label text               |
| `title`        | `title="Button title"`            | Button title             |
| `imageUrl`     | `imageUrl="/path.png"`            | Image source             |
| `bindId`       | `bindId="myData"`                 | ListView data binding    |

**Note:** For `autocapitalization`, `editable`, `enabled`, `visible`, `autocorrect` - PurgeTSS DOES have classes (see above), so you CAN use either the class or the attribute depending on your preference.
