# Ti.Network, Ti.Database & Ti.Filesystem API Reference

## Ti.Database
> The top-level `Database` module, used for creating and accessing the in-application SQLite database.
> Extends Ti.Module
> Platforms: both
> Type: module

### Constants (4)
- **FIELD_TYPE_\***: FIELD_TYPE_DOUBLE, FIELD_TYPE_FLOAT, FIELD_TYPE_INT, FIELD_TYPE_STRING


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| install(path, dbName) | Ti.Database.DB | both | Installs an SQLite database to device's internal storage. |
| open(dbName) | Ti.Database.DB | both | Opens an SQLite database. |


---

## Ti.Database.DB
> The `Database` instance returned by <Titanium.Database.open> or <Titanium.Database.install>.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 4/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| file | Ti.Filesystem.File | — | both | A `File` object representing the file where this database is stored. Must only … |
| lastInsertRowId | Number | — | both | The identifier of the last populated row. |
| name | String | — | both | The name of the database. |
| rowsAffected | Number | — | both | The number of rows affected by the last query. |


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(—) | void | both | Closes the database and releases resources from memory. Once closed, this insta… |
| execute(sql, vararg) | Ti.Database.ResultSet | both | Executes an SQL statement against the database and returns a `ResultSet`. |
| executeAsync(query, vararg, callback) | Promise<Titanium.Database.ResultSet> | both | Asynchronously executes an SQL statement against the database and fires a callb… |
| executeAll(queries) | Array<Titanium.Database.ResultSet> | both | Synchronously executes an array of SQL statements against the database and retu… |
| executeAllAsync(queries, callback) | Promise<Array<Titanium.Database.ResultSet>> | both | Asynchronously executes an array of SQL statements against the database and fir… |
| remove(—) | void | both | Removes the database files for this instance from disk. WARNING: this is a dest… |


---

## Ti.Database.ResultSet
> The ResultSet instance returned by <Titanium.Database.DB.execute>.
> Extends Ti.Proxy
> Platforms: both

A result set represents the results returned by a database query.

The [rowCount](Titanium.Database.ResultSet.rowCount) property identifies the number of
rows in the result set. The `ResultSet` object maintains an internal record of the 
current row. As shown in the example, you can use the 
[next](Titanium.Database.ResultSet.next) method to iterate through the rows in the set.

Use the [field](Titanium.Database.ResultSet.field) or
[fieldByName](Titanium.Database.ResultSet.fieldByName) methods to query the fields for
the current row.

On the iOS platform, closing the database also closes the result set, that is,
you can only access the result set if the database is currently open.

### Properties (unique: 3/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| fieldCount | Number | — | both | The number of columns in this result set. |
| rowCount | Number | — | both | The number of rows in this result set. |
| validRow | Boolean | — | both | Indicates whether the current row is valid. |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(—) | void | both | Closes this result set and release resources. Once closed, the result set must … |
| field(index, type) | String \| Number \| Ti.Blob | both | Retrieves the value for the specified field in the current row, and casts it to… |
| fieldByName(name, type) | String \| Number \| Ti.Blob | both | Retrieves the value for the specified field in the current row, and casts it to… |
| fieldName(index) | String | both | Returns the field name for the specified field index. |
| getFieldName(index) | String | android | Returns the field name for the specified field index. |
| isValidRow(—) | Boolean | both | Returns whether the current row is valid. |
| next(—) | Boolean | both | Advances to the next row in the result set and returns `true` if one exists, or… |


---

## Ti.Filesystem
> The top level filesystem module, used to access files and directories on the device.
> Extends Ti.Module
> Platforms: both
> Type: module

For examples of using the Filesystem APIs, refer to the
[Filesystem Access and Storage guide](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_How-tos/Working_with_Local_Data_Sources/Filesystem_Access_and_Storage.html)
as well as the other Filesystem submodule API documentation.

### Properties (unique: 11/21)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| applicationCacheDirectory | String | — | both | Path to the application's internal cache directory. |
| applicationDataDirectory | String | — | both | Path to the application's data directory. |
| applicationDirectory | String | — | ios | Path to the iOS application directory. |
| applicationSupportDirectory | String | — | ios | Path to the application support directory. |
| externalCacheDirectory | String | — | android | Path to the app's sandboxed cache folder on removable storage, such as SD card. |
| externalStorageDirectory | String | — | android | Path to the app's sandboxed folder on removable storage, such as SD card. |
| lineEnding | String | — | both | Platform-specific line ending constant. |
| resourcesDirectory | String | — | both | Path to the application's resource directory. |
| resRawDirectory | String | — | android | Path to the application's raw resource directory. |
| separator | String | — | both | Platform-specific path separator constant. |
| tempDirectory | String | — | both | Path for the application's temporary directory. |

### Constants (7)
- **IOS_FILE_PROTECTION_\***: IOS_FILE_PROTECTION_NONE, IOS_FILE_PROTECTION_COMPLETE
- **IOS_FILE_PROTECTION_COMPLETE_UNLESS_\***: IOS_FILE_PROTECTION_COMPLETE_UNLESS_OPEN
- **IOS_FILE_PROTECTION_COMPLETE_UNTIL_FIRST_USER_\***: IOS_FILE_PROTECTION_COMPLETE_UNTIL_FIRST_USER_AUTHENTICATION
- **MODE_\***: MODE_APPEND, MODE_READ, MODE_WRITE


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createTempDirectory(—) | Ti.Filesystem.File | both | Creates a temporary directory and returns a [File](Titanium.Filesystem.File) ob… |
| createTempFile(—) | Ti.Filesystem.File | both | Creates a temporary file and returns a [File](Titanium.Filesystem.File) object … |
| getFile(path) | Ti.Filesystem.File | both | Returns a `File` object representing the file identified by the path arguments. |
| getAsset(path) | Ti.Blob | ios | Returns a `Blob` object representing the asset catalog image identified by the … |
| isExternalStoragePresent(—) | Boolean | both | Returns `true` if the device supports external storage *and* the external stora… |
| hasStoragePermissions(—) | Boolean | android | Returns `true` if the app has storage permissions. |
| requestStoragePermissions(callback) | Promise<RequestStorageAccessResult> | android | Requests for storage permissions |
| openStream(mode, path) | Ti.Filesystem.FileStream | both | Opens file using the <Titanium.IOStream> interface. |
| directoryForSuite(suiteName) | String | ios | Returns the path to the container directory associated with the specified secur… |


---

## Ti.Filesystem.File
> Object representing a path to a file or directory in the device's persistent storage.
> Extends Ti.Proxy
> Platforms: both

Use the <Titanium.Filesystem.getFile> method to get a handle to a `File` object,
which represents a given path.  There does not need to be an existing file or directory
does not need to exist before `getFile` is called. If the file doesn't exist, and
the file path identifies a file in a writable directory, writing to the file
creates the file implicitly.

See <Titanium.Filesystem> for constants identifying commonly-used device directories.

Use the [exists](Titanium.Filesystem.File.exists) method to test whether the file exists.

A file object can point to an ordinary file, a directory or a symbolic link.
Use [createDirectory](Titanium.Filesystem.File.createDirectory) to create a directory.
Use the [getDirectoryListing](Titanium.Filesystem.File.getDirectoryListing) method to
retrieve a list of the directory's contents.


*(See full overview in titanium-docs)*

### Properties (unique: 10/13)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| executable | Boolean | — | both | `true` if the file is executable. |
| hidden | Boolean | — | both | Set to `true` if the file is hidden. |
| name | String | — | both | Name of the file. |
| nativePath | String | — | both | Native path associated with this file object, as a file URL. |
| parent | Ti.Filesystem.File | — | android | A `File` object representing the parent directory of the file identified by thi… |
| readonly | Boolean | — | android | `true` if the file identified by this object is read-only. |
| size | Number | — | both | Size, in bytes, of the file identified by this object. |
| remoteBackup | Boolean | true | ios | Value indicating whether or not to back up to a cloud service. |
| symbolicLink | Boolean | — | both | `true` if the file identified by this object is a symbolic link. |
| writable | Boolean | — | both | `true` if the file identified by this object is writable. |


### Methods (25)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| append(data) | Boolean | both | Appends data to the file identified by this file object. |
| copy(destinationPath) | Boolean | both | Copies the file identified by this file object to a new path. |
| createDirectory(recursive) | Boolean | both | Creates a directory at the path identified by this file object. |
| createFile(—) | Boolean | both | Creates a file at the path identified by this file object. |
| createTimestamp(—) | Number | both | Returns the creation timestamp for the file identified by this file object. |
| createdAt(—) | Date | both | Returns the creation Date for the file identified by this file object. |
| deleteDirectory(recursive) | Boolean | both | Deletes the directory identified by this file object. |
| deleteFile(—) | Boolean | both | Deletes the file identified by this file object. |
| exists(—) | Boolean | both | Returns `true` if the file or directory identified by this file object exists o… |
| extension(—) | String | both | Returns the extension for the file identified by this file object. |
| getDirectoryListing(—) | Array<String> | both | Returns a listing of the directory identified by this file object, or `null` if… |
| getParent(—) | String \| Ti.Filesystem.File | both | Returns the path of the parent directory holding the file identified by this fi… |
| getProtectionKey(—) | String | ios | Returns the protection key value of this file object. Returns `null` if there's… |
| isDirectory(—) | Boolean | both | Returns `true` if this file object represents a directory. |
| isFile(—) | Boolean | both | Returns `true` if this file object represents an ordinary file. |
| modificationTimestamp(—) | Number | both | Returns the last modification time for this file. |
| modifiedAt(—) | Date | both | Returns the last modification Date for the file identified by this file object. |
| move(newpath) | Boolean | both | Moves the file identified by this file object to another path. |
| open(mode) | Ti.Filesystem.FileStream | both | Opens the file identified by this file object for random access. |
| read(—) | Ti.Blob | both | Returns the contents of the file identified by this file object as a `Blob`. |
| rename(newname) | Boolean | both | Renames the file identified by this file object. |
| resolve(—) | String | both | Returns the fully-resolved native path associated with this file object. |
| setProtectionKey(fileProtectionType) | Boolean | ios | Sets the protection key as an attribute to the file identified by this file obj… |
| spaceAvailable(—) | Number | both | Returns the amount of free space available on the device where the file identif… |
| write(data, append) | Boolean | both | Writes the specified data to the file identified by this file object. |


---

## Ti.Filesystem.FileStream
> Wrapper around `Titanium.Filesystem.File` that implements the `Titanium.IOStream` interface
> Extends Ti.IOStream
> Platforms: both


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(—) | void | both | closes file stream, exception is thrown on error |


---

## Ti.Network
> The top level network module.
> Extends Ti.Module
> Platforms: both
> Type: module

The `Network` module is used to access networking related functionality.

For TCP sockets, see <Titanium.Network.Socket.TCP>.

The legacy <Titanium.Network.TCPSocket> object is still required
by the [BonjourBrowser](Titanium.Network.BonjourBrowser) and
[BonjourService](Titanium.Network.BonjourService) objects.

For all other socket needs, use <Titanium.Network.Socket.TCP>.

### App Transport Security

Starting with iOS 9, Apple introduced new security and compatibility guidelines for networking
and connectivity, which include:


*(See full overview in titanium-docs)*

### Properties (unique: 7/24)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allHTTPCookies | Array<Titanium.Network.Cookie> | — | ios | A list of all cookies in the cookie storage. |
| networkType | Number | — | both | Network type value as a constant. |
| networkTypeName | String | — | both | Network type as a String. Returns one of `NONE`, `WIFI`, `LAN`, `MOBILE`, or `U… |
| online | Boolean | — | both | Boolean value indicating if the device is connected to the network. |
| remoteDeviceUUID | String | — | ios | Remote device UUID if the device is registered with the Apple Push Notification… |
| remoteNotificationTypes | Array<Number> | — | ios | Array of push notification type constants enabled for the application. |
| remoteNotificationsEnabled | Boolean | — | both | Indicates whether push notifications have been enabled using [registerForPushNo… |

### Constants (14)
- **NETWORK_\***: NETWORK_LAN, NETWORK_MOBILE, NETWORK_NONE, NETWORK_UNKNOWN, NETWORK_WIFI
- **NOTIFICATION_TYPE_\***: NOTIFICATION_TYPE_ALERT, NOTIFICATION_TYPE_BADGE, NOTIFICATION_TYPE_SOUND, NOTIFICATION_TYPE_NEWSSTAND
- **PROGRESS_\***: PROGRESS_UNKNOWN
- **TLS_VERSION_1_\***: TLS_VERSION_1_0, TLS_VERSION_1_1, TLS_VERSION_1_2, TLS_VERSION_1_3


### Methods (19)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addHTTPCookie(cookie) | void | both | Adds a cookie to the HTTP client cookie store. |
| addSystemCookie(cookie) | void | android | Adds a cookie to the system cookie store. |
| createBonjourBrowser(serviceType, domain, parameters) | Ti.Network.BonjourBrowser | ios | Creates and returns a `BonjourBrowser` object. |
| createBonjourService(name, type, domain, parameters) | Ti.Network.BonjourService | ios | Creates and returns a `BonjourService` object. |
| decodeURIComponent(value) | String | both | Returns a decoded version of a URI encoded value. |
| encodeURIComponent(value) | String | both | Returns a URI encoded version of the specified URI component. |
| getHTTPCookies(domain, path, name) | Array<Titanium.Network.Cookie> | both | Gets all the cookies with the domain, path and name matched with the given valu… |
| getHTTPCookiesForDomain(domain) | Array<Titanium.Network.Cookie> | both | Gets all the cookies with the domain matched with the given values from the HTT… |
| getSystemCookies(domain, path, name) | Array<Titanium.Network.Cookie> | android | Gets all the cookies with the domain, path and name matched with the given valu… |
| removeAllHTTPCookies(—) | void | both | Removes all the cookies from the HTTP client cookie store. |
| removeAllSystemCookies(—) | void | android | Removes all the cookie from the system client cookie store. |
| removeHTTPCookie(domain, path, name) | void | both | Removes the cookie with the domain, path and name exactly the same as the given… |
| removeHTTPCookiesForDomain(domain) | void | both | Removes the cookies with the domain matched with the given values from the HTTP… |
| removeSystemCookie(domain, path, name) | void | android | Removes the cookie with the domain, path and name exactly the same as the given… |
| registerForPushNotifications(config) | void | both | Registers for push notifications with the Apple Push Notification Service. |
| unregisterForPushNotifications(—) | void | both | Unregisters the application for push notifications. |
| createCookie(parameters) | Ti.Network.Cookie | both | Creates and returns an instance of <Titanium.Network.Cookie>. |
| createHTTPClient(parameters) | Ti.Network.HTTPClient | both | Creates and returns an instance of <Titanium.Network.HTTPClient>. |
| createTCPSocket(parameters) | Ti.Network.TCPSocket | ios | Creates and returns an instance of <Titanium.Network.TCPSocket>. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| change | both | Fired when network connectivity changes. |

### Related Types

#### PushNotificationConfig
> Simple object for specifying push notification options to [registerForPushNotifications](Titanium.Network.registerForPushNotifications).

| Property | Type | Description |
|----------|------|-------------|
| types | Array<Number> | Array of `NOTIFICATION_TYPE` constants that the application would like to recei… |
| success | Callback<PushNotificationSuccessArg> | Callback function called when the push registration is successfully completed. |
| error | Callback<PushNotificationErrorArg> | Callback function called when an error occurs during registration. |
| callback | Callback<PushNotificationData> | Callback function invoked upon receiving a new push notification. |

---

## Ti.Network.BonjourBrowser
> A browser for the discovery and retrieval of Bonjour services available on the network.
> Extends Ti.Proxy
> Platforms: ios

Use the <Titanium.Network.createBonjourBrowser> method to create a `BonjourBrowser` instance.

If your application publishes Bonjour services itself, that service will be discovered 
by the browser if necessary; be prepared to perform a check if you do not want to list 
local services as available.  Bonjour service browsing is an asynchronous operation, 
meaning that you should be extremely careful when caching values from the `services` 
property returned by the `updatedservices` event.  In particular, if you maintain a 
local copy of available services and a user tries to connect to one, you should be prepared 
to handle failures gracefully; the next `updatedservices` event should provide the new 
services list, but you should not rely on it being delivered before user input.  When 
a window which uses Bonjour browsing is closed, if you do not want to continue searching, 
you must call the stop() method.

In iOS 14.0+, to browse services add key `NSLocalNetworkUsageDescription` and `NSBonjourServices` to the `ios plist` section of the tiapp.xml file.


*(See full overview in titanium-docs)*

### Properties (unique: 3/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| domain | String | local. | ios | The domain the browser is searching in |
| isSearching | Boolean | false | ios | Whether or not the browser is currently searching |
| serviceType | String | — | ios | The type of the service the browser searches for |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| search(—) | void | ios | Conduct a search for Bonjour services matching the type and domain specified du… |
| stopSearch(—) | void | ios | Halt an ongoing search |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| updatedservices | ios | Fired when the discovered services list is updated |

---

## Ti.Network.BonjourService
> Describes a service on the network which is published by Bonjour.
> Extends Ti.Proxy
> Platforms: ios

You can obtain a `BonjourService` instance by calling <Titanium.Network.createBonjourService> 
or from the `service` list from a [BonjourBrowser](Titanium.Network.BonjourBrowser)  
`updatedservices` event.   

You can only publish Bonjour services attached to a socket which is currently listening; 
you cannot publish a service for a remotely connected socket.  If you stop the Bonjour 
service and wish to close the socket it uses, it is strongly recommended that you stop 
the service first.  When a window which publishes a Bonjour service is closed, you must 
stop the service if the associated socket is also to be closed, or if it is no longer 
necessary to publish.  Bonjour service resolution and publishing is asynchronous.

In iOS 14.0+, to publish service add key `NSLocalNetworkUsageDescription` and `NSBonjourServices` in tiapp.xml file.

Example:


*(See full overview in titanium-docs)*

### Properties (unique: 5/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| domain | String | — | ios | the domain of the service |
| isLocal | Boolean | true | ios | whether or not the service is local to the device |
| name | String | — | ios | the name of the service |
| socket | Ti.Network.Socket.TCP | — | ios | the TCPSocket object that is used to connect to the service |
| type | String | — | ios | the type of the service |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| publish(socket, callback) | void | ios | Asynchronously publish a Bonjour service to the network. Only works if isLocal … |
| resolve(timeout, callback) | void | ios | Asynchronously resolve a Bonjour service from the network. Must be done before … |
| stop(callback) | void | ios | Asynchronously halts a currently running attempt to publish or resolve a servic… |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| publish | ios | Fired when the service has been published (or errored). |
| resolve | ios | Fired when the service has been resolved (or errored). If successful, the [sock… |
| stop | ios | Fired when a service's publish or resolution was stopped via <Titanium.Network.… |

---

## Ti.Network.Cookie
> Cookie object used to manage the system cookie store and HTTP client cookie store.
> Extends Ti.Proxy
> Platforms: both

Use <Titanium.Network.createCookie> to create a new `Cookie` object.
The following is an example of how to setup and read a cookie on a web view:

``` js
if (!Date.prototype.toISOString) {
  (function() {
    function pad(number) {
      const r = String(number);
      if (r.length === 1) {
        r = '0' + r;
      }
      return r;
    }

    Date.prototype.toISOString = function() {

*(See full overview in titanium-docs)*

### Properties (unique: 11/14)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| comment | String | — | both | The comment describing the purpose of this cookie |
| domain | String | — | both | The domain attribute of the cookie. |
| expiryDate | String | — | ios | The expiration Date of the cookie. |
| maxAge | Number | — | android | Sets the Max-Age attribute of a Cookie, in delta-seconds. |
| httponly | Boolean | false | both | The httponly attribute of the cookie. |
| name | String | — | both | The name of the cookie. |
| originalUrl | String | — | ios | The original URL attribute of the cookie. |
| path | String | — | both | The path attribute of the cookie. |
| secure | Boolean | false | both | The secure attribute of the cookie. |
| value | String | — | both | The value of the cookie. |
| version | Number | — | both | The version of the cookie specification to which this cookie conforms. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isValid(—) | Boolean | both | Returns true if the cookie is valid. |


---

## Ti.Network.HTTPClient
> HTTP client object that (mostly) implements the XMLHttpRequest specification.
> Extends Ti.Proxy
> Platforms: both

Use <Titanium.Network.createHTTPClient> to create a new `HTTPClient` object.

An `HTTPClient` object is intended to be used for a single request. It may be
possible to re-use an `HTTPClient` object, but this use case is not tested.

There are three steps in making a typical HTTP request:

* Creating an `HTTPClient` object.
* Opening the `HTTPClient` object.
* Sending the request.

Before opening the request, you must define one or more callbacks to handle
the HTTP response, as well as errors, progress updates, and other conditions.

The `HTTPClient` callbacks operate somewhat differently from other

*(See full overview in titanium-docs)*

### Properties (unique: 31/39)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allResponseHeaders | String | — | android | All of the response headers. |
| responseHeaders | Dictionary | — | ios | Returns all the response headers returned with the request. |
| autoEncodeUrl | Boolean | true | android | Determines whether automatic encoding is enabled for the specified URL. |
| autoRedirect | Boolean | true | both | Determines whether automatic automatic handling of HTTP redirects is enabled. |
| connected | Boolean | — | both | Indicates whether the response was successful. |
| connectionType | String | — | both | Connection type, normally either `GET`, `POST` or `PATCH`. |
| domain | String | Undefined | both | Sets the domain parameter for authentication credentials. |
| enableKeepAlive | Boolean | false | ios | Determines whether the client should attempt to keep a persistent connection. |
| file | String \| Ti.Filesystem.File | — | both | Target local file or file path to receive data. |
| location | String | — | both | Absolute URL of the request. |
| ondatastream | Callback<Object> | — | both | Function to be called at regular intervals as the request data is being receive… |
| onerror | Callback<FailureResponse> | — | both | Function to be called upon a error response. |
| onload | Callback<SuccessResponse> | — | both | Function to be called upon a successful response. |
| onreadystatechange | Callback<Object> | — | both | Function to be called for each [readyState](Titanium.Network.HTTPClient.readySt… |
| onsendstream | Callback<Object> | — | both | Function to be called at regular intervals as the request data is being transmi… |
| password | String | Undefined | both | Sets the password parameter for authentication credentials. |
| readyState | Number | — | both | The current ready state of this HTTP request. |
| responseData | Ti.Blob | — | both | Response data as a `Blob` object. |
| responseText | String | — | both | Response as text. |
| responseDictionary | String | — | both | Response as JSON object. |
| responseXML | Ti.XML.Document | — | both | Response object as an XML DOM Document object. |
| securityManager | SecurityManagerProtocol | — | both | The Security Manager for this client. |
| status | Number | — | both | Response HTTP status code. |
| statusText | String | — | both | Human-readable status message associated with the status code. |
| timeout | Number | On iOS, the default is 15000 (15 seconds). | both | Timeout in milliseconds when the connection should be aborted. |
| timeoutForResource | Number | The default is `7*24*60*60*1000` milliseconds (7 days). | ios | The maximum amount of time (in milliseconds) that a resource request should be … |
| waitsForConnectivity | Boolean | false | ios | A Boolean value that indicates whether the session should wait for connectivity… |
| username | String | Undefined | both | Sets the username parameter for authentication credentials. |
| validatesSecureCertificate | Boolean | False when running in the simulator or on device in testing mode, and true if built for release in distribution mode. | both | Determines how SSL certification validation is performed on connection. |
| tlsVersion | Number | undefined, behaves as `Ti.Network.TLS_VERSION_1_2`. | android | Sets the TLS version to use for handshakes. |
| cache | Boolean | false | ios | Determines whether HTTP responses are cached. |

### Constants (5)
- **HEADERS_\***: HEADERS_RECEIVED
- **OTHER_\***: DONE, LOADING, OPENED, UNSENT


### Methods (8)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| abort(—) | void | both | Cancels a pending request. |
| clearCookies(host) | void | both | Clears any cookies stored for the host. |
| getAllResponseHeaders(—) | String | both | All of the response headers. |
| getResponseHeader(name) | String | both | Returns the value of the specified response header. |
| open(method, url, async) | void | both | Opens the request and prepares the connection. |
| send(data) | void | both | Sends the request. |
| setRequestHeader(name, value) | void | both | Sets the value for the specified request header. Must be called after `open` bu… |
| setTimeout(timeout) | void | both | Sets the request timeout. |


### Related Types

#### Dictionary
> Plain JavaScript object.

#### SecurityManagerProtocol
> The protocol that the <Titanium.Network.HTTPClient.securityManager> must implement.

---

## Ti.Network.Socket
> Socket module, used for creating sockets.
> Extends Ti.Module
> Platforms: both
> Type: module

### Constants (5)
- **OTHER_\***: INITIALIZED, CONNECTED, LISTENING, CLOSED, ERROR


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createTCP(params) | Ti.Network.Socket.TCP | both | Returns a new TCP socket object. |


---

## Ti.Network.Socket.TCP
> TCP socket that implements the `Titanium.IOStream` interface.
> Extends Ti.IOStream
> Platforms: both

Most socket operations are asynchronous. When you create a socket, you can define
callback functions to receive the results of API calls, as well as to handle incoming
data.

For example, for a client-side socket, you define
[connected](Titanium.Network.Socket.TCP.connected) and
[error](Titanium.Network.Socket.TCP.error) callback functions.

To connect to a remote host, call the socket's
[connect](Titanium.Network.Socket.TCP.connect) method. If the socket connects
successfully, your `connected` callback is invoked, and you can send and receive data
on the socket. If the socket connection fails, your `error` callback is invoked.

After a socket is connected, you can access it like any other <Titanium.IOStream>.
Note that the socket's `read` and `write` methods may block, so in most cases

*(See full overview in titanium-docs)*

### Properties (unique: 9/12)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| host | String | — | both | The host to connect to or listen on. |
| port | Number | — | both | The port to connect to or listen on. |
| secure | Boolean | false | android | Creates a secure socket. |
| listenQueueSize | Number | — | both | Max number of pending incoming connections to be allowed when the socket is in … |
| timeout | Number | — | both | Timeout, in milliseconds, for `connect` and all `write` operations. |
| connected | Callback<ConnectedCallbackArgs> | — | both | Callback to be fired when the socket enters the "connected" state. |
| error | Callback<ErrorCallbackArgs> | — | both | Callback to be fired when the socket enters the [ERROR](Titanium.Network.Socket… |
| accepted | Callback<AcceptedCallbackArgs> | — | both | Callback to be fired when a listener accepts a connection. |
| state | Number | — | both | Current state of the socket. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(—) | void | both | Closes a socket. |
| connect(—) | void | both | Attempts to connect the socket to its host/port. |
| listen(—) | void | both | Attempts to start listening on the socket's host/port. |
| accept(options) | void | both | Tells a [LISTENING](Titanium.Network.Socket.LISTENING) socket to accept a conne… |


### Related Types

#### AcceptDict
> Options object for the [accept](Titanium.Network.Socket.TCP.accept) method.

| Property | Type | Description |
|----------|------|-------------|
| timeout | Number | Timeout, in milliseconds, for all `write` operations. |
| error | Callback<ErrorCallbackArgs> | Callback to be fired when the socket enters the [ERROR](Titanium.Network.Socket… |

---

## Ti.Network.TCPSocket
> The TCPSocket instance returned from <Titanium.Network.createTCPSocket>.  This object represents a socket which either listens locally on the device for connections, or connects to a remote machine.
> Extends Ti.Proxy
> Platforms: ios

Sockets are nontrivial; it is recommended that anyone using them be familiar with the basics of BSD sockets.  All sockets use TCP connections, and are asynchronous for read operations, so your program should be ready to receive 'read' events at any point.  Socket references cannot be transferred to socket objects, and vice-versa - socket references are an internal mechanism which is used only to determine which sockets to send data to and read data from.  For listening sockets, it is highly recommended that you use the <Titanium.Network.INADDR_ANY> constant as the host name.  If a window containing a socket is closed, the socket MUST be closed also unless you intend to continue to receive data, otherwise the socket will consume resources (and potentially cause conflicts with opening the window again, if a listener) until the program is restarted.  Be aware of the differences between the listen() and connect() functions; attempting to use one when you mean the other may result in errors, unpredictable behavior, or both.

### Properties (unique: 5/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| hostName | String | — | ios | the host name to connect to. Must be <Titanium.Network.INADDR_ANY> or an identi… |
| isValid | Boolean | — | ios | whether or not the socket is valid |
| mode | Number | — | ios | the socket's mode |
| port | Number | — | ios | the port to connect/listen on |
| stripTerminator | Boolean | — | ios | strip terminating null character when sending string data; default is false |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(—) | void | ios | close the socket |
| connect(—) | void | ios | connect the socket to a TCP server |
| listen(—) | void | ios | set up the socket to receive connections |
| write(data, sendTo) | void | ios | write data to the socket, if the mode is WRITE_MODE or READ_WRITE_MODE |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| read | ios | new data was read off the socket |
| readError | ios | an error occurred when reading |
| writeError | ios | an error occurred when writing |

---

