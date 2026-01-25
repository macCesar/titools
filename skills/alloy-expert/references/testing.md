# Testing Guide for Titanium + Alloy

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
export async function getUser(id) {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// GOOD: Testable - injectable dependency
export async function getUser(id, apiClient = defaultApiClient) {
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
import { login, logout } from 'lib/services/authService'

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
import { getPluralMessages } from 'lib/helpers/i18n'

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
export const Mocks = {
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
export const TestHelpers = {
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

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Testing private methods | Breaks on refactoring | Test public interface only |
| Mocking everything | Tests pass, code fails | Mock only external dependencies |
| No cleanup in tests | Memory leaks, interference | Always cleanup in afterEach |
| Testing XML/TSS | Fragile, implementation detail | Test rendered behavior instead |
| Hard dependencies | Untestable code | Use dependency injection |
| Shared state between tests | Flaky tests | Reset state in beforeEach |

## Test Checklist

Before committing code, verify:

- [ ] All unit tests pass
- [ ] New functionality has test coverage
- [ ] Controllers cleanup properly in tests
- [ ] Mocks are reset between tests
- [ ] No hard dependencies (use injection)
- [ ] Tests are independent (no shared state)
- [ ] Edge cases are covered (null, empty, error)
