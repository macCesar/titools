# iOS Map Kit

Guide to implementing native maps on iOS with the `ti.map` module.

## 1. Initial configuration

### Module installation
Add the module to `tiapp.xml`:

```xml
<modules>
    <module platform="iphone">ti.map</module>
</modules>
```

### Location permissions (Info.plist)
Add the required usage descriptions in `tiapp.xml`:

```xml
<ios>
    <plist>
        <dict>
            <key>NSLocationWhenInUseUsageDescription</key>
            <string>We need your location to show it on the map.</string>
            <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
            <string>We need continuous location access for navigation.</string>
        </dict>
    </plist>
</ios>
```

iOS 11+: include both `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription`. Users can still choose "When in Use" even if you request "Always".

## 2. Using the map view

### Basic creation
```javascript
const MapModule = require('ti.map');
const mapView = MapModule.createView({
  mapType: MapModule.NORMAL_TYPE, // Also: SATELLITE_TYPE, HYBRID_TYPE, STANDARD_TYPE (alias for NORMAL_TYPE with labels)
  userLocation: true,
  rotatesEnabled: true, // Allow two-finger rotation
  region: {
    latitude: 48.8582,
    longitude: 2.2945,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  }
});
```

## 3. 3D camera (perspective)

iOS lets you tilt and rotate the map for 3D views.

Important: the map must be visible on screen before using camera APIs. Wait for the `complete` event before calling `animateCamera()` or setting camera properties.

```javascript
const myCam = MapModule.createCamera({
  altitude: 300, // meters above ground
  centerCoordinate: { latitude: 48.8582, longitude: 2.2945 },
  heading: -45, // angle relative to North
  pitch: 60 // tilt angle downward
});

// Apply camera with animation
mapView.animateCamera({
  camera: myCam,
  curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
  duration: 1000
});

// Additional 3D view properties
mapView.pitchEnabled = true;
mapView.showsBuildings = true; // 3D buildings
```

## 4. iOS annotations

### System buttons and callouts
iOS allows native buttons in the pin callout (popup window).

```javascript
const bridge = MapModule.createAnnotation({
  latitude: -33.8522,
  longitude: 151.2105,
  title: 'Harbour Bridge',
  subtitle: 'Port Jackson',
  pincolor: MapModule.ANNOTATION_PURPLE,
  // iOS system buttons in the callout
  leftButton: Ti.UI.iOS.SystemButton.INFO_DARK,
  rightButton: Ti.UI.iOS.SystemButton.CONTACT_ADD,
  canShowCallout: true // Controls whether tapping the annotation shows the callout bubble (default: true)
});

mapView.addAnnotation(bridge);
```

### Center offset
If you use a custom pin image that is not centered:

```javascript
const customPin = MapModule.createAnnotation({
  image: 'flag.png',
  centerOffset: { x: 10, y: -20 } // Visually moves the pin
});
```

## 5. Advanced routes

### Overlay levels
Control whether the route appears above labels or above roads.

```javascript
const route = MapModule.createRoute({
  points: routePoints,
  color: '#00f',
  width: 4,
  level: MapModule.OVERLAY_LEVEL_ABOVE_LABELS // default
  // or MapModule.OVERLAY_LEVEL_ABOVE_ROADS (below labels)
});
```

## 6. Events

Key map events: `click`, `complete` (map loaded), `regionchanged`, `pinchangedragstate`.

Same as Android, but with specialized `clicksource` values for system buttons:

```javascript
mapView.addEventListener('click', (e) => {
  if (e.clicksource === 'leftButton' || e.clicksource === 'rightButton') {
    Ti.API.info('Callout button clicked');
  }
});

mapView.addEventListener('pinchangedragstate', (e) => {
  if (e.annotation.dragState === MapModule.ANNOTATION_DRAG_STATE_END) {
    Ti.API.info(`Dropped at: ${e.annotation.latitude}, ${e.annotation.longitude}`);
  }
});
```
