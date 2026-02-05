# Advanced database and image best practices

## 1. SQLite optimization

- Close result sets and the database after each operation to avoid locks and memory growth. SQLite allows one writer at a time, and leaving a connection open after `INSERT` or `UPDATE` can trigger `DatabaseObjectNotClosed` on the next write.
- Use transactions for batch inserts. If any statement fails, SQLite rolls back the entire batch.
  ```javascript
  const db = Ti.Database.open('myDatabase');
  db.execute('BEGIN');
  for (const item of playlist) {
    db.execute('INSERT INTO albums (disc, artist, rating) VALUES (?, ?, ?)', item.disc, item.artist, item.rating);
  }
  db.execute('COMMIT');
  db.close();
  ```
- Do not ship large pre-populated databases. Ship a small skeleton and download data on first boot to reduce IPA/APK size. The `Resources` directory is read-only, so installing a database copies it to `applicationDataDirectory`, which creates two copies on the device.
  - Android note: in Android 2.2 and earlier, the installer could not uncompress assets over 1 MB. One workaround was to rename the file with a `.mp3` extension to prevent `aapt` compression.

### Database version management

Store a version number in your database so you can detect upgrades and run migrations. If you do not have a version table, use `PRAGMA TABLE_INFO` to detect column presence:

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

## 2. Image format selection

Choose the right format for each use case:

| Format | Compression | Best for | Avoid for |
| --- | --- | --- | --- |
| PNG | Lossless | Icons, text, line art, buttons | Photos (large files) |
| JPG | Lossy | Photographs | Text, icons, line drawings (artifacts) |
| GIF | Lossless (256 colors) | Rare cases | Most cases (limited colors, animated GIF not supported everywhere) |

For flip-book animations, use `ImageView.images` with an array of PNG or optimized JPG files instead of animated GIFs.

---

## 3. Image memory management

- A JPG is small on disk but expands to `width * height * 3 bytes` in RAM. Each pixel uses 24 bits (8 bits per R/G/B channel).
  - Example: `(640 × 480 × 3) / 1024 = 900 KB` in memory for a single image
  - Device RAM available to your app can be as low as 12 MB, shared with your code and the Titanium framework
- Unloading:
  - `view.remove(imageView)` removes it from the view hierarchy and lets the OS free memory
  - `imageView = null` releases the native proxy object
- Resizing: resize images to their display dimensions using `imageAsResized` or `imageAsCropped` (both on `Ti.Blob`) before setting the `image` property. Do not display a 1024×768 image on a 640×480 screen.
- Placeholder: set `defaultImage` on ImageView to show a local placeholder while a remote image downloads:
  ```javascript
  const imageView = Ti.UI.createImageView({
    image: 'https://example.com/photo.jpg',
    defaultImage: '/images/placeholder.png',
    width: 300,
    height: 200
  });
  ```

---

## 4. Image optimization tools

Resize and compress images before including them in your app to reduce IPA/APK size and network usage.

| Platform | File types | Tool |
| --- | --- | --- |
| Mac | PNG, JPG, GIF | ImageOptim |
| Mac, Windows, Linux | PNG, JPG, GIF | ImageMagick |
| Windows/DOS | PNG | PNGCrush |
| Windows | JPG | Nikkho |

---

## 5. Caching remote images

Remote images are cached automatically on iOS, Android, and Windows.

Platform differences:
- Android: cache limited to 25 MB, persists for the lifetime of the app (while installed)
- iOS: cache size not fixed, cleared by iOS when the device needs storage

To manually clean the cache, delete files in `applicationCacheDirectory`.

Android 6+ requirement: call `Ti.Filesystem.requestStoragePermissions()` before loading remote images.

### Manual caching utility

For critical assets, cache manually in `applicationDataDirectory` for more predictable behavior:

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
