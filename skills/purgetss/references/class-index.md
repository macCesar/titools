# PurgeTSS Class Index

<!-- GENERATED:counts START -->
**Generated from `utilities.tss` (PurgeTSS 7.17.1): 23,343 unique classes, 403 first segments, 620 Titanium properties.** Counts grow with each Titanium SDK and icon-font release.
<!-- GENERATED:counts END -->

Before suggesting ANY class, verify it exists:
```bash
grep -E "PATTERN" ./purgetss/styles/utilities.tss
```

<!-- TOC-START -->
## Contents

- [PurgeTSS Naming Conventions](#purgetss-naming-conventions)
- [Class Names You Cannot Derive from the Property](#class-names-you-cannot-derive-from-the-property)
- [All Titanium Properties with Classes](#all-titanium-properties-with-classes)
- [Community-Discovered Patterns](#community-discovered-patterns)
- [All First Segments (Alphabetical)](#all-first-segments-alphabetical)
- [Quick Verification Commands](#quick-verification-commands)
- [When to Use Direct Properties (No Classes)](#when-to-use-direct-properties-no-classes)

<!-- TOC-END -->

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
| `*Background*Color` | `statusBarBackgroundColor` | `status-bar-bg-gray-900` |
| `*Color`            | `titleColor`             | `title-gray-900`       |
| `*TextColor`        | `titleTextColor`         | `title-text-gray-900`  |
| `TintColor`         | `activeTintColor`        | `active-tint-gray-900` |

**Color Word Replacements:**
- `Background` → `bg-`
- `Color` → (omitted, color value follows)
- `TextColor` → `text-`
- `TintColor` → `tint-` when it has a prefix (`activeTintColor` → `active-tint-*`). The bare `tintColor` is `tint-color-*`; `tint-*` sets the MaskedImage `tint` property.

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

**Exception:** a few blocks carry a free-text comment instead of a `Property:` label, e.g. `// Utilities for controlling an element's margin.` above `m-*`, `// debug`, and the Animation-module drag options (`drag-apply`, `drag-animate`, `move-by-animation`).

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

## Class Names You Cannot Derive from the Property

For these families the class stem is not the property name in kebab-case, so guessing from the property fails. Generated from `utilities.tss`; the full property table is in [class-index-properties.md](./class-index-properties.md).

<!-- GENERATED:irregular START -->
| Classes | Property | Components |
| --- | --- | --- |
| `-rotate-*` | `rotate` | For the Animation Component |
| `alert-dialog-style`, `alert-dialog-style-login-and-password`, `alert-dialog-style-plain-text-input`, `alert-dialog-style-secure-text-input` | `style` | — |
| `allows-bg-location-updates`, `allows-bg-location-updates-false` | `allowsBackgroundLocationUpdates` | Ti.Geolocation |
| `allows-picture-in-media-playback`, `allows-picture-in-media-playback-false` | `allowsPictureInPictureMediaPlayback` | iOS.WebViewConfiguration |
| `allows-tightening-for-truncation`, `allows-tightening-for-truncation-false` | `allowsDefaultTighteningForTruncation` | ParagraphAttribute |
| `badge-bg-*` | `badgeBackgroundColor` | Tab |
| `bg-*` | `backgroundColor` | View, Ti.Media.VideoPlayer, Android.CardView +40 more |
| `bg-auto`, `bg-fill`, `bg-none`, `bg-cover`, `bg-contain` | `scalingMode` | ImageView |
| `bg-disabled-*` | `backgroundDisabledColor` | View, Ti.Media.VideoPlayer, Android.CardView +25 more |
| `bg-focused-*` | `backgroundFocusedColor` | View, Ti.Media.VideoPlayer, Android.CardView +25 more |
| `bg-gradient`, `bg-gradient-*` | `backgroundGradient` | MaskedImage |
| `bg-left-cap-*` | `backgroundLeftCap` | View, Ti.Media.VideoPlayer, Button +27 more |
| `bg-linear`, `bg-linear-*` | `backgroundGradient` | MaskedImage |
| `bg-padding-bottom-*` | `backgroundPaddingBottom` | Label |
| `bg-padding-left-*` | `backgroundPaddingLeft` | Label |
| `bg-padding-right-*` | `backgroundPaddingRight` | Label |
| `bg-padding-top-*` | `backgroundPaddingTop` | Label |
| `bg-radial`, `bg-radial-*` | `backgroundGradient` | ListItem, View |
| `bg-selected-*` | `backgroundSelectedColor` | View, Ti.Media.VideoPlayer, Android.CardView +30 more |
| `bg-selected-from-*` | `backgroundSelectedGradient` | ListItem, View |
| `bg-selected-to-*` | `backgroundSelectedGradient` | ListItem, View |
| `bg-top-cap-*` | `backgroundTopCap` | View, Ti.Media.VideoPlayer, Button +27 more |
| `block`, `hidden` | `visible` | View, Ti.Android.ActionBar, Ti.Android.MenuItem +37 more |
| `border`, `border-*` | `borderWidth` | View, Ti.Media.VideoPlayer, Android.CardView +32 more |
| `clip-enabled`, `clip-disabled` | `clipMode` | View |
| `col-count-*` | `columnCount` | DashboardView |
| `col-span-*` | `width` | ActivityIndicator, Animation, iPad.Popover +2 more |
| `content-w-auto`, `content-h-auto`, `content-w-screen`, `content-h-screen`, `content-auto`, `content-screen` | `contentWidth`, `contentHeight` | ScrollView |
| `dim-bg-for-search`, `dim-bg-for-search-false` | `dimBackgroundForSearch` | ListView, TableView |
| `drag-apply`, `drag-animate` | `draggingType` | For the Animation Component |
| `drop-shadow`, `drop-shadow-*` | `shadowOffset`, `shadowRadius`, `shadowColor` | Button, Label |
| `ease-in`, `ease-out`, `ease-linear`, `ease-in-out` | `curve` | Animation |
| `font-mono`, `font-sans`, `font-serif` | `font.fontFamily` | ActivityIndicator, Button, Label +9 more |
| `from-*` | `backgroundGradient` | ListItem, View |
| `gap-*` | `top`, `right`, `bottom`, `left` | ActivityIndicator, Animation, View, Window |
| `grid-cols-*` | `width` | ActivityIndicator, Animation, iPad.Popover +2 more |
| `grid-rows-*` | `height` | ActivityIndicator, Animation, iPad.Popover +2 more |
| `grid`, `grid-flow-col`, `grid-flow-row` | `layout`, `width`, `height` | View |
| `horizontal-constraint`, `vertical-constraint` | `constraint` | Animation |
| `iconified-by`, `iconified-by-false` | `iconifiedByDefault` | Android.SearchView, SearchBar |
| `italic`, `not-italic` | `font.fontStyle` | ActivityIndicator, Button, Label +9 more |
| `items-start`, `items-end`, `items-center` | `top`, `bottom`, `width`, `height` | ActivityIndicator, Animaiton, View, Window |
| `left-track-cap-*` | `leftTrackLeftCap` | Slider |
| `line-h-multiple-*` | `lineHeightMultiple` | ParagraphAttribute |
| `list-item-template`, `list-item-template-contacts`, `list-item-template-settings`, `list-item-template-subtitle` | `defaultItemTemplate` | ListView |
| `m-*`, `my-*`, `mx-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`, `-m-*`, … | `top`, `right`, `bottom`, `left` | — |
| `minimum-text-*` | `minimumFontSize` | label, TextField |
| `object-auto`, `object-fill`, `object-none`, `object-cover`, `object-contain` | `scalingMode` | ImageView |
| `orientation-landscape-left`, `orientation-landscape-right`, `orientation-portrait`, `orientation-upside-portrait`, `orientation-landscape`, `orientation-all` | `orientationModes` | NavigationWindow, TabGroup, Window, iOS.SplitWindow |
| `origin-*` | `anchorPoint` | Animation, View |
| `overflow-x-scroll`, `overflow-y-scroll`, `overflow-x-hidden`, `overflow-y-hidden`, `overflow-scroll`, `overflow-hidden` | `showHorizontalScrollIndicator`, `showVerticalScrollIndicator` | ScrollView |
| `p-*`, `py-*`, `px-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*` | `padding` | Android.CardView, TextArea, TextField |
| `picture-in-enabled`, `picture-in-enabled-false` | `pictureInPictureEnabled` | Ti.Media.VideoPlayer |
| `placeholder-*` | `hintTextColor` | Android.SearchView, SearchBar, TextArea, TextField |
| `platform-w`, `platform-h`, `platform-wh`, `platform-w-inverted`, `platform-h-inverted`, `platform-wh-inverted`, `inverted-platform-w`, `inverted-platform-h` | `width`, `height` | ActivityIndicator, Animation, iPad.Popover, View |
| `pointer-events-auto`, `pointer-events-none` | `touchEnabled` | View |
| `portrait`, `upside-portrait`, `landscape-left`, `landscape-right`, `landscape` | `orientationModes` | NavigationWindow, TabGroup, Window, iOS.SplitWindow |
| `progress-bar-style-bar`, `progress-bar-style`, `progress-bar-style-plain` | `style` | ProgressBar |
| `pull-bg-*` | `pullBackgroundColor` | View, Ti.Media.VideoPlayer, Button +31 more |
| `r-drawable-*` | `icon` | — |
| `results-bg-*` | `resultsBackgroundColor` | ListView, TableView |
| `rounded-full`, `rounded-full-*` | `width`, `height`, `borderRadius` | View, Ti.Media.VideoPlayer, Android.CardView +32 more |
| `rounded`, `rounded-*` | `borderRadius` | View, Ti.Media.VideoPlayer, Android.CardView +32 more |
| `row-span-*` | `height` | ActivityIndicator, Animation, iPad.Popover +2 more |
| `selected-bg-*` | `selectedBackgroundColor` | ListItem, OptionBar, TabbedBar, TableViewRow |
| `shadow`, `shadow-*` | `viewShadowOffset`, `viewShadowRadius`, `viewShadowColor`, `elevation` | iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Animation, View |
| `show-bg-location-indicator`, `show-bg-location-indicator-false` | `showBackgroundLocationIndicator` | Ti.Geolocation |
| `show-search-bar-in-nav`, `show-search-bar-in-nav-false` | `showSearchBarInNavBar` | ListView, TableView |
| `size-*` | `width`, `height` | View, Ti.Blob, Ti.Media.VideoPlayer +43 more |
| `status-bar-bg-*` | `statusBarBackgroundColor` | iOS |
| `status-bar`, `status-bar-dark`, `status-bar-light` | `statusBarStyle` | Window |
| `tabs-bg-*` | `tabsBackgroundColor` | TabGroup |
| `tabs-bg-selected-*` | `tabsBackgroundSelectedColor` | TabGroup |
| `text-*` | `font.fontSize` | ActivityIndicator, Button, Label +9 more |
| `text-center`, `text-justify`, `text-left`, `text-right` | `textAlign` | Button, Label, Picker +4 more |
| `to-*` | `backgroundGradient` | ListItem, View |
| `transparent`, `black`, `white`, `slate-*`, `gray-*`, `zinc-*`, `neutral-*`, `stone-*`, … | `color` | Ti.Android.Notification, Ti.Android.R, ActivityIndicator +20 more |
| `uppercase`, `normal-case`, `capitalize`, `sentences` | `autocapitalization` | SearchBar, TextArea, TextField |
| `vertical`, `horizontal`, `composite` | `layout` | View, Ti.Android.R, Ti.Media.VideoPlayer +31 more |
| `wh-*` | `width`, `height` | View, Ti.Blob, Ti.Media.VideoPlayer +43 more |
| `zoom-*` | `animationProperties.open`, `animationProperties.complete`, `animationProperties.close` | Animation |
<!-- GENERATED:irregular END -->

---

## All Titanium Properties with Classes

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
| `items-center`    | Exists, but only as a grid helper: `{ width: Ti.UI.FILL, height: Ti.UI.FILL }` | Use layout + sizing |
| `flex-wrap`       | Flexbox not supported             | Not supported                               |
| `flex-grow`       | Flexbox not supported             | Not supported                               |
| `flex-shrink`     | Flexbox not supported             | Not supported                               |
| `space-x-*`       | Space utilities not like Tailwind | Use `gap-*`                                 |
| `space-y-*`       | Space utilities not like Tailwind | Use `gap-*`                                 |
| `leading-*`       | Uses different prefix             | Use `line-h-multiple-*` or `line-spacing-*` |
| `tracking-*`      | Uses different prefix             | Use `letter-spacing-*`                      |

### Key Insights from Real Data

1. **Tens of thousands of classes** - see the generated counts at the top of this file
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

## All First Segments (Alphabetical)

> **NOTE**: v7.4.0 introduced `snap-back`, `snap-back-false`, `snap-center`, `snap-center-false`, `snap-magnet`, `snap-magnet-false`, `keep-z-index`, and `keep-z-index-false`. The current runtime implements back, center, and touch-start z-index preservation but does not read `snap.magnet`; do not suggest the generated magnet classes as working behavior. v7.5.3 added `font-sans`, `font-serif`, and `font-mono`.


<!-- GENERATED:prefixes START -->
```
accessibility, accessory, accuracy, action, activation, active, activity, alert, alignment, all,
allow, allows, amber, anchor, animated, animation, app, arrow, aspect, audio, authentication,
authorization, auto, autocapitalization, autocorrect, autofill, autohide, autoplay, autorepeat,
autoreverse, autorotate, availability, available, backfill, background, backward, badge, bar,
battery, behavior, bg, black, block, blue, border, bottom, break, bubble, bubbles, button, bypass,
cache, calendar, camera, can, cancel, cancelable, canceled, capitalize, car, case, category, charset,
checkable, checked, clear, clip, closed, code, col, collision, colors, compact, composite,
compression, connected, contacts, content, continuous, count, critical, current, curve, custom, cyan,
date, debug, deceleration, defaults, delay, destructive, dim, disable, disabled, display, drag,
drawer, drop, duration, ease, editable, editing, effect, elevation, eligible, ellipsize, emerald,
enable, enabled, exact, exit, experimental, extend, fast, filter, fixed, flag, flags, flip,
focusable, font, footer, force, format, format24, frequency, from, fuchsia, fullscreen, gap,
generated, getters, gravity, gray, green, grid, group, grouping, h, handle, has, header, hidden,
hide, hides, highlighted, hint, hires, home, horizontal, hour12, html, httponly, hyphenation, icon,
iconified, idle, ignore, image, importance, in, include, indention, indicator, indigo, injection,
input, inputs, inset, interactive, inverted, is, italic, item, items, java, keep, keyboard, kind,
landscape, large, launch, layer, lazy, left, letter, light, lime, line, lines, list, loading,
location, lock, lockscreen, login, looping, m, main, manual, master, max, maximum, mb, media, method,
min, minimize, minimum, mixed, ml, modal, mode, move, moveable, movie, moving, mr, mt, multiple, mx,
my, native, nav, navigation, needs, network, neutral, no, normal, not, notification, numeric, object,
on, online, opacity, opaque, opaquebackground, opaquebg, options, orange, orientation, origin,
outputs, over, overflow, overlay, override, p, padding, page, paging, paragraph, password, path,
pause, pb, persistent, physical, picture, pink, pl, placeholder, platform, playback, plugin, pointer,
portrait, position, pr, prevent, progress, provides, proximity, prune, pt, pull, purple, push, px,
py, r, ready, recording, red, remote, repeat, requested, requires, results, return, reverse, right,
role, rose, rotate, rounded, row, running, save, scale, scales, scaling, scroll, scrollable,
scrollbars, scrolling, scrolls, search, section, secure, selected, selection, sentences, separator,
severity, shadow, shift, show, shows, shuffle, size, sky, slate, smooth, snap, soft, sorted, sound,
source, split, start, state, status, stone, stopped, style, submit, subtitle, success, suppress,
suppresses, sustained, swipe, swipeable, system, tab, tabs, target, teal, text, theme, throw, thumb,
timeout, tint, title, tls, to, toggle, toolbar, top, torch, touch, trace, track, transition,
translucent, transparent, treat, type, unique, update, uppercase, upright, upside, use, user, valid,
validates, value, vertical, video, view, violet, visibility, visible, w, waits, wh, which, white,
will, window, wobble, wraps, x, y, yellow, z, zinc, zoom
```
<!-- GENERATED:prefixes END -->

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
| `value`        | `value="value"`                   | Component value          |
| `text`         | `text="Label text"`               | Label text               |
| `title`        | `title="Button title"`            | Button title             |
| `image`        | `image="/images/photo.png"`       | Image source             |
| `bindId`       | `bindId="myData"`                 | ListView data binding    |

**Note:** For `autocapitalization`, `editable`, `enabled`, `visible`, `autocorrect`, `passwordMask` (`password-mask`) - PurgeTSS DOES have classes (see above), so you CAN use either the class or the attribute depending on your preference.
