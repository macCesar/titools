# Remote data sources

## 1. HTTPClient and request lifecycle

### Basic pattern
`Ti.Network.HTTPClient` mirrors the XHR (XMLHttpRequest) API. Always handle both success and error paths.

```javascript
const xhr = Ti.Network.createHTTPClient({
  onload: (e) => {
    // this.responseText - raw text (JSON/text)
    // this.responseXML - XML document (including SOAP)
    // this.responseData - binary data (Blob)
    Ti.API.debug(xhr.responseText);
  },
  onerror: (e) => {
    Ti.API.debug(e.error);
  },
  timeout: 5000
});
xhr.open('GET', 'https://api.example.com/data');
xhr.send();
```

### HTTP methods
- GET: `xhr.open('GET', url)` then `xhr.send()`
- POST: `xhr.open('POST', url)` then `xhr.send({key: 'value'})`
- PUT/DELETE/PATCH: all supported (PATCH since 4.1.0 on Android)

### Setting headers
Headers must be set after `open()` but before `send()`.

```javascript
const client = Ti.Network.createHTTPClient();
client.open('POST', 'http://server.com/upload');
client.setRequestHeader('Content-Type', 'text/csv');
client.setRequestHeader('Authorization', `Bearer ${token}`);
client.send('data');
```

### XHR lifecycle states
Monitor with `onreadystatechange`:
- `UNSENT` - object constructed
- `OPENED` - `open()` called successfully
- `HEADERS_RECEIVED` - all redirects followed, headers received
- `LOADING` - response body being received
- `DONE` - transfer complete or error occurred

```javascript
xhr.onreadystatechange = (e) => {
  switch (xhr.readyState) {
    case Ti.Network.HTTPClient.HEADERS_RECEIVED:
      Ti.API.info(`Headers: ${xhr.getResponseHeader('Content-Type')}`);
      break;
    case Ti.Network.HTTPClient.DONE:
      Ti.API.info('Complete');
      break;
  }
};
```

### Progress monitoring
- `onsendstream`: upload progress (0.0-1.0)
- `ondatastream`: download progress (0.0-1.0)

```javascript
xhr.onsendstream = (e) => {
  progressBar.value = e.progress;
};
xhr.ondatastream = (e) => {
  progressBar.value = e.progress;
};
```

## 2. Working with JSON data

### Receiving JSON
```javascript
xhr.onload = () => {
  const data = JSON.parse(xhr.responseText);
  Ti.API.info(data.users[0].name);
};
```

### Sending JSON
`send()` stringifies objects for you.

```javascript
const postData = { title: 'My Post', body: 'Content' };
xhr.open('POST', 'http://blog.com/api/posts');
xhr.send(postData); // Auto-stringified
```

For GET query strings, stringify and encode yourself.

```javascript
const data = { search: 'titanium' };
const queryString = encodeURIComponent(JSON.stringify(data));
xhr.open('GET', `http://api.com/search?q=${queryString}`);
xhr.send();
```

### Important limitation
JSON cannot represent methods. Stringifying Titanium objects returns an empty representation.

## 3. Working with XML data

### Parsing XML
Titanium provides XML DOM Level 2. If the response is XML and the server sends the correct Content-Type, Titanium auto-parses it.

```javascript
xhr.onload = () => {
  const doc = xhr.responseXML.documentElement;
  const items = doc.getElementsByTagName('item');
  for (let i = 0; i < items.length; i++) {
    const title = items.item(i)
      .getElementsByTagName('title').item(0)
      .textContent;
    Ti.API.info(title);
  }
};
```

### Common DOM methods
- `getElementsByTagName(name)` - returns array of nodes
- `item(index)` - selects a specific node from the array
- `getAttribute(name)` - gets an attribute value
- `textContent` / `nodeValue` - gets a leaf node value

### Important: know your DTD
You must understand the XML structure (node hierarchy) to parse correctly. Use tools like apigee.com to inspect API responses.

## 4. File uploads and downloads

### File upload
Pass a Blob to `send()`.

```javascript
Ti.Media.openPhotoGallery({
  success: (event) => {
    const xhr = Ti.Network.createHTTPClient({
      onload: () => {
        Ti.API.info(`Upload complete: ${xhr.status}`);
      }
    });
    xhr.open('POST', 'https://server.com/upload');
    xhr.send({
      file: event.media, // Blob from gallery
      username: 'user'
    });
  }
});
```

For file uploads with actual file contents:

```javascript
const file = Ti.Filesystem.getFile(event.media.nativePath);
if (file.exists()) {
  xhr.send({ file: file.read() });
}
```

Note: when uploading from the photo gallery, `event.media` is a Blob. For filesystem uploads, use `Ti.Filesystem.getFile(path).read()` to get a Blob.

### File download (cross-platform)

Option 1: write manually to the filesystem.

```javascript
const xhr = Ti.Network.createHTTPClient({
  onload: () => {
    const file = Ti.Filesystem.getFile(
      Ti.Filesystem.applicationDataDirectory,
      'downloaded.png'
    );
    file.write(xhr.responseData);
    Ti.App.fireEvent('download_complete', { path: file.nativePath });
  },
  timeout: 10000
});
xhr.open('GET', 'http://example.com/image.png');
xhr.send();
```

Option 2 (iOS only): set `xhr.file` to save directly without buffering.

```javascript
xhr.file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'download.zip');
```

```javascript
const xhr = Ti.Network.createHTTPClient({
  onload: () => {
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

### File storage locations
- `applicationDataDirectory` - primary read/write location for app files
- `resourcesDirectory` - read-only app resources (writeable in simulator only)
- `tempDirectory` - temporary files, OS may delete when app closes
- `externalCacheDirectory` - Android SD card cache (check `isExternalStoragePresent()`)
- `applicationCacheDirectory` - cache data, persists but OS may clean it up

## 5. Sockets

Titanium supports TCP sockets via `Ti.Network.Socket`.

### Creating a TCP socket

```javascript
const socket = Ti.Network.Socket.createTCP({
  host: 'example.com',
  port: 80,
  connected: function (e) {
    Ti.API.info('Socket connected');
    // Write data
    this.write(Ti.createBuffer({
      value: 'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n'
    }));
  },
  error: (e) => {
    Ti.API.error(`Socket error: ${e.error}`);
  }
});

socket.connect();
```

### Socket listening (Android/iOS)
To create a socket server that accepts connections:

```javascript
const listenSocket = Ti.Network.Socket.createTCP({
  host: '127.0.0.1', // localhost
  port: 40404,
  accepted: (e) => {
    Ti.API.info(`Incoming connection accepted: ${e.inbound}`);
    e.inbound.close();
  }
});
listenSocket.listen();
listenSocket.accept(); // Asynchronous, waits for next connection
```

Platform note: on iOS, `Ti.Platform.address` returns the WiFi interface address. On Android, only the loopback address (`127.0.0.1`) is available for listening sockets.

## 6. Dealing with SOAP web services

JSON is recommended, but you can consume legacy SOAP services by sending the XML envelope manually.

### Manual approach (SOAP envelope)
```javascript
const client = Ti.Network.createHTTPClient();
client.onload = () => {
  const doc = client.responseXML.documentElement;
  // Parse the response XML manually
};

const soapRequest = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n" +
  "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"> \n" +
  "<SOAP-ENV:Body> \n" +
  "  <GetUserDetailsReq> \n" +
  "    <SessionToken>XXXX</SessionToken> \n" +
  "  </GetUserDetailsReq> \n" +
  "</SOAP-ENV:Body> \n" +
  "</SOAP-ENV:Envelope>";

client.open('POST', 'https://server.com/service.asmx');
client.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
client.send({ xml: soapRequest });
```

## 7. SSL certificate and SecurityManager

For SSL pinning, use the `securityManager` property.

### SSL pinning (TiSDK 3.3.0+)
Pinning ensures the app only communicates with a server that presents a specific certificate.

```javascript
const xhr = Ti.Network.createHTTPClient({
  validatesSecureCertificate: true,
  // securityManager allows custom validation logic
  securityManager: mySecurityModule
});
```

### SSL certificate store (Android)
```javascript
const certificateStore = require('ti.certificatestore');
const httpClient = Ti.Network.createHTTPClient({
  securityManager: certificateStore.createX509CertificatePinningSecurityManager([
    {
      url: 'https://api.example.com',
      serverCertificate: 'api_cert.der'
    }
  ])
});
```

### Android: addTrustManager
Use this for development environments or private networks with custom certs.

```javascript
const certificateStore = require('ti.certificatestore');
const xhr = Ti.Network.createHTTPClient();

certificateStore.addCertificate('server.p12', 'password');
xhr.addTrustManager(certificateStore.getTrustManager());

xhr.open('GET', url);
xhr.send();
```

## 8. CORS considerations for Mobile Web

For Mobile Web targets accessing cross-domain resources:
- Enable CORS headers on the server
- Or configure a proxy service
- Use custom `Ti.Network.httpURLFormatter`

## Best practices

1. Set timeouts to prevent hanging requests.
2. Handle both `onload` and `onerror`.
3. Use progress callbacks for large file operations.
4. Save large downloads to disk using `file` (iOS) or `write()` to avoid memory exhaustion.
5. For complex JSON, validate schema before parsing.
6. For XML, test with real responses to verify node hierarchy.
7. Use `onsendstream` and `ondatastream` for user feedback during transfers.
