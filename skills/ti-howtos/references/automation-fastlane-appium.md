# Automation with Fastlane and Appium

Guide to setting up CI pipelines, automated testing, and deployment for Titanium.

## 1. UI testing with Appium

Appium supports automated functional testing on real devices and simulators.

### Prerequisites
- Appium Desktop or CLI
- Mocha (test runner)
- WebdriverIO (recommended client)

### Test example (Mocha + WebdriverIO)
```javascript
const opts = {
  port: 4723,
  capabilities: {
    platformName: 'iOS',
    deviceName: 'iPhone 15',
    app: '/path/to/your/app.app',
    automationName: 'XCUITest'
  }
};

describe('Login Test', () => {
  it('Should login with valid credentials', async () => {
    const client = await wdio.remote(opts);
    const userField = await client.$('~Enter Username'); // Use Accessibility ID
    await userField.setValue('my_user');
    await client.deleteSession();
  });
});
```

## 2. Automation with Fastlane

Fastlane automates building, signing, and uploading to the stores.

### Titanium plugins
Install project plugins:
```bash
fastlane add_plugin ti_build_app
fastlane add_plugin mocha_run_tests
```

### Fastfile configuration
Create `fastlane/Fastfile` in the root:

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

## 3. CI/CD best practices
1. Accessibility IDs: assign `accessibilityLabel` in XML/TSS so Appium can find elements reliably.
2. Environment lanes: define separate lanes for `beta`, `production`, and `test`.
3. Profile management: use Fastlane Match to sync certs and provisioning profiles across the team.
4. Snapshots: use Fastlane `snapshot` to automate App Store screenshot generation.

## 4. Unit testing with TiUnit

For non-UI tests, consider TiUnit (Jasmine-based):
- Runs tests inside the app context
- Supports standard Jasmine `describe`/`it`/`expect` syntax
- Integrates cleanly into CI pipelines

## 5. Broader CI/CD options

Beyond Fastlane and Appium, Titanium apps can integrate with:
- Jenkins for build orchestration and pipeline management
- SonarQube for code quality analysis
- AWS Device Farm for testing on real devices in the cloud
- Nexus/Artifactory for build artifact archiving and versioning
