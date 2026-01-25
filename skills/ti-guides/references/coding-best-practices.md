# Coding Best Practices

## 1. Scope Management
- **Avoid Global Scope**: Global variables are not automatically garbage collected and can cause naming conflicts.
- **Always use `let` or `const`**: (Original guide says `var`, but modernization rules apply). Omitting declarations places variables in the global scope.

## 2. Memory Leak Prevention
- **Global Event Listeners**: Listeners on `Ti.App`, `Ti.Geolocation`, etc., will leak memory if they reference locally scoped objects unless explicitly removed.
```javascript
// ANTI-PATTERN
Ti.App.addEventListener('data:sync', (e) => {
  localView.text = e.text // localView is now leaked
})
```
- **Rule**: Global events should only handle global objects. Always `removeEventListener` during cleanup.

## 3. Event Naming Conventions
- **No Spaces in Event Names**: Using spaces in custom event names causes issues with Backbone.js and other libraries that use spaces as delimiters.
```javascript
// ❌ WRONG - may fire multiple times
Ti.App.fireEvent('my event')

// ✅ CORRECT - use colon or underscore
Ti.App.fireEvent('my:event')
Ti.App.fireEvent('my_event')
```

## 4. Performance
- **Defer Script Loading**: Evaluate JavaScript only when needed. Don't `require` modules at startup if they are only for specific screens.
- **Bridge Efficiency**: Minimize requests for device properties like `Ti.Platform.osname`. Store them in a local variable once.
- **Avoid Extending Ti Namespace**: Never add properties to `Ti.*` as it's a proxy system and leads to instability.

## 5. Security Best Practices
- **No Sensitive Data in Non-JS Files**: JavaScript files are minified and obfuscated during build, but images, JSON files, SQLite databases, and other non-.js files are packaged as-is. APK and IPA files are essentially ZIP files that can be extracted.
```javascript
// ❌ WRONG - API keys visible in app/assets/config.json
const config = require('assets/config.json')

// ✅ CORRECT - Store in code or use secure storage
const API_KEY = Ti.App.Properties.getString('api_key')
```

## 6. Multiplatform Strategies
- **Code Branching**: Use for small differences.
- **Platform Files**: Use `.ios.js` or `.android.js` for major logic differences to keep code readable.
