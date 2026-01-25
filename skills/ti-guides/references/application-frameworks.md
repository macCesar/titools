# Application Frameworks

Framework options and architectural patterns for Titanium applications.

## Table of Contents
1. [Alloy Framework](#alloy-framework)
2. [Classic Titanium](#classic-titanium)
3. [Choosing a Framework](#choosing-a-framework)
4. [Architecture Patterns](#architecture-patterns)

---

## Alloy Framework

**Alloy** is the official MVC framework for Titanium, developed by Appcelerator (now TiDev).

### What is Alloy?

Alloy provides:
- **MVC Architecture** - Separate models, views, and controllers
- **Built-in Libraries** - Backbone.js, Underscore.js
- **XML Views** - Declarative UI markup
- **TSS Styling** - CSS-like styling system
- **Data Binding** - Automatic view-to-model synchronization
- **Widgets** - Reusable UI components
- **Model/Collection Sync** - Built-in REST and SQL adapters

### Project Structure

```
app/
├── controllers/     # UI logic
├── models/          # Data models
├── views/           # XML view definitions
├── styles/          # TSS style sheets
├── assets/          # Images, fonts
├── lib/             # CommonJS libraries
├── themes/          # Theming support
├── config.json      # App configuration
└── alloy.js         # Entry point
```

### Sample Alloy Code

**View (XML):**
```xml
<Alloy>
    <Window class="container">
        <Label id="title" onClick="doClick">Click Me</Label>
    </Window>
</Alloy>
```

**Style (TSS):**
```css
".container": {
    backgroundColor: "#fff"
}

"#title": {
    color: "#000",
    font: { fontSize: 18 }
}
```

**Controller (JS):**
```javascript
function doClick(e) {
    alert('Clicked!');
}

$.index.open();
```

### Alloy Resources

- **Alloy Guides:** See the `alloy-guides` skill
- **Alloy CLI:** See `alloy-cli-advanced.md`
- **Alloy Data:** See `alloy-data-mastery.md`
- **Alloy Widgets:** See `alloy-widgets-and-themes.md`

### When to Use Alloy

✅ **Use Alloy for:**
- New projects (default choice)
- Teams wanting MVC structure
- Projects needing data binding
- Rapid development with XML views
- Reusable components (widgets)

❌ **Consider alternatives for:**
- Very simple apps (overkill)
- Teams preferring pure JavaScript
- Projects with unique architectural needs

---

## Classic Titanium

Classic Titanium refers to building apps without Alloy, using pure JavaScript and CommonJS modules.

### Project Structure

```
Resources/
├── app.js           # Entry point
├── ui/              # UI components
│   ├── ApplicationWindow.js
│   └── ...
├── models/          # Data models
├── lib/             # Utilities
└── assets/          # Images, etc.
```

### Sample Classic Code

**app.js:**
```javascript
// Single namespace pattern
var app = {};

// Include components
Ti.include('ui/ApplicationWindow.js');

// Create and open window
app.mainWindow = app.ui.createApplicationWindow();
app.mainWindow.open();
```

**ui/ApplicationWindow.js:**
```javascript
// Extend namespace
app.ui = app.ui || {};

app.ui.createApplicationWindow = function() {
    var win = Ti.UI.createWindow({
        backgroundColor: 'white',
        title: 'My App'
    });

    var label = Ti.UI.createLabel({
        text: 'Hello World',
        color: '#000'
    });

    win.add(label);
    return win;
};
```

### CommonJS Pattern (Recommended)

**myModule.js:**
```javascript
// Private variables
var privateData = 'secret';

// Public API
exports.createWindow = function() {
    return Ti.UI.createWindow({
        backgroundColor: 'white'
    });
};

exports.getData = function() {
    return privateData;
};
```

**app.js:**
```javascript
var myModule = require('myModule');
var win = myModule.createWindow();
win.open();
```

### When to Use Classic

✅ **Use Classic for:**
- Simple projects
- Developers who prefer pure JavaScript
- Migrating from older Titanium projects
- Fine-grained control over UI creation
- Learning the Titanium API directly

❌ **Consider Alloy for:**
- Large teams
- Complex apps with many screens
- Projects needing built-in MVC
- Data-heavy applications

---

## Choosing a Framework

### Comparison

| Feature | Alloy | Classic |
|----------|-------|---------|
| **Learning Curve** | Steeper (XML, TSS, MVC) | Easier (just JS) |
| **Boilerplate** | Less (declarative) | More (imperative) |
| **Structure** | Enforced (MVC) | Manual |
| **Data Binding** | Built-in | Manual |
| **Styling** | TSS (CSS-like) | Inline JS |
| **Team Size** | Better for large teams | Flexible |
| **Rapid Dev** | Faster (once learned) | Slower (more code) |

### Recommendation

**Start with Alloy** - It's the default for new projects and provides:
- Built-in best practices
- MVC structure from day one
- Less code to write
- Better team collaboration
- Official support and updates

**Switch to Classic** if:
- Alloy feels too complex for your needs
- You prefer pure JavaScript
- Your app is very simple

---

## Architecture Patterns

### Namespaced Pattern

Classic Titanium pattern with single global namespace:

```javascript
var app = {
    models: {},
    views: {},
    controllers: {},

    init: function() {
        // Initialize app
    },

    run: function() {
        // Run app
    }
};

app.init();
app.run();
```

### CommonJS Modules

Modern JavaScript pattern for Titanium:

**models/user.js:**
```javascript
exports.create = function(attrs) {
    return {
        name: attrs.name,
        email: attrs.email,
        save: function() {
            // Save to database
        }
    };
};
```

**controllers/user.js:**
```javascript
var User = require('models/user');

exports.register = function(data) {
    var user = User.create(data);
    user.save();
    return user;
};
```

### MVC with Alloy (Built-in)

Alloy enforces MVC:

```
app/
├── controllers/userController.js  # Logic
├── models/userModel.js            # Data
└── views/userView.xml             # Presentation
```

### Repository Pattern

Separate data access from business logic:

**repositories/userRepository.js:**
```javascript
exports.findById = function(id) {
    // Database call
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
};

exports.save = function(user) {
    // Insert/update
    return db.execute('INSERT INTO users ...');
};
```

**services/userService.js:**
```javascript
var repo = require('repositories/userRepository');

exports.register = function(data) {
    // Business logic
    if (!data.email) {
        throw new Error('Email required');
    }
    return repo.save(data);
};
```

---

## Framework Interoperability

### Mix Alloy and Classic

You can use Alloy and include Classic CommonJS modules:

```javascript
// In Alloy controller
var classicModule = require('lib/myClassicModule');
var data = classicModule.getData();
$.label.text = data;
```

### Migrate Classic to Alloy

1. Create new Alloy project
2. Move business logic to `controllers/` or `lib/`
3. Convert UI creation to `views/` (XML)
4. Create `styles/` (TSS) from inline styles
5. Update data access to use `models/`

---

## Best Practices

### For Alloy Projects

1. **Follow MVC strictly** - Keep models/models, views/views, controllers/logic
2. **Use data binding** - Avoid manual view updates
3. **Leverage widgets** - Reusable components
4. **Use themes** - For styling variations
5. **Keep controllers lean** - Move business logic to lib/

### For Classic Projects

1. **Use CommonJS modules** - Not `Ti.include()`
2. **Single namespace** - One global variable maximum
3. **Protect global scope** - Use IIFEs
4. **Separate concerns** - Models, views, controllers folders
5. **Document patterns** - Make architecture clear to team

### For Both

1. **Memory management** - Clean up listeners, null objects
2. **Error handling** - Try/catch around critical code
3. **Logging** - Use Ti.API for debugging
4. **Code style** - Follow `style-and-conventions.md`
5. **Testing** - Write unit tests for business logic

---

## Resources

- **Alloy Guides:** See the `alloy-guides` skill
- **CommonJS Advanced:** See `commonjs-advanced.md`
- **Coding Best Practices:** See `coding-best-practices.md`
- **JavaScript Primer:** See `javascript-primer.md`
- **Alloy CLI:** See `alloy-cli-advanced.md`
