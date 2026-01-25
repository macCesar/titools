# Remote Data Sources

## 1. HTTPClient and Request Lifecycle

### Basic Pattern
`Ti.Network.HTTPClient` mirrors XHR (XMLHttpRequest) API. Always handle both success and error cases.

```javascript
var xhr = Ti.Network.createHTTPClient({
  onload: function(e) {
    // this.responseText - raw text (for JSON/text)
    // this.responseXML - XML document (including SOAP)
    // this.responseData - binary data (Blob)
    Ti.API.debug(this.responseText);
  },
  onerror: function(e) {
    Ti.API.debug(e.error);
  },
  timeout: 5000
});
xhr.open('GET', 'https://api.example.com/data');
xhr.send();
```

### HTTP Methods
- GET: `xhr.open('GET', url)` then `xhr.send()`
- POST: `xhr.open('POST', url)` then `xhr.send({key: 'value'})`
- PUT/DELETE/PATCH: All supported (PATCH since 4.1.0 on Android)

### Setting Headers
**Critical**: Headers must be set AFTER `open()` but BEFORE `send()`

```javascript
var client = Ti.Network.createHTTPClient();
client.open('POST', 'http://server.com/upload');
client.setRequestHeader('Content-Type', 'text/csv');
client.setRequestHeader('Authorization', 'Bearer ' + token);
client.send('data');
```

### XHR Lifecycle States
Monitor with `onreadystatechange`:
- `UNSENT` - Object constructed
- `OPENED` - `open()` called successfully
- `HEADERS_RECEIVED` - All redirects followed, headers received
- `LOADING` - Response body being received
- `DONE` - Transfer complete or error occurred

```javascript
xhr.onreadystatechange = function(e) {
  switch(this.readyState) {
    case Ti.Network.HTTPClient.HEADERS_RECEIVED:
      Ti.API.info('Headers: ' + this.getResponseHeader('Content-Type'));
      break;
    case Ti.Network.HTTPClient.DONE:
      Ti.API.info('Complete');
      break;
  }
};
```

### Progress Monitoring
- `onsendstream`: Upload progress (0.0-1.0)
- `ondatastream`: Download progress (0.0-1.0)

```javascript
xhr.onsendstream = function(e) {
  progressBar.value = e.progress;
};
xhr.ondatastream = function(e) {
  progressBar.value = e.progress;
};
```

## 2. Working with JSON Data

### Receiving JSON
```javascript
xhr.onload = function() {
  var data = JSON.parse(this.responseText);
  Ti.API.info(data.users[0].name);
};
```

### Sending JSON
`send()` automatically stringifies objects:

```javascript
var postData = { title: 'My Post', body: 'Content' };
xhr.open('POST', 'http://blog.com/api/posts');
xhr.send(postData);  // Auto-stringified
```

For GET querystrings, manually stringify and encode:

```javascript
var data = { search: 'titanium' };
var queryString = encodeURIComponent(JSON.stringify(data));
xhr.open('GET', 'http://api.com/search?q=' + queryString);
xhr.send();
```

### Important Limitation
JSON cannot represent methods. Attempting to stringify Titanium objects returns empty representation.

## 3. Working with XML Data

### Parsing XML
Titanium provides XML DOM Level 2 implementation. Auto-serializes if Content-Type is XML.

```javascript
xhr.onload = function() {
  var doc = this.responseXML.documentElement;
  var items = doc.getElementsByTagName('item');
  for (var i = 0; i < items.length; i++) {
    var title = items.item(i)
      .getElementsByTagName('title').item(0)
      .textContent;
    Ti.API.info(title);
  }
};
```

### Common DOM Methods
- `getElementsByTagName(name)` - Returns array of nodes
- `item(index)` - Select specific node from array
- `getAttribute(name)` - Get attribute value
- `textContent` / `nodeValue` - Get leaf node value

### Important: Know Your DTD
You must understand the XML structure (node hierarchy) to parse correctly. Use tools like apigee.com to inspect API responses.

## 4. File Uploads and Downloads

### File Upload
Pass a Blob to `send()`:

```javascript
Ti.Media.openPhotoGallery({
  success: function(event) {
    var xhr = Ti.Network.createHTTPClient({
      onload: function() {
        Ti.API.info('Upload complete: ' + this.status);
      }
    });
    xhr.open('POST', 'https://server.com/upload');
    xhr.send({
      file: event.media,  // Blob from gallery
      username: 'user'
    });
  }
});
```

For file uploads with actual file contents:
```javascript
var file = Ti.Filesystem.getFile(event.media.nativePath);
if (file.exists()) {
  xhr.send({ file: file.read() });
}
```

### File Download (Cross-Platform)

**Option 1**: Write manually to filesystem

```javascript
var xhr = Ti.Network.createHTTPClient({
  onload: function() {
    var file = Ti.Filesystem.getFile(
      Ti.Filesystem.applicationDataDirectory,
      'downloaded.png'
    );
    file.write(this.responseData);
    Ti.App.fireEvent('download_complete', { path: file.nativePath });
  },
  timeout: 10000
});
xhr.open('GET', 'http://example.com/image.png');
xhr.send();
```

**Option 2**: iOS-only automatic saving with `file` property

```javascript
var xhr = Ti.Network.createHTTPClient({
  onload: function() {
    Ti.API.info('Saved to applicationDataDirectory/test.pdf');
  }
});
xhr.open('GET', 'http://example.com/file.pdf');
xhr.file = Ti.Filesystem.getFile(
  Ti.Filesystem.applicationDataDirectory,
  'test.pdf'
);
xhr.send();
```

### File Storage Locations
- `applicationDataDirectory` - Primary read/write location for app files
- `resourcesDirectory` - Read-only app resources (writeable in simulator only)
- `tempDirectory` - Temporary files, OS may delete when app closes
- `externalCacheDirectory` - Android SD card cache (check `isExternalStoragePresent()`)
- `applicationCacheDirectory` - Cache data, persists but OS may clean

## 5. Sockets

Titanium supports TCP socket connections via `Ti.Network.Socket`.

### Creating a TCP Socket

```javascript
var socket = Ti.Network.Socket.createTCP({
  host: 'example.com',
  port: 80,
  connected: function(e) {
    Ti.API.info('Socket connected');
    // Write data
    this.write(Ti.createBuffer({
      value: 'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n'
    }));
  },
  error: function(e) {
    Ti.API.error('Socket error: ' + e.error);
  }
});

socket.connect();
```

### Reading from Socket

```javascript
socket.read(function(e) {
  if (e.bytesProcessed > 0) {
    var data = e.buffer.toString();
    Ti.API.info('Received: ' + data);
  }
});
```

### Socket Lifecycle
- `connect()` - Initiate connection
- `write(buffer)` - Send data
- `read(callback)` - Read incoming data
- `close()` - Close connection

## 6. SSL Certificate Store Support

### SSL Pinning
Titanium supports SSL certificate pinning for secure connections.

```javascript
var xhr = Ti.Network.createHTTPClient({
  onload: function() { /* ... */ },
  onerror: function() { /* ... */ },
  validatesSecureCertificate: true  // Default, validates SSL
});
```

For custom certificate validation or pinning, you may need to implement additional security measures in your backend configuration.

## CORS Considerations for Mobile Web

For Mobile Web targets accessing cross-domain resources:
- Enable CORS headers on server
- Or configure a proxy service
- Use custom `Ti.Network.httpURLFormatter`

## Best Practices

1. **Always set timeouts** to prevent hanging requests
2. **Handle both `onload` and `onerror`** - never assume success
3. **Use progress callbacks** for large file operations
4. **Save large downloads directly to disk** using `file` property (iOS) or `write()` to avoid memory exhaustion
5. **For complex JSON**, validate schema before parsing
6. **For XML**, always test with actual API response to verify node hierarchy
7. **Use `onsendstream`/`ondatastream`** to provide user feedback during transfers
