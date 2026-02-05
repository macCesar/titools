# Application frameworks

Framework options and architecture patterns for Titanium applications.

## Alloy framework

Alloy is the official MVC framework for Titanium. It was developed by Appcelerator and is now maintained by TiDev.

### What Alloy provides

- MVC structure with models, views, and controllers
- Built-in libraries (Backbone.js, Underscore.js)
- XML views for declarative UI
- TSS for CSS-like styling
- Data binding between views and models
- Widgets for reusable UI components
- Model and collection sync with REST and SQL adapters

### Project structure

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

### Sample Alloy code

View (XML):
```xml
<Alloy>
    <Window class="container">
        <Label id="title" onClick="doClick">Click Me</Label>
    </Window>
</Alloy>
```

Style (TSS):
```css
".container": {
    backgroundColor: "#fff"
}

"#title": {
    color: "#000",
    font: { fontSize: 18 }
}
```

Controller (JS):
```javascript
const doClick = (e) => {
    alert('Clicked!');
};

$.index.open();
```

### Alloy resources

- Alloy guides: see the `alloy-guides` skill
- Alloy CLI: see `alloy-cli-advanced.md`
- Alloy data: see `alloy-data-mastery.md`
- Alloy widgets: see `alloy-widgets-and-themes.md`

### Angular integration

Angular integration with Titanium SDK was under development but is no longer maintained.

### React community framework

A community React integration exists at https://github.com/nicolomonili/react-titanium (experimental).

### When to use Alloy

Use Alloy for:
- New projects (default choice)
- Teams that want MVC structure
- Projects that need data binding
- Rapid development with XML views
- Reusable components (widgets)

Consider alternatives for:
- Very simple apps
- Teams that prefer pure JavaScript
- Projects with unique architectural needs

---

## Classic Titanium

Classic Titanium means building apps without Alloy, using JavaScript and CommonJS modules.

### Project structure

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

### Sample Classic code

app.js:
```javascript
// Single namespace pattern
const app = {};

// Include components (Legacy)
Ti.include('ui/ApplicationWindow.js');

// Create and open window
app.mainWindow = app.ui.createApplicationWindow();
app.mainWindow.open();
```

ui/ApplicationWindow.js:
```javascript
// Extend namespace
app.ui = app.ui || {};

app.ui.createApplicationWindow = () => {
    const win = Ti.UI.createWindow({
        backgroundColor: 'white',
        title: 'My App'
    });

    const label = Ti.UI.createLabel({
        text: 'Hello World',
        color: '#000'
    });

    win.add(label);
    return win;
};
```

### CommonJS pattern (recommended)

myModule.js:
```javascript
// Private variables
const privateData = 'secret';

// Public API
exports.createWindow = () => {
    return Ti.UI.createWindow({
        backgroundColor: 'white'
    });
};

exports.getData = () => {
    return privateData;
};
```

app.js:
```javascript
const myModule = require('myModule');
const win = myModule.createWindow();
win.open();
```

### When to use Classic

Use Classic for:
- Simple projects
- Developers who prefer pure JavaScript
- Migrating from older Titanium projects
- Fine-grained control over UI creation
- Learning the Titanium API directly

Consider Alloy for:
- Large teams
- Complex apps with many screens
- Projects that need built-in MVC
- Data-heavy applications

---

## Choosing a framework

### Comparison

| Feature           | Alloy                   | Classic            |
| ----------------- | ----------------------- | ------------------ |
| Learning curve    | Steeper (XML, TSS, MVC) | Easier (just JS)   |
| Boilerplate       | Less (declarative)      | More (imperative)  |
| Structure         | Enforced (MVC)          | Manual             |
| Data binding      | Built-in                | Manual             |
| Styling           | TSS (CSS-like)          | Inline JS          |
| Team size         | Better for large teams  | Flexible           |
| Rapid development | Faster once learned     | Slower (more code) |

### Recommendation

Start with Alloy if you are building a new app or expect multiple contributors. If Alloy feels like overhead or the app is very small, Classic is fine.

---

## Architecture patterns

### Namespaced pattern

Classic Titanium pattern with a single global namespace:

```javascript
const app = {
    models: {},
    views: {},
    controllers: {},

    init() {
        // Initialize app
    },

    run() {
        // Run app
    }
};

app.init();
app.run();
```

### CommonJS modules

Modern JavaScript pattern for Titanium:

models/user.js:
```javascript
exports.create = (attrs) => {
    return {
        name: attrs.name,
        email: attrs.email,
        save() {
            // Save to database
        }
    };
};
```

controllers/user.js:
```javascript
const User = require('models/user');

exports.register = (data) => {
    const user = User.create(data);
    user.save();
    return user;
};
```

### MVC with Alloy (built-in)

Alloy enforces MVC:

```
app/
├── controllers/userController.js  # Logic
├── models/userModel.js            # Data
└── views/userView.xml             # Presentation
```

### Repository pattern

Separate data access from business logic:

repositories/userRepository.js:
```javascript
exports.findById = (id) => {
    // Database call
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
};

exports.save = (user) => {
    // Insert/update
    return db.execute('INSERT INTO users ...');
};
```

services/userService.js:
```javascript
const repo = require('repositories/userRepository');

exports.register = (data) => {
    // Business logic
    if (!data.email) {
        throw new Error('Email required');
    }
    return repo.save(data);
};
```

---

## Framework interoperability

### Mix Alloy and Classic

You can use Alloy and include Classic CommonJS modules:

```javascript
// In Alloy controller
var classicModule = require('lib/myClassicModule');
var data = classicModule.getData();
$.label.text = data;
```

### Migrate Classic to Alloy

1. Create a new Alloy project.
2. Move business logic to `controllers/` or `lib/`.
3. Convert UI creation to `views/` (XML).
4. Create `styles/` (TSS) from inline styles.
5. Update data access to use `models/`.

---

## Best practices

### For Alloy projects

1. Follow MVC strictly. Keep models in `models/`, views in `views/`, and controller logic in `controllers/`.
2. Use data binding and avoid manual view updates.
3. Use widgets for reusable UI.
4. Use themes for styling variants.
5. Keep controllers lean and move business logic to `lib/`.

### For Classic projects

1. Use CommonJS modules instead of `Ti.include()`.
2. Keep a single global namespace.
3. Protect global scope with IIFEs.
4. Separate concerns with `models/`, `views/`, and `controllers/` folders.
5. Document patterns so the team shares the same structure.

### For both

1. Clean up listeners and null heavy objects.
2. Add try/catch around critical code paths.
3. Use `Ti.API` for logging.
4. Follow `style-and-conventions.md` for code style.
5. Write unit tests for business logic.

---

## Resources

- Alloy guides: see the `alloy-guides` skill
- CommonJS advanced: see `commonjs-advanced.md`
- Coding best practices: see `coding-best-practices.md`
- JavaScript primer: see `javascript-primer.md`
- Alloy CLI: see `alloy-cli-advanced.md`
