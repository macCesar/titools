# Hello world: project creation

Quick guide to creating your first Titanium project.

## Creating a new project

### Using CLI

```bash
ti create -t app --id <APP_ID> -n <APP_NAME> -p <PLATFORMS> -d <WORKSPACE>
```

Example:
```bash
ti create -t app --id com.example.hello -n HelloWorld -p android,ios -d ~/Projects
```

### Using Studio/VS Code

File > New > Mobile App Project

Choose a template:
- Alloy: MVC framework (recommended)
- Classic: no framework

## Project fields

| Field | Description | Rules |
| --- | --- | --- |
| Project name | App name shown to users | - |
| App ID | Reverse domain notation | `com.company.appname` |
| Company URL | Your website | - |
| SDK Version | Titanium SDK to use | Use latest |
| Deployment Targets | Platforms to support | android, ios, ipad, iphone |

### App ID naming guidelines

- Use Java package style: `com.yourdomain.yourappname`
- No spaces or special characters
- All lowercase (Android issues with uppercase)
- No Java keywords (`case`, `package`, etc.)
- Cannot change after publishing
- On iOS, the App ID must match the Bundle Identifier. On Android, it becomes the Application Package Name.

## Project structure

```
MyApp/
├── app/                    # Alloy app source
│   ├── assets/            # Images, fonts
│   ├── controllers/       # JS controllers
│   ├── models/           # Backbone models
│   ├── views/            # XML views
│   └── styles/           # TSS styles
├── platform/              # Platform-specific files
│   ├── android/
│   └── ios/
├── Resources/             # Code files and graphics with platform-specific subdirectories
│   ├── android/          # Android-specific assets
│   └── iphone/           # iOS-specific assets
├── i18n/                  # Internationalization
├── tiapp.xml             # App configuration
├── config.json           # Alloy config
└── app.js                # Bootstrap file loaded first when app launches
```

## Running your app

### iOS simulator
```bash
ti build -p ios -C "iPhone 15"
```

### Android emulator
```bash
ti build -p android -C "Pixel_4_API_34"
```

### Physical device
```bash
ti build -p ios -T device
ti build -p android -T device
```

## Simulator vs emulator

- iOS simulator: simulates the environment within an iOS device. It is a macOS executable that runs your cross-compiled code.
- Android emulator: provides a virtual hardware environment that runs the Android OS and platform components.

Neither environment is a perfect representation of a physical device. Always test on real hardware before publishing.

## How Titanium works (under the covers)

1. Pre-compile: JavaScript is minified and statically analyzed to build a dependency hierarchy of Titanium APIs used.
2. Stub generation: a front-end compiler creates native stub files, native project files, and platform-specific code needed for compilation.
3. Native build: Titanium calls platform-specific compilers (for example, `xcodebuild` for iOS and Gradle for Android) to build the native app.
4. Encryption: JavaScript code is encrypted when building for production (release) or for device. Original code is not retrievable in human-readable form.

## Best practices

1. Test on physical devices. The simulator/emulator is not a perfect proxy.
2. Use Alloy for new projects for better structure and maintainability.
3. Keep the App ID consistent. Match Bundle ID (iOS) and Package ID (Android).
