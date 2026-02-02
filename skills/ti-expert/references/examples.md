# Alloy Implementation Examples

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

## Fully Styled & Accessible View
Applying TSS styles while maintaining accessibility.

```xml
<!-- views/login.xml -->
<Alloy>
  <Window id="loginWindow">
    <!-- Spacer to center content -->
    <View id="topSpacer" />

    <ImageView id="lockIcon" image="/images/lock.png"
      accessibilityLabel="L('login_icon_label')"
    />

    <TextField id="email"
      hintText="L('email_hint')"
      accessibilityLabel="L('email_label')"
    />

    <Button id="submit"
      title="L('login_button')"
      accessibilityLabel="L('login_button')"
      accessibilityHint="L('login_hint')"
      onClick="doLogin"
    />

    <!-- Spacer to center content -->
    <View id="bottomSpacer" />
  </Window>
</Alloy>
```

```tss
/* styles/login.tss */
"#loginWindow": { layout: 'vertical', backgroundColor: '#f9fafb' }
"#topSpacer": { height: Ti.UI.SIZE }
"#lockIcon": { left: 24, right: 24, bottom: 40, width: 48, height: 48 }
"#email": { left: 24, right: 24, height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff' }
"#submit": { left: 24, right: 24, top: 40, height: 56, borderRadius: 12, backgroundColor: '#2563eb', color: '#fff', font: { fontWeight: 'bold' } }
"#bottomSpacer": { height: Ti.UI.SIZE }
```

**Notes:**
- Use `layout: 'vertical'` on Window for top-to-bottom content flow
- Use margins on children for spacing (NOT padding on parent)
- Use `Ti.UI.FILL` for full-width elements

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

## Animation Usage
Using `Ti.UI.createAnimation()` for UI transformations.

```javascript
// Inside any controller
function shakeError(element) {
  const shake = Ti.UI.createAnimation({ duration: 50 })
  const offset = 10

  shake.transform = Ti.UI.createMatrix2D().translate(offset, 0)
  element.animate(shake, () => {
    shake.transform = Ti.UI.createMatrix2D().translate(-offset, 0)
    element.animate(shake, () => {
      shake.transform = Ti.UI.createMatrix2D()
      element.animate(shake)
    })
  })
}
```

## Complete CRUD Example

```javascript
// lib/services/productService.js
const { productApi } = require('api/productApi')
const { appStore } = require('services/stateStore')
const logger = require('services/logger')

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
  <Window id="productsWindow">
    <ListView id="listView">
      <RefreshControl id="refresh" onRefresh="onRefresh" />

      <Templates>
        <ItemTemplate name="product" height="80">
          <View id="productRow">
            <ImageView bindId="image" id="productImg" />
            <View id="productInfo">
              <Label bindId="name" id="productName" />
              <Label bindId="price" id="productPrice" />
              <Label bindId="stock" id="productStock" />
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

    <Button id="addBtn" onClick="onAddProduct" title="+" />
  </Window>
</Alloy>
```

```tss
/* styles/products/list.tss */
"#productsWindow": { backgroundColor: '#f9fafb' }
"#listView": { width: Ti.UI.FILL, height: Ti.UI.FILL }
"#productRow": { layout: 'horizontal', bottom: 8, height: 80, width: Ti.UI.FILL, backgroundColor: '#fff' }
"#productImg": { left: 12, width: 64, height: 64, borderRadius: 8 }
"#productInfo": { layout: 'vertical', left: 12 }
"#productName": { font: { fontSize: 16, fontWeight: 'semibold' } }
"#productPrice": { font: { fontSize: 14 }, color: '#16a34a' }
"#productStock": { font: { fontSize: 12 }, color: '#9ca3af' }
"#addBtn": { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', color: '#fff', font: { fontSize: 24 } }
```

```javascript
// controllers/products/list.js
const { Navigation } = require('services/navigation')
const { productService } = require('services/productService')

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
  <Window id="contactsWindow">
    <!-- Search and Filter Bar -->
    <View id="searchFilterBar">
      <SearchBar id="searchBar"
        hintText="L('search')"
        showCancel="true"
      />
      <Button id="filterBtn"
        title="L('filter')"
        onClick="showFilters"
      />
    </View>

    <!-- Active Filters -->
    <ScrollView id="filterTags">
      <!-- Dynamically populated filter tags -->
    </ScrollView>

    <ListView id="listView">
      <ListSection id="section" />
    </ListView>

    <!-- Empty State -->
    <View id="emptyState">
      <ImageView id="emptyIcon" image="/images/search.png" />
      <Label id="emptyLabel" text="L('no_results')" />
    </View>
  </Window>
</Alloy>
```

```tss
/* styles/contacts/list.tss */
"#contactsWindow": { backgroundColor: '#fff' }
"#searchFilterBar": { layout: 'horizontal', height: 56, width: Ti.UI.FILL, backgroundColor: '#f3f4f6' }
"#searchBar": { height: 40, width: '66%' }
"#filterBtn": { height: 40, width: '34%' }
"#filterTags": { layout: 'horizontal', height: 40, width: Ti.UI.FILL, visible: false }
"#listView": { width: Ti.UI.FILL, height: Ti.UI.FILL }
"#emptyState": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.FILL, visible: false }
"#emptyIcon": { top: 80, width: 64, height: 64 }
"#emptyLabel": { top: 16, font: { fontSize: 18 }, color: '#6b7280' }
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
  <Window id="registerWindow">
    <ScrollView id="scrollView" contentHeight="Ti.UI.SIZE">
      <View id="formContainer">
        <!-- Logo -->
        <ImageView id="logo" image="/images/logo.png" />

        <!-- Title -->
        <Label id="titleLabel" text="L('create_account')" />

        <!-- Name Field -->
        <View id="nameGroup">
          <Label id="nameLabel" text="L('full_name')" />
          <TextField id="nameField" autocorrect="false"
            returnKeyType="Ti.UI.RETURNKEY_NEXT"
          />
          <Label id="nameError" />
        </View>

        <!-- Email Field -->
        <View id="emailGroup">
          <Label id="emailLabel" text="L('email')" />
          <TextField id="emailField"
            keyboardType="Ti.UI.KEYBOARD_TYPE_EMAIL"
            returnKeyType="Ti.UI.RETURNKEY_NEXT"
            autocapitalization="none"
          />
          <Label id="emailError" />
        </View>

        <!-- Password Field -->
        <View id="passwordGroup">
          <Label id="passwordLabel" text="L('password')" />
          <TextField id="passwordField" passwordMask="true"
            returnKeyType="Ti.UI.RETURNKEY_NEXT"
          />
          <Label id="passwordError" />
          <Label id="passwordHint" text="L('password_hint')" />
        </View>

        <!-- Confirm Password -->
        <View id="confirmGroup">
          <Label id="confirmLabel" text="L('confirm_password')" />
          <TextField id="confirmField" passwordMask="true"
            returnKeyType="Ti.UI.RETURNKEY_DONE"
          />
          <Label id="confirmError" />
        </View>

        <!-- Terms Checkbox -->
        <View id="termsRow">
          <Switch id="termsSwitch" />
          <Label id="termsLabel" text="L('accept_terms')" />
        </View>

        <!-- Register Button -->
        <Button id="registerBtn"
          title="L('register')"
          onClick="onRegister"
        />

        <!-- Login Link -->
        <View id="loginRow">
          <Label id="haveAccountLabel" text="L('have_account')" />
          <Label id="loginLink" text="L('login')" onClick="goToLogin" />
        </View>
      </View>
    </ScrollView>
  </Window>
</Alloy>
```

```tss
/* styles/auth/register.tss */
"#registerWindow": { layout: 'vertical', backgroundColor: '#fff' }
"#scrollView": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.FILL }
"#formContainer": { layout: 'vertical', top: 32, height: Ti.UI.SIZE, width: Ti.UI.FILL }
"#logo": { width: 96, height: 96 }
"#titleLabel": { top: 24, font: { fontSize: 24, fontWeight: 'bold' } }
".fieldGroup": { layout: 'vertical', left: 16, right: 16, top: 16, width: Ti.UI.FILL }
"#nameGroup": { layout: 'vertical', left: 16, right: 16, top: 24, width: Ti.UI.FILL }
"#emailGroup": { layout: 'vertical', left: 16, right: 16, top: 16, width: Ti.UI.FILL }
"#passwordGroup": { layout: 'vertical', left: 16, right: 16, top: 16, width: Ti.UI.FILL }
"#confirmGroup": { layout: 'vertical', left: 16, right: 16, top: 16, width: Ti.UI.FILL }
"Label": { font: { fontSize: 14 }, color: '#4b5563' }
"TextField": { top: 4, height: 48, width: Ti.UI.FILL, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', paddingLeft: 12 }
"#nameError": { top: 4, font: { fontSize: 12 }, color: '#ef4444', visible: false }
"#emailError": { top: 4, font: { fontSize: 12 }, color: '#ef4444', visible: false }
"#passwordError": { top: 4, font: { fontSize: 12 }, color: '#ef4444', visible: false }
"#passwordHint": { top: 4, font: { fontSize: 12 }, color: '#9ca3af' }
"#confirmError": { top: 4, font: { fontSize: 12 }, color: '#ef4444', visible: false }
"#termsRow": { layout: 'horizontal', left: 16, right: 16, top: 24, width: Ti.UI.FILL }
"#termsSwitch": { width: 48 }
"#termsLabel": { left: 8 }
"#registerBtn": { left: 16, right: 16, top: 24, height: 56, borderRadius: 12, backgroundColor: '#2563eb', color: '#fff', font: { fontWeight: 'bold' } }
"#loginRow": { layout: 'horizontal', top: 16 }
"#haveAccountLabel": { font: { fontSize: 14 }, color: '#4b5563' }
"#loginLink": { left: 4, font: { fontSize: 14 }, color: '#2563eb' }
```

```javascript
// controllers/auth/register.js
const { AuthService } = require('services/authService')
const { Navigation } = require('services/navigation')

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
  <TabGroup id="tabGroup">

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
const EventBus = require('services/eventBus')
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
