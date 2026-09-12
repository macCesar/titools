# Push notifications: what actually reaches your code

Receiving a push in a Titanium app is not one path. On Android a notification can reach your JavaScript through four different doors depending on what the app was doing when it arrived and what the person did with it, and the official documentation describes one of them.

iOS has one door and it works in every state. That asymmetry matters when a bug report says "it works on my iPhone": the same app, the same payload and the same handler behave differently, and the difference is not in your code.

That is the fact that explains every "the notification arrives but nothing happens" report you will find. The push is delivered, nothing errors, and the feature simply does not run, because the code is listening at a door the message never came through.

This file is about the community module [`firebase.cloudmessaging`](https://github.com/hansemannn/titanium-firebase-cloud-messaging), which is how Titanium apps do FCM. `Ti.Network.registerForPushNotifications()` exists on Android too, but its job there is the `POST_NOTIFICATIONS` runtime permission, not the token: it never reads a `callback` and never returns a `deviceToken`. The FCM token comes from the module.

<!-- TOC-START -->
## Contents

- [Contents](#contents)
- [1. The four doors](#1-the-four-doors)
- [2. The payload decides how much of the module runs](#2-the-payload-decides-how-much-of-the-module-runs)
- [3. A tap does not fire `didReceiveMessage`](#3-a-tap-does-not-fire-didreceivemessage)
- [4. The case nobody documents: tapping with the app in front](#4-the-case-nobody-documents-tapping-with-the-app-in-front)
- [5. Why two splash screens flash by](#5-why-two-splash-screens-flash-by)
- [6. Sending the message](#6-sending-the-message)
- [7. Every value inside `data` is a string](#7-every-value-inside-data-is-a-string)
- [8. iOS](#8-ios)
- [9. The device may sit on your push for twenty minutes](#9-the-device-may-sit-on-your-push-for-twenty-minutes)
- [10. Symptom to cause](#10-symptom-to-cause)

<!-- TOC-END -->

## 1. The four doors

| What the app was doing | Where the payload arrives | Requires |
| --- | --- | --- |
| Open, in front, message arrives | `didReceiveMessage` on the module | nothing |
| Closed, person taps the notification | `fcm_data` extra on the launch Intent | reading it at startup |
| Backgrounded, person taps the notification | `Ti.App` `resumed`, then read the Intent | nothing |
| **Already in front**, person taps a notification sitting in the tray | `newintent` on the root activity | `launchMode="singleTop"` |

A module that fires `didOpenNotification` replaces rows two to four with one listener. See [If your module fires `didOpenNotification`](#if-your-module-fires-didopennotification).

Verified case by case on a physical Android phone, reading a log line that named which door each message came through rather than watching the screen.

The first row is the only one the module's own example covers. The second and third are in its README under `### Android intent data`, a section that sits between the token example and "Sending push messages" with no explanation of why you would need it. The fourth is not documented anywhere.

A single handler serves all four:

```javascript
if (OS_ANDROID) {
  const mostrarAviso = (intentNuevo, origen) => {
    const intent = intentNuevo || Ti.Android.rootActivity.intent
    const contenido = intent.getStringExtra('fcm_data')

    if (!contenido) {
      log.debug(`Sin aviso en el Intent (${origen})`)
      return
    }

    let datos
    try {
      datos = JSON.parse(contenido)
    } catch (error) {
      modulo.clearLastData()
      return
    }

    // Consume it, or the same payload fires again on the next resume.
    modulo.clearLastData()
    log.info(`Aviso abierto (${origen})`)
    abrirPanel(datos)
  }

  // Both events pass an argument of their own, so they are wrapped: only
  // 'newintent' carries an Intent and only it should be forwarded.
  Ti.App.addEventListener('resumed', () => mostrarAviso(null, 'resumed'))
  Ti.Android.rootActivity.addEventListener('newintent', (e) => mostrarAviso(e.intent, 'newintent'))

  mostrarAviso(null, 'arranque')
}
```

**Label the origin.** Not for tidiness: when someone reports that no panel appeared, the word in that log line tells you immediately which door was involved, and the four behave differently. Without it every path prints the same sentence and a whole afternoon goes into finding out which one ran.

**Wrap the listeners.** `Ti.App.addEventListener('resumed', mostrarAviso)` passes the event object as the first argument, and if the function's first parameter is an Intent, the code blows up inside `getStringExtra`. The same trap catches `Alloy.Events.on('algo', unaFuncionConParametros)`.

## 2. The payload decides how much of the module runs

Android distinguishes a *notification message* from a *data message*, and the difference is not cosmetic.

Send a top-level `notification` block with the app in the background and Android posts the notification itself. `onMessageReceived` is never called, so `showNotification()` never runs and `PushHandlerActivity` never runs. What that costs:

- `image`, `big_text`, `big_text_summary`, `icon`, `rounded_large_icon`, `force_show_in_foreground`, `id`, `color`, `vibrate`, `sound` and `badge` are all ignored.
- The tap intent belongs to the system, so tapping **launches the app from scratch** instead of resuming it. Any game in progress, any half-filled form, gone.

That last symptom is worth naming because it sends people down the wrong road. It looks like an activity or `launchMode` problem, and it is not: `launchMode="singleTask"` on the root activity makes it worse, and patching the module's `PushHandlerActivity` does nothing, because neither of them ever runs. The fix is on the sender: put the fields inside `data`.

Firebase's own server documentation teaches the `notification` block, which is why this is such a common shape to arrive at.

## 3. A tap does not fire `didReceiveMessage`

When the module posts the notification and the person taps it, `PushHandlerActivity` puts the payload on the launcher Intent as the `fcm_data` extra and starts the activity. It does not fire `didReceiveMessage`.

The only thing that turns that extra into the event is `parseBootIntent()`, and it is called from exactly one place: the end of the module's `registerForPushNotifications()`. So the tap behaves differently depending on the app's state:

- **App closed.** It starts, calls register, `parseBootIntent()` runs, `didReceiveMessage` fires.
- **App backgrounded.** It resumes, register is not called again, nothing fires. The payload sits on the Intent and nobody reads it.

Two paths out of three appear to work, which is what makes this so hard to see. Taps work from a cold start, foreground delivery works, and the background case fails silently — so the investigation starts on the server.

If you read the Intent yourself at startup, as in section 1, `parseBootIntent()` finds nothing afterwards because `clearLastData()` already removed the extra. Only one of them fires. That is fine, and it is why the log says `arranque` rather than `didReceiveMessage` on a cold start.

## 4. The case nobody documents: tapping with the app in front

The notification arrived earlier and stayed in the tray. Later the person opens the app and plays. Then they pull down the shade for something else, see your notification there, and tap it.

The app is already in the foreground. It never paused, so **`resumed` does not fire**. And the activity is not recreated, so nothing reads the Intent. Nothing happens at all.

This is not an edge case. It is the most ordinary way a stored notification gets opened.

It needs two things, and neither works without the other:

```xml
<!-- tiapp.xml, inside <application> -->
<activity android:name="com.yourdomain.yourapp.YourAppActivity"
          android:launchMode="singleTop" tools:node="merge" />
```

```javascript
Ti.Android.rootActivity.addEventListener('newintent', (e) => mostrarAviso(e.intent, 'newintent'))
```

Without `singleTop`, Android treats the launcher Intent as "bring the existing task to the front" and discards it, so `onNewIntent` never runs and `newintent` never fires. Without the listener, the Intent arrives and nobody reads it.

`singleTop` is not `singleTask`. `singleTask` clears the task stack and will restart your app from its first screen; `singleTop` only prevents a second instance when the activity is already on top, and leaves the stack alone. Confusing the two costs a debugging session.

Take the activity name from the built manifest rather than guessing it: `build/android/app/build/intermediates/merged_manifest/debug/processDebugMainManifest/AndroidManifest.xml`.

### If your module fires `didOpenNotification`

Everything above is what the published module needs. A module that fires `didOpenNotification` from `setNotificationData()` makes all of it unnecessary: no `singleTop`, no `newintent`, no reading the Intent on resume. One listener covers every tap, whatever the app was doing.

```javascript
modulo.addEventListener('didOpenNotification', (e) => {
  abrirPanel((e.message && e.message.data) || {})
})
```

The payload sits under `message.data`, the same place `didReceiveMessage` puts it on both its live and its cold-start path, so one accessor covers a tap and an arrival. The first version of the event wrapped it directly in `message`; if the module you have predates 3.6.0, read `e.message` instead, or log the event once and look.

The Intent is still how a cold start arrives, so keep that path. Check `timodule.xml` in your installed module for the event, or just add the listener and watch whether it fires: a module without it ignores the registration silently.

Do not run both. Where the module also puts the payload on the Intent, `resumed` finds it again on Titanium's second pass and the panel opens twice. That is a real symptom, not a hypothetical: it shows up on Android 10 and not on Android 15, because the two versions differ in whether the launcher Intent gets delivered to a task that already exists.

## 5. Why two splash screens flash by

Tap a notification and you may see one or two blank pages slide past before the app appears, and the splash icon never finishes animating. Opening the same app from the launcher icon looks fine.

Two separate causes, and it is worth knowing which is which before trying to fix either.

**The module's own activity.** `PushHandlerActivity` is declared in the module's `timodule.xml` without `android:theme`, so it inherits the application theme and Android gives it a full window with an enter and an exit animation. The activity calls `finish()` on its first line and never shows anything.

**Titanium's resume mechanism.** `TiRootActivity.onCreate()` builds the only intent it accepts:

```java
// This is the only intent Titanium supports in order to simulate "singleTask" like resume behavior.
Intent mainIntent = Intent.makeMainActivity(getComponentName());
mainIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
mainIntent.addFlags(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
mainIntent.setPackage(getPackageName());
```

The module's relaunch intent does not match it, so Android creates a **second** root activity. That one recognises itself as a duplicate, forwards the intent to the live activity through `onNewIntent()` and finishes. It works — and it is in fact what delivers the payload — but the duplicate draws its own splash first.

The two are linked: the mismatch is what makes the delivery happen. "Fixing" the intent so it matches removes the second splash **and** the delivery, unless the module also fires an event for the tap. Verified by trying it: the extra window disappeared and the panel stopped appearing.

So this is not something an app can fix on its own. Do not spend an afternoon on `launchMode` or on splash themes looking for it.

## 6. Sending the message

The legacy FCM API, the one with `'to' => 'DEVICE_TOKEN'` and a server key, was deprecated on 20 June 2023 and shut down from 22 July 2024. Examples using it are still all over the web and they no longer deliver anything.

HTTP v1 needs an OAuth 2.0 access token instead of the static key, which is why examples use a library rather than a bare POST.

```php
<?php

require __DIR__ . '/vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

$factory = (new Factory)->withServiceAccount('/path/to/service-account.json');
$messaging = $factory->createMessaging();

$message = CloudMessage::new()
    ->withToken($token)
    ->withData([
        'title' => 'Title',
        'message' => 'Body',
        'channelId' => 'default_channel',
    ]);

$messaging->send($message);
```

`composer require kreait/firebase-php`. Note `withToken()`: version 8.0 removed `CloudMessage::withTarget()` outright and deprecated `toToken()`, so older snippets fail on a fresh install.

`channelId` must match a channel your app created, or Android 8 and later drop the notification with nothing in the log to say so.

**Without Composer**, sign the service account JWT yourself with `openssl_sign`, exchange it for an access token at Google's token endpoint, and POST the same payload to `https://fcm.googleapis.com/v1/projects/<project-id>/messages:send`. It is about forty lines and it is the right answer when deployment does not carry `/vendor` to the server.

To reach every installed device without keeping token lists, send to a topic the app subscribes to at startup. Two requests cover a whole install base regardless of size, with no queue, no batching and no dead tokens to clean up.

## 7. Every value inside `data` is a string

FCM rejects anything else. Sending `['badge' => 3]` or `['vibrate' => true]` returns an `INVALID_ARGUMENT` naming the field, and Kreait throws before the request even leaves.

This collides with the module's documented field list, which describes `vibrate` as boolean, `badge` and `id` as int, and `rounded_large_icon` and `force_show_in_foreground` as Boolean. They travel as `"true"` and `"1"`. The module parses them back with `TiConvert.toBoolean` and `JSONObject.optBoolean`, both of which accept the string forms.

An `array_map('strval', ...)` over the whole payload before sending saves the round trip.

## 8. iOS

iOS has one door, and it works. Everything in section 1 is an Android problem.

`Ti.Network.registerForPushNotifications` takes a `callback`, and that callback fires whether the message arrives with the app in front, whether the person taps a notification from the tray, and whether the app was closed. There is no intent to read, no `launchMode` to declare, no second listener. The payload is in `e.data`, and `e.inBackground` says which it was.

| What the app was doing | Panel shown |
| --- | --- |
| Open, in front, message arrives | yes |
| Backgrounded, person taps | yes |
| Already in front, person taps a stored notification | yes |
| Closed, person taps | yes |

Verified case by case on an iPad. The third row is the one that does not work on Android without the extra listener, which is worth knowing when a bug report says "it works on my iPhone".

```javascript
Ti.Network.registerForPushNotifications({
  success: (e) => { enviarTokenAlServidor(e.deviceToken) },
  error: (e) => { log.error(e.error) },
  callback: (e) => {
    // Foreground, background and closed all arrive here.
    const datos = (e && e.data) || {}
    abrirPanel(datos)
  }
})
```

The module's own `example/app.js` leaves that callback empty, so copying the example gives an app that registers correctly, receives the push, and does nothing when tapped.

**Firebase has to start before APNs answers.** The module's `_configure` registers it as an application delegate, and its `didRegisterForRemoteNotificationsWithDeviceToken` is what hands the APNs token to Firebase. Load the module later, from a service or from a window's `open` handler, and APNs has already answered: nobody picks that token up and Firebase never issues one of its own.

Nothing fails visibly. The permission is granted, APNs returns a 64-character token, and then `fetchToken` never calls back and `didRefreshRegistrationToken` never fires. There is nothing in any log pointing at load order.

```javascript
// alloy.js
if (OS_IOS) {
  const FirebaseCore = require('firebase.core')
  FirebaseCore.configure()
  require('firebase.cloudmessaging')
}
```

**A data-only message shows nothing on iOS.** Android reads the text from `data`; iOS reads it from the APNs alert. Send both, they do not interfere:

```php
'data' => ['title' => $titulo, 'message' => $cuerpo, 'channelId' => 'default_channel'],
'apns' => [
    'headers' => ['apns-priority' => '10'],
    'payload' => ['aps' => ['alert' => ['title' => $titulo, 'body' => $cuerpo], 'sound' => 'default']],
],
```

Forgetting the `apns` block is a quiet failure: Android works, iOS receives the message and displays nothing, and the payload is identical in both.

**Images need a Notification Service Extension.** *Read, not run.* The module's `image` field is Android only: `showNotification()` downloads it and builds a `BigPictureStyle`. On iOS, Firebase documents `apns.fcm_options.image` together with `"mutable-content": 1` inside `aps`, and that path needs a Notification Service Extension in the app, a separate Xcode target with its own App ID and provisioning profile, which a module cannot ship.

An image inside your own UI is a different matter and works normally: it is just a URL in `data` that your controller hands to an `ImageView`.

**`defaultImage` is a placeholder, not a fallback.** An `ImageView` that declares `defaultImage` and never gets an `image` renders the default on Android and an empty box on iOS. Reproduced on a device, and fixed by assigning the local asset explicitly:

```javascript
// Not: if (args.imagen) { $.preview.applyProperties({ image: args.imagen }) }
$.preview.applyProperties({ image: args.imagen || LOGO })
```

The API reference calls `defaultImage` the image to show *while* the remote one loads, so leaning on it for "no image at all" asks more of it than it promises. The failure is invisible from Android, which is where this kind of notification usually gets tested.

## 9. The device may sit on your push for twenty minutes

Aggressive OEM battery management holds FCM messages for backgrounded apps and releases them in a batch when something wakes the connection. On a ColorOS device this shows up in logcat by name, `OplusHansManager freeze`, seconds after the app goes to the background.

The practical consequence is for testing, not for production: a message that has not arrived after ten seconds has not necessarily failed. Confirm arrival in the log before concluding anything, or you will spend an hour debugging a delivery that was simply queued. Five test messages arriving within 700 milliseconds of each other, after twenty minutes of silence, is what this looks like.

Do not test with the app added to the battery whitelist. That measures a phone your users do not have.

## 10. Symptom to cause

| Symptom | Cause | Where to look |
| --- | --- | --- |
| Tapping restarts the app from zero and loses state | Top-level `notification` block; the system owns the intent | Section 2 |
| `image`, `big_text`, `channelId`, `sound`, `vibrate` ignored | Same | Section 2 |
| Foreground and cold start work, backgrounded tap does nothing | Nobody reads the Intent on resume | Section 3 |
| Nothing at all happens when tapping a stored notification while using the app | No `resumed`, no `newintent` listener, or no `singleTop` | Section 4 |
| Blank pages slide past before the app appears | `PushHandlerActivity` has no theme; Titanium spawns a duplicate root activity | Section 5 |
| Nothing is delivered and no error comes back | Legacy FCM API, shut down in 2024 | Section 6 |
| `INVALID_ARGUMENT` naming a `data` field | A non-string value | Section 7 |
| Android shows the notification, iOS shows nothing | No `apns.payload.aps.alert` in the message | Section 8 |
| iOS registers but never gets a token | Firebase loaded after APNs answered | Section 8 |
| iOS receives the push and does nothing when tapped | Empty `callback` | Section 8 |
| Nothing arrives for twenty minutes, then five at once | OEM battery management | Section 9 |
