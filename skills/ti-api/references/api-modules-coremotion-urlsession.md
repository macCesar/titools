# Modules: CoreMotion & URLSession API Reference

## Modules.CoreMotion
> Allows Titanium client applications to access Apple's CoreMotion APIs.
> Extends Ti.Module
> Platforms: ios
> Type: module

The Core Motion module provides access to Apple's CoreMotion APIs. The Core Motion module provides support
for monitoring various hardware sensors on iOS devices, such as the accelerometer, gyroscope, and
magnetometer. The Core Motion module allows you to access the metrics provided by these sensors.

For instruction and examples of using the Core Motion Module, see the
[Core Motion Module guide]().


### Requirements

This module only works with devices running iOS 7 and later. Not all devices have the same hardware sensors,
so all features may not be available for all devices. Be sure to use the API to check the device
for the existence of a feature.

You can only test the Core Motion module on a device. The Core Motion API cannot be tested on the iOS

*(See full overview in titanium-docs)*

### Constants (23)
- **ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_CORRECTED_Z_\***: ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_CORRECTED_Z_VERTICAL
- **ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_Z_\***: ATTITUDE_REFERENCE_FRAME_X_ARBITRARY_Z_VERTICAL
- **ATTITUDE_REFERENCE_FRAME_X_MAGNETIC_NORTH_Z_\***: ATTITUDE_REFERENCE_FRAME_X_MAGNETIC_NORTH_Z_VERTICAL
- **ATTITUDE_REFERENCE_FRAME_X_TRUE_NORTH_Z_\***: ATTITUDE_REFERENCE_FRAME_X_TRUE_NORTH_Z_VERTICAL
- **AUTHORIZATION_STATUS_\***: AUTHORIZATION_STATUS_RESTRICTED, AUTHORIZATION_STATUS_DENIED, AUTHORIZATION_STATUS_AUTHORIZED
- **AUTHORIZATION_STATUS_NOT_\***: AUTHORIZATION_STATUS_NOT_DETERMINED
- **ERROR_\***: ERROR_NULL, ERROR_UNKNOWN
- **ERROR_DEVICE_REQUIRES_\***: ERROR_DEVICE_REQUIRES_MOVEMENT
- **ERROR_INVALID_\***: ERROR_INVALID_PARAMETER
- **ERROR_MOTION_ACTIVITY_NOT_\***: ERROR_MOTION_ACTIVITY_NOT_AVAILABLE, ERROR_MOTION_ACTIVITY_NOT_AUTHORIZED, ERROR_MOTION_ACTIVITY_NOT_ENTITLED
- **ERROR_TRUE_NORTH_NOT_\***: ERROR_TRUE_NORTH_NOT_AVAILABLE
- **MAGNETIC_FIELD_CALIBRATION_ACCURACY_\***: MAGNETIC_FIELD_CALIBRATION_ACCURACY_UNCALIBRATED, MAGNETIC_FIELD_CALIBRATION_ACCURACY_LOW, MAGNETIC_FIELD_CALIBRATION_ACCURACY_MEDIUM, MAGNETIC_FIELD_CALIBRATION_ACCURACY_HIGH
- **MOTION_ACTIVITY_CONFIDENCE_\***: MOTION_ACTIVITY_CONFIDENCE_LOW, MOTION_ACTIVITY_CONFIDENCE_MEDIUM, MOTION_ACTIVITY_CONFIDENCE_HIGH




---

## Modules.CoreMotion.Accelerometer
> Allows Titanium client applications to access CoreMotion's Accelerometer APIs.
> Extends Ti.Proxy
> Platforms: ios


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setAccelerometerUpdateInterval(interval) | void | ios | The interval in milliseconds, for providing accelerometer updates to the callba… |
| startAccelerometerUpdates(callback) | void | ios | Starts accelerometer updates. |
| stopAccelerometerUpdates(—) | void | ios | Stops accelerometer updates. |
| isAccelerometerActive(—) | Boolean | ios | Returns a Boolean indicating whether accelerometer updates are currently happen… |
| isAccelerometerAvailable(—) | Boolean | ios | Returns a Boolean indicating whether an accelerometer is available on the devic… |
| getAccelerometerData(—) | CoreMotionAccelerometerData | ios | Returns the latest sample of accelerometer data. |


### Related Types

#### CoreMotionAccelerometerData
> Representation of an accelerometer event.

| Property | Type | Description |
|----------|------|-------------|
| timestamp | Number | The time when the logged item is valid. |
| acceleration | CoreMotionAcceleration | The acceleration measured by the accelerometer. |

---

## Modules.CoreMotion.Altimeter
> Allows Titanium client applications to access CoreMotion's Altimeter APIs.  Note: This API is only available in iOS 8 and later.
> Extends Ti.Proxy
> Platforms: ios


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isSupported(—) | Boolean | ios | Returns a Boolean value indicating whether the altimeter is supported on the cu… |
| isRelativeAltitudeAvailable(—) | Boolean | ios | Returns a Boolean value indicating whether the altimeter is supported on the cu… |
| authorizationStatus(—) | Number | ios | Returns the current authorization status for altimeter. |
| hasAltimeterPermissions(—) | Boolean | ios | Determines whether the device supports reporting relative altitude changes. |
| startRelativeAltitudeUpdates(callback) | void | ios | Starts relative altitude updates, providing data to the given handler on the gi… |
| stopRelativeAltitudeUpdates(—) | void | ios | Stops relative altitude updates. |


---

## Modules.CoreMotion.DeviceMotion
> Allows Titanium client applications to access CoreMotion's DeviceMotion APIs.
> Extends Ti.Proxy
> Platforms: ios


### Methods (10)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setShowsDeviceMovementDisplay(show) | void | ios | Controls whether the device-movement display is shown. |
| setDeviceMotionUpdateInterval(interval) | void | ios | The interval in milliseconds, for providing device-motion updates to the callba… |
| startDeviceMotionUpdatesUsingReferenceFrame(args, callback) | void | ios | Starts device-motion updates using a reference frame. |
| startDeviceMotionUpdates(callback) | void | ios | Starts device-motion updates. |
| stopDeviceMotionUpdates(—) | void | ios | Stops device-motion updates. |
| getAttitudeReferenceFrame(—) | Number | ios | Returns either the reference frame currently being used or the default attitude… |
| availableAttitudeReferenceFrames(—) | Number | ios | Returns a bitmask specifying the available attitude reference frames on the dev… |
| isDeviceMotionActive(—) | Boolean | ios | Returns a Boolean value that determines whether the app is receiving updates fr… |
| isDeviceMotionAvailable(—) | Boolean | ios | Returns a Boolean indicating whether device-motion is available on the device. |
| getDeviceMotion(—) | CoreMotionDeviceMotionData | ios | Returns the latest sample of device-motion data. |


### Related Types

#### CoreMotionDeviceMotionData
> Representation of a device-motion event.

| Property | Type | Description |
|----------|------|-------------|
| timestamp | Number | The time when the logged item is valid. |
| attitude | CoreMotionAttitude | The attitude of the device. |
| rotationRate | CoreMotionRotationRate | The roation rate of the device. |
| gravity | CoreMotionAcceleration | The gravity acceleration vector expressed in the device's reference frame. |
| userAcceleration | CoreMotionAcceleration | The acceleration that the user is giving to the device. |
| magneticField | CoreMotionCalibratedMagneticField | Returns the magnetic field vector with respect to the device. |
| heading | Number | Returns heading angle in the range [0,360) degrees with respect to the attitude… |

#### CoreMotionReferenceFrameArgs
> Dictionary of arguments passed to the [DeviceMotion.startDeviceMotionUpdatesUsingReferenceFrame()](Modules.CoreMotion.DeviceMotion.startDeviceMotionUpdatesUsingReferenceFrame) method.

| Property | Type | Description |
|----------|------|-------------|
| referenceFrame | Number | A constant identifying the reference frame to use for device-motion updates. |

---

## Modules.CoreMotion.Gyroscope
> Allows Titanium client applications to access CoreMotion's Gyroscope APIs.
> Extends Ti.Proxy
> Platforms: ios


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setGyroUpdateInterval(interval) | void | ios | The interval in milliseconds, for providing gyroscope updates to the callback. |
| startGyroUpdates(callback) | void | ios | Starts gyroscope updates. |
| stopGyroUpdates(—) | void | ios | Stops gyroscope updates. |
| isGyroActive(—) | Boolean | ios | Returns a Boolean indicating whether gyroscope updates are currently happening. |
| isGyroAvailable(—) | Boolean | ios | Returns a Boolean indicating whether a gyroscope is available on the device. |
| getGyroData(—) | CoreMotionGyroData | ios | Returns the latest sample of gyroscope data. |


### Related Types

#### CoreMotionGyroData
> Representation of a gyroscope event.

| Property | Type | Description |
|----------|------|-------------|
| timestamp | Number | The time when the logged item is valid. |
| rotationRate | CoreMotionRotationRate | The rotation rate measured by the gyroscope. |

---

## Modules.CoreMotion.Magnetometer
> Allows Titanium client applications to access CoreMotion's Magnetometer APIs.
> Extends Ti.Proxy
> Platforms: ios


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setMagnetometerUpdateInterval(interval) | void | ios | The interval in milliseconds, for providing magnetometer updates to the callbac… |
| startMagnetometerUpdates(callback) | void | ios | Starts magnetometer updates. |
| stopMagnetometerUpdates(—) | void | ios | Stops magnetometer updates. |
| isMagnetometerActive(—) | Boolean | ios | Returns a Boolean indicating whether magnetometer updates are currently happeni… |
| isMagnetometerAvailable(—) | Boolean | ios | Returns a Boolean indicating whether a magnetometer is available on the device. |
| getMagnetometerData(—) | CoreMotionMagnetometerData | ios | Returns the latest sample of magnetometer data. |


### Related Types

#### CoreMotionMagnetometerData
> Representation of a magnetometer event.

| Property | Type | Description |
|----------|------|-------------|
| timestamp | Number | The time when the logged item is valid. |
| magneticField | CoreMotionMagneticField | The magnetic field measured by the magnetometer. |

---

## Modules.CoreMotion.MotionActivity
> Allows Titanium client applications to access CoreMotion's MotionActivity APIs.
> Extends Ti.Proxy
> Platforms: ios


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isActivityAvailable(—) | Boolean | ios | Returns a Boolean indicating whether motion activity data is available on the c… |
| startActivityUpdates(callback) | void | ios | Starts the delivery of current motion activity updates to your app. |
| stopActivityUpdates(—) | void | ios | Stops the delivery of motion activity updates to your app. |
| queryActivity(args, callback) | void | ios | Gathers and returns historical motion activity data for the specified time peri… |


### Related Types

#### CoreMotionQueryActivityArgs
> Dictionary of arguments to pass to the [MotionActivity.queryActivity()](Modules.CoreMotion.MotionActivity.queryActivity) method.

| Property | Type | Description |
|----------|------|-------------|
| start | Date | The start time to use when gathering motion data. |
| end | Date | The end time to use when gathering motion data. |

---

## Modules.CoreMotion.Pedometer
> Allows Titanium client applications to access CoreMotion's Pedometer APIs.  Note: This API is only available in iOS 8 and later.
> Extends Ti.Proxy
> Platforms: ios


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isSupported(—) | Boolean | ios | Returns a Boolean value indicating whether the pedometer is supported on the cu… |
| isCadenceAvailable(—) | Boolean | ios | Returns a Boolean value indicating whether cadence information is available on … |
| isDistanceAvailable(—) | Boolean | ios | Returns a Boolean value indicating whether distance support is available on the… |
| isFloorCountingAvailable(—) | Boolean | ios | Returns a Boolean value indicating whether floor counting is available on the c… |
| isPaceAvailable(—) | Boolean | ios | Returns a Boolean value indicating whether pace information is available on the… |
| isStepCountingAvailable(—) | Boolean | ios | Returns a Boolean indicating whether step-counting support is available on the … |
| startPedometerUpdates(args, callback) | void | ios | Starts the delivery of recent pedestrian-related data to your app. |
| stopPedometerUpdates(—) | void | ios | Stops the delivery of recent pedestrian data updates to your app. |
| queryPedometerData(args, callback) | void | ios | Retrieves the data between the specified start and end dates. |


### Related Types

#### CoreMotionStartPedometerArgs
> Dictionary of arguments to pass to the [Pedometer.startPedometerUpdates()](Modules.CoreMotion.Pedometer.startPedometerUpdates) method.

| Property | Type | Description |
|----------|------|-------------|
| start | Date | The start time to use when gathering pedometer data. |

---

## Modules.CoreMotion.StepCounter
> Allows Titanium client applications to access CoreMotion's (deprecated) StepCounter APIs.
> Extends Ti.Proxy
> Platforms: ios


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isStepCountingAvailable(—) | Boolean | ios | Returns a Boolean indicating whether step-counting support is available on the … |
| startStepCountingUpdates(args, callback) | void | ios | Starts the delivery of current step-counting data to your app. |
| stopStepCountingUpdates(—) | void | ios | Stops the delivery of step-counting updates to your app. |
| queryStepCount(args, callback) | void | ios | Gathers and returns historical step count data for the specified time period. |


### Related Types

#### CoreMotionQueryStepCountArgs
> Dictionary of arguments to pass to the [Stepcounter.queryStepCount()](Modules.CoreMotion.Stepcounter.queryStepCount) method.

| Property | Type | Description |
|----------|------|-------------|
| start | Date | The start time to use when gathering step count data. |
| end | Date | The end time to use when gathering step count data. |

#### CoreMotionStartStepCountingArgs
> Dictionary of arguments to pass to the [StepCounter.startStepCountingUpdates()](Modules.CoreMotion.Stepcounter.startStepCountingUpdates) method.

| Property | Type | Description |
|----------|------|-------------|
| stepCounts | Number | The number of steps to record before executing the callback. The number of step… |

---

## Modules.URLSession
> Wrapper to support iOS's NSURLSession class for background downloads.
> Extends Ti.Module
> Platforms: ios
> Type: module

These APIs are supported on iOS 7 and later.

The URL session module (`com.appcelerator.urlSession`) provides the application the ability to
download large content via HTTP while the application is in the background. With this module, you can

  1. Create a URL session and a background download task.
  2. Monitor events to check the progress of the download and session.
  3. Cancel downloads and invalidate sessions.

URL session events are monitored through the following iOS application-level events:

  * <Titanium.App.iOS.backgroundtransfer>
  * <Titanium.App.iOS.downloadprogress>
  * <Titanium.App.iOS.downloadcompleted>
  * <Titanium.App.iOS.sessioncompleted>

*(See full overview in titanium-docs)*

### Properties (unique: 1/2)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| configuration | Modules.URLSession.SessionConfiguration | — | ios | The configuration used for this url session. |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| finishTasksAndInvalidate(session) | void | ios | Invalidates the given session object, allowing any outstanding tasks to finish. |
| invalidateAndCancel(session) | void | ios | Cancels all outstanding tasks and then invalidates the session object. |
| backgroundDownloadTaskWithURL(session, url) | String | ios | Creates a download task for the specified URL, within the provided session obje… |


---

## Modules.URLSession.Session
> The session object used to start new tasks.
> Extends Ti.Module
> Platforms: ios
> Type: module

These APIs are supported on iOS 7 and later.

The NSURLSession class and related classes provide an API for downloading content. 
This API provides a rich set of delegate methods for supporting authentication and gives 
your app the ability to perform background downloads when your app is not running or, in iOS, 
while your app is suspended.

[iOS Background Services guide]().

### Properties (unique: 1/3)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| configuration | Modules.URLSession.SessionConfiguration | — | ios | The configuration used for this url session. |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| finishTasksAndInvalidate(—) | void | ios | Invalidates the given session object, allowing any outstanding tasks to finish. |
| invalidateAndCancel(—) | void | ios | Cancels all outstanding tasks and then invalidates the session object. |
| downloadTask(args) | String | ios | Creates a download task for the specified URL, within the provided session obje… |
| uploadTask(args) | String | ios | Creates a upload task for the specified URL, within the provided session object… |
| dataTask(args) | String | ios | Creates a data task for the specified URL, within the provided session object a… |
| reset(callback) | void | ios | Empties all cookies, cache and credential stores, removes disk files, calls <Mo… |
| flush(callback) | void | ios | Flushes storage to disk and clear transient network caches. |


### Related Types

#### DownloadTaskType
> The parameter for [downloadTask](Modules.URLSession.Session.downloadTask) method.

| Property | Type | Description |
|----------|------|-------------|
| url | String | The remote url used for this data task. |

#### UploadDataTaskType
> The parameter for [uploadTask](Modules.URLSession.Session.uploadTask) method.

| Property | Type | Description |
|----------|------|-------------|
| url | String | The remote url used for this data task. |
| data | Ti.Blob | The data blob used for this data task. |
| method | String | The request method (e.g. POST or PUT) |
| requestHeaders | String | Additional request headers to pass to the request. |

---

## Modules.URLSession.SessionConfiguration
> The session configuration object used to create new url sessions.
> Extends Ti.Module
> Platforms: ios
> Type: module

These APIs are supported on iOS 7 and later.

An NSURLSessionConfiguration object defines the behavior and policies to use
when uploading and downloading data using an URLSession object. When uploading
or downloading data, creating a configuration object is always the first step
you must take. You use this object to configure the timeout values, caching
policies, connection requirements, and other types of information that you
intend to use with your URLSession object.

[iOS Background Services guide]().

### Properties (unique: 2/4)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| identifier | String | — | ios | The unique identifier for the configuration object. |
| HTTPHeaderFields | Object | — | ios | Specifies additional headers which will be set on outgoing requests. Keys and v… |




---

