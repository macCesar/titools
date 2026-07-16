# Media APIs

## 1. Audio APIs

### Playing basic sounds (Ti.Media.Sound)
- Use for short effects, beeps, ambient audio
- The entire file loads into memory. Use `preload=true` to reduce delay.
- Methods: `play()`, `pause()`, `stop()`, `setVolume()`
- `allowBackground=true` keeps playback going when the app closes

```javascript
const sound = Ti.Media.createSound({
  url: 'beep.mp3',
  preload: true
});
sound.play();
```

### Streaming audio (Ti.Media.AudioPlayer)
- Use for streaming web URLs (MP3, HLS)
- Supports pseudo-streaming and HLS
- Handle interruptions (phone calls) with app-level events:
  - `pause`: call `setPaused(true)` or `pause()`
  - `resume`: call `setPaused(false)` or `start()`

```javascript
const streamer = Ti.Media.createAudioPlayer({ url: 'https://example.com/stream.mp3' });
streamer.start();

Ti.App.addEventListener('pause', () => { streamer.setPaused(true); });
Ti.App.addEventListener('resume', () => { streamer.setPaused(false); });
```

### Recording audio (Ti.Media.AudioRecorder)
- Requires microphone permission
- Properties:
  - `compression`: `Ti.Media.AUDIO_FORMAT_ULAW` (low-fi) or `AUDIO_FORMAT_LINEAR_PCM` (hi-fi)
  - `format`: `Ti.Media.AUDIO_FILEFORMAT_WAVE`
- Methods: `start()`, `pause()`/`resume()`, `stop()`

## 2. Video APIs (Ti.Media.VideoPlayer)

### Cross-platform considerations
- Android: must be fullscreen (Intent-based, not a view proxy)
- iOS: can be embedded or fullscreen; set `height` and `width` for embedded

### Basic usage
- `url`: local file path or remote URL
- `autoplay=true`: auto-start when rendered
- `movieControlStyle`: `Ti.Media.VIDEO_CONTROL_EMBEDDED` for embedded controls
- `scalingMode`: control fill/fit behavior

```javascript
const videoPlayer = Ti.Media.createVideoPlayer({
  url: 'movie.mp4',
  scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FIT // or ASPECT_FILL, MODE_FILL, NONE
});
```

```javascript
const player = Ti.Media.createVideoPlayer({
  url: 'movie.mp4',
  movieControlStyle: Ti.Media.VIDEO_CONTROL_EMBEDDED,
  autoplay: true
});

// iOS only: add to window
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
  win.add(player);
}

// Stop when window closes
win.addEventListener('close', () => { player.stop(); });
```

### Key events
- `complete`: playback ended (check `e.reason` vs `Ti.Media.VIDEO_FINISH_REASON_PLAYBACK_ENDED`)
- `load`: movie finished loading
- `fullscreen`: entered/exited fullscreen (check `e.entering`)

## 3. Camera and photo gallery APIs

### Camera availability and permissions
Always check device support and permissions before opening the camera:

```javascript
if (!Ti.Media.isCameraSupported) {
  Ti.API.warn('No camera available on this device');
  return;
}

if (Ti.Media.hasCameraPermissions()) {
  openCamera();
} else {
  Ti.Media.requestCameraPermissions((e) => {
    if (e.success) {
      openCamera();
    } else {
      Ti.API.error('Camera permission denied');
    }
  });
}
```

Required `tiapp.xml` keys (iOS):

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save photos</string>
```

### Camera (Ti.Media.showCamera)
- Requires camera permission and usage descriptions
- Success callback provides `event.media` (Blob)
- Use `saveToPhotoGallery: true` to auto-save
- Handle `cancel` and `error` callbacks

### Front and rear camera
```javascript
const cameras = Ti.Media.availableCameras;

// Check if front camera exists
if (cameras.indexOf(Ti.Media.CAMERA_FRONT) !== -1) {
  Ti.Media.showCamera({
    whichCamera: Ti.Media.CAMERA_FRONT,
    // ... other options
  });
}

// Switch camera programmatically
Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
```

### Advanced camera options (iOS)
| Property               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `autohide`             | Auto-hide camera after capture (default: true)  |
| `animated`             | Animate camera appearance                       |
| `allowEditing`         | Allow user to crop/edit after capture           |
| `mediaTypes`           | Array: `MEDIA_TYPE_PHOTO`, `MEDIA_TYPE_VIDEO`   |
| `videoMaximumDuration` | Max video duration in milliseconds              |
| `videoQuality`         | `QUALITY_HIGH`, `QUALITY_MEDIUM`, `QUALITY_LOW` |
| `overlay`              | Custom `Ti.UI.View` overlay on camera           |
| `showControls`         | Show/hide default camera controls               |

When using a custom overlay, call `Ti.Media.takePicture()` to capture and `Ti.Media.hideCamera()` to dismiss.

### Gallery (Ti.Media.openPhotoGallery)
- Success callback provides `event.media` (Blob)
- Note: `event.media` may only contain file info. Use `Ti.Filesystem.getFile(event.media.nativePath)` to access the actual file.

### iPad-specific gallery options
On iPad, the photo gallery opens as a popover. Configure its position:

```javascript
Ti.Media.openPhotoGallery({
  popoverView: myButton, // Anchor popover to this view
  arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
  success: (e) => { /* ... */ }
});
```

### Memory management
Use `imageAsResized()` on blobs to avoid memory exhaustion. Resize to target dimensions before assigning to an ImageView.

```javascript
Ti.Media.showCamera({
  success: (event) => {
    const blob = event.media.imageAsResized(800, 600);
    imageView.image = blob;
  },
  cancel: () => { Ti.API.info('Camera canceled'); },
  error: (e) => { Ti.API.error(`Camera error: ${e.error}`); }
});
```

## 4. Images and ImageView APIs

### Background images
- Scaled to fit component dimensions by default
- iOS: use `backgroundLeftCap` and `backgroundTopCap` to control stretch regions
- Android: supports remote URLs as background images; iOS does not

### Image stretching (background images)
When using small images as backgrounds, iOS and Android stretch differently:
- `backgroundLeftCap` (iOS): pixels from the left that are not stretched. The middle section stretches.
- `backgroundTopCap` (iOS): pixels from the top that are not stretched.
- Android: supports remote URLs for background images; iOS does not.

### ImageView component
- `image` accepts: URL, local path, or `Ti.Filesystem.File`
- Scaling behavior:
  - Both `height` and `width` specified: unproportional scale (aspect ratio not maintained)
  - Only one dimension specified: proportional scale (aspect ratio maintained)
- `defaultImage`: local image to show while remote image loads

### Density-specific images

Android: place in resolution-specific directories:
- `res-ldpi`, `res-mdpi`, `res-hdpi`, `res-xhdpi`, `res-xxhdpi`, `res-xxxhdpi`

iOS: use naming convention:
- `foo.png` - non-retina
- `foo@2x.png` - retina
- `foo@3x.png` - iPhone 6 Plus
- `foo~iphone.png` - iPhone-specific
- `foo~ipad.png` - iPad-specific

For remote density-specific images on iOS:

```javascript
const density = Ti.Platform.displayCaps.logicalDensityFactor;
const url = `https://example.com/image@${density}x.png`;
const imageView = Ti.UI.createImageView({
  image: url,
  hires: true // Indicates high-resolution remote image
});
```

### Flipbook animations
- Assign an array of images to `images`
- `duration`: milliseconds between frames
- `repeatCount`: 0 = infinite, >1 = specific count

```javascript
const frames = [];
for (let i = 1; i < 18; i++) {
  frames.push(`frame${i}.png`);
}
const animationView = Ti.UI.createImageView({
  images: frames,
  duration: 100,
  repeatCount: 0
});
// animationView.stop() / animationView.start() to control
```

## Permissions checklist

### iOS (tiapp.xml)
```xml
<ios>
  <plist>
    <dict>
      <key>NSCameraUsageDescription</key>
      <string>Need camera to take photos</string>
      <key>NSPhotoLibraryUsageDescription</key>
      <string>Need photo library access</string>
      <key>NSMicrophoneUsageDescription</key>
      <string>Need microphone for audio recording</string>
    </dict>
  </plist>
</ios>
```

### Android (tiapp.xml)
```xml
<android>
  <manifest>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  </manifest>
</android>
```
