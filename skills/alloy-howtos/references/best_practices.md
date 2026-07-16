# Alloy best practices and recommendations

Recommendations for writing Alloy apps. This supplements the Titanium SDK [Best Practices and Recommendations](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/) guide and focuses on coding style and conventions.

## Titanium-to-Alloy Guidance

### Loading Libraries in Alloy

If you need global functionality, require modules in all controllers or create a single global reference:

**alloy.js**
```javascript
// Alloy.Globals.refToYourModule will be available in all controllers
Alloy.Globals.refToYourModule = require('yourModule');
```

### Performance Best Practices

The same best practices from traditional Titanium development apply to Alloy. Alloy controllers can do what classic controllers can.

Use compiler directives to reduce runtime work (see Conditional Code in Alloy Controllers).

### Project Organization

Decide whether to adapt Alloy to your existing structure, or to adopt Alloy's structure. Alloy standardizes common Titanium patterns and makes projects easier to maintain.

## Coding Style Best Practices

### Naming Conventions

- **Do not use double underscore prefixes** on variables, properties, or function names (e.g., `__foo`). They are reserved for Alloy and may cause conflicts and unexpected behavior.
- **Do not use JavaScript reserved words as IDs.** See [Titanium SDK Reserved Words](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/Reserved_Words/) for the complete list.

### Global Variables

Avoid declaring globals in app.js and using them in other files. It still works, but it is not recommended and may be deprecated.

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

const loading = Alloy.createWidget("com.titaniumsdk.loading");
```

### Global Events

**Avoid `Ti.App.fireEvent` and `Ti.App.addEventListener`.** It crosses the native-JS bridge and can cause memory leaks and slower execution.

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
This is a simpler way to do cross-controller communication with Backbone events.
