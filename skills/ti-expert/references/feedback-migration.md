# Migrating feedback surfaces

Migrate semantics, not proxy names. Replacing every native dialog with the same custom modal preserves the original design problem.

## Contents

- [Inventory](#inventory)
- [Classify before replacing](#classify-before-replacing)
- [Migrate one window at a time](#migrate-one-window-at-a-time)
- [Deliberate silence](#deliberate-silence)
- [Contract tests](#contract-tests)
- [Delivery verification](#delivery-verification)
- [When to share Widgets between apps](#when-to-share-widgets-between-apps)

## Inventory

Search the application for:

```bash
rg -n "createAlertDialog|createOptionDialog|createNotification|Toast|toast|snackbar|overlay" app/
```

Also inspect helpers that wrap these calls, XML overlays, controller timers, global events, and callbacks that can present UI indirectly. Record for every occurrence:

- trigger and current message;
- success, information, warning, error, confirmation, or choice;
- blocking versus non-blocking;
- reversible versus irreversible;
- app-owned versus system-owned;
- callback side effects and cancellation behavior;
- owning window and cleanup path.

Do not implement the replacement until every occurrence has a semantic target from `feedback-surfaces.md`.

## Classify before replacing

Use these defaults:

- ordinary success and undoable actions → Snackbar;
- recoverable field validation → inline validation;
- persistent app condition → Banner or inline notice;
- blocking failure or required acknowledgement → Dialog;
- uncommon irreversible decision → destructive Dialog;
- several related actions or app-data choices → Bottom Sheet;
- long structured content → scrollable sheet or dedicated screen;
- OS permission, picker, share, date/time, biometric, or purchase flow → keep the system surface.

Preserve domain behavior separately from presentation. Services return results or errors; the window/controller that owns visible context chooses the surface. Do not let a service create app-owned UI, especially before the root window exists.

## Migrate one window at a time

1. Register the required Widget dependencies in `app/config.json`.
2. Add the Widgets as the final visual children of the window XML.
3. Attach modal Widgets after the window exists.
4. Route each old result to its classified surface.
5. Call Widget `destroy()` from the window close cleanup.
6. Exercise success, failure, cancel, Back, backdrop, double tap, and consecutive presentation paths.
7. Remove the old dialog, local overlay, helper, timer, and listener after the migrated window passes verification.
8. Commit the completed vertical slice before moving to the next window.

Do not keep commented legacy implementations. Version control is the rollback mechanism; commented duplicates hide incomplete migrations and stale callbacks.

## Deliberate silence

Cancellation or an unknowable result can be a complete, intentional outcome. Model it explicitly and do not infer a message from falsy values.

Example contract for an exported file:

```javascript
function handleSaveResult(error, result) {
  if (error) {
    $.dialog.show({
      title: L('error'),
      message: error.message,
      tone: 'error',
      confirmTitle: L('close')
    })
    return
  }

  if (result.saved === true) {
    $.snackbar.show({
      message: L('file_saved'),
      tone: 'success'
    })
  }

  // saved === false: Android picker was cancelled; the internal original remains.
  // saved === null: iOS does not report whether the person completed the save.
  // Both outcomes are deliberately silent.
}
```

Do not add "Cancelled" for `saved === false`. Do not claim success for `saved === null`. Cover both branches with tests so a future fallback does not erase the intended silence.

## Contract tests

Add repository-appropriate static or unit tests for:

- all Widget folders, manifests, XML views, controllers, and dependency entries;
- each public method documented in `feedback-widget-contracts.md`;
- the expected Widget declared in every migrated window;
- absence of app-owned `Ti.UI.createAlertDialog` and `Ti.UI.createOptionDialog` defaults;
- removal of the previous local Snackbar/overlay and timer;
- Snackbar replacement and timer reset;
- Dialog and Bottom Sheet FIFO ordering;
- exactly-once callbacks under double taps and competing close paths;
- Android Back and backdrop policy;
- cleanup of active and queued presentations;
- explicit silence for cancel and indeterminate save results.

Do not enforce blanket bans on native system surfaces. A remaining native call must be tied to an OS-owned interaction or documented fallback.

## Delivery verification

Run the project's real commands rather than assuming names. A complete migration normally includes:

1. lint with zero errors and no new warnings;
2. unit and contract tests with no new failures;
3. PurgeTSS generation when detected, followed by inspection of unused or unsupported classes at the end of `app.tss`;
4. Alloy compilation for Android and iOS;
5. native builds for every supported platform;
6. manual checks in light, dark, and system appearance;
7. phone and tablet/large-screen checks;
8. Back, backdrop, cancel, double tap, long list, and long localized text checks;
9. VoiceOver and TalkBack focus/traversal checks;
10. consecutive presentation and window-close cleanup checks.

Record pre-existing failures before migration and require the final run to add none. Build artifacts are not proof of usable modal behavior; perform the manual interaction checks on device or simulator.

## When to share Widgets between apps

Extract or copy a Widget into another app only when:

- its API is stable and contains no business rules;
- localized strings and callbacks are supplied by the host;
- appearance depends on a documented semantic-token contract;
- platform and minimum Titanium/Alloy versions are declared;
- lifecycle and accessibility tests travel with it;
- at least two apps need the same behavior, or one app has a clear portability requirement.

Do not extract merely because a view appeared three times. Extract because the boundary is independently understandable, testable, and maintainable.

