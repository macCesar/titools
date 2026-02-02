# Advanced Database and Image Best Practices

## 1. SQLite Optimization

- **Close Everything**: Always `resultSet.close()` and `db.close()` after each operation to avoid locks and memory bloat. SQLite enforces sequential write-access — if you don't close after `INSERT` or `UPDATE`, you may receive **DatabaseObjectNotClosed** exceptions on the next write attempt.
- **Transactions**: Use `BEGIN` and `COMMIT` for batch inserts. It is significantly faster. Note: if any update within the transaction fails, the **entire batch is rolled back** (atomicity).
  ```javascript
  const db = Ti.Database.open('myDatabase');
  db.execute('BEGIN');
  for (const item of playlist) {
    db.execute('INSERT INTO albums (disc, artist, rating) VALUES (?, ?, ?)', item.disc, item.artist, item.rating);
  }
  db.execute('COMMIT');
  db.close();
  ```
- **Database Skeleton**: Do not ship large pre-populated databases. Ship a "skeleton" and download data on first boot to reduce IPA/APK size. The `Resources` directory is read-only, so installing a database copies it to `applicationDataDirectory`, resulting in two copies on the device.
  - **Android note**: In Android 2.2 and earlier, the installer could not uncompress assets over 1 MB. Workaround: rename the file with a `.mp3` extension to prevent `aapt` compression.

### Database Version Management

Store a version number in your database to detect which version is installed and take action (create tables, alter columns) on upgrades. If you lack a version table, use `PRAGMA TABLE_INFO` to detect column presence:

```javascript
const addColumn = (dbname, tblName, newFieldName, colSpec) => {
  const db = Ti.Database.open(dbname);
  let fieldExists = false;
  const resultSet = db.execute(`PRAGMA TABLE_INFO(${tblName})`);
  while (resultSet.isValidRow()) {
    if (resultSet.field(1) === newFieldName) {
      fieldExists = true;
    }
    resultSet.next();
  }
  resultSet.close();
  if (!fieldExists) {
    db.execute(`ALTER TABLE ${tblName} ADD COLUMN ${newFieldName} ${colSpec}`);
  }
  db.close();
};
```

---

## 2. Image Format Selection

Choose the right format for each use case:

| Format | Compression | Best For | Avoid For |
| ------ | ----------- | -------- | --------- |
| **PNG** | Lossless | Icons, text, line-art, buttons | Photos (file size) |
| **JPG** | Lossy | Photographs | Text, icons, line drawings (artifacts) |
| **GIF** | Lossless (256 colors) | Rarely appropriate | Almost everything — limited colors, proprietary, animated GIF not supported on all platforms |

**For flip-book animations**: Use `ImageView.images` property with an array of PNG or optimized JPG files instead of animated GIFs.

---

## 3. Image Memory Management

- **Memory Footprint**: A JPG is small on disk but consumes `width * height * 3 bytes` in RAM when decompressed. Each pixel uses 24 bits (8 bits per R/G/B channel).
  - Example: `(640 × 480 × 3) / 1024 = 900 KB` in memory for a single image
  - Device RAM available to your app can be as low as 12 MB, shared with your code and the Titanium framework
- **Unloading**:
  - `view.remove(imageView)` — removes from view hierarchy, helps OS free memory
  - `imageView = null` — releases the native proxy object
- **Resizing**: Always resize images to their display dimensions via `imageAsResized` or `imageAsCropped` (both on `Ti.Blob`) before setting the `image` property. Don't display a 1024×768 image on a 640×480 screen.
- **Placeholder**: Set the `defaultImage` property on ImageView to show a local placeholder while a remote image downloads:
  ```javascript
  const imageView = Ti.UI.createImageView({
    image: 'https://example.com/photo.jpg',
    defaultImage: '/images/placeholder.png',
    width: 300,
    height: 200
  });
  ```

---

## 4. Image Optimization Tools

Resize and compress images before including them in your app to minimize IPA/APK size and network usage.

| Platform | File Types | Tool |
| -------- | ---------- | ---- |
| Mac | PNG, JPG, GIF | ImageOptim |
| Mac, Windows, Linux | PNG, JPG, GIF | ImageMagick |
| Windows/DOS | PNG | PNGCrush |
| Windows | JPG | Nikkho |

---

## 5. Caching Remote Images

Remote images are cached automatically on iOS, Android, and Windows.

**Platform differences:**
- **Android**: Cache limited to **25 MB**, persists for the lifetime of the app (while installed)
- **iOS**: Cache size not predetermined (no guaranteed size), cleared by iOS when device needs storage

To manually clean the cache, delete files in `applicationCacheDirectory`.

**Android 6+ requirement**: Call `Ti.Filesystem.requestStoragePermissions()` before loading remote images (runtime permissions).

### Manual Caching Utility

For critical assets, cache manually in `applicationDataDirectory` for predictability:

```javascript
const CacheUtils = {
  getExtension: (fn) => {
    const match = /(?:\.([^.]+))?$/.exec(fn);
    return match[1] || '';
  },

  createCachedImageView: (options) => {
    const md5 = Ti.Utils.md5HexDigest(options.image) + CacheUtils.getExtension(options.image);
    const savedFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, md5);

    if (savedFile.exists()) {
      options.image = savedFile;
      return Ti.UI.createImageView(options);
    }

    const imageView = Ti.UI.createImageView(options);
    const saveImage = () => {
      imageView.removeEventListener('load', saveImage);
      savedFile.write(
        Ti.UI.createImageView({ image: imageView.image, width: Ti.UI.FILL, height: Ti.UI.FILL }).toImage()
      );
    };
    imageView.addEventListener('load', saveImage);
    return imageView;
  }
};
```
