# Style and Conventions Reference

## 1. Naming Conventions
- **Variables**: `nounCategory` (e.g., `personName`, `buttonSubmit`).
- **Functions**: `verbCategory` (e.g., `getPersonName`, `doSync`).
- **Classes/Constructors**: `PascalCase` (e.g., `User`, `NetClient`).
- **Factories**: Prefix with `create` (e.g., `createWidget`).
- **Namespaces**: Use capitalized words (e.g., `App.UI.Widget`, `App.Network.Request`). Avoid lowercase for major namespaces (e.g., use `App.UI` instead of `app.ui`).
- **Hungarian Notation**: Titanium SDK does not support the use of Hungarian Notation.

## 2. Language Rules
- **Semicolons**: Always use semicolons to terminate statements. This is mandatory in official SDK guides, but **omitted** in the `ti-expert` standard (let ASI handle it).
- **`this` keyword**: Use `this` with extreme care, as it sometimes doesn't refer to the object you expect.

## 3. Formatting
- **Indentation**: Both K&R/1TBS and Allman styles are acceptable. Consistency is most important — never mix styles in the same project.
```javascript
// K&R/1TBS Style
if (x < 10) {
  if (y > 10) {
    // do this
  }
} else {
  // do this
}
```
```javascript
// Allman Style
if (x < 10)
{
  if (y > 10)
  {
    // do this
  }
}
else
{
  // do this
}
```
- **Operators**: Add a single space around operators.
```javascript
const fullName = firstName + ' ' + lastName
```

**CRITICAL: Return Statement Placement**
Never put `return` on its own line followed by an object literal. JavaScript will insert a semicolon automatically, returning `undefined`.
```javascript
// ❌ WRONG
return
{
  foo: 'bar'
}

// ✅ CORRECT
return {
  foo: 'bar'
}
```

## 4. Control Statements
- Switch statements should have a single space before the opening parenthesis and a single space after the closing parenthesis. Switch content is indented with one tab; content in each case is indented one tab as well.
```javascript
switch (someTest) {
    case 1:
        break;

    case 2:
        break;

    default:
        break;
}
```

## 5. Primitive Types
- Avoid using primitive type object constructors (e.g., `new String()`).
- Use template literals or single space concatenation.

## 6. Comments and Documentation
- **Single-line comments**: Required to reduce programmer error. Inline statement comments should be used at a minimum or not at all.
- **JSDoc/Block comments**: Required for documenting functions and classes.
```javascript
// Calculate position using initial
// and offset x coordinates.
const finalPos = initPosX + offsetPosX;

/**
 * @param {String} customerName Customer's full name.
 */
function getCustomer(customerName) {}
```

## 7. References
- Douglas Crockford's JavaScript Code Conventions
- Google's JavaScript Style Guide (https://google.github.io/styleguide/jsguide.html)
