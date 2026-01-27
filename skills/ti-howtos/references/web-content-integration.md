# Web Content Integration

## Table of Contents

- [Web Content Integration](#web-content-integration)
  - [Table of Contents](#table-of-contents)
  - [1. The WebView Component](#1-the-webview-component)
    - [WKWebView (Titanium SDK 8.0.0+)](#wkwebview-titanium-sdk-800)
    - [Basic WebView Creation](#basic-webview-creation)
      - [Remote URL](#remote-url)
      - [Local HTML](#local-html)
      - [Inline HTML](#inline-html)
    - [Local Web Content with Assets](#local-web-content-with-assets)
    - [WebView Properties and Methods](#webview-properties-and-methods)
      - [Navigation](#navigation)
      - [Load Control](#load-control)
      - [Data Handling](#data-handling)
      - [Events](#events)
  - [2. Communication Between WebViews and Titanium](#2-communication-between-webviews-and-titanium)
    - [Local Web Content Communication](#local-web-content-communication)
      - [Logging from WebView](#logging-from-webview)
      - [Bidirectional Events with Ti.App](#bidirectional-events-with-tiapp)
    - [Remote Web Content Communication](#remote-web-content-communication)
      - [Using evalJS() for Remote Content](#using-evaljs-for-remote-content)
      - [Passing Data to Remote Content](#passing-data-to-remote-content)
  - [3. Performance and Interaction Concerns](#3-performance-and-interaction-concerns)
    - [WebView Performance](#webview-performance)
    - [WebView in TableViews](#webview-in-tableviews)
    - [WebView in Scrollable Components](#webview-in-scrollable-components)
    - [Viewport Meta Tag](#viewport-meta-tag)
  - [4. WebView Use Cases](#4-webview-use-cases)
    - [Authentication Flows](#authentication-flows)
    - [Canvas and Graphics](#canvas-and-graphics)
  - [5. WKWebView-Specific Considerations](#5-wkwebview-specific-considerations)
  - [Best Practices Summary](#best-practices-summary)

---

## 1. The WebView Component

### WKWebView (Titanium SDK 8.0.0+)
Apple deprecated UIWebView. Titanium now uses WKWebView as the underlying implementation.

**Important**: WKWebView has some behavioral differences compared to the original UIWebView.

### Basic WebView Creation

#### Remote URL
```javascript
const webview = Ti.UI.createWebView({
  url: 'https://www.appcelerator.com'
});
win.add(webview);
win.open();
```

#### Local HTML
```javascript
const webview = Ti.UI.createWebView({
  url: 'local.html'  // Relative to Resources or app/assets/app/lib
});
win.add(webview);
```

#### Inline HTML
```javascript
const webview = Ti.UI.createWebView({
  html: '<html><body><h1>Hello</h1></body></html>'
});
```

### Local Web Content with Assets

Local content can include CSS, JS, and images. Paths are relative to Resources (Classic) or app/assets/app/lib (Alloy).

**local.html**:
```html
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="local.css"/>
    <script src="local.js"></script>
  </head>
  <body>
    <p>Local content</p>
  </body>
</html>
```

### WebView Properties and Methods

#### Navigation
- `canGoBack()` - Returns Boolean if possible to go back
- `canGoForward()` - Returns Boolean if possible to go forward
- `goBack()` - Navigate back in history
- `goForward()` - Navigate forward in history

#### Load Control
- `loading` (Boolean) - Current loading state
- `reload()` - Refresh the page
- `stopLoading()` - Stop loading
- `repaint()` - Force repaint

#### Data Handling
- `url` - Local or remote URL
- `html` - Inline HTML string
- `scalesPageToFit` - Boolean to scale content to dimensions
- `setBasicAuthentication(username, password)` - HTTP authentication

#### Events
- `beforeload` - Fires before loading begins (`e.url` contains the source)
- `load` - Fires when content has loaded
- `error` - Fires on load failures (`e.url`, `e.message`)

## 2. Communication Between WebViews and Titanium

### Local Web Content Communication

#### Logging from WebView
Ti.API methods work inside local HTML:

```html
<html>
  <body onload="Ti.API.info('Page loaded!');">
    <p>Logging works!</p>
  </body>
</html>
```

#### Bidirectional Events with Ti.App

**In local HTML**:
```html
<html>
  <head>
    <script>
      // Listen for events from Titanium
      Ti.App.addEventListener('app:fromTitanium', (e) => {
        alert(e.message);
        document.getElementById('output').textContent = e.message;
      });

      // Send event to Titanium
      function sendToApp() {
        Ti.App.fireEvent('app:fromWebView', {
          message: 'Hello from WebView!'
        });
      }
    </script>
  </head>
  <body>
    <button onclick="sendToApp()">Send to Titanium</button>
    <div id="output"></div>
  </body>
</html>
```

**In Titanium**:
```javascript
const webview = Ti.UI.createWebView({ url: 'local.html' });

// Listen for events from the WebView
Ti.App.addEventListener('app:fromWebView', (e) => {
  alert(e.message);
});

// Send event to the WebView
const button = Ti.UI.createButton({
  title: 'Send to WebView'
});
button.addEventListener('click', () => {
  Ti.App.fireEvent('app:fromTitanium', {
    message: 'Hello from Titanium!'
  });
});
```

### Remote Web Content Communication

**Critical**: Titanium statements (Ti.API, Ti.App) do NOT work in remote HTML content.

#### Using evalJS() for Remote Content

Inject JavaScript and retrieve results as strings:

```javascript
const webview = Ti.UI.createWebView({ url: 'https://example.com' });

webview.addEventListener('load', (e) => {
  // Get the page title
  const title = webview.evalJS('document.title');
  Ti.API.info(`Page title: ${title}`);

  // Get cookies
  const cookies = webview.evalJS('document.cookie');
  Ti.API.info(`Cookies: ${cookies}`);

  // Execute a custom function
  webview.evalJS('alert("Hello from Titanium!");');
});
```

**evalJS() Rules**:
- Must be called from the `load` event (page must be loaded)
- Pass code as a single string
- Returns a string (or null)
- Use `JSON.stringify()` for complex data

#### Passing Data to Remote Content

```javascript
webview.addEventListener('load', () => {
  const data = { user: 'John', score: 100 };
  webview.evalJS(`window.appData = ${JSON.stringify(data)};`);
});
```

Then in the remote HTML:
```html
<script>
  console.log(window.appData.user);  // 'John'
</script>
```

## 3. Performance and Interaction Concerns

### WebView Performance

**WebView consumes many resources**:
- Each WebView requires its own rendering context
- Significant memory overhead
- Load time independent of content simplicity

**Best Practice**: If you can recreate the content with native Titanium components, do it.

### WebView in TableViews

**Anti-Pattern**: Embedding WebViews in TableViewRows causes slow scrolling.

### WebView in Scrollable Components

WebViews don't work well inside other scrollable containers (ScrollView, TableView). They consume touch events.

**Workaround**: Set `touchEnabled: false` on the WebView if inside a scrollable parent:

```javascript
const webview = Ti.UI.createWebView({
  url: 'content.html',
  touchEnabled: false  // Allow parent to handle touches
});
```

### Viewport Meta Tag

For mobile-optimized content, use the viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## 4. WebView Use Cases

### Authentication Flows
Many OAuth providers use WebView for login (like the Facebook module).

```javascript
const authWebView = Ti.UI.createWebView({
  url: 'https://auth.example.com/oauth'
});

authWebView.addEventListener('load', (e) => {
  // Detect redirect to callback URL with token
  if (e.url.indexOf('myapp://callback') === 0) {
    const token = extractTokenFromUrl(e.url);
    Ti.App.fireEvent('auth:success', { token: token });
  }
});
```

### Canvas and Graphics
For complex graphics, use HTML5 Canvas:

**local.html**:
```html
<canvas id="myCanvas" width="300" height="200"></canvas>
<script>
  const ctx = document.getElementById('myCanvas').getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 150, 100);
</script>
```

## 5. WKWebView-Specific Considerations

1. **Cookie Management**: WKWebView has separate cookie storage.
2. **localStorage/SessionStorage**: Not shared with native app.
3. **Asynchronous evalJS**: In modern iOS versions, async usage is preferred to avoid blocking.

For detailed WKWebView information, refer to the official migration guide and specific behaviors.

## Best Practices Summary

1. **Avoid WebViews when possible** - Use native components.
2. **Never embed in TableView** - Causes serious scroll issues.
3. **Use local content for integration** - Only local content supports Ti.App events.
4. **Use evalJS() for remote** - Only way to interact with remote content.
5. **Wait for the load event** - Before calling evalJS().
6. **Configure the viewport** - For proper mobile rendering.
