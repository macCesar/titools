# Web content integration

## 1. The WebView component

### WKWebView (Titanium SDK 8.0.0+)
As of Titanium SDK 8.0.0, WKWebView is the only supported web view on iOS. UIWebView was deprecated and removed. WKWebView behaves differently, so plan for that.

### Basic WebView creation

Remote URL:
```javascript
const webview = Ti.UI.createWebView({
  url: 'https://titaniumsdk.com'
});
win.add(webview);
win.open();
```

Local HTML:
```javascript
const webview = Ti.UI.createWebView({
  url: 'local.html' // Relative to Resources or app/assets/app/lib
});
win.add(webview);
```

Inline HTML:
```javascript
const webview = Ti.UI.createWebView({
  html: '<html><body><h1>Hello</h1></body></html>'
});
```

### Local web content with assets
Local content can include CSS, JS, and images. Paths are relative to Resources (Classic) or app/assets/app/lib (Alloy).

`local.html`:
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

### WebView properties and methods

Navigation:
- `canGoBack()` - returns true if possible to go back
- `canGoForward()` - returns true if possible to go forward
- `goBack()` - navigate back in history
- `goForward()` - navigate forward in history

Load control:
- `loading` (Boolean) - current loading state
- `reload()` - refresh the page
- `stopLoading()` - stop loading
- `repaint()` - force repaint

Data handling:
- `url` - local or remote URL
- `html` - inline HTML string
- `scalesPageToFit` - scale content to dimensions
- `setBasicAuthentication(host, username, password)` - HTTP auth

```javascript
webView.setBasicAuthentication('myDomain.com', 'username', 'password');
```

Events:
- `beforeload` - fires before loading begins (`e.url` contains the source)
- `load` - fires when content has loaded
- `error` - fires on load failures (`e.url`, `e.message`)

## 2. Communication between WebViews and Titanium

### Local web content communication

Logging from WebView:
Ti.API methods work inside local HTML.

```html
<html>
  <body onload="Ti.API.info('Page loaded!');">
    <p>Logging works!</p>
  </body>
</html>
```

Bidirectional events with `Ti.App`:

In local HTML:
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

In Titanium:
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

### Remote web content communication

Titanium statements (`Ti.API`, `Ti.App`) do not work in remote HTML content.

Warning: On iOS 12.0+, calling `evalJS()` synchronously from some contexts can deadlock. Prefer the async version with a callback.

#### Using `evalJS()` for remote content
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

`evalJS()` rules:
- Call it from the `load` event (page must be loaded)
- Pass code as a single string
- Returns a string (or null)
- Use `JSON.stringify()` for complex data

#### Passing data to remote content

```javascript
webview.addEventListener('load', () => {
  const data = { user: 'John', score: 100 };
  webview.evalJS(`window.appData = ${JSON.stringify(data)};`);
});
```

Then in remote HTML:
```html
<script>
  console.log(window.appData.user); // 'John'
</script>
```

## 3. Performance and interaction concerns

### WebView performance
WebView consumes significant resources:
- Each WebView has its own rendering context
- Memory overhead is high
- Load time is independent of content complexity

Best practice: if you can recreate the content with native Titanium components, do it.

### WebView in TableViews
Anti-pattern: embedding WebViews in TableViewRows causes slow scrolling.

### WebView in scrollable components
WebViews do not behave well inside other scrollable containers (ScrollView, TableView). They consume touch events.

Workaround: set `touchEnabled: false` on the WebView if it sits inside a scrollable parent:

```javascript
const webview = Ti.UI.createWebView({
  url: 'content.html',
  touchEnabled: false // Allow parent to handle touches
});
```

### Viewport meta tag
For mobile-optimized content, use the viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## 4. WebView use cases

Common WebView use cases:
- HTML forms: auto-scroll to focused fields, next/previous navigation, native keyboard integration
- Rich text or HTML email: render styled content that is hard to replicate with native labels
- Canvas/graphics: HTML5 Canvas provides 2D drawing not available in native Titanium APIs
- OAuth flows: load third-party auth pages in a WebView and intercept redirects

### Authentication flows
Many OAuth providers use WebView for login (for example, the Facebook module).

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

### Canvas and graphics
For complex graphics, use HTML5 Canvas:

`local.html`:
```html
<canvas id="myCanvas" width="300" height="200"></canvas>
<script>
  const ctx = document.getElementById('myCanvas').getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 150, 100);
</script>
```

## 5. WKWebView behavioral differences (iOS)

- Cookies: WKWebView uses a separate cookie store from `Ti.Network`. Cookies set via HTTPClient are not shared with WebViews.
- `localStorage`/`sessionStorage`: not shared between the native app and the WebView. Each WKWebView has its own storage.
- `evalJS` is async: on iOS 12.0+, synchronous `evalJS()` can deadlock. Use the callback form instead:

```javascript
webView.evalJS('document.title', (result) => {
  Ti.API.info(`Title: ${result}`);
});
```

- Viewport meta tag required: WKWebView needs an explicit viewport tag to scale content correctly:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- Custom fonts: use a special `@font-face` path format in WKWebView CSS. Fonts must be in the app bundle and referenced correctly.
- Remote HTML limitations: `Ti.API`, `Ti.App.fireEvent()`, and other Titanium calls do not work in remotely-loaded HTML. Only local HTML can communicate with the Titanium runtime.

## Best practices summary

1. Avoid WebViews when possible. Use native components.
2. Never embed a WebView in a TableView.
3. Use local content for integration. Only local content supports `Ti.App` events.
4. Use `evalJS()` for remote content. It is the only way to interact with remote pages.
5. Wait for the `load` event before calling `evalJS()`.
6. Configure the viewport for proper mobile rendering.
