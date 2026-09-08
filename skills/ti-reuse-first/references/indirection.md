# Indirection

Every layer between a caller and the work it wants done has to earn its place. This reference is about telling the ones that do from the ones that do not — and the distinction is not "how many layers" but whether each one is a **boundary** (a place where the two sides genuinely should not know each other, or where the implementation could plausibly change) or a **detour** (a hop that always resolves to the same destination).

Both look identical in a diff. Only one of them pays for itself.

## Events versus a direct call

An event bus is the right tool when the sender must not know the receiver: several listeners, an unknown number of them, or a genuine layering boundary the sender should not reach across. When there is exactly one listener and the sender can already see it, an event is a function call with a name to keep in sync, a registration to perform, and a leak to clean up.

```js
// A lib that has no business knowing about windows announces an intention.
// Somewhere else, exactly one controller is listening.
Alloy.Events.trigger('abrirTienda')
```

```js
// The controller that already owns abrirTienda() hands it over as a value.
if (esTemaNuevo) {
  opciones.alAceptar = abrirTienda
}
Alloy.createController('paneles/avisoPush', opciones).mostrar()
```

The second version deletes the event name, the listener, and the cleanup. It also fixes a layering problem the event was hiding: the module that handles push registration had to know that "open the store" was a thing that could happen. With a callback passed in, it does not — it takes a function and calls it, and the decision about what that function is stays in the controller that owns the navigation.

**Decision table:**

| Situation | Use |
| --- | --- |
| One known listener, caller can see it | Direct call or a callback in `$.args` |
| Parent needs to hear from a child controller it created | The child's exported function, or a callback the parent passed down |
| Several listeners, or the set is genuinely open | `Alloy.Events` (a `Backbone.Events` clone) |
| Sender must not know the receiver exists — a real seam | `Alloy.Events` |
| Cross-context, JS to native or between contexts | `Ti.App.fireEvent` — the last resort, and only then |

`ti-expert`'s decision matrix answers "`Ti.App.fireEvent` or EventBus?" with "always EventBus", and that is correct as far as it goes — it is comparing two event mechanisms, and `Ti.App.fireEvent` is the leakier one. It is not an argument that the interaction needs an event at all. Ask this question first; ask `ti-expert`'s second.

**The test:** *if I delete the event and call the function directly, what breaks?* If the answer is "nothing, but it feels less decoupled", the coupling was imaginary and the event was the cost of imagining it.

## Wrappers

A wrapper around a native module is a real pattern with a real purpose: it is the one place that changes when the vendor does, and it keeps the module's API from spreading through the app.

It stops being that when it forwards one call, unchanged, from one call site.

```js
// A boundary: normalizes two platform APIs, owns the error contract, one place to change.
function comprar(sku) { … }

// A detour: this is Ti.Media.vibrate with a longer name.
function vibrar(patron) {
  Ti.Media.vibrate(patron)
}
```

Signs a wrapper is a detour: it has one function; that function forwards its arguments unchanged; it has one call site; it adds no error handling, no normalization, and no default. Signs it is a boundary: it reconciles iOS and Android behavior; it owns retries, logging or error translation; it is called from several places; or it is the seam a test substitutes.

The honest version of "we might swap this vendor later" is: write the wrapper when the swap becomes plausible, not when it becomes imaginable. The refactor from direct calls to a wrapper is mechanical and a `grep` finds every site; the cost of carrying an unnecessary layer is paid every time someone reads the code.

## Service layers and registries

`ti-expert` describes three architectural tiers and a set of patterns — Repository, Service layer, Factory, ServiceRegistry with dependency injection — and its matrix says a controller over 100 lines should be extracted to Tier 2. Those tiers are real and the guidance is sound *for apps that are at that tier*. The failure mode is applying a tier's machinery to an app that is not there yet, because the pattern is available rather than because the app needs it.

The line-count rule is a smell detector, not a instruction. A 140-line controller that does one screen's work, reads top to bottom, and shares nothing with any other screen is fine. A 90-line controller that repeats what three other controllers do is already a problem. Split when there is a second consumer, a real seam, or something worth testing on its own — not when a number is exceeded.

Before introducing a registry or dependency injection, answer: how many services are there, and how many of them have more than one implementation? Injection buys the ability to substitute. If nothing is ever substituted — not in tests, not per platform, not per environment — it has been bought and not used.

## Layout logic in JavaScript

This is the same failure in a different costume: JavaScript recomputing what the style system resolves declaratively.

A `postlayout` handler that measures a window and repositions its children runs after the first draw, so the content visibly jumps; it re-runs on every layout pass; and each device rule it encodes is a hand-written `if` that will eventually miss a case. TSS conditionals — `[formFactor=tablet]`, `[formFactor=handheld]`, `[platform=ios]`, `[if=…]` — resolve once, before anything is drawn, and cost nothing at runtime.

The same applies to positioning by arithmetic. Anchoring a button with `right: 178` works exactly once; a horizontal container with `height: Ti.UI.SIZE`, where `left` is the gap from the previous sibling, keeps working when the text, the width or the language changes.

**The test:** *am I adding up widths in my head to pick a number?* If so, the layout system is being asked to accept a result it could have computed. Reserve `postlayout` for reacting to a real orientation change, and use `Ti.Platform.displayCaps` when a decision must be made before anything is drawn.

## When indirection is the right call

Do not read this reference as an argument for flat code. These layers are worth their cost, and refusing them is the same error inverted:

- **A seam with two implementations today** — per-platform behavior, a test double, a mock server. Substitution that actually happens is what injection is for.
- **A repeated integration.** Five controllers each with their own `HTTPClient`, timeout and error handling is one bug in five places. The module that unifies them is not indirection; it is the fix.
- **An event with an open listener set.** A theme finishing its download, a session expiring — the publisher genuinely cannot know who cares, and the set grows. That is a bus, correctly used.
- **A wrapper at a vendor boundary.** When the native module's API is spreading through controllers, one wrapper is cheaper than the eventual migration.
- **Something with its own lifecycle** — state, timers, listeners, cleanup that belong together. One owner beats scattering them across the controllers that happen to use it.

State which of these applies when you propose a layer. "It is a seam: iOS and Android disagree here, and the wrapper is where they are reconciled" is a case anyone can check. "For decoupling" is not.
