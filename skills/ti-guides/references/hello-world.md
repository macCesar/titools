# Hello World - Project Creation

Quick guide to creating your first Titanium project.

## Creating a New Project

### Using CLI

```bash
ti create -t app --id <APP_ID> -n <APP_NAME> -p <PLATFORMS> -d <WORKSPACE>
```

**Example:**
```bash
ti create -t app --id com.example.hello -n HelloWorld -p android,ios -d ~/Projects
```

### Using Studio/VS Code

**File** > **New** > **Mobile App Project**

Choose template:
- **Alloy** - MVC framework (recommended)
- **Classic** - No framework

## Project Fields

| Field                  | Description             | Rules                      |
| ---------------------- | ----------------------- | -------------------------- |
| **Project name**       | App name shown to users | -                          |
| **App ID**             | Reverse domain notation | `com.company.appname`      |
| **Company URL**        | Your website            | -                          |
| **SDK Version**        | Titanium SDK to use     | Use latest                 |
| **Deployment Targets** | Platforms to support    | android, ios, ipad, iphone |

### App ID Naming Guidelines

- Use Java Package Name style: `com.yourdomain.yourappname`
- No spaces or special characters
- All lowercase (Android issues with uppercase)
- No Java keywords (`case`, `package`, etc.)
- Cannot change after publishing

## Project Structure

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
├── Resources/             # Classic Titanium resources
├── i18n/                  # Internationalization
├── tiapp.xml             # App configuration
├── config.json           # Alloy config
└── app.js                # Classic entry point
```

## Running Your App

### iOS Simulator
```bash
ti build -p ios -C "iPhone 15"
```

### Android Emulator
```bash
ti build -p android -C "Pixel_4_API_34"
```

### Physical Device
```bash
ti build -p ios -T device
ti build -p android -T device
```

## Simulator vs Emulator

- **iOS Simulator**: The software simulates the environment within an iOS device. It's an OS X executable that runs your cross-compiled code.
- **Android Emulator**: Provides a virtual hardware environment that runs the actual Android OS and platform components.

**CRITICAL**: Neither environment is a perfect representation of a physical device. Always test on real hardware before publishing.

## How Titanium Works (Under the Covers)

1. **Pre-compile**: JavaScript is minified and statically analyzed to build a dependency hierarchy of Titanium APIs used.
2. **Stub Generation**: A front-end compiler creates native stub files, native project files, and platform-specific code necessary for compilation.
3. **Native Build**: Titanium calls platform-specific compilers (e.g., `xcodebuild` for iOS, Gradle for Android) to build the final native application.
4. **Encryption**: JavaScript code is encrypted when building for "production" (release) or for device. Original code is not retrievable in human-readable form.

## Best Practices

1. **Always test on physical devices** - Simulator/emulator isn't perfect
2. **Use Alloy for new projects** - Better structure and maintainability
3. **Keep App ID consistent** - Match Bundle ID (iOS) and Package ID (Android)
