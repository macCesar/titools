# Location services and maps

## 1. GPS position tracking

### FusedLocationProvider (Android)
Since TiSDK 7.1.0, Titanium supports `FusedLocationProvider` for significant battery savings.
Requirement: include the `ti.playservices` module in your project.

### Accuracy configuration

iOS accuracy levels:
- `ACCURACY_BEST` - highest power (GPS)
- `ACCURACY_NEAREST_TEN_METERS` - medium-high power
- `ACCURACY_HUNDRED_METERS` - medium power
- `ACCURACY_KILOMETER` - low power
- `ACCURACY_THREE_KILOMETERS` - lowest power (cell/wifi)

Key properties:
```javascript
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10; // meters - only fire if moved X meters
Ti.Geolocation.headingFilter = 5; // degrees - only fire if heading changed X degrees
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS; // or PROVIDER_NETWORK
```

Note: on many Android devices, a low-precision passive location provider is always enabled, even when the user disables GPS and Network providers. `Ti.Geolocation.locationServicesEnabled` may always return `true` on those devices.

### Android configuration modes

Simple mode (ACCURACY_HIGH/LOW):
```javascript
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
```

Manual mode (fine-grained control):
```javascript
const providerGps = Ti.Geolocation.Android.createLocationProvider({
  name: Ti.Geolocation.PROVIDER_GPS,
  minUpdateDistance: 0.0,
  minUpdateTime: 0
});
Ti.Geolocation.Android.addLocationProvider(providerGps);
Ti.Geolocation.Android.manualMode = true;
```

### Location permissions

```javascript
// Check permissions
if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)) {
  startTracking();
} else {
  Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, (e) => {
    if (e.success) {
      startTracking();
    } else {
      Ti.API.error(`Permission denied: ${e.error}`);
    }
  });
}
```

iOS plist keys (tiapp.xml):
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby places</string>
<!-- For background location: -->
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need background location for navigation</string>
```

Note (iOS 11+): you must include `NSLocationAlwaysAndWhenInUseUsageDescription` even when requesting "Always" permission. Users can still choose "When in Use".

### One-time position

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

### Continuous monitoring

```javascript
Ti.Geolocation.addEventListener('location', (e) => {
  if (e.error) {
    Ti.API.error(`Error: ${e.error}`);
  } else {
    Ti.API.info(`${e.coords.latitude}, ${e.coords.longitude}`);
  }
});
```

### Lifecycle management (critical for battery)

Android Activity events:
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
activity.addEventListener('pause', removeHandler); // Stop when in background
activity.addEventListener('resume', addHandler); // Resume when foreground
```

### Compass/heading

```javascript
// One-time heading
Ti.Geolocation.getCurrentHeading((e) => {
  Ti.API.info(e.heading.magneticHeading); // degrees from magnetic north
  Ti.API.info(e.heading.trueHeading); // degrees from true north
});

// Continuous heading monitoring
Ti.Geolocation.addEventListener('heading', (e) => {
  if (!e.error) {
    Ti.API.info(`Heading: ${e.heading.magneticHeading}`);
  }
});
```

The heading event object includes:
- `heading.magneticHeading` - degrees relative to magnetic north
- `heading.trueHeading` - degrees relative to true north (requires location)
- `heading.accuracy` - deviation in degrees (lower is better)
- `heading.x`, `heading.y`, `heading.z` - raw magnetometer data (microteslas)

## Geocoding

### Forward geocoding (address → coordinates)

```javascript
Ti.Geolocation.forwardGeocoder('440 Bernardo Ave Mountain View CA', (e) => {
  if (e.success) {
    Ti.API.info(`Lat: ${e.latitude}, Lon: ${e.longitude}`);
  }
});
```

With error handling:
```javascript
Ti.Geolocation.forwardGeocoder('1600 Amphitheatre Pkwy, Mountain View, CA', (e) => {
  if (!e.success || e.error) {
    Ti.API.error(`Geocoding failed: ${e.error}`);
    return;
  }
  Ti.API.info(`Lat: ${e.latitude}, Lng: ${e.longitude}`);
});
```

### Reverse geocoding (coordinates → places)

```javascript
Ti.Geolocation.reverseGeocoder(37.389569, -122.050212, (e) => {
  if (e.success) {
    e.places.forEach((place) => {
      Ti.API.info(place.address); // Full address
      Ti.API.info(place.city); // City name
      Ti.API.info(place.country); // Country
      Ti.API.info(place.zipcode); // Postal code
    });
  }
});
```

## 2. Native maps (platform-specific details)

Due to the complexity of modern native maps, refer to the detailed guides:

- Google Maps v2 for Android: `google-maps-v2.md`
- iOS Map Kit: `ios-map-kit.md`

## Common map patterns

### Add annotation after map creation

```javascript
mapview.addAnnotation(annotation);
```

### Remove annotation

```javascript
mapview.removeAnnotation(annotation);
```

### Remove all annotations

```javascript
mapview.removeAllAnnotations();
```

### Select annotation programmatically

```javascript
mapview.selectAnnotation(annotation);
```

### Deselect annotation

```javascript
mapview.deselectAnnotation(annotation);
```

### Set region with animation

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

### Zoom to annotations

```javascript
mapview.showAnnotations([annotation1, annotation2], true); // true = animate
```

### Best practices

1. Battery life: remove location listeners when not needed. Use `distanceFilter` to reduce updates.
2. Accuracy: use the lowest accuracy that meets your needs.
3. Permissions: check permissions before requesting location. Handle denial gracefully.
4. Maps on Android: only one map view per application (legacy). Use `ti.map` for multiple views.
5. API keys: Google Maps API key required for Android (debug and production).
6. User location: requires location permissions (`NSLocationWhenInUseUsageDescription` for iOS).
