# Modules: Map API Reference

## Modules.Map
> Add-on Map module
> Extends Ti.Module
> Platforms: both
> Type: module

### Requirements

-   Google Maps API key (required for both development and production)
-   Google Play services SDK installed using the Android SDK manager
-   This module only works on Android devices.  This module is not supported on the Android emulator

### Getting Started

-   Edit the `modules` section of your tiapp.xml file to include this module:

    ``` xml
    <ti:app>
        <modules>
            <!-- Add this line to your modules section -->
            <module platform="android">ti.map</module>

*(See full overview in titanium-docs)*

### Constants (49)
- **ANNOTATION_\***: ANNOTATION_GREEN, ANNOTATION_BLUE, ANNOTATION_AZURE, ANNOTATION_CYAN, ANNOTATION_MAGENTA, ANNOTATION_ORANGE, ANNOTATION_PURPLE, ANNOTATION_ROSE, ANNOTATION_YELLOW, ANNOTATION_VIOLET, ANNOTATION_RED
- **ANNOTATION_DRAG_STATE_\***: ANNOTATION_DRAG_STATE_START, ANNOTATION_DRAG_STATE_END
- **ANNOTATION_VIEW_COLLISION_MODE_\***: ANNOTATION_VIEW_COLLISION_MODE_RECTANGLE, ANNOTATION_VIEW_COLLISION_MODE_CIRCLE
- **FEATURE_\***: FEATURE_TERRITORIES
- **FEATURE_DISPLAY_PRIORITY_\***: FEATURE_DISPLAY_PRIORITY_REQUIRED
- **FEATURE_DISPLAY_PRIORITY_DEFAULT_\***: FEATURE_DISPLAY_PRIORITY_DEFAULT_HIGH, FEATURE_DISPLAY_PRIORITY_DEFAULT_LOW
- **FEATURE_PHYSICAL_\***: FEATURE_PHYSICAL_FEATURES
- **FEATURE_TYPE_POINT_OF_\***: FEATURE_TYPE_POINT_OF_INTEREST
- **FEATURE_VISIBILITY_\***: FEATURE_VISIBILITY_ADAPTIVE, FEATURE_VISIBILITY_HIDDEN, FEATURE_VISIBILITY_VISIBLE
- **HYBRID_\***: HYBRID_TYPE
- **HYBRID_FLYOVER_\***: HYBRID_FLYOVER_TYPE
- **MUTED_STANDARD_\***: MUTED_STANDARD_TYPE
- **NORMAL_\***: NORMAL_TYPE
- **OTHER_\***: SUCCESS
- **OVERLAY_LEVEL_ABOVE_\***: OVERLAY_LEVEL_ABOVE_LABELS, OVERLAY_LEVEL_ABOVE_ROADS
- **POLYLINE_JOINT_\***: POLYLINE_JOINT_BEVEL, POLYLINE_JOINT_DEFAULT, POLYLINE_JOINT_ROUND
- **POLYLINE_PATTERN_\***: POLYLINE_PATTERN_DASHED, POLYLINE_PATTERN_DOTTED
- **REASON_\***: REASON_GESTURE
- **REASON_API_\***: REASON_API_ANIMATION
- **REASON_DEVELOPER_\***: REASON_DEVELOPER_ANIMATION
- **SATELLITE_\***: SATELLITE_TYPE
- **SATELLITE_FLYOVER_\***: SATELLITE_FLYOVER_TYPE
- **SEARCH_RESULT_TYPE_\***: SEARCH_RESULT_TYPE_ADDRESS, SEARCH_RESULT_TYPE_QUERY
- **SEARCH_RESULT_TYPE_POINT_OF_\***: SEARCH_RESULT_TYPE_POINT_OF_INTEREST
- **SERVICE_\***: SERVICE_MISSING, SERVICE_DISABLED, SERVICE_INVALID
- **SERVICE_VERSION_UPDATE_\***: SERVICE_VERSION_UPDATE_REQUIRED
- **TERRAIN_\***: TERRAIN_TYPE


### Methods (15)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isGooglePlayServicesAvailable(—) | Number | android | Returns a code to indicate whether Google Play Services is available on the dev… |
| search(value, options) | void | ios | Uses the native `MKLocalSearchCompleter` class to search places for a given inp… |
| geocodeAddress(address, callback) | void | ios | Resolve address details using the `CLGeocoder` to get information (e.g. latitud… |
| getLookAroundImage(callback, latitude, longitude) | void | ios | A utility function that you use to create a static image from a LookAround scen… |
| openLookAroundDialog(latitude, longitude) | void | ios | Opens a LookAround window modally. |
| createAnnotation(parameters) | Modules.Map.Annotation | both | Creates and returns an instance of <Modules.Map.Annotation>. |
| createCamera(parameters) | Modules.Map.Camera | both | Creates and returns an instance of <Modules.Map.Camera>. |
| createCircle(parameters) | Modules.Map.Circle | both | Creates and returns an instance of <Modules.Map.Circle>. |
| createImageOverlay(parameters) | Modules.Map.ImageOverlay | both | Creates and returns an instance of <Modules.Map.ImageOverlay>. |
| createPolygon(parameters) | Modules.Map.Polygon | both | Creates and returns an instance of <Modules.Map.Polygon>. |
| createPolyline(parameters) | Modules.Map.Polyline | both | Creates and returns an instance of <Modules.Map.Polyline>. |
| createRoute(parameters) | Modules.Map.Route | both | Creates and returns an instance of <Modules.Map.Route>. |
| createSnapshotter(parameters) | Modules.Map.Snapshotter | ios | Creates and returns an instance of <Modules.Map.Snapshotter>. |
| createStreetViewPanorama(parameters) | Modules.Map.StreetViewPanorama | android | Creates and returns an instance of <Modules.Map.StreetViewPanorama>. |
| createView(parameters) | Modules.Map.View | both | Creates and returns an instance of <Modules.Map.View>. |


### Related Types

#### SearchCompletionOptions
> Additional options to fine-tune the search request.

| Property | Type | Description |
|----------|------|-------------|
| region | MapRegionTypev2 | The region to look for results. Note that only `latitude`, `longitude`, `latitu… |
| resultTypes | Array<Number> | These options configure the types of search results you want to receive, includ… |

---

## Modules.Map.Annotation
> Represents a labeled point of interest on the map that the user can click on.
> Extends Ti.Proxy
> Platforms: both

The `Annotation` object gives you low-level control over annotations that can be added to
[map view](Modules.Map.View). An annotation must have its `latitude` and `longitude`
properties set to appear on a map.

Use the <Modules.Map.createAnnotation> method to create an annotation.  Starting with Alloy
1.4.0, use the **`<Annotation>`** Alloy element to define one in XML markup.

An annotation can also have a title, a subtitle, and two inset buttons or views on the left
and right side of the title. All of these items are optional.

The controls on the left and right side of the annotation can be specified in one of two
ways:

* To display an image, set the [leftButton](Titanium.Map.Annotation.leftButton) or
  [rightButton](Titanium.Map.Annotation.rightButton) property to an image URL. (On

*(See full overview in titanium-docs)*

### Properties (unique: 31/34)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| canShowCallout | Boolean | — | ios | Defines whether the annotation view is able to display extra information in a c… |
| centerOffset | Point | — | both | Defines a center offset point for the annotation. |
| customView | Ti.UI.View | — | both | Defines a custom view to be used by the annotation. |
| showAsMarker | Boolean | false | ios | Boolean to show an annotation view that displays a balloon-shaped marker at the… |
| markerGlyphText | String | — | ios | The text to display in the marker balloon. |
| markerGlyphColor | String | — | ios | The color to apply to the glyph text or image. |
| markerColor | String | — | ios | The background color of the marker balloon. |
| markerGlyphImage | String \| Ti.Blob | — | ios | The image displayed in the marker balloon. |
| markerSelectedGlyphImage | String \| Ti.Blob | — | ios | The image to display when the marker is selected. |
| markerAnimatesWhenAdded | Boolean | false | ios | Boolean indicating whether the marker animates into position onscreen. |
| markerTitleVisibility | Number | — | ios | The visibility of the title text rendered below the marker balloon. |
| markerSubtitleVisibility | Number | — | ios | The visibility of the subtitle text rendered below the marker balloon. |
| collisionMode | Number | — | ios | The collision mode to use when interpreting the collision frame rectangle. |
| annotationDisplayPriority | Number | Modules.Map.FEATURE_DISPLAY_PRIORITY_REQUIRE | ios | The display priority of this annotation view. |
| clusterIdentifier | String | — | both | An identifier that determines whether the annotation view participates in clust… |
| draggable | Boolean | false | both | Determines whether the pin can be dragged by the user. |
| image | String \| Ti.Blob | If not specified, a standard map pin image is used. | both | Image to use for the the pin. |
| latitude | Number | — | both | Latitude of the annotation, in decimal degrees. |
| longitude | Number | — | both | Longitude of the annotation, in decimal degrees. |
| pincolor | Number \| String | — | both | The color of the pin-annotation. Use the `ANNOTATION_*` constants for pre- defi… |
| subtitle | String | — | both | Secondary title of the annotation view. |
| subtitleid | String | — | both | Key in the locale file to use for the subtitle property. |
| title | String | — | both | Primary title of the annotation view. |
| titleid | String | — | both | Key in the locale file to use for the title property. |
| leftButton | String | — | both | Left button image on the annotation, specified as an image URL. |
| leftView | Ti.UI.View | — | both | Left view that is displayed on the annotation. |
| rightButton | String | — | both | Right button image on the annotation, specified as an image URL. |
| rightView | Ti.UI.View | — | both | Right view that is displayed on the annotation. |
| showInfoWindow | Boolean | true | both | Show or hide the view that is displayed on the annotation when clicked. |
| hidden | Boolean | false | both | Determines whether the annotation is hidden or not. |
| previewContext | Ti.UI.iOS.PreviewContext | — | ios | The preview context used in the 3D-Touch feature "Peek and Pop". |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| animate(newLocation) | void | ios | Animate annotation to new location. |
| rotate(angle) | void | ios | Rotate annotation on its location. |


### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Modules.Map.Camera
> A camera object defines a point above the map's surface from which to view the map. Available in iOS 7.0 and later.
> Extends Ti.Proxy
> Platforms: both

Applying a camera to a map has the effect of giving the map a 3D-like appearance.
You can use a camera to rotate the map so that it is oriented to match the user's
heading or to apply a pitch angle to tilt the plane of the map.

If the app is run on pre iOS 7, camera functionality will not be available.
After creating a `Camera` object, it can be applied to the map by setting the `camera` property of the
[map view](Modules.Map.View).

Use the <Modules.Map.createCamera> method to create a camera.

If `altitude`, `eyeCoordinate`, and `centerCoordinate` are passed in on creation, a camera will be
returned using the specified viewing angle information.

### Example:
``` javascript

*(See full overview in titanium-docs)*

### Properties (unique: 5/8)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| altitude | Number | — | both | The altitude above the ground, measured in meters. On Android these zoom values… |
| centerCoordinate | MapPointType | — | both | The coordinate point on which the map should be centered. |
| heading | Number | — | both | The heading of the camera (measured in degrees) relative to true north. |
| pitch | Number | — | both | The viewing angle of the camera, measured in degrees. |
| eyeCoordinate | MapPointType | — | both | The coordinate point at which to place the camera. Only used on creation when `… |




### Related Types

#### MapPointType
> An object representing a point on the map.

| Property | Type | Description |
|----------|------|-------------|
| longitude | Number | Longitude value of the map point, in decimal degrees. |
| latitude | Number | Latitude value of the map point, in decimal degrees. |

---

## Modules.Map.Circle
> Represents a bounded area on the map.
> Extends Ti.Proxy
> Platforms: both

The `Circle` object gives you low-level control over circles that can be added to a
[map view](Modules.Map.View). A circle must have a `center` property and a `radius` set to appear on a map.

Use the <Modules.Map.createCircle> method to create a circle.

### Properties (unique: 9/12)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| center | MapPointType | — | both | An object with longitude and latitude values. Can also be an array with longitu… |
| radius | Number | — | both | The radius of the circle, specified in meters. It should be zero or greater. |
| blendMode | Number | — | ios | The blend mode to apply to the overlay. |
| fillColor | String | black | both | Color to use when shading the circle, as a color name or hex triplet. |
| strokeColor | String | black | both | Color to use for the border of the circle, as a color name or hex triplet. |
| strokeWidth | Number | 10 | both | Line width in pixels to use when drawing the circle. |
| touchEnabled | Boolean | true | both | Determines whether view should receive touch events. |
| opacity | Number | 1.0 (opaque) | both | Opacity of this map circle, from 0.0 (transparent) to 1.0 (opaque). |
| zIndex | Number | — | android | The order (depth) in which to display the circles. |




### Related Types

#### MapPointType
> An object representing a point on the map.

| Property | Type | Description |
|----------|------|-------------|
| longitude | Number | Longitude value of the map point, in decimal degrees. |
| latitude | Number | Latitude value of the map point, in decimal degrees. |

---

## Modules.Map.ImageOverlay
> Represents a bounded area on the map that has an image overlay.
> Extends Ti.Proxy
> Platforms: both

The `ImageOverlay` object gives you low-level control over image overlays that can be added to a
[map view](Modules.Map.View). An image overlay must have a `boundsCoordinate` property and a `image` 
set to appear on a map.

Use the <Modules.Map.createImageOverlay> method to create an image overlay.

### Properties (unique: 2/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| boundsCoordinate | MapBoundsCoordinateType | — | both | An object representing diagonal coordinates (`topLeft` and `bottomRight`) on th… |
| image | String \| Ti.Blob | — | both | The image that is shown as an overlay on the map. |




### Related Types

#### MapBoundsCoordinateType
> An object representing the bound coordinates on the map.

| Property | Type | Description |
|----------|------|-------------|
| topLeft | MapPointType | An object with longitude and latitude values. |
| bottomRight | MapPointType | An object with longitude and latitude values. |

---

## Modules.Map.Polygon
> Represents a bounded area on the map.
> Extends Ti.Proxy
> Platforms: both

The `Polygon` object gives you low-level control over polygons that can be added to a
[map view](Modules.Map.View). A polygon must have its `points` property set to appear on a map.

Use the <Modules.Map.createPolygon> method to create a polygon.

### Properties (unique: 8/11)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| points | Array<MapPointType> | — | both | Array of map points making up the polygon. Can also be an array of longitude (i… |
| holes | Array<Array<MapPointType>> | — | both | Array of points arrays that define holes in the polygon. |
| fillColor | String | black | both | Color to use when shading the polygon, as a color name or hex triplet. |
| strokeColor | String | black | both | Color to use for the border of the polygon, as a color name or hex triplet. |
| strokeWidth | Number | 10 | both | Line width in pixels to use when drawing the polygon. |
| touchEnabled | Boolean | true | both | Determines whether view should receive touch events. |
| zIndex | Number | — | android | The order (depth) in which to display the polygons. |
| bounds | MapRegionTypev2 | — | android | Returns the bounding box of the polygon. Useful to center the region. |




### Related Types

#### MapRegionTypev2
> Simple object representing a map location and zoom level.

| Property | Type | Description |
|----------|------|-------------|
| bearing | Number | The direction in which a vertical line on the map points, measured in degrees c… |
| longitude | Number | Longitude value for the center point of the map, in decimal degrees. |
| latitude | Number | Latitude value for the center point of the map, in decimal degrees. |
| longitudeDelta | Number | The amount of east-to-west distance displayed on the map, measured in decimal d… |
| latitudeDelta | Number | The amount of north-to-south distance displayed on the map, measured in decimal… |
| tilt | Number | The camera's position on an arc between directly over the map's center position… |
| zoomLevel | Number | The zoom level of the map. |
| selectableMapFeatures | Array<Number> | The property that describes which selectable features the map responds to. |

---

## Modules.Map.Polyline
> Represents a bounded area on the map.
> Extends Ti.Proxy
> Platforms: both

The `Polyline` object gives you low-level control over polylines that can be added to a
[map view](Modules.Map.View). A polyline must have its `points` property set to appear on a map.

Use the <Modules.Map.createPolyline> method to create a polyline.

### Example

``` javascript
const polyline = Map.createPolyline({
    points: [{
            latitude: -33.891614,
            longitude: 151.276417
        },
        [-33.87365, 151.20689]
    ],

*(See full overview in titanium-docs)*

### Properties (unique: 7/10)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| jointType | Number | Modules.Map.POLYLINE_JOINT_DEFAULT | android | Defines the shape of corner points. |
| points | Array<MapPointType> \| String | — | both | Array of map points making up the polyline. Can also be an array of longitude (… |
| strokeColor | String | black | both | Color to use for the the polyline, as a color name or hex triplet. |
| strokeWidth | Number | 10 | both | Line width in pixels to use when drawing the polyline. |
| touchEnabled | Boolean | true | both | Determines whether view should receive touch events. |
| zIndex | Number | — | android | The order (depth) in which to display the polylines. |
| pattern | Object | — | both | Pattern used to draw the polylines. |




---

## Modules.Map.Route
> Represents a path between two or more points of interest.
> Extends Ti.Proxy
> Platforms: both

The `Route` object gives you low-level control over routes that can be added to a
[map view](Modules.Map.View). A route must have its `points` property set to appear on a map.

Use the <Modules.Map.createRoute> method to create a route.

### iOS Platform Notes

The `addRoute` method no longer accepts a dictionary as a parameter. Pass a <Modules.Map.Route> object instead.

### Android Platform Notes
The parameter `points` accepts additional the route in format `encoded polyline`.  
https://developers.google.com/maps/documentation/utilities/polylinealgorithm

### Properties (unique: 4/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| points | String \| Array<MapPointType> | — | both | Array of map points making up the route. |
| color | String | black | both | Color to use when drawing the route, as a color name or hex triplet. |
| width | Number | 10 | both | Line width in pixels to use when drawing the route. |
| level | Number | <Modules.Map.OVERLAY_LEVEL_ABOVE_LABELS> | ios | The map level at which to place the route. Available in iOS 7.0 and later. |




---

## Modules.Map.Snapshotter
> Snapshotter is used to allow screen shots to be taken of a specified region or a mapview.
> Extends Ti.Proxy
> Platforms: ios

## Examples

### Taking a simple snapshot

This is a map-example which creates a simple snapshot of the specified map-area.

``` javascript
const MapModule = require('ti.map');

const win = Ti.UI.createWindow({
    backgroundColor: 'white'
});

const Snapshotter = MapModule.createSnapshotter({
    mapType: MapModule.HYBRID_TYPE,

*(See full overview in titanium-docs)*

### Properties (unique: 5/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| region | MapRegionTypev2 | — | ios | A dictionary specifying the location and zoom level of the map. |
| showsPointsOfInterest | Boolean | true | ios | When this property is set to YES, the map displays icons and labels for restaur… |
| size | SnapshotSize | — | ios | A dictionary specifying the width and height of the snapshot. |
| mapType | Number | NORMAL_TYPE | ios | Map type constant, either <Modules.Map.NORMAL_TYPE>, <Modules.Map.SATELLITE_TYP… |
| showsBuildings | Boolean | true | ios | Determines whether building will be shown on the map. The mapType property must… |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| takeSnapshot(success, error) | Ti.Blob | ios | Takes a snap shot of of the map corresponding to the region property or a snap … |


### Related Types

#### MapRegionTypev2
> Simple object representing a map location and zoom level.

| Property | Type | Description |
|----------|------|-------------|
| bearing | Number | The direction in which a vertical line on the map points, measured in degrees c… |
| longitude | Number | Longitude value for the center point of the map, in decimal degrees. |
| latitude | Number | Latitude value for the center point of the map, in decimal degrees. |
| longitudeDelta | Number | The amount of east-to-west distance displayed on the map, measured in decimal d… |
| latitudeDelta | Number | The amount of north-to-south distance displayed on the map, measured in decimal… |
| tilt | Number | The camera's position on an arc between directly over the map's center position… |
| zoomLevel | Number | The zoom level of the map. |
| selectableMapFeatures | Array<Number> | The property that describes which selectable features the map responds to. |

#### SnapshotSize
> Simple dictionary used as an argument to [setSize](Modules.Map.Snapshotter.setSize).

| Property | Type | Description |
|----------|------|-------------|
| height | Number | The height the be used for the snapshot. |
| width | Number | The height the be used for the snapshot. |

---

## Modules.Map.StreetViewPanorama
> Provides panoramic 360-degree views from designated roads throughout its coverage area.
> Extends Ti.UI.View
> Platforms: android

Each street view panorama is an image, or set of images, that provides a full 360-degree view from
a single location. It provides a viewer that renders the panorama as a sphere with a camera at its center.
A window can only contain one street view.

### Properties (unique: 5/66)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| position | StreetViewPosition | — | android | A dictionary specifying the position of the street view. |
| panning | Boolean | true | android | Determines whether the user is able to re-orient the camera by dragging. |
| zoom | Boolean | true | android | Determines whether the user is able to pinch to zoom. |
| streetNames | Boolean | true | android | Determines whether the user is able to see street names displayed. |
| userNavigation | Boolean | true | android | Determines whether the user is able to move to a different panorama. |




### Related Types

#### StreetViewPosition
> Simple object representing a street view coordinates.

| Property | Type | Description |
|----------|------|-------------|
| longitude | Number | Longitude value for the center point of the view, in decimal degrees. |
| latitude | Number | Latitude value for the center point of the view, in decimal degrees. |

---

## Modules.Map.View
> Map view is used for embedding native mapping capabilities as a view in your application.
> Extends Ti.UI.View
> Platforms: both

With native maps, you can control the mapping location, the type of map, the zoom level
and you can add custom annotations and routes directly to the map. Once the map view is
displayed, the user can pan, zoom and tilt the map using the native control gestures.

Use the <Modules.Map.createView> method to create a map view.

In Alloy, use the **`<Module>`** element with the `module` attribute set to `ti.map`
and `method` attribute set to `createView` to create a map view in XML markup:

``` xml

### Properties (unique: 29/101)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| animate | Boolean | false | both | Indicates if changes to the mapping region should be animated. |
| annotations | Array<Modules.Map.Annotation> | — | both | An array of annotations to add to the map. |
| liteMode | Boolean | false | android | Create a liteMode map version |
| mapType | Number | NORMAL_TYPE | both | Map type constant, either <Modules.Map.NORMAL_TYPE>, <Modules.Map.SATELLITE_TYP… |
| zOrderOnTop | Boolean | false | both | Controls wether the map view's surface is placed on top of its window. |
| region | MapRegionTypev2 | latitude 0, longitude 0 | both | A dictionary specifying the location and zoom level of the map. |
| padding | MapViewPadding | — | both | Sets the distance between each edges of the view to the map controls. |
| userLocation | Boolean | false | both | Boolean indicating if the user's current device location should be shown on the… |
| userLocationButton | Boolean | true | android | Enable or disables the My Location button. If the button is enabled, it is only… |
| compassEnabled | Boolean | true | both | Enable or disables the compass button. |
| mapToolbarEnabled | Boolean | true | android | Enable or disables the map toolbar. |
| enableZoomControls | Boolean | true | android | Enables or disables the built-in zoom controls. |
| maxZoomLevel | Number | — | android | Returns the maximum zoom level available at the current camera position. |
| minZoomLevel | Number | — | android | Returns the minimum zoom level available at the current camera position. |
| minClusterSize | Number | 4 | android | Sets the minium size of a cluster. |
| zoom | Number | — | android | Returns the current zoom level from the current camera position. |
| traffic | Boolean | false | android | Toggles the traffic layer on or off. |
| camera | Modules.Map.Camera | — | both | The camera used for determining the appearance of the map. |
| pitchEnabled | Boolean | — | ios | A Boolean value indicating whether the map camera's pitch information is used. |
| rotateEnabled | Boolean | — | ios | A Boolean value indicating whether the map camera's heading information is used. |
| scrollEnabled | Boolean | true | both | A Boolean value indicating whether the map can be scrolled by dragging gesture. |
| showsBuildings | Boolean | true | ios | A Boolean indicating whether the map displays extruded building information. |
| showsPointsOfInterest | Boolean | true | ios | A Boolean indicating whether the map displays point-of-interest information. |
| showsCompass | Boolean | true | ios | A Boolean indicating whether the map displays a compass control. |
| showsScale | Boolean | false | ios | A Boolean indicating whether the map shows scale information. |
| showsTraffic | Boolean | false | ios | A Boolean value indicating whether the map displays traffic information. |
| style | String | false | android | JSON String to style the Map. |
| zoomEnabled | Boolean | true | both | A Boolean value indicating whether the map can be zoomed by pinching or tapping. |
| indoorEnabled | Boolean | true | android | A Boolean value indicating whether the indoor mapping is enabled. |


### Methods (34)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addAnnotation(annotation) | void | both | Adds a new annotation to the map. |
| addAnnotations(annotations) | void | both | Adds one or more new annotations to the map. |
| addRoute(route) | void | both | Adds a route to the map. |
| addHeatmap(coordinates) | void | android | Adds a heatmap to the map. |
| containsCoordinate(coordinate) | Boolean | both | Validated whether or not a given coordinate is currently visible in the map rec… |
| deselectAnnotation(annotation) | void | both | Deselects the specified annotation, so the main annotation is hidden and only a… |
| removeAllAnnotations(—) | void | both | Removes all annotations from the map. |
| removeAnnotation(annotation) | void | both | Removes an existing annotation from the map. |
| removeAnnotations(annotations) | void | both | Removes one or more existing annotations from the map. |
| removeRoute(route) | void | both | Remove a previously added route. |
| selectAnnotation(annotation) | void | both | Selects the annotation, showing the full annotation. |
| setMapType(mapType) | void | both | Sets the type of map (satellite, normal, or terrain). |
| setLocation(location) | void | both | Sets the map location and zoom level. |
| zoom(level) | void | both | Zooms in or out of the map. |
| snapshot(—) | void | android | Takes a snapshot of the map |
| animateCamera(animationParams, callback) | void | both | Changes the camera used for determining the map's viewing parameters and animat… |
| showAnnotations(annotations) | void | both | Sets the visible region so that the map displays the specified annotations. If … |
| addPolygon(polygon) | void | both | Adds a new polygon to the map. |
| addPolygons(polygons) | void | both | Adds one or more new polygons to the map. |
| removePolygon(polygon) | void | both | Remove a polygon from the map. |
| removeAllPolygons(—) | void | both | Remove all polygons from the map. |
| addPolyline(polygon) | void | both | Adds a new polylines to the map. |
| addPolylines(polylines) | void | both | Adds one or more new polylines to the map. |
| removePolyline(polyline) | void | both | Remove a polyline from the map. |
| removeAllPolylines(—) | void | both | Remove all polylines from the map. |
| addCircle(circle) | void | both | Adds a new circle to the map. |
| addCircles(circles) | void | ios | Adds one or more new circles to the map. |
| removeCircle(circle) | void | both | Remove a circle from the map. |
| removeAllCircles(—) | void | both | Remove all circles from the map. |
| addImageOverlay(imageOverlay) | void | both | Adds a new image overlay to the map. |
| addImageOverlays(imageOverlays) | void | both | Adds one or more new image overlays to the map. |
| removeImageOverlay(imageOverlay) | void | both | Remove an image overlay from the map. |
| removeAllImageOverlays(—) | void | both | Remove all image overlays from the map. |
| setClusterAnnotation(clusterAnnotationParam) | void | both | Set new cluster annotation for the clustered annotation. |

### Events (12)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when the user selects or deselects an annotation, a polygon, a polyline o… |
| longclick | android | Fired when the user makes a long-press gesture on the map. |
| clusterstart | ios | Fired when a collision between annotations occures. |
| onsnapshotready | android | Fired when the snapshot is ready after [snapshot](Modules.Map.View.snapshot) is… |
| pinchangedragstate | both | Fired when the user interacts with a draggable annotation. |
| complete | both | Fired when the map completes loading. |
| mapclick | both | Fired when the user clicks on the map |
| regionwillchange | both | Fired when the mapping region will change. |
| regionchanged | both | Fired when the mapping region finished changing. |
| userLocation | both | Fired when the user changes on the map. |
| poideselect | ios | Fired when the user deselects a Point of Interest (e.g. restaurant or hotel). |
| poiclick | ios | Fired when the user selects a Point of Interest (e.g. restaurant or hotel). |

### Related Types

#### CameraAnimationParams
> Simple object used to control camera animations.

| Property | Type | Description |
|----------|------|-------------|
| camera | Modules.Map.Annotation | <Modules.Map.Camera> to be animated to. |
| duration | Number | The amount of time (in milliseconds) that the animation will last. |
| curve | Number | Animation curve or easing function to apply to the animation. |

#### ClusterAnnotationParams
> Simple object used to create cluster annotation view.

| Property | Type | Description |
|----------|------|-------------|
| memberAnnotations | Array<Modules.Map.Annotation> | Array of Modules.Map.Annotation, which is recieved in event 'clusteringstarted'… |
| annotation | Modules.Map.Annotation | <Modules.Map.Annotation> instance, which you want to show as clustered annotati… |

#### MapLocationTypeV2
> Simple object used as an argument to [setLocation](Modules.Map.View.setLocation).

| Property | Type | Description |
|----------|------|-------------|
| longitude | Number | Longitude value for the center point of the map, in decimal degrees. |
| latitude | Number | Latitude value for the center point of the map, in decimal degrees. |
| longitudeDelta | Number | The amount of east-to-west distance displayed on the map, measured in decimal d… |
| latitudeDelta | Number | The amount of north-to-south distance displayed on the map, measured in decimal… |
| animate | Boolean | Set to `true` to animate the move to the new location. |

*Plus 3 more types: MapViewPadding*

---

