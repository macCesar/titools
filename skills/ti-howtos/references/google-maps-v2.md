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
        Ti.API.info('Google Play services is installed.');
        break;
    case MapModule.SERVICE_MISSING:
        alert('Google Play services is missing. Please install it.');
        break;
    case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
        alert('Google Play services is out of date. Please update.');
        break;
    default:
        alert(`Google Play services error: ${rc}`);
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
    if (e.newState === MapModule.ANNOTATION_DRAG_STATE_END) {
        Ti.API.info(`New position: ${e.annotation.latitude}`);
    }
});

// Detect complete rendering
mapView.addEventListener('complete', (e) => {
    Ti.API.info('Map loaded');
});
```

## 7. Limitations and Troubleshooting
- **Single Map:** Android (legacy) only allows one MapView instance per application. v2 allows multiple views.
- **Blank Map:** Verify the API Key is correct and that `android:anyDensity` is NOT set to true in the manifest if using old resolutions.
- **Simulator:** Google Maps v2 is NOT compatible with the standard emulator without x86 Google Play Services. Real device testing is recommended.
