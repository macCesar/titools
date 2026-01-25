# Alloy Widgets and Themes

## 1. Widgets (Self-contained components)
- **Structure**: Mirror the `app` directory. Main controller is `widget.js`.
- **Public API**: Methods prefixed with `$` are public (e.g., `$.init = (args) => {}`).
- **Resource Access**: Use `WPATH()` for widget assets and libs (e.g., `require(WPATH('helper'))`).
- **Nesting**: Widgets can contain other widgets via `<Widget src="widgetName" name="subController" />`.

## 2. Styling Priorities (Low to High)
1. `app.tss` (Global)
2. `themes/<name>/styles/app.tss` (Theme Global)
3. `styles/<controller>.tss` (Controller Style)
4. `themes/<name>/styles/<controller>.tss` (Theme Controller Style)
5. XML attributes (Inline Style)

## 3. Themes
- Located in `app/themes/<theme_name>`.
- Merges `config.json`, `i18n`, and `styles`. Overwrites `assets` and `lib`.
- Configured in `config.json` via the `theme` key. Supports per-platform themes.
