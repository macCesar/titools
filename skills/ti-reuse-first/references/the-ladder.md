# The ladder

Seven rungs, cheapest first. Ask them in order and stop at the first one that holds. The point of the order is that each rung costs less than the one below it — a `grep` costs seconds, a new `app/lib/` module costs every future reader — so the search should exhaust the cheap answers before it reaches for the expensive one.

The ladder is a search order, not a prohibition. See [When adding structure is the right answer](#when-adding-structure-is-the-right-answer) at the bottom before using it to argue against building something.

## Rung 0 — Does this need to exist?

The only code with no maintenance cost is the code that was never written. Before anything else, ask what breaks if this does not exist.

Things that usually fail rung 0 in a Titanium app:

- A setting nobody will change. A constant is a setting with the configuration removed.
- Error handling for a state that cannot occur. `if (!Alloy.Globals.ventanaActual)` earns its place because there genuinely is a moment with no visible window; a null check on `$.getView()` inside its own controller does not.
- A "manager" holding one function. That is a function.
- A parameter with one caller passing one value.
- A cleanup path for an object the platform already destroys.

If the answer is "nothing breaks", say so and stop. Then say it out loud in the response: *"I skipped the retry wrapper — the call has one caller and `ti-api` says the method throws synchronously."* Work you decided not to do is invisible unless you name it, and unnamed decisions get re-litigated next session.

## Rung 1 — Is it already in this codebase?

This rung fails most often not because the thing was absent but because nobody looked. **"I do not think we have that" is not an answer to rung 1.** Run the search and report what came back.

Where to look, in a standard Alloy project. In a Classic project the same search runs over `Resources/`, and the reuse mechanism at the end of it is a CommonJS module returning a configured view rather than a Widget or `<Require>`:

| Looking for | Search |
| --- | --- |
| A helper or service | `ls app/lib/` then `grep -rn "functionName" app/lib/` |
| A screen, panel, or dialog | `ls app/controllers/` and any subfolders |
| A reusable component with its own API | `ls app/widgets/` |
| A style or class | `grep -n "className" app/styles/_app.tss purgetss/config.cjs` |
| A constant, endpoint, or flag | `grep -rn "VALUE" app/config.json app/alloy.js app/lib/` |
| An already-declared native module | `grep -n "<module" tiapp.xml` |

Three failure modes live on this rung. The first two are opposites; the third arrives after the search has already succeeded.

**Missing what is there.** A `grep` for the exact identifier finds nothing, so the conclusion is "we do not have it" — when the project spells it differently. Search for the *concept*: two or three plausible names, plus the domain noun. Looking for a debounce, also try `throttle`, `timer`, `delay`.

**Copying the wrong thing.** This one is more expensive, because it produces working code that is wrong in shape. When a file *is* found, the temptation is to copy it as a template. Before doing that, open it and check that it solves the same problem — not that it lives in the same folder or has a similar name. A full-screen modal window for scrolling legal text and a three-line confirmation overlay are both "panels", and adopting the first as a template for the second produces an aviso that fills the screen. See [Alloy reuse § worked example 1](alloy-reuse.md#worked-example-1-the-wrong-template).

The test: *does this file's shape match my problem — how much screen it takes, how it opens and closes, what it owns — or does it just share a folder with it?*

**Copying the right thing and then improving it.** The template is found, it is the correct one, and the copy arrives with additions the original never had: a lock around the animation, a `touchEnabled` toggle, an interception "just in case". The reference implementation has been running without them; that is the evidence they are not needed. Reuse means copying the behavior, not copying it and defending it against a failure nobody has seen. See [Alloy reuse § worked example 3](alloy-reuse.md#worked-example-3-the-right-template-plus-inventions).

## Rung 2 — Does a `Ti.*` API or Alloy builtin cover it?

Titanium's namespace is broad, and reimplementing part of it is easy to do by accident because the reimplementation always looks reasonable in isolation.

Reinventions worth checking for, each verified against the `ti-api` skill's references:

| Hand-rolled | Already exists |
| --- | --- |
| A date formatter | `String.formatDate(date, format)` [source: ti-api api-xml-global.md] |
| A key/value store over the filesystem | `Ti.App.Properties` [source: ti-api api-app-platform.md] |
| Screen-size math from a window's `size` | `Ti.Platform.displayCaps` [source: ti-api api-app-platform.md] |
| A lookup table of translated strings | `L(key, hint)` [source: ti-api api-xml-global.md] |
| A language check helper | `Ti.Locale.currentLanguage` — a property, not a method [source: ti-api api-core.md] |
| A custom event emitter | `Alloy.Events` (a `Backbone.Events` clone) [source: ti-expert migration-patterns.md] |
| A globals bag for passing controller params | `$.args` |
| A compile-time platform flag | `OS_IOS` / `OS_ANDROID` |
| A config module | `Alloy.CFG`, from `app/config.json` |

**Verify the exact signature before writing the call.** Whether something is a property or a method, and which namespace owns it, is exactly the class of detail that memory gets wrong — and a wrong `Ti.*` call does not fail at lint, it fails on the device in the user's hand. Invoke `ti-api` and cite it.

## Rung 3 — Does the platform own this workflow?

Some interactions belong to the operating system, and rebuilding them costs more than the code: an app-built version loses the platform's accessibility, localization, and — where trust is involved — its credibility.

Keep native: permission prompts, authentication and biometrics, payment and in-app purchase, the share sheet and intent chooser, media pickers, and the system alert and option dialogs (`Ti.UI.createAlertDialog`, `Ti.UI.createOptionDialog` [source: ti-api api-core.md]).

Build app-owned: feedback that belongs to the app's own surface — inline validation, snackbars, screen-level empty and error states, and modals whose content is the app's rather than the system's. `ti-expert`'s feedback-surfaces reference draws the line in detail; consult it rather than guessing.

The trap is the middle: a confirmation dialog. If it is a plain "are you sure?", the system dialog is free and correct. If it carries the app's own branding, illustration, or a third option, it is app-owned — and then rung 1 applies, because the app almost certainly already has one.

## Rung 4 — Does a module already in the project cover it?

Check `tiapp.xml` `<modules>` and `package.json` before adding anything. Apps accumulate capable dependencies and then hand-roll what they already paid for.

Frequent cases: an animation module already declared (`purgetss.ui`, `ti.animation`) while new code animates by hand with `setTimeout`; a networking or storage module present while a controller talks to `Ti.Network.HTTPClient` directly; an icon font already installed while a new screen ships a PNG.

A genuinely new dependency needs an argument, not just a fit — its size, its platform coverage, who maintains it, and what happens at the next SDK bump. State that argument before proposing it.

## Rung 5 — Can it be one line at the call site?

This rung catches the most common over-engineering in Alloy code: replacing a reference with a mechanism.

If module A needs module B to do something and A can see B, **call B**. An event is a mechanism for when the sender must not know the receiver — several unknown listeners, or a genuine layering boundary. With one known listener it is a function call with extra steps, plus a listener to register, a name to keep in sync, and a leak to clean up.

```js
// Mechanism: the sender announces, hoping someone is listening.
Alloy.Events.trigger('abrirTienda')

// Reference: the caller passes the function it already has in scope.
opciones.alAceptar = abrirTienda
```

The same rung catches layout: a `postlayout` handler that measures a window and repositions children is JavaScript doing what a TSS conditional (`[formFactor=tablet]`, `[platform=ios]`) does declaratively, once, before anything is drawn. See [Indirection](indirection.md) for the full treatment.

## Rung 6 — Build the smallest thing that works

Reaching this rung honestly is a result, not a failure. Now build it — and only it.

- One file, in the place the next person would look for it: `app/lib/<type>/<name>.js`, one level deep.
- The narrowest API that serves today's callers. Parameters get added when a second caller needs them, not in anticipation.
- No configuration until something needs configuring.
- Named for what it does in this app's vocabulary, not for the pattern it implements. `PushManager` beats `NotificationServiceFactory`.

Then check the diff against the request: every changed line should trace back to something that was asked for.

## When adding structure is the right answer

A skill that only ever says "do not build it" has replaced one bias with another, and the second one is harder to notice because it looks like discipline. These are the cases where climbing all seven rungs correctly lands on *build it*, and where hesitating is the error:

- **The same logic exists at three or more call sites and they must stay in agreement.** Network calls repeated across five controllers, each with its own timeout and error handling, is not five small conveniences — it is five places to fix one bug, and four of them will be missed. That is a module in `app/lib/`, and rung 1 is what proves the case: the `grep` that finds five copies is the argument.
- **A boundary the app genuinely has.** Persistence, networking, and native-module access are real seams. A wrapper there is not indirection; it is the place where the swap happens when the vendor changes.
- **Something with its own lifecycle.** State, timers, listeners, and cleanup that belong together belong in one owner — a Widget or a service. Scattering them across the controllers that happen to use them is the expensive version.
- **A contract several teams or projects depend on.** Portability is a reason, and `app/widgets/` is where it lives.
- **Tests.** Extracting logic so it can be tested is a real reason to add a file, even when there is only one caller.

The distinction that matters is between a **boundary** and a **detour**. A boundary is a place where the implementation could plausibly change, or where the two sides genuinely should not know each other. A detour is a hop that always resolves to the same destination. Both look like a layer in the diff; only one of them pays for itself.

When the answer is "build it", say why in a sentence — which rung failed, and what the evidence was. *"Five call sites, measured; extracting to `lib/api/themes.js`"* is a decision anyone can check. *"For maintainability"* is not.
