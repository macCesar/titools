# Contracts for feedback Widgets

Use these contracts for app-owned Snackbar, Dialog, and Bottom Sheet surfaces in
Alloy. Namespaces and visual tokens belong to each app; behavior stays stable.

## Contents

- [Boundary and registration](#boundary-and-registration)
- [Snackbar](#snackbar)
- [Dialog](#dialog)
- [Bottom Sheet](#bottom-sheet)
- [Shared lifecycle contract](#shared-lifecycle-contract)
- [PurgeTSS integration](#purgetss-integration)
- [Widget, Require, state, or native UI](#widget-require-state-or-native-ui)

## Boundary and registration

Implement each surface as an independent Alloy Widget under `app/widgets/`.
Each Widget owns its XML, controller, optional styles, assets, state, listeners,
timers, and `widget.json`. Keep them independent from any third-party component
library — including TiKit, the Alloy/PurgeTSS component set. A feedback surface
must not require one to work, and must not be folded into one: its value comes
from being installable and testable on its own.

Register every Widget in `app/config.json`:

```json
{
  "dependencies": {
    "com.example.ui.bottomsheet": "1.0.0",
    "com.example.ui.dialog": "1.0.0",
    "com.example.ui.snackbar": "1.0.0"
  }
}
```

Use the app's reverse-domain namespace. The dependency key must match the `id`
in that Widget's `widget.json`.

Declare Widgets in XML, normally as the last visual children of the owning
window so overlays render above screen content:

```xml
<Widget id="snackbar" src="com.example.ui.snackbar" />
<Widget id="dialog" src="com.example.ui.dialog" />
<Widget id="bottomSheet" src="com.example.ui.bottomsheet" />
```

Build the stable proxy tree in XML. JavaScript may update properties and supply
`ListView` data; it must not reconstruct the complete surface imperatively.

## Snackbar

```javascript
$.snackbar.show({
  message,
  tone: 'neutral', // neutral | success | warning | error
  duration: 4500,
  actionTitle,
  onAction,
  onDismiss
})

$.snackbar.dismiss()
$.snackbar.destroy()
```

Contract:

- A new message replaces the visible message and restarts the timer.
- Default `duration` is 4500 ms; `duration: 0` remains visible until an action,
  `dismiss()`, replacement, or destruction.
- Allow at most one text action, such as Undo.
- Invoke `onAction` once, then close the Snackbar.
- Invoke `onDismiss` once with the reason `timeout`, `action`, `replaced`,
  `programmatic`, or `destroy`.
- Clear the old timer before replacement and on every close path.
- Position above bottom navigation and inside the current safe area.
- Queueing Snackbars is not the default. The newest relevant message wins.

## Dialog

```javascript
$.dialog.attach(window)

$.dialog.show({
  title,
  message,
  tone: 'neutral', // neutral | warning | error
  confirmTitle,
  cancelTitle,
  destructive: false,
  onConfirm,
  onCancel
})

$.dialog.dismiss('programmatic')
$.dialog.destroy()
```

Contract:

- Without `cancelTitle`, present an acknowledgement. With it, present a
  confirmation.
- Enqueue additional `show()` calls FIFO. Never stack two Dialogs visually.
- Disable both buttons on the first accepted tap.
- Invoke `onConfirm` or `onCancel` at most once; never both.
- Cancel button, Android Back, or allowed backdrop dismissal invokes `onCancel`.
  Android Back closes an acknowledgement as its single dismissal action.
- A destructive confirmation must not close from a backdrop tap.
- `dismiss('programmatic')` closes without treating the operation as a user
  confirmation or cancellation.
- `destroy()` clears the active request and queue without running business
  callbacks.
- Use platform-familiar safe/cancel ordering and a distinct destructive role;
  do not hard-code one platform's button order for both.

## Bottom Sheet

```javascript
$.bottomSheet.attach(window)

$.bottomSheet.show({
  title,
  message,
  items: [{
    id,
    title,
    subtitle,
    icon,
    tone: 'neutral',
    enabled: true
  }],
  selectedId,
  onSelect,
  onCancel
})

$.bottomSheet.dismiss('cancel')
$.bottomSheet.destroy()
```

Contract:

- Render items with a fixed `ListView` template and data objects. Support long
  lists, disabled rows, optional subtitles/icons, and a selected marker.
- Enqueue additional `show()` calls FIFO. Never stack sheets.
- Accept the first enabled selection only, invoke `onSelect(item)` once, and
  close.
- Backdrop, Android Back, Cancel, or `dismiss('cancel')` invokes `onCancel` once.
- Other programmatic dismissal and `destroy()` do not imply cancellation and do
  not execute business callbacks.
- Present from the bottom on phones. On tablets and large screens, use a centered,
  width-limited action surface. Reserve `anchor` for a future anchored variant;
  do not expose behavior that is not implemented.

## Shared lifecycle contract

- Prefer one instance of each needed Widget per window. Add a global coordinator
  only after real cross-window requirements exist.
- Call `attach(window)` after the host window/controller exists. Call `destroy()`
  from the host's close cleanup.
- Make `destroy()` idempotent. Remove listeners, clear timers, cancel pending
  animation callbacks, clear queues, and release callback references.
- Guard every asynchronous completion with the current presentation generation
  so a stale timer or animation cannot dismiss a newer request.
- Consume backdrop events and prevent them from bubbling to underlying controls.
- Save the host's previous accessibility state, exclude underlying content while
  modal, move focus to the surface, and restore the saved state on close.
- Keep localized copy outside the Widget. Pass strings and business callbacks in
  the public API.
- Keep business logic out of the Widget. It reports a choice; the host performs
  domain work.
- Verify every callback path for exactly-once behavior: action, confirm, cancel,
  Back, backdrop, timeout, replacement, programmatic dismissal, and destruction.

## PurgeTSS integration

When `purgetss/` or `purgetss/config.cjs` exists, load the `purgetss` skill before
writing styles. `ti-expert` decides the component boundary; `purgetss` decides
the verified utilities and configuration.

Apply these architectural rules:

- Set PurgeTSS `options.widgets` to `true` so Widget XML is scanned.
- Express stable anatomy and utility classes in Widget XML.
- Use semantic color names for surfaces, text, borders, accent, overlay, success,
  warning, and error. Let Titanium resolve light/dark variants.
- Do not edit generated `app/styles/app.tss`.
- Use `widget.tss` only for properties that have no verified utility or that are
  inherently specific to the Widget.
- Declare animations as XML `Animation` proxies using `purgetss.ui`. Use explicit
  `open()` and `close()` calls instead of toggle behavior.
- After generation, inspect the final `app.tss` section for unused or unsupported
  classes and resolve every new entry.

Do not copy class inventories into this skill and do not guess Tailwind-like
names. The installed PurgeTSS skill remains the source of truth.

## Widget, Require, state, or native UI

| Choose | When |
| --- | --- |
| Alloy Widget | Self-contained public API, state/lifecycle ownership, portable boundary, or reuse across apps/screens |
| `<Require>` controller | App-specific view/controller composition that shares the host's domain and lifecycle |
| Screen state in XML | Loading, empty, content, or error presentation belongs only to that screen |
| TSS or PurgeTSS utilities | Repeated visual treatment has no behavior, state, or lifecycle |
| Native/system UI | The operating system owns permissions, trust, files, sharing, identity, purchases, or another protected flow |

Usage count is evidence, not a threshold. A component can deserve a Widget on
its first use if it has a stable portable API and non-trivial lifecycle; three
similar labels still do not deserve one.

