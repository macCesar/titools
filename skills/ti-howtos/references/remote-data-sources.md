# Remote Data Sources

## Table of Contents

- [Remote Data Sources](#remote-data-sources)
  - [Table of Contents](#table-of-contents)
  - [1. HTTPClient and Request Lifecycle](#1-httpclient-and-request-lifecycle)
    - [Basic Pattern](#basic-pattern)
    - [HTTP Methods](#http-methods)
    - [Setting Headers](#setting-headers)
    - [XHR Lifecycle States](#xhr-lifecycle-states)
    - [Progress Monitoring](#progress-monitoring)
  - [2. Working with JSON Data](#2-working-with-json-data)
    - [Receiving JSON](#receiving-json)
    - [Sending JSON](#sending-json)
    - [Important Limitation](#important-limitation)
  - [3. Working with XML Data](#3-working-with-xml-data)
    - [Parsing XML](#parsing-xml)
    - [Common DOM Methods](#common-dom-methods)
    - [Important: Know Your DTD](#important-know-your-dtd)
  - [4. File Uploads and Downloads](#4-file-uploads-and-downloads)
    - [File Upload](#file-upload)
    - [File Download (Cross-Platform)](#file-download-cross-platform)
    - [File Storage Locations](#file-storage-locations)
  - [5. Sockets](#5-sockets)
    - [Creating a TCP Socket](#creating-a-tcp-socket)
    - [Socket Listening (Android/iOS)](#socket-listening-androidios)
  - [6. Dealing with SOAP Web Services](#6-dealing-with-soap-web-services)
    - [Manual Approach (SOAP Envelope)](#manual-approach-soap-envelope)
  - [7. SSL Certificate \& Security Manager](#7-ssl-certificate--security-manager)
    - [SSL Pinning (TiSDK 3.3.0+)](#ssl-pinning-tisdk-330)
    - [Android: addTrustManager](#android-addtrustmanager)
  - [CORS Considerations for Mobile Web](#cors-considerations-for-mobile-web)
  - [Best Practices](#best-practices)

---

## 1. HTTPClient and Request Lifecycle

### Basic Pattern
`Ti.Network.HTTPClient` mirrors XHR (XMLHttpRequest) API. Always handle both success and error cases.

```javascript
const xhr = Ti.Network.createHTTPClient({
  onload: (e) => {
    // this.responseText - raw text (for JSON/text)
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

### HTTP Methods
- GET: `xhr.open('GET', url)` then `xhr.send()`
- POST: `xhr.open('POST', url)` then `xhr.send({key: 'value'})`
- PUT/DELETE/PATCH: All supported (PATCH since 4.1.0 on Android)

### Setting Headers
**Critical**: Headers must be set AFTER `open()` but BEFORE `send()`

```javascript
const client = Ti.Network.createHTTPClient();
client.open('POST', 'http://server.com/upload');
client.setRequestHeader('Content-Type', 'text/csv');
client.setRequestHeader('Authorization', `Bearer ${token}`);
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
xhr.onreadystatechange = (e) => {
  switch(xhr.readyState) {
    case Ti.Network.HTTPClient.HEADERS_RECEIVED:
      Ti.API.info(`Headers: ${xhr.getResponseHeader('Content-Type')}`);
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
xhr.onsendstream = (e) => {
  progressBar.value = e.progress;
};
xhr.ondatastream = (e) => {
  progressBar.value = e.progress;
};
```

## 2. Working with JSON Data

### Receiving JSON
```javascript
xhr.onload = () => {
  const data = JSON.parse(xhr.responseText);
  Ti.API.info(data.users[0].name);
};
```

### Sending JSON
`send()` automatically stringifies objects:

```javascript
const postData = { title: 'My Post', body: 'Content' };
xhr.open('POST', 'http://blog.com/api/posts');
xhr.send(postData);  // Auto-stringified
```

For GET querystrings, manually stringify and encode:

```javascript
const data = { search: 'titanium' };
const queryString = encodeURIComponent(JSON.stringify(data));
xhr.open('GET', `http://api.com/search?q=${queryString}`);
xhr.send();
```

### Important Limitation
JSON cannot represent methods. Attempting to stringify Titanium objects returns empty representation.

## 3. Working with XML Data

### Parsing XML
Titanium provides XML DOM Level 2 implementation. Auto-serializes if Content-Type is XML.

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
  success: (event) => {
    const xhr = Ti.Network.createHTTPClient({
      onload: () => {
        Ti.API.info(`Upload complete: ${xhr.status}`);
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
const file = Ti.Filesystem.getFile(event.media.nativePath);
if (file.exists()) {
  xhr.send({ file: file.read() });
}
```

### File Download (Cross-Platform)

**Option 1**: Write manually to filesystem

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

**Option 2**: iOS-only automatic saving with `file` property

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
const socket = Ti.Network.Socket.createTCP({
  host: 'example.com',
  port: 80,
  connected: function(e) {
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

### Socket Listening (Android/iOS)
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

## 6. Dealing with SOAP Web Services

Although JSON is recommended, you can consume legacy SOAP services using a "low-tech" approach by sending the XML envelope manually.

### Manual Approach (SOAP Envelope)
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

## 7. SSL Certificate & Security Manager

For robust security (SSL Pinning), use the `securityManager` property.

### SSL Pinning (TiSDK 3.3.0+)
Unlike standard certificate validation, Pinning ensures the app only communicates with a server having a specific certificate.

```javascript
const xhr = Ti.Network.createHTTPClient({
    validatesSecureCertificate: true,
    // securityManager allows implementing custom validation logic
    securityManager: mySecurityModule 
});
```

### Android: addTrustManager
Allows adding custom certificates for development environments or private networks:
```javascript
const certificateStore = require('ti.certificatestore');
const xhr = Ti.Network.createHTTPClient();

certificateStore.addCertificate('server.p12', 'password');
xhr.addTrustManager(certificateStore.getTrustManager());

xhr.open("GET", url);
xhr.send();
```
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
