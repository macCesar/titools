# End-to-End Testing & CI/CD

## Appium Setup

```bash
# Install Appium
npm install -g appium

# Install drivers
appium driver install xcuitest  # iOS
appium driver install uiautomator2  # Android
```

## Appium Configuration

```javascript
// e2e/config/capabilities.js
exports.iOS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 14',
  'appium:platformVersion': '16.0',
  'appium:app': '/path/to/your.app',
  'appium:noReset': false
}

exports.android = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Pixel 6',
  'appium:platformVersion': '13',
  'appium:app': '/path/to/your.apk',
  'appium:noReset': false
}
```

## WebdriverIO Integration

```javascript
// e2e/wdio.conf.js
exports.config = {
  runner: 'local',
  specs: ['./e2e/specs/**/*.spec.js'],
  maxInstances: 1,

  capabilities: [{
    ...require('./config/capabilities').iOS
  }],

  services: ['appium'],
  appium: {
    command: 'appium'
  },

  framework: 'mocha',
  mochaOpts: {
    timeout: 60000
  },

  reporters: ['spec'],

  // Hooks
  beforeSession: () => {
    // Setup before each session
  },

  afterTest: async (test, context, { passed }) => {
    if (!passed) {
      await browser.saveScreenshot(`./e2e/screenshots/${test.title}.png`)
    }
  }
}
```

## E2E Test Example

```javascript
// e2e/specs/login.spec.js
describe('Login Flow', () => {
  beforeEach(async () => {
    // Ensure we're on login screen
    await $('~loginScreen').waitForDisplayed({ timeout: 5000 })
  })

  it('should login with valid credentials', async () => {
    // Enter email
    const emailField = await $('~emailField')
    await emailField.setValue('test@example.com')

    // Enter password
    const passwordField = await $('~passwordField')
    await passwordField.setValue('password123')

    // Tap login button
    const loginButton = await $('~loginButton')
    await loginButton.click()

    // Wait for home screen
    const homeScreen = await $('~homeScreen')
    await homeScreen.waitForDisplayed({ timeout: 10000 })

    // Verify we're logged in
    const welcomeLabel = await $('~welcomeLabel')
    const text = await welcomeLabel.getText()
    expect(text).toContain('Welcome')
  })

  it('should show error for invalid credentials', async () => {
    const emailField = await $('~emailField')
    await emailField.setValue('wrong@example.com')

    const passwordField = await $('~passwordField')
    await passwordField.setValue('wrongpassword')

    const loginButton = await $('~loginButton')
    await loginButton.click()

    // Wait for error message
    const errorLabel = await $('~errorLabel')
    await errorLabel.waitForDisplayed({ timeout: 5000 })

    const errorText = await errorLabel.getText()
    expect(errorText).toContain('Invalid')
  })
})
```

## Adding Accessibility IDs for Testing

```xml
<!-- views/auth/login.xml -->
<Window testId="loginScreen">
  <TextField id="emailField" testId="emailField" />
  <TextField id="passwordField" testId="passwordField" />
  <Button id="loginBtn" testId="loginButton" />
  <Label id="errorLabel" testId="errorLabel" />
</Window>
```

```javascript
// In controller or alloy.js - map testId to accessibilityLabel
if (Alloy.CFG.debug) {
  // Auto-set accessibilityLabel from testId during development
  Ti.UI.defaultUnit = 'dp'
}
```

## Page Object Pattern

```javascript
// e2e/pages/LoginPage.js
class LoginPage {
  get emailField() { return $('~emailField') }
  get passwordField() { return $('~passwordField') }
  get loginButton() { return $('~loginButton') }
  get errorLabel() { return $('~errorLabel') }

  async login(email, password) {
    await this.emailField.setValue(email)
    await this.passwordField.setValue(password)
    await this.loginButton.click()
  }

  async waitForError() {
    await this.errorLabel.waitForDisplayed({ timeout: 5000 })
    return this.errorLabel.getText()
  }
}

module.exports = new LoginPage()
```

```javascript
// e2e/specs/login.spec.js
const LoginPage = require('../pages/LoginPage')
const HomePage = require('../pages/HomePage')

describe('Login Flow', () => {
  it('should login successfully', async () => {
    await LoginPage.login('test@example.com', 'password123')
    await HomePage.waitForDisplayed()
    expect(await HomePage.isLoggedIn()).toBe(true)
  })
})
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build-ios:
    runs-on: macos-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Titanium CLI
        run: npm install -g titanium alloy

      - name: Setup Titanium SDK
        run: |
          titanium sdk install latest
          titanium sdk select latest

      - name: Install dependencies
        run: npm ci

      - name: Build iOS
        run: titanium build -p ios -T simulator -b

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: ios-build
          path: build/iphone/build/Products/Debug-iphonesimulator/*.app

  build-android:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v3

      - name: Setup JDK
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Titanium CLI
        run: npm install -g titanium alloy

      - name: Setup Titanium SDK
        run: |
          titanium sdk install latest
          titanium sdk select latest

      - name: Install dependencies
        run: npm ci

      - name: Build Android
        run: titanium build -p android -T dist-playstore -K ${{ secrets.KEYSTORE_PATH }} -P ${{ secrets.KEYSTORE_PASSWORD }}

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: android-build
          path: dist/*.apk

  e2e-tests:
    runs-on: macos-latest
    needs: [build-ios]
    steps:
      - uses: actions/checkout@v3

      - name: Download iOS build
        uses: actions/download-artifact@v3
        with:
          name: ios-build
          path: ./build

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Appium
        run: |
          npm install -g appium
          appium driver install xcuitest

      - name: Install test dependencies
        run: cd e2e && npm ci

      - name: Start Appium
        run: appium &

      - name: Run E2E tests
        run: cd e2e && npm run test

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-screenshots
          path: e2e/screenshots/
```

## Fastlane Integration

```ruby
# fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    # Build with Titanium
    sh "cd .. && titanium build -p ios -T dist-adhoc"

    # Upload to TestFlight
    upload_to_testflight(
      ipa: "../dist/MyApp.ipa",
      skip_waiting_for_build_processing: true
    )

    # Notify team
    slack(
      message: "New iOS beta available on TestFlight!",
      channel: "#releases"
    )
  end
end

platform :android do
  desc "Build and upload to Play Store"
  lane :beta do
    # Build with Titanium
    sh "cd .. && titanium build -p android -T dist-playstore -K keystore.jks -P $KEYSTORE_PASSWORD"

    # Upload to Play Store
    upload_to_play_store(
      track: 'internal',
      aab: '../dist/MyApp.aab'
    )
  end
end
```

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint app/",
    "test:unit": "titanium test --platform ios",
    "test:e2e": "cd e2e && wdio run wdio.conf.js",
    "test:e2e:android": "cd e2e && wdio run wdio.android.conf.js",
    "build:ios": "titanium build -p ios -T device",
    "build:android": "titanium build -p android -T device",
    "build:ios:prod": "titanium build -p ios -T dist-appstore",
    "build:android:prod": "titanium build -p android -T dist-playstore",
    "deploy:ios": "cd fastlane && fastlane ios beta",
    "deploy:android": "cd fastlane && fastlane android beta"
  }
}
```

## Branch Protection Rules

Configure in GitHub repository settings:

| Rule                              | Setting                                    |
| --------------------------------- | ------------------------------------------ |
| Require pull request reviews      | 1 approval required                        |
| Require status checks             | lint, unit-tests, build-ios, build-android |
| Require branches to be up to date | Yes                                        |
| Include administrators            | Yes                                        |

## Testing Best Practices Summary

| Area                  | Practice                                   |
| --------------------- | ------------------------------------------ |
| **Unit Tests**        | Test business logic in services/helpers    |
| **Integration Tests** | Test controller flows with mocked services |
| **E2E Tests**         | Test critical user journeys                |
| **Coverage**          | Aim for 80%+ on services, 60%+ overall     |
| **CI Pipeline**       | Run lint -> unit tests -> build -> E2E     |
| **Artifacts**         | Save screenshots on failure                |
| **Notifications**     | Slack/email on build failures              |
