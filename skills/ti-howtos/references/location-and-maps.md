# Location & maps

Based on the [current official guide](https://titaniumsdk.com/docs/build/location.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

Location needs permission, and the permission has kinds: while-in-use or
always, and on iOS precise or approximate. Ask for the least you need.

```js
if (!Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)) {
  Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, (e) => {
    if (e.success) {
      locate();
    }
  });
} else {
  locate();
}
```

`tiapp.xml` needs the matching usage string on iOS:

```xml
<ios>
  <plist>
    <dict>
      <key>NSLocationWhenInUseUsageDescription</key>
      <string>Show which notes were written near you.</string>
    </dict>
  </plist>
</ios>
```

Asking for `AUTHORIZATION_ALWAYS` is a much bigger request, is reviewed harder,
and on iOS the user is asked again later whether they meant it. Do not request
it for a feature that works while the app is open.

## One position

```js
function locate() {
  Ti.Geolocation.getCurrentPosition((e) => {
    if (!e.success) {
      Ti.API.error(`location failed: ${e.error}`);
      return;
    }
    const { latitude, longitude, accuracy } = e.coords;
    Ti.API.info(`${latitude}, ${longitude} +/- ${accuracy}m`);
  });
}
```

`accuracy` on the result is a radius in metres, and it is the number that
decides whether a fix is usable. A first fix indoors can be several hundred
metres wide; treat anything above your tolerance as "not yet" rather than as an
answer.

## Tracking

```js
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
Ti.Geolocation.distanceFilter = 10;

function onLocation(e) {
  if (!e.success) {
    return;
  }
  Ti.API.info(`moved to ${e.coords.latitude}, ${e.coords.longitude}`);
}

Ti.Geolocation.addEventListener('location', onLocation);
```

`distanceFilter` is metres of movement before another event, and it is the
single most effective thing you can set: without it you get an event per fix,
which is a battery complaint waiting to happen.

**Remove the listener when the screen goes away.** Location updates continue
while a listener is attached, whether or not anything is looking at them.

```js
win.addEventListener('close', () => {
  Ti.Geolocation.removeEventListener('location', onLocation);
});
```

Set `accuracy` to the loosest value that works. `ACCURACY_HIGH` powers the GPS
radio; a "which city" feature does not need it.

## Addresses

`reverseGeocoder` turns coordinates into an address and `forwardGeocoder` does
the reverse. Both are network calls against a platform service, so they fail
offline and are rate limited:

```js
Ti.Geolocation.reverseGeocoder(latitude, longitude, (e) => {
  if (e.success && e.places.length) {
    Ti.API.info(e.places[0].address);
  }
});
```

## Maps

Maps are **not** in the core SDK. `ti.map` is a module, maintained by TiDev,
and it wraps Google Maps on Android and MapKit on iOS.

```
<modules>
  <module platform="android">ti.map</module>
  <module platform="iphone">ti.map</module>
</modules>
```

```js
const Map = require('ti.map');

const view = Map.createView({
  mapType: Map.NORMAL_TYPE,
  region: { latitude: 51.5, longitude: -0.12, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  annotations: [
    Map.createAnnotation({ latitude: 51.5, longitude: -0.12, title: 'Here' })
  ]
});
win.add(view);
```

Android additionally needs a Google Maps API key in `tiapp.xml`, and a build
without one shows an empty grid rather than an error. If your map is blank grey
squares, that is the reason.

See [using modules](https://titaniumsdk.com/docs/build/modules.md) for installing it, and the module's
own reference for the full API.

![A map centred on the Civic Center district of San Francisco with three annotations. The City Hall pin is selected, drawn larger than the others and labelled with its title and subtitle; the Asian Art Museum and Main Library pins sit nearby at their normal size.](https://titaniumsdk.com/docs/guides/map-callout-ios.png)

## Next

[Notifications](https://titaniumsdk.com/docs/build/notifications.md) covers local and push.
