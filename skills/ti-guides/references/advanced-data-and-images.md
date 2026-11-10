# Working with data


Titanium gives you three places to keep data on the device, and the whole
decision is how much of it there is and what shape it has.

| Store | For | Survives an uninstall |
| ----- | --- | --------------------- |
| `Ti.App.Properties` | Settings and small values | No |
| `Ti.Filesystem` | Files, downloads, generated content | No |
| `Ti.Database` | Rows you query | No |

None of them survive an uninstall. Anything that must is on a server, and
[networking](https://titaniumsdk.com/docs/build/data/networking) is how it gets there.

## Properties

Key-value storage for small things: the last tab, whether the user has
seen the tour. It is backed by `NSUserDefaults` on iOS and `SharedPreferences`
on Android, and it is read synchronously.

```js
Ti.App.Properties.setString('lastTab', 'inbox');
Ti.App.Properties.setBool('seenTour', true);

const tab = Ti.App.Properties.getString('lastTab', 'inbox');
const seen = Ti.App.Properties.getBool('seenTour', false);
```

Every getter takes a default as its second argument. Use it rather than
checking `hasProperty` first, which is a second lookup for the same answer.

There is a setter and getter per type - `setString`, `setInt`, `setBool`,
`setDouble`, `setList`, `setObject` - and reading with the wrong one does not
convert. Store with `setInt` and read with `getString` and you get the default
back.

`setObject` and `setList` serialise to JSON, so they are for a handful of
values, not a collection you keep adding to.

> [!WARNING]
> Properties are not secure storage. They are plain preferences, readable on a
> rooted or jailbroken device and included in an unencrypted device backup. A
> token you would mind losing belongs in the keychain or keystore, which is a
> native module rather than a core API.

## Files

`Ti.Filesystem` addresses directories by purpose, and the purpose decides
whether the operating system may delete what you put there.

| Directory | Use for | Backed up |
| --------- | ------- | --------- |
| `applicationDataDirectory` | Content the app created and needs | Yes |
| `applicationCacheDirectory` | Anything re-downloadable | No, and may be purged |
| `tempDirectory` | Working files for right now | No |
| `resourcesDirectory` | What you shipped. **Read-only** | n/a |

```js
const file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'notes.txt');
file.write('written on ' + new Date().toISOString());

if (file.exists()) {
  Ti.API.info(file.read().text);
}
```

`getFile` takes path segments and joins them, so pass the directory and the
name rather than concatenating with a separator yourself.

Putting a cache in `applicationDataDirectory` is the common mistake: it is
backed up, so a 200MB image cache goes into the user's iCloud backup.

## A database

`Ti.Database` is SQLite. Open a database by name and it is created on first
use.

```js
const db = Ti.Database.open('notes');

db.execute(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    body TEXT NOT NULL,
    created TEXT NOT NULL
  )
`);

db.execute('INSERT INTO notes (body, created) VALUES (?, ?)', 'First note', new Date().toISOString());
Ti.API.info(`inserted row ${db.lastInsertRowId}`);

const rows = db.execute('SELECT id, body FROM notes ORDER BY id DESC');
while (rows.isValidRow()) {
  Ti.API.info(`${rows.fieldByName('id')}: ${rows.fieldByName('body')}`);
  rows.next();
}
rows.close();
db.close();
```

**Pass values as arguments, never by building the SQL string.** The `?`
placeholders are escaped for you; string concatenation is how an apostrophe in
a note becomes a syntax error and how a hostile value becomes an injection.

A result set is a cursor, not an array: walk it with `isValidRow()` and
`next()`, and close it. Close the database when you are done with it.

`executeAsync` and `executeAllAsync` run off the main thread and take a
callback. Use them for anything large enough to be noticeable, which on a
phone is sooner than you would guess.

### Shipping a prepared database

`Ti.Database.install` copies a `.sqlite` file out of your resources on first
run and opens it, so an app can ship with data already in it.

```js
const db = Ti.Database.install('/data/seed.sqlite', 'notes');
```

The copy happens once. Changing the shipped file in a later release does not
replace a database the user already has, so version your schema and migrate.

## Next

[Networking and remote data](https://titaniumsdk.com/docs/build/data/networking) is the other half:
getting data in and out over HTTP.

## Close resources on failures

The cursor and database cleanup in the straight-line example must also run when query execution or processing throws. Put cursor cleanup in `finally`, then close the database. `executeAsync` and `executeAllAsync` also return Promises on SDK 10+; await completion before closing handles, and close every returned cursor, including partial results reported by a failed batch.

```javascript
async function readNotes() {
  const db = Ti.Database.open('notes');
  let rows;
  try {
    rows = await db.executeAsync('SELECT id, body FROM notes ORDER BY id DESC');
    while (rows.isValidRow()) {
      Ti.API.info(rows.fieldByName('body'));
      rows.next();
    }
  } finally {
    if (rows) {
      rows.close();
    }
    db.close();
  }
}
```
