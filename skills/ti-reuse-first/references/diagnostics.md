# Diagnostics

Running the ladder backwards over code that already exists. Each sweep below is a command, a reading, and — the part that matters — what would make the finding wrong.

Two rules before starting:

**Report the command with the number.** *"14 of 18 panel controllers define their own `mostrarPanel`"* is a finding someone can check and disagree with. *"There is a lot of duplication in the panels"* is an impression, and impressions produce arguments instead of decisions.

**Duplication is evidence, not a verdict.** Three copies drifting apart on purpose are cheaper than one abstraction with three flags. Every finding here needs its second half: what the consolidation would cost, not only what it would save. Then the human decides — this sweep produces a report, not a refactor.

## 1. Near-identical controllers

Look for a house pattern that formed without anyone deciding on it: the same function names, the same open/close dance, the same event wiring, re-typed per screen.

```bash
# Which function names recur across a family of controllers?
# find, not **/ — globstar is off in the bash 3.2 that ships with macOS,
# where **/*.js silently collapses to */*.js and misses everything deeper.
find app/controllers -name '*.js' -exec grep -ho "^function [a-zA-Z0-9_]*" {} + |
  sort | uniq -c | sort -rn | head -20

# How many files in a family share one construct? Exclude the shared pieces that
# live in the same folder but are not members — they inflate the denominator.
FAM=$(ls app/controllers/paneles/*.js | grep -v panelHeader)
for p in "mostrarPanel" "opacoClick" "animarVista.open" '$.getView().hide()'; do
  printf "%-22s %s/%s\n" "$p" "$(grep -lF "$p" $FAM | wc -l | tr -d ' ')" "$(echo "$FAM" | wc -l | tr -d ' ')"
done

# Rough size clustering — near-identical files tend to have near-identical line counts.
wc -l app/controllers/paneles/*.js | sort -n
```

**Reading it:** a construct in most of a family is a house pattern with no home. Every new member re-types it, and a change to it is an N-file edit that will be applied to N-2.

**What makes it wrong:** the family is not a family. Screens that share a folder are not necessarily variations of one thing, and a shared base imposed on genuinely different screens becomes a flag farm. Check that the members do the same *kind* of job before proposing to unify them.

**Where to go:** [Alloy reuse § when a family of screens has already formed](alloy-reuse.md#when-a-family-of-screens-has-already-formed) — it lays out the three defensible fixes and what each costs.

## 2. Events with a single listener

```bash
# Every event name that is fired, and every one that is listened for.
grep -rhno "Alloy\.Events\.trigger(['\"][^'\"]*" app/ | sed "s/.*['\"]//" | sort | uniq -c | sort -rn
grep -rhno "Alloy\.Events\.on(['\"][^'\"]*"      app/ | sed "s/.*['\"]//" | sort | uniq -c | sort -rn

# Same, for the leakier cross-context bus.
grep -rn "Ti\.App\.fireEvent\|Ti\.App\.addEventListener" app/
```

**Reading it:** an event with one trigger and one listener, where the two modules can see each other, is a function call with a name to keep in sync and a listener to clean up. Replace it with a direct call or a callback in `$.args`.

An event fired but never listened for is dead. An event listened for but never fired is either dead or fired from native code — check before deleting.

**What makes it wrong:** the listener set is genuinely open (a theme finishing its download, a session expiring), or the sender is a lower layer that must not know about the receiver. Both are correct uses; the count alone cannot tell them apart. Read the two modules before concluding.

**Where to go:** [Indirection § events versus a direct call](indirection.md#events-versus-a-direct-call).

## 3. Wrappers that wrap nothing

```bash
# One-line functions that forward their arguments unchanged.
grep -rn -B1 -A3 "^function [a-zA-Z0-9_]*(" app/lib/*.js |
  grep -A1 "^function" | grep -E "return (Ti|Modules|Alloy)\.[A-Za-z.]+\("

# How many callers does each exported function actually have?
grep -ho "^exports\.[a-zA-Z0-9_]*" app/lib/*.js | sed 's/exports\.//' | sort -u |
  while read f; do printf "%-28s %s\n" "$f" "$(grep -rl "\.$f(" app/ | wc -l | tr -d ' ')"; done | sort -k2 -n
```

**Reading it:** a function that forwards one call unchanged, from one site, adding no normalization, no error handling and no default, is a longer name for the thing it calls.

**What makes it wrong:** it is a vendor seam. A wrapper whose whole job is to be the one place that changes when the module does is doing that job even while it is trivial. Ask whether the module's API is spreading through controllers — if it is, the wrapper is earning its keep in advance.

**Where to go:** [Indirection § wrappers](indirection.md#wrappers).

## 4. Layout computed in JavaScript

```bash
# Measuring and repositioning after the draw.
grep -rn "postlayout\|\.rect\b\|\.size\.width\|\.size\.height" app/controllers/ app/lib/

# Positions and sizes assigned from JS rather than declared in TSS.
grep -rn "applyProperties({[^}]*\(top\|left\|right\|bottom\|width\|height\):" app/controllers/
```

**Reading it:** a `postlayout` handler that measures a window and repositions its children runs after the first draw — the content visibly jumps — and re-runs on every layout pass. TSS conditionals (`[formFactor=tablet]`, `[platform=ios]`, `[if=…]`) resolve once, before anything is drawn.

**What makes it wrong:** the handler reacts to a real orientation change, or the value genuinely is not knowable at build time. When a decision must be made before the first draw, `Ti.Platform.displayCaps` answers it without waiting for a layout pass.

**Where to go:** [Indirection § layout logic in JavaScript](indirection.md#layout-logic-in-javascript).

## 5. Repeated class strings in the views

```bash
# The most-repeated class attributes in the project.
grep -rho 'class="[^"]*"' app/views/ | sort | uniq -c | sort -rn | head -20
```

**Reading it:** the same combination in several views, meant to stay identical, is a name waiting to be given — an `apply` rule in `purgetss/config.cjs`.

**What makes it wrong:** the agreement is coincidental. Two screens with the same padding today for unrelated reasons will need different padding tomorrow, and a shared class couples things that were never related.

**Where to go:** [PurgeTSS reuse § when a repeated string has earned a name](purgetss-reuse.md#when-a-repeated-string-has-earned-a-name).

## 6. Structure nobody reaches

```bash
# Exported functions with no caller anywhere in app/.
grep -ho "^exports\.[a-zA-Z0-9_]*" app/lib/*.js | sed 's/exports\.//' | sort -u |
  while read f; do
    [ "$(grep -rl "\.$f(" app/ | grep -v "app/lib" | wc -l | tr -d ' ')" = "0" ] && echo "no external caller: $f"
  done

# Config keys nobody reads, and modules declared but never required.
grep -o '"[a-zA-Z0-9_]*":' app/config.json | tr -d '":' | sort -u |
  while read k; do
    [ "$(grep -rl "Alloy\.CFG\.$k" app/ | wc -l | tr -d ' ')" = "0" ] && echo "unread config key: $k"
  done
grep -o "<module[^>]*>[^<]*</module>" tiapp.xml | sed 's/.*>\(.*\)<.*/\1/' |
  while read m; do
    [ "$(grep -rl "require('$m')\|require(\"$m\")" app/ | wc -l | tr -d ' ')" = "0" ] && echo "module never required in JS: $m"
  done
```

**Reading it:** each of these is rung 0 in hindsight — something built for a caller that never arrived.

**What makes it wrong, and this one bites:** a `grep` for a caller finds only the callers spelled that way. A function reached through a dynamic name, from a Widget, from `alloy.js`, from a native module, or from a project file outside `app/` will look dead and will not be. Modules in particular are frequently declared for their build-time side effects and never `require`d in JS — reached instead from a `module=` attribute in a view, or simply linked into the build. That is normal, not dead. A module declared once per platform also shows up twice; pipe through `sort -u` before reading the list. **Never delete on the strength of this sweep alone.** Report the candidate, say how it was found, and let someone who knows the history confirm.

## Reporting

Group findings by what they cost, not by how many there are:

1. **Costs a bug soon** — one behavior in N places that must agree and are already drifting. Cite the files and how they differ.
2. **Costs on every read** — a detour that always resolves to one place; a wrapper around one call; an event with one listener.
3. **Costs nothing yet** — a house pattern with no home, worth consolidating when the next member is added rather than today.

For each, give the measurement, the command, the proposed change, **and what it would cost** — including the case for leaving it alone. Then stop. A sweep that ends in an unrequested refactor has answered a question nobody asked, and the diff will be judged against a request that does not exist.
