# Alloy debugging and troubleshooting

## Debugging

### Compiler error messages

The Alloy compiler reports syntax errors in JavaScript, JSON, TSS, and XML. Error messages include:
- File path
- Line and character position
- Description of the error

## Troubleshooting

### Error: No app.js found

**Error:** `[ERROR] No app.js found. Ensure the app.js file exists in your project's Resources directory.`

**Solution:** If part of the contents of your `Resources` folder were deleted, run:
```bash
alloy compile --config platform=<platform>
```

### Android: images, HTML, and assets not displaying

**Problem:** Assets display on iOS and Mobile Web but not Android.

**Solution:** Android requires absolute paths. Precede asset paths with a slash ('/'). iOS and Mobile Web accept both relative and absolute paths.

### Android runtime error: cannot call method of undefined

**Error:** `Uncaught TypeError: Cannot call method xxx of undefined`

**Causes:**
1. Creating an iOS-only Titanium object. Use the `platform` attribute in views to enforce platform-specific objects.
2. Top-level UI component has an assigned ID. The controller cannot use `$.<controller_name>` to reference it; use the assigned ID instead.

### Android runtime error: Alloy is not defined

**Error:** `Uncaught ReferenceError: Alloy is not defined`

**Cause:** Non-controller JavaScript files are not automatically wrapped by Alloy. See [best_practices.md](best_practices.md) for the safe require pattern for non-controller files.

**Solution:** Require the 'alloy' module:
```javascript
const Alloy = require('alloy');
```

### iOS application error: invalid method passed to UIModule

**Error:** `invalid method (xxx) passed to UIModule (unknown file)`

**Cause:** Trying to create an Android-only Titanium object.

**Solution:** Use the `platform` attribute in the view to enforce platform-specific objects.

### iOS application error: undefined is not an object

**Error:** `undefined is not an object (evaluating $.xxx.open) (unknown file)`

**Cause:** Top-level UI component has an assigned ID in XML markup.

**Solution:** The controller cannot use `$.<controller_name>` to reference it; use the assigned ID instead.

## Getting help

Use the [TiDev Community Slack](https://slack.tidev.io/) or [GitHub Discussions](https://github.com/tidev/titanium-sdk/discussions):
- Include 'alloy' as a tag
- Include the Alloy version (run `alloy --version`)
- Include platform information

## Submitting a bug report

Search [existing issues](https://github.com/tidev/alloy/issues) first to avoid duplicates. If none match, create a new issue:
- Select 'Alloy' as the component
- Include Alloy version (`alloy --version`)
- Include environment information

For detailed instructions, see [How to Report a Bug or Make a Feature Request](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Contributing_to_Titanium/How_to_Report_a_Bug_or_Make_a_Feature_Request/).
