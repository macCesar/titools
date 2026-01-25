# Alloy Data Mastery: Sync Adapters and Binding

## 1. Sync Adapters
Sync adapters connect Backbone Models to persistent storage.
- **Ready-Made Adapters**:
  - `sql`: SQLite (Android/iOS). Supports `query` in `fetch()` and `idAttribute`.
  - `properties`: `Ti.App.Properties` storage.
- **Custom Adapters**: Created in `app/lib/alloy/sync`. Requires `sync` function implementation.
- **Migrations**: Incremental database changes. Named `YYYYMMDDHHmmss_model.js`.
  - **CRITICAL**: Do not close the `db` handle or open a second instance within a migration.

## 2. Data Binding Principles
- **Collection Binding**: Bind a collection to a container (ListView, TableView, ScrollableView).
  - Mandatory: `dataCollection` attribute.
  - Optional: `dataTransform` (JSON mapping), `dataFilter` (filtering models), `dataFunction` (manual update trigger).
- **Model Binding**: Bind a single model to a view (e.g., `<Label text="{model.name}" />`).
- **Memory Management**: **CRITICAL**: You MUST call `$.destroy()` on the controller's `close` event to unbind Backbone listeners and prevent leaks.

## 3. High-Performance Transformations
- **Lazy Transformation**: Use `Object.defineProperty` in `extendModel` to compute transformations only when accessed.
  ```javascript
  transform: function() {
    const t = this.toJSON();
    Object.defineProperty(t, 'friendlyDate', {
      get: () => moment(t.date).fromNow()
    });
    return t;
  }
  ```
