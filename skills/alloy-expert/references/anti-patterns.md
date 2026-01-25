# Titanium Alloy + PurgeTSS Anti-Patterns

## 1. Manual Styling (Legacy & Overwrite Risk)
**Symptom:** Editing `app.tss` manually or using inline attributes like `backgroundColor="#fff"`.
**Problem:** PurgeTSS will overwrite manual changes in `app.tss`. Inline attributes make theme changes impossible.
**Solution:** Use **PurgeTSS classes** in XML.

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
**Symptom:** Manual use of `Ti.UI.create2DMatrix()`.
**Solution:** Use the **PurgeTSS Animation Module** (`animation.apply($.view, 'fade-in')`).

## 7. Hardcoded Strings & Missing a11y
**Symptom:** `text="Login"` instead of `text="L('login')"`, or missing `accessibilityLabel`.
**Solution:** Always use i18n and accessibility properties.

## 8. Logic in TSS
**Symptom:** Using conditionals or calculations inside TSS.
**Solution:** Keep styling declarative through PurgeTSS classes.

---

## PurgeTSS-Specific Anti-Patterns

## 9. Flexbox Classes (Don't Exist)
**Symptom:** Using `flex-row`, `flex-col`, `justify-between`, `justify-center`, `items-center`.
**Problem:** Titanium does NOT support CSS Flexbox. These classes don't exist in PurgeTSS.
**Solution:** Use Titanium layout modes:
```xml
<!-- WRONG -->
<View class="flex-row justify-between">

<!-- CORRECT -->
<View class="horizontal">
```

## 10. Padding on Container Views
**Symptom:** Using `p-4`, `px-2`, `py-3` on View, Window, ScrollView, or TableView.
**Problem:** Base container elements don't support padding in Titanium.
**Solution:** Use margins on children instead:
```xml
<!-- WRONG -->
<View class="p-4">
  <Label text="Hello" />
</View>

<!-- CORRECT -->
<View>
  <Label class="m-4" text="Hello" />
</View>
```

## 11. Using `w-full` Instead of `w-screen`
**Symptom:** Using `w-full` expecting full width.
**Problem:** `w-full` does NOT exist in PurgeTSS. Views default to `Ti.UI.SIZE`.
**Solution:** Use `w-screen` for full width, `wh-screen` for full width + height.

## 12. Using `rounded-full` Without Size
**Symptom:** Using `rounded-full` expecting a circle.
**Problem:** `rounded-full` doesn't exist. You need `rounded-full-XX` where XX × 4 = element size.
**Solution:** For a 48×48 circle, use `rounded-full-12` (12 × 4 = 48).

## 13. Adding `composite` Class Explicitly
**Symptom:** Adding `class="composite"` to Views.
**Problem:** Composite (absolute positioning) is the DEFAULT layout. Adding it is redundant.
**Solution:** Omit layout class for composite, only use `horizontal` or `vertical` when needed.

## 14. Square Brackets for Arbitrary Values
**Symptom:** Using `w-[100px]` or `bg-[#ff0000]` with square brackets.
**Problem:** PurgeTSS uses parentheses, not square brackets (Tailwind syntax).
**Solution:** Use parentheses: `w-(100px)`, `bg-(#ff0000)`.

## 15. Creating Manual .tss Files Per Controller
**Symptom:** Creating `app/styles/login.tss`, `app/styles/profile.tss`, etc.
**Problem:** Defeats the purpose of PurgeTSS which auto-generates a single optimized `app.tss`.
**Solution:** Use ONLY utility classes in XML. Delete all manual `.tss` files except `_app.tss`.

---

## Quick Reference Table

| Anti-Pattern | Why It Fails | Correct Approach |
|--------------|--------------|------------------|
| `flex-row` | Flexbox not supported | `horizontal` |
| `flex-col` | Flexbox not supported | `vertical` |
| `justify-*` | Flexbox not supported | Use margins/positioning |
| `p-4` on View | No padding on containers | `m-4` on children |
| `w-full` | Doesn't exist | `w-screen` |
| `rounded-full` | Needs size suffix | `rounded-full-12` |
| `composite` class | Already default | Omit it |
| `w-[100px]` | Wrong syntax | `w-(100px)` |
| Manual `.tss` | Overwritten by PurgeTSS | Use utility classes |