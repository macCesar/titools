# Configurable Properties

This reference captures the exhaustive properties subsection from the official configuration guide. Add these under `theme` in `config.cjs`, or extend them under `theme.extend` when appropriate.

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
- `badgeColor`
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
- `navigationIconColor`
- `navTintColor`
- `onTintColor`
- `pageIndicatorColor`
- `pagingControlColor`
- `pullBackgroundColor`
- `resultsBackgroundColor`
- `resultsSeparatorColor`
- `selectedBackgroundColor`
- `selectedButtonColor`
- `selectedColor`
- `selectedSubtitleColor`
- `selectedTextColor`
- `separatorColor`
- `shadowColor`
- `statusBarBackgroundColor`
- `subtitleColor`
- `subtitleTextColor`
- `tabsBackgroundColor`
- `tabsBackgroundSelectedColor`
- `thumbTintColor`
- `tint`
- `tintColor`
- `titleAttributes`
- `titleColor`
- `titleTextColor`
- `touchFeedbackColor`
- `trackTintColor`
- `viewShadowColor`

> **️ℹ️ `backgroundGradient`**
> For custom gradient rules, `backgroundGradient.colors` can use arrays of `{ color, offset }` objects. PurgeTSS v7.4.0 fixed serialization for those nested object arrays in `utilities.tss`.

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
- `indentionLevel`
- `keyboardToolbarHeight`
- `left`
- `leftButtonPadding`
- `leftTrackLeftCap`
- `leftTrackTopCap`
- `leftWidth`
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
- `scalesPageToFit`
- `scaleX`
- `scaleY`
- `sectionHeaderTopPadding`
- `separatorHeight`
- `shadowRadius`
- `shiftMode`
- `timeout`
- `top`
- `uprightHeight`
- `uprightWidth`
- `verticalMargin`
- `width`
- `xOffset`
- `yOffset`
- `zIndex`
- `zoomScale`

> **⚠️ Titanium Padding Constraint**
> Titanium does not support native `padding` on `View`, `Window`, `ScrollView`, or `TableView`. Even if `padding*` is configurable, use margins on children for those elements.

> **⚠️ Width Fill Constraint**
> For full-width Titanium layouts, prefer `w-screen` (`Ti.UI.FILL`) instead of `w-full` (`100%`).

## Custom Rules and Ti Elements

Create your own custom rules and include Ti Elements with any number of attributes or conditional statements. See [Custom Rules](./custom-rules.md) for rule syntax and examples.
