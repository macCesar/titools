# Media APIs

## 1. Audio APIs

### Playing Basic Sounds (Ti.Media.Sound)
- Use for short sound effects, beeps, ambient audio
- **Entire file loads into memory** - use `preload=true` to reduce delay
- Methods: `play()`, `pause()`, `stop()`, `setVolume()`
- Property `allowBackground=true` for continued playback when app closes

```javascript
const sound = Ti.Media.createSound({
  url: 'beep.mp3',
  preload: true
});
sound.play();
```

### Streaming Audio (Ti.Media.AudioPlayer)
- Use for streaming from web URLs (MP3, HTML Live Streaming)
- Supports pseudo-streaming and HLS
- Handle interruptions (phone calls) with app-level events:
  - `pause` event: Call `setPaused(true)` or `pause()`
  - `resume` event: Call `setPaused(false)` or `start()`

```javascript
const streamer = Ti.Media.createAudioPlayer({ url: 'https://example.com/stream.mp3' });
streamer.start();

Ti.App.addEventListener('pause', () => { streamer.setPaused(true); });
Ti.App.addEventListener('resume', () => { streamer.setPaused(false); });
```

### Recording Audio (Ti.Media.AudioRecorder)
- Requires microphone permission
- Properties:
  - `compression`: `Ti.Media.AUDIO_FORMAT_ULAW` (low-fi) or `AUDIO_FORMAT_LINEAR_PCM` (hi-fi)
  - `format`: `Ti.Media.AUDIO_FILEFORMAT_WAVE`
- Methods: `start()`, `pause()`/`resume()`, `stop()`

## 2. Video APIs (Ti.Media.VideoPlayer)

### Cross-Platform Considerations
- **Android**: Must be fullscreen (Intent-based, not a view proxy)
- **iOS**: Can be embedded or fullscreen; set `height`/`width` for embedded

### Basic Usage
- `url` property: Local file path or remote URL
- `autoplay=true`: Auto-start when rendered
- `movieControlStyle`: `Ti.Media.VIDEO_CONTROL_EMBEDDED` for embedded controls
- `scalingMode`: Control fill/fit behavior

```javascript
const videoPlayer = Ti.Media.createVideoPlayer({
    url: 'movie.mp4',
    scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FIT  // or ASPECT_FILL, MODE_FILL, NONE
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

### Key Events
- `complete`: Playback ended (check `e.reason` vs `Ti.Media.VIDEO_FINISH_REASON_PLAYBACK_ENDED`)
- `load`: Movie finished loading
- `fullscreen`: Entered/exited fullscreen (check `e.entering`)

## 3. Camera and Photo Gallery APIs

### Camera Availability and Permissions

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

**Required tiapp.xml keys (iOS)**:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save photos</string>
```

### Camera (Ti.Media.showCamera)
- Requires camera permission and usage descriptions
- Success callback provides `event.media` (blob)
- Use `saveToPhotoGallery: true` to automatically save
- Handle `cancel` and `error` callbacks

### Front and Rear Camera
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

### Advanced Camera Options (iOS)
| Property | Description |
|---|---|
| `autohide` | Auto-hide camera after capture (default: true) |
| `animated` | Animate camera appearance |
| `allowEditing` | Allow user to crop/edit after capture |
| `mediaTypes` | Array: `MEDIA_TYPE_PHOTO`, `MEDIA_TYPE_VIDEO` |
| `videoMaximumDuration` | Max video duration in milliseconds |
| `videoQuality` | `QUALITY_HIGH`, `QUALITY_MEDIUM`, `QUALITY_LOW` |
| `overlay` | Custom Ti.UI.View overlay on camera |
| `showControls` | Show/hide default camera controls |

When using a custom overlay, call `Ti.Media.takePicture()` to capture and `Ti.Media.hideCamera()` to dismiss.

### Gallery (Ti.Media.openPhotoGallery)
- Success callback provides `event.media` (blob)
- Note: `event.media` may contain only file info, use `Ti.Filesystem.getFile(event.media.nativePath)` to access actual file

### iPad-Specific Gallery Options
On iPad, the photo gallery opens as a popover. Configure its position:
```javascript
Ti.Media.openPhotoGallery({
    popoverView: myButton,  // Anchor popover to this view
    arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
    success: (e) => { /* ... */ }
});
```

### Memory Management
- **Critical**: Use `imageAsResized()` on blobs to avoid memory exhaustion
- For display: Resize to target dimensions before assigning to ImageView

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

### Background Images
- Scaled to fit component dimensions by default
- **iOS**: Use `backgroundLeftCap` and `backgroundTopCap` to control stretch regions
- **Android**: Supports remote URLs as background images; iOS does not

### Image Stretching (Background Images)
When using small images as backgrounds, iOS and Android stretch differently:
- **`backgroundLeftCap`** (iOS): Number of pixels from the left that are NOT stretched. The middle section stretches.
- **`backgroundTopCap`** (iOS): Number of pixels from the top that are NOT stretched.
- **Android**: Supports remote URLs for background images; iOS does NOT.

### ImageView Component
- `image` property accepts: URL, local path, or Ti.Filesystem.File object
- Scaling behavior:
  - Both `height` AND `width` specified: Unproportional scale (aspect ratio NOT maintained)
  - Only ONE dimension specified: Proportional scale (aspect ratio maintained)
- `defaultImage`: Local image to show while remote image loads

### Density-Specific Images

**Android**: Place in resolution-specific directories:
- `res-ldpi`, `res-mdpi`, `res-hdpi`, `res-xhdpi`, `res-xxhdpi`, `res-xxxhdpi`

**iOS**: Use naming convention:
- `foo.png` - Non-retina
- `foo@2x.png` - Retina
- `foo@3x.png` - iPhone 6 Plus
- `foo~iphone.png` - iPhone-specific
- `foo~ipad.png` - iPad-specific

For remote density-specific images on iOS:
```javascript
const density = Ti.Platform.displayCaps.logicalDensityFactor;
const url = `https://example.com/image@${density}x.png`;
const imageView = Ti.UI.createImageView({
  image: url,
  hires: true  // Indicates high-resolution remote image
});
```

### Flipbook Animations
- Assign array of images to `images` property
- `duration`: Milliseconds between frames
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
// animationView.stop() / animationView.start() para controlar
```

## Permissions Checklist

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
