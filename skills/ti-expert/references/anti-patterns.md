# Titanium Alloy anti-patterns

## 1. Inline styling instead of TSS
**Symptom:** Using inline attributes like `backgroundColor="#fff"` directly in XML views. **Problem:** Inline attributes make theme changes impossible and scatter visual definitions across views. **Solution:** Define styles in TSS files using IDs or class selectors.

## 2. Fat controllers
**Symptom:** Controllers with 100+ lines handling logic, API, and UI. **Solution:** Delegate business logic to `lib/services/` and API calls to `lib/api/`.

## 3. Memory leaks (Missing Cleanup)
**Symptom:** Adding `Ti.App` or `Alloy.Collections` listeners without a `cleanup()` function. **Solution:** Always implement `$.cleanup = cleanup` and remove listeners there.

## 4. Direct native module calls
**Symptom:** Calling `require('ti.module')` directly in a controller. **Solution:** Wrap it in a service in `lib/services/` (e.g., `audioService.js`).

## 5. Direct controller navigation
**Symptom:** `Alloy.createController('name').getView().open()`. **Solution:** Use a Navigation Service to centralize `open/close` and trigger the `cleanup()` function automatically.

## 6. Complex matrix animations
**Symptom:** Manual use of `Ti.UI.create2DMatrix()` for simple animations. **Solution:** Use `Ti.UI.createAnimation()` for opacity, transform, and duration-based animations. Reserve 2D Matrix for complex multi-property transforms.

## 7. Hardcoded strings & missing a11y
**Symptom:** `text="Login"` instead of `text="L('login')"`, or missing `accessibilityLabel`. **Solution:** Always use i18n and accessibility properties.

## 8. Logic in TSS
**Symptom:** Using conditionals or calculations inside TSS. **Solution:** Keep styling declarative in TSS files.

---

## Titanium layout anti-patterns

## 9. Padding on container views
**Symptom:** Setting `padding` on View, Window, ScrollView, or TableView. **Problem:** Base container elements don't support padding in Titanium. **Solution:** Use margins on children instead:
```tss
/* WRONG */
"#container": { padding: 16 }

/* CORRECT - margin on children */
"#childLabel": { left: 16, top: 16, right: 16 }
```

## 10. Redundant composite layout
**Symptom:** Adding `layout: 'composite'` to Views. **Problem:** Composite (absolute positioning) is the DEFAULT layout. Setting it is redundant. **Solution:** Omit `layout` for composite, only specify `layout: 'horizontal'` or `layout: 'vertical'` when needed.

## 11. Using `lib/` prefix in require statements
**Symptom:** `const service = require('lib/services/picsum')` **Problem:** Alloy flattens the `lib/` folder during build. Files in `app/lib/services/` become `Resources/iphone/services/`. **Solution:** Omit the `lib/` prefix: `const service = require('services/picsum')`

## 12. Wrong window ID in controller
**Symptom:** Using `$.index.open()` when the Window has `id="mainWindow"`. **Problem:** Alloy generates `$` references from XML IDs. If Window is `id="mainWindow"`, `$.index` doesn't exist. **Solution:** Match the ID: `$.mainWindow.open()`

## 13. Using `Ti.UI.createNotification`
**Symptom:** `Ti.UI.createNotification({ message: 'Hi' }).show()` **Problem:** This API doesn't exist in Titanium. Causes "invalid method" error. **Solution:** Classify the feedback before choosing UI. Use the app's Snackbar Widget for transient foreground feedback, inline/Banner state for persistent conditions, and an app-owned Dialog only for blocking or critical information. Use the supported platform notification APIs only for actual OS notifications. See [Feedback Surfaces](feedback-surfaces.md).

## 14. Using nonexistent iOS share APIs
**Symptom:** `Ti.UI.iOS.createActivityPopover` or `alloy/social` with wrong methods. **Problem:** These APIs either don't exist or have changed. Causes runtime errors. **Solution:**
- Keep sharing system-owned. Use the currently supported Titanium share/document API or native module for the target platform and verify its current contract with the `ti-api` skill.
- Do not imitate a share sheet with an app-owned `OptionDialog`. A Bottom Sheet may choose an app action such as an export format, but the OS share surface owns the final destination.

## Community-Discovered Patterns

### 15. Using extendEdges without autoAdjustScrollViewInsets (iOS)

**Anti-pattern:** Setting `extendEdges: [Ti.UI.EXTEND_EDGE_ALL]` on a Window without also setting `autoAdjustScrollViewInsets: true`.

```javascript
// Wrong: content overlaps behind navigation bar
const win = Ti.UI.createWindow({
  title: 'My Screen',
  largeTitleEnabled: true,
  extendEdges: [Ti.UI.EXTEND_EDGE_ALL]
  // missing autoAdjustScrollViewInsets!
});
```

**Why it's wrong:** `extendEdges` tells iOS to extend the view's content behind the navigation bar and tab bar. Without `autoAdjustScrollViewInsets: true`, iOS does not adjust the ScrollView's content insets, so the scroll content starts at y=0 — directly behind the navigation bar.

**Fix:** Always pair `extendEdges` with `autoAdjustScrollViewInsets`:

```javascript
const win = Ti.UI.createWindow({
  title: 'My Screen',
  largeTitleEnabled: true,
  extendEdges: [Ti.UI.EXTEND_EDGE_ALL],
  autoAdjustScrollViewInsets: true
});
```

These three properties work together: `extendEdges` creates the blur/translucent effect, `autoAdjustScrollViewInsets` prevents content overlap, and `largeTitleEnabled` shows the collapsible large title. Without `extendEdges`, the large title also renders with a visible delay (empty nav bar gap appears first, then the title draws).

This applies to Windows inside both standalone NavigationWindow and TabGroup (which wraps each Tab in an implicit NavigationWindow on iOS).

---

## Quick reference table

| Anti-Pattern            | Why It Fails             | Correct Approach      |
| ----------------------- | ------------------------ | --------------------- |
| `padding` on View       | No padding on containers | Margins on children   |
| `layout: 'composite'`   | Already default          | Omit it               |
| Inline style attributes | Scattered styling        | PurgeTSS utilities when detected; otherwise TSS |
| `lib/` prefix           | lib/ is flattened        | Use path without lib/ |
| `$.index.open()`        | Wrong ID reference       | Use actual Window ID  |
| `createNotification`    | API doesn't exist        | Classify feedback; Snackbar is the transient default |
| `extendEdges` alone     | Content behind nav bar   | Add `autoAdjustScrollViewInsets: true` |
