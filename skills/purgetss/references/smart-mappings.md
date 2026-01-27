# Smart Mappings & Platform Realities

PurgeTSS maps CSS-like utilities to native Titanium properties. Understanding these "Smart Mappings" is key to predictable layouts and cross-platform consistency.

## Table of Contents

- [Smart Mappings \& Platform Realities](#smart-mappings--platform-realities)
  - [Table of Contents](#table-of-contents)
  - [1. The "Gap" Utility (Double Spacing)](#1-the-gap-utility-double-spacing)
  - [2. Hybrid Shadows (iOS vs. Android)](#2-hybrid-shadows-ios-vs-android)
  - [3. Grid Container Width](#3-grid-container-width)
  - [4. Native Rotations](#4-native-rotations)
  - [5. Z-Index vs Stacking Order](#5-z-index-vs-stacking-order)

---

## 1. The "Gap" Utility (Double Spacing)
In PurgeTSS, `gap` is mapped to **external margins** (`top`, `right`, `bottom`, `left`) because Titanium lacks a native CSS-style gap property.
- **Behavior**: `.gap-4` adds 16dp to **all** sides of the element.
- **Critical Difference**: In web CSS, gap only exists *between* elements. In PurgeTSS, two siblings with `.gap-4` will have **32dp** of space between them (16dp from each).
- **Solution**: Use `.gap-x-` or `.gap-y-` for more granular control, or use specific margins (`ml-`, `mt-`) if you need exact CSS-style spacing.

## 2. Hybrid Shadows (iOS vs. Android)
Shadow utilities (`.shadow-md`, etc.) provide a cross-platform visual depth by mapping different native properties in a single class:
- **iOS**: Uses `viewShadowOffset`, `viewShadowRadius`, and `viewShadowColor`.
- **Android**: Uses the `elevation` property.
- **Z-Order Warning**: On Android, `elevation` also affects the **Z-order** (stacking) of the view, causing it to appear on top of siblings without elevation. This behavior does **not** happen on iOS.

## 3. Grid Container Width
The `.grid` and `.grid-flow-col` classes automatically include `width: '100%'`.
- **Why**: Since PurgeTSS resets `View` to `SIZE`, a grid container must be forced to `100%` (or `FILL`) so that children using percentage widths (like `.col-span-6`) have a parent dimension to calculate against.
- **Manual Overrides**: If you need a grid that only occupies the size of its content, you must explicitly use `wh-auto`.

## 4. Native Rotations
The `.rotate-X` utilities map directly to Titanium's `rotate` property.
- **Anchor**: By default, Titanium rotates around the **center** of the component.
- **Matrix**: Unlike web CSS where transformations are often chained (e.g., `transform: rotate(45deg) scale(1.5)`), PurgeTSS/Titanium treats these as direct, separate properties of the view.

## 5. Z-Index vs Stacking Order
- **Class**: `.z-10`, `.z-50`, etc.
- **Mapping**: Maps directly to Titanium's `zIndex` property.
- **Note**: In Titanium, the order in which views are **added** to a parent determines their base stacking order (last added is on top). `zIndex` should be used sparingly for explicit overlays.
