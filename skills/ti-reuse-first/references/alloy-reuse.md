# Alloy reuse

Alloy has real mechanisms for reusing XML and JS together — `<Require>` and Widgets — and `app/lib/` is not the only place shared code can live. This reference is about choosing between them, and about the decision that comes before all of them: whether the new screen needs to be a new file at all.

## The four exits

When something has to appear in more than one place, there are four ways out, and the reflex — copy the trio, or embed one instance everywhere — is usually the worst of them.

| Exit | What it is | When it is right |
| --- | --- | --- |
| **Parameterize what exists** | Pass `$.args` to a controller that already does 90% of it | The differences are text, an icon, a callback, or a visible/hidden branch |
| **`<Require>`** | Compose an app-local controller inside a view | Shares the host's lifecycle, styling and domain; no independent contract |
| **Widget** | A packaged component with `widget.json`, its own styles and assets | Owns a public API, its own state and cleanup, and could move to another project |
| **New trio** | A fresh controller/view/style | Genuinely a different screen, not a variation of one |

`ti-expert`'s [alloy-structure.md § "When to use widget vs require"](../../ti-expert/references/alloy-structure.md) has the Widget-vs-`<Require>` table in full; read it rather than deciding from memory. What it does not cover, and what this reference adds, is the first row — parameterizing rather than adding anything — and the question of *where the instance lives*, below.

Usage count alone does not decide. Three call sites for a thing with no state and no lifecycle may still be three lines of `$.args`; one call site for something with timers and cleanup may still deserve a Widget.

## Where the instance lives: on demand, not one per window

A component needed in four windows does not need four instances. The reflex — a `<Require>` in each window's XML, a listener in each controller, and a `destruir()` each one has to remember to call — pays the cost of four view hierarchies, four listener registrations, and four chances to forget the cleanup, in exchange for saving a `createController` call.

The alternative is to build it when it is needed, on whatever window is visible, and destroy it on close:

```js
// In the controller that knows which window is on screen.
Alloy.createController('paneles/avisoPush', opciones).mostrar()
```

```js
// In the component: it attaches to the window it was handed, and cleans itself up.
const ventana = $.args.ventana

function mostrar() {
  if (!ventana) { return false }
  ventana.add($.getView())
  $.getView().show()
  $.animarVista.open($.getView())
  return true
}

function cerrar(despues) {
  $.animarVista.close($.getView(), () => {
    $.getView().hide()
    ventana.remove($.getView())
    $.destroy()
    if (typeof despues === 'function') { despues() }
  })
}
```

The trade is real and worth stating: creating on demand costs a controller construction at the moment of use, which is visible if the component appears many times per second. That is the case for a list row, and it is why `ListView` templates exist. It is not the case for an alert, a confirmation, or a notice that arrives occasionally — there, a resident instance is memory held for an event that mostly does not happen.

The test: **how often does this appear, and does it need to survive being closed?** Rarely and no → create on demand. Constantly, or it holds state between appearances → resident.

## When a family of screens has already formed

The interesting case is not one duplicate. It is the fifteenth, when a house pattern has emerged without anyone deciding on it, and each new screen re-types it.

Measure before proposing anything. In one shipping Alloy app, over the 18 modal panels in `app/controllers/paneles/` (excluding the shared header component):

```bash
# Denominator: panel controllers, excluding the shared component.
PANELS=$(ls app/controllers/paneles/*.js | grep -v panelHeader)
for p in "animarVista.open" "animarVista.close" "opacoClick" '$.getView().hide()' "mostrarPanel"; do
  printf "%-22s %s/%s\n" "$p" "$(grep -lF "$p" $PANELS | wc -l | tr -d ' ')" "$(echo "$PANELS" | wc -l | tr -d ' ')"
done
```

| Repeated in every panel | Count |
| --- | --- |
| `$.animarVista.open($.getView())` | 16 / 18 |
| `$.animarVista.close($.getView(), …)` | 15 / 18 |
| `opacoClick` — dismiss on background tap | 15 / 18 |
| `$.getView().hide()` / `.show()` | 15 / 18 |
| An exported `mostrarPanel` | 14 / 18 |

And in the 18 corresponding views, counted as exact `class` attributes rather than substrings: 16 carry an identical `<Animation>` element, 14 an identical full-screen scrim, and 9 an identical zoom-in card.

That is a house pattern with no home. Every new panel re-types show, close, dismiss-on-background and animation, and a change to any of them is a fifteen-file edit that will be applied to twelve.

**What the numbers do not decide is the fix.** They establish the cost; the shape of the consolidation is a judgment call, and there are three defensible answers:

- **A Widget** (`app/widgets/panelBase/`) exposing `open()`, `close()` and a content slot. Strongest boundary, real public API, portable to the next project. Costs the most to introduce and forces every panel through one contract — which is wrong if the panels are drifting apart deliberately.
- **A shared behavior module** (`app/lib/panel.js`) that each controller hands `$` to, keeping the XML per-panel and lifting only the repeated JS. Smallest change, preserves per-panel layout freedom, does not unify the duplicated XML.
- **Leave it, and only stop the bleeding** — a `config.cjs` custom rule for the two repeated class strings, so at least new panels stop re-typing the appearance. Correct when the panels are genuinely diverging and a shared base would become a flag farm.

Present the measurement and the three options with what each costs. The choice of which is right depends on where the app is going, and that is the human's to make — a consolidation imposed on screens that were about to diverge is worse than the duplication it removed.

## Worked example 1: the wrong template

**The task**: show a three-line notice over whatever window is visible when a push notification arrives with the app open.

**What happened**: `paneles/derechos` was copied as the template — a full-screen modal window built to scroll legal text. The result filled the screen for a three-line message.

**What was already there**: `paneles/tombolaSalir` — a scrim with a centered card, two buttons, dismiss on background tap. The same shape as the task. It was one folder listing away.

**The error was not in the code**; the copied file was perfectly good code. The error was choosing the template by proximity — same folder, similar name — instead of by shape. Both files are "panels"; only one of them is a small overlay.

**The check that would have caught it**: before copying any file as a template, open it and answer three questions. *How much screen does it take? How does it open and close? What does it own?* If any answer differs from the task, keep looking — the right file is usually in the same folder.

## Worked example 2: four instances of a thing that appears once

**The task**: the same notice, reachable from four different windows.

**What was built first**: a `<Require>` in each of the four window XMLs, an `Alloy.Events` listener in each of the four controllers, and a `destruir()` each window had to remember to call. Four copies of a view hierarchy, permanently resident, for a notice that arrives occasionally.

**What replaced it**: one `Alloy.createController('paneles/avisoPush', opciones).mostrar()` in the controller that already tracks which window is visible, with the panel attaching itself to the window it is handed and calling `$.destroy()` on close. The four `<Require>` elements, the four listeners and the `destruir()` contract all went away.

**The tell**: *am I creating N copies of something that is only ever used one at a time?* If the answer is yes, the instance should be created at the moment of use. The question to ask out loud is the one that unlocked this: **can this be loaded dynamically?**

## Worked example 3: the right template, plus inventions

**The task**: a panel inside the Tómbola window, behaving like the one already working in `index` — the same handling the Estilos and Ruleta panels use. The instruction named the reference implementation explicitly.

**What was built**: the reference behavior, plus additions nobody asked for. Touch events were intercepted, `touchEnabled` was toggled on and off around the transition, and an `animating` flag was introduced that refused to close the panel until the open callback fired. None of the reference panels carry any of that.

**What happened**: the flag deadlocked. When the open callback did not arrive, `animating` stayed `true` and the panel could no longer be closed. The user could not open and close it repeatedly, and could not keep drawing cards. Each attempt to fix the symptom added another guard on top of the first — a patch on a patch, all of it defending against a problem that had never been observed.

**What replaced it**: the reference behavior, unedited. Animate, hide the whole container on close, leave the events connected. The `touchEnabled` toggling and the `animating` lock were deleted, not repaired.

**The admission afterwards was the diagnosis**: *"intenté prevenir toques durante la animación sin evidencia de que hiciera falta"*. Three panels in the same app had run for months without that guard. The evidence that it was unnecessary was already in the codebase, in the very files that had been named as the model.

**The rule**: when the instruction is *do it like the one that already works*, reuse means copying the behavior, not copying it and improving it. Additions to a reference implementation need the same argument any new code needs — a real, observed failure. An input you are guarding against because it *might* happen is rung 0 work: the requirement does not exist yet, so neither should the guard.

**The tell**: *does the file I was told to copy do this?* If it does not, and no bug report says it should, do not add it. And if a symptom appears after an addition of yours, the first move is to remove the addition — not to guard it.
