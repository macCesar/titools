# Error Handling & Logging Guide

## AppError Classes

```javascript
// lib/core/appError.js
export class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.name = 'AppError'
    Error.captureStackTrace?.(this, this.constructor)
  }
}

// Specific error types
export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0)
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404)
  }
}

// Error codes for reference
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR'
}
```

## Logger Service

```javascript
// lib/services/logger.js
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

class Logger {
  constructor() {
    this.level = this._getLogLevel()
    this.sessionId = this._generateSessionId()
  }

  _getLogLevel() {
    const deployType = Ti.App.deployType

    if (deployType === 'development') {
      return LogLevel.DEBUG
    } else if (deployType === 'test') {
      return LogLevel.WARN
    }

    return LogLevel.INFO
  }

  _generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  _shouldLog(level) {
    return level >= this.level
  }

  _log(level, tag, message, data = {}) {
    if (!this._shouldLog(level)) {
      return
    }

    const logData = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      level: this._levelName(level),
      tag,
      message,
      ...data
    }

    const logString = JSON.stringify(logData)

    switch (level) {
      case LogLevel.DEBUG:
        Ti.API.debug(`[${tag}] ${message}`, logString)
        break
      case LogLevel.INFO:
        Ti.API.info(`[${tag}] ${message}`, logString)
        break
      case LogLevel.WARN:
        Ti.API.warn(`[${tag}] ${message}`, logString)
        break
      case LogLevel.ERROR:
        Ti.API.error(`[${tag}] ${message}`, logString)
        break
    }
  }

  _levelName(level) {
    return Object.keys(LogLevel).find(key => LogLevel[key] === level)
  }

  debug(tag, message, data) {
    this._log(LogLevel.DEBUG, tag, message, data)
  }

  info(tag, message, data) {
    this._log(LogLevel.INFO, tag, message, data)
  }

  warn(tag, message, data) {
    this._log(LogLevel.WARN, tag, message, data)
  }

  error(tag, message, data) {
    this._log(LogLevel.ERROR, tag, message, data)
  }
}

export default new Logger()
```

## Error Handler Service

```javascript
// lib/services/errorHandler.js
import logger from 'lib/services/logger'
import { AppError } from 'lib/core/appError'

export function handleError(error, context = {}) {
  // Log the error
  logger.error('ErrorHandler', 'Error occurred', {
    message: error.message,
    code: error.code,
    status: error.statusCode,
    stack: error.stack,
    ...context
  })

  // Report to crash service (if configured)
  _reportToCrashService(error, context)

  // Return user-friendly message
  return _getUserMessage(error)
}

function _reportToCrashService(error, context) {
  // Only in production
  if (Ti.App.deployType !== 'production') {
    return
  }

  // Example: Sentry integration
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(error, {
      extra: context
    })
  }
}

function _getUserMessage(error) {
  const messages = {
    NETWORK_ERROR: L('error_network'),
    AUTH_ERROR: L('error_auth'),
    VALIDATION_ERROR: L('error_validation'),
    NOT_FOUND: L('error_not_found'),
    SERVER_ERROR: L('error_server')
  }

  if (error instanceof AppError) {
    return messages[error.code] || L('error_unknown')
  }

  return L('error_unknown')
}
```

## Using the Logger

```javascript
// lib/services/userService.js
import logger from 'lib/services/logger'
import { NetworkError, NotFoundError } from 'lib/core/appError'

export async function getUserProfile(userId) {
  logger.info('UserService', 'Fetching user profile', { userId })

  try {
    const response = await api.get(`/users/${userId}`)

    logger.debug('UserService', 'User profile fetched', {
      userId,
      hasData: !!response.data
    })

    return response.data

  } catch (error) {
    logger.error('UserService', 'Failed to fetch user profile', {
      userId,
      error: error.message,
      status: error.statusCode
    })

    if (error.status === 404) {
      throw new NotFoundError('User not found')
    }

    throw new NetworkError('Failed to load profile')
  }
}
```

## API Client Error Handling

```javascript
// lib/api/client.js
import logger from 'lib/services/logger'
import { NetworkError, AuthError, NotFoundError, ValidationError } from 'lib/core/appError'

export async function get(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const client = Ti.Network.createHTTPClient({
      timeout: 10000,

      onload: () => {
        try {
          const data = JSON.parse(client.responseText)

          logger.debug('API', 'Request successful', {
            endpoint,
            status: client.status
          })

          resolve(data)

        } catch (e) {
          logger.error('API', 'Invalid JSON response', {
            endpoint,
            responseText: client.responseText
          })

          reject(new ValidationError('Invalid response format'))
        }
      },

      onerror: (e) => {
        logger.error('API', 'Request failed', {
          endpoint,
          status: client.status,
          error: e.error
        })

        // Map HTTP status to error types
        let error

        switch (client.status) {
          case 401:
            error = new AuthError()
            break
          case 404:
            error = new NotFoundError()
            break
          case 0:
            error = new NetworkError('Network unavailable')
            break
          default:
            error = new NetworkError(`Request failed: ${client.status}`)
        }

        reject(error)
      }
    })

    logger.debug('API', 'Sending request', { endpoint, params })

    client.open('GET', endpoint)
    client.send(params)
  })
}
```

## Controller Error Handling Pattern

```javascript
// controllers/user/detail.js
import logger from 'lib/services/logger'
import { handleError } from 'lib/services/errorHandler'
import { getUserProfile } from 'lib/services/userService'

function init() {
  logger.debug('UserDetail', 'Controller initialized', { userId: $.args.userId })

  loadUserData()

  // Handle retry button
  $.retryButton.addEventListener('click', loadUserData)
}

async function loadUserData() {
  // Show loading state
  setLoading(true)

  try {
    const user = await getUserProfile($.args.userId)

    // Update UI
    updateUI(user)

    logger.info('UserDetail', 'User data loaded successfully', {
      userId: user.id
    })

  } catch (error) {
    // Handle error
    const userMessage = handleError(error, {
      controller: 'user/detail',
      userId: $.args.userId
    })

    showError(userMessage)

  } finally {
    setLoading(false)
  }
}

function setLoading(isLoading) {
  $.activityIndicator.visible = isLoading

  if (isLoading) {
    $.activityIndicator.show()
  } else {
    $.activityIndicator.hide()
  }
}

function showError(message) {
  $.errorLabel.text = message
  $.errorLabel.visible = true

  // Auto-hide after 3 seconds
  setTimeout(() => {
    $.errorLabel.visible = false
  }, 3000)
}

function cleanup() {
  logger.debug('UserDetail', 'Controller cleanup')
  $.retryButton.removeEventListener('click', loadUserData)
  $.destroy()
}

$.cleanup = cleanup
```

## Global Error Handler

```javascript
// alloy.js - Setup global error catching
import { handleError } from 'lib/services/errorHandler'

// Catch unhandled errors in production
if (Ti.App.deployType === 'production') {
  Ti.App.addEventListener('uncaughtException', (event) => {
    handleError(event.exception, {
      type: 'uncaughtException',
      url: event.url
    })

    // Show friendly error screen
    Alloy.createController('error/crash').getView().open()
  })
}
```

## Crash Reporting Integration

```javascript
// lib/services/crashReporting.js
export function initSentry(dsn) {
  if (typeof Sentry === 'undefined') return

  Sentry.init({
    dsn: dsn,
    environment: Ti.App.deployType,
    release: Ti.App.version
  })

  // Set user context when available
  const userId = Ti.App.Properties.getString('userId')
  if (userId) {
    Sentry.setUser({ id: userId })
  }
}

export function reportToCrashService(error, context = {}) {
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(error, {
      extra: context
    })
  }
}
```

## Validation Helper

```javascript
// lib/helpers/validator.js
import { ValidationError } from 'lib/core/appError'
import logger from 'lib/services/logger'

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regex.test(email)) {
    logger.warn('Validator', 'Invalid email', { email })

    throw new ValidationError(L('error_invalid_email'))
  }

  return email.trim().toLowerCase()
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    logger.warn('Validator', 'Password too short')

    throw new ValidationError(L('error_password_short'))
  }

  return password
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    logger.warn('Validator', 'Required field missing', { fieldName })

    throw new ValidationError(L('error_required', { field: fieldName }))
  }

  return value
}
```

## Logging Best Practices

| Practice | Example |
|----------|---------|
| Use appropriate log levels | `DEBUG` for diagnostics, `ERROR` for failures |
| Include context data | `logger.info('Service', 'Action', { userId, action })` |
| Don't log sensitive data | Never log passwords, tokens, credit cards |
| Use tags for filtering | `logger.error('AuthService', ...)` |
| Log at boundaries | Entry/exit of functions, API calls, user actions |

| DO | DON'T |
|-----|-------|
| Log at appropriate levels (DEBUG, INFO, WARN, ERROR) | Log everything at INFO or ERROR |
| Include structured data as second parameter | Build message strings with concatenation |
| Use DEBUG for development diagnostics | Use Ti.API.log directly |
| Log errors with stack traces in production | Log sensitive data (passwords, tokens) |
| Use context objects for correlation | Log without identifying the source |
