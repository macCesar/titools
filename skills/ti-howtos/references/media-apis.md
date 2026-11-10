# Media

Based on the [current official guide](https://titaniumsdk.com/docs/build/media.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

Camera, library access and recording need their matching permissions. Playing an app-owned audio or video file does not itself require camera, microphone or music-library permission.

## Ask first

Each capability has a matching pair of methods.

| Capability | Check | Ask |
| ---------- | ----- | --- |
| Camera | `Ti.Media.hasCameraPermissions()` | `requestCameraPermissions()` |
| Photo library | `hasPhotoGalleryPermissions()` | `requestPhotoGalleryPermissions()` |
| Microphone | `hasAudioRecorderPermissions()` | `requestAudioRecorderPermissions()` |
| Music library (iOS) | `hasMusicLibraryPermissions()` | `requestMusicLibraryPermissions()` |

```js
function withCamera(done) {
  if (Ti.Media.hasCameraPermissions()) {
    done();
    return;
  }
  Ti.Media.requestCameraPermissions((e) => {
    if (e.success) {
      done();
    } else {
      Ti.API.warn('camera denied');
    }
  });
}
```

iOS also needs a usage string in `tiapp.xml`, and a missing required usage description can terminate the app when the protected API is accessed:

```xml
<ios>
  <plist>
    <dict>
      <key>NSCameraUsageDescription</key>
      <string>Attach a photo to a note.</string>
      <key>NSPhotoLibraryUsageDescription</key>
      <string>Choose a photo to attach to a note.</string>
      <key>NSMicrophoneUsageDescription</key>
      <string>Record a voice note.</string>
    </dict>
  </plist>
</ios>
```

Write the real reason. "Required by the app" is the string reviewers reject.

## The camera

```js
Ti.Media.showCamera({
  mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
  saveToPhotoGallery: false,
  success(e) {
    const image = Ti.UI.createImageView({ image: e.media, width: 200, height: 200 });
    win.add(image);
  },
  cancel() {},
  error(e) {
    Ti.API.error(e.error);
  }
});
```

`e.media` is a `Blob`. Assign it straight to an `ImageView`, or write it to a
file with `Ti.Filesystem`.

`saveToPhotoGallery` defaults to false, so a photo your app took exists only in
that blob until you save it somewhere. Write it to
`applicationDataDirectory` if it needs to outlive the screen.

Close the camera with `Ti.Media.hideCamera()` when you dismiss it yourself.

## The photo library

```js
Ti.Media.openPhotoGallery({
  mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
  allowMultiple: false,
  success(e) {
    // Single selection returns a media Blob, whose length is bytes, not item count.
    Ti.API.info('Picked one item');
  },
  cancel() {}
});
```

With `allowMultiple: true` the success event carries an `images` array instead
of a single `media`, which is the shape change to handle rather than assume.

## Audio

Three objects, for three jobs.

| Object | For |
| ------ | --- |
| `Ti.Media.Sound` | Short effects, held in memory |
| `Ti.Media.AudioPlayer` | Long files and streams |
| `Ti.Media.AudioRecorder` | Recording |

```js
const sound = Ti.Media.createSound({ url: '/audio/tap.wav' });
sound.play();

const player = Ti.Media.createAudioPlayer({ url: 'https://example.com/talk.mp3' });
player.addEventListener('change', (e) => Ti.API.info(e.description));
player.start();
```

`Sound` loads the whole file, so it is for something short. `AudioPlayer`
buffers, which is what you want for anything longer than a notification chime.

For audio that continues when the app is backgrounded, set
`Ti.Media.audioSessionCategory` and declare background audio in `tiapp.xml`.
On iOS configure both for background audio; these settings do not keep playback alive after process termination.

## Video

```js
const video = Ti.Media.createVideoPlayer({
  url: 'https://example.com/clip.mp4',
  width: Ti.UI.FILL,
  height: 240,
  autoplay: true
});
win.add(video);
win.addEventListener('close', () => {
  video.stop();
  video.release();
});
```

A `VideoPlayer` is a view, so it lays out like any other and defaults to
filling its parent. Release it when the window closes: it holds a decoder, and
leaving it alive costs memory that the platform will eventually take back by
killing the app.

## Next

[Location and maps](https://titaniumsdk.com/docs/build/location.md) covers the other capability that
needs asking first.

Contract corrections: [released Media API](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/apidoc/Titanium/Media/Media.yml), [VideoPlayer](https://github.com/tidev/titanium-sdk/blob/13_4_1_GA/apidoc/Titanium/Media/VideoPlayer.yml).
