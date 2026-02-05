# Accessibility (a11y) deep dive

## 1. Overview

Accessibility makes your app usable for people with visual, hearing, and motor disabilities. Titanium works with Android TalkBack and iOS VoiceOver for spoken feedback.

### Design considerations beyond screen readers

- Motor disabilities often require larger tap targets (minimum 44x44 points on iOS, 48x48 dp on Android). Support alternative input methods and avoid gestures that demand precision or fast timing.
- Color-blindness means color alone cannot carry meaning. Use text labels, icons, or patterns alongside color indicators. Test the UI in grayscale to check usability.
- Screen magnifiers are common for low-vision users (iOS Zoom, Android Magnification). Keep layouts functional when magnified and avoid absolute positioning that breaks at large zoom levels.

## 2. Core accessibility properties

All Titanium view elements support these accessibility properties.

| Property              | Default Value                 | Description                                                                     |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `accessibilityHidden` | `false`                       | If `true`, the view is ignored by the accessibility service                     |
| `accessibilityLabel`  | Title or label of the control | Succinct label identifying the view                                             |
| `accessibilityHint`   | -                             | Briefly describes what performing an action will do (e.g., "Closes the window") |
| `accessibilityValue`  | State or value of the control | String describing current state (e.g., "Selected", "50 percent")                |

> Android note: On Android, `accessibilityLabel`, `accessibilityValue`, and `accessibilityHint` are combined (in that order) and mapped to the native `contentDescription`. TalkBack reads them as one string. VoiceOver on iOS reads them as separate announcements.

### Basic usage

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
// On iOS, VoiceOver treats the entire container as ONE accessible element,
// completely blocking access to all children inside it (nameField, emailField, etc.)
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
### Star rating example

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

### Toggle button example

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

## 6. System-level accessibility events

### Monitor accessibility changes

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
### Code patterns

Do:
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

Don't:
```javascript
// Don't set accessibilityLabel for text controls (Android)
const label = Ti.UI.createLabel({
  text: 'Hello',
  accessibilityLabel: 'Hello'  // REDUNDANT on Android
});

// Don't set accessibility on containers (iOS)
// VoiceOver treats the container as a single element, making all children unreachable
const container = Ti.UI.createView({
  accessibilityLabel: 'Container'  // BLOCKS children on iOS
});
```

### Accessibility-first development

When designing complex UIs, plan accessibility at the start.

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

## 9. Platform behavior comparison

TalkBack (Android) and VoiceOver (iOS) interpret accessibility properties differently.

| Element                          | TalkBack Response                                 | VoiceOver Response                                      |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| Button with label "Submit"       | "Submit, button, double-tap to activate"          | "Submit, button"                                        |
| Slider with value 50%            | "50 percent, slider"                              | "50%, adjustable"                                       |
| Label with hint                  | Reads label + value + hint as one combined string | Reads label first, then hint as a separate announcement |
| Checkbox, checked                | "Checked, checkbox, double-tap to toggle"         | "Checked, tick box"                                     |
| Image with label "Profile photo" | "Profile photo"                                   | "Profile photo, image"                                  |

> On Android, the three accessibility properties are concatenated into `contentDescription`, so they are read as one utterance. On iOS, VoiceOver reads them as distinct pieces with short pauses between them.

## 10. Testing procedures

### Android emulator

The Android emulator has no built-in way to test accessibility. Use a physical device for accurate TalkBack behavior.

### Android device (TalkBack)

1. Open **Settings > Accessibility > TalkBack**
2. Toggle TalkBack **On**
3. A confirmation dialog appears; confirm to enable

TalkBack gestures:
- Tap: Select and hear the element described
- Double-tap: Activate the selected element
- Swipe left/right: Navigate to the previous/next element
- Swipe up/down: Change reading granularity (characters, words, headings)

To disable TalkBack, go to the same setting and toggle it off. You can also set a hardware shortcut (hold both volume keys for 3 seconds) for quick toggling during development.

### iOS simulator (Accessibility Inspector)

Use the Accessibility Inspector to examine elements without enabling VoiceOver.

1. In Xcode, go to **Xcode > Open Developer Tool > Accessibility Inspector**
2. Select the Simulator as the target device
3. Hover over or tap elements to inspect their accessibility label, value, hint, and traits

This is the fastest way to verify properties during development.

### iOS device (VoiceOver)

1. Open **Settings > Accessibility > VoiceOver**
2. Toggle VoiceOver **On**

VoiceOver gestures:
- Tap: Select and hear the element described
- Double-tap: Activate the selected element
- Swipe left/right: Navigate to the previous/next element
- Three-finger swipe: Scroll content
- Two-finger tap: Pause/resume speech

To disable VoiceOver, go to the same setting and toggle it off. You can also configure the Accessibility Shortcut (triple-click the side button) for quick toggling.

## 11. External resources

- [Accessibility Programming Guide for iOS](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/iPhoneAccessibility/Introduction/Introduction.html)
- [Android Accessibility API Guide](http://developer.android.com/guide/topics/ui/accessibility/index.html)
- [Android Accessibility Design Guide](http://developer.android.com/design/patterns/accessibility.html)
- [W3C Web Content Accessibility Guidelines](http://www.w3.org/WAI/WCAG20/quickref/)

## 12. Common issues

### Issue: VoiceOver cannot access children

Cause: A container view has accessibility properties set.

Solution: Remove all accessibility properties from container views.

### Issue: TalkBack does not speak text

Cause: `accessibilityLabel` on a Label/Button overrides visible text.

Solution: Do not set `accessibilityLabel` on textual controls unless you are intentionally overriding.

### Issue: Complex custom controls are not accessible

Cause: Custom-drawn views have no accessibility properties.

Solution: Provide `accessibilityLabel`, `accessibilityValue`, and `accessibilityHint` for custom controls.

### Issue: State changes are not announced

Cause: `accessibilityValue` is not updated when state changes.

Solution: Update `accessibilityValue` in change event handlers.
