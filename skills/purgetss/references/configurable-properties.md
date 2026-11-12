# Configurable Properties

This reference lists all customizable properties from the official PurgeTSS configuration guide. Add these under `theme` in `config.cjs` to override defaults, or under `theme.extend` to add new values while keeping defaults.

The lists below describe the PurgeTSS v7.20.1 catalog. They also include generated properties omitted from the official guide's lists (e.g. `linkColor` and the three split-view numeric properties introduced in the SDK 14.0.0.GA refresh). `scalesPageToFit` appears in the official configurable list but is a Boolean property: it only generates `.scales-page-to-fit` and `.scales-page-to-fit-false`. For exact generated families and component metadata, see [Class Index — Properties](./class-index-properties.md); check [SDK 14 compatibility](./sdk-14-compatibility.md) before using split-view ratios or bounds.

## Global Properties

- All color properties inherit from `theme.colors`.
- All spacing properties inherit from `theme.spacing`.

The three SplitWindow numeric properties have their own value constraints: `primaryColumnWidthFraction` takes ratios from 0 to 1, and the minimum/maximum widths take numeric points. See [SplitWindow ratios and column bounds](./customization-deep-dive.md#splitwindow-ratios-and-column-bounds-7201) for customization and validation.

You can customize any of the following properties individually by adding them in the `theme` section of your `config.cjs` file, or by extending them in the `theme.extend` section.

## Color Properties

- `activeTintColor`
- `activeTitleColor`
- `backgroundColor`
- `backgroundDisabledColor`
- `backgroundFocusedColor`
- `backgroundGradient`
- `backgroundSelectedColor`
- `backgroundSelectedGradient`
- `badgeBackgroundColor`
- `badgeColor`
- `badgeTextColor`
- `barColor`
- `borderColor`
- `color`
- `colors`
- `contentScrimColor`
- `currentPageIndicatorColor`
- `dateTimeColor`
- `disabledColor`
- `highlightedColor`
- `hintTextColor`
- `iconColor`
- `imageTouchFeedbackColor`
- `indicatorColor`
- `keyboardToolbarColor`
- `lightColor`
- `linkColor`
- `navBarColor`
- `navigationIconColor`
- `navTintColor`
- `onThumbColor`
- `onTintColor`
- `pageIndicatorColor`
- `pagingControlColor`
- `pullBackgroundColor`
- `resultsBackgroundColor`
- `resultsSeparatorColor`
- `selectedBackgroundColor`
- `selectedBorderColor`
- `selectedButtonColor`
- `selectedColor`
- `selectedSubtitleColor`
- `selectedTextColor`
- `separatorColor`
- `shadowColor`
- `statusBarBackgroundColor`
- `statusBarColor`
- `subtitleColor`
- `subtitleTextColor`
- `tabsBackgroundColor`
- `tabsBackgroundSelectedColor`
- `thumbColor`
- `thumbTintColor`
- `tint`
- `tintColor`
- `titleAttributes`
- `titleColor`
- `titleTextColor`
- `touchFeedbackColor`
- `trackTintColor`
- `viewShadowColor`

## Configurable Properties

- `activeTab`
- `backgroundLeftCap`
- `backgroundPaddingBottom`
- `backgroundPaddingLeft`
- `backgroundPaddingRight`
- `backgroundPaddingTop`
- `backgroundTopCap`
- `borderRadius`
- `borderWidth`
- `bottom`
- `cacheSize`
- `columnCount`
- `contentHeight`
- `contentWidth`
- `countDownDuration`
- `delay`
- `duration`
- `elevation`
- `fontSize`
- `height`
- `horizontalMargin`
- `imageHeight`
- `imagePadding`
- `indentionLevel`
- `keyboardToolbarHeight`
- `left`
- `leftButtonPadding`
- `leftTrackLeftCap`
- `leftTrackTopCap`
- `leftWidth`
- `letterSpacing`
- `lineHeightMultiple`
- `lines`
- `lineSpacing`
- `maxElevation`
- `maximumLineHeight`
- `maximumPrimaryColumnWidth`
- `maxLines`
- `maxRowHeight`
- `maxZoomScale`
- `minimumFontSize`
- `minimumLineHeight`
- `minimumPrimaryColumnWidth`
- `minRowHeight`
- `minZoomScale`
- `opacity`
- `padding`
- `paddingBottom`
- `paddingLeft`
- `paddingRight`
- `paddingTop`
- `pageHeight`
- `pageWidth`
- `pagingControlAlpha`
- `pagingControlHeight`
- `pagingControlTimeout`
- `paragraphSpacingAfter`
- `paragraphSpacingBefore`
- `primaryColumnWidthFraction`
- `repeat`
- `repeatCount`
- `right`
- `rightButtonPadding`
- `rightTrackLeftCap`
- `rightTrackTopCap`
- `rightWidth`
- `rotate`
- `rowCount`
- `rowHeight`
- `scale`
- `scaleX`
- `scaleY`
- `sectionHeaderTopPadding`
- `separatorHeight`
- `shadowRadius`
- `shiftMode`
- `targetImageHeight`
- `targetImageWidth`
- `timeout`
- `titlePadding`
- `top`
- `verticalMargin`
- `width`
- `xOffset`
- `yOffset`
- `zIndex`
- `zoomScale`

## Read-only output excluded since 7.20.1

Published 7.20.0 included `statusBarHeight`, `uprightHeight` and `uprightWidth` in the configurable catalog. These SDK values are read-only. PurgeTSS 7.20.1 uses the regenerated Completions `readOnly` flag and no longer emits setters for them; read their values from the appropriate SDK object instead. Shared names remain eligible when at least one SDK type is writable, so verify the owning type before assigning them. The generated index records the published 7.20.1 catalog.

## Custom Rules and Ti Elements

Create your own custom rules and include Ti Elements with any number of attributes or conditional statements. See [Custom Rules](./custom-rules.md) for rule syntax and examples.

## Community-Discovered Patterns

The following notes come from community experience applying PurgeTSS configurable properties against Titanium's native layout constraints. They are not part of the official reference but prevent common mistakes.

> **ℹ️ `backgroundGradient`**
> For custom gradient rules, `backgroundGradient.colors` can use arrays of `{ color, offset }` objects. Since v7.10.0, nested `backgroundGradient` / `backgroundSelectedGradient` objects under `theme` or `theme.extend` flatten into kebab-case class suffixes (e.g. `brand-primary-warm`).

> **WARNING: Titanium Padding Constraint**
> Titanium does not support native `padding` on `View`, `Window`, `ScrollView`, or `TableView`. Even if `padding*` is configurable, use margins on children for those elements.

> **WARNING: Width Fill Constraint**
> For full-width Titanium layouts, prefer `w-screen` (`Ti.UI.FILL`) instead of `w-full` (`100%`).
