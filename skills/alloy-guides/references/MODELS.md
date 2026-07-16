# Alloy Models

Models, collections, and how to bind them to views in Alloy. For sync adapters, migrations, plain Backbone usage, and the Backbone 0.9.2 → 1.1.2 / 1.3.3 migration, see [MODELS_ADVANCED.md](MODELS_ADVANCED.md).

1. [Overview](#overview)
2. [Alloy Collection and Model Objects](#alloy-collection-and-model-objects)
3. [Alloy Data Binding](#alloy-data-binding)

## Overview

Alloy uses Backbone.js to provide support for its models and collections. Alloy also borrows the concepts of migrations and adapters from Rails for storage integration.

For models, collections and sync adapters, these guides only provides information on how Alloy uses the Backbone.js functionality and some simple examples of using it.

## Alloy Collection and Model Objects

### Models

In Alloy, models inherit from the [Backbone.Model](https://backbonejs.org/#Model-View-separation) class. They contain the interactive data and logic used to control and access it. Models are specified with JavaScript files, which provide a table schema, adapter configuration and logic to extend the Backbone.Model class. Models are automatically defined and available in the controller scope as the name of the JavaScript file.

The JavaScript file exports a definition object comprised of three different objects. The first object, called `config`, defines the table schema and adapter information. The next two objects `extendModel` and `extendCollection` define functions to extend, override or implement the Backbone.Model and Backbone.Collection classes, respectively.

**Example of the anatomy of a model file**

```
exports.definition = {
    config : { // table schema and adapter information
    },
    extendModel(Model) {
        _.extend(Model.prototype, { // Extend, override or implement Backbone.Model
        });

        return Model;
    },
    extendCollection(Collection) {
        _.extend(Collection.prototype, { // Extend, override or implement Backbone.Collection
    });

        return Collection;
    }
}
```

To access a model locally in a controller, use the `Alloy.createModel` method. The first required parameter is the name of the JavaScript file minus the '.js' extension. The second optional parameter is the attributes for initializing the model object. For example:

**Basic model usage**

```javascript
const book = Alloy.createModel('book', {title:'Green Eggs and Ham', author:'Dr. Seuss'});
const title = book.get('title');
const author = book.get('author');

// Label object in the view with id = 'label'
$.label.text = title + ' by ' + author;
```

The `book` model object is a Backbone object wrapped by Alloy, so it can be treated as a Backbone.Model object. You can use any Backbone Model or Events APIs with this object.

You can also create a global singleton instance of a model, either in markup or in the controller, which may be accessed in all controllers. Use the `Alloy.Models.instance` method with the name of the model file minus the extension as the only parameter to create or access the singleton. For example:

**Working with globally registered models**

```javascript
// This will create a singleton if it has not been previously created,
// or retrieves the singleton if it already exists.
const book = Alloy.Models.instance('book');
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

    extendModel(Model) {
        _.extend(Model.prototype, {
            // Implement the validate method
            validate(attrs) {
                for (const key in attrs) {
                    const value = attrs[key];
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
            customFunction() {
                Ti.API.info('I am a book model.');
            },
        });

        return Model;
    }
}
```

In the controller, to access the model, do:

```javascript
const book = Alloy.createModel('book', {title:'Green Eggs and Ham', author:'Dr. Seuss'});
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
const library = Alloy.createCollection('book');
library.fetch(); // Grab data from persistent storage
```

The `library` collection object is a Backbone object wrapped by Alloy, so it can be treated as a Backbone.Collection object. You can use any Backbone Collection or Events APIs with this object.

You can also create a global singleton instance, either in markup or in the controller, which may be accessed in all controllers. Use the `Alloy.Collections.instance` method with the name of the model file minus the extension as the only parameter to create or access the singleton. For example:

**Working with globally registered collections**

```javascript
// This will create a singleton if it has not been previously created,
// or retrieves the singleton if it already exists.
const library = Alloy.Collections.instance('book');
```

#### Extending the Backbone.Collection Class

Like the Backbone.Model class, the Backbone.Collection class can be similarly extended in the model JavaScript file. For example, the `comparator` method is left unimplemented in Backbone.js. The code below sorts the library by book title:

**Extending a collection**

```
exports.definition = {
    config : { // table schema and adapter information
    },
    extendModel(Model) {
        _.extend(Model.prototype, { // Extend, override or implement Backbone.Model methods
        });
        return Model;
    },
    extendCollection(Collection) {
        _.extend(Collection.prototype, { // Implement the comparator method.
            comparator(book) {
                return book.get('title');
            }
        }); // end extend

        return Collection;
    }
}
```

#### Underscore.js Functionality

Also, the Backbone.Collection class inherits some functionality from [Underscore.js](https://underscorejs.org/), which can help simplify iterative functions. For example, to add the title of each book object in the library collection to a table, you could use the `map` function to set the table:

**Iterating over a collection with underscore**

```javascript
const data = library.map(book => {
    // The book argument is an individual model object in the collection
    const title = book.get('title');
    const row = Ti.UI.createTableViewRow({"title":title});
    return row;
});
// TableView object in the view with id = 'table'
$.table.setData(data);
```

### Event Handling

When working with Alloy Models and Collections, use the Backbone.Events `on`, `off` and `trigger` methods. For example:

**Using events with collections**

```javascript
const library = Alloy.createCollection('book');
function event_callback (context) {
    const output = context || 'change is bad.';
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

To enable collection-view binding, create a global singleton or controller-specific collection using the [Collection tag](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_Guide/Alloy_Views/Alloy_XML_Markup.html#collection-element) in the XML markup of the main view, then add the view object you want to bind data to. The following Titanium view objects support binding to a Collection:

| View Object    | Since Alloy version | Add data binding attributes to...              | Repeater Object to map model attributes to view properties                     |
| -------------- | ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| ButtonBar      | 1.1                 | `<Labels>`                                     | `<Label/>`                                                                     |
| CoverFlowView  | 1.1                 | `<Images>`                                     | `<Image/>`                                                                     |
| ListView       | 1.2                 | `<ListSection>`                                | `<ListItem/>`                                                                  |
| Map Module     | 1.4                 | `<Module module="ti.map" method="createView">` | None, model attributes will be used as params for createAnnotation() directly. |
| Picker         | 1.5                 | `<PickerColumn>` or `<Column>`                 | `<PickerRow/>` or `<Row/>`                                                     |
| ScrollableView | 1.1                 | `<ScrollableView>`                             | `<View/>` May contain children view objects.                                   |
| TableView      | 1.0                 | `<TableView>`                                  | `<TableViewRow/>` May contain children view objects.                           |
| TabbedBar      | 1.1                 | `<Labels>`                                     | `<Label/>`                                                                     |
| Toolbar        | 1.1                 | `<Items>`                                      | `<Item/>`                                                                      |
| View           | 1.0                 | `<View>`                                       | Any view object except a top-level container like a Window or TabGroup         |

You need to specify additional attributes in the markup, which are only specific to collection data binding. The only mandatory attribute is `dataCollection`, which specifies the collection singleton or instance to render. Note that you can only add these attributes to specific XML elements (refer to the table above).

* `dataCollection`: specifies the collection singleton or instance to bind to the table. This is the name of the model file for singletons or the ID prefixed with the controller symbol ('$') for instances.

* `dataTransform`: specifies an optional callback to use to format model attributes. The passed argument is a model and the return value is a modified model as a JSON object.

* `dataFilter`: specifies an optional callback to use to filter data in the collection. The passed argument is a collection and the return value is an array of models.

* `dataFunction`: set to an arbitrary identifier (name) for a function call. Use this identifier to call a function in the controller to manually update the view. This is not a declared function in the controller. This attribute creates an alias to access the underlying binding function, which is part of the Alloy data-view binding framework.

Next, create a repeater object (refer to the table above) and place it inline with the view object with the `dataCollection` attribute, or place it in a separate view and use the `Require` tag to import it.

To map model attributes, enclose the attribute with curly brackets or braces ('{' and '}'). You can map more than one attribute to a repeater object's property. For example, to assign the Label.text property to the model's title and author attributes, use this notation: `<Label text="{title} by {author}" />.` For more complex transformations, use the `dataTransform` callback to create a custom attribute.

In the controller code of the repeater object, you can use the special variable `$model` to reference the current model being iterated over. This variable is present only in data bound controllers and is a reference to the currently bound model. For example, to get the title attribute of the current model, use `$model.title` to access it.

> **⚠️ ⚠️ Warning**
> **IMPORTANT:** When using Alloy's data binding in a view-controller, you **MUST** call the `$.destroy()` function when closing a controller to prevent potential memory leaks. The `destroy` function unbinds the callbacks created by Alloy when the collection-view syntax is used. For example:
>
> ```javascript
> $.win.addEventListener("close", () => {
>     $.destroy();
> });
> ```
>
> For global singletons, to properly release them you should also remove event handlers with `off()` and set the reference to null:
>
> ```javascript
> $.win.addEventListener("close", () => {
>     $.destroy();
>     Alloy.Collections.book.off();
>     Alloy.Collections.book = null;
> });
> ```

#### Collection-View Binding Example

The following example demonstrates how to add basic collection-view binding to an application. The example binds a collection of album models to a ScrollableView. In the ScrollableView, each model has its own view, which displays the album cover, title of the album and the artist. The `artist` and `title` attributes are bound to a Label object and the `cover` attribute is bound to an ImageView object.

1. Add the `<Collection>` tag as a child of the `<Alloy>` tag.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album" />
    </Alloy>
    ```

2. Next, add the view object(s) you want to bind the data to. In this example, data will be bound to a ScrollableView object.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album" />
        <Window backgroundColor="white" onClose="cleanup">
            <ScrollableView></ScrollableView>
        </Window>
    </Alloy>
    ```

3. Add the `dataCollection` attribute to the appropriate view object. Assign this attribute to the collection you want to use. For a ScrollableView object, add the attribute to the `<ScrollableView>` tag. The element to add the attribute to depends on which view object you want to bind data to.

    **app/views/index.xml**

    ```xml
    <Alloy>
        <Collection src="album" />
        <Window backgroundColor="white" onClose="cleanup">
            <ScrollableView dataCollection="album"></ScrollableView>
        </Window>
    </Alloy>
    ```

4. Next, create your repeater object and add model attributes. Enclose the model attributes with curly brackets or braces ('{' and '}'). For a ScrollableView, the repeater object can be a View object with additional children objects. The repeater object depends on which view object you are using.

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

5. In the controller, call the Collection's `fetch()` method to initialize the collection and sync any stored models to the view. Remember to call the `$.destroy()` method when you close the controller to prevent memory leaks.

    **app/controllers/index.js**

    ```javascript
    $.index.open();
    Alloy.Collections.album.fetch();

    function cleanup() {
        $.destroy();
    }
    ```

The application is now setup for basic collection-view binding. When any new data is added to the collection, the ScrollableView will be updated with the new data.

#### Model-View Binding

To bind a single model to a component, create a global singleton or controller-specific model using the [Model tag](https://titaniumsdk.com/guide/Alloy_Framework/Alloy_Guide/Alloy_Views/Alloy_XML_Markup.html#model-element) in the XML markup of the main view and map the model attribute to the view component. To map the attribute to the view component, prefix the model name or id to the attribute, then enclose it with curly brackets or braces ('{' and '}').

To do complex transformations on the model attributes, extend the model prototype with a `transform()` function. It should return the modified model as a JSON object.

**app/models/album.js**

```javascript
exports.definition = {
  config: {}, // model definition
  extendModel(Model) {
    _.extend(Model.prototype, {
      transform() {
        const transformed = this.toJSON();
        transformed.artist = transformed.artist.toUpperCase();
        return transformed;
      }
    });
    return Model;
  }
};
```

A global singleton instance is a single instance of a particular model that is available for use anywhere in your application. When using global instances, they will be in memory for the duration of your application unless you manually release them. The process of manually releasing them should include:

* If any controllers are using data binding that relies on the global instance, they should call their own destroy() function: `$.destroy()`
* Any other event handlers added to the global instance should be removed with the [off()](http://backbonejs.org/#Events-off) function
* Set the reference of the model to null: `Alloy.Models.nameOfModel = null;`

Note that you need to call the `$.destroy()` function when closing the controller to prevent potential memory leaks. The `destroy` function unbinds the callbacks created by Alloy when the model-view syntax is used.

#### Model-View Binding Example

The example below demonstrates how to bind a model to view components in the XML markup. Notice that each attribute is prefixed with the model's name and enclosed with braces.

```xml
<Alloy>
    <Model src="settings"/>
    <Window backgroundColor="white" onClose="cleanup">
        <View layout="vertical">
            <Label text="Text Size" />
            <Slider value="{settings.textsize}" max="5" min="1"/>
            <Label text="Bold"/>
            <Switch value="{settings.bold}" />
            <Label text="Italics"/>
            <Switch value="{settings.italics}" />
        </View>
    </Window>
</Alloy>
```

#### Collection Example

The example below demonstrates how to display all book models in the collection by the author Mark Twain. It also demonstrates how to use each of the data binding attributes.

**app/views/index.xml**

```xml
<Alloy>
    <Collection src="book" />
    <Window class="container">
        <TableView dataCollection="book"
                   dataTransform="transformFunction"
                   dataFilter="filterFunction"
                   dataFunction="updateUI"
                   onDragEnd="refreshTable">
            <!-- Also can use Require -->
            <TableViewRow title="{title}" />
        </TableView>
    </Window>
</Alloy>
```

**app/controllers/index.js**

```javascript
$.index.open();

// Encase the title attribute in square brackets
function transformFunction(model) {
    // Need to convert the model to a JSON object
    const transform = model.toJSON();
    transform.title = '[' + transform.title + ']';
    // Example of creating a custom attribute, reference in the view using {custom}
    transform.custom = transform.title + " by " + transform.author;
    return transform;
}

// Show only book models by Mark Twain
function filterFunction(collection) {
    return collection.where({author:'Mark Twain'});
}

function refreshTable(){
    // Trigger the binding function identified by the dataFunction attribute
    updateUI();
}

// Trigger the synchronization
const library = Alloy.Collections.book;
library.fetch();

// Free model-view data binding resources when this view-controller closes
$.index.addEventListener('close', () => {
    $.destroy();
});
```

As the collection is updated, the view reflects the changes made to the models. If you want to suppress an update, specify `{silent: true}` in the `options` parameters when calling Backbone methods to change model data.

### Collection vs Model Data Binding

You can bind both a collection of models or an individual model. To bind a model attribute the opening curly bracket is first followed by the model name and then the attribute. To bind a collection you add the `dataCollection` attribute to the container using the collection name as value. The generated code will then loop over the collection and add the child elements to the container for each model.

```xml
<Alloy>
    <Model src="currentCategory" />
    <Collection src="book" />
    <Window>
        <!-- model data binding -->
        <Label text="{currentCategory.name}" />

        <!-- collection data binding -->
        <ScrollView dataCollection="book">
            <Label text="{title}" />
        </ScrollView>
    </Window>
</Alloy>
```

### Global Singleton vs Local Instance

In the above code snippet, the model and collection are global singletons under `Alloy.Models.currentCategory` and `Alloy.Collections.book`. You can also use local instances for the current controller by adding `instance="true"` as attribute. You also need to assign them an ID to reference them in the XML and controller.

```xml
<Alloy>
    <Model src="currentCategory" instance="true" id="c" />
    <Collection src="book" instance="true" id="b" />
    <Window>
        <!-- model data binding -->
        <Label text="{$.c.name}" />

        <!-- collection data binding -->
        <ScrollView dataCollection="$.b">
            <Label text="{title}" />
        </ScrollView>
    </Window>
</Alloy>
```

### Simple vs Complex Data Binding

It's important to understand the difference between simple and complex data binding as they were implemented in unique ways which results in different behaviour.

Simple data binding involves one model attribute where complex data binding involves a combination of strings (including white space) and model attributes or even multiple model attributes:

```xml
<Alloy>
    <Model src="book">
    <Window>
        <!-- simple -->
        <Label text="{book.title}" />

        <!-- complex -->
        <Label text="Title: {book.title}" />
        <Label text="{book.author.name} {book.author.email}" />
    </Window>
</Alloy>
```

### Backbone Binding

The application can monitor Backbone events to trigger updates to the view.

For instance, the code below demonstrates how to update a table when a model object is added to a collection by monitoring the add event:

```javascript
library.on('add', e => {
    // custom function to update the content on the view
    updateFooView(library);
});
```

Another method is to selectively monitor changes. For instance, the code below demonstrates how to update data if a title changes in the collection:

```javascript
library.on('change:title', e => {
    // custom function to update the content on the view
    updateFooView(library);
});
```

> **⚠️ ⚠️ Warning**
> This only works if the Backbone method fires the change event and does not enable `{silent: true}` as an option.

If you want to suppress an update, specify `{silent: true}` in the `options` parameters when calling Backbone methods to change model data. The data-bound view will not be updated to reflect the changes.

### Bind Deep Object Properties

You can bind deep object properties:

```xml
<Alloy>
    <Model src="book" />
    <Label text="{book.author.name}" />
</Alloy>
```

Before, you needed to use a transformer to create a reference like `authorName`.

Before CLI 7.1.0, the only way to set object properties (e.g. `font.fontFamily` for a Label) was to use TSS. You can use dot notation in XML:

```xml
<Alloy>
    <Model src="book" />
    <Label font.fontFamily="Roboto">Hello</Label>
</Alloy>
```

### Use Models and Properties with Special Characters

You can bind models and properties that use names with special characters like dashes and spaces. Simply wrap the names in square brackets and quotes like you'd do in JavaScript:

```xml
<Alloy>
    <Model src="my-model">
    <Label text="['my-model']['my-property']" />
</Alloy>
```

### Bind Multiple Models to the Same View

You have the ability to bind multiple models to the same view:

```xml
<Alloy>
    <Model src="a" />
    <Model src="b" />
    <Label text="{a.hello} {b.world}" />
</Alloy>
```

### Define Transformations in the Model

Since Alloy 1.8.1, all types of data binding will generate the following logic to determine what object will be bound to the view:

```javascript
let t;
if (_.isFunction(<dataTransform>)) { // only for collection binding
    t = <dataTransform>(model);
} else if (_.isFunction(model.transform)) {
    t = model.transform();
} else {
    t = model.toJSON();
}
$.myLabel.text = t.author.name;
```

You'd extend a model with a `transform()` method as such:

```javascript
exports.definition = {
    // config
    extendModel(Model) {
        _.extend(Model.prototype, {
            transform() {
                const t = this.toJSON();
                t.titleCaps = t.title.toUpperCase();
                return t;
            }
        });
        return Model;
    }
};
```

> **⚠️ ⚠️ Warning**
> The `transform` method must return **all** bound properties, not just the transformed ones. Until Alloy 1.8.1, simple collection data binding did not require this and automatically fell back to the model attributes.

### Tips and Tricks

#### Lazy Transformation

The advantage of defining transformations in the model is that you don't need to repeat them in every controller. A possible disadvantage is that everywhere you bind the model all transformations are computed where you might only need some.

You can handle this using `Object.defineProperty()`. Its `get` callback will only be called when the transform key is actually requested:

```javascript
const moment = require('alloy/moment');

exports.definition = {
    extendModel(Model) {
        _.extend(Model.prototype, {
            transform() {
                const model = this;
                const t = this.toJSON();

                Object.defineProperty(t, 'dateFormatted', {
                  get() {
                    return moment(t.date).format('LLLL');
                  }
                });

                return t;
            }
        });
        return Model;
    }
};
```

#### Populating a Model After Data Binding

When Alloy compiles your views and controllers, the generated view code precedes your controller code. Any models you define for data binding in the XML will also be created at that point. Just like you call `fetch()` to populate the collection, you do the exact same thing for the model.

**index.xml**

```xml
<Alloy>
    <Model src="book" instance="true" id="current" />
    <Window>
        <Label text="{book.title}" />
    </Window>
</Alloy>
```

**index.js**

```javascript
$.current.fetch({
    id: Ti.App.Properties.getString('currentBook')
});

$.index.open();
```

> **⚠️ ⚠️ Warning**
> With the release of CLI 7.1.0, values passed in at creation of a view can be used as values in TSS and XML. For example, if the **foo** property was passed in at creation it can be used on a label:
>
> ```xml
> <Alloy>
>     <Label text="$.args.foo" />
> </Alloy>
> ```

---

For sync adapters, custom adapters, migrations, plain Backbone usage, and the Backbone version migration (0.9.2 → 1.1.2 / 1.3.3), continue with [MODELS_ADVANCED.md](MODELS_ADVANCED.md).
