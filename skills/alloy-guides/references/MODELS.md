# Alloy models, collections and binding

A Backbone model is a record with attributes and events; a collection holds models. Alloy adds persistence through a sync adapter selected per model. Use this layer for data shared across screens, persistent data or state that outlives a screen. A one-shot response can use `Ti.Network` and a plain array instead.

## Define and use a model

```javascript
// app/models/note.js
exports.definition = {
    config: {
        columns: {
            id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
            body: 'TEXT',
            done: 'INTEGER'
        },
        adapter: {
            type: 'sql',
            collection_name: 'notes',
            idAttribute: 'id'
        }
    },
    extendModel(Model) {
        _.extend(Model.prototype, {
            toggle() {
                this.save({ done: this.get('done') ? 0 : 1 });
            }
        });
        return Model;
    }
};
```

`columns` describes the schema. The adapter creates the table on first use; later schema changes require [migrations](./MODELS_ADVANCED.md). `extendModel` and `extendCollection` add behavior and must return their supplied class. Preserve the method's dynamic `this`; an arrow would change it.

```javascript
const notes = Alloy.createCollection('note');
notes.fetch();
const note = Alloy.createModel('note', { body: 'Write the docs', done: 0 });
note.save();
notes.add(note);
```

`fetch()` reads and `save()` writes through the adapter. They are network operations only if the adapter implements networking. Create an independent collection with `Alloy.createCollection`; declare a shared singleton with `<Collection src="note" />`, then access `Alloy.Collections.note`. Reading a missing JavaScript property alone does not create it.

## Bind a collection to a list

```xml
<!-- app/views/index.xml -->
<Alloy>
    <Collection src="note" />
    <Window id="index">
        <ListView defaultItemTemplate="noteRow">
            <Templates>
                <ItemTemplate name="noteRow">
                    <Label bindId="body" />
                </ItemTemplate>
            </Templates>
            <ListSection dataCollection="note" dataFilter="onlyOpen" dataTransform="forRow">
                <ListItem body:text="{body}" />
            </ListSection>
        </ListView>
    </Window>
</Alloy>
```

```javascript
// app/controllers/index.js
function onlyOpen(collection) {
    return collection.where({ done: 0 });
}

function forRow(model) {
    const row = model.toJSON();
    row.body = row.body.toUpperCase();
    return row;
}

Alloy.Collections.note.fetch();
$.index.addEventListener('close', () => {
    $.destroy();
});
$.index.open();
```

`dataCollection` names the collection; `{body}` supplies a model value to the list item. Additions and removals update rows. `dataFilter` returns the models to display; `dataTransform` reshapes each model for the view. Keep transformations inexpensive because they run per row on changes.

Bindings retain the view. Always call `$.destroy()` when disposing of a binding controller, alongside cleanup for listeners and timers described in [controllers](./CONTROLLERS.md#cleaning-up).

Source: [models and collections](https://titaniumsdk.com/docs/alloy/models.md). The singleton wording is corrected against released Alloy 3.0.1; explicit declaration is required.
