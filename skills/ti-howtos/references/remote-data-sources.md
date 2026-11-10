# Networking & remote data

Based on the [current official guide](https://titaniumsdk.com/docs/build/data/networking.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

`Ti.Network.HTTPClient` is the HTTP client. It is shaped like
`XMLHttpRequest` - `open`, then `send`, with callbacks - because that is what it
was modelled on, not because there is a browser anywhere.

```js
const client = Ti.Network.createHTTPClient({
  onload() {
    try {
      const body = JSON.parse(this.responseText);
      Ti.API.info(body);
    } catch (error) {
      Ti.API.error(`Invalid JSON: ${error.message}`);
    }
  },
  onerror(e) {
    Ti.API.error(`request failed: ${e.error}`);
  },
  timeout: 10000
});

client.open('GET', 'https://titaniumsdk.com/registry/v1/releases');
client.send();
```

`onload` and `onerror` are called with the client as `this`, which is where
`responseText`, `status` and the headers live.

**Set a `timeout`.** Without one a request on a dropped connection hangs until
the platform gives up, which is measured in minutes on a mobile network.

## Reading the response

| Property | What you get |
| -------- | ------------ |
| `responseText` | The body as a string |
| `responseData` | The body as a `Blob`, for binary |
| `responseXML` | A parsed document, for XML |
| `status` | The HTTP status code |
| `getResponseHeader(name)` | One header |

There is no `responseJSON`. Parse `responseText` yourself, and do it inside a
`try` - a proxy or a captive portal will hand you an HTML error page with a 200
on it, and `JSON.parse` throwing inside `onload` is an unhandled exception.

```js
client.onload = function () {
  let body;
  try {
    body = JSON.parse(this.responseText);
  } catch {
    Ti.API.error('expected JSON, got something else');
    return;
  }
  Ti.API.info(body);
};
```

## Failure callbacks and server status

Handle both `onload` and `onerror`; inspect `client.status` and the error payload before choosing a retry or UI message. Network, timeout and TLS failures can reach `onerror`, and HTTP failures can too: the released Android implementation dispatches HTTP status 400+ to `onerror`. Do not assume a 404/500 always reaches `onload` as the current guide suggests. Finish loading indicators in both handlers.

## Sending

```js
const client = Ti.Network.createHTTPClient({ onload() { /* ... */ } });
client.open('POST', 'https://example.com/notes');
client.setRequestHeader('Content-Type', 'application/json');
client.send(JSON.stringify({ body: 'A note' }));
```

`setRequestHeader` goes **after** `open` and before `send`. Called before
`open` it is discarded, silently.

Pass a plain object to `send` instead and it is encoded as a form post. Pass a
dictionary containing a file and it becomes a multipart upload.

## Files

Set `file` on the client and the response is written straight to disk rather
than held in memory, which is how to download something larger than you want
resident:

```js
const target = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'sdk.zip');

const client = Ti.Network.createHTTPClient({
  onload() { Ti.API.info(`saved ${target.size} bytes`); },
  onerror(e) { Ti.API.error(e.error); },
  timeout: 60000
});
client.file = target;
client.open('GET', 'https://example.com/sdk.zip');
client.send();
```

`ondatastream` reports progress as a `progress` value from 0 to 1, which is
what to wire a progress bar to. `onsendstream` does the same for uploads. Both
must be set **before** `open`, and `progress` is
`Ti.Network.PROGRESS_UNKNOWN` when the size is not known ahead of time, which
is the case for a chunked response.

## Is there a connection

```js
if (!Ti.Network.online) {
  // ...
}
```

`Ti.Network.online` is whether the device has a route, not whether your server
is reachable. Treat it as a way to explain a failure rather than a way to
predict one: send the request, and use the flag to say "you appear to be
offline" when it fails.

`networkType` distinguishes wifi from mobile, which is worth checking before a
large download.

## Certificates

`validatesSecureCertificate` defaults to true in distribution mode and false
in simulator/testing mode (including development device builds), so a self-signed certificate works in
development and fails in production. That is deliberate. Do not set it to false
to make a release work - pin properly with `securityManager` or fix the
certificate.

## Next

[Media](https://titaniumsdk.com/docs/build/media.md) covers the camera, the photo library, and playing
audio and video.

Contract correction: [released HTTPClient API](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/apidoc/Titanium/Network/HTTPClient.yml) and [Android response dispatch](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/android/modules/network/src/java/ti/modules/titanium/network/TiHTTPClient.java).
