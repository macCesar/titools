# Buffer, Codec, and Streams

Guide for advanced binary data manipulation and data flows in Titanium SDK.

## Table of Contents

- [Buffer, Codec, and Streams](#buffer-codec-and-streams)
  - [Table of Contents](#table-of-contents)
  - [1. Titanium.Buffer](#1-titaniumbuffer)
    - [Creating Buffers](#creating-buffers)
    - [Common Operations](#common-operations)
  - [2. Titanium.Codec](#2-titaniumcodec)
    - [Encoding Numbers](#encoding-numbers)
    - [Decoding Strings](#decoding-strings)
  - [3. Streams](#3-streams)
    - [Stream Types](#stream-types)
    - [Example: BufferStream](#example-bufferstream)
    - [Example: FileStream (Chunk-based reading)](#example-filestream-chunk-based-reading)
    - [Example: BlobStream (Camera to File)](#example-blobstream-camera-to-file)
  - [4. Best Practices](#4-best-practices)

---

## 1. Titanium.Buffer

Buffers are mutable and resizable containers for bytes (byte arrays).

### Creating Buffers
```javascript
// Empty 512-byte buffer
const buffer1 = Ti.createBuffer({ length: 512 });

// Buffer initialized with a string (UTF-8 by default)
const buffer2 = Ti.createBuffer({ value: "Hello World" });
```

### Common Operations
```javascript
const b1 = Ti.createBuffer({ value: "Part 1. " });
const b2 = Ti.createBuffer({ value: "Part 2." });

// Append
b1.append(b2);

// Truncate
b1.length = 10;

// Direct access (array-like)
b1[0] = 72; // 'H' character in ASCII

// Free memory
b1.release();
```

## 2. Titanium.Codec

The Codec module allows encoding and decoding primitive data (numbers and strings) to/from buffers.

### Encoding Numbers
```javascript
const buffer = Ti.createBuffer({ length: 8 });
Ti.Codec.encodeNumber({
    source: 12345,
    dest: buffer,
    type: Ti.Codec.TYPE_INT,
    byteOrder: Ti.Codec.BIG_ENDIAN
});
```

### Decoding Strings
```javascript
const text = Ti.Codec.decodeString({
    source: buffer,
    charset: Ti.Codec.CHARSET_UTF8
});
```

## 3. Streams

Streams allow reading and writing data in a serialized and memory-efficient way.

### Stream Types
1. **BufferStream**: For reading/writing in memory buffers.
2. **FileStream**: For file operations (more efficient than `file.read()`).
3. **BlobStream**: Read-only for Blob objects (images, camera).

### Example: BufferStream
```javascript
const buffer = Ti.createBuffer({ length: 1024 });
const stream = Ti.Stream.createStream({
    source: buffer,
    mode: Ti.Stream.MODE_WRITE
});

stream.write(Ti.createBuffer({ value: "Stream data" }));
stream.close();
```

### Example: FileStream (Chunk-based reading)
```javascript
const file = Ti.Filesystem.getFile('large_file.txt');
const instream = file.open(Ti.Filesystem.MODE_READ);
const buffer = Ti.createBuffer({ length: 1024 }); // 1KB chunks

let bytesRead = 0;
while ((bytesRead = instream.read(buffer)) > 0) {
    Ti.API.info(`Read ${bytesRead} bytes`);
    // Process buffer...
}
instream.close();
```

### Example: BlobStream (Camera to File)
```javascript
Ti.Media.showCamera({
    success: (e) => {
        const instream = Ti.Stream.createStream({
            source: e.media,
            mode: Ti.Stream.MODE_READ
        });
        
        const outfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'photo.jpg');
        const outstream = outfile.open(Ti.Filesystem.MODE_WRITE);
        
        const buffer = Ti.createBuffer({ length: 4096 });
        let readBytes = 0;
        while ((readBytes = instream.read(buffer)) > 0) {
            outstream.write(buffer, 0, readBytes);
        }
        
        instream.close();
        outstream.close();
    }
});
```

## 4. Best Practices
- **Always close streams**: Avoid memory leaks and file locks by calling `.close()`.
- **Use chunks**: For large files or networking, read in small blocks (e.g., 1KB or 4KB) to avoid saturating RAM.
- **Buffers vs Blobs**: Buffers are mutable; Blobs are immutable. Convert a Blob to a Buffer if you need to modify bytes.
