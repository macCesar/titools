# Layer Contracts & Interfaces

Contracts define the input/output specifications between layers, ensuring consistent communication and easy testing.

## API Layer Contracts

```javascript
// lib/api/userApi.js

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatarUrl]
 */

/**
 * @typedef {Object} UserFilters
 * @property {string} [search] - Search by name or email
 * @property {number} [limit] - Max results (default: 20)
 * @property {number} [offset] - Pagination offset
 */

export const userApi = {
  /**
   * Get paginated list of users
   * @param {UserFilters} [filters]
   * @returns {Promise<{users: User[], total: number}>}
   */
  async getAll(filters = {}) {
    return apiClient.get('/users', filters)
  },

  /**
   * Get single user by ID
   * @param {number} id
   * @returns {Promise<User>}
   * @throws {NotFoundError} When user doesn't exist
   */
  async getById(id) {
    return apiClient.get(`/users/${id}`)
  },

  /**
   * Create new user
   * @param {{name: string, email: string}} data
   * @returns {Promise<User>}
   * @throws {ValidationError} When data is invalid
   */
  async create(data) {
    return apiClient.post('/users', data)
  },

  /**
   * Update existing user
   * @param {number} id
   * @param {Partial<User>} data
   * @returns {Promise<User>}
   */
  async update(id, data) {
    return apiClient.put(`/users/${id}`, data)
  },

  /**
   * Delete user
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    return apiClient.delete(`/users/${id}`)
  }
}
```

## Service Layer Contracts

```javascript
// lib/services/authService.js

/**
 * @typedef {Object} LoginResult
 * @property {User} user
 * @property {string} token
 * @property {number} expiresIn - Token expiry in seconds
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated
 * @property {User|null} user
 * @property {boolean} isLoading
 */

export const AuthService = {
  /**
   * Authenticate user with credentials
   * @param {string} email
   * @param {string} password
   * @returns {Promise<LoginResult>}
   * @throws {ValidationError} When credentials format is invalid
   * @throws {AuthError} When credentials are incorrect
   */
  async login(email, password) { /* ... */ },

  /**
   * End user session
   * @returns {Promise<void>}
   */
  async logout() { /* ... */ },

  /**
   * Check if user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() { /* ... */ },

  /**
   * Get current auth state
   * @returns {AuthState}
   */
  getState() { /* ... */ }
}
```

## Controller Contracts

Document expected inputs and outputs for each controller:

```javascript
// controllers/user/detail.js

/**
 * User Detail Controller
 *
 * @description Displays and allows editing of user details
 *
 * INPUT (via $.args):
 *   @param {number} userId - Required. User ID to display
 *   @param {boolean} [editable=false] - Allow editing
 *
 * OUTPUT (via events):
 *   @fires 'user:updated' - When user data is saved
 *     @param {User} user - Updated user object
 *
 *   @fires 'user:deleted' - When user is deleted
 *     @param {number} userId - Deleted user ID
 *
 * LIFECYCLE:
 *   - init() called on creation
 *   - cleanup() called on close (removes all listeners)
 *
 * EXAMPLE:
 *   const ctrl = Navigation.open('user/detail', { userId: 123, editable: true })
 *   ctrl.on('user:updated', (user) => refreshList())
 */

function init() {
  if (!$.args.userId) {
    throw new Error('userId is required')
  }
  loadUser($.args.userId)
}

// ...implementation

$.cleanup = cleanup
```

## Navigation Service Contract

```javascript
// lib/services/navigation.js

/**
 * @typedef {Object} NavigationOptions
 * @property {boolean} [modal=false] - Open as modal
 * @property {boolean} [animated=true] - Animate transition
 */

export const Navigation = {
  /**
   * Open a new screen
   * @param {string} route - Controller path (e.g., 'user/detail')
   * @param {Object} [params] - Arguments passed to controller
   * @param {NavigationOptions} [options]
   * @returns {Controller} - The opened controller instance
   */
  open(route, params = {}, options = {}) { /* ... */ },

  /**
   * Close current screen and go back
   * @returns {void}
   */
  back() { /* ... */ },

  /**
   * Replace current screen without animation
   * @param {string} route
   * @param {Object} [params]
   * @returns {Controller}
   */
  replace(route, params = {}) { /* ... */ },

  /**
   * Get current navigation stack
   * @returns {string[]} - Array of route names
   */
  getStack() { /* ... */ }
}
```

## Helper Contracts

```javascript
// lib/helpers/formatters.js

export const Formatters = {
  /**
   * Format currency with locale
   * @param {number} amount
   * @param {string} [currency='USD']
   * @returns {string} - e.g., "$1,234.56"
   */
  currency(amount, currency = 'USD') { /* ... */ },

  /**
   * Format date relative to now
   * @param {Date|string} date
   * @returns {string} - e.g., "2 hours ago", "Yesterday"
   */
  relativeTime(date) { /* ... */ },

  /**
   * Pluralize string based on count
   * @param {number} count
   * @param {string} singular
   * @param {string} [plural] - Defaults to singular + 's'
   * @returns {string} - e.g., "1 item", "5 items"
   */
  pluralize(count, singular, plural) { /* ... */ }
}
```

## Event Bus Contract

```javascript
// lib/services/eventBus.js

/**
 * Named events for type safety and discoverability
 */
export const Events = {
  // User events
  USER_LOGGED_IN: 'user:loggedIn',      // payload: { user: User }
  USER_LOGGED_OUT: 'user:loggedOut',    // payload: none
  USER_UPDATED: 'user:updated',          // payload: { user: User }

  // Data sync events
  SYNC_STARTED: 'sync:started',          // payload: none
  SYNC_COMPLETE: 'sync:complete',        // payload: { count: number }
  SYNC_FAILED: 'sync:failed',            // payload: { error: Error }

  // Network events
  NETWORK_ONLINE: 'network:online',      // payload: none
  NETWORK_OFFLINE: 'network:offline',    // payload: none

  // Cart events (e-commerce example)
  CART_UPDATED: 'cart:updated',          // payload: { items: CartItem[], total: number }
  CART_CLEARED: 'cart:cleared'           // payload: none
}
```

## Contract Enforcement Tips

1. **Always validate `$.args`** at controller initialization
2. **Use TypeScript JSDoc** for IDE autocompletion and error detection
3. **Document all events** with their payload structure
4. **Throw specific errors** (ValidationError, NotFoundError, AuthError)
5. **Return consistent shapes** from API methods