# Alloy Models — Advanced Topics

Persistence, custom adapters, schema migrations, plain Backbone usage, and the Backbone 0.9.2 → 1.1.2 / 1.3.3 migration. For core model and collection definition, plus data binding to views, see [MODELS.md](MODELS.md).

1. [Alloy Sync Adapters and Migrations](#alloy-sync-adapters-and-migrations)
2. [Backbone Objects without Alloy](#backbone-objects-without-alloy)
3. [Alloy Backbone Migration](#alloy-backbone-migration)

## Alloy Sync Adapters and Migrations

### Sync Adapters

In Alloy, a sync adapter allows you to store and load your models to a persistent storage device, such as an on-device database or remote server. Alloy relies on the Backbone API to sync model data to persistent storage.

#### Backbone Sync

Backbone syncs your models to persistent storage devices based on the implementation of the [Backbone.sync method](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_Guide/Alloy_Models/Alloy_Sync_Adapters_and_Migrations.html). Since Backbone's primary use is for web applications, by default, the Backbone.sync method executes RESTful JSON requests to a URL specified by the Model.urlRoot or Collection.url attribute, when these classes are created.

Models are accessed from persistent storage based on the `id` attribute. To override this, set the `idAttribute` property of the model. The `cid` (client ID) is a special property of models that is automatically assigned when they are first created. Client IDs are useful when the model has not yet been saved to the server and does not have its real `id` yet.

The sync method depends on calls to other Backbone methods as described in the table below.

| **Backbone Method**                                              | **Sync CRUD Method** | **Equivalent HTTP Method** | **Equivalent SQL Method** |
| ---------------------------------------------------------------- | -------------------- | -------------------------- | ------------------------- |
| Collection.fetch                                                 | read                 | GET                        | SELECT                    |
| Collection.create (id == null) or Collection.create (id != null) | create or update     | POST or PUT                | INSERT or UPDATE          |
| Model.fetch                                                      | read                 | GET                        | SELECT                    |
| Model.save (id == null) or Model.save (id != null)               | create or update     | POST or PUT                | INSERT or UPDATE          |
| Model.destroy                                                    | delete               | DELETE                     | DELETE                    |

#### Ready-Made Sync Adapters

Alloy provides a few ready-made sync adapters. In the 'adapter' object, set the 'type' to use one of the following:

* `sql` for the SQLite database on the Android and iOS platform.
* `properties` for storing data locally in the Titanium SDK context. You do not need to define the `columns` object in the `config` object. If defined, the object is ignored.
* `localStorage` for HTML5 localStorage on the Mobile Web platform. Deprecated since Alloy 1.5.0. Use the `properties` adapter instead.

These adapters are part of Alloy and are copied to the `Resources/alloy/sync` folder during compilation. These sync adapters assign the `id` attribute of the models, which means if you assign an ID when creating a model, it is overridden by any sync operations.

##### SQLite Sync Adapter Features

The `sql` sync adapter has a few extra features:

**Fetch method accepts SQL Query**

The Backbone.Collection.fetch method supports SQL queries as a parameter. Use `query` as the key in the dictionary object to create a simple query or query with a prepared statement.

```javascript
const library = Alloy.createCollection('book');
const table = library.config.adapter.collection_name;
// use a simple query
library.fetch({query:'SELECT * from ' + table + ' where author="' + searchAuthor + '"'});
// or a prepared statement
library.fetch({query: { statement: 'SELECT * from ' + table + ' where author = ?', params: [searchAuthor] }});
```

**Fetch method accepts ID attribute**

Since Alloy 1.3.0, to fetch a single model using its ID, pass a dictionary with one key-value pair, where `id` is the key and the model's ID as the value to retrieve that model, to the `fetch` method instead of using a SQL query. For example:

```
myModel.fetch({id: 123});
// is equivalent to
myModel.fetch({query: 'select * from ... where id = ' + 123 });
```

**Columns accept SQLite keywords**

The columns values accept SQLite keywords, such as AUTOINCREMENT and PRIMARY KEY. For example:

**app/models/book.js**

```javascript
exports.definition = {
    config: {
        "columns": {
            "title": "TEXT",
            "author": "TEXT",
            "book_id": "INTEGER PRIMARY KEY AUTOINCREMENT"
        },
        "adapter": {
            "type": "sql",
            "collection_name": "books",
            "idAttribute": "book_id"
        }
    }
}
```

**Specify columns property as primary ID**

Define the `idAttribute` key-value pair in the `config.adapter` object to use a `config.columns` key as the primary ID for the SQLite table. If this key is not set, Alloy creates the `alloy_id` column in the table and generates a default GUID as the model ID.

**Specify a migration to use**

Define the `migration` key-value pair in the `config.adapter` object to specify the database version to use. The value of this key is the datetime code of the migration file. Alloy upgrades or rolls back the database based on this value. If left undefined, Alloy upgrades the database based on the newest migration file.

**Specify a database to use**

Define the `db_name` key-value pair in the `config.adapter` object to specify the name of the database to use. If left undefined, Alloy uses the default database `_alloy_`.

**Specify a database file to preload**

Define the `db_file` key-value pair in the `config.adapter` object to specify the database file ('myfile.sqlite') to preload. Place this file in the `app/assets` directory of your Alloy project. Alloy creates a database using the name of the database file minus the file extension if one does not exist.

### Custom Sync Adapters

To create a custom sync adapter, create a JavaScript file in either `app/assets/alloy/sync` or `app/lib/alloy/sync`. During compilation, this file is copied to the `Resources/alloy/sync` folder. In the `config` object of the model file, set the `type` in the `adapter` object to the name of the JavaScript file minus the '.js' extension.

The sync adapter exports three functions:

* `module.exports.beforeModelCreate` (optional) - executes code before creating the Backbone.Model class. First passed parameter is the `config` object from the model file. Second passed parameter is the name of the Alloy Model file. Returns a `config` object.

* `module.exports.afterModelCreate` (optional) - execute code after creating the Backbone.Model class. First passed parameter is the newly created Backbone.Model class. Second passed parameter is the name of the Alloy Model file.

* `module.exports.sync` - implement the Backbone.sync method.

### Migrations

A migration is a description of incremental changes to a database, which takes your database from version 1 to version X, with a migration file for each step in the evolution of your database schema. This is helpful to keep different versions of a database in sync. For example, when version 7 of your application is deployed, migrations can successfully update the database from versions 1 through 6. Currently, migrations are only used with the `sql` sync adapter.

The `migration.up` function upgrades the database from the previous version, while the `migration.down` function rolls back the changes to the previous version.

In Alloy, migrations are defined by JavaScript files located in the `app/migrations` folder of the project. The file should be named the same as the model JavaScript file prefixed with 'YYYYMMDDHHmmss_' (datetime code followed by an underscore), for example, `20120610049877_book.js`. Alloy applies the migrations from oldest to newest, according to the datetime code at the beginning of the file name.

The migration file contains two functions that need to be implemented: `migration.up(migrator)` and `migration.down(migrator)`, where `migrator` is a special migration object that provides references to the database and table as well as some convenient functions for table operations:

| Key           | Description                                                                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `db`          | Handle to a `Ti.Database` instance. Use this handle to execute SQL calls using `db.execute`. DO NOT CLOSE THIS HANDLE OR OPEN A SECOND INSTANCE OF THE DATABASE. |
| `dbname`      | Name of the database.                                                                                                                                            |
| `table`       | Name of the table. Same as value of the `config.adapter.collection_name` key.                                                                                    |
| `idAttribute` | Name of the columns attribute to use as the primary key.                                                                                                         |
| `createTable` | Function to create a table. Required parameter is the `columns` object.                                                                                          |
| `dropTable`   | Function to drop the current table from the database.                                                                                                            |
| `insertRow`   | Function to insert data into the table. Useful for preloading data.                                                                                              |
| `deleteRow`   | Function to delete data from the table.                                                                                                                          |

For example, the migration file below is the initial version of the database that preloads some data in the table.

**app/migrations/20120610049877_book.js**

```javascript
const preload_data = [
  {title: 'To Kill a Mockingbird', author:'Harper Lee'},
  {title: 'The Catcher in the Rye', author:'J. D. Salinger'},
  {title: 'Of Mice and Men', author:'John Steinbeck'},
  {title: 'Lord of the Flies', author:'William Golding'},
  {title: 'The Great Gatsby', author:'F. Scott Fitzgerald'},
  {title: 'Animal Farm', author:'George Orwell'}
];

migration.up = migrator => {
    migrator.createTable({
        "columns":
        {
            "book": "TEXT",
            "author": "TEXT"
        }
    });
    for (let i = 0; i < preload_data.length; i++) {
      migrator.insertRow(preload_data[i]);
    }
};

migration.down = migrator => {
    migrator.dropTable();
};
```

#### Migration Rollback Example

Suppose later, you want to include some additional information for your books, such as an ISBN. The below migration file upgrades or rolls back the changes. Since SQLite does not support the DROP COLUMN operation, the migration needs to create a temporary table to hold the data, drop the new database, create the old database, then copy the data back. Note: if `idAttribute` is not specified, Alloy creates the `alloy_id` column and this column needs to be copied over as part of the migration.

**app/migrations/20130118069778_book.js**

```javascript
migration.up = migrator => {
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN isbn INT;');
};

migration.down = migrator => {
    const db = migrator.db;
    const table = migrator.table;
    db.execute('CREATE TEMPORARY TABLE book_backup(title,author,alloy_id);')
    db.execute('INSERT INTO book_backup SELECT title,author,alloy_id FROM ' + table + ';');
    migrator.dropTable();
    migrator.createTable({
        columns: {
            title:"TEXT",
            author:"TEXT",
        },
    });
    db.execute('INSERT INTO ' + table + ' SELECT title,author,alloy_id FROM book_backup;');
    db.execute('DROP TABLE book_backup;');
};
```

## Backbone Objects without Alloy

You can use plain Backbone Collection and Model objects in place of the Alloy versions. This does not require any special Alloy or Titanium code. Use the Backbone API to create and control Backbone objects instead of using the `createCollection` and `createModel` methods. Backbone models also do not require a model configuration file.

**app/controllers/index.js**

```javascript
// Initialize a collection class and implement the comparator method for sorting
const collection = Backbone.Collection.extend({
  comparator(model) {
    return model.get('title');
  }
});

// Create a new collection
const library = new collection([
  {title: 'To Kill a Mockingbird', author:'Harper Lee'},
  {title: 'The Catcher in the Rye', author:'J. D. Salinger'},
  {title: 'Of Mice and Men', author:'John Steinbeck'},
  {title: 'Lord of the Flies', author:'William Golding'},
  {title: 'The Great Gatsby', author:'F. Scott Fitzgerald'},
  {title: 'Tom Sawyer', author:'Mark Twain'},
  {title: 'Animal Farm', author:'George Orwell'}
]);

// Initialize a model class
const modelClass = Backbone.Model.extend();

// Create a new model and add it to the collection
const book = new modelClass({title:'Bossypants', author:'Tina Fey'});
library.add(book);

// Remove the very first model from the collection
const model = library.at(0);
library.remove(model);
```

These Backbone objects cannot persist to external storage without implementing the Backbone.sync method, so if you make calls to Collection.fetch, Collection.create, Model.fetch, Model.save and Model.destroy, the application throws an error.

### Using Backbone Objects with Alloy Data Binding

You can use Alloy's Model-View binding mechanism to keep the local Backbone Models and Collections in sync with an Alloy view-controller. Follow the same directions for data binding except instead of using the `Model` or `Collections` XML tag, you need to first initialize your model or collection in the alloy.js initializer file and add it to the `Alloy.Models` or `Alloy.Collections` namespace.

**app/alloy.js**

```javascript
// Initialize a collection class and implement the comparator method for sorting
const collection = Backbone.Collection.extend({
  comparator(model) {
    return model.get('title');
  }
});

// Create a new collection
const library = new collection([
  {title: 'To Kill a Mockingbird', author:'Harper Lee'},
  {title: 'The Catcher in the Rye', author:'J. D. Salinger'},
  {title: 'Of Mice and Men', author:'John Steinbeck'},
  {title: 'Lord of the Flies', author:'William Golding'},
  {title: 'The Great Gatsby', author:'F. Scott Fitzgerald'},
  {title: 'Tom Sawyer', author:'Mark Twain'},
  {title: 'Animal Farm', author:'George Orwell'}
]);

// Add the collection to the global scope
Alloy.Collections.book = library;
```

**app/views/index.xml**

```xml
<!-- Markup the view the same except there is no Collection tag -->
<Alloy>
    <Window class="container">
        <TableView dataCollection="book" dataTransform="transformFunction" dataFilter="filterFunction">
            <TableViewRow title="{title}" />
        </TableView>
    </Window>
</Alloy>
```

**app/controllers/index.js**

```javascript
$.index.open();

function transformFunction(model) {
    const transform = model.toJSON();
    transform.title = '[' + transform.title + ']';
    transform.custom = transform.title + " by " + transform.author;
    return transform;
}

function filterFunction(collection) {
    return collection.where({author:'Mark Twain'});
}

// Get a reference to the library
const library = Alloy.Collections.book;

// Trigger the update using the 'change' event instead of the fetch method
library.trigger('change');

// Initialize a model class
const modelClass = Backbone.Model.extend();

// Create a new model and add it to the collection
const book = new modelClass({title:'Bossypants', author:'Tina Fey'});
library.add(book);

// Remove the very first model from the collection
const model = library.at(0);
library.remove(model);

// Do not forget to call destroy to unbind the event handlers created by Alloy
$.index.addEventListener('close', () => {
    $.destroy();
});
```

## Alloy Backbone Migration

### Overview

Alloy 1.6.0 introduces support for Backbone 1.1.2. Currently, Alloy uses Backbone 0.9.2 to support its Model and Collection objects. This guide covers the changes from Backbone 0.9.2 to 1.1.2 and the modifications you may need to update your application. Note that only changes to the Backbone Collection, Event and Model APIs are discussed in this document.

Due to breaking changes from Backbone 0.9.2 to 1.1.2, Alloy still uses Backbone 0.9.2 as its default Model and Collection implementation. You will need to update the configuration file to use the newer Backbone library.

Alloy 1.10.12 adds support for Backbone 1.3.3. However, due to breaking changes in Backbone, 0.9.2 will remain the default version.

Supported versions of Backbone for Alloy 1.10.12 are 0.9.2, 1.1.2, 1.3.3.

### Setup

To use Backbone 1.1.2 to support Alloy Model and Collections objects, open the project's `./app/config.json` file and add the `backbone` key to the to the file with the value set to `1.1.2` (or `1.3.3`). You may also set this value to `0.9.2` to force support of Backbone 0.9.2.

**app/config.json**

```json
{
    "global": {},
    "env:development": {},
    "env:test": {},
    "env:production": {},
    "os:android": {},
    "os:blackberry": {},
    "os:ios": {},
    "os:mobileweb": {},
    "dependencies": {},
    "backbone": "1.1.2"
}
```

### Summary of Changes

#### Collection APIs

**Fetch Method Behavior Change**: Backbone Collection objects no longer emit the `reset` event after a `fetch()` call, which means data-bound views may not update automatically. **This could break existing apps.** To use old functionality, pass `{reset: true}` when calling `fetch()` or extend the Collection class:

```javascript
exports.definition = {
    config: {
        // Model configuration
    },
    extendModel(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here
        });
        return Model;
    },
    extendCollection(Collection) {
        _.extend(Collection.prototype, {
            // For Backbone v1.1.2, uncomment the following to override the
            // fetch method to account for a breaking change in Backbone.
            /*
            fetch(options) {
                options = options ? _.clone(options) : {};
                options.reset = true;
                return Backbone.Collection.prototype.fetch.call(this, options);
            }
            */
        });
        return Collection;
    }
};
```

**New Set Method**: To smartly update the contents of a Collection (adding new models, removing missing ones, and merging those already present), call `set()`.

**Return Value for Methods**: The return values of Collection's `add()`, `push()`, `remove()`, `reset()` and `shift()` methods return the changed model or list of models, instead of `this`.

**Add Method**: When invoking `add()` on a collection, passing `{merge: true}` will now cause duplicate models to have their attributes merged in to the existing models. To improve performance, `options.index` will no longer be set in the `add` event callback — use `collection.indexOf(model)` instead.

#### Event APIs

* All `invalid` events now pass consistent arguments. First the model in question, then the `error` object, then `options`.
* `Collection.sort()` now triggers a `sort` event, instead of a `reset` event.
* Both `sync` and `error` events within `Backbone.sync()` are now triggered regardless of the existence of success or error callbacks.
* While listening to a `reset` event, the list of previous models is now available in `options.previousModels`.
* The new Event methods `listenTo` and `stopListening` are meant for Backbone View objects. These APIs will not work with an Alloy application.

#### Model APIs

**Validation**: Model validation is now only enforced with the `save()` method. Previously, models were also validated with the `set()` method. To force validation when the `set()` method is called, pass `{validate: true}` to the method or extend the Model class. Also, validation now occurs even during 'silent' changes (passing `{silent: true}` to methods). Previously, it would not. Failed validations return the `invalid` event. Previously, a failed model validation would return the `error` event.

> **⚠️ ⚠️ Warning**
> To validate Model objects, implement the `validate()` method in the `extendModel` key of the model configuration file.

**Parse Method**: All `parse` methods now run after a `fetch`. You cannot change the `id` of a model during `parse`. The `parse` method receives `options` as a second parameter.

**Other Changes**:

* Calling `destroy()` on a Model will now return `false` if the model's `isNew` is set to `true`.
* `Model.set()` no longer accepts another model as an argument.
* `url` and `urlRoot` properties may now be passed as options when instantiating a new Model.
* If you want to maintain current models in a collection when using `fetch` the property has changed from `{add:true}` to `{remove:false}`.

### Parse Method

After fetching a model or a collection, all defined parse methods will now be run. So fetching a collection and getting back new models could cause both the collection to parse the list, and then each model to be parsed in turn, if you have both methods defined. By default, the parse method is a no-op function that directly passes the JSON response object.

You are no longer permitted to change the `id` of your model during `parse()`. Use `idAttribute` instead.

The parse function now receives the `options` dictionary as its second parameter. Previously, it would only be passed a raw `response` object.

### Silent Option

Passing `{silent:true}` to methods now suppresses the `change:attr` events, thus a data-bound view will not be updated to reflect the changes. The sql sync adapter passed this option by default. It has been updated to no longer pass that option when Backbone 1.1.2 is used (still passed with 0.9.2).

If you want the new behavior where `change` events are suppressed, you will need to pass this option or extend the Model or Collection class. The following sample code extends the Model `set()` method by forcing the silent option to true:

```javascript
exports.definition = {
    config: {
        // Model configuration
    },
    extendModel(Model) {
        _.extend(Model.prototype, {
            // Forces silent true option when the model is updated
            set(attributes, options) {
                options = options ? _.clone(options) : {};
                options.silent = true;
                return Backbone.Model.prototype.set.call(this, attributes, options);
            }
        });
        return Model;
    },
    extendCollection(Collection) {
        _.extend(Collection.prototype, {
            // extended functions and properties go here
        });
        return Collection;
    }
};
```

### API Changes

#### New APIs

The following APIs have been added between Backbone 1.1.2 and 0.9.2.

| API                           | Type   | Notes                                                                    |
| ----------------------------- | ------ | ------------------------------------------------------------------------ |
| Backbone.request              | event  | Fired whenever a request begins to be made to the server.                |
| Backbone.Collection.findWhere | method | Same as `where()` but only returns the first result.                     |
| Backbone.Collection.set       | method | Performs a "smart" update of the collection.                             |
| Backbone.Event.once           | method | Same as `on()` except after the event is fired, the callback is removed. |
| Backbone.Model.invert         | method | Returns a copy of the object where keys and values are switched.         |
| Backbone.Model.keys           | method | Returns an array of the object's keys.                                   |
| Backbone.Model.omit           | method | Returns a copy of an object without the specified keys.                  |
| Backbone.Model.pairs          | method | Returns an array of `[key, value]` pairs.                                |
| Backbone.Model.pick           | method | Returns a copy of an object with the specified keys.                     |
| Backbone.Model.values         | method | Returns an array of the object's property values.                        |

#### Removed APIs

The following APIs have been removed between Backbone 1.1.2 and 0.9.2.

| API                          | Type   | Notes                                       |
| ---------------------------- | ------ | ------------------------------------------- |
| Backbone.Collection.getByCid | method | Pass the CID to the `get()` method instead. |
| Backbone.Model.change        | method |                                             |
