# Buffer, Codec, and streams

Guide to binary data manipulation and data flows in Titanium SDK.

## 1. Titanium.Buffer

Buffers are mutable, resizable containers for bytes (byte arrays).

### Creating buffers
```javascript
// Empty buffer (initial length 0)
const buffer0 = Ti.createBuffer();

// Empty 512-byte buffer
const buffer1 = Ti.createBuffer({ length: 512 });

// Buffer initialized with a string (UTF-8 by default)
const buffer2 = Ti.createBuffer({ value: 'Hello World' });

// Buffer initialized with explicit charset
const buffer3 = Ti.createBuffer({ value: 'Hello World', type: Ti.Codec.CHARSET_UTF16 });
```

### Common operations
```javascript
const b1 = Ti.createBuffer({ value: 'Part 1. ' });
const b2 = Ti.createBuffer({ value: 'Part 2.' });

// Append (resizes b1)
b1.append(b2);

// Insert at position (resizes buffer as needed)
const extra = Ti.createBuffer({ value: 'X' });
b1.insert(extra, 1); // insert extra at index 1

// Truncate
b1.length = 10;

// Direct array access — buffer is NOT auto-extended; values must be byte values
b1[0] = 72; // 'H' (ASCII). b1[100] = 1 would throw if index >= b1.length

// Free memory
b1.release();
```

## 2. Titanium.Codec

The Codec module encodes and decodes primitive data (numbers and strings) to and from buffers.

### Encoding numbers
```javascript
const buffer = Ti.createBuffer({ length: 8 });
Ti.Codec.encodeNumber({
  source: 12345,
  dest: buffer,
  type: Ti.Codec.TYPE_INT,
  byteOrder: Ti.Codec.BIG_ENDIAN
});
```

### Encoding strings
```javascript
// Encode a string into a buffer; returns the byte length written
const buffer = Ti.createBuffer({ length: 1024 });
const encodedLength = Ti.Codec.encodeString({
  source: 'hello world',
  dest: buffer
});
// Trim buffer to actual content
buffer.length = encodedLength;
```

### Decoding strings
```javascript
const text = Ti.Codec.decodeString({
  source: buffer,
  charset: Ti.Codec.CHARSET_UTF8
});
```

### Supported types and charsets

Numeric types: `TYPE_BYTE`, `TYPE_SHORT`, `TYPE_INT`, `TYPE_LONG`, `TYPE_FLOAT`, `TYPE_DOUBLE`

String charsets: `CHARSET_UTF8`, `CHARSET_UTF16`, `CHARSET_UTF16BE`, `CHARSET_UTF16LE`, `CHARSET_ISO_LATIN1`

### Position parameter
The `position` parameter controls where encoding or decoding starts in the buffer:
```javascript
Ti.Codec.encodeNumber({
  source: 42,
  dest: buffer,
  position: 4, // start writing at byte 4
  type: Ti.Codec.TYPE_INT
});
```

## 3. Streams

Streams let you read and write data in a serialized, memory-efficient way.

### Stream types
1. BufferStream: for reading and writing in-memory buffers
2. FileStream: for file operations (more efficient than `file.read()`)
3. BlobStream: read-only for Blob objects (images, camera)

Stream modes: `Ti.Filesystem.MODE_READ`, `Ti.Filesystem.MODE_WRITE`, `Ti.Filesystem.MODE_APPEND`

### Example: BufferStream
```javascript
const buffer = Ti.createBuffer({ length: 1024 });
const stream = Ti.Stream.createStream({
  source: buffer,
  mode: Ti.Stream.MODE_WRITE
});

stream.write(Ti.createBuffer({ value: 'Stream data' }));
stream.close();
```

### Example: FileStream (chunk-based reading)
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

### Example: BlobStream (camera to file)
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

## 4. Best practices
- Always close streams to avoid memory leaks and file locks.
- Use chunks for large files or networking (for example, 1KB or 4KB) to avoid saturating RAM.
- Buffers vs Blobs: Buffers are mutable; Blobs are immutable. Convert a Blob to a Buffer if you need to modify bytes.
