# Accessibility (a11y) Deep Dive

## Table of Contents

- [Accessibility (a11y) Deep Dive](#accessibility-a11y-deep-dive)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Core Accessibility Properties](#2-core-accessibility-properties)
    - [Basic Usage](#basic-usage)
    - [Android TalkBack](#android-talkback)
    - [Star Rating Example](#star-rating-example)
    - [Toggle Button Example](#toggle-button-example)
  - [6. System-Level Accessibility Events](#6-system-level-accessibility-events)
    - [Monitor Accessibility Changes](#monitor-accessibility-changes)
    - [Code Patterns](#code-patterns)
    - [Accessibility First Development](#accessibility-first-development)
  - [9. External Resources](#9-external-resources)
  - [10. Common Issues](#10-common-issues)
    - [Issue: VoiceOver Can't Access Children](#issue-voiceover-cant-access-children)
    - [Issue: TalkBack Doesn't Speak Text](#issue-talkback-doesnt-speak-text)
    - [Issue: Complex Custom Controls Not Accessible](#issue-complex-custom-controls-not-accessible)
    - [Issue: State Changes Not Announced](#issue-state-changes-not-announced)

---

## 1. Overview

Accessibility ensures your app is usable by everyone, including users with visual, hearing, and motor disabilities. Titanium supports both Android TalkBack and iOS VoiceOver spoken feedback systems.

## 2. Core Accessibility Properties

All Titanium view elements support these accessibility properties:

| Property              | Default Value                 | Description                                                                     |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `accessibilityHidden` | `false`                       | If `true`, the view is ignored by the accessibility service                     |
| `accessibilityLabel`  | Title or label of the control | Succinct label identifying the view                                             |
| `accessibilityHint`   | -                             | Briefly describes what performing an action will do (e.g., "Closes the window") |
| `accessibilityValue`  | State or value of the control | String describing current state (e.g., "Selected", "50 percent")                |

### Basic Usage

```javascript
const button = Ti.UI.createButton({
  title: 'Save',
  accessibilityLabel: 'Save changes',
  accessibilityHint: 'Saves your modifications to the server'
});

const slider = Ti.UI.createSlider({
  min: 0,
  max: 100,
  value: 50,
  accessibilityLabel: 'Volume control',
  accessibilityValue: '50 percent'
});

// Update accessibilityValue as slider changes
slider.addEventListener('change', (e) => {
  slider.accessibilityValue = `${e.value.toFixed(0)} percent`;
});
```
...
### Android TalkBack
...
```javascript
// GOOD - Button uses default text
const button = Ti.UI.createButton({
  title: 'Submit Form'
  // accessibilityLabel NOT needed - title is spoken
});

// CUSTOM - Override default
const button = Ti.UI.createButton({
  title: 'Submit',
  accessibilityLabel: 'Submit the registration form'
});
```
...
```javascript
// BAD - Container with accessibility properties
const container = Ti.UI.createView({
  accessibilityLabel: 'Form container',  // DON'T DO THIS
  accessibilityHint: 'Contains input fields'
});
container.add(nameField);
container.add(emailField);
container.add(submitButton);

// GOOD - No accessibility on container, children accessible
const container = Ti.UI.createView({
  // No accessibility properties
});
container.add(nameField);
container.add(emailField);
container.add(submitButton);
```
...
### Star Rating Example

```javascript
const starView = Ti.UI.createView({
  width: 200,
  height: 40,
  accessibilityLabel: 'Rating',
  accessibilityValue: '4 out of 5 stars',
  accessibilityHint: 'User rating for this product'
});

// Visual representation (images or drawn stars)
for (let i = 0; i < 5; i++) {
  const star = Ti.UI.createImageView({
    image: i < 4 ? 'star-filled.png' : 'star-empty.png',
    left: i * 35,
    accessibilityHidden: true  // Hide individual stars
  });
  starView.add(star);
}
```

### Toggle Button Example

```javascript
let isMuted = false;
const muteButton = Ti.UI.createButton({
  title: 'Mute',
  accessibilityLabel: 'Mute audio',
  accessibilityValue: 'Off'  // Current state
});

muteButton.addEventListener('click', () => {
  isMuted = !isMuted;
  muteButton.title = isMuted ? 'Unmute' : 'Mute';
  muteButton.accessibilityValue = isMuted ? 'On' : 'Off';
});
```

## 6. System-Level Accessibility Events

### Monitor Accessibility Changes

```javascript
Ti.App.addEventListener('accessibilitychanged', (e) => {
  Ti.API.info(`Accessibility mode changed: ${e.enabled}`);
  // Adjust UI behavior as needed
  if (e.enabled) {
    // Increase touch targets, simplify animations, etc.
  }
});
```
...
### Code Patterns

**DO**:
```javascript
// Provide meaningful labels
const iconButton = Ti.UI.createButton({
  image: 'settings.png',
  accessibilityLabel: 'Open settings'
});

// Update state changes
checkbox.accessibilityValue = isChecked ? 'Checked' : 'Unchecked';

// Hide decorative elements
decorativeIcon.accessibilityHidden = true;
```

**DON'T**:
```javascript
// Don't set accessibilityLabel for text controls (Android)
const label = Ti.UI.createLabel({
  text: 'Hello',
  accessibilityLabel: 'Hello'  // REDUNDANT on Android
});

// Don't set accessibility on containers (iOS)
const container = Ti.UI.createView({
  accessibilityLabel: 'Container'  // BLOCKS children on iOS
});
```

### Accessibility First Development

When designing complex UIs, consider accessibility from the start:

```javascript
function createAccessibleListItem(title, subtitle, action) {
  const item = Ti.UI.createView({
    height: 60,
    accessibilityLabel: title,
    accessibilityHint: `${subtitle}. Double tap to ${action}`
  });

  const titleLabel = Ti.UI.createLabel({
    text: title,
    accessibilityHidden: true  // Already announced by container
  });

  const subtitleLabel = Ti.UI.createLabel({
    text: subtitle,
    accessibilityHidden: true  // Already announced by container
  });

  item.add(titleLabel);
  item.add(subtitleLabel);
  return item;
}
```

## 9. External Resources

- [Accessibility Programming Guide for iOS](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/iPhoneAccessibility/Introduction/Introduction.html)
- [Android Accessibility API Guide](http://developer.android.com/guide/topics/ui/accessibility/index.html)
- [Android Accessibility Design Guide](http://developer.android.com/design/patterns/accessibility.html)
- [W3C Web Content Accessibility Guidelines](http://www.w3.org/WAI/WCAG20/quickref/)

## 10. Common Issues

### Issue: VoiceOver Can't Access Children

**Cause**: Container view has accessibility properties set

**Solution**: Remove all accessibility properties from container views

### Issue: TalkBack Doesn't Speak Text

**Cause**: `accessibilityLabel` set on Label/Button overrides visible text

**Solution**: Don't set `accessibilityLabel` on textual controls unless intentionally overriding

### Issue: Complex Custom Controls Not Accessible

**Cause**: No accessibility properties set on custom-drawn views

**Solution**: Always provide `accessibilityLabel`, `accessibilityValue`, and `accessibilityHint` for custom controls

### Issue: State Changes Not Announced

**Cause**: `accessibilityValue` not updated when state changes

**Solution**: Always update `accessibilityValue` in change event handlers
