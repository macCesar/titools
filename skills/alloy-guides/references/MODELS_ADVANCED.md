# Alloy persistence and schema migrations

Use a sync adapter in the model's `config.adapter`. See [model definition and binding](./MODELS.md) for a complete model/controller/view setup.

| Adapter | Storage | Current use |
| --- | --- | --- |
| `sql` | SQLite table | Queryable or growing data |
| `properties` | `Ti.App.Properties` | Small datasets |
| `localStorage` | HTML5 storage | Requires a web-storage environment; not a native Android/iOS adapter |

The current guide lists all three. In released Alloy, `localStorage` directly depends on an HTML5 `localStorage` object; do not select it as native persistence simply because it is listed. `properties` serializes the complete collection on writes and slows down as it grows. Choose `sql` unless the small-dataset case fits.

## Migrations

Changing `columns` does not alter an existing database table. Without a migration, a later version can fail with missing-column errors. SQL migrations run in filename timestamp order:

```javascript
// app/migrations/20260907120000_note.js
migration.up = (migrator) => {
    migrator.createTable({
        columns: {
            id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
            body: 'TEXT',
            done: 'INTEGER'
        }
    });
};

migration.down = (migrator) => {
    migrator.dropTable();
};
```

This creates the initial table; it is not an example of adding a column to an existing table. Supply the migration that corresponds to each subsequent schema change, keeping timestamp order.

## Backbone configuration

Pin Backbone explicitly in `app/config.json` using `"backbone": "1.4.0"`. The currently published guide attributes 1.4.0 to Alloy 3.1.0, while the released Alloy 3.0.1 template already selects it. Do not infer an installed Alloy version from that sentence; check `alloy --version` and the project's actual setting.

Source: [models and collections](https://titaniumsdk.com/docs/alloy/models.md). Adapter and release caveats are checked against released Alloy 3.0.1.
