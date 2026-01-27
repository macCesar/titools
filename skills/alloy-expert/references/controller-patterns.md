# PurgeTSS Implementation Patterns

## Standard PurgeTSS View Template

```xml
<!-- views/user/card.xml -->
<Alloy>
  <View class="border-(1) m-2 rounded-xl border-gray-200 bg-white shadow-md">
    <View class="horizontal m-3 w-screen">
      <Label class="fa-solid fa-user-circle text-4xl text-blue-500" />
      <View class="vertical ml-3">
        <Label id="name" class="text-lg font-bold text-gray-900" />
        <Label id="email" class="text-sm text-gray-500" />
      </View>
    </View>
    <Button class="mx-3 mb-3 mt-4 h-10 w-screen rounded-md bg-blue-600 font-medium text-white"
      title="L('view_profile')"
      onClick="onViewProfile"
    />
  </View>
</Alloy>
```

**PurgeTSS Layout Rules:**
- Use `horizontal` (not `flex-row`) for left-to-right
- Use `vertical` (not `flex-col`) for top-to-bottom
- Omit layout class for composite (absolute positioning)
- Use `m-*` on children instead of `p-*` on parent
- Use `border-(1)` with parentheses for arbitrary values

## Animation Component Usage

Always prefer the PurgeTSS Animation component over manual matrix calculations.

```xml
<Animation id="myAnim" module="purgetss.ui" class="close:opacity-0 duration-500 open:opacity-100" />
```

```javascript
// controllers/user/card.js
function show() {
  $.myAnim.open($.container)
}

function hide() {
  $.myAnim.close($.container, () => {
    $.container.applyProperties({ visible: false })
  })
}
```

## Draggable Method
Use the `draggable` method to convert views into draggable elements.

```javascript
$.myAnim.draggable([$.red, $.green, $.blue])
```

## Dynamic Styling with Classes

To change styles dynamically, use `classes` instead of individual property updates.

```javascript
function setStatus(isActive) {
  $.statusLabel.applyProperties({
    classes: isActive ? ['text-green-500'] : ['text-red-500'],
    text: isActive ? L('active') : L('inactive')
  })
}
```

## Grid System

Use PurgeTSS percentage-based widths for responsive layouts.

```xml
<!-- Horizontal layout with percentage widths -->
<View class="horizontal w-screen">
  <View class="h-20 w-8/12 bg-red-100" />
  <View class="h-20 w-4/12 bg-blue-100" />
</View>

<!-- Or use the grid-cols system -->
<View class="w-screen grid-cols-3 gap-2">
  <View class="h-20 bg-red-100" />
  <View class="h-20 bg-blue-100" />
  <View class="h-20 bg-green-100" />
</View>
```

## Controller Lifecycle Patterns

Show init, focus, blur, close lifecycle:
```javascript
// controllers/user/profile.js
function init() {
  // Called once when controller is created
  loadUserData()
}

// Handle window focus (returning to this screen)
$.getView().addEventListener('focus', () => {
  // Refresh data when screen becomes visible
  refreshIfNeeded()
})

// Handle window blur (leaving this screen)
$.getView().addEventListener('blur', () => {
  // Pause animations, stop timers
  pauseAutoRefresh()
})

// Handle window close
$.getView().addEventListener('close', () => {
  // Cleanup is called automatically by Navigation service
})

function cleanup() {
  $.getView().removeEventListener('focus', onFocus)
  $.getView().removeEventListener('blur', onBlur)
  $.destroy()
}

$.cleanup = cleanup
```

## Form Handling Patterns

```xml
<!-- views/user/edit.xml -->
<Alloy>
  <Window class="vertical bg-white">
    <ScrollView class="wh-screen vertical">
      <View class="vertical mt-4 h-auto w-screen">
        <Label class="ml-4 text-sm text-gray-500" text="L('name_label')" />
        <TextField id="nameField"
          class="border-(1) return-key-type-next mx-4 mt-1 h-12 w-screen rounded-lg border-gray-300 bg-gray-50 px-3"
          hintText="L('name_hint')"
          onReturn="focusNextField"
        />

        <Label class="ml-4 mt-4 text-sm text-gray-500" text="L('email_label')" />
        <TextField id="emailField"
          class="border-(1) keyboard-type-email return-key-type-done mx-4 mt-1 h-12 w-screen rounded-lg border-gray-300 bg-gray-50 px-3"
          hintText="L('email_hint')"
          onReturn="submitForm"
        />

        <Label id="errorLabel" class="ml-4 mt-2 hidden text-sm text-red-500" />

        <Button id="submitBtn"
          class="bg-primary mx-4 mt-6 h-14 w-screen rounded-xl font-bold text-white"
          title="L('save')"
          onClick="submitForm"
        />
      </View>
    </ScrollView>
  </Window>
</Alloy>
```

```javascript
// controllers/user/edit.js
const { validateEmail, validateRequired } = require('lib/helpers/validator')
const { userService } = require('lib/services/userService')

const fields = ['nameField', 'emailField']
let currentFieldIndex = 0

function focusNextField() {
  currentFieldIndex++
  if (currentFieldIndex < fields.length) {
    $[fields[currentFieldIndex]].focus()
  } else {
    submitForm()
  }
}

async function submitForm() {
  // Hide keyboard
  Ti.UI.Android?.hideSoftKeyboard() || $.nameField.blur()

  // Clear previous errors
  $.errorLabel.applyProperties({ visible: false, text: '' })

  try {
    // Validate
    const name = validateRequired($.nameField.value, 'Name')
    const email = validateEmail($.emailField.value)

    // Show loading
    setLoading(true)

    // Submit
    await userService.updateProfile({ name, email })

    // Success - close and notify
    $.trigger('user:saved')
    Navigation.back()

  } catch (error) {
    $.errorLabel.applyProperties({
      text: error.message,
      visible: true
    })
  } finally {
    setLoading(false)
  }
}

function setLoading(isLoading) {
  $.submitBtn.applyProperties({
    enabled: !isLoading,
    title: isLoading ? L('saving') : L('save')
  })
}
```

## Loading State Patterns

```xml
<!-- Skeleton loading pattern -->
<View id="loadingState" class="wh-screen vertical">
  <View class="mx-4 mt-4 h-20 w-screen animate-pulse rounded-lg bg-gray-200" />
  <View class="mx-4 mt-4 h-4 w-8/12 animate-pulse rounded bg-gray-200" />
  <View class="mx-4 mt-2 h-4 w-6/12 animate-pulse rounded bg-gray-200" />
</View>

<View id="contentState" class="wh-screen hidden">
  <!-- Actual content here -->
</View>

<View id="errorState" class="wh-screen vertical hidden">
  <Label class="fa-solid fa-exclamation-circle mt-20 text-6xl text-gray-400" />
  <Label class="mt-4 text-lg text-gray-500" text="L('error_loading')" />
  <Button class="bg-primary mt-4 h-10 rounded-lg px-6 text-white"
    title="L('retry')"
    onClick="loadData"
  />
</View>
```

```javascript
// State management helper
function setState(state) {
  const states = ['loadingState', 'contentState', 'errorState']
  states.forEach(s => {
    $[s].visible = s === state
  })
}

async function loadData() {
  setState('loadingState')

  try {
    const data = await api.fetchData()
    renderContent(data)
    setState('contentState')
  } catch (error) {
    setState('errorState')
  }
}
```

## Modal and Dialog Patterns

```javascript
// AlertDialog
function showConfirmDelete(itemName) {
  const dialog = Ti.UI.createAlertDialog({
    title: L('confirm_delete'),
    message: String.format(L('delete_message'), itemName),
    buttonNames: [L('cancel'), L('delete')],
    cancel: 0,
    destructive: 1 // iOS: red button
  })

  dialog.addEventListener('click', (e) => {
    if (e.index === 1) {
      performDelete()
    }
  })

  dialog.show()
}

// OptionDialog (Action Sheet)
function showSortOptions() {
  const options = [L('sort_name'), L('sort_date'), L('sort_price')]

  const dialog = Ti.UI.createOptionDialog({
    title: L('sort_by'),
    options: [...options, L('cancel')],
    cancel: options.length
  })

  dialog.addEventListener('click', (e) => {
    if (e.index < options.length) {
      applySortOption(e.index)
    }
  })

  dialog.show()
}

// Modal Window
function openModal(route, params) {
  const controller = Alloy.createController(route, params)
  const window = controller.getView()

  // iOS modal presentation
  if (OS_IOS) {
    window.applyProperties({
      modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_PAGESHEET,
      modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_COVER_VERTICAL
    })
  }

  window.addEventListener('close', () => {
    if (controller.cleanup) controller.cleanup()
  })

  window.open({ modal: true })

  return controller
}
```

## TabGroup Pattern

```xml
<!-- views/main.xml -->
<Alloy>
  <TabGroup id="tabGroup" class="bg-white">
    <Tab title="L('home')" icon="/images/tab_home.png">
      <Require src="home/index" />
    </Tab>
    <Tab title="L('search')" icon="/images/tab_search.png">
      <Require src="search/index" />
    </Tab>
    <Tab title="L('profile')" icon="/images/tab_profile.png">
      <Require src="profile/index" />
    </Tab>
  </TabGroup>
</Alloy>
```

```javascript
// controllers/main.js
// Tab styling is handled in XML with PurgeTSS classes:
// <TabGroup id="tabGroup" class="tabs-bg-white active-tint-blue-500" />

// Handle tab changes
$.tabGroup.addEventListener('focus', (e) => {
  // Track screen view
  Analytics.trackScreen(e.tab.title)
})

// Programmatic tab switching
function switchToTab(index) {
  $.tabGroup.activeTab = $.tabGroup.tabs[index]
}

// Badge on tab (notifications)
function updateNotificationBadge(count) {
  $.tabGroup.tabs[2].badge = count > 0 ? String(count) : null
}
```

## NavigationWindow Pattern (iOS)

```xml
<!-- views/index.xml -->
<Alloy>
  <NavigationWindow id="navWin" platform="ios">
    <Require src="home/index" />
  </NavigationWindow>

  <!-- Android uses Window directly -->
  <Window platform="android">
    <Require src="home/index" />
  </Window>
</Alloy>
```

```javascript
// Cross-platform navigation helper
function openWindow(controller, animated = true) {
  const window = controller.getView()

  if (OS_IOS) {
    $.navWin.openWindow(window, { animated })
  } else {
    window.open({ animated })
  }
}

function closeWindow(window, animated = true) {
  if (OS_IOS) {
    $.navWin.closeWindow(window, { animated })
  } else {
    window.close({ animated })
  }
}
```

## SearchBar with ListView

```xml
<!-- views/contacts/list.xml -->
<Alloy>
  <Window class="bg-gray-50">
    <SearchBar id="searchBar"
      class="w-screen"
      hintText="L('search_contacts')"
      showCancel="true"
    />

    <ListView id="listView" class="wh-screen" top="50">
      <Templates>
        <ItemTemplate name="contact" height="64">
          <View class="horizontal h-16 w-screen bg-white">
            <Label bindId="avatar" class="fa-solid fa-user-circle ml-4 text-3xl text-gray-400" />
            <View class="vertical ml-3">
              <Label bindId="name" class="text-base font-semibold" />
              <Label bindId="phone" class="text-sm text-gray-500" />
            </View>
          </View>
        </ItemTemplate>
      </Templates>

      <ListSection id="section" />
    </ListView>
  </Window>
</Alloy>
```

```javascript
// controllers/contacts/list.js
let allContacts = []
let searchTimeout = null

function init() {
  loadContacts()

  $.searchBar.addEventListener('change', onSearchChange)
  $.searchBar.addEventListener('cancel', onSearchCancel)
}

function onSearchChange(e) {
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filterContacts(e.value)
  }, 300)
}

function onSearchCancel() {
  filterContacts('')
}

function filterContacts(query) {
  const q = query.toLowerCase().trim()

  const filtered = q
    ? allContacts.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q)
      )
    : allContacts

  renderContacts(filtered)
}

function renderContacts(contacts) {
  $.section.items = contacts.map(c => ({
    template: 'contact',
    properties: { itemId: c.id },
    name: { text: c.name },
    phone: { text: c.phone }
  }))
}

function cleanup() {
  clearTimeout(searchTimeout)
  $.searchBar.removeEventListener('change', onSearchChange)
  $.searchBar.removeEventListener('cancel', onSearchCancel)
  $.destroy()
}

$.cleanup = cleanup
```

## Pull-to-Refresh Pattern

```xml
<ListView id="listView" class="wh-screen">
  <RefreshControl id="refreshControl" onRefresh="onRefresh" />
  <ListSection id="section" />
</ListView>
```

```javascript
let isRefreshing = false

async function onRefresh() {
  if (isRefreshing) return
  isRefreshing = true

  try {
    const data = await api.fetchLatest()
    renderItems(data)
  } catch (error) {
    showError(error.message)
  } finally {
    $.refreshControl.endRefreshing()
    isRefreshing = false
  }
}
```
