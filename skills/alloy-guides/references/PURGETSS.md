# PurgeTSS

<!-- AUDIT-SKIP: This file is manually maintained against the PurgeTSS toolkit's own README at https://purgetss.com, NOT against `Alloy_PurgeTSS.md` upstream in `tidev/titanium-docs`. The auditor must skip this file during automated syncs. Update only when explicitly instructed. -->

> **Note for auditors and maintainers:** this reference is sourced from the PurgeTSS toolkit's own documentation at [purgetss.com](https://purgetss.com), not from the official Alloy docs page (`Alloy_PurgeTSS.md`). Do **not** auto-sync this file against `tidev/titanium-docs` — its content lives in a different upstream and only updates when the PurgeTSS toolkit ships new releases.

## Overview

PurgeTSS is a toolkit for building mobile apps with the [Titanium framework](https://titaniumsdk.com). It adds practical utilities for styling and setup work.

It includes utility classes, icon font support, an Animation module, a simple grid system, and the `shades` command for generating custom colors.

If you build UI-heavy screens, PurgeTSS keeps you from hand-writing long TSS files.

## What it does

- 23,300+ utility classes for colors, spacing, typography, layout, and more.
- Parses XML files and writes an `app.tss` with only the classes you use.
- Customizable through `config.cjs`, with arbitrary values for one-off sizes and colors.
- Icon fonts for Buttons and Labels: Font Awesome, Material Icons, Material Symbols, and Framework7-Icons.
- `build-fonts` command generates `fonts.tss` with class definitions and `fontFamily` selectors for any font you drop in.
- `shades` command generates color palettes from a hex value.
- Animation module with 2D transforms, draggable views with collision detection, sequential animations, and position utilities.
- Grid system for aligning and distributing elements in rows and columns.

## Table of Contents

- [Installation](https://purgetss.com/docs/Installation.md)
- [Commands](https://purgetss.com/docs/Commands.md)
- App Assets
  - [App icons and branding](https://purgetss.com/docs/app-assets/1-app-icons-and-branding.md)
  - [Multi-density images](https://purgetss.com/docs/app-assets/2-multi-density-images.md)
- Customization
  - [The Config File](https://purgetss.com/docs/customization/1-configuring-guide.md)
  - [Custom Rules](https://purgetss.com/docs/customization/2-custom-rules.md)
  - [The `apply` Directive](https://purgetss.com/docs/customization/3-the-apply-directive.md)
  - [The `opacity` Modifier](https://purgetss.com/docs/customization/4-Opacity.md)
  - [Arbitrary Values](https://purgetss.com/docs/customization/5-arbitrary-values.md)
  - [Platform and Device Modifiers](https://purgetss.com/docs/customization/6-platform-and-device-modifiers.md)
  - [Icon Fonts Libraries](https://purgetss.com/docs/customization/7-icon-fonts-libraries.md)
- The UI Module
  - [Introduction](https://purgetss.com/docs/purgetss-ui/1-introduction.md)
  - [The `play` Method](https://purgetss.com/docs/purgetss-ui/2-the-play-method.md)
  - [The `apply` Method](https://purgetss.com/docs/purgetss-ui/3-the-apply-method.md)
  - [The `open` and `close` Methods](https://purgetss.com/docs/purgetss-ui/4-the-open-close-methods.md)
  - [The `draggable` Method](https://purgetss.com/docs/purgetss-ui/5-the-draggable-method.md)
  - [Complex UI Elements](https://purgetss.com/docs/purgetss-ui/7-complex-ui-elements.md)
  - [Additional Methods](https://purgetss.com/docs/purgetss-ui/6-additional-methods.md)
  - [Available Utilities](https://purgetss.com/docs/purgetss-ui/8-available-utilities.md)
  - [Implementation Rules](https://purgetss.com/docs/purgetss-ui/9-implementation-rules.md)
  - [Appearance](https://purgetss.com/docs/purgetss-ui/10-appearance.md)
- Best Practices
  - [Appearance Setup](https://purgetss.com/docs/best-practices/1-appearance-setup.md)
  - [Semantic Colors](https://purgetss.com/docs/best-practices/2-semantic-colors.md)
  - [Large Titles on iOS](https://purgetss.com/docs/best-practices/3-large-titles-on-ios.md)
  - [Values and Units](https://purgetss.com/docs/best-practices/4-values-and-units.md)
- [Grid System](https://purgetss.com/docs/grid-system.md)
