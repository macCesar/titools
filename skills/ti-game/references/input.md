# Keyboard, mouse and action maps

Reviewed 2026-10-23 against `m1ga/ti.game@88e181cb85526d8146d0be6e09b2b90c2551baad` native input resolvers and canvas adapters, with README clarification from `macCesar/ti.game@2bf5f828a3bb8028eed20d6ba27b97dd3aa9a753`. Requires an artifact containing those APIs; a shared version number is insufficient evidence. Existing controller events and analog input remain documented in [api.md](api.md#gamepads).

## Map and event contract

`GameView.inputMap` is optional, live, readable/writable and defaults to `{}`. It maps contexts to named actions, each with an array of digital bindings. `inputContext` accepts only a string or `null` (other types throw) and defaults to `'gameplay'`; `null` disables actions. Replace the whole map to rebind; the module supplies no settings UI or persistence.

```javascript
const gameView = Game.createGameView({
	inputMap: {
		gameplay: {
			thrust: [
				{ device: 'keyboard', code: 'KeyW' },
				{ device: 'keyboard', code: 'ArrowUp' }
			],
			fire: [
				{ device: 'keyboard', code: 'Space' },
				{ device: 'mouse', button: 'left' },
				{ device: 'gamepad', button: 'a' }
			],
			pause: [{ device: 'keyboard', code: 'Escape' }]
		},
		paused: { pause: [{ device: 'keyboard', code: 'Escape' }] }
	}
});
gameView.addEventListener('actiondown', ({ action, context }) => {
	// Dispatch discrete actions or write native motion properties here.
	// A pause handler can change inputContext to 'paused' and timeScale to 0.
});
gameView.addEventListener('actionup', ({ action, context }) => {
	// Clear held controls, including releases caused by lost focus/cancellation.
});
// Add the view, open the window, then call this (also after native text entry):
gameView.focusInput();
```

The snippet is a map/transition template; scene setup and window lifecycle are in [project-setup.md](project-setup.md). No per-frame JavaScript polling is needed: action resolution runs natively on input transitions.

| Input | Contract |
| --- | --- |
| `actiondown` / `actionup` | Payload `{ action, context }`. An action goes down on its first active binding and up after its last source releases, across different bindings and controllers |
| Map replacement | A valid map releases previous active actions and requires a fresh press; held keys cannot activate the replacement map until released and pressed again |
| Context change | Releases active actions from the old context, requires a fresh press; assigning the same context leaves state unchanged |
| Invalid map | Throws without replacing the map or active state |
| Cancellation | Focus loss, suspension, device disconnection and view shutdown release held actions. An action release need not have a physical/raw `keyup`; drive gameplay from action transitions |
| Auto-repeat | Ignored as a new press; holding a key does not repeat `actiondown` |

Context and action names must be nonempty strings. Empty contexts and empty action arrays are allowed. Each binding has **exactly two keys**: `device` plus `code` for keyboard, or `device` plus `button` for mouse/gamepad. Analog axes are not action bindings.

| Device | Accepted binding values |
| --- | --- |
| `keyboard` (`code`) | `KeyA`…`KeyZ`, `Digit0`…`Digit9`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Space`, `Escape`, `Enter`, `Tab`, `Backspace`, `Delete`, `Home`, `End`, `PageUp`, `PageDown`, `F1`…`F12`, `ShiftLeft`/`ShiftRight`, `ControlLeft`/`ControlRight`, `AltLeft`/`AltRight`, `MetaLeft`/`MetaRight` |
| `mouse` (`button`) | `left`, `middle`, `right` |
| `gamepad` (`button`) | `a`, `b`, `x`, `y`, `l1`, `r1`, `l2`, `r2`, `l3`, `r3`, `start`, `select`, `home`, `up`, `down`, `left`, `right` |

Existing gamepad properties, individual button events, sticks and triggers are unchanged. Use mapped actions **or** individual button handlers for each gameplay action to avoid dispatching twice. An app keeping its own gamepad adapter can omit gamepad bindings from the map.

## Keyboard focus and pointer ownership

Raw `keydown` / `keyup` events carry `{ code, character, modifiers: { shift, control, alt, meta } }`. `code` identifies the physical key independently of its text character; `character` can be empty for non-text keys.

Only the focused GameView receives keyboard events. `focusInput()` requests canvas focus on the UI thread; it neither opens a software keyboard nor captures keys globally. Native text fields retain their focus. Call it after opening the game window and after returning from a native text field.

When the active context has mouse bindings, pointer gestures delivered to the canvas feed mapped actions and are consumed rather than also becoming sprite tap/drag interactions. Empty maps, keyboard-only contexts and disabled actions preserve existing sprite pointer interaction. Overlay Titanium controls retain their clicks and focus; the module does not capture their mouse events. Android retains the engine touch listener.

For iOS/iPadOS 13.4–16 pointer identification, set the consuming application's `tiapp.xml` opt-in (iOS 17+ defaults it to true):

```xml
<ios>
  <plist>
    <dict>
      <key>UIApplicationSupportsIndirectInputEvents</key>
      <true/>
    </dict>
  </plist>
</ios>
```

This application-level setting distinguishes indirect pointers from direct touch; the module does not change global input settings at runtime. The current Apple package targets iOS/iPadOS **15+** and Mac Catalyst with Metal. Its keyboard/pointer guards dating from iOS 13.4 and disconnection notification guards dating from iOS 14 do not lower that package minimum.

## Runnable example and acceptance limits

`example/inputmap.js` is the current action-map demo. The launcher exposes it on Mac only; mobile builds retain touch-ready demos. The source remains usable for external-peripheral testing on mobile.

- A/D, J/L, arrows or gamepad move the character. The last pressed direction wins; releasing it resumes the other held direction.
- Space or gamepad A jumps. W/I/Up aims upward, including diagonal combinations; S/K/Down crouches.
- Left canvas click or gamepad X fires. Right/middle mouse bindings are accepted for testing but currently do not trigger actions on Mac; left click is verified by the source's acceptance notes.
- Escape switches pause/resume action contexts. A separate monitor shows raw key codes/modifiers and existing gamepad buttons, sticks and triggers.
- Instructions and action feedback occupy separate areas. An overlaid text field and focus button demonstrate native ownership; clicking the canvas after text entry restores game focus, and the first click does not fire. The shared back control returns to the launcher.

Upstream verification commands, run from the module checkout:

```sh
python3 tests/input-map/run.py
python3 tests/input-map/uikit.py
python3 tests/gamepad-fixture/check.py
node --test tests/example-input/controls.test.js
```

Resolver regressions test native binding validation, aggregation and transitions. UIKit fixtures exercise production responder methods with renderer/event sinks for focus, raw-key repetition/cancellation and pointer/overlay ownership. GameController fixtures cover receiver fanout, disconnect and action delivery without individual listeners. JavaScript example tests check demo control behavior. Compilation and these fixtures do not establish physical keyboard, mouse, controller or overlay behavior on every supported device; record that acceptance separately.
