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

| Field | Description | Rules |
|-------|-------------|-------|
| **Project name** | App name shown to users | - |
| **App ID** | Reverse domain notation | `com.company.appname` |
| **Company URL** | Your website | - |
| **SDK Version** | Titanium SDK to use | Use latest |
| **Deployment Targets** | Platforms to support | android, ios, ipad, iphone |

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

## How Titanium Works

1. **Pre-compile**: JavaScript is minified and statically analyzed
2. **Stub Generation**: Native stub files are created
3. **Native Build**: Platform compilers (xcodebuild, gradle) build final app
4. **Encryption**: JS is encrypted for production builds

## Best Practices

1. **Always test on physical devices** - Simulator/emulator isn't perfect
2. **Use Alloy for new projects** - Better structure and maintainability
3. **Keep App ID consistent** - Match Bundle ID (iOS) and Package ID (Android)
