# Theming and dark mode

Choose the styling path from the project, not from personal memory. Semantic
roles are the shared contract; PurgeTSS or standard Alloy materializes them.

## Contents

- [Decision path](#decision-path)
- [Semantic color contract](#semantic-color-contract)
- [PurgeTSS projects](#purgetss-projects)
- [Standard Alloy projects](#standard-alloy-projects)
- [Alloy build-time themes](#alloy-build-time-themes)
- [Runtime custom themes](#runtime-custom-themes)
- [Component rules](#component-rules)
- [Verification](#verification)

## Decision path

1. Detect `purgetss/` or `purgetss/config.cjs`.
2. If detected, invoke the `purgetss` skill before writing any class or style.
3. If not detected, use standard Alloy TSS and Titanium semantic colors.
4. Use `Alloy.Globals` for a runtime palette only when the product requires
   custom themes beyond the semantic light/dark/system model.

Do not mix these paths accidentally. In particular, never teach a PurgeTSS
project to maintain the generated `app/styles/app.tss` by hand.

## Semantic color contract

Name colors by purpose rather than appearance. A practical design-system
contract includes:

- app background and elevated surface;
- primary and secondary text;
- border/divider;
- accent and text on accent;
- modal overlay;
- success, warning, error, and their readable foreground colors;
- disabled surface/text where needed.

Define light and dark values in:

- Alloy: `app/assets/semantic.colors.json`
- Classic: `Resources/semantic.colors.json`

Example:

```json
{
  "surfaceColor": {
    "light": "#FFFFFF",
    "dark": "#1E293B"
  },
  "textColor": {
    "light": "#111827",
    "dark": "#F1F5F9"
  },
  "overlayColor": {
    "light": "#00000080",
    "dark": "#000000CC"
  }
}
```

Titanium resolves a semantic color name when a color-accepting property uses
that name. Keep component APIs tone-based (`neutral`, `success`, `warning`,
`error`) and map tones to semantic roles inside the visual layer. Do not pass
raw brand hex values through business controllers.

## PurgeTSS projects

The `purgetss` skill is the source of truth for supported classes, configuration,
appearance behavior, and commands. Apply these integration rules:

- Map semantic color names under `theme.extend.colors` in
  `purgetss/config.cjs`.
- Use verified utility classes in Alloy XML.
- Configure `options.widgets: true` when Widgets contain utility classes.
- Prefer `config.cjs` for reusable custom rules.
- Treat `app/styles/app.tss` as generated output and never edit it.
- Keep only truly specific properties in Widget/controller TSS when no verified
  utility exists.
- Use the PurgeTSS Appearance module for light/dark/system selection instead of
  creating a competing mode service.
- Read the current PurgeTSS references before naming any utility. Similarity to
  Tailwind is not evidence that a class exists.

Conceptual mapping only; verify the actual PurgeTSS syntax before use:

```javascript
// purgetss/config.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: 'surfaceColor',
        'on-surface': 'textColor',
        overlay: 'overlayColor'
      }
    }
  }
}
```

After generation, inspect the final `app.tss` section for unused or unsupported
classes. A clean build that still lists a new unsupported class is not complete.

## Standard Alloy projects

Without PurgeTSS:

- keep global selectors in manually maintained `app/styles/app.tss`;
- keep screen-specific selectors in `app/styles/<controller>.tss`;
- keep Widget-specific properties in `app/widgets/<id>/styles/widget.tss`;
- reference semantic color names from TSS or controller properties;
- use platform and form-factor modifiers for platform-specific properties.

Example:

```tss
"Window": {
  backgroundColor: "backgroundColor"
}

".card": {
  backgroundColor: "surfaceColor",
  borderColor: "borderColor",
  borderWidth: 1
}

".bodyText": {
  color: "textColor"
}
```

Do not copy a large utility system into manual TSS. Create only the small set of
selectors the app actually uses.

## Alloy build-time themes

Alloy's `app/themes/<name>/` folders can override views, styles, and assets at
build time. Select a theme through `app/config.json`. This is appropriate for
separate branded builds or compile-time variants.

Do not describe an Alloy build-time theme as runtime light/dark switching.
Semantic colors are the default for appearance changes while the app runs.

## Runtime custom themes

Use a centralized runtime palette or theme service only when semantic
light/dark/system colors cannot model the requirement, such as multiple user
selectable brand themes.

If that exception applies:

- keep the selected theme in one service;
- expose semantic roles, not control IDs;
- document how already-created proxies receive updates;
- remove all listeners in controller cleanup;
- avoid rebuilding the entire window tree unless the app has measured and
  accepted that tradeoff.

`Alloy.Globals` is a legacy/advanced interoperability option, not the first
recommendation for ordinary dark mode.

## Component rules

- Components consume semantic roles owned by the host app.
- Widgets own anatomy and behavior, not the product palette.
- Localized strings and business callbacks come from the host.
- Destructive styling must remain distinguishable in both appearances.
- Overlays, focus indicators, disabled states, and text must retain usable
  contrast in light, dark, and system modes.
- Do not create separate light/dark controller branches when a semantic color
  can express the difference.

## Verification

For every supported platform and form factor:

1. test light, dark, and follow-system modes;
2. change appearance while the relevant window remains open;
3. inspect dialogs, sheets, Snackbars, disabled controls, and overlays;
4. test localized long text and accessibility focus;
5. run PurgeTSS generation when detected and resolve unsupported classes;
6. compile and build both platform targets before claiming completion.

For exact PurgeTSS behavior, load its current `semantic-colors.md` and
`appearance-module.md` references. For Titanium property availability, verify
against the current `ti-api` skill.
