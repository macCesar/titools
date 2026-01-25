# PurgeTSS Implementation Examples (Alloy + PurgeTSS)

## API Client Service
Standard logic for network requests.

```javascript
// lib/api/client.js
export const get = (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    const client = Ti.Network.createHTTPClient({
      onload: () => resolve(JSON.parse(client.responseText)),
      onerror: (e) => reject(e),
      timeout: 5000
    })
    client.open('GET', endpoint)
    client.send()
  })
}
```

## Native Module Wrapper Service
Encapsulate native modules (e.g., audio, maps, facebook) to decouple from controllers.

```javascript
// lib/services/nativeService.js
const someModule = require('ti.someModule')

export function performAction(data) {
  someModule.doSomething({
    data,
    status: L('processing')
  })
}
```

## i18n Helper
Logic for complex string transformations and plurals.

```javascript
// lib/helpers/i18n.js
export function getPluralMessages(count) {
  const key = count === 1 ? 'one_message' : 'many_messages'
  return L(key).replace('%d', count)
}
```

## Model with SQL Adapter
Definition for local SQLite persistence.

```javascript
// models/User.js
exports.definition = {
  config: {
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT',
      email: 'TEXT'
    },
    adapter: {
      type: 'sql',
      collection_name: 'users'
    }
  }
}
```

## Fully Styled & Accessible View (PurgeTSS)
Applying PurgeTSS classes while maintaining accessibility.

```xml
<!-- views/login.xml -->
<Alloy>
  <Window class="bg-gray-50 vertical">
    <Animation id="myAnim" module="purgetss.ui" class="fade-in duration-500" />

    <!-- Spacer to center content -->
    <View class="h-auto" />

    <Label class="text-4xl text-primary mb-10 mx-6 fa-solid fa-lock"
      accessibilityLabel="L('login_icon_label')"
    />

    <TextField id="email"
      class="w-screen h-12 mx-6 bg-white border-(1) border-gray-300 rounded-lg"
      hintText="L('email_hint')"
      accessibilityLabel="L('email_label')"
    />

    <Button id="submit"
      class="mt-10 mx-6 w-screen h-14 bg-primary rounded-xl text-white font-bold"
      title="L('login_button')"
      accessibilityLabel="L('login_button')"
      accessibilityHint="L('login_hint')"
      onClick="doLogin"
    />

    <!-- Spacer to center content -->
    <View class="h-auto" />
  </Window>
</Alloy>
```

**Notes:**
- Use `vertical` layout on Window (not `flex-col`)
- Use `mx-6` for horizontal padding (not `p-6` on parent)
- Use `w-screen` for full width (not `w-full`)
- Use `border-(1)` with parentheses for arbitrary border width

## Cleanup Pattern in Controller
Critical for memory management and avoiding leaks.

```javascript
// controllers/login.js
const onNotification = (e) => {
  Ti.API.info('Notification received')
}

Ti.App.addEventListener('notification', onNotification)

function cleanup() {
  // Always remove app-level listeners
  Ti.App.removeEventListener('notification', onNotification)
  // Destroy Alloy bindings
  $.destroy()
}

// Expose for Navigation Service
$.cleanup = cleanup
```

## Animation Component Usage
Using the toolkit for UI transformations via the `<Animation>` component.

```javascript
// Inside any controller
function shakeError(element) {
  $.myAnim.play(element, 'animate-shake duration-200')
}
```