# Alloy Controller Patterns

## Titanium Layout Rules

- Use `layout: 'horizontal'` for left-to-right
- Use `layout: 'vertical'` for top-to-bottom
- Omit `layout` for composite (absolute positioning — the default)
- Use margins on children instead of padding on parent

> For a complete View + TSS + Controller example, see the Quick Start in SKILL.md.

## Animation Usage

Use `Ti.UI.createAnimation()` for UI transitions.

```javascript
// controllers/user/card.js
function show() {
  $.container.opacity = 0
  $.container.animate(Ti.UI.createAnimation({
    opacity: 1,
    duration: 500,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  }))
}

function hide(callback) {
  $.container.animate(Ti.UI.createAnimation({
    opacity: 0,
    duration: 500,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  }), () => {
    $.container.visible = false
    if (callback) callback()
  })
}
```

## Dynamic Styling

To change styles dynamically, use `applyProperties()` to batch updates.

```javascript
function setStatus(isActive) {
  $.statusLabel.applyProperties({
    color: isActive ? '#22c55e' : '#ef4444',
    text: isActive ? L('active') : L('inactive')
  })
}
```

## Percentage-Based Layouts

Use percentage widths in TSS for responsive column layouts.

```xml
<View id="row">
  <View id="colLeft" />
  <View id="colRight" />
</View>
```

```tss
"#row": { layout: 'horizontal', width: Ti.UI.FILL }
"#colLeft": { height: 80, width: '66.66%', backgroundColor: '#fee2e2' }
"#colRight": { height: 80, width: '33.33%', backgroundColor: '#dbeafe' }
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
  <Window id="editWindow">
    <ScrollView id="scrollView">
      <View id="formContainer">
        <Label id="nameLabel" text="L('name_label')" />
        <TextField id="nameField"
          hintText="L('name_hint')"
          returnKeyType="Ti.UI.RETURNKEY_NEXT"
          onReturn="focusNextField"
        />

        <Label id="emailLabel" text="L('email_label')" />
        <TextField id="emailField"
          hintText="L('email_hint')"
          keyboardType="Ti.UI.KEYBOARD_TYPE_EMAIL"
          returnKeyType="Ti.UI.RETURNKEY_DONE"
          onReturn="submitForm"
        />

        <Label id="errorLabel" />

        <Button id="submitBtn"
          title="L('save')"
          onClick="submitForm"
        />
      </View>
    </ScrollView>
  </Window>
</Alloy>
```

```tss
/* styles/user/edit.tss */
"#editWindow": { layout: 'vertical', backgroundColor: '#fff' }
"#scrollView": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.FILL }
"#formContainer": { layout: 'vertical', top: 16, height: Ti.UI.SIZE, width: Ti.UI.FILL }
"Label": { left: 16, font: { fontSize: 14 }, color: '#6b7280' }
"TextField": { left: 16, right: 16, top: 4, height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#f9fafb', paddingLeft: 12 }
"#emailLabel": { top: 16 }
"#errorLabel": { top: 8, color: '#ef4444', visible: false }
"#submitBtn": { left: 16, right: 16, top: 24, height: 56, borderRadius: 12, backgroundColor: '#2563eb', color: '#fff', font: { fontWeight: 'bold' } }
```

```javascript
// controllers/user/edit.js
const { validateEmail, validateRequired } = require('helpers/validator')
const { userService } = require('services/userService')

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
<View id="loadingState">
  <View id="skeleton1" />
  <View id="skeleton2" />
  <View id="skeleton3" />
</View>

<View id="contentState">
  <!-- Actual content here -->
</View>

<View id="errorState">
  <ImageView id="errorIcon" image="/images/error.png" />
  <Label id="errorMsg" text="L('error_loading')" />
  <Button id="retryBtn" title="L('retry')" onClick="loadData" />
</View>
```

```tss
"#loadingState": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.FILL }
"#skeleton1": { left: 16, right: 16, top: 16, height: 80, borderRadius: 8, backgroundColor: '#e5e7eb' }
"#skeleton2": { left: 16, top: 16, height: 16, width: '66%', borderRadius: 4, backgroundColor: '#e5e7eb' }
"#skeleton3": { left: 16, top: 8, height: 16, width: '50%', borderRadius: 4, backgroundColor: '#e5e7eb' }
"#contentState": { width: Ti.UI.FILL, height: Ti.UI.FILL, visible: false }
"#errorState": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.FILL, visible: false }
"#errorIcon": { top: 80, width: 64, height: 64 }
"#errorMsg": { top: 16, font: { fontSize: 18 }, color: '#6b7280' }
"#retryBtn": { top: 16, height: 40, borderRadius: 8, backgroundColor: '#2563eb', color: '#fff', left: 24, right: 24 }
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
  <TabGroup id="tabGroup">
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
// Tab styling is handled in the TSS file:
// "#tabGroup": { backgroundColor: '#fff', activeTintColor: '#3b82f6' }

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
  <Window id="contactsWindow">
    <SearchBar id="searchBar"
      hintText="L('search_contacts')"
      showCancel="true"
    />

    <ListView id="listView" top="50">
      <Templates>
        <ItemTemplate name="contact" height="64">
          <View id="contactRow">
            <ImageView bindId="avatar" id="contactAvatar" image="/images/user-circle.png" />
            <View id="contactInfo">
              <Label bindId="name" id="contactName" />
              <Label bindId="phone" id="contactPhone" />
            </View>
          </View>
        </ItemTemplate>
      </Templates>

      <ListSection id="section" />
    </ListView>
  </Window>
</Alloy>
```

```tss
/* styles/contacts/list.tss */
"#contactsWindow": { backgroundColor: '#f9fafb' }
"#searchBar": { width: Ti.UI.FILL }
"#listView": { width: Ti.UI.FILL, height: Ti.UI.FILL }
"#contactRow": { layout: 'horizontal', height: 64, width: Ti.UI.FILL, backgroundColor: '#fff' }
"#contactAvatar": { left: 16, width: 36, height: 36 }
"#contactInfo": { layout: 'vertical', left: 12 }
"#contactName": { font: { fontSize: 16, fontWeight: 'semibold' } }
"#contactPhone": { font: { fontSize: 14 }, color: '#6b7280' }
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
<ListView id="listView">
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
