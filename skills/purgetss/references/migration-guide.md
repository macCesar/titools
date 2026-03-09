# Migration Guide

This guide is based on the PurgeTSS changelog sections in the official `README.md`. It covers the documented upgrade changes for recent versions.

## Upgrade to v7.4.0

PurgeTSS v7.4.0 includes a bug fix and documentation improvements.

### Fixed

- `backgroundGradient.colors` serialization now correctly handles arrays of objects in custom rules.

Before the fix, a config such as:

```javascript
colors: [
  { color: '#132C50', offset: 0 },
  { color: '#0A1529', offset: 1 }
]
```

could produce broken output in `utilities.tss`.

Now it serializes correctly.

### What to Review

- Re-test any custom classes that define `backgroundGradient.colors` with `{ color, offset }` objects.
- Rebuild and inspect `utilities.tss` if you previously worked around this bug manually.

## Upgrade to v7.3.x

PurgeTSS v7.3 introduced a file rename and improved error handling.

### Breaking Changes

- The generated utilities output is now `utilities.tss`.
  - Generated file: `purgetss/styles/utilities.tss`
  - Distribution file: `dist/utilities.tss`

### Major Improvements

- XML syntax validation now catches malformed Alloy XML before processing.
- `deviceInfo()` now works in both Alloy and Classic Titanium projects.
- The dependency on `Alloy.isTablet` and `Alloy.isHandheld` was removed.

### Required Actions

1. Update any scripts, docs, or project references that still point to the previous output filename.
2. Ensure your environment is running Node.js 20 or higher.
3. If you use Font Awesome 7, verify the project after upgrade so PurgeTSS can handle the new `--fa:` properties.

```bash
# Current path
purgetss/styles/utilities.tss
```

### Recommended Upgrade Command

```bash
npm install -g purgetss@latest
```

If you run into issues after upgrading:

```bash
npm uninstall -g purgetss
npm install -g purgetss
```

## Quick Checklist

- Replace every legacy utilities filename reference with `utilities.tss`.
- Verify Node.js 20+ before upgrading.
- Rebuild after updating `config.cjs` or custom gradient rules.
- Re-test any Classic Titanium code that depends on `deviceInfo()`.
