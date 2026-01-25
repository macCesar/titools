# Alloy Models

## Table of Contents

1. [Overview](#overview)
2. [Alloy Collection and Model Objects](#alloy-collection-and-model-objects)
3. [Alloy Data Binding](#alloy-data-binding)
4. [Alloy Sync Adapters and Migrations](#alloy-sync-adapters-and-migrations)
5. [Backbone Objects without Alloy](#backbone-objects-without-alloy)
6. [Alloy Backbone Migration](#alloy-backbone-migration)

## Overview

Alloy uses Backbone.js to provide support for its models and collections. Alloy also borrows the concepts of migrations and adapters from Rails for storage integration.

For models, collections and sync adapters, these guides only provides information on how Alloy utilizes the Backbone.js functionality and some simple examples of using it.

## Alloy Collection and Model Objects

### Models

In Alloy, models inherit from the [Backbone.Model](http://docs.appcelerator.com/backbone/0.9.2/#Model) class. They contain the interactive data and logic used to control and access it. Models are specified with JavaScript files, which provide a table schema, adapter configuration and logic to extend the Backbone.Model class. Models are automatically defined and available in the controller scope as the name of the JavaScript file.

The JavaScript file exports a definition object comprised of three different objects. The first object, called `config`, defines the table schema and adapter information. The next two objects `extendModel` and `extendCollection` define functions to extend, override or implement the Backbone.Model and Backbone.Collection classes, respectively.

**Example of the anatomy of a model file**

```
exports.definition = {
    config : { // table schema and adapter information
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, { // Extend, override or implement Backbone.Model
        });

        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, { // Extend, override or implement Backbone.Collection
    });

        return Collection;
    }
}
```

To access a model locally in a controller, use the `Alloy.createModel` method. The first required parameter is the name of the JavaScript file minus the '.js' extension. The second optional parameter is the attributes for initializing the model object. For example:

**Basic model usage**

```javascript
var book = Alloy.createModel('book', {title:'Green Eggs and Ham', author:'Dr. Seuss'});
var title = book.get('title');
var author = book.get('author');

// Label object in the view with id = 'label'
$.label.text = title + ' by ' + author;
```

The `book` model object is a Backbone object wrapped by Alloy, so it can be treated as a Backbone.Model object. You can use any Backbone Model or Events APIs with this object.

You can also create a global singleton instance of a model, either in markup or in the controller, which may be accessed in all controllers. Use the `Alloy.Models.instance` method with the name of the model file minus the extension as the only parameter to create or access the singleton. For example:

**Working with globally registered models**

```javascript
// This will create a singleton if it has not been previously created,
// or retrieves the singleton if it already exists.
var book = Alloy.Models.instance('book');
```

#### Configuration Object

The `config` object is comprised of three different objects: `columns`, `defaults` and `adapter`.

The `columns` object defines the table schema information. The key is the record name and the value is the data type. The following data types are accepted and mapped to the appropriate SQLite type: `string`, `varchar`, `int`, `tinyint`, `smallint`, `bigint`, `double`, `float`, `decimal`, `number`, `date`, `datetime` and `boolean`. By default, any unknown data type maps to the SQLite type `TEXT`. Alternatively, the SQLite sync adapter accepts the SQLite keywords.

The optional `defaults` object defines the default values for a record if one or more record fields are left undefined upon creation. The key is the record name and the value is the default value.

The adapter object defines how to access persistent storage. It contains two key-value pairs: `type` and `collection_name`. The `type` key identifies the sync adapter and the `collection_name` key identifies the name of the table in the database or a namespace.

For example, suppose there is a model object called book (`book.js`) defined as:

**book.js**

```javascript
exports.definition = {
    config: {
        "columns": {
            "title": "String",
            "author": "String"
        },
        "defaults": {
            "title": "-",
            "author": "-"
        },
        "adapter": {
            "type": "sql",
            "collection_name": "books"
        }
    }
}
```

The code above describes a book object, which has two `string` (or `TEXT`) fields: `title` and `author`. If either field is left undefined, it will be assigned with the default value, a dash ("-"). The `sql` type configures Backbone to use the SQL adapter to sync with the SQLite engine on Android and iOS devices to access a table in the database called "books".

You may add custom properties to the `config` object, which are available to the application as the model or collection's `config` property or can be processed by a custom sync adapter during application initialization.

#### Extending the Backbone.Model Class

The Backbone.Model class can be extended using the `extendModel` object, which implements the Backbone.Model `extend` method. This allows the Backbone.js code to be extended, overridden or implemented.

For example, the `validate` method is left unimplemented by Backbone.js. The model JS file can implement `validate(attrs)`, where the parameter `attrs` are changed attributes in the model. In Backbone.js, if `validate` is implemented, it is called by the `set` and `save(attributes)` methods before changing the attributes and is also called by the `isValid` method. For the `save` method, validate is called if the `attributes` parameter is defined.

In the example code `book.js` below, the JavaScript file implements the validate method, and adds a custom property and function.

**Extending a model**

```javascript
exports.definition = {
    config : { // table schema and adapter information
    },

    extendModel: function(Model) {
        _.extend(Model.prototype, {
            // Implement the validate method
            validate: function (attrs) {
                for (var key in attrs) {
                    var value = attrs[key];
                    if (key === "title") {
                        if (value.length <= 0) {
                            return "Error: No title!";
                        }
                    }
                    if (key === "author") {
                        if (value.length <= 0) {
                            return "Error: No author!";
                        }
                    }
                }
            },
            // Extend Backbone.Model
            customProperty: 'book',
            customFunction: function() {
                Ti.API.info('I am a book model.');
            },
        });

        return Model;
    }
}
```

In the controller, to access the model, do:

```javascript
var book = Alloy.createModel('book', {title:'Green Eggs and Ham', author:'Dr. Seuss'});
// Since set or save(attribute) is not being called, we can call isValid to validate the model object
if (book.isValid() && book.customProperty == "book") { // Save data to persistent storage
    book.save();
}
else {
    book.destroy();
}
```

### Collections

Collections are ordered sets of models and inherit from the Backbone.Collection class. Alloy Collections are automatically defined and available in the controller scope as the name of the model. To access a collection in the controller locally, use the `Alloy.createCollection` method with the name of the JavaScript file minus the '.js' extension as the required parameter. The second optional parameter can be an array of model objects for initialization. For example, the code below creates a collection using the previously defined model and reads data from persistent storage:

**Creating collections**

```javascript
var library = Alloy.createCollection('book');
library.fetch(); // Grab data from persistent storage
```

The `library` collection object is a Backbone object wrapped by Alloy, so it can be treated as a Backbone.Collection object. You can use any Backbone Collection or Events APIs with this object.

You can also create a global singleton instance, either in markup or in the controller, which may be accessed in all controllers. Use the `Alloy.Collections.instance` method with the name of the model file minus the extension as the only parameter to create or access the singleton. For example:

**Working with globally registered collections**

```javascript
// This will create a singleton if it has not been previously created,
// or retrieves the singleton if it already exists.
var library = Alloy.Collections.instance('book');
```

#### Extending the Backbone.Collection Class

Like the Backbone.Model class, the Backbone.Collection class can be similarly extended in the model JavaScript file. For example, the `comparator` method is left unimplemented in Backbone.js. The code below sorts the library by book title:

**Extending a collection**

```
exports.definition = {
    config : { // table schema and adapter information
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, { // Extend, override or implement Backbone.Model methods
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, { // Implement the comparator method.
            comparator : function(book) {
                return book.get('title');
            }
        }); // end extend

        return Collection;
    }
}
```

#### Underscore.js Functionality

Additionally, the Backbone.Collection class inherits some functionality from [Underscore.js](https://underscorejs.org/), which can help simplify iterative functions. For example, to add the title of each book object in the library collection to a table, you could use the `map` function to set the table:

**Iterating over a collection with underscore**

```javascript
var data = library.map(function(book) {
    // The book argument is an individual model object in the collection
    var title = book.get('title');
    var row = Ti.UI.createTableViewRow({"title":title});
    return row;
});
// TableView object in the view with id = 'table'
$.table.setData(data);
```

### Event Handling

When working with Alloy Models and Collections, use the Backbone.Events `on`, `off` and `trigger` methods. For example:

**Using events with collections**

```javascript
var library = Alloy.createCollection('book');
function event_callback (context) {
    var output = context || 'change is bad.';
    Ti.API.info(output);
};
// Bind the callback to the change event of the collection.
library.on('change', event_callback);
// Trigger the change event and pass context to the handler.
library.trigger('change', 'change is good.');
// Passing no parameters to the off method unbinds all event callbacks to the object.
library.off();
// This trigger does not have a response.
library.trigger('change');
```

Alloy Model and Collection objects don't support the Titanium `addEventListener`, `removeEventListener` and `fireEvent` methods.

If you are using Alloy's Model-View binding mechanism, the Backbone add, change, destroy, fetch, remove, and reset events are automatically bound to an internal callback to update the model data in the view. Be careful not to override or unbind these events.

If you want to fire or listen to multiple events, Backbone.js uses spaces to delimit its events in the event string; therefore, do **NOT** name any custom events with spaces.

## Alloy Data Binding

### Introduction

When data in the collection changes, you may want to update the view simultaneously to keep information synchronized. This concept is known as data binding. Both Alloy and Backbone provide some mechanisms to bind model data to a view.

### Alloy Binding

In Alloy, collection data can be synchronized to a view object, or a single model can be bound to a view component. Alloy monitors the Backbone add, change, destroy, fetch, remove, and reset events to update the data in the view.

#### Collection-View Binding

To enable collection-view binding, create a global singleton or controller-specific collection using the [Collection tag](https://docs.appcelerator.com/platform/latest/#!/guide/Alloy_XML_Markup-section-35621525_AlloyXMLMarkup-CollectionElement) in the XML markup of the main view, then add the view object you want to bind data to. The following Titanium view objects support binding to a Collection:

| View Object | Since Alloy version | Add data binding attributes to... | Repeater Object to map model attributes to view properties |
|-------------|---------------------|-----------------------------------|-----------------------------------------------------------|
| ButtonBar | 1.1 | `<Labels>` | `<Label/>` |
| CoverFlowView | 1.1 | `<Images>` | `<Image/>` |
| ListView | 1.2 | `<ListSection>` | `<ListItem/>` |
| Map Module | 1.4 | `<Module module="ti.map" method="createView">` | None, model attributes will be used as params for createAnnotation() directly. |
| Picker | 1.5 | `<PickerColumn>` or `<Column>` | `<PickerRow/>` or `<Row/>` |
| ScrollableView | 1.1 | `<ScrollableView>` | `<View/>` May contain children view objects. |
| TableView | 1.0 | `<TableView>` | `<TableViewRow/>` May contain children view objects. |
| TabbedBar | 1.1 | `<Labels>` | `<Label/>` |
| Toolbar | 1.1 | `<Items>` | `<Item/>` |
| View | 1.0 | `<View>` | Any view object except a top-level container like a Window or TabGroup |

You need to specify additional attributes in the markup, which are only specific to collection data binding. The only mandatory attribute is `dataCollection`, which specifies the collection singleton or instance to render. Note that you can only add these attributes to specific XML elements (refer to the table above).

* `dataCollection`: specifies the collection singleton or instance to bind to the table. This is the name of the model file for singletons or the ID prefixed with the controller symbol ('$') for instances.
* `dataTransform`: specifies an optional callback to use to format model attributes. The passed argument is a model and the return value is a modified model as a JSON object.
* `dataFilter`: specifies an optional callback to use to filter data in the collection. The passed argument is a collection and the return value is an array of models.
* `dataFunction`: set to an arbitrary identifier (name) for a function call. Use this identifier to call a function in the controller to manually update the view.

Next, create a repeater object (refer to the table above) and place it inline with the view object with the `dataCollection` attribute, or place it in a separate view and use the `Require` tag to import it.

To map model attributes, enclose the attribute with curly brackets or braces ('{' and '}'). You can map more than one attribute to a repeater object's property. For example, to assign the Label.text property to the model's title and author attributes, use this notation: `<Label text="{title} by {author}" />.` For more complex transformations, use the `dataTransform` callback to create a custom attribute.

In the controller code of the repeater object, you can use the special variable `$model` to reference the current model being iterated over. This variable is present only in data bound controllers and is a reference to the currently bound model. For example, to get the title attribute of the current model, use `$model.title` to access it.

::: warning ⚠️ Warning
**IMPORTANT:** When using Alloy's data binding in a view-controller, you **MUST** call the `$.destroy()` function when closing a controller to prevent potential memory leaks. The `destroy` function unbinds the callbacks created by Alloy when the collection-view syntax is used. For example:

```
$.win.addEventListener("close", function(){
    $.destroy();
}
```
:::

#### Collection-View Binding Example

The following example demonstrates how to add basic collection-view binding to an application. The example binds a collection of album models to a ScrollableView. In the ScrollableView, each model has its own view, which displays the album cover, title of the album and the artist. The `artist` and `title` attributes are bound to a Label object and the `cover` attribute is bound to an ImageView object.

1. Add the `<Collection>` tag as a child of the `<Alloy>` tag.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album" />
    </Alloy>
    ```

2. Next, add the view object(s) you want to bind the data to.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album" />
        <Window backgroundColor="white" onClose="cleanup">
            <ScrollableView></ScrollableView>
        </Window>
    </Alloy>
    ```

3. Add the `dataCollection` attribute to the appropriate view object.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album" />
        <Window backgroundColor="white" onClose="cleanup">
            <ScrollableView dataCollection="album"></ScrollableView>
        </Window>
    </Alloy>
    ```

4. Next, create your repeater object and add model attributes.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album"/>
        <Window backgroundColor="white" onClose="cleanup">
            <ScrollableView dataCollection="album">
                <View layout="vertical">
                    <ImageView image="{cover}" />
                    <Label text="{title} by {artist}" />
                </View>
            </ScrollableView>
        </Window>
    </Alloy>
    ```

5. In the controller, call the Collection's `fetch()` method to initialize the collection and sync any stored models to the view.

    **app/controllers/index.js**

    ```javascript
    $.index.open();
    Alloy.Collections.album.fetch();

    function cleanup() {
        $.destroy();
    }
    ```

#### Model-View Binding

To bind a single model to a component, create a global singleton or controller-specific model using the [Model tag](https://docs.appcelerator.com/platform/latest/#!/guide/Alloy_XML_Markup-section-35621525_AlloyXMLMarkup-ModelElement) in the XML markup of the main view and map the model attribute to the view component. To map the attribute to the view component, prefix the model name or id to the attribute, then enclose it with curly brackets or braces ('{' and '}').

To do complex transformations on the model attributes, extend the model prototype with a `transform()` function. It should return the modified model as a JSON object.

**app/models/album.js**

```javascript
exports.definition = {
  config: {}, // model definition
  extendModel: function(Model) {
    _.extend(Model.prototype, {
      transform: function transform() {
        var transformed = this.toJSON();
        transformed.artist = transformed.artist.toUpperCase();
        return transformed;
      }
    });
    return Model;
  }
};
```

## Alloy Sync Adapters and Migrations

### Sync Adapters

In Alloy, a sync adapter allows you to store and load your models to a persistent storage device, such as an on-device database or remote server. Alloy relies on the Backbone API to sync model data to persistent storage.

#### Backbone Sync

Backbone syncs your models to persistent storage devices based on the implementation of the [Backbone.sync method](http://docs.appcelerator.com/backbone/0.9.2/#Sync). Since Backbone's primary use is for web applications, by default, the Backbone.sync method executes RESTful JSON requests to a URL specified by the Model.urlRoot or Collection.url attribute, when these classes are created.

The sync method depends on calls to other Backbone methods as described in the table below.

| **Backbone Method** | **Sync CRUD Method** | **Equivalent HTTP Method** | **Equivalent SQL Method** |
| --- | --- | --- | --- |
| Collection.fetch | read | GET | SELECT |
| Collection.create (id == null) or Collection.create (id != null) | create or update | POST or PUT | INSERT or UPDATE |
| Model.fetch | read | GET | SELECT |
| Model.save (id == null) or Model.save (id != null) | create or update | POST or PUT | INSERT or UPDATE |
| Model.destroy | delete | DELETE | DELETE |

#### Ready-Made Sync Adapters

Alloy provides a few ready-made sync adapters. In the 'adapter' object, set the 'type' to use one of the following:

* `sql` for the SQLite database on the Android and iOS platform.
* `properties` for storing data locally in the Titanium SDK context.
* `localStorage` for HTML5 localStorage on the Mobile Web platform. Deprecated since Alloy 1.5.0. Use the `properties` adapter instead.

These adapters are part of Alloy and are copied to the `Resources/alloy/sync` folder during compilation. These sync adapters assign the `id` attribute of the models, which means if you assign an ID when creating a model, it is overridden by any sync operations.

##### SQLite Sync Adapter Features

The `sql` sync adapter has a few extra features:

**Fetch method accepts SQL Query**

The Backbone.Collection.fetch method supports SQL queries as a parameter. Use `query` as the key in the dictionary object to create a simple query or query with a prepared statement.

```javascript
var library = Alloy.createCollection('book');
var table = library.config.adapter.collection_name;
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

Define the `idAttribute` key-value pair in the `config.adapter` object to use a `config.columns` key as the primary ID for the SQLite table.

**Specify a migration to use**

Define the `migration` key-value pair in the `config.adapter` object to specify the database version to use. The value of this key is the datatime code of the migration file. Alloy upgrades or rolls back the database based on this value.

**Specify a database to use**

Define the `db_name` key-value pair in the `config.adapter` object to specify the name of the database to use. If left undefined, Alloy uses the default database `_alloy_`.

**Specify a database file to preload**

Define the `db_file` key-value pair in the `config.adapter` object to specify the database file ('myfile.sqlite') to preload. Place this file in the `app/assets` directory of your Alloy project.

### Migrations

A migration is a description of incremental changes to a database, which takes your database from version 1 to version X, with a migration file for each step in the evolution of your database schema.

In Alloy, migrations are defined by JavaScript files located in the `app/migrations` folder of the project. The file should be named the same as the model JavaScript file prefixed with 'YYYYMMDDHHmmss_' (datetime code followed by an underscore), for example, `20120610049877_book.js`. Alloy applies the migrations from oldest to newest, according to the datetime code at the beginning of the file name.

The migration file contains two functions that need to be implemented: `migration.up(migrator)` and `migration.down(migrator)`, where `migrator` is a special migration object that provides references to the database and table as well as some convenient functions for table operations:

| Key | Description |
| --- | --- |
| `db` | Handle to a `Ti.Database` instance. DO NOT CLOSE THIS HANDLE. |
| `dbname` | Name of the database. |
| `table` | Name of the table. Same as value of the `config.adapter.collection_name` key. |
| `idAttribute` | Name of the columns attribute to use as the primary key. |
| `createTable` | Function to create a table. Required parameter is the `columns` object. |
| `dropTable` | Function to drop the current table from the database. |
| `insertRow` | Function to insert data into the table. Useful for preloading data. |
| `deleteRow` | Function to delete data from the table. |

For example, the migration file below is the initial version of the database that preloads some data in the table.

**app/migrations/20120610049877_book.js**

```javascript
var preload_data = [
  {title: 'To Kill a Mockingbird', author:'Harper Lee'},
  {title: 'The Catcher in the Rye', author:'J. D. Salinger'},
  {title: 'Of Mice and Men', author:'John Steinbeck'},
  {title: 'Lord of the Flies', author:'William Golding'},
  {title: 'The Great Gatsby', author:'F. Scott Fitzgerald'},
  {title: 'Animal Farm', author:'George Orwell'}
];

migration.up = function(migrator) {
    migrator.createTable({
        "columns":
        {
            "book": "TEXT",
            "author": "TEXT"
        }
    });
    for (var i = 0; i < preload_data.length; i++) {
      migrator.insertRow(preload_data[i]);
    }
};

migration.down = function(migrator) {
    migrator.dropTable();
};
```

## Backbone Objects without Alloy

You can use plain Backbone Collection and Model objects in place of the Alloy versions. This does not require any special Alloy or Titanium code. Use the [Backbone API](http://docs.appcelerator.com/backbone/0.9.2/) to create and control Backbone objects instead of using the `createCollection` and `createModel` methods. Backbone models also do not require a model configuration file.

These Backbone objects cannot persist to external storage without implementing the Backbone.sync method, so if you make calls to Collection.fetch, Collection.create, Model.fetch, Model.save and Model.destroy, the application throws an error.

You can use Alloy's Model-View binding mechanism to keep the local Backbone Models and Collections in sync with an Alloy view-controller. Follow the same directions in the [Alloy Model-View Binding](#model-view-binding) section except instead of using the `Model` or `Collections` XML tag, you need to first initialize your model or collection in the alloy.js initializer file and add it to the `Alloy.Models` or `Alloy.Collections` namespace.

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

**Fetch Method Behavior Change**: Backbone Collection objects no longer emit the `reset` event after a `fetch()` call. To use old functionality, pass `{reset: true}` when calling `fetch()` or extend the Collection class.

**New Set Method**: To smartly update the contents of a Collection (adding new models, removing missing ones, and merging those already present), call `set()`.

**Return Value for Methods**: The return values of Collection's `add()`, `push()`, `remove()`, `reset()` and `shift()` methods return the changed model or list of models, instead of `this`.

**Add Method**: When invoking `add()` on a collection, passing `{merge: true}` will now cause duplicate models to have their attributes merged in to the existing models.

#### Event APIs

* All `invalid` events now pass consistent arguments. First the model in question, then the `error` object, then `options`.
* `Collection.sort()` now triggers a `sort` event, instead of a `reset` event.
* Both `sync` and `error` events within `Backbone.sync()` are now triggered regardless of the existence of success or error callbacks.
* While listening to a `reset` event, the list of previous models is now available in `options.previousModels`.
* The new Event methods `listenTo` and `stopListening` are meant for Backbone View objects. These APIs will not work with an Alloy application.

#### Model APIs

**Validation**: Model validation is now only enforced with the `save()` method. Previously, models were also validated with the `set()` method. To force validation when the `set()` method is called, pass `{validate: true}` to the method or extend the Model class.

**Other Changes**:

* Calling `destroy()` on a Model will now return `false` if the model's `isNew` is set to `true`.
* `Model.set()` no longer accepts another model as an argument.
* `url` and `urlRoot` properties may now be passed as options when instantiating a new Model.
* If you want to maintain current models in a collection when using `fetch` the property has changed from `{add:true}` to `{remove:false}`.

#### Silent Option

Passing `{silent:true}` to methods now suppresses the `change:attr` events, thus a data-bound view will not be updated to reflect the changes. The sql sync adapter passed this option by default. It has been updated to no longer pass that option when Backbone 1.1.2 is used (still passed with 0.9.2).

### API Changes

#### New APIs

The following APIs have been added between Backbone 1.1.2 and 0.9.2.

| API | Type | Notes |
| --- | --- | --- |
| Backbone.request | event | Fired whenever a request begins to be made to the server. |
| Backbone.Collection.findWhere | method | Same as `where()` but only returns the first result. |
| Backbone.Collection.set | method | Performs a "smart" update of the collection. |
| Backbone.Event.once | method | Same as `on()` except after the event is fired, the callback is removed. |
| Backbone.Model.invert | method | Returns a copy of the object where keys and values are switched. |
| Backbone.Model.keys | method | Returns an array of the object's keys. |
| Backbone.Model.omit | method | Returns a copy of an object without the specified keys. |
| Backbone.Model.pairs | method | Returns an array of `[key, value]` pairs. |
| Backbone.Model.pick | method | Returns a copy of an object with the specified keys. |
| Backbone.Model.values | method | Returns an array of the object's property values. |

#### Removed APIs

The following APIs have been removed between Backbone 1.1.2 and 0.9.2.

| API | Type | Notes |
| --- | --- | --- |
| Backbone.Collection.getByCid | method | Pass the CID to the `get()` method instead. |
| Backbone.Model.change | method |  |
