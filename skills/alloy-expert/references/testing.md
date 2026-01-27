# Testing Guide for Titanium + Alloy

:::info OPTIONAL - Advanced Topic
**This guide covers automated testing, which is OPTIONAL for Titanium/Alloy projects.**

Testing is useful for:
- Teams practicing CI/CD
- Projects with complex business logic
- Refactoring confidence

If you prefer manual testing on device, you can safely skip this guide.
:::

## What CAN Be Tested (Without Compiling)

✅ **Pure JavaScript Logic:**
- Services (authService, navigationService, etc.)
- Helpers/Utils (formatters, validators, parsers)
- Business logic (calculations, data transformations)
- Models (with mocked database)

## What CANNOT Be Easily Tested

❌ **Requires Compiled App:**
- Controllers (UI interactions)
- Views/XML (Titanium UI components)
- Native modules (device-specific features)
- End-to-end user flows (use Appium for this)

---

## Testing Philosophy

**Test behavior, not implementation.** Focus on what the code does from the outside, not how it achieves it internally.

## Project Structure

```
app/
├── specs/                    # Test files
│   ├── unit/                # Unit tests
│   │   ├── services/        # Service layer tests
│   │   │   ├── authService.spec.js
│   │   │   └── tokenStorage.spec.js
│   │   ├── helpers/         # Helper function tests
│   │   │   └── i18n.spec.js
│   │   ├── utils/
│   │   │   └── validator.spec.js
│   │   └── models/          # Model tests (if using SQLite)
│   └── integration/         # Integration tests
│       ├── controllers/     # Controller flow tests
│       │   └── login.spec.js
│       └── api/             # API integration tests
├── lib/
│   ├── testing/             # Test utilities
│   │   ├── mocks.js         # Mock factories
│   │   ├── helpers.js       # Test helper functions
│   │   └── setup.js         # Test environment setup
```

## Writing Testable Code

### Dependency Injection for Testability

```javascript
// BAD: Hard to test - direct dependency
exports.getUser = async function getUser(id) {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// GOOD: Testable - injectable dependency
exports.getUser = async function getUser(id, apiClient = defaultApiClient) {
  const response = await apiClient.get(`/users/${id}`)
  return response.data
}

// Test with mock
describe('getUser', () => {
  it('should fetch user from API', async () => {
    const mockApi = {
      get: jasmine.createSpy('get').and.resolveTo({
        data: { id: 1, name: 'Test User' }
      })
    }

    const user = await getUser(1, mockApi)

    expect(mockApi.get).toHaveBeenCalledWith('/users/1')
    expect(user.name).toBe('Test User')
  })
})
```

## Unit Testing Services

```javascript
// specs/unit/services/authService.spec.js
const { login, logout } = require('lib/services/authService')

describe('AuthService', () => {
  let mockApi
  let mockTokenStorage

  beforeEach(() => {
    mockApi = {
      post: jasmine.createSpy('post')
    }
    mockTokenStorage = {
      save: jasmine.createSpy('save'),
      get: jasmine.createSpy('get'),
      clear: jasmine.createSpy('clear')
    }

    jasmine.clock().install()
  })

  afterEach(() => {
    jasmine.clock().uninstall()
  })

  describe('login', () => {
    it('should save token on successful login', async () => {
      mockApi.post.and.resolveTo({
        token: 'abc123',
        user: { id: 1, name: 'Test User' }
      })

      const result = await login('user@test.com', 'password', mockApi, mockTokenStorage)

      expect(mockTokenStorage.save).toHaveBeenCalledWith('abc123')
      expect(result).toEqual({ id: 1, name: 'Test User' })
    })

    it('should throw on network error', async () => {
      mockApi.post.and.rejectWith(new Error('Network error'))

      await expectAsync(
        login('user@test.com', 'password', mockApi, mockTokenStorage)
      ).toBeRejectedWith('Network error')
    })

    it('should throw on invalid credentials', async () => {
      const error = new Error()
      error.status = 401
      mockApi.post.and.rejectWith(error)

      await expectAsync(
        login('user@test.com', 'wrong', mockApi, mockTokenStorage)
      ).toBeRejected()
    })
  })
})
```

## Unit Testing Helpers

```javascript
// specs/unit/helpers/i18n.spec.js
const { getPluralMessages } = require('lib/helpers/i18n')

describe('i18n Helper', () => {
  beforeEach(() => {
    // Mock L() function
    global.L = jasmine.createSpy('L').and.callFake((key) => {
      const strings = {
        'one_message': 'You have 1 message',
        'many_messages': 'You have %d messages'
      }
      return strings[key] || key
    })
  })

  describe('getPluralMessages', () => {
    it('should return singular for count = 1', () => {
      const result = getPluralMessages(1)
      expect(result).toBe('You have 1 message')
    })

    it('should return plural for count > 1', () => {
      const result = getPluralMessages(5)
      expect(result).toBe('You have 5 messages')
    })

    it('should handle zero messages', () => {
      const result = getPluralMessages(0)
      expect(result).toBe('You have 0 messages')
    })
  })
})
```

## Integration Testing Controllers

```javascript
// specs/integration/controllers/login.spec.js
describe('Login Controller', () => {
  let controller
  let mockAuthService

  beforeEach(() => {
    mockAuthService = {
      login: jasmine.createSpy('login')
    }

    controller = Alloy.createController('login')
  })

  afterEach(() => {
    // Always cleanup
    if (controller.cleanup) {
      controller.cleanup()
    }
  })

  describe('doLogin', () => {
    it('should call authService with form data', async () => {
      controller.emailTextField.value = 'user@test.com'
      controller.passwordTextField.value = 'password123'

      mockAuthService.login.and.resolveTo({ id: 1, name: 'User' })

      await controller.doLogin()

      expect(mockAuthService.login).toHaveBeenCalledWith(
        'user@test.com',
        'password123'
      )
    })

    it('should show error on login failure', async () => {
      controller.emailTextField.value = 'user@test.com'
      controller.passwordTextField.value = 'wrong'

      mockAuthService.login.and.rejectWith(new Error('Invalid credentials'))

      await controller.doLogin()

      expect(controller.errorLabel.text).toBe('Invalid credentials')
      expect(controller.errorLabel.visible).toBe(true)
    })

    it('should disable button during login', async () => {
      const button = controller.loginButton

      mockAuthService.login.and.callFake(() => {
        expect(button.enabled).toBe(false)
        return Promise.resolve({ id: 1 })
      })

      await controller.doLogin()

      expect(button.enabled).toBe(true)
    })
  })

  describe('cleanup', () => {
    it('should remove event listeners', () => {
      const spy = spyOn(Ti.App, 'removeEventListener')

      controller.cleanup()

      expect(controller._isCleanedUp).toBe(true)
    })

    it('should destroy Alloy bindings', () => {
      const destroySpy = spyOn(controller, '$').and.returnValue({
        destroy: jasmine.createSpy('destroy')
      })

      controller.cleanup()

      expect(controller.$.destroy).toHaveBeenCalled()
    })
  })
})
```

## Mock Factory

```javascript
// lib/testing/mocks.js
exports.Mocks = {
  createHTTPClient() {
    return {
      open: jasmine.createSpy('open'),
      send: jasmine.createSpy('send'),
      setRequestHeader: jasmine.createSpy('setRequestHeader'),
      onload: null,
      onerror: null,
      status: null,
      responseText: null
    }
  },

  createTokenStorage() {
    return {
      save: jasmine.createSpy('save'),
      get: jasmine.createSpy('get'),
      clear: jasmine.createSpy('clear')
    }
  },

  createLogger() {
    return {
      debug: jasmine.createSpy('debug'),
      info: jasmine.createSpy('info'),
      warn: jasmine.createSpy('warn'),
      error: jasmine.createSpy('error')
    }
  },

  createView() {
    return {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      applyProperties: jasmine.createSpy('applyProperties'),
      visible: true,
      enabled: true,
      text: '',
      value: ''
    }
  },

  createNetworkMock() {
    return {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      online: true
    }
  }
}
```

## Test Helper Functions

```javascript
// lib/testing/helpers.js
exports.TestHelpers = {
  // Wait for async operations
  async waitFor(condition, timeout = 1000) {
    const start = Date.now()

    while (Date.now() - start < timeout) {
      if (await condition()) {
        return true
      }
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    throw new Error('Condition not met within timeout')
  },

  // Trigger Alloy event
  triggerEvent(controller, eventName, data) {
    const listeners = controller._eventListeners?.[eventName] || []

    listeners.forEach(listener => {
      listener(data)
    })
  },

  // Mock Ti.Platform properties
  mockPlatform(properties) {
    const original = {}

    Object.keys(properties).forEach(key => {
      original[key] = Ti.Platform[key]
      Ti.Platform[key] = properties[key]
    })

    return () => {
      // Restore function
      Object.keys(original).forEach(key => {
        Ti.Platform[key] = original[key]
      })
    }
  }
}
```

## Test Setup Configuration

```javascript
// lib/testing/setup.js
beforeAll(() => {
  // Disable Alloy auto-cleanup for testing
  Alloy.Globals.testMode = true

  // Mock Ti.Platform for deterministic tests
  spyOn(Ti.Platform, 'displayCaps').and.returnValue({
    platformWidth: 375,
    platformHeight: 667
  })
})

afterAll(() => {
  // Cleanup test resources
  if (Alloy.Globals.testMode) {
    Ti.App.Properties.removeAllProperties()
  }
})
```

## Running Tests

```bash
# Run specific test suite
titanium test --platform android

# Run with coverage
titanium test --coverage

# Run specific file
titanium test --specs app/specs/unit/services/authService.spec.js
```

## Anti-Patterns to Avoid

| Anti-Pattern               | Problem                        | Solution                        |
| -------------------------- | ------------------------------ | ------------------------------- |
| Testing private methods    | Breaks on refactoring          | Test public interface only      |
| Mocking everything         | Tests pass, code fails         | Mock only external dependencies |
| No cleanup in tests        | Memory leaks, interference     | Always cleanup in afterEach     |
| Testing XML/TSS            | Fragile, implementation detail | Test rendered behavior instead  |
| Hard dependencies          | Untestable code                | Use dependency injection        |
| Shared state between tests | Flaky tests                    | Reset state in beforeEach       |

## Test Checklist

Before committing code, verify:

- [ ] All unit tests pass
- [ ] New functionality has test coverage
- [ ] Controllers cleanup properly in tests
- [ ] Mocks are reset between tests
- [ ] No hard dependencies (use injection)
- [ ] Tests are independent (no shared state)
- [ ] Edge cases are covered (null, empty, error)

## End-to-End Testing with Appium

### Appium Setup

```bash
# Install Appium
npm install -g appium

# Install drivers
appium driver install xcuitest  # iOS
appium driver install uiautomator2  # Android
```

### Appium Configuration

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

### WebdriverIO Integration

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

### E2E Test Example

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

### Adding Accessibility IDs for Testing

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

### Page Object Pattern

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

### Fastlane Integration

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

### Package.json Scripts

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

### Branch Protection Rules

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
