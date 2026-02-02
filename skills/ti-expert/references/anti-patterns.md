# Titanium Alloy Anti-Patterns

## 1. Inline Styling Instead of TSS
**Symptom:** Using inline attributes like `backgroundColor="#fff"` directly in XML views.
**Problem:** Inline attributes make theme changes impossible and scatter visual definitions across views.
**Solution:** Define styles in TSS files using IDs or class selectors.

## 2. Fat Controllers
**Symptom:** Controllers with 100+ lines handling logic, API, and UI.
**Solution:** Delegate business logic to `lib/services/` and API calls to `lib/api/`.

## 3. Memory Leaks (Missing Cleanup)
**Symptom:** Adding `Ti.App` or `Alloy.Collections` listeners without a `cleanup()` function.
**Solution:** Always implement `$.cleanup = cleanup` and remove listeners there.

## 4. Direct Native Module Calls
**Symptom:** Calling `require('ti.module')` directly in a controller.
**Solution:** Wrap it in a service in `lib/services/` (e.g., `audioService.js`).

## 5. Direct Controller Navigation
**Symptom:** `Alloy.createController('name').getView().open()`.
**Solution:** Use a Navigation Service to centralize `open/close` and trigger the `cleanup()` function automatically.

## 6. Complex Matrix Animations
**Symptom:** Manual use of `Ti.UI.create2DMatrix()` for simple animations.
**Solution:** Use `Ti.UI.createAnimation()` for opacity, transform, and duration-based animations. Reserve 2D Matrix for complex multi-property transforms.

## 7. Hardcoded Strings & Missing a11y
**Symptom:** `text="Login"` instead of `text="L('login')"`, or missing `accessibilityLabel`.
**Solution:** Always use i18n and accessibility properties.

## 8. Logic in TSS
**Symptom:** Using conditionals or calculations inside TSS.
**Solution:** Keep styling declarative in TSS files.

---

## Titanium Layout Anti-Patterns

## 9. Padding on Container Views
**Symptom:** Setting `padding` on View, Window, ScrollView, or TableView.
**Problem:** Base container elements don't support padding in Titanium.
**Solution:** Use margins on children instead:
```tss
/* WRONG */
"#container": { padding: 16 }

/* CORRECT - margin on children */
"#childLabel": { left: 16, top: 16, right: 16 }
```

## 10. Redundant Composite Layout
**Symptom:** Adding `layout: 'composite'` to Views.
**Problem:** Composite (absolute positioning) is the DEFAULT layout. Setting it is redundant.
**Solution:** Omit `layout` for composite, only specify `layout: 'horizontal'` or `layout: 'vertical'` when needed.

## 11. Using `lib/` Prefix in Require Statements
**Symptom:** `const service = require('lib/services/picsum')`
**Problem:** Alloy flattens the `lib/` folder during build. Files in `app/lib/services/` become `Resources/iphone/services/`.
**Solution:** Omit the `lib/` prefix: `const service = require('services/picsum')`

## 12. Wrong Window ID in Controller
**Symptom:** Using `$.index.open()` when the Window has `id="mainWindow"`.
**Problem:** Alloy generates `$` references from XML IDs. If Window is `id="mainWindow"`, `$.index` doesn't exist.
**Solution:** Match the ID: `$.mainWindow.open()`

## 13. Using `Ti.UI.createNotification`
**Symptom:** `Ti.UI.createNotification({ message: 'Hi' }).show()`
**Problem:** This API doesn't exist in Titanium. Causes "invalid method" error.
**Solution:** Use `Ti.UI.createAlertDialog` for simple messages, or create custom toast views.

## 14. Using Nonexistent iOS Share APIs
**Symptom:** `Ti.UI.iOS.createActivityPopover` or `alloy/social` with wrong methods.
**Problem:** These APIs either don't exist or have changed. Causes runtime errors.
**Solution:**
- iOS: Use `Ti.UI.iOS.createDocumentViewer` for files, or simple `Ti.UI.createOptionDialog` + `Ti.UI.Clipboard` for links
- Android: Use `Ti.Android.createIntent` with ACTION_SEND

---

## Quick Reference Table

| Anti-Pattern            | Why It Fails             | Correct Approach      |
| ----------------------- | ------------------------ | --------------------- |
| `padding` on View       | No padding on containers | Margins on children   |
| `layout: 'composite'`   | Already default          | Omit it               |
| Inline style attributes | Scattered styling        | Define in TSS files   |
| `lib/` prefix           | lib/ is flattened        | Use path without lib/ |
| `$.index.open()`        | Wrong ID reference       | Use actual Window ID  |
| `createNotification`    | API doesn't exist        | `createAlertDialog`   |
