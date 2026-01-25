# Advanced Database and Image Best Practices

## 1. SQLite Optimization
- **Close Everything**: Always `resultSet.close()` and `db.close()` after each operation to avoid locks and memory bloat.
- **Transactions**: Use `BEGIN` and `COMMIT` for batch inserts. It is significantly faster.
  ```javascript
  db.execute('BEGIN');
  // loop inserts
  db.execute('COMMIT');
  ```
- **Database Skeleton**: Do not ship large pre-populated databases. Ship a "skeleton" and download data on first boot to reduce IPA/APK size.

## 2. Image Memory Management
- **Memory Footprint**: A JPG is tiny on disk but consumes `width * height * 3 bytes` in RAM.
- **Unloading**:
  - `view.remove(imageView)` to help the OS free memory.
  - Set `imageView = null` to release the native proxy.
- **Resizing**: Always resize images to their display dimensions via `imageAsResized` before setting the `image` property.
- **Caching**: iOS caches remote images automatically, but you should manually cache critical assets in `applicationDataDirectory` for predictability.
