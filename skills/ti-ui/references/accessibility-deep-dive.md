# Accessibility (a11y) Deep Dive

## 1. Overview

Accessibility ensures your app is usable by everyone, including users with visual, hearing, and motor disabilities. Titanium supports both Android TalkBack and iOS VoiceOver spoken feedback systems.

## 2. Core Accessibility Properties

All Titanium view elements support these accessibility properties:

| Property | Default Value | Description |
|----------|---------------|-------------|
| `accessibilityHidden` | `false` | If `true`, the view is ignored by the accessibility service |
| `accessibilityLabel` | Title or label of the control | Succinct label identifying the view |
| `accessibilityHint` | - | Briefly describes what performing an action will do (e.g., "Closes the window") |
| `accessibilityValue` | State or value of the control | String describing current state (e.g., "Selected", "50 percent") |

### Basic Usage

```javascript
var button = Ti.UI.createButton({
  title: 'Save',
  accessibilityLabel: 'Save changes',
  accessibilityHint: 'Saves your modifications to the server'
});

var slider = Ti.UI.createSlider({
  min: 0,
  max: 100,
  value: 50,
  accessibilityLabel: 'Volume control',
  accessibilityValue: '50 percent'
});

// Update accessibilityValue as slider changes
slider.addEventListener('change', function(e) {
  slider.accessibilityValue = e.value.toFixed(0) + ' percent';
});
```

## 3. Platform Differences

### Android TalkBack

**Concatenation order**: `accessibilityLabel` → `accessibilityValue` → `accessibilityHint`

Maps to `android:contentDescription` property.

**Important**: Do NOT set `accessibilityLabel` for textual items (Labels, Buttons) unless overriding default text. If set, the visible text will NOT be spoken.

```javascript
// GOOD - Button uses default text
var button = Ti.UI.createButton({
  title: 'Submit Form'
  // accessibilityLabel NOT needed - title is spoken
});

// CUSTOM - Override default
var button = Ti.UI.createButton({
  title: 'Submit',
  accessibilityLabel: 'Submit the registration form'
});
```

### iOS VoiceOver

**CRITICAL**: Do NOT set accessibility properties for container views (Views containing children). Doing so:
1. Blocks interaction with child views
2. Overrides children's accessibility properties

```javascript
// BAD - Container with accessibility properties
var container = Ti.UI.createView({
  accessibilityLabel: 'Form container',  // DON'T DO THIS
  accessibilityHint: 'Contains input fields'
});
container.add(nameField);
container.add(emailField);
container.add(submitButton);

// GOOD - No accessibility on container, children accessible
var container = Ti.UI.createView({
  // No accessibility properties
});
container.add(nameField);
container.add(emailField);
container.add(submitButton);
```

## 4. Spoken Feedback Comparison

### Element Responses Example

| Element | TalkBack Response | VoiceOver Response |
|---------|-------------------|-------------------|
| Button (no custom props) | "Open. Button." | "Open. Button." |
| Slider (no custom props) | "Seek control. 50 percent." | "50 percent. Adjustable. Slide up and down to adjust the value." |
| Label (no custom props) | "I pity the foo." | "I pity the foo." |
| Button with custom label | "Double-click me to close. Button." | "Double-click me to close. Button." |

## 5. Handling Non-Textual Information

For graphical information presentation (star ratings, progress indicators), you MUST provide accessibility alternatives:

### Star Rating Example

```javascript
var starView = Ti.UI.createView({
  width: 200,
  height: 40,
  accessibilityLabel: 'Rating',
  accessibilityValue: '4 out of 5 stars',
  accessibilityHint: 'User rating for this product'
});

// Visual representation (images or drawn stars)
for (var i = 0; i < 5; i++) {
  var star = Ti.UI.createImageView({
    image: i < 4 ? 'star-filled.png' : 'star-empty.png',
    left: i * 35,
    accessibilityHidden: true  // Hide individual stars
  });
  starView.add(star);
}
```

### Toggle Button Example

```javascript
var isMuted = false;
var muteButton = Ti.UI.createButton({
  title: 'Mute',
  accessibilityLabel: 'Mute audio',
  accessibilityValue: 'Off'  // Current state
});

muteButton.addEventListener('click', function() {
  isMuted = !isMuted;
  muteButton.title = isMuted ? 'Unmute' : 'Mute';
  muteButton.accessibilityValue = isMuted ? 'On' : 'Off';
});
```

## 6. System-Level Accessibility Events

### Monitor Accessibility Changes

```javascript
Ti.App.addEventListener('accessibilitychanged', function(e) {
  Ti.API.info('Accessibility mode changed: ' + e.enabled);
  // Adjust UI behavior as needed
  if (e.enabled) {
    // Increase touch targets, simplify animations, etc.
  }
});
```

### Voice Announcements (iOS)

```javascript
// Fire a system voice announcement
Ti.App.iOS.fireNotification({
  accessibilityAnnouncement: 'Download complete'
});

// Notify of screen change
Ti.App.iOS.fireNotification({
  accessibilityScreenChanged: true
});

// Notify of layout change
Ti.App.iOS.fireNotification({
  accessibilityLayoutChanged: true
});
```

## 7. Testing Accessibility

### Android Device (TalkBack)

**Enable TalkBack**:
1. Settings > Accessibility > TalkBack
2. Toggle ON
3. Confirm in dialog

**Usage**:
- Tap to select element
- Double-tap to activate
- Swipe left/right for previous/next
- Swipe right-then-left or left-then-right to scroll

**Disable TalkBack**:
- Same path, toggle OFF (requires confirmation)

**Note**: Android Emulator does NOT support TalkBack testing. Must use physical device.

### iOS Device (VoiceOver)

**Enable VoiceOver**:
1. Settings > General > Accessibility > VoiceOver
2. Toggle ON

**Usage**:
- Tap to select
- Double-tap or triple-tap to activate
- Swipe left/right for previous/next
- Three-finger swipe to scroll
- Double-tap locked screen to unlock

### iOS Simulator (Accessibility Inspector)

The simulator includes Accessibility Inspector for testing:

**Enable**:
1. Settings > General > Accessibility > Accessibility Inspector
2. Toggle ON

**Usage**:
- Rainbow colored bar appears
- Click view element to preview accessibility info
- Double/triple-tap to activate elements

**Note**: This is NOT a substitute for actual VoiceOver testing on device.

## 8. Best Practices

### Design Principles

1. **Logical Flow**: Ensure UI hierarchy follows logical reading order
2. **Large Targets**: Buttons/controls should be at least 44x44 points (iOS) or 48x48dp (Android)
3. **Contrast**: WCAG 2.0 AA requires 4.5:1 contrast ratio for normal text
4. **Color Independence**: Never convey information by color alone
5. **Touch Targets**: Minimum 7mm recommended for motor accessibility

### Code Patterns

**DO**:
```javascript
// Provide meaningful labels
var iconButton = Ti.UI.createButton({
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
var label = Ti.UI.createLabel({
  text: 'Hello',
  accessibilityLabel: 'Hello'  // REDUNDANT on Android
});

// Don't set accessibility on containers (iOS)
var container = Ti.UI.createView({
  accessibilityLabel: 'Container'  // BLOCKS children on iOS
});
```

### Accessibility First Development

When designing complex UIs, consider accessibility from the start:

```javascript
function createAccessibleListItem(title, subtitle, action) {
  var item = Ti.UI.createView({
    height: 60,
    accessibilityLabel: title,
    accessibilityHint: subtitle + '. Double tap to ' + action
  });

  var titleLabel = Ti.UI.createLabel({
    text: title,
    accessibilityHidden: true  // Already announced by container
  });

  var subtitleLabel = Ti.UI.createLabel({
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
