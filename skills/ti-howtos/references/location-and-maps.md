# Location Services and Maps

## Table of Contents

- [Location Services and Maps](#location-services-and-maps)
  - [Table of Contents](#table-of-contents)
  - [1. GPS Position Tracking](#1-gps-position-tracking)
    - [FusedLocationProvider (Android)](#fusedlocationprovider-android)
    - [Accuracy Configuration](#accuracy-configuration)
    - [Android Configuration Modes](#android-configuration-modes)
    - [One-Time Position](#one-time-position)
    - [Continuous Monitoring](#continuous-monitoring)
    - [Lifecycle Management (Critical for Battery)](#lifecycle-management-critical-for-battery)
    - [Compass/Heading](#compassheading)
  - [Geocoding](#geocoding)
    - [Forward Geocoding (Address → Coordinates)](#forward-geocoding-address--coordinates)
    - [Reverse Geocoding (Coordinates → Places)](#reverse-geocoding-coordinates--places)
  - [2. Native Maps (Platform-Specific Details)](#2-native-maps-platform-specific-details)
  - [Common Map Patterns](#common-map-patterns)
    - [Add Annotation After Map Creation](#add-annotation-after-map-creation)
    - [Remove Annotation](#remove-annotation)
    - [Remove All Annotations](#remove-all-annotations)
    - [Select Annotation Programmatically](#select-annotation-programmatically)
    - [Deselect Annotation](#deselect-annotation)
    - [Set Region with Animation](#set-region-with-animation)
    - [Zoom to Annotations](#zoom-to-annotations)
    - [Best Practices](#best-practices)

---

## 1. GPS Position Tracking

### FusedLocationProvider (Android)
Since TiSDK 7.1.0, Titanium supports `FusedLocationProvider` for significant battery savings.
**Requirement**: Include the `ti.playservices` module in your project.

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
const providerGps = Ti.Geolocation.Android.createLocationProvider({
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
    Ti.Geolocation.getCurrentPosition((e) => {
        if (e.error) {
            Ti.API.error(`Error: ${e.error}`);
        } else {
            const coords = e.coords;
            // { latitude, longitude, altitude, accuracy, heading, speed, timestamp }
        }
    });
}
```

### Continuous Monitoring

```javascript
Ti.Geolocation.addEventListener('location', (e) => {
    if (e.error) {
        Ti.API.error(`Error: ${e.error}`);
    } else {
        Ti.API.info(`${e.coords.latitude}, ${e.coords.longitude}`);
    }
});
```

### Lifecycle Management (Critical for Battery)

**Android Activity Events:**
```javascript
let locationAdded = false;
const handleLocation = (e) => {
    if (!e.error) {
        Ti.API.info(e.coords);
    }
};

function addHandler() {
    if (!locationAdded) {
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
    }
}

function removeHandler() {
    if (locationAdded) {
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
    }
}

// Add listeners
addHandler();

const activity = Ti.Android.currentActivity;
activity.addEventListener('destroy', removeHandler);
activity.addEventListener('pause', removeHandler);   // Stop when in background
activity.addEventListener('resume', addHandler);     // Resume when foreground
```

### Compass/Heading

```javascript
// One-time heading
Ti.Geolocation.getCurrentHeading((e) => {
    Ti.API.info(e.heading.magneticHeading); // degrees from magnetic north
    Ti.API.info(e.heading.trueHeading);     // degrees from true north
});

// Continuous heading monitoring
Ti.Geolocation.addEventListener('heading', (e) => {
    if (!e.error) {
        Ti.API.info(`Heading: ${e.heading.magneticHeading}`);
    }
});
```

---

## Geocoding

### Forward Geocoding (Address → Coordinates)

```javascript
Ti.Geolocation.forwardGeocoder('440 Bernardo Ave Mountain View CA', (e) => {
    if (e.success) {
        Ti.API.info(`Lat: ${e.latitude}, Lon: ${e.longitude}`);
    }
});
```

### Reverse Geocoding (Coordinates → Places)

```javascript
Ti.Geolocation.reverseGeocoder(37.389569, -122.050212, (e) => {
    if (e.success) {
        e.places.forEach((place) => {
            Ti.API.info(place.address);   // Full address
            Ti.API.info(place.city);      // City name
            Ti.API.info(place.country);   // Country
            Ti.API.info(place.zipcode);   // Postal code
        });
    }
});
```

## 2. Native Maps (Platform-Specific Details)

Due to the complexity of modern native maps, refer to the detailed guides:

- [Google Maps v2 for Android](./google-maps-v2.md): API Keys configuration, Google Play Services, and advanced controls.
- [iOS Map Kit](./ios-map-kit.md): 3D Camera, system buttons, and Info.plist configuration.

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
