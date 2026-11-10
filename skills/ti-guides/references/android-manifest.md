# Android manifest configuration

## Android

Children of `<android>`. As with `<ios>`, anything else is discarded. The
`xmlns:android` declaration belongs on the `<android>` element.

| Element          | Value           | Effect                                                              |
| ---------------- | --------------- | ------------------------------------------------------------------- |
| `manifest`       | XML             | Merged into the generated `AndroidManifest.xml`                     |
| `tool-api-level` | int             | The API level the app is compiled against                           |
| `abi`            | comma-separated | Which ABIs to package. `all` packages every one                     |
| `activities`     | element         | Extra activities, each keyed by the JavaScript file it opens        |
| `services`       | element         | Extra services. `type="quicksettings"` builds a quick settings tile |

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest android:versionCode="1">
    <uses-permission android:name="android.permission.CAMERA"/>
    <application android:icon="@mipmap/ic_launcher"/>
  </manifest>
  <abi>arm64-v8a,x86_64</abi>
</android>
```

`android:versionCode` is the integer Google Play orders releases by, and it has
to increase on every upload. `<version>` above is the human one; these are
separate numbers and both matter.

Restricting `abi` shrinks the APK and is the usual reason to set it. An ABI you
drop is a device the app will not install on.


## Merge and inspect the release variant

SDK 13.4.1 generates a base `src/main/AndroidManifest.xml` plus variant overlays below `build/android/`; Gradle merges app, library and module manifests. Use Android manifest-merger rules and `tools:remove` when needed, then inspect the actual merged release manifest. The legacy `android.mergeCustomAndroidManifest=false` switch is unsupported and does not restore replacement mode. A declared permission still needs its runtime permission workflow where the OS requires it.

`<tool-api-level>` is the compile API. Manifest min/target APIs are different settings; use the released [compatibility baseline](compatibility-matrix.md). Do not force debuggable in distributed artifacts. For other XML elements see [tiapp.xml](tiapp-config.md).
