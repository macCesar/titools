# Alloy Debugging and Troubleshooting

## Overview

This guide covers debugging and troubleshooting Alloy applications.

## Debugging

### Compiler Error Messages

The Alloy compiler generates error messages for syntax errors in JavaScript, JSON, TSS and XML files. Error messages report:
- File path
- Line and character position
- Description of the error

## Troubleshooting

### Error: No app.js Found

**Error:** `[ERROR] No app.js found. Ensure the app.js file exists in your project's Resources directory.`

**Solution:** If part of the contents of your `Resources` folder were deleted, run:
```bash
alloy compile --config platform=<platform>
```

### Android: Images, HTML and Assets Not Displaying

**Problem:** Assets display on iOS and Mobile Web but not Android.

**Solution:** Android requires absolute paths. Precede asset paths with a slash ('/'). iOS and Mobile Web accept both relative and absolute paths.

### Android Runtime Error: Cannot Call Method of Undefined

**Error:** `Uncaught TypeError: Cannot call method xxx of undefined`

**Causes:**
1. Creating an iOS-only Titanium object. Use the `platform` attribute in views to enforce platform-specific objects.
2. Top-level UI component has an assigned ID. The controller cannot use `$.<controller_name>` to reference it; use the assigned ID instead.

### Android Runtime Error: Alloy is Not Defined

**Error:** `Uncaught ReferenceError: Alloy is not defined`

**Cause:** Non-controller JavaScript files are not automatically wrapped by Alloy.

**Solution:** Require the 'alloy' module:
```javascript
var Alloy = require('alloy');
```

### iOS Application Error: Invalid Method Passed to UIModule

**Error:** `invalid method (xxx) passed to UIModule (unknown file)`

**Cause:** Trying to create an Android-only Titanium object.

**Solution:** Use the `platform` attribute in the view to enforce platform-specific objects.

### iOS Application Error: Undefined is Not an Object

**Error:** `undefined is not an object (evaluating $.xxx.open) (unknown file)`

**Cause:** Top-level UI component has an assigned ID in XML markup.

**Solution:** The controller cannot use `$.<controller_name>` to reference it; use the assigned ID instead.

## Getting Help

Use the [Titanium Community Questions and Answers Forum](https://developer.axway.com/develop-apps#DevelopApps_Engage):
- Include 'alloy' as a tag
- Include the Alloy version (run `alloy --version`)
- Include platform information

## Submitting a Bug Report

Use [GitHub Issues](https://github.com/tidev/alloy/issues):
- Select 'Alloy' as the component
- Include Alloy version (`alloy --version`)
- Include environment information

See "How to Report a Bug or Make a Feature Request" for more details.
