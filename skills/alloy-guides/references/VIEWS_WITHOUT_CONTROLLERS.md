# Views without Controllers

## Table of Contents

1. [Introduction](#introduction)
2. [XML Markup](#xml-markup)
3. [Controller Code](#controller-code)

## Introduction

Views can be created without controllers with an optional style sheet. These views can be used as building blocks to create a GUI. After you have defined your controller-less views, the application can either require in these views using markup or can dynamically generate these views in the controller code.

## XML Markup

In XML markup, use the `Require` tag to add controller-less views into another view. Assign the `src` attribute to the name of the view file minus the `.xml` extension and the `type` to `view`. Define the `id` attribute to access each instance of the controller-less view in the controller.

For instance, a button view could be reused repeatedly in a view-controller to construct a dialog box:

**app/views/foo.xml**

```xml
<Alloy>
    <Button id='fooButton'>I am a foo button!</Button>
</Alloy>
```

This view can be inserted into another view multiple times:

**app/views/index.xml**

```xml
<Alloy>
    <Window layout="vertical">
        <Require id="button1" src="foo" type="view"/>
        <Require id="button2" src="foo" type="view"/>
        <Require id="button3" src="foo" type="view"/>
    </Window>
</Alloy>
```

Then, the controller can use `$.button1`, `$.button2` and `$.button3` to access each instance of the foo view.

## Controller Code

**Starting with Alloy 1.4.0**, you can dynamically create views in the controller code. Each component in the controller-less view needs to be assigned an `id` attribute.

**To create a view without a corresponding controller:**

1. Use the `Alloy.createController()` method to create a controller from the controller-less view.
2. Use the `updateViews()` method with the created controller. Pass a style dictionary with the `id` of each component as the key and attributes as values.
3. Use the `getView()` method to retrieve the view.
4. Use the `add()` method to add the view to a parent component.

::: warning ⚠️ Warning
Unlike other style dictionaries in Alloy, when using the `updateViews()` method, you can only apply styles using IDs. Class and view component styles do not work with this method.
:::

For example:

**app/views/profile.xml**

```xml
<Alloy>
    <View id="container">
        <ImageView id="picture"/>
        <Label id="name"/>
    </View>
</Alloy>
```

**app/controllers/index.js**

```javascript
var profile = Alloy.createController('profile');
profile.updateViews({
  "#container" : {
        layout : "vertical"
  },
  "#picture" : {
        image : "/appicon.png"
  },
  "#name" : {
        text : "Mr. Man"
  }
});
$.index.add(profile.getView());

$.index.open();
```

**Prior to Alloy 1.4.0**, to dynamically generate a view:

1. Create a new instance of the controller using `Alloy.createController()`.
2. Modify the properties directly.
3. Use `getView()` to retrieve the view.
4. Use `add()` to add it to a parent.

**app/controllers/index.js** (Alloy < 1.4.0)

```javascript
var profile = Alloy.createController('profile');
profile.container.layout = 'vertical';
profile.picture.image = '/appicon.png';
profile.name.text = 'Mr. Man';
$.index.add(profile.getView());
$.index.open();
```
