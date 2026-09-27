# Configurable Properties

This reference lists all customizable properties from the official PurgeTSS configuration guide. Add these under `theme` in `config.cjs` to override defaults, or under `theme.extend` to add new values while keeping defaults.

The lists below also include properties that PurgeTSS v7.17.1 generates classes for but the official guide omits (e.g. `badgeBackgroundColor`, `statusBarColor`, `letterSpacing`, `titlePadding`). `scalesPageToFit` appears in the official configurable list but is a Boolean property: it only generates `.scales-page-to-fit` and `.scales-page-to-fit-false`.

## Global Properties

- All color properties inherit from `theme.colors`.
- All spacing properties inherit from `theme.spacing`.

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
- `maxLines`
- `maxRowHeight`
- `maxZoomScale`
- `minimumFontSize`
- `minimumLineHeight`
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
- `statusBarHeight`
- `targetImageHeight`
- `targetImageWidth`
- `timeout`
- `titlePadding`
- `top`
- `uprightHeight`
- `uprightWidth`
- `verticalMargin`
- `width`
- `xOffset`
- `yOffset`
- `zIndex`
- `zoomScale`

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
