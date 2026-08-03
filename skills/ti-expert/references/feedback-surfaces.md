# Feedback surfaces and app-owned UI

Use this guide before choosing a Titanium proxy or drawing a component. The
surface follows the meaning of the event: style comes afterwards.

## Contents

- [Decision sequence](#decision-sequence)
- [Feedback scale](#feedback-scale)
- [App-owned versus system-owned](#app-owned-versus-system-owned)
- [What to standardize next](#what-to-standardize-next)
- [Phone, tablet, and accessibility](#phone-tablet-and-accessibility)
- [References](#references)

## Decision sequence

Classify the event in this order:

1. **Owner**: does the app own the interaction, or does the operating system?
2. **Blocking**: can the person continue safely without acknowledging it?
3. **Recovery**: is the action reversible or is data at risk?
4. **Location**: does the message belong to a field, a screen, or the whole app?
5. **Persistence**: is it transient, persistent until state changes, or modal?
6. **Choice shape**: is there one acknowledgement, a binary decision, or a list
   of related actions?

Do not begin with "which native dialog can display this string?" That turns
different meanings into the same interruption and makes the app feel visually
inconsistent.

## Feedback scale

| Situation | Preferred surface | Why |
| --- | --- | --- |
| Ordinary success or confirmation | Snackbar | Visible without interrupting the task |
| Undoable action | Snackbar with one Undo action | Keeps recovery close to the event |
| Non-blocking warning | Warning Snackbar | Calls attention without forcing acknowledgement |
| Invalid value in one field | Inline validation next to that field | Preserves context and identifies the fix |
| Form-wide recoverable validation | Inline summary; Snackbar only if no single field owns it | Avoids a modal loop |
| Persistent connectivity, sync, or account state | Banner or inline notice | Remains visible while the condition remains true |
| Blocking error or required acknowledgement | Dialog | The task cannot continue safely |
| Uncommon irreversible action | Destructive confirmation Dialog | Provides a safe escape before data loss |
| Several actions related to the current context | Bottom Sheet | Presents a compact choice without pretending it is an error |
| Long, searchable, or multi-select options | Bottom Sheet, sheet, or dedicated screen with `ListView` | A dialog is too constrained |
| Multi-step task or complex form | Sheet or dedicated screen | The interaction has its own workflow |
| No content yet | Empty State inside the screen | This is screen state, not transient feedback |
| Initial or blocking work | Loading/Progress state in context | Communicates progress without inventing a message |

Reserve Dialogs for critical information. Do not use them merely because they
are easy to create. If an action is common and undoable, prefer immediate
execution plus Undo over confirmation.

### Snackbar versus Toast

For app-owned foreground feedback, standardize on Snackbar. It supports the
app's semantic colors, accessibility, safe-area positioning, duration policy,
and one optional recovery action. Do not maintain both a custom Toast and a
Snackbar for the same job.

A platform Toast can remain only when the operating system owns the behavior or
when a documented platform fallback is necessary. It is not the default design
surface.

### Banner versus Snackbar

- Use Snackbar when the event has happened and the message can disappear.
- Use Banner or inline notice while an ongoing condition remains relevant.
- Never keep a Snackbar indefinitely to simulate persistent screen state.

### Bottom Sheet versus Dialog

- Use Bottom Sheet for related choices: sorting, exporting, selecting a category,
  or choosing an action for an item.
- Use Dialog for acknowledgement or a consequential confirm/cancel decision.
- Move long prose, structured data, search, or complex input into a sheet or
  dedicated screen.

## App-owned versus system-owned

Recreate and brand a surface only when the app owns its content and behavior.
Keep the platform UI when the system owns trust, permissions, identity, files,
or another protected workflow.

| Keep native/system-owned | May be app-owned and styled |
| --- | --- |
| Permission prompts | Success, warning, and error feedback |
| File and document pickers | Destructive confirmations |
| Share sheets and activity views | Contextual action lists |
| Date/time pickers when the platform interaction is desired | Category and app-data selectors |
| Camera and media authorization UI | Loading, empty, and error states |
| Biometric authentication prompt | Banners and inline validation |
| Keyboard, autofill, purchases, notifications, and OS settings | App-specific onboarding or education |

An app may explain why a system surface is about to appear, but it must not
imitate the trusted system prompt. Use the official Titanium API or native module
for the system-owned part.

Cancellation is often a normal system outcome. Do not turn every cancellation
into an error, a "Cancelled" message, or an unsupported success claim. Document
silence explicitly at the call site when it is meaningful.

## What to standardize next

After Snackbar, Dialog, and Bottom Sheet, the highest-value shared patterns are:

1. **Banner / Inline Notice** for persistent app state.
2. **Loading / Progress wrapper** that uses the native activity indicator but
   standardizes placement, text, blocking behavior, and cleanup.
3. **Empty / Error State** for consistent screen-level recovery.
4. **Field Validation** for message placement, focus, accessibility, and colors.

Standardize buttons, cards, badges, chips, skeletons, and coach marks only when
real product repetition exposes a stable contract. A visual resemblance alone
does not justify a Widget.

## Phone, tablet, and accessibility

- On phones, present contextual choices from the bottom and keep touch targets
  reachable.
- On tablets and large screens, use a centered, width-limited action surface or
  a platform-appropriate anchored presentation; do not stretch phone geometry
  edge to edge.
- Respect safe areas, bottom navigation, orientation, split screen, text scaling,
  and localized strings.
- Announce transient feedback appropriately and move accessibility focus into a
  modal surface when it opens.
- While a modal is active, prevent interaction with and accessibility traversal
  into the underlying content. Restore the exact previous state on close.
- Back, backdrop, Cancel, and destructive actions must have predictable semantics
  and must never execute callbacks more than once.

## References

- [Titanium Alloy Widgets](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_Guide/Alloy_Widgets.html)
- [Apple Human Interface Guidelines: Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- [Apple Human Interface Guidelines: Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Material Design 3: Snackbar](https://m3.material.io/components/snackbar/overview)
- [Material Design 3: Dialogs](https://m3.material.io/components/dialogs/overview)
- [Material Design 3: Bottom sheets](https://m3.material.io/components/bottom-sheets/overview)

