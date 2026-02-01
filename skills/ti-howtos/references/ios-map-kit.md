# iOS Map Kit

Guide for implementing native maps on iOS using the `ti.map` module.

## 1. Initial Configuration

### Module Installation
Add the module to your `tiapp.xml`:
```xml
<modules>
    <module platform="iphone">ti.map</module>
</modules>
```

### Location Permissions (Info.plist)
Add the mandatory usage descriptions in `tiapp.xml`:
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

## 2. Using the Map View

### Basic Creation
```javascript
const MapModule = require('ti.map');
const mapView = MapModule.createView({
    mapType: MapModule.NORMAL_TYPE,
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

## 3. 3D Camera (Perspective)

iOS allows tilting and rotating the map programmatically for 3D views.

```javascript
const myCam = MapModule.createCamera({
    altitude: 300, // Meters above ground
    centerCoordinate: { latitude: 48.8582, longitude: 2.2945 },
    heading: -45, // Angle relative to North
    pitch: 60     // Tilt angle downward
});

// Apply camera with animation
mapView.animateCamera({
    camera: myCam,
    curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
    duration: 1000
});

// Additional 3D view properties
mapView.pitchEnabled = true;
mapView.showsBuildings = true; // 3D Buildings
```

## 4. iOS Annotations

### System Buttons and Callouts
iOS allows using native buttons inside the pin's callout (popup window).

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
    canShowCallout: true // Default is true
});

mapView.addAnnotation(bridge);
```

### Center Offset
If using a custom pin image that is not centered:
```javascript
const customPin = MapModule.createAnnotation({
    image: 'flag.png',
    centerOffset: { x: 10, y: -20 } // Visually moves the pin
});
```

## 5. Advanced Routes

### Overlay Levels
Control if the route goes above labels or above roads.
```javascript
const route = MapModule.createRoute({
    points: [...],
    color: 'blue',
    width: 4,
    // OVERLAY_LEVEL_ABOVE_LABELS or OVERLAY_LEVEL_ABOVE_ROADS
    level: MapModule.OVERLAY_LEVEL_ABOVE_LABELS
});
```

## 6. Events
Same as Android, but with specialized `clicksource` for system buttons:
```javascript
mapView.addEventListener('click', (e) => {
    if (e.clicksource === 'leftButton' || e.clicksource === 'rightButton') {
        Ti.API.info('Callout button clicked');
    }
});
```
