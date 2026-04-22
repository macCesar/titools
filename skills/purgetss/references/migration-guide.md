# Migration Guide

This guide mirrors the official PurgeTSS changelog (see the project `README.md` / `docs/index.md`). It walks through the upgrade-relevant changes from v7.2.6 through v7.6.0, flags breaking changes, and links each section to the reference files that cover the new surface area in depth.

Changelog source of truth: [https://github.com/macCesar/purgeTSS](https://github.com/macCesar/purgeTSS).

---

## Upgrade to v7.6.0

v7.6.0 introduces three new CLI commands for app-asset generation plus two new `config.cjs` sections. None of the additions are breaking — existing projects continue to work untouched, and the new config sections are auto-injected on first run.

### New CLI commands

- **`brand` command** — generates the complete Titanium branding set (launcher icons, adaptive icons, iOS 18+ Dark and Tinted variants, marketplace artwork, optional notification and splash images) from logos auto-discovered in `./purgetss/brand/`. Works on both Alloy and Classic projects.
- **`images` command** — generates multi-density UI images (Android `res-*` densities plus iPhone `@1x` / `@2x` / `@3x` scales) from sources dropped into `./purgetss/images/`. Subdirectories are preserved, and short-path scope targeting lets you re-process individual files.
- **`semantic` command** — generates Titanium semantic colors (Light/Dark mode) into `app/assets/semantic.colors.json`. Two dispatch modes:
  - **Tonal palette** (default): one base hex → 11 shades with mirror inversion and auto config mapping.
  - **Single purpose-based color** (`--single`): explicit per-mode hex plus optional alpha; writes both the JSON entry AND a class mapping in `config.cjs` in one shot. Class name is auto-derived by stripping the `Color` suffix (e.g. `surfaceColor` → class `surface`). Smart in-place updates when a single name matches an existing palette shade.

### New `config.cjs` sections

- **`brand:` section** — configures padding percentages, background colors, and platform targets for the `brand` command.
- **`images:` section** — configures scale factors and output density mapping for the `images` command.

Percentages can be written as self-documenting strings (e.g. `'15%'`) or plain numbers. Both are accepted. These sections are auto-injected into older `config.cjs` files on the first run of v7.6.0.

### What to review

- If you previously generated app icons or multi-density images manually (or with third-party tooling), plan a migration session to replace that workflow with `brand` and `images`.
- If you maintain a `semantic.colors.json` by hand, back it up before running `semantic` — the command does smart in-place updates, but a backup is cheap insurance.

### Cross-references

- [`app-branding.md`](./app-branding.md) — full walkthrough of the `brand` command and the `./purgetss/brand/` convention.
- [`multi-density-images.md`](./multi-density-images.md) — `images` command, density mapping, and subdirectory behavior.
- [`semantic-colors.md`](./semantic-colors.md) — palette vs single-color modes, alpha handling, and config mapping.
- [`cli-commands.md#brand-command`](./cli-commands.md#brand-command)
- [`cli-commands.md#images-command`](./cli-commands.md#images-command)
- [`cli-commands.md#semantic-command`](./cli-commands.md#semantic-command)

---

## Upgrade to v7.5.3

v7.5.3 is a feature-and-polish release. No breaking changes.

### Added

- **Appearance module** — a new `Appearance` export for Light/Dark/System mode switching with persistence. Exposed methods: `init()`, `set(mode)`, `get()`, `toggle()`.
- **Default font family classes** — `font-sans`, `font-serif`, and `font-mono` are generated automatically with platform-appropriate values (system sans, serif, and monospace stacks for iOS and Android).
- **XML validation** — the pre-validation pass now detects illegal `--` sequences inside XML comments, which previously produced cryptic downstream errors.

### What to review

- If you want runtime theme switching, wire up `Appearance.init()` at app boot and use `Appearance.toggle()` or `Appearance.set('dark')` where the UI exposes the control.
- If you had custom `font-sans` / `font-serif` / `font-mono` classes in `config.cjs`, check for collisions with the new auto-generated ones.

### Cross-references

- [`appearance-module.md`](./appearance-module.md) — full `Appearance` API, persistence behavior, and integration patterns.

---

## Upgrade to v7.5.0

v7.5.0 adds `extend` support for component defaults and improves how `apply` directives are normalized. It also bumps Font Awesome. No breaking changes.

### Added

- **`extend` support for Window, View, and ImageView** — customize component defaults from `theme.extend` in `config.cjs`. Previously only a subset of components supported `extend`.
- **Shorthand `apply`** — `{ apply: '...' }` is automatically normalized, so the `default:` wrapper is now optional.
- **Property deduplication** — values pulled in via `apply` now win over static defaults instead of producing duplicate property entries in the generated TSS.
- **Automatic platform resolution** — classes referenced inside `ios:` / `android:` blocks automatically find their platform-specific version instead of requiring explicit disambiguation.
- **Font Awesome 7.2.0** bundled.

### Fixed

- `extend.Window` was silently ignored in earlier versions — now honored.
- Duplicate `font` properties in generated output.
- Array-type properties generating output without `[ ]` notation.

### What to review

- If you previously worked around the `extend.Window` bug with manual TSS overrides, you can remove those now.
- If you previously wrote `{ default: { apply: '...' } }`, the shorter `{ apply: '...' }` form is equivalent.
- Diff your generated `utilities.tss` against the pre-upgrade version: property deduplication and the array-notation fix may produce cleaner output, which is expected.

### Cross-references

- [`customization-deep-dive.md`](./customization-deep-dive.md) — `theme.extend` patterns for Window, View, and ImageView defaults.
- [`apply-directive.md`](./apply-directive.md) — shorthand `apply` syntax and deduplication behavior.

---

## Upgrade to v7.4.0

v7.4.0 is the **Animation module expansion**. Nine new methods bring the Animation module to 15 total.

### Added

- **New methods**: `transition`, `pulse`, `sequence`, `swap`, `shake`, `snapTo`, `reorder`, `undraggable`, `detectCollisions`.
- **New utility classes**: `snap-back`, `snap-center`, `snap-magnet`, `keep-z-index`.
- **Delta-based drag for transformed views** — drag math now works correctly when the view already has a 2D transform applied.
- **Position normalization** and **property inheritance** from the Animation object — reduces boilerplate when sequencing multiple animations on the same view.

### What to review

- If you previously hand-rolled sequential animations with `Ti.UI.createAnimation` callbacks, consider porting them to `sequence` for readability.
- If you implemented ad-hoc drag/snap logic, compare it with `snapTo` + `detectCollisions` — the new pipeline handles z-index, collision detection, and snap-back without manual bookkeeping.

### Cross-references

- [`animation-system.md`](./animation-system.md) — full Animation module reference including all 15 methods and the snap / drag / collision utilities.

---

## Upgrade to v7.3.x

v7.3.0 introduced a **breaking file rename** plus XML validation and Classic Titanium compatibility improvements.

### Breaking Changes

- **`tailwind.tss` → `utilities.tss`** — the generated utilities output was renamed to reflect that PurgeTSS is a standalone toolkit, not a Tailwind port.
  - Generated file: `purgetss/styles/utilities.tss`
  - Distribution file: `dist/utilities.tss`

### Major Improvements

- **XML syntax validation** — pre-validation now catches malformed Alloy XML before processing, with line numbers and fix suggestions.
- **Classic Titanium compatibility** — `deviceInfo()` now works in both Alloy and Classic projects. The dependency on `Alloy.isTablet` and `Alloy.isHandheld` was removed.

### Required Actions

1. Update any scripts, docs, or project references that still point to the previous `tailwind.tss` filename.
2. Ensure your environment is running Node.js 20 or higher.
3. If you use Font Awesome 7, verify the project after upgrade so PurgeTSS can handle the new `--fa:` properties.

```bash
# Current path
purgetss/styles/utilities.tss
```

### Recommended upgrade command

```bash
npm install -g purgetss@latest
```

If you run into issues after upgrading:

```bash
npm uninstall -g purgetss
npm install -g purgetss
```

---

## Upgrade to v7.2.7

v7.2.7 is a security and maintenance release.

### Added / Updated

- **Security fixes** — command injection in `glob`, prototype pollution in `js-yaml`.
- **Dependency cleanup** — reduces installation size by ~45MB, removed unused packages.
- **Titanium SDK 13.1.0.GA** — new utility classes for `navBarColor`, `forceBottomPosition`, `multipleWindows`.

### What to review

- If you pinned PurgeTSS to a pre-7.2.7 version for reproducibility, plan the bump: the security advisories affect any environment that resolves transitive `glob` or `js-yaml`.

---

## Upgrade to v7.2.6

v7.2.6 is a minor refresh release.

### Updated

- Font Awesome bumped to version 7.1.0.
- Simplified flag property names in `utilities.tss`.

---

## Community-Discovered Patterns

Issues reported and patched outside the official changelog. These are documented here so users upgrading through multiple versions know to re-test the affected surface area. **Needs confirmation** — the version in which each fix shipped has not been verified against the official changelog at time of writing.

### `backgroundGradient.colors` serialization with arrays of objects

Certain versions of PurgeTSS could produce broken output in `utilities.tss` when a custom rule defined `backgroundGradient.colors` as an array of `{ color, offset }` objects, for example:

```javascript
const colors = [
  { color: '#132C50', offset: 0 },
  { color: '#0A1529', offset: 1 },
];
```

If you previously worked around this by inlining the gradient directly in TSS, re-test after upgrading: current versions serialize the array correctly. The exact version in which this was patched is not called out in the official changelog — treat this as a user-observed fix until confirmed.

---

## Quick Checklist

- Replace every legacy `tailwind.tss` reference with `utilities.tss`.
- Verify Node.js 20+ before upgrading past v7.3.0.
- Rebuild after updating `config.cjs` or custom gradient rules.
- Re-test any Classic Titanium code that depends on `deviceInfo()`.
- After v7.5.0: diff generated `utilities.tss` to confirm property deduplication produces the expected output.
- After v7.5.3: consider wiring `Appearance.init()` at app boot if you want runtime Light/Dark switching.
- After v7.6.0: run `brand`, `images`, and `semantic` once in a scratch project before pointing them at production assets, so you can preview the output layout.
