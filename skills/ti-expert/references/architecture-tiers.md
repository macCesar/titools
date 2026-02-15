# Titanium Architectural Maturity Tiers

To ensure scalability and maintainability, Titanium projects should follow one of these three tiers based on their complexity.

---

# Tier 1 — Basic (Rapid Prototyping)

**Best for:** Utilities, internal tools, proof of concept, learning Alloy.

### Characteristics

* Logic directly in `index.js`
* Direct `$` access everywhere
* No separation of concerns
* No cleanup strategy

### When to upgrade?

* Controller > 100–150 lines
* Logic duplicated in multiple controllers
* UI starts feeling coupled

---

## Example (Tier 1)

### Controller (`controllers/index.js`)

```javascript
function onButtonClick() {
  $.label.text = "Clicked!"
  Ti.API.info("Button was clicked")
}

$.index.open()
```

Simple. Fast. Dangerous beyond small apps.

---

# Tier 2 — Intermediate (Modular Alloy)

**Best for:** Standard commercial applications.

### Characteristics

* Business logic extracted to `app/lib/`
* Slim controllers
* Flat organization (`lib/services`, `lib/api`)
* Mandatory `cleanup`
* Reusable UI components

### Why this tier exists

This tier separates UI from logic, but still allows services to reference global dependencies.

It’s modular — but not yet decoupled.

---

## Example (Tier 2)

### View (`views/userCard.xml`)

```xml
<Alloy>
  <View id="cardContainer">
    <View id="headerRow">
      <ImageView id="userIcon" image="/images/user.png" />
      <Label id="name" />
    </View>

    <Button id="viewProfileBtn"
      title="View Profile"
      onClick="onViewProfile" />
  </View>
</Alloy>
```

---

### Controller (`controllers/userCard.js`)

```javascript
const { Navigation } = require('services/navigation')

function init() {
  const user = $.args.user
  $.name.text = user.name
}

function onViewProfile() {
  Navigation.open('userProfile', { userId: $.args.user.id })
}

function cleanup() {
  $.destroy()
}

$.cleanup = cleanup
```

---

### Service (`lib/services/navigation.js`)

```javascript
exports.Navigation = {
  open(route, params = {}) {
    const controller = Alloy.createController(route, params)
    const view = controller.getView()

    view.addEventListener('close', () => {
      if (controller.cleanup) controller.cleanup()
    })

    view.open()
    return controller
  }
}
```

---

### What improves from Tier 1?

* Controllers stay under control
* Logic is reusable
* Memory is explicitly cleaned
* Code is easier to test

But services can still depend directly on other services or globals.

---

# Tier 3 — Advanced / Enterprise (Service-Oriented)

**Best for:** Complex applications (IDEs, platforms, multi-state apps).

This is where architectural maturity changes fundamentally.

---

## Core Concepts

### 1️⃣ Dependency Injection

Services receive what they need — they don’t fetch it.

### 2️⃣ Service Registry

Centralized dependency wiring.

### 3️⃣ ID Scoping

Services receive only the UI elements they own.

### 4️⃣ Encapsulation (Black Box Principle)

Once a service method works, treat it as trusted.

### 5️⃣ Observability

All logs are structured and include service context.

---

## Example (Tier 3)

---

### Service (`lib/services/chatService.js`)

```javascript
/**
 * @param {Object} deps
 * @param {Object} deps.ui - Scoped UI elements
 * @param {Object} deps.logger
 * @param {Object} deps.designService
 */
module.exports = function createChatService(deps) {
  const { ui, logger, designService } = deps

  function sendMessage(text) {
    if (!text) return

    ui.sendBtn.enabled = false        // ID Scoping
    designService.trackMessage(text)  // Inter-service communication

    logger.event('message:sent', {
      service: 'ChatService',
      length: text.length
    })
  }

  return {
    sendMessage
  }
}
```

---

### Registry (`lib/services/indexServiceRegistry.js`)

```javascript
const createChatService = require('services/chatService')
const createDesignService = require('services/designService')

module.exports = function createIndexServiceRegistry(deps) {
  const { $, Ti, logger } = deps

  // 1. Independent services
  const designService = createDesignService({ Ti, logger })

  // 2. Dependent services with scoped UI
  const chatService = createChatService({
    ui: {
      sendBtn: $.sendBtn,
      messageInput: $.messageInput
    },
    logger,
    designService
  })

  return {
    chatService,
    designService
  }
}
```

---

## Decision Matrix

| Signal                              | Move To |
| ----------------------------------- | ------- |
| Controller > 100 lines              | Tier 2  |
| Controller > 300 lines              | Tier 3  |
| More than 50 IDs in XML             | Tier 3  |
| Services need to talk to each other | Tier 3  |
| Multiple application states         | Tier 3  |
| Memory leaks appear                 | Tier 3  |

---
