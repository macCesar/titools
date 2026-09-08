# PurgeTSS reuse

In a PurgeTSS project the duplication moves into the XML, where it is easy to miss because a repeated `class` string does not look like copied code. It is. The same five utilities typed into fifteen views is fifteen places to edit when the design changes, and the edit will land in twelve of them.

This reference covers where a style belongs and when a repeated string has earned a name. For whether a given utility class exists at all, invoke the `purgetss` skill — its class contract resembles Tailwind's but is not identical, and a class that does not exist fails silently.

## Where a style belongs

| Situation | Where it goes |
| --- | --- |
| A composition of existing utilities used in several views | A named class in `purgetss/config.cjs` via `apply` |
| A property PurgeTSS has no utility for | A rule in `purgetss/config.cjs`, or a hand-written block in `_app.tss` |
| A one-off on a single element | The `class` attribute in that view, inline |
| Anything at all | **Never `app/styles/app.tss`** |

`app.tss` is generated. PurgeTSS overwrites it on every run — it copies `_app.tss` into it [source: purgetss installation-setup.md] — so edits made there are work that deletes itself, usually a build or two later, which is long enough for the cause to be forgotten.

## Rung 1 for styles: search before you write a block

Before hand-writing a TSS rule, check whether a utility already does it. The PurgeTSS class set is large, and reimplementing a utility as a manual block is the styling version of reimplementing a `Ti.*` API.

```bash
grep -n "className" app/styles/_app.tss purgetss/config.cjs   # is it already a project class?
grep -rn "class=\"[^\"]*someUtility" app/views/                # how is this done elsewhere?
```

If the design already exists somewhere in `app/views/`, copy how it is expressed there rather than inventing a second way to say the same thing. Two spellings of one visual result is duplication that no `grep` for a class name will ever find.

## When a repeated string has earned a name

Extract with `apply` when the same combination appears in several views **and** they are meant to stay identical — a design decision, not a coincidence.

```javascript
// purgetss/config.cjs
theme: {
  '.fondo-panel': {
    apply: 'fondo-opaco hidden opacity-0'
  },
  '.tarjeta-panel': {
    apply: 'zoom-in-125 bg-panel close:duration-0 open:duration-100'
  }
}
```

```xml
<!-- Before: fifteen views carrying the same two strings -->
<View class="fondo-opaco hidden opacity-0">
  <View class="zoom-in-125 bg-panel close:duration-0 open:duration-100">

<!-- After: one place to change the house style -->
<View class="fondo-panel">
  <View class="tarjeta-panel">
```

A measured example, from the same app whose panels are counted in [Alloy reuse](alloy-reuse.md#when-a-family-of-screens-has-already-formed): of 18 panel views, 14 carry an identical scrim string and 9 an identical card string. Two `apply` rules replace 23 repetitions, and the next panel inherits the house style instead of re-typing it.

Count exact attributes, not substrings. Grepping for `zoom-in-125` in those same views returns 15 files — but six of them spell the rest of the string differently, and a class extracted from a substring match would quietly change how those six look. The count that matters is of the whole attribute.

Counting is one command:

```bash
# Exact class attributes, most repeated first.
grep -rho 'class="[^"]*"' app/views/ | sort | uniq -c | sort -rn | head -20
```

**When not to extract:**

- **One use.** A name for a single site is indirection with a stylesheet accent — now the reader has to look somewhere else to learn what one element looks like.
- **Coincidental agreement.** Two screens that happen to use the same padding today, for unrelated reasons, will need different padding tomorrow. Extracting them couples two things that were never related, and the flag that eventually separates them costs more than the duplication did.
- **Names that describe appearance rather than role.** `.tarjeta-panel` survives a redesign; `.caja-blanca-redondeada` becomes a lie the first time the card turns grey, and nobody renames it.

The test: *if this changes, must every user of it change too?* Yes → one name. No → leave them apart.

## Device and platform differences belong here, not in JavaScript

PurgeTSS carries platform and device modifiers, and `config.cjs` rules take `ios`, `android`, `handheld` and `tablet` blocks [source: purgetss custom-rules.md]. A tablet layout expressed as `tablet:w-1/2` resolves at build time, once. The same result computed in a `postlayout` handler runs after the first draw, so the content visibly jumps, and re-runs on every layout pass.

If a layout decision is being made with arithmetic in a controller, the question is which modifier expresses it. See [Indirection § layout logic in JavaScript](indirection.md#layout-logic-in-javascript).

## Verify every class

PurgeTSS looks like Tailwind and diverges from it in specific places, and Titanium has no equivalent of a browser's inspector to show a class doing nothing. A misremembered class name produces no error, no warning, and an element that quietly ignores it.

Invoke the `purgetss` skill and confirm each class you write. Citing it costs one line; a class that silently does nothing costs a build, a device, and someone's afternoon.
