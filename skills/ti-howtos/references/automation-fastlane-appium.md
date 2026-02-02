# Automation with Fastlane and Appium

Guide for setting up continuous integration pipelines, automatic testing, and deployment in Titanium.

## 1. UI Testing with Appium

Appium allows for automated functional testing on real devices and simulators.

### Prerequisites
- **Appium Desktop** or CLI.
- **Mocha** (test runner).
- **WebdriverIO** (recommended client).

### Test Example (Mocha + WebdriverIO)
```javascript
const opts = {
    port: 4723,
    capabilities: {
        platformName: "iOS",
        deviceName: "iPhone 15",
        app: "/path/to/your/app.app",
        automationName: "XCUITest"
    }
};

describe("Login Test", () => {
    it("Should login with valid credentials", async () => {
        const client = await wdio.remote(opts);
        const userField = await client.$("~Enter Username"); // Use Accessibility ID
        await userField.setValue("my_user");
        await client.deleteSession();
    });
});
```

## 2. Automation with Fastlane

Fastlane automates the building, signing, and uploading process to the stores.

### Titanium Plugins
Install specific plugins in your project:
```bash
fastlane add_plugin ti_build_app
fastlane add_plugin mocha_run_tests
```

### Fastfile Configuration
Create a `fastlane/Fastfile` in the root:

```ruby
platform :ios do
  desc "Build for Simulator Tests"
  lane :build_test do
    ti_build_app(
      appc_cli: "ti build -p ios -T simulator --build-only"
    )
  end

  desc "Run UI Tests"
  lane :test do
    build_test
    mocha_run_tests(
      mocha_js_file_name: 'tests/login_test.js'
    )
  end

  desc "Deploy to TestFlight"
  lane :release do
    ti_build_app(
      appc_cli: "ti build -p ios -T dist-appstore --distribution-name 'Your Company' --pp-uuid 'UUID-HERE' --output-dir /dist"
    )
    # Add fastlane pilot command here to upload the .ipa
  end
end
```

## 3. CI/CD Best Practices
1. **Accessibility IDs**: Always assign `accessibilityLabel` to your components in XML/TSS so Appium can find them easily.
2. **Environment Lanes**: Define separate lanes for `beta`, `production`, and `test`.
3. **Profile Management**: Use Fastlane Match to sync certificates and provisioning profiles across the team.
4. **Snapshots**: Use Fastlane's `snapshot` action to automate App Store screenshot generation.

## 4. Unit Testing with TiUnit

For unit tests (non-UI), consider **TiUnit**, a Jasmine-based testing framework for Titanium:
- Runs tests inside the app context
- Supports standard Jasmine `describe`/`it`/`expect` syntax
- Can be integrated into CI pipelines

## 5. Broader CI/CD Options

Beyond Fastlane and Appium, Titanium apps can integrate with:
- **Jenkins** — for build orchestration and pipeline management
- **SonarQube** — for code quality analysis
- **AWS Device Farm** — for testing on real devices in the cloud
- **Nexus/Artifactory** — for build artifact archiving and versioning
