# Web Content Integration

## 1. The WebView Component

### WKWebView (Titanium SDK 8.0.0+)
Apple deprecated UIWebView. Titanium now uses WKWebView as the underlying implementation.

**Important**: WKWebView has some behavioral differences from the legacy UIWebView.

### Basic WebView Creation

#### Remote URL
```javascript
var webview = Ti.UI.createWebView({
  url: 'http://www.appcelerator.com'
});
win.add(webview);
win.open();
```

#### Local HTML
```javascript
var webview = Ti.UI.createWebView({
  url: 'local.html'  // Relative to Resources or app/assets/app/lib
});
win.add(webview);
```

#### Inline HTML
```javascript
var webview = Ti.UI.createWebView({
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
- `canGoBack()` - Returns Boolean if back is possible
- `canGoForward()` - Returns Boolean if forward is possible
- `goBack()` - Navigate back in history
- `goForward()` - Navigate forward in history

#### Loading Control
- `loading` (Boolean) - Current loading state
- `reload()` - Refresh the page
- `stopLoading()` - Stop loading
- `repaint()` - Force repaint

#### Data Handling
- `url` - Local or remote URL
- `html` - Inline HTML string
- `scalesPageToFit` - Boolean to scale content to fit dimensions
- `setBasicAuthentication(username, password)` - HTTP auth

#### Events
- `beforeload` - Fired before loading starts (`e.url` contains source)
- `load` - Fired when content loaded
- `error` - Fired on load failure (`e.url`, `e.message`)

## 2. Communication Between WebViews and Titanium

### Local Web Content Communication

#### Logging from WebView
Ti.API methods work within local HTML:

```html
<html>
  <body onload="Ti.API.info('Page loaded!');">
    <p>Logging works!</p>
  </body>
</html>
```

Available logging methods:
- `Ti.API.debug(message)`
- `Ti.API.info(message)`
- `Ti.API.warn(message)`
- `Ti.API.error(message)`
- `Ti.API.log(type, message)`

#### Bidirectional Events with Ti.App

**In local HTML**:
```html
<html>
  <head>
    <script>
      // Listen for events from Titanium
      Ti.App.addEventListener('app:fromTitanium', function(e) {
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
var webview = Ti.UI.createWebView({ url: 'local.html' });

// Listen for events from WebView
Ti.App.addEventListener('app:fromWebView', function(e) {
  alert(e.message);
});

// Send event to WebView
var button = Ti.UI.createButton({
  title: 'Send to WebView'
});
button.addEventListener('click', function() {
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
var webview = Ti.UI.createWebView({ url: 'https://example.com' });

webview.addEventListener('load', function(e) {
  // Get page title
  var title = webview.evalJS('document.title');
  Ti.API.info('Page title: ' + title);

  // Get cookies
  var cookies = webview.evalJS('document.cookie');
  Ti.API.info('Cookies: ' + cookies);

  // Execute custom function
  webview.evalJS('alert("Hello from Titanium!");');
});
```

**evalJS() Rules**:
- Must call from `load` event (page must be loaded)
- Pass code as single string
- Returns string (or null)
- Use `JSON.stringify()` for complex data

#### Passing Data to Remote Content

```javascript
webview.addEventListener('load', function() {
  var data = { user: 'John', score: 100 };
  webview.evalJS('window.appData = ' + JSON.stringify(data) + ';');
});
```

Then in remote HTML:
```html
<script>
  console.log(window.appData.user);  // 'John'
</script>
```

## 3. Performance and Interaction Concerns

### WebView Performance

**WebView is resource-intensive**:
- Each WebView requires its own rendering context
- Significant memory overhead
- Load time regardless of content simplicity

**Best Practice**: If you can recreate content with native Titanium components, do so.

### WebView in TableViews

**Anti-Pattern**: Embedding WebViews in TableViewRows causes sluggish scrolling.

**Alternative**: Consider:
- Native labels/attributes for text
- Attribute strings for formatted text
- Custom row renderers

### WebView in Scrollable Components

WebViews don't play well inside other scrollable containers (ScrollView, TableView). They consume touch events.

**Workaround**: Set `touchEnabled: false` on WebView if inside scrollable parent:

```javascript
var webview = Ti.UI.createWebView({
  url: 'content.html',
  touchEnabled: false  // Allow parent to handle touches
});
```

### Viewport Meta Tag

For mobile-optimized content, use viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

Resources:
- [Apple Safari Viewport Guide](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)
- [Android Targeting Screens](https://developer.android.com/guide/webapps/targeting.html)
- [Mozilla Viewport Meta Tag](https://developer.mozilla.org/en/Mobile/Viewport_meta_tag)

## 4. WebView Use Cases

### Authentication Flows
Many OAuth providers use WebView for login (like Facebook module).

```javascript
var authWebView = Ti.UI.createWebView({
  url: 'https://auth.example.com/oauth'
});

authWebView.addEventListener('load', function(e) {
  // Detect redirect to callback URL with token
  if (e.url.indexOf('myapp://callback') === 0) {
    var token = extractTokenFromUrl(e.url);
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
  var ctx = document.getElementById('myCanvas').getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 150, 100);
</script>
```

### Third-Party Libraries
Use web libraries like jQuery, D3.js, Chart.js:

```html
<script src="jquery.min.js"></script>
<script src="chart.min.js"></script>
<script>
  $(document).ready(function() {
    var chart = new Chart(ctx, { ... });
  });
</script>
```

### Content Rendering
For rich text, RSS feeds, or formatted documents:

```javascript
var webview = Ti.UI.createWebView({
  html: renderContentAsHTML(rssData)
});
```

## 5. WKWebView-Specific Considerations

### Different from UIWebView

1. **Cookie Management**: WKWebView has separate cookie storage
2. **localStorage/SessionStorage**: Not shared with native app
3. **HTTP Headers**: May require additional handling
4. **File Loading**: Different security restrictions for local files

### For detailed WKWebView information
See the official [WKWebView guide](https://docs.appcelerator.com/platform/latest/#!/guide/Titanium_SDK_How-tos) for comprehensive details on migration and specific behaviors.

## Best Practices Summary

1. **Avoid WebViews when possible** - Use native components for better performance
2. **Never embed in TableView** - Causes severe scrolling issues
3. **Set touchEnabled: false** - If WebView must be inside scrollable container
4. **Use local content for integration** - Only local content supports Ti.App events
5. **Use evalJS() for remote** - Only way to interact with remote content
6. **Wait for load event** - Before calling evalJS()
7. **Configure viewport** - For proper mobile rendering
8. **Consider caching** - Local content loads faster and works offline
