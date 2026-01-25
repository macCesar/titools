# Local Data Sources

## 1. Filesystem Access and Storage

### Modules Overview
- `Ti.Filesystem` - Top-level module for file/directory operations
- `Ti.Filesystem.File` - File object with read/write methods
- `Ti.Filesystem.FileStream` - Stream wrapper implementing Ti.IOStream interface

### Storage Locations

| Location | Read/Write | Persistence | Notes |
|----------|------------|-------------|-------|
| `applicationDataDirectory` | R/W | Until uninstall | Primary app data location |
| `resourcesDirectory` | R-only | Until uninstall | App resources (R/W in simulator only!) |
| `tempDirectory` | R/W | Until app closes | OS may delete anytime |
| `applicationCacheDirectory` | R/W | OS may clean | For cached data |
| `externalCacheDirectory` | R/W | OS may clean | Android SD card cache |
| `externalStorageDirectory` | R/W | Until uninstall | Android SD card storage |

**Always check** `Ti.Filesystem.isExternalStoragePresent()` before using external storage on Android.

### File Operations

#### Getting a File Handle
```javascript
var f = Ti.Filesystem.getFile(
  Ti.Filesystem.applicationDataDirectory,
  'myfile.txt'
);
```

#### Writing Files
```javascript
f.write('Content here');  // Overwrites or creates
```

#### Reading Files
```javascript
var contents = f.read();  // Returns Blob
Ti.API.info(contents.text);  // Text content
Ti.API.info(contents.mimeType);  // MIME type
```

#### Appending
```javascript
f.append('More content\n');  // String, Blob, or File
```

#### Creating/Copying
```javascript
// Auto-creates on write, but explicit option exists:
if (!f.exists()) {
  f.createFile();
}

// Android copy method:
var oldFile = Ti.Filesystem.getFile(applicationDataDirectory, 'old.txt');
oldFile.copy(applicationDataDirectory + 'new.txt');

// iOS (no copy method):
var newFile = Ti.Filesystem.getFile(applicationDataDirectory, 'new.txt');
newFile.write(oldFile.read());
```

#### Renaming
**Important**: File handle still points to old name after rename!

```javascript
var f = Ti.Filesystem.getFile(applicationDataDirectory, 'old.txt');
f.rename('new.txt');
// f still references 'old.txt' (now non-existent)
var newf = Ti.Filesystem.getFile(applicationDataDirectory, 'new.txt');
```

#### Deleting
```javascript
if (f.exists() && f.writable) {
  var success = f.deleteFile();  // Returns Boolean, no error thrown
}
```

### Directory Operations

```javascript
// Create directory
var dir = Ti.Filesystem.getFile(applicationDataDirectory, 'mysubdir');
dir.createDirectory();

// List contents
var listing = dir.getDirectoryListing();

// Move file into directory
var file = Ti.Filesystem.getFile(applicationDataDirectory, 'file.txt');
file.move('mysubdir/file.txt');

// Delete directory (must be empty or force recursive)
dir.deleteDirectory(false);  // Fails if not empty
dir.deleteDirectory(true);   // Recursive delete
```

### Case Sensitivity Warning
Android and Mobile Web use case-sensitive filesystems. File names referenced in code must match actual file names exactly. Recommendation: **lowercase all file names**.

## 2. SQLite Database

### Opening Databases

```javascript
// Install (copies from Resources if first time)
var db = Ti.Database.install('mydb.sqlite', 'myInstalledDB');

// Or open existing database in applicationDataDirectory
var db = Ti.Database.open('myDatabase');

// For app data directory location:
var dbFile = Ti.Filesystem.getFile(
  Ti.Filesystem.applicationDataDirectory,
  'mydb.sqlite'
);
var db = Ti.Database.open(dbFile.nativePath);
```

### Querying Data

```javascript
var rows = db.execute('SELECT * FROM users WHERE age > ?', [18]);

while (rows.isValidRow()) {
  Ti.API.info(rows.fieldByName('name'));
  Ti.API.info(rows.field(0));  // First column by index
  rows.next();
}

// **CRITICAL**: Always close result set
rows.close();
```

### Parameterized Queries
Always use parameters to prevent SQL injection:

```javascript
// SAFE - parameterized
db.execute('INSERT INTO users (name, age) VALUES (?, ?)', ['John', 25]);

// UNSAFE - never do this
db.execute("INSERT INTO users (name, age) VALUES ('" + name + "', " + age + ")");
```

### Data Modification

```javascript
// INSERT
db.execute('INSERT INTO users (name, age) VALUES (?, ?)', ['Jane', 30]);
var lastId = db.lastInsertRowId;  // Get inserted ID

// UPDATE
db.execute('UPDATE users SET age = ? WHERE name = ?', [31, 'Jane']);
var rowsAffected = db.rowsAffected;

// DELETE
db.execute('DELETE FROM users WHERE age < ?', [18]);
```

### **CRITICAL**: Always Close Connections

```javascript
try {
  // Database operations
} finally {
  // Always close, even on error
  if (rows) rows.close();
  if (db) db.close();
}
```

## 3. Properties API (Ti.App.Properties)

### Overview
Lightweight key-value storage for simple data types. Loaded into memory at launch for fast access.

**Warning**: No hard limit, but all properties load into memory - avoid storing large data.

### Data Type Methods

| Type | Get Method | Set Method |
|------|------------|------------|
| String | `getString(name, default)` | `setString(name, value)` |
| Int | `getInt(name, default)` | `setInt(name, value)` |
| Double | `getDouble(name, default)` | `setDouble(name, value)` |
| Bool | `getBool(name, default)` | `setBool(name, value)` |
| List | `getList(name, default)` | `setList(name, value)` |

### Usage Examples

```javascript
// Set values
Ti.App.Properties.setString('username', 'john');
Ti.App.Properties.setInt('loginCount', 5);
Ti.App.Properties.setBool('isLoggedIn', true);
Ti.App.Properties.setDouble('price', 19.99);
Ti.App.Properties.setList('favorites', ['item1', 'item2']);

// Get values (with defaults)
var username = Ti.App.Properties.getString('username', 'guest');
var count = Ti.App.Properties.getInt('loginCount', 0);

// Check if property exists
if (Ti.App.Properties.hasProperty('username')) {
  // ...
}

// Remove property
Ti.App.Properties.removeProperty('username');

// List all properties
var allProps = Ti.App.Properties.listProperties();
```

### Storing Complex Objects as JSON

```javascript
// Store object as JSON string
var data = { city: 'Mountain View', temp: 72 };
Ti.App.Properties.setString('weatherData', JSON.stringify(data));

// Retrieve and parse
var stored = Ti.App.Properties.getString('weatherData', '{}');
var weather = JSON.parse(stored);
Ti.API.info(weather.city);  // 'Mountain View'
```

### Platform Storage
- **iOS**: `NSUserDefaults` in `.plist` file
- **Android**: XML file at `/data/data/com.domain.app/shared_prefs/titanium.xml`

## 4. Streams API

### Overview
Streams provide efficient sequential access to data without loading entirely into memory.

### Creating Streams

```javascript
// File stream for reading
var file = Ti.Filesystem.getFile(applicationDataDirectory, 'large.dat');
var stream = Ti.Stream.createStream({
  source: file,
  mode: Ti.Stream.MODE_READ
});

// Buffer for reading chunks
var buffer = Ti.createBuffer({ length: 1024 });
```

### Reading Streams

```javascript
var bytesRead = stream.read(buffer);
while (bytesRead > 0) {
  Ti.API.info('Read ' + bytesRead + ' bytes');
  // Process buffer.contents
  buffer.clear();  // Clear for next read
  bytesRead = stream.read(buffer);
}
stream.close();
```

### Writing Streams

```javascript
var writeStream = Ti.Stream.createStream({
  source: outputFile,
  mode: Ti.Stream.MODE_WRITE
});

var dataBuffer = Ti.createBuffer({ value: 'Hello, World!' });
var bytesWritten = writeStream.write(dataBuffer);
writeStream.close();
```

### Stream Piping
Efficiently copy between streams:

```javascript
// Pipe from input to output stream
Ti.Stream.pump(inputStream, outputStream, 1024, function(e) {
  if (e.bytesProcessed === -1) {
    Ti.API.error('Stream pump error');
  } else if (e.bytesProcessed === 0) {
    Ti.API.info('Stream complete');
  } else {
    Ti.API.info('Pumped ' + e.bytesProcessed + ' bytes');
  }
});
```

## 5. Choosing a Persistence Strategy

### Decision Guide

| Scenario | Recommended Approach |
|----------|---------------------|
| User settings/preferences | `Ti.App.Properties` |
| Small config data (< 100KB) | `Ti.App.Properties` with JSON |
| Structured relational data | SQLite |
| Large binary data (images, videos) | Filesystem |
| Downloaded content cache | Filesystem (`applicationCacheDirectory`) |
| Temporary processing data | Filesystem (`tempDirectory`) |
| User-generated files | Filesystem (`applicationDataDirectory`) |
| Offline-first app data | SQLite + Filesystem combo |

### Best Practices

1. **Properties API**: Use only for small, frequently-accessed config data
2. **SQLite**: Always close connections and result sets; use parameterized queries
3. **Filesystem**: Check external storage availability on Android; handle case sensitivity
4. **Streams**: Use for large file operations to avoid memory issues
5. **Hybrid Approach**: Store metadata in SQLite, file paths in records, actual files on filesystem
6. **Cleanup**: Implement cleanup for temp files and cache; don't let them accumulate
