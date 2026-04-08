# Ti.Media API Reference

## Ti.Media
> The top-level Media module.
> Extends Ti.Module
> Platforms: both
> Type: module

The Media module is used to access the device's media-related functionality, such
as using the device's camera and photo gallery, playing media files, or recording
audio or video.
For examples of using the Media APIs, refer to the
[Working with Media APIs guide](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_How-tos/Working_with_Media_APIs/)
in addition to the other media submodule API documentation.
**Note**: Some third party Android camera apps may choose to ignore video recording quality
settings. If you wish to specifically set the video quality, don't assume
`EXTRA_VIDEO_QUALITY` intent will be respected by the camera app and use Titanium's built-in
camera window which can be used to assign the `overlay` property when calling the
`showCamera()` method.

### Properties (unique: 28/178)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| QUALITY_640x480 | Number | — | both | Media type constant for medium-quality video recording. |
| QUALITY_IFRAME_1280x720 | Number | — | both | Media type constant for medium-quality video recording. |
| QUALITY_IFRAME_960x540 | Number | — | ios | Media type constant for medium-quality video recording. |
| appMusicPlayer | Ti.Media.MusicPlayer | — | ios | An instance of <Titanium.Media.MusicPlayer> representing the app-specific music… |
| audioPlaying | Boolean | — | ios | Returns `true` if the device is playing audio. |
| audioSessionCategory | String | — | ios | A constant for the audio session category to be used. |
| availableCameras | Array<Number> | — | both | Array indicating which cameras are available, `CAMERA_FRONT`, `CAMERA_REAR` or … |
| aspectRatio | Number | Titanium.Media.ASPECT_RATIO_4_3 | android | Aspect ratio of the image. |
| scalingMode | Number | Titanium.Media.IMAGE_SCALING_ASPECT_FILL | android | Scaling mode of the preview image. |
| verticalAlign | Number | Titanium.Media.VERTICAL_ALIGN_CENTER | android | Vertical align of the preview image for aspect fit. |
| useCameraX | Boolean | false | android | To use the new CameraX classes for "camera with overlay" set `useCameraX` to `t… |
| availableCameraMediaTypes | Array<String> | — | ios | Array of media type constants supported for the camera. |
| availablePhotoGalleryMediaTypes | Array<String> | — | ios | Array of media type constants supported for saving to the device's camera roll … |
| availablePhotoMediaTypes | Array<String> | — | ios | Array of media type constants supported for the photo library. |
| averageMicrophonePower | Number | — | ios | Current average microphone level in dB or -1 if microphone monitoring is disabl… |
| cameraFlashMode | Number | <Titanium.Media.CAMERA_FLASH_AUTO> on iOS, <Titanium.Media.CAMERA_FLASH_OFF> on Android | both | Determines how the flash is fired when using the device's camera. |
| canRecord | Boolean | — | both | `true` if the device has a recording input device available. |
| currentRoute | RouteDescription | — | ios | Returns a description of the current route, consisting of zero or more input po… |
| isCameraSupported | Boolean | — | both | `true` if the device has camera support. |
| cameraAuthorization | Number | — | ios | Returns the authorization status for the camera. |
| cameraOutputSizes | Object | — | android | Returns an object of possible `targetImageWidth` and `targetImageHeight` values… |
| maxZoomLevel | Number | — | android | Returns the max zoom level of the camera. |
| minZoomLevel | Number | — | android | Returns the min zoom level of the camera. |
| peakMicrophonePower | Number | — | ios | Current microphone level peak power in dB or -1 if microphone monitoring is dis… |
| systemMusicPlayer | Ti.Media.MusicPlayer | — | ios | An instance of <Titanium.Media.MusicPlayer> representing the system-wide music … |
| volume | Number | — | ios | Current volume of the playback device. |
| torch | Boolean | — | android | Enable or disable the camera torch. |
| zoomLevel | Number | — | android | Sets the zoom level of the camera. |

### Constants (147)
- **ASPECT_RATIO_16_\***: ASPECT_RATIO_16_9
- **ASPECT_RATIO_4_\***: ASPECT_RATIO_4_3
- **AUDIO_FILEFORMAT_\***: AUDIO_FILEFORMAT_3GP2, AUDIO_FILEFORMAT_3GPP, AUDIO_FILEFORMAT_AIFF, AUDIO_FILEFORMAT_AMR, AUDIO_FILEFORMAT_CAF, AUDIO_FILEFORMAT_MP3, AUDIO_FILEFORMAT_MP4, AUDIO_FILEFORMAT_MP4A, AUDIO_FILEFORMAT_WAVE
- **AUDIO_FORMAT_\***: AUDIO_FORMAT_AAC, AUDIO_FORMAT_ALAW, AUDIO_FORMAT_ILBC, AUDIO_FORMAT_IMA4, AUDIO_FORMAT_ULAW
- **AUDIO_FORMAT_APPLE_\***: AUDIO_FORMAT_APPLE_LOSSLESS
- **AUDIO_FORMAT_LINEAR_\***: AUDIO_FORMAT_LINEAR_PCM
- **AUDIO_SESSION_CATEGORY_\***: AUDIO_SESSION_CATEGORY_AMBIENT, AUDIO_SESSION_CATEGORY_PLAYBACK, AUDIO_SESSION_CATEGORY_RECORD
- **AUDIO_SESSION_CATEGORY_PLAY_AND_\***: AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD
- **AUDIO_SESSION_CATEGORY_SOLO_\***: AUDIO_SESSION_CATEGORY_SOLO_AMBIENT
- **AUDIO_SESSION_OVERRIDE_ROUTE_\***: AUDIO_SESSION_OVERRIDE_ROUTE_NONE, AUDIO_SESSION_OVERRIDE_ROUTE_SPEAKER
- **AUDIO_SESSION_PORT_\***: AUDIO_SESSION_PORT_LINEIN, AUDIO_SESSION_PORT_BUILTINMIC, AUDIO_SESSION_PORT_HEADSETMIC, AUDIO_SESSION_PORT_LINEOUT, AUDIO_SESSION_PORT_HEADPHONES, AUDIO_SESSION_PORT_BLUETOOTHA2DP, AUDIO_SESSION_PORT_BUILTINRECEIVER, AUDIO_SESSION_PORT_BUILTINSPEAKER, AUDIO_SESSION_PORT_HDMI, AUDIO_SESSION_PORT_AIRPLAY, AUDIO_SESSION_PORT_BLUETOOTHHFP, AUDIO_SESSION_PORT_USBAUDIO, AUDIO_SESSION_PORT_BLUETOOTHLE, AUDIO_SESSION_PORT_CARAUDIO
- **AUDIO_STATE_\***: AUDIO_STATE_BUFFERING, AUDIO_STATE_INITIALIZED, AUDIO_STATE_PAUSED, AUDIO_STATE_PLAYING, AUDIO_STATE_STARTING, AUDIO_STATE_STOPPED, AUDIO_STATE_STOPPING
- **AUDIO_STATE_WAITING_FOR_\***: AUDIO_STATE_WAITING_FOR_DATA
- **CAMERA_\***: CAMERA_FRONT, CAMERA_REAR
- **CAMERA_AUTHORIZATION_\***: CAMERA_AUTHORIZATION_AUTHORIZED, CAMERA_AUTHORIZATION_DENIED, CAMERA_AUTHORIZATION_RESTRICTED, CAMERA_AUTHORIZATION_UNKNOWN
- **CAMERA_FLASH_\***: CAMERA_FLASH_AUTO, CAMERA_FLASH_OFF, CAMERA_FLASH_ON
- **DEVICE_\***: DEVICE_BUSY
- **IMAGE_SCALING_\***: IMAGE_SCALING_AUTO, IMAGE_SCALING_NONE, IMAGE_SCALING_FILL
- **IMAGE_SCALING_ASPECT_\***: IMAGE_SCALING_ASPECT_FILL, IMAGE_SCALING_ASPECT_FIT
- **MEDIA_TYPE_\***: MEDIA_TYPE_PHOTO, MEDIA_TYPE_LIVEPHOTO, MEDIA_TYPE_VIDEO
- **MUSIC_MEDIA_GROUP_\***: MUSIC_MEDIA_GROUP_TITLE, MUSIC_MEDIA_GROUP_ALBUM, MUSIC_MEDIA_GROUP_ARTIST, MUSIC_MEDIA_GROUP_COMPOSER, MUSIC_MEDIA_GROUP_GENRE, MUSIC_MEDIA_GROUP_PLAYLIST
- **MUSIC_MEDIA_GROUP_ALBUM_\***: MUSIC_MEDIA_GROUP_ALBUM_ARTIST
- **MUSIC_MEDIA_GROUP_PODCAST_\***: MUSIC_MEDIA_GROUP_PODCAST_TITLE
- **MUSIC_MEDIA_TYPE_\***: MUSIC_MEDIA_TYPE_ALL, MUSIC_MEDIA_TYPE_AUDIOBOOK, MUSIC_MEDIA_TYPE_MUSIC, MUSIC_MEDIA_TYPE_PODCAST
- **MUSIC_MEDIA_TYPE_ANY_\***: MUSIC_MEDIA_TYPE_ANY_AUDIO
- **MUSIC_PLAYER_REPEAT_\***: MUSIC_PLAYER_REPEAT_ALL, MUSIC_PLAYER_REPEAT_DEFAULT, MUSIC_PLAYER_REPEAT_NONE, MUSIC_PLAYER_REPEAT_ONE
- **MUSIC_PLAYER_SHUFFLE_\***: MUSIC_PLAYER_SHUFFLE_ALBUMS, MUSIC_PLAYER_SHUFFLE_DEFAULT, MUSIC_PLAYER_SHUFFLE_NONE, MUSIC_PLAYER_SHUFFLE_SONGS
- **MUSIC_PLAYER_STATE_\***: MUSIC_PLAYER_STATE_INTERRUPTED, MUSIC_PLAYER_STATE_PAUSED, MUSIC_PLAYER_STATE_PLAYING, MUSIC_PLAYER_STATE_STOPPED
- **MUSIC_PLAYER_STATE_SEEK_\***: MUSIC_PLAYER_STATE_SEEK_BACKWARD, MUSIC_PLAYER_STATE_SEEK_FORWARD
- **NO_\***: NO_CAMERA, NO_VIDEO, NO_FOCUS
- **QUALITY_\***: QUALITY_SD, QUALITY_HD, QUALITY_FHD, QUALITY_UHD, QUALITY_HIGH, QUALITY_LOW, QUALITY_MEDIUM
- **UNKNOWN_\***: UNKNOWN_ERROR
- **VERTICAL_ALIGN_\***: VERTICAL_ALIGN_CENTER, VERTICAL_ALIGN_TOP, VERTICAL_ALIGN_BOTTOM
- **VIDEO_CONTROL_\***: VIDEO_CONTROL_DEFAULT, VIDEO_CONTROL_EMBEDDED, VIDEO_CONTROL_FULLSCREEN, VIDEO_CONTROL_HIDDEN, VIDEO_CONTROL_NONE
- **VIDEO_FINISH_REASON_PLAYBACK_\***: VIDEO_FINISH_REASON_PLAYBACK_ENDED, VIDEO_FINISH_REASON_PLAYBACK_ERROR
- **VIDEO_FINISH_REASON_USER_\***: VIDEO_FINISH_REASON_USER_EXITED
- **VIDEO_LOAD_STATE_\***: VIDEO_LOAD_STATE_FAILED, VIDEO_LOAD_STATE_PLAYABLE, VIDEO_LOAD_STATE_UNKNOWN
- **VIDEO_MEDIA_TYPE_\***: VIDEO_MEDIA_TYPE_AUDIO, VIDEO_MEDIA_TYPE_METADATA, VIDEO_MEDIA_TYPE_MUXED, VIDEO_MEDIA_TYPE_SUBTITLE, VIDEO_MEDIA_TYPE_TEXT, VIDEO_MEDIA_TYPE_TIMECODE, VIDEO_MEDIA_TYPE_VIDEO
- **VIDEO_MEDIA_TYPE_CLOSED_\***: VIDEO_MEDIA_TYPE_CLOSED_CAPTION
- **VIDEO_MEDIA_TYPE_DEPTH_\***: VIDEO_MEDIA_TYPE_DEPTH_DATA
- **VIDEO_MEDIA_TYPE_METADATA_\***: VIDEO_MEDIA_TYPE_METADATA_OBJECT
- **VIDEO_PLAYBACK_STATE_\***: VIDEO_PLAYBACK_STATE_INTERRUPTED, VIDEO_PLAYBACK_STATE_PAUSED, VIDEO_PLAYBACK_STATE_PLAYING, VIDEO_PLAYBACK_STATE_STOPPED
- **VIDEO_PLAYBACK_STATE_SEEKING_\***: VIDEO_PLAYBACK_STATE_SEEKING_BACKWARD, VIDEO_PLAYBACK_STATE_SEEKING_FORWARD
- **VIDEO_REPEAT_MODE_\***: VIDEO_REPEAT_MODE_NONE, VIDEO_REPEAT_MODE_ONE
- **VIDEO_SCALING_\***: VIDEO_SCALING_NONE, VIDEO_SCALING_RESIZE
- **VIDEO_SCALING_ASPECT_\***: VIDEO_SCALING_ASPECT_FILL, VIDEO_SCALING_ASPECT_FIT
- **VIDEO_SCALING_MODE_\***: VIDEO_SCALING_MODE_FILL
- **VIDEO_SCALING_RESIZE_\***: VIDEO_SCALING_RESIZE_ASPECT
- **VIDEO_SCALING_RESIZE_ASPECT_\***: VIDEO_SCALING_RESIZE_ASPECT_FILL
- **VIDEO_TIME_OPTION_\***: VIDEO_TIME_OPTION_EXACT
- **VIDEO_TIME_OPTION_CLOSEST_\***: VIDEO_TIME_OPTION_CLOSEST_SYNC
- **VIDEO_TIME_OPTION_NEAREST_\***: VIDEO_TIME_OPTION_NEAREST_KEYFRAME
- **VIDEO_TIME_OPTION_NEXT_\***: VIDEO_TIME_OPTION_NEXT_SYNC
- **VIDEO_TIME_OPTION_PREVIOUS_\***: VIDEO_TIME_OPTION_PREVIOUS_SYNC


### Methods (35)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| beep(—) | void | ios | Plays a device beep notification. |
| hideCamera(—) | void | both | Hides the device camera UI. |
| hideMusicLibrary(—) | void | ios | Hides the music library. |
| isMediaTypeSupported(source, type) | Boolean | ios | Returns `true` if the source supports the specified media type. |
| openMusicLibrary(options) | void | ios | Shows the music library and allows the user to select one or more tracks. |
| openPhotoGallery(options) | void | both | Opens the photo gallery image picker. |
| previewImage(options) | void | android | Displays the given image. |
| saveToPhotoGallery(media, callbacks) | void | both | Saves media to the device's photo gallery / camera roll. |
| setOverrideAudioRoute(route) | void | ios | Overrides the default audio route when using the <Titanium.Media.AUDIO_SESSION_… |
| showCamera(options) | void | both | Shows the camera. |
| hasMusicLibraryPermissions(—) | Boolean | ios | Returns `true` if the app has music library access. |
| requestMusicLibraryPermissions(callback) | void | ios | Request permissions for the native music-library. |
| queryMusicLibrary(query) | Array<Titanium.Media.Item> | ios | Searches the music library for items matching the specified search predicates. |
| startMicrophoneMonitor(—) | void | ios | Starts monitoring the microphone sound level. |
| stopMicrophoneMonitor(—) | void | ios | Stops monitoring the microphone sound level. |
| takePicture(—) | void | both | Uses the device camera to capture a photo. |
| startVideoCapture(—) | void | both | Starts video capture using the camera specified. |
| stopVideoCapture(—) | void | both | Stops video capture using the camera specified. |
| pauseVideoCapture(—) | void | android | Pauses video capturing. |
| resumeVideoCapture(—) | void | android | Resumes video capturing. |
| switchCamera(camera) | void | both | Switches between front and rear-facing cameras. Make sure to set one of the bel… |
| hasCameraPermissions(—) | Boolean | both | Returns `true` if the app has camera access. |
| requestCameraPermissions(callback) | Promise<RequestCameraAccessResult> | both | Requests for camera access. |
| hasPhotoGalleryPermissions(—) | Boolean | both | Returns `true` if the app has photo gallery permissions. |
| requestPhotoGalleryPermissions(callback) | Promise<RequestPhotoGalleryAccessResult> | both | Requests for photo gallery permissions. |
| takeScreenshot(callback) | void | both | Takes a screen shot of the visible UI on the device. |
| vibrate(pattern) | void | both | Makes the device vibrate. |
| hasAudioPermissions(—) | Boolean | ios | Returns `true` if the app has audio permissions. |
| hasAudioRecorderPermissions(—) | Boolean | both | Returns `true` if the app has audio permissions. |
| requestAudioRecorderPermissions(callback) | Promise<MediaAuthorizationResponse> | both | Request the user's permission for audio recording. |
| createAudioPlayer(parameters) | Ti.Media.AudioPlayer | both | Creates and returns an instance of <Titanium.Media.AudioPlayer>. |
| createAudioRecorder(parameters) | Ti.Media.AudioRecorder | both | Creates and returns an instance of <Titanium.Media.AudioRecorder>. |
| createSound(parameters) | Ti.Media.Sound | both | Creates and returns an instance of <Titanium.Media.Sound>. |
| createSystemAlert(parameters) | Ti.Media.SystemAlert | ios | Creates and returns an instance of <Titanium.Media.SystemAlert>. |
| createVideoPlayer(parameters) | Ti.Media.VideoPlayer | both | Creates and returns an instance of <Titanium.Media.VideoPlayer>. |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| cameraready | android | Fires when the camera overlay is ready to take pictures. |
| routechange | ios | Fired when an audio line type change is detected. |
| volume | ios | Fired when the volume output changes. |

### Related Types

#### CameraOptionsType
> Simple object for specifying options to [showCamera](Titanium.Media.showCamera).

| Property | Type | Description |
|----------|------|-------------|
| success | Callback<CameraMediaItemType> | Function to call when the camera is closed after a successful capture/selection. |
| open | Callback<CameraOpen> | Function to call when the camera is shown |
| error | Callback<FailureResponse> | Function to call upon receiving an error. |
| cancel | Callback<FailureResponse> | Function to call if the user presses the cancel button. |
| recording | Callback<CameraRecordingCallback> | Function to call during recording. Returns size and duration. |
| androidback | Callback<FailureResponse> | Function to call if the user presses the back button. |
| autohide | Boolean | Specifies if the camera should be hidden automatically after the media capture … |
| animated | Boolean | Specifies if the dialog should be animated upon showing and hiding. |
| saveToPhotoGallery | Boolean | Specifies if the media should be saved to the photo gallery upon successful cap… |
| allowEditing | Boolean | Specifies if the media should be editable after capture/selection. |
| zoomEnabled | Boolean | Specifies if pinch to zoom is enabled or not. |
| targetImageWidth | Number | Maximum width of the saved image. Depending on your phone and your value this m… |
| targetImageHeight | Number | Maximum height of the saved image. Depending on your phone and your value this … |
| mediaTypes | Array<String> | Array of media type constants to allow. Note: If you want to select live photos… |
| videoMaximumDuration | Number | Maximum duration (in milliseconds) to allow video capture before completing. |
| videoQuality | Number | Constant to indicate the video quality during capture. |
| whichCamera | Number | Opens the camera with the specified camera direction. |
| showControls | Boolean | Indicates if the built-in camera controls should be displayed. |
| overlay | Ti.UI.View | View to added as an overlay to the camera UI (on top). |
| transform | Ti.UI.Matrix2D | Transformation matrix to apply to the camera or photogallery view. |
| inPopOver | Boolean | Show the camera in a popover. |
| popoverView | Ti.UI.View | View to position the camera or photo gallery popover on top of. |
| arrowDirection | Number | Controls the type of arrow and position of the popover. |
| autorotate | Boolean | Determines if the camera preview should rotate or not. |

#### MediaQueryType
> A specifier for a media library query. By default, filters perform an exact match.

| Property | Type | Description |
|----------|------|-------------|
| grouping | Number | A constant that specifies the ordering of the result array. |
| mediaType | MediaQueryInfoType \| Number | The media type to filter on. |
| title | MediaQueryInfoType \| String | The title to filter on. Value should be a String. |
| albumTitle | MediaQueryInfoType \| String | The album title to filter on. Value should be a String. |
| artist | MediaQueryInfoType \| String | The artist to filter on. Value should be a String. |
| albumArtist | MediaQueryInfoType \| String | The album artist to filter on. Value should be a String. |
| genre | MediaQueryInfoType \| String | The genre to filter on. Value should be a String. |
| composer | MediaQueryInfoType \| String | The composer to filter on. Value should be a String. |
| isCompilation | MediaQueryInfoType \| Boolean | Filter by whether or not the item is a compilation. The value should be a Boole… |
| playCount | MediaQueryInfoType \| Number | The play count to filter on. Value should be a Number. |
| persistentID | MediaQueryInfoType \| Number | The persistent ID to filter on. Value should be a Number. |
| albumPersistentID | MediaQueryInfoType \| Number | The album persistent ID to filter on. Value should be a Number. |
| albumArtistPersistentID | MediaQueryInfoType \| Number | The album artist persistent ID to filter on. Value should be a Number. |
| genrePersistentID | MediaQueryInfoType \| Number | The genre persistent ID to filter on. Value should be a Number. |
| composerPersistentID | MediaQueryInfoType \| Number | The composer persistent ID to filter on. Value should be a Number. |
| isCloudItem | MediaQueryInfoType \| Boolean | Filter by whether or not the item is a cloud item. Value should be a Boolean. |
| hasProtectedAsset | MediaQueryInfoType \| Boolean | Filter by whether or not the item is a protected asset. Value should be a Boole… |
| podcastTitle | MediaQueryInfoType \| String | The podcast title to filter on. Value should be a String. |
| podcastPersistentID | MediaQueryInfoType \| Number | The podcast persistent ID to filter on. Value should be a Number. |

#### MusicLibraryOptionsType
> Simple object for specifying options to [openMusicLibrary](Titanium.Media.openMusicLibrary).

| Property | Type | Description |
|----------|------|-------------|
| success | Callback<MusicLibraryResponseType> | Function to call when the music library selection is made. |
| error | Callback<FailureResponse> | Function to call upon receiving an error. |
| cancel | Callback<FailureResponse> | Function to call if the user presses the cancel button. |
| autohide | Boolean | Specifies that the library should be hidden automatically after media selection… |
| animated | Boolean | Boolean if the dialog should be animated when showing and hiding. |
| mediaTypes | Number \| Array<Number> | An array of media type constants defining selectable media. |
| allowMultipleSelections | Boolean | Set to `true` to allow the user to select multiple items from the library. |

*Plus 2 more types: *

---

## Ti.Media.Android
> Android-specific media-related functionality.
> Extends Ti.Module
> Platforms: android
> Type: module


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| scanMediaFiles(paths, mimeTypes, callback) | void | android | Scans newly created or downloaded media files to make them available to other A… |
| setSystemWallpaper(image, scale) | void | android | Set the system homescreen wallpaper. |


---

## Ti.Media.AudioPlayer
> An audio player object used for streaming audio to the device, and low-level control of the audio playback.
> Extends Ti.Proxy
> Platforms: both

On Android, when you are done playing a given audio file, you must call the
[release](Titanium.Media.AudioPlayer.release) method to stop buffering audio data and
release associated system resources. Since 7.5.0, this method is available on iOS as well
and will release all audio-player related resources. After this method has been called,
the object should not be accessed anymore.

On iOS, you can control how the audio stream interacts with other system sounds
by setting <Titanium.Media.audioSessionCategory>. Since Titanium 7.5.0, this API
uses the [AVPlayer API](https://developer.apple.com/documentation/avfoundation/avplayer) for a more modern
and performant audio playback.

Use the <Titanium.Media.createAudioPlayer> method to create an audio player.

### Properties (unique: 20/38)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allowBackground | Boolean | false | android | Boolean to indicate if audio should continue playing even if the associated And… |
| audioFocus | Boolean | false | android | Focuses on the current audio player and stops other audio playing. |
| audioSessionId | Number | — | android | Returns the audio session id. |
| audioType | Number | <Titanium.Media.AudioPlayer.AUDIO_TYPE_MEDIA> | android | Changes the audio-stream-type. |
| bitRate | Number | — | ios | Bit rate of the current playback stream. |
| duration | Number | — | both | Estimated duration in milliseconds of the file being played. |
| idle | Boolean | — | ios | Boolean indicating if the player is idle. |
| muted | Boolean | — | both | Indicates whether or not audio output of the player is muted. |
| externalPlaybackActive | Boolean | — | ios | Indicates whether the player is currently playing video in "external playback" … |
| allowsExternalPlayback | Boolean | true | ios | Indicates whether the player allows switching to "external playback" mode. |
| rate | Number | 0 | ios | Indicates the desired rate of playback; 0.0 means "paused", 1.0 indicates a des… |
| paused | Boolean | — | both | Boolean indicating if audio playback is paused. |
| playing | Boolean | — | both | Boolean indicating if audio is currently playing. |
| progress | Number | — | ios | Current playback progress, in milliseconds. |
| state | Number | — | ios | Current state of playback, specified using one of the `STATE` constants defined… |
| url | String | — | both | URL for the audio stream. |
| volume | Number | — | both | Volume of the audio, from 0.0 (muted) to 1.0 (loudest). |
| waiting | Boolean | — | ios | Boolean indicating if the playback is waiting for audio data from the network. |
| bufferSize | Number | — | ios | Size of the buffer used for streaming, in milliseconds. |
| time | Number | — | android | Current playback position of the audio. |

### Constants (15)
- **AUDIO_TYPE_\***: AUDIO_TYPE_ALARM, AUDIO_TYPE_SIGNALLING, AUDIO_TYPE_MEDIA, AUDIO_TYPE_NOTIFICATION, AUDIO_TYPE_RING, AUDIO_TYPE_VOICE
- **STATE_\***: STATE_BUFFERING, STATE_INITIALIZED, STATE_PAUSED, STATE_PLAYING, STATE_STARTING, STATE_STOPPED, STATE_STOPPING
- **STATE_WAITING_FOR_\***: STATE_WAITING_FOR_DATA, STATE_WAITING_FOR_QUEUE


### Methods (14)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getPaused(—) | Boolean | ios | Returns the value of the [paused](Titanium.Media.AudioPlayer.paused) property. |
| isPaused(—) | Boolean | android | Returns the value of the [paused](Titanium.Media.AudioPlayer.paused) property. |
| getPlaying(—) | Boolean | ios | Returns the value of the [playing](Titanium.Media.AudioPlayer.playing) property. |
| isPlaying(—) | Boolean | android | Returns the value of the [playing](Titanium.Media.AudioPlayer.playing) property. |
| pause(—) | void | both | Pauses audio playback. |
| play(—) | void | android | Starts or resumes audio playback. |
| setPaused(paused) | void | ios | Sets the value of the [paused](Titanium.Media.AudioPlayer.paused) property. |
| seekToTime(time) | void | ios | Moves the playback cursor and invokes the specified block when the seek operati… |
| release(—) | void | both | Stops buffering audio data and releases audio resources. |
| getAudioSessionId(—) | Number | android | Returns the audio session id. |
| start(—) | void | both | Starts or resumes audio playback. |
| restart(—) | void | both | Restarts (stops and stars) audio playback. |
| stateDescription(state) | String | ios | Converts a [state](Titanium.Media.AudioPlayer.state) value into a text descript… |
| stop(—) | void | both | Stops audio playback. |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| change | both | Fired when the state of the playback changes. |
| complete | both | Fired when the audio has finished playing. |
| metadata | ios | Fired when the timed metadata was encountered most recently within the media as… |
| error | both | Fired when there's an error. |
| progress | both | Fired once per second with the current progress during playback. |
| seek | ios | Fired once the [seekToTime](Titanium.Media.AudioPlayer.seek) method completes. |

---

## Ti.Media.AudioRecorder
> An audio recorder object used for recording audio from the device microphone.
> Extends Ti.Proxy
> Platforms: both

Use the <Titanium.Media.createAudioRecorder> method to create an audio recorder.

Ensure to request the permissions for audio-recording before starting a new record-session.
This can be done by using <Titanium.Media.hasAudioRecorderPermissions> to check whether
audio-permissions are granted and <Titanium.Media.requestAudioRecorderPermissions> to 
request audio-permissions. 

**Android Platform Note**: On Android, you also need to include the following permission
into the `<android>` section of the tiapp.xml:

``` xml

### Properties (unique: 5/8)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| compression | Number | <Titanium.Media.AUDIO_FORMAT_LINEAR_PCM> | ios | Audio compression to be used for the recording. |
| format | Number | <Titanium.Media.AUDIO_FILEFORMAT_CAF> | ios | Audio format to be used for the recording. |
| paused | Boolean | — | both | Indicates if the audio recorder is paused. |
| recording | Boolean | — | both | Indicates if the audio recorder is recording. |
| stopped | Boolean | — | both | Indicates if the audio recorder is stopped. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| pause(—) | void | both | Pauses the current audio recording. |
| resume(—) | void | both | Resumes a paused recording. |
| start(—) | void | both | Starts an audio recording. |
| stop(—) | Ti.Filesystem.File | both | Stops the current audio recording and returns the recorded audio file. |


---

## Ti.Media.Item
> A representation of a media item returned by [openMusicLibrary](Titanium.Media.openMusicLibrary) or [queryMusicLibrary](Titanium.Media.queryMusicLibrary).
> Extends Ti.Proxy
> Platforms: ios

This is a read-only object that describes a single media item, not a playlist. 
Titanium does not support access to playlists.

`Item` objects cannot be created explicitly.  The 
[openMusicLibrary](Titanium.Media.openMusicLibrary) returns `Item` objects in its
`success` callback function, while [queryMusicLibrary](Titanium.Media.queryMusicLibrary)
returns an array of `Item` objects.

### Properties (unique: 36/38)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| albumArtist | String | — | ios | Artist credited for the album containing this item. |
| albumArtistPersistentID | Number | — | ios | The persistent identifier for an album artist. |
| albumPersistentID | Number | — | ios | The key for the persistent identifier for an album. |
| albumTitle | String | — | ios | Title of the album containing this item. |
| albumTrackCount | Number | — | ios | Number of tracks for the album containing this item. |
| albumTrackNumber | Number | — | ios | Track number for this item. |
| artist | String | — | ios | Artist credited for this item. |
| artwork | Ti.Blob | — | ios | Image for the item's artwork as a `Blob` object, or `null` if no artwork is ava… |
| assetURL | String | — | ios | A URL pointing to the media item. |
| beatsPerMinute | Number | — | ios | The number of musical beats per minute for the media item. |
| bookmarkTime | String | — | ios | The user's place in the media item the most recent time it was played. |
| comments | String | — | ios | Textual information about the media item. |
| composer | String | — | ios | Composer of this item. |
| dateAdded | Date | — | ios | Date when the item was added to the music library. |
| discCount | Number | — | ios | Total number of discs for the album containing this item. |
| discNumber | Number | — | ios | Disc number for this item in the album. |
| genre | String | — | ios | Genre of this item. |
| genrePersistentID | Number | — | ios | The persistent identifier for a genre. |
| hasProtectedAsset | Boolean | — | ios | True if the item represents a protected asset. |
| isCloudItem | Boolean | — | ios | True if the media item is an iCloud item. |
| isCompilation | Boolean | — | ios | True if this item is part of a compilation album. |
| isExplicit | Boolean | — | ios | True if this item is marked as "Explicit". |
| lastPlayedDate | Date | — | ios | The most recent calendar date on which the user played the media item. |
| lyrics | String | — | ios | Lyrics for this item. |
| mediaType | Number | — | ios | The type of the media. |
| persistentID | String | — | ios | The key for the persistent identifier for the media item. |
| playCount | Number | — | ios | Number of times the item has been played. |
| playbackDuration | Number | — | ios | Length (in seconds) of this item. |
| playbackStoreID | Number | — | ios | Used to enqueue store tracks by their ID. |
| podcastTitle | String | — | ios | Title of a podcast item. |
| podcastPersistentID | Number | — | ios | The persistent identifier for an audio podcast. |
| rating | Number | — | ios | Rating for this item. |
| releaseDate | Date | — | ios | Date when this this item was released. |
| skipCount | Number | — | ios | Number of times this item has been skipped. |
| title | String | — | ios | Title of this item. |
| userGrouping | String | — | ios | Grouping information for the media item. |




---

## Ti.Media.MusicPlayer
> This object represents a music controller.
> Extends Ti.Proxy
> Platforms: ios

A `MusicPlayer` lets you manage and playback a queue of media [Item](Titanium.Media.Item) objects.

To retrieve an instance of a MusicPlayer object, use either the

### Properties (unique: 5/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| currentPlaybackTime | Number | — | ios | Current point in song playback, in seconds. |
| nowPlaying | Ti.Media.Item | — | ios | An `Item` object representing the currently playing media item. |
| playbackState | Number | — | ios | Playback state. |
| repeatMode | Number | — | ios | Repeat setting. |
| shuffleMode | Number | — | ios | Shuffle setting. |


### Methods (10)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| pause(—) | void | ios | Pauses playback of the current media item. |
| play(—) | void | ios | Begins playback of the current media item. |
| seekBackward(—) | void | ios | Begins seeking backward in the currently playing media. |
| seekForward(—) | void | ios | Begins seeking forward in the currently playing media item. |
| setQueue(queue) | void | ios | Sets the media queue. |
| skipToBeginning(—) | void | ios | Skips to the beginning of the currently playing media item. |
| skipToNext(—) | void | ios | Skips to the next media item in the queue. |
| skipToPrevious(—) | void | ios | Skips to the previous media item in the queue. |
| stop(—) | void | ios | Stops playback of the current media queue. |
| stopSeeking(—) | void | ios | Ends a seek operation and returns to the previous playback state. See also: [se… |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| playingchange | ios | Fired when the currently playing media item changes. |
| statechange | ios | Fired when the music player's playback state changes. |

---

## Ti.Media.Sound
> An object for playing basic audio resources.
> Extends Ti.Proxy
> Platforms: both

The `Sound` object loads the entire media resource in memory before playing.  If you need to 
support streaming, use the [AudioPlayer](Titanium.Media.AudioPlayer) API.

You can control how the sound interacts with other system sounds
by setting <Titanium.Media.audioSessionCategory>.

Use the <Titanium.Media.createSound> method to create a `Sound` object. You can play audio 
in any format supported by the target platform(s), as described in the following documents:

* [Android](https://developer.android.com/guide/topics/media/media-formats#core)
* [iOS](https://developer.apple.com/audio/)

### Properties (unique: 9/27)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allowBackground | Boolean | false | android | Determines whether the audio should continue playing even when its activity is … |
| audioType | Number | <Titanium.Media.AudioPlayer.AUDIO_TYPE_MEDIA> | android | Changes the audio-stream-type. |
| duration | Number | — | both | Duration of the audio resource. |
| looping | Boolean | false | both | Determines whether the audio should loop upon completion. |
| paused | Boolean | — | both | Indicates if the audio is paused. |
| playing | Boolean | — | both | Indicates if the audio is playing. |
| time | Number | — | both | Current playback position of the audio. |
| url | String | — | both | URL identifying the audio resource. |
| volume | Number | — | both | Volume of the audio from 0.0 (muted) to 1.0 (loudest). |

### Constants (15)
- **AUDIO_TYPE_\***: AUDIO_TYPE_ALARM, AUDIO_TYPE_SIGNALLING, AUDIO_TYPE_MEDIA, AUDIO_TYPE_NOTIFICATION, AUDIO_TYPE_RING, AUDIO_TYPE_VOICE
- **STATE_\***: STATE_BUFFERING, STATE_INITIALIZED, STATE_PAUSED, STATE_PLAYING, STATE_STARTING, STATE_STOPPED, STATE_STOPPING
- **STATE_WAITING_FOR_\***: STATE_WAITING_FOR_DATA, STATE_WAITING_FOR_QUEUE


### Methods (10)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isLooping(—) | Boolean | both | Returns the value of the [looping](Titanium.Media.Sound.looping) property. |
| isPaused(—) | Boolean | both | Returns the value of the [paused](Titanium.Media.Sound.paused) property. |
| isPlaying(—) | Boolean | both | Returns the value of the [playing](Titanium.Media.Sound.playing) property. |
| pause(—) | void | both | Pauses the audio. |
| play(—) | void | both | Starting playing the sound, or resume playing a paused sound. |
| release(—) | void | both | Releases all internal resources. |
| reset(—) | void | both | Resets the audio playback position to the beginning. |
| setLooping(looping) | void | both | Sets the value of the [looping](Titanium.Media.Sound.looping) property. |
| setPaused(paused) | void | ios | Sets the value of the [paused](Titanium.Media.Sound.paused) property. |
| stop(—) | void | both | Stops playing the audio and resets the playback position to the beginning of th… |

### Events (5)
| Event | Platform | Description |
|-------|----------|-------------|
| change | android | Fired when the state of the playback changes. |
| complete | both | Fired when the audio has finished playing. |
| error | both | Fired when an error occurs while playing the audio. |
| interrupted | ios | Fired when audio playback is interrupted by the device. |
| resume | ios | Fired when audio playback is resumed after an interruption. |

---

## Ti.Media.SystemAlert
> An object for playing system sounds.
> Extends Ti.Proxy
> Platforms: ios

You can use this module to provide audible system alerts. 

You can use it to play short (30 seconds or shorter) sounds. The interface does not provide level, positioning, 
looping, or timing control, and does not support simultaneous playback: You can play only one sound at a time. 

This module differs from the Sound module because it honors the ringtone volume, not the Music volume.

Use the <Titanium.Media.createSystemAlert> method to create a `SystemAlert` object.

Know more about [System Sound Services](https://developer.apple.com/reference/audiotoolbox/1657326-system_sound_services).

### Properties (unique: 1/3)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| url | String | — | ios | URL identifying the audio resource. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| play(—) | void | ios | Start playing the system alert. |


---

## Ti.Media.VideoPlayer
> A native control for playing videos.
> Extends Ti.UI.View
> Platforms: both

The video player is a native view that can be used to play videos, either stored
locally or streamed from a web server. The player can occupy the full screen, or can
be used as a view that can be added to other views.

Use the <Titanium.Media.createVideoPlayer> method to create a video player.

All platforms support specifying the video content as a URL, either to a local file or
a remote stream. This is done by setting the [url](Titanium.Media.VideoPlayer.url) property.

### iOS Implementation Notes

On iOS, video content can also be specified as a [Blob](Titanium.Blob) or
[File](Titanium.Filesystem.File) object using the
[media](Titanium.Media.VideoPlayer.media) property.


*(See full overview in titanium-docs)*

### Properties (unique: 27/99)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allowsAirPlay | Boolean | — | ios | Whether or not the current movie can be played on a remote device. |
| autoplay | Boolean | true | both | Indicates if a movie should automatically start playback. |
| autoHide | Boolean | false | android | Indicates if player is hidden by default and shown when its ready. |
| backgroundView | Ti.UI.View | — | ios | Sets the background view for customization which is always displayed behind mov… |
| currentPlaybackTime | Number | — | both | Current playback time of the current movie in milliseconds. |
| duration | Number | 0 | both | The duration of the current movie in milliseconds, or 0.0 if not known. |
| endPlaybackTime | Number | 0 | both | The end time of movie playback, in milliseconds. |
| fairPlayConfiguration | FairPlayConfiguration | — | ios | Handle DRM-encrypted video assets using the [Apple FairPlay Streaming API](http… |
| fullscreen | Boolean | false | android | Determines if the movie is presented in the entire screen (obscuring all other … |
| initialPlaybackTime | Number | 0 | both | The start time of movie playback, in milliseconds. |
| loadState | Number | — | both | Returns the network load state of the movie player. |
| media | Ti.Blob \| Ti.Filesystem.File \| String | — | ios | Media object to play, as either a `Ti.Filesystem.File`, a `Ti.Blob`, or an URL … |
| mediaControlStyle | Number | System default video controls (<Titanium.Media.VIDEO_CONTROL_DEFAULT>). | android | The style of the playback controls. |
| mediaTypes | String | <Titanium.Media.VIDEO_MEDIA_TYPE_VIDEO> | ios | The type of media in the player's current item first track. |
| moviePlayerStatus | Number | — | ios | Returns the status of the movie player. |
| naturalSize | MovieSize | — | ios | Returns the natural size of the movie. |
| speed | Number | — | android | Playback speed of the video. |
| overlayView | Ti.UI.View | — | ios | Use the overlay view to add additional custom views between the video content a… |
| pictureInPictureEnabled | Boolean | true | ios | Whether or not the receiver allows Picture in Picture playback. |
| playableDuration | Number | 0 | both | Currently playable duration of the movie, in milliseconds, for progressively do… |
| playbackState | Number | — | both | Current playback state of the video player. |
| playing | Boolean | — | both | Boolean to indicate if the player has started playing. |
| repeatMode | Number | Titanium.Media.VIDEO_REPEAT_MODE_NONE | both | Determines how the movie player repeats when reaching the end of playback. |
| scalingMode | Number | <Titanium.Media.VIDEO_SCALING_RESIZE_ASPECT> on Android, <Titanium.Media.VIDEO_SCALING_RESIZE> on iOS | both | Determines how the content scales to fit the view. |
| showsControls | Boolean | true | both | Whether or not the receiver shows playback controls. Default is true. |
| url | String | — | both | URL of the media to play. |
| volume | Number | 1 | both | Volume of the audio portion of the video. |


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| cancelAllThumbnailImageRequests(—) | void | both | Cancels all pending asynchronous thumbnail requests. |
| pause(—) | void | both | Pauses playing the video. |
| play(—) | void | both | Starts playing the video. |
| release(—) | void | both | Releases the internal video resources immediately. |
| requestThumbnailImagesAtTimes(times, option, callback) | void | both | Asynchronously request thumbnail images for one or more points in time in the v… |
| stop(—) | void | both | Stops playing the video. |

### Events (15)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the device detects a click against the view. |
| singletap | android | Fired when the device detects a single tap against the view. |
| touchcancel | android | Fired when a touch event is interrupted by the device. |
| touchend | android | Fired when a touch event is completed. |
| touchmove | android | Fired as soon as the device detects movement of a touch. |
| complete | both | Fired when movie playback ends or a user exits playback. |
| durationavailable | both | Fired when the video duration is available. |
| error | both | Fired when movie playback encounters an error. |
| load | both | Fired when the movie play loads. |
| loadstate | both | Fired when the network [loadState](Titanium.Media.VideoPlayer.loadState) change… |
| naturalsizeavailable | ios | Fired when the natural size of the current movie is determined. |
| playbackstate | both | Fired when the [playbackState](Titanium.Media.VideoPlayer.playbackState) change… |
| playing | both | Fired when the currently playing movie changes. |
| preload | android | Fired when the movie has preloaded and is ready to play. |
| resize | ios | Fired when the movie player is resized. |

### Related Types

#### FairPlayConfiguration
> An object representing a FairPlay Streaming configuration.

| Property | Type | Description |
|----------|------|-------------|
| licenseURL | String | The FairPlay Streaming license URL to handle the server-side authentication flo… |
| certificate | Ti.Blob | The FairPlay Streaming public certificate to authenticate the content key reque… |

#### MovieSize
> Simple object used to describe the size of a movie.

| Property | Type | Description |
|----------|------|-------------|
| width | Number | Width of the movie. |
| height | Number | Height of the movie. |

---

