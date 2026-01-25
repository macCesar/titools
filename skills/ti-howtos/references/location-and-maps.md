# Location Services and Maps

Comprehensive guide for GPS tracking, geocoding, and native maps on iOS and Android.

## Table of Contents
1. [GPS Position Tracking](#gps-position-tracking)
2. [Geocoding](#geocoding)
3. [Native Maps iOS](#native-maps-ios)
4. [Native Maps Android](#native-maps-android)
5. [Common Map Patterns](#common-map-patterns)

---

## GPS Position Tracking

### Permissions Configuration

**iOS (tiapp.xml):**
```xml
<ios>
    <plist>
        <dict>
            <!-- iOS 8+ -->
            <key>NSLocationWhenInUseUsageDescription</key>
            <string>This app needs your location to...</string>
            <!-- iOS 11+ for "Always" permission -->
            <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
            <string>Background location access for...</string>
        </dict>
    </plist>
</ios>
```

**Android:** Add `Ti.PlayServices` module for FusedLocationProvider (battery-efficient tracking).

### Requesting Permissions

```javascript
// Check if permission already granted
var hasLocationPermission = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE);
if (!hasLocationPermission) {
    Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, function(e) {
        if (e.success) {
            // Permission granted - proceed with location
        } else {
            // Handle denial
        }
    });
}
```

### Accuracy Configuration

**iOS Accuracy Levels:**
- `ACCURACY_BEST` - Highest power (GPS)
- `ACCURACY_NEAREST_TEN_METERS` - Medium-high power
- `ACCURACY_HUNDRED_METERS` - Medium power
- `ACCURACY_KILOMETER` - Low power
- `ACCURACY_THREE_KILOMETERS` - Lowest power (cell/wifi)

**Key Properties:**
```javascript
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10; // meters - only fire if moved X meters
Ti.Geolocation.headingFilter = 5;   // degrees - only fire if heading changed X degrees
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS; // or PROVIDER_NETWORK
```

### Android Configuration Modes

**Simple Mode** (ACCURACY_HIGH/LOW):
```javascript
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
```

**Manual Mode** (fine-grained control):
```javascript
var providerGps = Ti.Geolocation.Android.createLocationProvider({
    name: Ti.Geolocation.PROVIDER_GPS,
    minUpdateDistance: 0.0,
    minUpdateTime: 0
});
Ti.Geolocation.Android.addLocationProvider(providerGps);
Ti.Geolocation.Android.manualMode = true;
```

### One-Time Position

```javascript
if (Ti.Geolocation.locationServicesEnabled) {
    Ti.Geolocation.getCurrentPosition(function(e) {
        if (e.error) {
            Ti.API.error('Error: ' + e.error);
        } else {
            var coords = e.coords;
            // { latitude, longitude, altitude, accuracy, heading, speed, timestamp }
        }
    });
}
```

### Continuous Monitoring

```javascript
Ti.Geolocation.addEventListener('location', function(e) {
    if (e.error) {
        Ti.API.error('Error: ' + e.error);
    } else {
        Ti.API.info(e.coords.latitude + ', ' + e.coords.longitude);
    }
});
```

### Lifecycle Management (Critical for Battery)

**Android Activity Events:**
```javascript
var locationAdded = false;
var handleLocation = function(e) {
    if (!e.error) {
        Ti.API.info(e.coords);
    }
};

var addHandler = function() {
    if (!locationAdded) {
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
    }
};

var removeHandler = function() {
    if (locationAdded) {
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
    }
};

// Add listeners
addHandler();

var activity = Ti.Android.currentActivity;
activity.addEventListener('destroy', removeHandler);
activity.addEventListener('pause', removeHandler);   // Stop when in background
activity.addEventListener('resume', addHandler);     // Resume when foreground
```

### Compass/Heading

```javascript
// One-time heading
Ti.Geolocation.getCurrentHeading(function(e) {
    Ti.API.info(e.heading.magneticHeading); // degrees from magnetic north
    Ti.API.info(e.heading.trueHeading);     // degrees from true north
});

// Continuous heading monitoring
Ti.Geolocation.addEventListener('heading', function(e) {
    if (!e.error) {
        Ti.API.info('Heading: ' + e.heading.magneticHeading);
    }
});
```

---

## Geocoding

### Forward Geocoding (Address → Coordinates)

```javascript
Ti.Geolocation.forwardGeocoder('440 Bernardo Ave Mountain View CA', function(e) {
    if (e.success) {
        Ti.API.info('Lat: ' + e.latitude + ', Lon: ' + e.longitude);
    }
});
```

### Reverse Geocoding (Coordinates → Places)

```javascript
Ti.Geolocation.reverseGeocoder(37.389569, -122.050212, function(e) {
    if (e.success) {
        e.places.forEach(function(place) {
            Ti.API.info(place.address);   // Full address
            Ti.API.info(place.city);      // City name
            Ti.API.info(place.country);   // Country
            Ti.API.info(place.zipcode);   // Postal code
        });
    }
});
```

---

## Native Maps iOS

### Setup

**tiapp.xml:**
```xml
<modules>
    <module>ti.map</module>
</modules>
```

**JavaScript:**
```javascript
var MapModule = require('ti.map');
```

### Basic Map View

```javascript
var mapview = MapModule.createView({
    mapType: MapModule.NORMAL_TYPE,      // or HYBRID_TYPE, SATELLITE_TYPE
    region: {
        latitude: 37.389569,
        longitude: -122.050212,
        latitudeDelta: 0.1,   // Zoom level (smaller = closer)
        longitudeDelta: 0.1
    },
    animate: true,
    userLocation: false,  // Show user's current location
    camera: cameraObj     // 3D perspective (optional)
});
```

### Annotations

```javascript
var annotation = MapModule.createAnnotation({
    latitude: 37.389569,
    longitude: -122.050212,
    title: 'Appcelerator HQ',
    subtitle: 'Mountain View, CA',
    pincolor: MapModule.ANNOTATION_RED,  // or ANNOTATION_GREEN, ANNOTATION_PURPLE
    animate: true,
    draggable: true,
    // Custom image instead of pin
    image: 'custom_pin.png',
    // iOS-specific: buttons in callout
    rightButton: Ti.UI.iOS.SystemButton.CONTACT_ADD,
    leftButton: Ti.UI.iOS.SystemButton.INFO_DARK,
    // Center offset for custom views
    centerOffset: { x: 0, y: 0 }
});

var mapview = MapModule.createView({
    region: { /* ... */ },
    annotations: [annotation]
});
```

### Routes

```javascript
var route = MapModule.createRoute({
    width: 4,
    color: '#f00',
    level: MapModule.OVERLAY_LEVEL_ABOVE_ROADS,  // or OVERLAY_LEVEL_ABOVE_LABELS
    points: [
        { latitude: 37.422502, longitude: -122.0855498 },
        { latitude: 37.389569, longitude: -122.050212 },
        { latitude: 37.331689, longitude: -122.030731 }
    ]
});

mapview.addRoute(route);
```

### 3D Camera (iOS only)

```javascript
var camera = MapModule.createCamera({
    altitude: 300,           // Meters above ground
    centerCoordinate: {
        latitude: 48.8582,
        longitude: 2.2945
    },
    heading: -45,            // Degrees from north (0=N, 90=E, -45=NE)
    pitch: 60                // Tilt angle (0=flat, higher=more tilt)
});

// Apply without animation
mapview.camera = camera;

// Or animate the change
mapview.animateCamera({
    camera: camera,
    curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
    duration: 500
});
```

### Map View Events

```javascript
mapview.addEventListener('click', function(e) {
    // e.clicksource: 'pin', 'title', 'subtitle', 'leftButton', 'rightButton'
    // e.annotation: the clicked annotation
    if (e.clicksource === 'rightButton') {
        // Handle right button click
    }
});

mapview.addEventListener('regionchanged', function(e) {
    // Fires when user pans or zooms
    Ti.API.info('New region: ' + e.latitude + ', ' + e.longitude);
});

mapview.addEventListener('complete', function(e) {
    // Map finished rendering
});

mapview.addEventListener('pinchangedragstate', function(e) {
    // e.newState: ANNOTATION_DRAG_STATE_START or END
    // Only fires if annotation.draggable = true
});
```

---

## Native Maps Android

### Setup

**1. Install Google Play Services SDK** via Android SDK Manager (Extras folder).

**2. Get Google Maps API Key:**
```bash
# Debug certificate SHA-1
keytool -list -v -keystore ~/Library/Application\ Support/platform/mobilesdk/osx/7.2.0.GA/android/dev_keystore
```

**3. Add API Key to tiapp.xml:**
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
        <application>
            <meta-data
                android:name="com.google.android.maps.v2.API_KEY"
                android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
        </application>
    </manifest>
</android>
```

**4. Add module:**
```xml
<modules>
    <module platform="android">ti.map</module>
</modules>
```

### Basic Map View

```javascript
var MapModule = require('ti.map');

var mapview = MapModule.createView({
    mapType: MapModule.NORMAL_TYPE,    // or TERRAIN_TYPE, SATELLITE_TYPE, HYBRID_TYPE
    region: { /* same as iOS */ },
    traffic: true,  // Show traffic conditions (Android only)
    animate: true
});
```

### Annotations (Android)

```javascript
var annotation = MapModule.createAnnotation({
    latitude: 37.389569,
    longitude: -122.050212,
    title: 'Title',
    subtitle: 'Subtitle',
    pincolor: MapModule.ANNOTATION_RED,
    // More colors available: AZURE, BLUE, CYAN, GREEN, MAGENTA, ORANGE, RED, ROSE, VIOLET, YELLOW
    customView: Ti.UI.createLabel({ text: 'Custom', backgroundColor: 'blue' }),  // Custom view instead of pin
    draggable: true,
    leftView: Ti.UI.createButton({ title: 'Detail' }),  // View in left pane of info window
    leftButton: 'icon.png'  // Image in left pane (takes precedence over leftView)
});
```

### Routes (Android)

Same as iOS but `level` property is not supported.

### Check Google Play Services

```javascript
var MapModule = require('ti.map');
var rc = MapModule.isGooglePlayServicesAvailable();
switch (rc) {
    case MapModule.SUCCESS:
        // OK to use maps
        break;
    case MapModule.SERVICE_MISSING:
    case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
    case MapModule.SERVICE_DISABLED:
        alert('Google Play services issue: ' + rc);
        break;
}
```

### Android Map Events

Same as iOS with additional `clicksource` values: `leftPane`, `rightPane` (not leftButton/rightButton).

---

## Common Map Patterns

### Add Annotation After Map Creation

```javascript
mapview.addAnnotation(annotation);
```

### Remove Annotation

```javascript
mapview.removeAnnotation(annotation);
```

### Remove All Annotations

```javascript
mapview.removeAllAnnotations();
```

### Select Annotation Programmatically

```javascript
mapview.selectAnnotation(annotation);
```

### Deselect Annotation

```javascript
mapview.deselectAnnotation(annotation);
```

### Set Region with Animation

```javascript
mapview.setLocation({
    latitude: 37.389569,
    longitude: -122.050212,
    animate: true
});

// Or for region
mapview.setRegion({
    latitude: 37.389569,
    longitude: -122.050212,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
    animate: true
});
```

### Zoom to Annotations

```javascript
mapview.showAnnotations([annotation1, annotation2], true);  // true = animate
```

### Best Practices

1. **Battery Life**: Always remove location listeners when not needed. Use `distanceFilter` to reduce updates.
2. **Accuracy**: Use the lowest accuracy that meets your needs.
3. **Permissions**: Check permissions before requesting location. Handle denial gracefully.
4. **Maps on Android**: Only one map view per application (legacy). Use ti.map module for multiple views.
5. **API Keys**: Google Maps API key required for Android (both debug and production).
6. **User Location**: Requires location permissions (`NSLocationWhenInUseUsageDescription` for iOS).
