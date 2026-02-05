# Coding best practices

Titanium apps are easiest to maintain when they use a single-context, modular pattern with clear structure and organized resources.

## 1. Scope management

- Avoid global scope. Global variables are not automatically garbage collected and can create naming conflicts.
- Always use `let` or `const`. The original guide uses `var`, but modern code should not. Omitting declarations places variables in global scope.

## 2. Memory leak prevention

- Listeners on `Ti.App`, `Ti.Geolocation`, and similar globals can leak memory if they reference local objects and are not removed.
```javascript
// Anti-pattern
Ti.App.addEventListener('data:sync', (e) => {
  localView.text = e.text // localView is now leaked
})
```
- Rule: global events should only handle global objects. Always `removeEventListener` during cleanup.

## 3. Event naming conventions

- Do not use spaces in event names. Spaces can cause issues with Backbone.js and other libraries that split event names on spaces.
```javascript
// Wrong - may fire multiple times
Ti.App.fireEvent('my event')

// Correct - use colon or underscore
Ti.App.fireEvent('my:event')
Ti.App.fireEvent('my_event')
```

## 4. Performance

- Defer script loading. Only `require` modules when you need them.

Lazy script loading example:
```javascript
// must be loaded at launch
const WindowOne = require('ui/WindowOne').WindowOne;
const win1 = new WindowOne();
win1.open();

win1.addEventListener('click', () => {
  // load window two JavaScript only when needed
  const WindowTwo = require('ui/WindowTwo').WindowTwo;
  const win2 = new WindowTwo();
  win2.open();

  win2.addEventListener('click', () => {
    // load window three JavaScript only when needed
    const WindowThree = require('ui/WindowThree').WindowThree;
    const win3 = new WindowThree();
    win3.open();
  });
});
```

- Bridge efficiency: minimize requests for device properties like `Ti.Platform.osname`. Store them in a local variable.
- Avoid extending the `Ti` namespace. `Ti` objects are proxies to native components. Properties set on them may not reach the native object, arrays return copies, and persistence across SDK versions is not guaranteed. Use modules instead.

## 5. App architecture recommendations

### Modular components with CommonJS (recommended)

Titanium's primary recommended architecture. It uses discrete modules and avoids globals. See `commonjs-advanced.md` for module patterns and path resolution.

MyModule.js:
```javascript
// Private variable
const defaultMessage = "Hello world";

exports.sayHello = (msg) => {
  Ti.API.info('Hello ' + msg);
};

exports.helloWorld = () => {
  Ti.API.info(defaultMessage);
}
```

app.js:
```javascript
const myModule = require('/MyModule');
myModule.sayHello('User');
```

### Custom objects as components

Popular for rapid deployment. It uses a namespace hierarchy. This pattern is less efficient than CommonJS modules, and object references can persist after they are no longer needed.

```javascript
const myapp = {};
(() => {
  myapp.ui = {};
  myapp.ui.createApplicationWindow = () => {
    const win = Ti.UI.createWindow({ backgroundColor:'white' });
    return win;
  };
})();
```

### Classical-based patterns

Not recommended. JavaScript is not class-based in the same way, and this approach adds overhead during rapid prototyping.

## 6. Security best practices

- Do not store sensitive data in non-JS files. JavaScript files are minified and obfuscated, but images, JSON, SQLite databases, and other non-JS files are packaged as-is. APK and IPA files are ZIP files that can be extracted.
```javascript
// Wrong - API keys visible in app/assets/config.json
const config = require('assets/config.json')

// Correct - store in code or use secure storage
const API_KEY = Ti.App.Properties.getString('api_key')
```

## 7. Multiplatform strategies

- Code branching: use for small differences.
- Platform files: use `.ios.js` or `.android.js` for major logic differences so code stays readable.
