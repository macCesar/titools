# Google Maps v2 for Android

Guide for implementing native maps on Android using the `ti.map` module (v2).

## 1. Initial Configuration

### Module Installation
Add the module to your `tiapp.xml`:
```xml
<modules>
    <module platform="android">ti.map</module>
</modules>
```

### Obtaining an API Key (Google Cloud Console)
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable "Maps SDK for Android".
3. Generate an API Key. You will need the **Application ID** from your `tiapp.xml` and the **SHA-1 fingerprint** from your keystore.

#### Get SHA-1 (Debug)
```bash
keytool -list -v -keystore ~/Library/Application\ Support/titanium/mobilesdk/osx/<VERSION>/android/dev_keystore
```
*Default password: <empty> (press Enter)*

### Configure tiapp.xml
Add the API Key in the Android section:
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
        <application>
            <meta-data android:name="com.google.android.maps.v2.API_KEY" android:value="YOUR_API_KEY_HERE"/>
        </application>
    </manifest>
</android>
```

## 2. Google Play Services Verification

It is mandatory to verify availability before rendering the map:

```javascript
const MapModule = require('ti.map');
const rc = MapModule.isGooglePlayServicesAvailable();

switch (rc) {
    case MapModule.SUCCESS:
        Ti.API.info('Google Play Services available');
        break;
    case MapModule.SERVICE_MISSING:
        Ti.API.error('Google Play Services is missing');
        break;
    case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
        Ti.API.error('Google Play Services needs update');
        break;
    case MapModule.SERVICE_DISABLED:
        Ti.API.error('Google Play Services is disabled');
        break;
    case MapModule.SERVICE_INVALID:
        Ti.API.error('Google Play Services is invalid');
        break;
}
```

## 3. Using the Map View

### Basic Creation
```javascript
const MapModule = require('ti.map');
const mapView = MapModule.createView({
    mapType: MapModule.NORMAL_TYPE,
    userLocation: true,
    traffic: true, // Show real-time traffic
    animate: true,
    region: {
        latitude: -33.87365,
        longitude: 151.20689,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
    }
});
```

### Map Types
- `MapModule.NORMAL_TYPE`: Standard map.
- `MapModule.SATELLITE_TYPE`: Satellite imagery.
- `MapModule.TERRAIN_TYPE`: Terrain map.
- `MapModule.HYBRID_TYPE`: Satellite with labels.

## 4. Advanced Annotations (Pins)

```javascript
const opera = MapModule.createAnnotation({
    latitude: -33.8569,
    longitude: 151.2153,
    title: 'Sydney Opera House',
    subtitle: 'NSW, Australia',
    pincolor: MapModule.ANNOTATION_VIOLET,
    image: 'custom_pin.png', // Custom image
    draggable: true, // Allow pin dragging
    // Complete custom view (replaces the pin)
    customView: Ti.UI.createLabel({ text: '📍', backgroundColor: 'white' })
});

mapView.addAnnotation(opera);
```

### Additional Annotation Properties
- `customView` — a `Ti.UI.View` that replaces the entire annotation (takes precedence over `image`)
- `centerOffset` — `{x, y}` point to offset the annotation from the coordinate
- `canShowCallout` — whether tapping shows the info bubble (default: `true`)

> **Precedence**: `customView` > `image` > default pin. For buttons: `leftView`/`rightView` take precedence over `leftButton`/`rightButton`.

### Available Pin Colors
`ANNOTATION_AZURE`, `BLUE`, `CYAN`, `GREEN`, `MAGENTA`, `ORANGE`, `RED`, `ROSE`, `VIOLET`, `YELLOW`.

## 5. Routes (Polylines)

```javascript
const route = MapModule.createRoute({
    width: 5,
    color: '#f00',
    points: [
        { latitude: -33.8569, longitude: 151.2153 },
        { latitude: -33.8522, longitude: 151.2105 }
    ]
});

mapView.addRoute(route);
```

## 6. Critical Events

```javascript
// Detect click on annotation or its buttons
mapView.addEventListener('click', (e) => {
    if (e.clicksource === 'pin') {
        Ti.API.info(`Pin clicked: ${e.title}`);
    }
});

// Detect drag state changes
mapView.addEventListener('pinchangedragstate', (e) => {
    if (e.annotation.dragState === MapModule.ANNOTATION_DRAG_STATE_END) {
        Ti.API.info(`Dropped at: ${e.annotation.latitude}, ${e.annotation.longitude}`);
    }
});
// Drag states: ANNOTATION_DRAG_STATE_START, ANNOTATION_DRAG_STATE_DRAG,
//              ANNOTATION_DRAG_STATE_CANCEL, ANNOTATION_DRAG_STATE_END

// Detect region changes
mapView.addEventListener('regionchanged', (e) => {
    Ti.API.info(`New region: ${e.latitude}, ${e.longitude} (delta: ${e.latitudeDelta}, ${e.longitudeDelta})`);
});

// Detect complete rendering
mapView.addEventListener('complete', (e) => {
    Ti.API.info('Map loaded');
});
```

## 7. Migration from Legacy Titanium.Map

> **Note**: The `ti.map` module replaced the legacy `Titanium.Map` API. Key differences: use `NORMAL_TYPE` instead of `STANDARD_TYPE`, `ANNOTATION_VIOLET` instead of `ANNOTATION_PURPLE`, and routes are created with `Map.createRoute()` instead of abstract data types. Multiple MapView instances are supported.

## 8. Limitations and Troubleshooting
- **Single Map:** Android (legacy) only allows one MapView instance per application. v2 allows multiple views.
- **Blank Map:** Verify the API Key is correct and that `android:anyDensity` is NOT set to true in the manifest if using old resolutions.
- **Simulator:** Google Maps v2 is NOT compatible with the standard emulator without x86 Google Play Services. Real device testing is recommended.
