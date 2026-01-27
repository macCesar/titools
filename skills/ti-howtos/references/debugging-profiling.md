# Debugging and Profiling

Comprehensive guide for debugging Titanium apps, managing memory, finding leaks, and using native debugging tools.

## Table of Contents

- [Debugging and Profiling](#debugging-and-profiling)
  - [Table of Contents](#table-of-contents)
  - [Debugging Overview](#debugging-overview)
    - [Essential Elements of Debugging](#essential-elements-of-debugging)
    - [Debugging Techniques](#debugging-techniques)
  - [Memory Management](#memory-management)
    - [How JavaScript Manages Memory](#how-javascript-manages-memory)
    - [How Titanium Manages Memory](#how-titanium-manages-memory)
    - [Releasing Memory Properly](#releasing-memory-properly)
    - [Parent-Child Relationships](#parent-child-relationships)
    - [Platform Memory Limits](#platform-memory-limits)
  - [Memory Leak Detection](#memory-leak-detection)
    - [Common Leak Sources](#common-leak-sources)
    - [Debugging Memory on iOS (Instruments)](#debugging-memory-on-ios-instruments)
    - [Debugging Memory on Android (DDMS)](#debugging-memory-on-android-ddms)
  - [Android Debugging Tools](#android-debugging-tools)
    - [DDMS (Dalvik Debug Monitor Service)](#ddms-dalvik-debug-monitor-service)
      - [Log Output with DDMS](#log-output-with-ddms)
      - [Simulate Network Conditions](#simulate-network-conditions)
      - [Simulate Calls/SMS](#simulate-callssms)
      - [Set GPS Coordinates](#set-gps-coordinates)
      - [File System Exploration](#file-system-exploration)
      - [Memory Monitoring](#memory-monitoring)
    - [ADB (Android Debug Bridge)](#adb-android-debug-bridge)
      - [Log Output](#log-output)
      - [File System](#file-system)
      - [Transfer Files](#transfer-files)
      - [Access SQLite Databases](#access-sqlite-databases)
    - [Creating Emulators](#creating-emulators)
    - [Modifying Emulators](#modifying-emulators)
  - [iOS Debugging Tools](#ios-debugging-tools)
    - [Instruments](#instruments)
    - [Xcode Build Debugging](#xcode-build-debugging)
    - [Console Logs](#console-logs)
  - [6. Automation and UI Testing](#6-automation-and-ui-testing)
  - [Best Practices](#best-practices)
    - [Memory Management](#memory-management-1)
    - [Debugging](#debugging)
    - [Performance](#performance)
  - [Platform-Specific Notes](#platform-specific-notes)
    - [Android](#android)
    - [iOS](#ios)
  - [Resources](#resources)

---

## Debugging Overview

### Essential Elements of Debugging

1. **Gather Information** - Clear, accurate description of the problem
2. **Reproduce** - Consistent steps to recreate the issue
3. **Deduce** - Logical reasoning to isolate the cause
4. **Experiment** - Try fixes iteratively, track what works
5. **Be Tenacious** - Methodical persistence wins
6. **Track Work** - Document bugs and solutions

### Debugging Techniques

**1. Print Tracing (Logging)**
```javascript
Ti.API.info(`Variable value: ${myVar}`);
Ti.API.warn('Warning message');
Ti.API.error('Error occurred');
Ti.API.log('info', 'Custom level message');
Ti.API.debug('Debug info');  // Only in dev mode
```

**2. Crash Log Evaluation**
- Build logs (compilation errors)
- Runtime logs (app crashes)
- Simulator/Emulator logs
- Device logs

**3. Interactive Debugging**
- Breakpoints in Studio/IDE
- Variable inspection
- Step-through execution

---

## Memory Management

### How JavaScript Manages Memory

**Garbage Collection:** JavaScript uses automatic "mark and sweep" garbage collection.

1. Interpreter scans memory periodically
2. Marks objects with active references
3. Destroys unmarked objects
4. Frees their memory

**Implication:** Objects with no references are automatically cleaned up.

### How Titanium Manages Memory

Titanium is a **bridge** between JavaScript and native OS:

```javascript
// JavaScript object + Native proxy
const button = Ti.UI.createButton({title: 'Click me'});
```

**Key Rule:** Setting JavaScript object to `null` destroys BOTH the JavaScript object AND the native proxy.

### Releasing Memory Properly

**Complete cleanup:**
```javascript
let view = Ti.UI.createView({backgroundColor: 'white'});
win.add(view);

// Later: remove AND nullify
win.remove(view);
view = null;  // Critical: destroys native proxy
```

**Incomplete cleanup (MEMORY LEAK):**
```javascript
let view = Ti.UI.createView({backgroundColor: 'white'});
win.add(view);

// Later: only remove
win.remove(view);  // view object STILL EXISTS in memory!
```

### Parent-Child Relationships

```javascript
// Good: children not referenced elsewhere
let view = Ti.UI.createView({
    backgroundColor: 'white'
});
view.add(Ti.UI.createButton({title: 'Click'}));  // Anonymous child

win.remove(view);
view = null;  // Destroys view AND button

// Bad: children referenced separately
const button = Ti.UI.createButton({title: 'Click'});
let view = Ti.UI.createView({backgroundColor: 'white'});
view.add(button);

win.remove(view);
view = null;  // Destroys view, BUT button still exists!
button = null;  // Now button is destroyed
```

### Platform Memory Limits

| Platform | Memory Limit                           |
| -------- | -------------------------------------- |
| iPhone   | ~10% of system memory                  |
| iPad     | 30-50 MB (smaller is better)           |
| Android  | 24-32 MB heap (128 MB with large heap) |

**iOS Notes:**
- Apple doesn't publish exact limits
- "Jetsam" process can terminate your app
- "Jetsam" in crash logs = memory issue

---

## Memory Leak Detection

### Common Leak Sources

**1. Global Event Listeners**
```javascript
// LEAK: Listener keeps reference to window
Ti.App.addEventListener('custom:event', (e) => {
    // Uses window variables
});
```

**Fix: Remove listeners when closing window**
```javascript
const myHandler = (e) => {
    // Handle event
};

Ti.App.addEventListener('custom:event', myHandler);

win.addEventListener('close', () => {
    Ti.App.removeEventListener('custom:event', myHandler);
});
```

**2. Objects in Closures**
```javascript
// LEAK: Closure retains object reference
function createWindow() {
    const data = [];  // Large array
    return Ti.UI.createWindow({
        listener: () => {
            data.push('more');  // Closure reference
        }
    });
}
```

**Fix:** Pass data as argument instead of closure reference.

**3. Hidden Views**
```javascript
// LEAK: Hidden view still consumes memory
view.visible = false;  // Not enough!
```

**Fix:** Remove and nullify when not needed
```javascript
view.visible = false;
parent.remove(view);
view = null;
```

### Debugging Memory on iOS (Instruments)

**Setup:**
1. Open app in iOS Simulator
2. Xcode → Open Developer Tool → Instruments
3. Choose **Allocations** template
4. Choose Target → Your App
5. Click Record

**Key Columns:**
| Column                            | What it Shows            |
| --------------------------------- | ------------------------ |
| **Persistent Bytes** (Live Bytes) | Memory currently in use  |
| **#Persistent** (#Living)         | Active object count      |
| **#Transient** (#Transitory)      | Ready to garbage collect |

**Identifying Leaks:**
1. Filter for `Ti` prefix (Titanium objects)
2. Watch **#Living** as you use app
3. If it grows continuously = leak
4. **#Transitory** growing is OK (will be GC'd)

**Example Workflow:**
```
1. Filter: "TiUITableView" (table views)
2. Open/close a table view screen
3. Click "Cause GC" (garbage collection)
4. Check if #Living returns to previous value
5. If not = leak in that screen
```

### Debugging Memory on Android (DDMS)

**Setup:**
1. Add to tiapp.xml:
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

**Monitoring:**
1. Select your app process
2. Click **Update Heap** button
3. Click **Cause GC** to force garbage collection
4. Watch **Allocated** and **# Objects** values

**Identifying Leaks:**
1. Note initial values after GC
2. Exercise app (open/close screens)
3. Click **Cause GC** again
4. If values don't return to baseline = leak

---

## Android Debugging Tools

### DDMS (Dalvik Debug Monitor Service)

**Features:**
- View log output
- Explore file system
- Simulate network conditions
- Simulate calls/SMS
- Set GPS coordinates
- Monitor memory

#### Log Output with DDMS

1. Open DDMS
2. Select device/emulator
3. View log in lower pane
4. Add filter: Log Tag = `TiAPI`

#### Simulate Network Conditions

**Emulator Control** panel:
- Voice/Data state (home, roaming)
- Data speed and latency
- Test app behavior in poor conditions

#### Simulate Calls/SMS

**Emulator Control** → Telephony Actions:
- Incoming voice call
- Incoming SMS message
- Test app interruption handling

#### Set GPS Coordinates

**Emulator Control** → Location Controls:
- Enter latitude/longitude
- Click Send
- Emulator uses these as "current location"

#### File System Exploration

**Device** → File Explorer:
- Browse entire file system
- Pull files (copy to computer)
- Push files (copy to device)
- Delete files

#### Memory Monitoring

Less useful for Titanium (JavaScript runs in one process), but can show overall memory trends.

### ADB (Android Debug Bridge)

#### Log Output

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

#### File System

```bash
# Open shell
adb shell

# List files
ls -la
cd /some/path

# Exit shell
exit
```

#### Transfer Files

```bash
# Copy file TO device
adb push local.txt /sdcard/local.txt

# Copy file FROM device
adb pull /sdcard/remote.txt local.txt
```

#### Access SQLite Databases

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

### Creating Emulators

**Command Line:**
```bash
# List available targets
android list targets

# Create AVD
android create avd -n my_emulator -t 1 -s WVGA800 --abi x86

# Launch emulator
emulator -avd my_emulator
```

**AVD Manager (GUI):**
```bash
android avd
```

1. Click **New**
2. Enter name, select device/target
3. Choose x86 ABI if available
4. Click **OK**

### Modifying Emulators

**Increase disk space:**
Edit `~/.android/avd/<NAME>.avd/config.ini`:
```
disk.dataPartition.size=1024m
```

**Resize emulator:**
1. Close emulator
2. AVD Manager → Select emulator → Edit
3. Change resolution
4. Save

**Scale on-the-fly:**
```bash
# Get emulator port
adb devices
# emulator-5560

# Connect with telnet
telnet localhost 5560

# Scale to 75%
window scale 0.75
```

---

## iOS Debugging Tools

### Instruments

**Common Templates:**
- **Allocations** - Memory usage
- **Leaks** - Detect memory leaks
- **Time Profiler** - CPU usage
- **System Trace** - System-level events

### Xcode Build Debugging

For native debugging, open Xcode project in `build/iphone`:
1. Product → Profile
2. Choose Instruments template
3. More accurate than attaching to running process

### Console Logs

**Viewing in Studio:**
- Console panel shows build/run output

**Viewing separately:**
```bash
# For running apps
tail -f ~/Library/Logs/CoreSimulator/<SIMULATOR_ID>/system.log
```

---

## 6. Automation and UI Testing

For continuous integration (CI/CD) pipelines, automated deployment, and functional testing, see:

- [Automation with Fastlane and Appium](./automation-fastlane-appium.md): Lane configuration, testing with Mocha/WebdriverIO, and store submission.

## Best Practices

### Memory Management

1. **Always nullify objects** after removing from view hierarchy
2. **Remove event listeners** when closing windows
3. **Avoid global variables** - use namespaces/CommonJS
4. **Use single execution context** - not multiple url-based windows
5. **Be careful with closures** - they retain references
6. **Hide vs Remove** - hide for temporary, remove/nullify for permanent

### Debugging

1. **Log strategically** - remove sensitive logs before production
2. **Use descriptive log messages** - include variable values
3. **Test on real devices** - simulators can miss issues
4. **Profile early and often** - don't wait until crash
5. **Reproduce consistently** - can't fix what you can't reproduce
6. **Keep track of bugs** - use issue tracker

### Performance

1. **Avoid excessive polling** - use events when possible
2. **Defer loading** - load data as needed, not all at once
3. **Optimize images** - compress and use appropriate sizes
4. **Minimize bridge crossings** - cache platform checks
5. **Test on slow networks** - simulate poor conditions
6. **Profile before optimizing** - measure first, then fix hotspots

---

## Platform-Specific Notes

### Android

- **debuggable flag** - Required for native debugging
- **Large heap** - Enable in tiapp.xml if needed
- **ProGuard** - Can obfuscate and optimize code
- **Multidex** - May be needed for very large apps

### iOS

- **Instruments** - Most powerful tool for iOS profiling
- **Zombies** - Instruments tool to find over-released objects
- **Allocation tracker** - Shows object creation/lifecycle
- **Time Profiler** - Identifies CPU bottlenecks

---

## Resources

- **Memory Management Lab** - [AppLeak sample project](https://github.com/appcelerator-developer-relations/appc-sample-app-leak)
- **Video:** Your Apps are Leaking (Codestrong 2011)
- **Android DDMS Docs** - https://developer.android.com/studio/profile/am
- **iOS Instruments Guide** - Apple Developer Documentation
