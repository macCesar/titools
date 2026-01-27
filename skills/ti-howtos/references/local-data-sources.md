# Local Data Sources

## Table of Contents

- [Local Data Sources](#local-data-sources)
  - [Table of Contents](#table-of-contents)
  - [1. Filesystem Access and Storage](#1-filesystem-access-and-storage)
    - [Modules Overview](#modules-overview)
    - [Storage Locations](#storage-locations)
    - [File Operations](#file-operations)
      - [Getting a File Handle](#getting-a-file-handle)
      - [Writing Files](#writing-files)
      - [Reading Files](#reading-files)
      - [Appending](#appending)
      - [Creating/Copying](#creatingcopying)
      - [Renaming](#renaming)
      - [Deleting](#deleting)
    - [Directory Operations](#directory-operations)
    - [Case Sensitivity Warning](#case-sensitivity-warning)
  - [2. SQLite Database](#2-sqlite-database)
    - [Opening Databases](#opening-databases)
    - [Querying Data](#querying-data)
    - [Parameterized Queries](#parameterized-queries)
    - [Data Modification](#data-modification)
    - [**CRITICAL**: Always Close Connections](#critical-always-close-connections)
  - [3. Properties API (Ti.App.Properties)](#3-properties-api-tiappproperties)
    - [Overview](#overview)
    - [Data Type Methods](#data-type-methods)
    - [Usage Examples](#usage-examples)
    - [Storing Complex Objects as JSON](#storing-complex-objects-as-json)
    - [Platform Storage](#platform-storage)
  - [4. Advanced Data Manipulation (Buffer, Codec, and Streams)](#4-advanced-data-manipulation-buffer-codec-and-streams)
  - [5. Choosing a Persistence Strategy](#5-choosing-a-persistence-strategy)
    - [Decision Guide](#decision-guide)
    - [Best Practices](#best-practices)

---

## 1. Filesystem Access and Storage

### Modules Overview
- `Ti.Filesystem` - Top-level module for file/directory operations
- `Ti.Filesystem.File` - File object with read/write methods
- `Ti.Filesystem.FileStream` - Stream wrapper implementing Ti.IOStream interface

### Storage Locations

| Location                    | Read/Write | Persistence      | Notes                                  |
| --------------------------- | ---------- | ---------------- | -------------------------------------- |
| `applicationDataDirectory`  | R/W        | Until uninstall  | Primary app data location              |
| `resourcesDirectory`        | R-only     | Until uninstall  | App resources (R/W in simulator only!) |
| `tempDirectory`             | R/W        | Until app closes | OS may delete anytime                  |
| `applicationCacheDirectory` | R/W        | OS may clean     | For cached data                        |
| `externalCacheDirectory`    | R/W        | OS may clean     | Android SD card cache                  |
| `externalStorageDirectory`  | R/W        | Until uninstall  | Android SD card storage                |

**Always check** `Ti.Filesystem.isExternalStoragePresent()` before using external storage on Android.

### File Operations

#### Getting a File Handle
```javascript
const f = Ti.Filesystem.getFile(
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
const contents = f.read();  // Returns Blob
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
const oldFile = Ti.Filesystem.getFile(applicationDataDirectory, 'old.txt');
oldFile.copy(`${applicationDataDirectory}new.txt`);

// iOS (no copy method):
const newFile = Ti.Filesystem.getFile(applicationDataDirectory, 'new.txt');
newFile.write(oldFile.read());
```

#### Renaming
**Important**: File handle still points to old name after rename!

```javascript
const f = Ti.Filesystem.getFile(applicationDataDirectory, 'old.txt');
f.rename('new.txt');
// f still references 'old.txt' (now non-existent)
const newf = Ti.Filesystem.getFile(applicationDataDirectory, 'new.txt');
```

#### Deleting
```javascript
if (f.exists() && f.writable) {
  const success = f.deleteFile();  // Returns Boolean, no error thrown
}
```

### Directory Operations

```javascript
// Create directory
const dir = Ti.Filesystem.getFile(applicationDataDirectory, 'mysubdir');
dir.createDirectory();

// List contents
const listing = dir.getDirectoryListing();

// Move file into directory
const file = Ti.Filesystem.getFile(applicationDataDirectory, 'file.txt');
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
const db = Ti.Database.install('mydb.sqlite', 'myInstalledDB');

// Or open existing database in applicationDataDirectory
const db = Ti.Database.open('myDatabase');

// For app data directory location:
const dbFile = Ti.Filesystem.getFile(
  Ti.Filesystem.applicationDataDirectory,
  'mydb.sqlite'
);
const db = Ti.Database.open(dbFile.nativePath);
```

### Querying Data

```javascript
const rows = db.execute('SELECT * FROM users WHERE age > ?', [18]);

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
db.execute(`INSERT INTO users (name, age) VALUES ('${name}', ${age})`);
```

### Data Modification

```javascript
// INSERT
db.execute('INSERT INTO users (name, age) VALUES (?, ?)', ['Jane', 30]);
const lastId = db.lastInsertRowId;  // Get inserted ID

// UPDATE
db.execute('UPDATE users SET age = ? WHERE name = ?', [31, 'Jane']);
const rowsAffected = db.rowsAffected;

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

| Type   | Get Method                 | Set Method               |
| ------ | -------------------------- | ------------------------ |
| String | `getString(name, default)` | `setString(name, value)` |
| Int    | `getInt(name, default)`    | `setInt(name, value)`    |
| Double | `getDouble(name, default)` | `setDouble(name, value)` |
| Bool   | `getBool(name, default)`   | `setBool(name, value)`   |
| List   | `getList(name, default)`   | `setList(name, value)`   |

### Usage Examples

```javascript
// Set values
Ti.App.Properties.setString('username', 'john');
Ti.App.Properties.setInt('loginCount', 5);
Ti.App.Properties.setBool('isLoggedIn', true);
Ti.App.Properties.setDouble('price', 19.99);
Ti.App.Properties.setList('favorites', ['item1', 'item2']);

// Get values (with defaults)
const username = Ti.App.Properties.getString('username', 'guest');
const count = Ti.App.Properties.getInt('loginCount', 0);

// Check if property exists
if (Ti.App.Properties.hasProperty('username')) {
  // ...
}

// Remove property
Ti.App.Properties.removeProperty('username');

// List all properties
const allProps = Ti.App.Properties.listProperties();
```

### Storing Complex Objects as JSON

```javascript
// Store object as JSON string
const data = { city: 'Mountain View', temp: 72 };
Ti.App.Properties.setString('weatherData', JSON.stringify(data));

// Retrieve and parse
const stored = Ti.App.Properties.getString('weatherData', '{}');
const weather = JSON.parse(stored);
Ti.API.info(weather.city);  // 'Mountain View'
```

### Platform Storage
- **iOS**: `NSUserDefaults` in `.plist` file
- **Android**: XML file at `/data/data/com.domain.app/shared_prefs/titanium.xml`

## 4. Advanced Data Manipulation (Buffer, Codec, and Streams)

For binary data handling, character encoding, and large file streams, refer to the detailed guide:

- [Buffer, Codec, and Streams](./buffer-codec-streams.md): Using `Ti.Buffer`, `Ti.Codec` for numbers/strings, and efficient chunk-based reading.

## 5. Choosing a Persistence Strategy

### Decision Guide

| Scenario                           | Recommended Approach                     |
| ---------------------------------- | ---------------------------------------- |
| User settings/preferences          | `Ti.App.Properties`                      |
| Small config data (< 100KB)        | `Ti.App.Properties` with JSON            |
| Structured relational data         | SQLite                                   |
| Large binary data (images, videos) | Filesystem                               |
| Downloaded content cache           | Filesystem (`applicationCacheDirectory`) |
| Temporary processing data          | Filesystem (`tempDirectory`)             |
| User-generated files               | Filesystem (`applicationDataDirectory`)  |
| Offline-first app data             | SQLite + Filesystem combo                |

### Best Practices

1. **Properties API**: Use only for small, frequently-accessed config data
2. **SQLite**: Always close connections and result sets; use parameterized queries
3. **Filesystem**: Check external storage availability on Android; handle case sensitivity
4. **Streams**: Use for large file operations to avoid memory issues
5. **Hybrid Approach**: Store metadata in SQLite, file paths in records, actual files on filesystem
6. **Cleanup**: Implement cleanup for temp files and cache; don't let them accumulate
