# Alloy Best Practices and Recommendations

This guide provides recommendations for writing Alloy applications. This guide supplements the existing Titanium SDK [Best Practices and Recommendations](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/) guide, specifically focusing on Coding Best Practices and Style and Conventions.

## Table of Contents

- [Alloy Best Practices and Recommendations](#alloy-best-practices-and-recommendations)
  - [Table of Contents](#table-of-contents)
  - [Titanium-to-Alloy Guidance](#titanium-to-alloy-guidance)
    - [Loading Libraries in Alloy](#loading-libraries-in-alloy)
    - [Performance Best Practices](#performance-best-practices)
    - [Project Organization](#project-organization)
  - [Coding Style Best Practices](#coding-style-best-practices)
    - [Naming Conventions](#naming-conventions)
    - [Global Variables](#global-variables)
    - [Global Events](#global-events)
      - [Use Callbacks for Master-Child Communication](#use-callbacks-for-master-child-communication)
      - [Use Backbone.Events for App-Wide Communication](#use-backboneevents-for-app-wide-communication)

---

## Titanium-to-Alloy Guidance

### Loading Libraries in Alloy

If you have pre-existing functionality to make available globally, you can require modules in all controllers or create a single global reference:

**alloy.js**
```javascript
// Alloy.Globals.refToYourModule will be available in all controllers
Alloy.Globals.refToYourModule = require('yourModule');
```

### Performance Best Practices

The same best practices from traditional Titanium development apply to Alloy. Everything you can do in traditional Titanium development can be done in Alloy's controllers.

Use compiler directives to speed up runtime performance (see Conditional Code in Alloy Controllers).

### Project Organization

Determine if it makes sense to bend Alloy around your existing organization, or bend your existing organization around Alloy. Alloy was created to standardize Titanium coding methodologies, making projects cleaner and more maintainable.

## Coding Style Best Practices

### Naming Conventions

- **Do not use double underscore prefixes** on variables, properties, or function names (e.g., `__foo`). They are reserved for Alloy and may cause conflicts and unexpected behavior.
- **Do not use JavaScript reserved words as IDs.** See [Titanium SDK Reserved Words](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/Reserved_Words/) for the complete list.

### Global Variables

Do not declare global variables in app.js and use them in other files. This is allowed but not recommended and will be deprecated.

Instead, declare these in your JS files:

```javascript
const Alloy = require('alloy');
const Backbone = require('alloy/backbone');
const _ = require('alloy/underscore')._;
```

Safe pattern for non-controller files:

```javascript
if (typeof Alloy === 'undefined') {
    var Alloy = require('alloy');
}
if (typeof Backbone === 'undefined') {
    var Backbone = require('alloy/backbone');
}
if (typeof _ === 'undefined') {
    var _ = require('alloy/underscore')._;
}

const loading = Alloy.createWidget("com.appcelerator.loading");
```

### Global Events

**Avoid `Ti.App.fireEvent` and `Ti.App.addEventListener`** - This crosses the bridge between native and JavaScript lands, which can cause memory leaks and slower processes.

#### Use Callbacks for Master-Child Communication

**master.js**
```javascript
function openChild() {
    Alloy.createController('child', {callback: refreshData});
}

function refreshData(value) {
    // Refresh master data here
}
```

**child.js**
```javascript
const args = arguments[0] || {};

function refreshParent() {
    // Pass return value to parent
    args.callback(true);
}
```

#### Use Backbone.Events for App-Wide Communication

**alloy.js**
```javascript
Alloy.Events = _.clone(Backbone.Events);
```

**controller_a.js** (listener)
```javascript
Alloy.Events.on('updateMainUI', refreshData);

function refreshData(value) {
    // Do work here
    // Optionally disable one-time events
    // Alloy.Events.off('updateMainUI');
}

// Clean up when closing to avoid memory leaks
$.controller_a.addEventListener('close', () => {
    Alloy.Events.off('updateMainUI');
});
```

**controller_b.js** (trigger)
```javascript
Alloy.Events.trigger('updateMainUI');
```

**Note:** Alloy controllers are Backbone event dispatchers. You can also use:
```javascript
Alloy.createController('child').on('refresh', refreshData);
```
This is a cleaner approach to cross-controller communication using Backbone's built-in event capabilities.
