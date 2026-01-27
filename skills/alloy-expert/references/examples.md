# PurgeTSS Implementation Examples (Alloy + PurgeTSS)

## API Client Service
Standard logic for network requests.

```javascript
// lib/api/client.js
exports.get = function(endpoint, params = {}) {
  return new Promise(function(resolve, reject) {
    const client = Ti.Network.createHTTPClient({
      onload: function() { resolve(JSON.parse(client.responseText)) },
      onerror: function(e) { reject(e) },
      timeout: 5000
    })
    client.open('GET', endpoint)
    client.send()
  })
}
```

## Native Module Wrapper Service
Encapsulate native modules (e.g., audio, maps, facebook) to decouple from controllers.

```javascript
// lib/services/nativeService.js
const someModule = require('ti.someModule')

exports.performAction = function(data) {
  someModule.doSomething({
    data: data,
    status: L('processing')
  })
}
```

## i18n Helper
Logic for complex string transformations and plurals.

```javascript
// lib/helpers/i18n.js
exports.getPluralMessages = function(count) {
  const key = count === 1 ? 'one_message' : 'many_messages'
  return L(key).replace('%d', count)
}
```

## Model with SQL Adapter
Definition for local SQLite persistence.

```javascript
// models/User.js
exports.definition = {
  config: {
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT',
      email: 'TEXT'
    },
    adapter: {
      type: 'sql',
      collection_name: 'users'
    }
  }
}
```

## Fully Styled & Accessible View (PurgeTSS)
Applying PurgeTSS classes while maintaining accessibility.

```xml
<!-- views/login.xml -->
<Alloy>
  <Window class="vertical bg-gray-50">
    <Animation id="myAnim" module="purgetss.ui" class="close:opacity-0 duration-500 open:opacity-100" />

    <!-- Spacer to center content -->
    <View class="h-auto" />

    <Label class="text-primary fa-solid fa-lock mx-6 mb-10 text-4xl"
      accessibilityLabel="L('login_icon_label')"
    />

    <TextField id="email"
      class="border-(1) mx-6 h-12 w-screen rounded-lg border-gray-300 bg-white"
      hintText="L('email_hint')"
      accessibilityLabel="L('email_label')"
    />

    <Button id="submit"
      class="bg-primary mx-6 mt-10 h-14 w-screen rounded-xl font-bold text-white"
      title="L('login_button')"
      accessibilityLabel="L('login_button')"
      accessibilityHint="L('login_hint')"
      onClick="doLogin"
    />

    <!-- Spacer to center content -->
    <View class="h-auto" />
  </Window>
</Alloy>
```

**Notes:**
- Use `vertical` layout on Window (not `flex-col`)
- Use `mx-6` for horizontal padding (not `p-6` on parent)
- Use `w-screen` for full width (not `w-full`)
- Use `border-(1)` with parentheses for arbitrary border width

## Cleanup Pattern in Controller
Critical for memory management and avoiding leaks.

```javascript
// controllers/login.js
const onNotification = (e) => {
  Ti.API.info('Notification received')
}

Ti.App.addEventListener('notification', onNotification)

function cleanup() {
  // Always remove app-level listeners
  Ti.App.removeEventListener('notification', onNotification)
  // Destroy Alloy bindings
  $.destroy()
}

// Expose for Navigation Service
$.cleanup = cleanup
```

## Animation Component Usage
Using the toolkit for UI transformations via the `<Animation>` component.

```javascript
// Inside any controller
function shakeError(element) {
  $.myAnim.play(element, 'animate-shake duration-200')
}
```

## Complete CRUD Example

```javascript
// lib/services/productService.js
const { productApi } = require('lib/api/productApi')
const { appStore } = require('lib/services/stateStore')
const logger = require('lib/services/logger')

exports.productService = {
  getAll: async function(filters = {}) {
    logger.debug('ProductService', 'Fetching products', filters)

    appStore.setState({ 'ui.isLoading': true })

    try {
      const products = await productApi.getAll(filters)
      Alloy.Collections.products.reset(products)
      return products
    } finally {
      appStore.setState({ 'ui.isLoading': false })
    }
  },

  getById: async function(id) {
    return productApi.getById(id)
  },

  create: async function(data) {
    const product = await productApi.create(data)
    Alloy.Collections.products.add(product)
    logger.info('ProductService', 'Product created', { id: product.id })
    return product
  },

  update: async function(id, data) {
    const product = await productApi.update(id, data)

    // Update in collection
    const existing = Alloy.Collections.products.get(id)
    if (existing) {
      existing.set(product)
    }

    logger.info('ProductService', 'Product updated', { id })
    return product
  },

  delete: async function(id) {
    await productApi.delete(id)
    Alloy.Collections.products.remove(id)
    logger.info('ProductService', 'Product deleted', { id })
  }
}
```

```xml
<!-- views/products/list.xml -->
<Alloy>
  <Window class="bg-gray-50">
    <ListView id="listView" class="wh-screen">
      <RefreshControl id="refresh" onRefresh="onRefresh" />

      <Templates>
        <ItemTemplate name="product" height="80">
          <View class="horizontal mb-2 h-20 w-screen bg-white">
            <ImageView bindId="image" class="wh-16 ml-3 rounded-lg" />
            <View class="vertical ml-3 w-auto">
              <Label bindId="name" class="text-base font-semibold" />
              <Label bindId="price" class="text-sm text-green-600" />
              <Label bindId="stock" class="text-xs text-gray-400" />
            </View>
          </View>
        </ItemTemplate>
      </Templates>

      <ListSection id="section" dataCollection="products">
        <ListItem template="product"
          image:image="{imageUrl}"
          name:text="{name}"
          price:text="${price}"
          stock:text="{stock} in stock"
        />
      </ListSection>
    </ListView>

    <Button id="addBtn"
      class="bg-primary rounded-full-14 absolute bottom-6 right-6 shadow-lg"
      onClick="onAddProduct"
    >
      <Label class="fa-solid fa-plus text-xl text-white" />
    </Button>
  </Window>
</Alloy>
```

```javascript
// controllers/products/list.js
const { Navigation } = require('lib/services/navigation')
const { productService } = require('lib/services/productService')

function init() {
  loadProducts()

  $.listView.addEventListener('itemclick', onItemClick)
}

async function loadProducts() {
  try {
    await productService.getAll()
  } catch (error) {
    showError(error.message)
  }
}

async function onRefresh() {
  try {
    await productService.getAll()
  } finally {
    $.refresh.endRefreshing()
  }
}

function onItemClick(e) {
  const productId = e.itemId
  Navigation.open('products/detail', { productId })
}

function onAddProduct() {
  const ctrl = Navigation.open('products/edit', { mode: 'create' })
  ctrl.on('product:saved', loadProducts)
}

function cleanup() {
  $.listView.removeEventListener('itemclick', onItemClick)
  $.destroy()
}

$.cleanup = cleanup
```

## ListView with Search and Filter

```xml
<!-- views/contacts/list.xml -->
<Alloy>
  <Window class="bg-white">
    <!-- Search and Filter Bar -->
    <View class="horizontal h-14 w-screen bg-gray-100">
      <SearchBar id="searchBar"
        class="h-10 w-8/12"
        hintText="L('search')"
        showCancel="true"
      />
      <Button id="filterBtn"
        class="h-10 w-4/12"
        title="L('filter')"
        onClick="showFilters"
      />
    </View>

    <!-- Active Filters -->
    <ScrollView id="filterTags" class="horizontal hidden h-10 w-screen">
      <!-- Dynamically populated filter tags -->
    </ScrollView>

    <ListView id="listView" class="wh-screen">
      <ListSection id="section" />
    </ListView>

    <!-- Empty State -->
    <View id="emptyState" class="wh-screen vertical hidden">
      <Label class="fa-solid fa-search mt-20 text-6xl text-gray-300" />
      <Label class="mt-4 text-lg text-gray-500" text="L('no_results')" />
    </View>
  </Window>
</Alloy>
```

```javascript
// controllers/contacts/list.js
let allItems = []
let activeFilters = { category: null, status: null }
let searchQuery = ''
let debounceTimer = null

function init() {
  loadData()

  $.searchBar.addEventListener('cancel', clearSearch)
  $.searchBar.addEventListener('change', onSearchChange)
}

function onSearchChange(e) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery = e.value.toLowerCase().trim()
    applyFilters()
  }, 300)
}

function clearSearch() {
  searchQuery = ''
  applyFilters()
}

function showFilters() {
  const dialog = Ti.UI.createOptionDialog({
    title: L('filter_by_category'),
    options: ['All', 'Work', 'Personal', 'Family', L('cancel')],
    cancel: 4
  })

  dialog.addEventListener('click', (e) => {
    if (e.index < 4) {
      activeFilters.category = e.index === 0 ? null : ['work', 'personal', 'family'][e.index - 1]
      updateFilterTags()
      applyFilters()
    }
  })

  dialog.show()
}

function applyFilters() {
  let filtered = [...allItems]

  // Apply search
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.email?.toLowerCase().includes(searchQuery)
    )
  }

  // Apply category filter
  if (activeFilters.category) {
    filtered = filtered.filter(item => item.category === activeFilters.category)
  }

  renderItems(filtered)

  // Show/hide empty state
  $.emptyState.visible = filtered.length === 0
  $.listView.visible = filtered.length > 0
}

function updateFilterTags() {
  // Clear existing tags
  $.filterTags.removeAllChildren()

  const hasFilters = activeFilters.category || activeFilters.status
  $.filterTags.visible = hasFilters

  if (activeFilters.category) {
    const tag = createFilterTag(activeFilters.category, () => {
      activeFilters.category = null
      updateFilterTags()
      applyFilters()
    })
    $.filterTags.add(tag)
  }
}

function createFilterTag(label, onRemove) {
  const tag = Ti.UI.createView({ width: Ti.UI.SIZE, height: 32 })
  tag.add(Ti.UI.createLabel({ text: label }))

  const closeBtn = Ti.UI.createLabel({ text: '×', right: 4 })
  closeBtn.addEventListener('click', onRemove)
  tag.add(closeBtn)

  return tag
}

function cleanup() {
  clearTimeout(debounceTimer)
  $.searchBar.removeEventListener('change', onSearchChange)
  $.destroy()
}

$.cleanup = cleanup
```

## Form with Validation Example

```xml
<!-- views/auth/register.xml -->
<Alloy>
  <Window class="vertical bg-white">
    <ScrollView class="wh-screen vertical" contentHeight="Ti.UI.SIZE">
      <View class="vertical mt-8 h-auto w-screen">
        <!-- Logo -->
        <ImageView class="wh-24" image="/images/logo.png" />

        <!-- Title -->
        <Label class="mt-6 text-2xl font-bold" text="L('create_account')" />

        <!-- Name Field -->
        <View class="mx-4 mt-6 w-screen">
          <Label class="text-sm text-gray-600" text="L('full_name')" />
          <TextField id="nameField"
            class="border-(1) return-key-type-next mt-1 h-12 w-screen rounded-lg border-gray-300 px-3"
            autocorrect="false"
          />
          <Label id="nameError" class="mt-1 hidden text-xs text-red-500" />
        </View>

        <!-- Email Field -->
        <View class="mx-4 mt-4 w-screen">
          <Label class="text-sm text-gray-600" text="L('email')" />
          <TextField id="emailField"
            class="border-(1) keyboard-type-email return-key-type-next mt-1 h-12 w-screen rounded-lg border-gray-300 px-3"
            autocapitalization="none"
          />
          <Label id="emailError" class="mt-1 hidden text-xs text-red-500" />
        </View>

        <!-- Password Field -->
        <View class="mx-4 mt-4 w-screen">
          <Label class="text-sm text-gray-600" text="L('password')" />
          <TextField id="passwordField"
            class="border-(1) return-key-type-next mt-1 h-12 w-screen rounded-lg border-gray-300 px-3"
            passwordMask="true"
          />
          <Label id="passwordError" class="mt-1 hidden text-xs text-red-500" />
          <Label class="mt-1 text-xs text-gray-400" text="L('password_hint')" />
        </View>

        <!-- Confirm Password -->
        <View class="mx-4 mt-4 w-screen">
          <Label class="text-sm text-gray-600" text="L('confirm_password')" />
          <TextField id="confirmField"
            class="border-(1) return-key-type-done mt-1 h-12 w-screen rounded-lg border-gray-300 px-3"
            passwordMask="true"
          />
          <Label id="confirmError" class="mt-1 hidden text-xs text-red-500" />
        </View>

        <!-- Terms Checkbox -->
        <View class="horizontal mx-4 mt-6 w-screen">
          <Switch id="termsSwitch" class="w-12" />
          <Label class="ml-2 w-auto text-sm text-gray-600" text="L('accept_terms')" />
        </View>

        <!-- Register Button -->
        <Button id="registerBtn"
          class="bg-primary mx-4 mt-6 h-14 w-screen rounded-xl font-bold text-white"
          title="L('register')"
          onClick="onRegister"
        />

        <!-- Login Link -->
        <View class="horizontal mt-4">
          <Label class="text-sm text-gray-600" text="L('have_account')" />
          <Label class="text-primary ml-1 text-sm" text="L('login')" onClick="goToLogin" />
        </View>
      </View>
    </ScrollView>
  </Window>
</Alloy>
```

```javascript
// controllers/auth/register.js
const { AuthService } = require('lib/services/authService')
const { Navigation } = require('lib/services/navigation')

const validators = {
  name: (value) => {
    if (!value?.trim()) return L('error_name_required')
    if (value.trim().length < 2) return L('error_name_short')
    return null
  },

  email: (value) => {
    if (!value?.trim()) return L('error_email_required')
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) return L('error_email_invalid')
    return null
  },

  password: (value) => {
    if (!value) return L('error_password_required')
    if (value.length < 8) return L('error_password_short')
    if (!/[A-Z]/.test(value)) return L('error_password_uppercase')
    if (!/[0-9]/.test(value)) return L('error_password_number')
    return null
  },

  confirm: (value, password) => {
    if (!value) return L('error_confirm_required')
    if (value !== password) return L('error_passwords_mismatch')
    return null
  }
}

function init() {
  // Field navigation
  $.nameField.addEventListener('return', () => $.emailField.focus())
  $.emailField.addEventListener('return', () => $.passwordField.focus())
  $.passwordField.addEventListener('return', () => $.confirmField.focus())
  $.confirmField.addEventListener('return', onRegister)

  // Real-time validation on blur
  $.nameField.addEventListener('blur', () => validateField('name'))
  $.emailField.addEventListener('blur', () => validateField('email'))
  $.passwordField.addEventListener('blur', () => validateField('password'))
  $.confirmField.addEventListener('blur', () => validateField('confirm'))
}

function validateField(field) {
  const fields = {
    name: { input: $.nameField, error: $.nameError },
    email: { input: $.emailField, error: $.emailError },
    password: { input: $.passwordField, error: $.passwordError },
    confirm: { input: $.confirmField, error: $.confirmError }
  }

  const { input, error } = fields[field]
  const value = input.value

  let errorMsg
  if (field === 'confirm') {
    errorMsg = validators[field](value, $.passwordField.value)
  } else {
    errorMsg = validators[field](value)
  }

  if (errorMsg) {
    error.applyProperties({ text: errorMsg, visible: true })
    input.applyProperties({ borderColor: '#ef4444' })
    return false
  } else {
    error.visible = false
    input.applyProperties({ borderColor: '#d1d5db' })
    return true
  }
}

function validateAll() {
  const nameValid = validateField('name')
  const emailValid = validateField('email')
  const passwordValid = validateField('password')
  const confirmValid = validateField('confirm')

  if (!$.termsSwitch.value) {
    Ti.UI.createAlertDialog({
      title: L('error'),
      message: L('error_accept_terms')
    }).show()
    return false
  }

  return nameValid && emailValid && passwordValid && confirmValid
}

async function onRegister() {
  if (!validateAll()) return

  setLoading(true)

  try {
    await AuthService.register({
      name: $.nameField.value.trim(),
      email: $.emailField.value.trim().toLowerCase(),
      password: $.passwordField.value
    })

    // Success - navigate to home
    Navigation.replace('main')

  } catch (error) {
    Ti.UI.createAlertDialog({
      title: L('error'),
      message: error.message
    }).show()
  } finally {
    setLoading(false)
  }
}

function setLoading(loading) {
  $.registerBtn.applyProperties({
    enabled: !loading,
    title: loading ? L('registering') : L('register')
  })
}

function goToLogin() {
  Navigation.back()
}

function cleanup() {
  $.destroy()
}

$.cleanup = cleanup
```

## Tab-Based Navigation Example

```xml
<!-- views/main.xml -->
<Alloy>
  <TabGroup id="tabGroup" class="tabs-bg-white active-tint-blue-500">

    <Tab id="homeTab" title="L('home')" icon="/images/icons/home.png">
      <Require src="tabs/home" />
    </Tab>

    <Tab id="searchTab" title="L('search')" icon="/images/icons/search.png">
      <Require src="tabs/search" />
    </Tab>

    <Tab id="cartTab" title="L('cart')" icon="/images/icons/cart.png">
      <Require src="tabs/cart" />
    </Tab>

    <Tab id="profileTab" title="L('profile')" icon="/images/icons/profile.png">
      <Require src="tabs/profile" />
    </Tab>
  </TabGroup>
</Alloy>
```

```javascript
// controllers/main.js
const EventBus = require('lib/services/eventBus')
const Events = EventBus.Events

function init() {
  // Listen for cart updates to show badge
  EventBus.on(Events.CART_UPDATED, onCartUpdated)

  // Track tab changes
  $.tabGroup.addEventListener('focus', onTabFocus)
}

function onTabFocus(e) {
  // Analytics tracking
  const tabNames = ['home', 'search', 'cart', 'profile']
  Ti.Analytics.featureEvent(`tab:${tabNames[e.index]}`)
}

function onCartUpdated({ itemCount }) {
  // Update badge on cart tab
  $.cartTab.badge = itemCount > 0 ? String(itemCount) : null
}

// Switch to specific tab programmatically
function switchToTab(tabName) {
  const tabMap = { home: 0, search: 1, cart: 2, profile: 3 }
  const index = tabMap[tabName]

  if (index !== undefined) {
    $.tabGroup.activeTab = $.tabGroup.tabs[index]
  }
}

// Export for external access
$.switchToTab = switchToTab

function cleanup() {
  EventBus.off(Events.CART_UPDATED, onCartUpdated)
  $.tabGroup.removeEventListener('focus', onTabFocus)
  $.destroy()
}

$.cleanup = cleanup
```

```javascript
// controllers/tabs/home.js
// Each tab is a separate controller with its own lifecycle
function init() {
  loadFeaturedProducts()

  // Handle window focus (tab selected)
  $.getView().addEventListener('focus', onFocus)
}

function onFocus() {
  // Refresh data when returning to this tab
  if (shouldRefresh()) {
    loadFeaturedProducts()
  }
}

function cleanup() {
  $.getView().removeEventListener('focus', onFocus)
  $.destroy()
}

$.cleanup = cleanup
```
