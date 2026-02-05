# Debugging and profiling

Guide to debugging Titanium apps, managing memory, finding leaks, and using native tools.

## Debugging overview

### Essential elements of debugging

1. Gather information: clear, accurate description of the problem
2. Reproduce: consistent steps to recreate the issue
3. Deduce: logical reasoning to isolate the cause
4. Experiment: try fixes iteratively, track what works
5. Be tenacious: methodical persistence wins
6. Track work: document bugs and solutions

### Debugging techniques

1. Print tracing (logging)
```javascript
Ti.API.info(`Variable value: ${myVar}`);
Ti.API.warn('Warning message');
Ti.API.error('Error occurred');
Ti.API.log('info', 'Custom level message');
Ti.API.debug('Debug info'); // Only in dev mode
```

2. Crash log evaluation
- Build logs (compilation errors)
- Runtime logs (app crashes)
- Simulator/Emulator logs
- Device logs

3. Interactive debugging
- Breakpoints in Studio/IDE
- Variable inspection
- Step-through execution

## Memory management

### How JavaScript manages memory

Garbage collection: JavaScript uses automatic mark-and-sweep.

1. Interpreter scans memory periodically
2. Marks objects with active references
3. Destroys unmarked objects
4. Frees their memory

Implication: objects with no references are cleaned up automatically.

### How Titanium manages memory

Titanium bridges JavaScript and native OS objects:

```javascript
// JavaScript object + Native proxy
const button = Ti.UI.createButton({ title: 'Click me' });
```

Key rule: setting a JavaScript object to `null` destroys both the JavaScript object and the native proxy.

### Releasing memory properly

Complete cleanup:
```javascript
let view = Ti.UI.createView({ backgroundColor: 'white' });
win.add(view);

// Later: remove and nullify
win.remove(view);
view = null; // Destroys native proxy
```

Incomplete cleanup (memory leak):
```javascript
let view = Ti.UI.createView({ backgroundColor: 'white' });
win.add(view);

// Later: only remove
win.remove(view); // view object still exists in memory
```

### Parent-child relationships

```javascript
// Good: children not referenced elsewhere
let view = Ti.UI.createView({
  backgroundColor: 'white'
});
view.add(Ti.UI.createButton({ title: 'Click' })); // Anonymous child

win.remove(view);
view = null; // Destroys view and button

// Bad: children referenced separately
const button = Ti.UI.createButton({ title: 'Click' });
let view = Ti.UI.createView({ backgroundColor: 'white' });
view.add(button);

win.remove(view);
view = null; // Destroys view, but button still exists
button = null; // Now button is destroyed
```

### Platform memory limits

| Platform | Memory limit                           |
| -------- | -------------------------------------- |
| iPhone   | ~10% of system memory                  |
| iPad     | 30-50 MB (smaller is better)           |
| Android  | 24-32 MB heap (128 MB with large heap) |

Notes for iOS:
- Apple does not publish exact limits
- The jetsam process can terminate your app
- "Jetsam" in crash logs often means a memory issue

Important: memory is not storage. A 16GB device does not mean 16GB for your app. Limits may be higher on newer devices, but optimize for the lowest common denominator.

## Memory leak detection

### Common leak sources

1. Global event listeners
```javascript
// Leak: listener keeps reference to window
Ti.App.addEventListener('custom:event', (e) => {
  // Uses window variables
});
```

Fix: remove listeners when closing window
```javascript
const myHandler = (e) => {
  // Handle event
};

Ti.App.addEventListener('custom:event', myHandler);

win.addEventListener('close', () => {
  Ti.App.removeEventListener('custom:event', myHandler);
});
```

2. Objects in closures
```javascript
// Leak: closure retains object reference
function createWindow() {
  const data = []; // Large array
  return Ti.UI.createWindow({
    listener: () => {
      data.push('more'); // Closure reference
    }
  });
}
```

Fix: pass data as an argument instead of keeping it in a closure.

3. Hidden views
```javascript
// Leak: hidden view still consumes memory
view.visible = false; // Not enough
```

Fix: remove and nullify when not needed
```javascript
view.visible = false;
parent.remove(view);
view = null;
```

### Debugging memory on iOS (Instruments)

Setup:
1. Open app in iOS Simulator
2. Xcode → Open Developer Tool → Instruments
3. Choose Allocations template
4. Choose Target → Your App
5. Click Record

Key columns:
| Column                            | What it shows           |
| --------------------------------- | ----------------------- |
| Persistent Bytes (Live Bytes)     | Memory currently in use |
| #Persistent (#Living)             | Active object count     |
| #Transient (#Transitory)          | Ready to garbage collect |

Identifying leaks:
1. Filter for `Ti` prefix (Titanium objects)
2. Watch #Living as you use the app
3. If it grows continuously, you have a leak
4. #Transitory growing is fine (will be GC'd)

Example workflow:
```
1. Filter: "TiUITableView" (table views)
2. Open/close a table view screen
3. Click "Cause GC" (garbage collection)
4. Check if #Living returns to previous value
5. If not, the leak is in that screen
```

### Debugging memory on Android (DDMS)

Setup:
1. Add to `tiapp.xml`:
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
        <application android:debuggable="true">
        </application>
    </manifest>
</android>
```

2. Build app for emulator
3. Open DDMS (Android Device Monitor)

Monitoring:
1. Select your app process
2. Click Update Heap
3. Click Cause GC to force garbage collection
4. Watch Allocated and # Objects values

Identifying leaks:
1. Note initial values after GC
2. Exercise app (open/close screens)
3. Click Cause GC again
4. If values do not return to baseline, there is a leak

## Android debugging tools

### DDMS (Dalvik Debug Monitor Service)

Features:
- View log output
- Explore file system
- Simulate network conditions
- Simulate calls/SMS
- Set GPS coordinates
- Monitor memory

#### Log output with DDMS

1. Open DDMS
2. Select device/emulator
3. View log in lower pane
4. Add filter: Log Tag = `TiAPI`

#### Simulate network conditions

Emulator Control panel:
- Voice/Data state (home, roaming)
- Data speed and latency
- Test app behavior in poor conditions

#### Simulate calls/SMS

Emulator Control → Telephony Actions:
- Incoming voice call
- Incoming SMS message
- Test app interruption handling

#### Set GPS coordinates

Emulator Control → Location Controls:
- Enter latitude/longitude
- Click Send
- Emulator uses these as current location

#### File system exploration

Device → File Explorer:
- Browse entire file system
- Pull files (copy to computer)
- Push files (copy to device)
- Delete files

#### Memory monitoring

Less useful for Titanium (JavaScript runs in one process), but it can show overall memory trends.

### ADB (Android Debug Bridge)

#### Log output

```bash
# View all logs
adb logcat

# Device only
adb -d logcat

# Emulator only
adb -e logcat

# Specific device
adb -s emulator-5556 logcat

# Filter for Titanium
adb logcat -s TiAPI
# or
adb logcat | grep TiAPI
```

#### File system

```bash
# Open shell
adb shell

# List files
ls -la
cd /some/path

# Exit shell
exit
```

#### Transfer files

```bash
# Copy file TO device
adb push local.txt /sdcard/local.txt

# Copy file FROM device
adb pull /sdcard/remote.txt local.txt
```

#### Access SQLite databases

```bash
adb shell

# List databases
ls /data/data/com.example.app/databases/

# Open database
sqlite3 /data/data/com.example.app/databases/mydb.sqlite

# Query
SELECT * FROM tablename;

# Exit
.exit
```

### Creating emulators

Command line:
```bash
# List available targets
android list targets

# Create AVD
android create avd -n my_emulator -t 1 -s WVGA800 --abi x86

# Launch emulator
emulator -avd my_emulator
```

AVD Manager (GUI):
```bash
android avd
```

1. Click New
2. Enter name, select device/target
3. Choose x86 ABI if available
4. Click OK

### Modifying emulators

Increase disk space:
Edit `~/.android/avd/<NAME>.avd/config.ini`:
```
disk.dataPartition.size=1024m
```

Resize emulator:
1. Close emulator
2. AVD Manager → Select emulator → Edit
3. Change resolution
4. Save

Scale on-the-fly:
```bash
# Get emulator port
adb devices
# emulator-5560

# Connect with telnet
telnet localhost 5560

# Scale to 75%
window scale 0.75
```

## iOS debugging tools

### Instruments

Key templates for Titanium debugging:
- Allocations: track object creation and live object counts. Look at Persistent Bytes (Live Bytes) and #Persistent (#Living).
- Leaks: detect memory leaks in real time. Shows objects that are allocated but never released.
- Time Profiler: identify CPU-intensive operations and bottlenecks.
- System Trace: system-level events and thread activity.
- Zombies: detect messages sent to deallocated objects (debug builds only). Useful for over-released objects.

### Xcode build debugging

For native debugging, open the Xcode project in `build/iphone`:
1. Product → Profile
2. Choose Instruments template
3. More accurate than attaching to a running process

### Console logs

Viewing in Studio:
- Console panel shows build/run output

Viewing separately:
```bash
# For running apps
tail -f ~/Library/Logs/CoreSimulator/<SIMULATOR_ID>/system.log
```

## 6. Automation and UI testing

For CI/CD pipelines, automated deployment, and functional testing, see:

- Automation with Fastlane and Appium: `automation-fastlane-appium.md`

## Best practices

### Memory management

1. Always nullify objects after removing them from the view hierarchy.
2. Remove event listeners when closing windows.
3. Avoid global variables; use namespaces or CommonJS.
4. Use a single execution context, not multiple URL-based windows.
5. Be careful with closures; they retain references.
6. Hide vs remove: hide for temporary, remove/nullify for permanent.

### Debugging

1. Log strategically and remove sensitive logs before production.
2. Use descriptive log messages and include variable values.
3. Test on real devices; simulators miss issues.
4. Profile early and often; do not wait for crashes.
5. Reproduce consistently; you cannot fix what you cannot reproduce.
6. Keep track of bugs; use an issue tracker.

### Performance

1. Avoid excessive polling; use events when possible.
2. Defer loading; load data as needed.
3. Optimize images; compress and use appropriate sizes.
4. Minimize bridge crossings; cache platform checks.
5. Test on slow networks; simulate poor conditions.
6. Profile before optimizing; measure first, then fix hotspots.

## Platform-specific notes

### Android

- Debuggable flag: required for native debugging
- Large heap: enable in `tiapp.xml` if needed
- ProGuard: can obfuscate and optimize code
- Multidex: may be needed for very large apps

### iOS

- Instruments: most powerful tool for iOS profiling
- Zombies: Instruments tool to find over-released objects
- Allocation tracker: shows object creation and lifecycle
- Time Profiler: identifies CPU bottlenecks

## Resources

- Video: Your Apps are Leaking (Codestrong 2011)
- Android DDMS docs: https://minimum-viable-product.github.io/marshmallow-docs/tools/debugging/ddms.html
- iOS Instruments guide: Apple Developer Documentation
