> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at reviewed local commit `5f9bf05ce683794449a49972a963460e6760b07a` (2026-10-23); this synchronization does not publish that commit or a release. Upstream `documentation/recommendations.md` SHA-256: `62ea42f2d53eb8661c081a8ed19100db5590227f41fb8b110ee9450447e38289`.

# Recommendations

The defaults work for ordinary tones and chords. The choices below matter when an app has dense overlap, user-controlled values, demanding speakers or several audio systems sharing one lifecycle.

## Group simultaneous notes

Use `playChord()` when pitches form one known simultaneous event. The chord is atomic. Protected profiles normalize per-voice source gain by the square root of the event voice count; `raw` bypasses that normalization. Separate `playTone()` calls are appropriate for independent touches and effects, but their start times and gain are independent too.

For keys or pads a user can trigger freely, keep each event around 0.4 to 0.7 until you have listened to the worst overlap. If every event needs gain above 1, consider `balanced` for the session before raising individual notes further.

## Choose the mixing profile once

| Situation                                            | Profile        |
| ---------------------------------------------------- | -------------- |
| General app audio and chords                         | `conservative` |
| Mostly single notes that need more level             | `balanced`     |
| Low pitches or distortion from a small phone speaker | `speakerSafe`  |
| The app performs its own strict gain staging         | `raw`          |

The profile is fixed for the stream. Changing it requires `shutdown()` and a new `start()` call, so it should not be a live sound-design control.

If a phone buzzes under `speakerSafe`, lower the event volume or raise the pitch. Small drivers can distort acoustically even when the digital output is well below its ceiling.

## Size `maxVoices` for real overlap

`maxVoices` controls capacity. It does not make the engine louder or quieter.

| App behavior                       | Starting value |
| ---------------------------------- | -------------: |
| Occasional interface feedback      |         4 to 8 |
| Game effects with overlap          |        8 to 16 |
| Chords, keys or long release tails |       16 to 24 |
| Explicit stress testing            |             32 |

Count release tails along with buttons pressed at the same instant. Timed-only events steal the slot with the least time remaining; sustained/transport voices prefer a releasing slot, then the oldest attack. The short fade avoids a hard click; the stolen note still ends early.

## Keep one lifecycle owner

Require the module in one audio service or controller, start it after the first layout settles, and shut it down from the same owner. This avoids an engine that outlives its window or a timer that starts after cleanup.

A 250 ms debounce after `postlayout` is a practical baseline for a plain screen. Heavy startup work, advertisements or entry animations may need more. Measure the real app instead of increasing the delay indefinitely.

Route recovery is automatic. Do not call `shutdown()` just because headphones were inserted or removed. The sound crossing the transition may end early; play later sounds normally once the system has moved to the new route.

## Coexisting with other audio

On iOS, the audio session is app-wide and the last component to configure it wins. By default TiSynthEngine selects `Playback`, which ignores the ring/silent switch and normally interrupts other apps. That behavior fits an instrument or an app whose sound must be heard.

A game that should respect the silent switch and let other apps' music keep playing starts the engine with the ambient session:

```javascript
synth.start({ audioSession: 'ambient' })
```

The engine applies the category at startup and again when it resumes after a route change. Other native audio modules may still configure the app-wide session later. Test the final startup sequence, interruptions, background behavior and route changes on iOS. Android accepts the option and ignores it.

Android mixes independent output streams at the system level, but another app or stale test process can still consume low-latency resources. Force-stop old test builds when diagnosing a glitch that does not reproduce after reboot.

## Keep resonance, FM and detune in check

The resonant filter, FM and stacked detuned voices change level and spectrum more than the basic controls do.

- A `lowpass` or `highpass` boosts the cutoff region by about `filterQ`, so Q 10 is roughly 20 dB. Raise Q in small steps and lower the event `volume` as you go. `bandpass` keeps unity gain at its center when level must stay put.
- A swept cutoff passes over every harmonic, so the level moves during the sweep. Judge a wah or laser at its loudest moment, which may occur after the start.
- A resonance that keeps reaching the limiter makes the whole mix pump. Lower the volume or the Q before reaching for a different profile.
- FM is not band-limited. A high carrier with a large `fmDepth` and `fmRatio` aliases. Keep carriers of bell-like sounds around 500 Hz, or lower the index.
- A detuned stack is one voice per copy. Count them when choosing `maxVoices`. Protected profiles divide per-voice source gain by the square root of the event voice count; `raw` does not. Correlated or phase-aligned voices can still reinforce each other, so this is not a guarantee of constant loudness or peaks.
- `sequenceend` reports completion or stopping by sequence identifier. Put contiguous notes into one sequence when sample timing matters; the event crosses JavaScript delivery latency.

## Validate values at the app boundary

The native API rejects invalid values instead of clamping them. Use `getDefaults().limits` for a user-facing slider, remote configuration or saved sound preset.

```javascript
function acceptedFrequency (raw) {
  var value = Number(raw)
  var range = synth.getDefaults().limits.frequency
  if (!isFinite(value)) return null
  if (value < range.min || value > range.max) return null
  return value
}
```

Do not copy the frequency maximum into application code. It depends on the active sample rate and should be read again after startup.

The same rule applies to `noiseRate`, `lowPassHz` and `filterHz`. Validate a custom `waveTable` as 2 to 64 finite values from -1 to 1, and remember that `bitDepth` accepts zero or an integer from 2 to 16. For `detune`, check the resulting pitch too: a shifted pitch that leaves the frequency range is rejected even when the cents value is in range.

Check Boolean return values during development. A rejected call includes the method, key and reason in the native log. Logging that result at the caller is often enough to identify a stale preset or misspelled field.

## Test the intended sound

Listen on the output people will use. Headphones reveal noise and stereo detail; the phone speaker reveals acoustic buzz, weak bass and mono collapse. Test at low, normal and high system volume.

Use one sustained chord when judging polyphonic timbre. A loop that starts the same chord before its predecessor finishes deliberately changes the number of overlapping events. That can drive the limiter in a repeating cycle and sound like pumping. Use the loop to stress scheduling and recovery, and the single sustained chord as the tonal reference.

Exercise the real worst case:

- every pad the UI allows at once;
- the fastest pattern the app can request;
- a long release followed by unrelated feedback;
- a route change while a note is playing;
- screen off, interruption and background transitions if the product depends on them.

An underrun counter only describes transport. A clean counter cannot tell you whether a waveform, pitch or mix is pleasant.

## Binaural placement

Use the [integration guide](guide.md#integrate-binaural-in-a-2d-app) to convert each effect source into signed spatial coordinates. Keep switch and amplitude percentages in the app, enable the controls only when both spatial limits are present, and test with headphones. Count concurrently spatial voices and replacement tails when measuring CPU.

## Known limits

- Use `noteOn` with app-supplied IDs for individual release and compatible live updates. Detect the methods in beta binaries; timed events do not return voice handles.
- Timed tones, chords and pattern steps last at most 60 seconds. Sustained `noteOn` voices last until release, replacement or shutdown.
- The module synthesizes waveforms and does not play audio files.
- One native transport supports up to four independent sequences, preallocated by `maxSequences`. All share at most 32 voices.
- A single tone or chord has no completion event. Sequences emit `sequenceend` with their identifier and completed/stopped reason.
- Voice capacity and mixing profile remain fixed until shutdown.
- Sequences run on the sample clock in beats or milliseconds. `duration` controls intervals; `length` independently controls note duration.
- `lowPassHz` is a plain one-pole filter. The resonant filter has fixed 12 dB per octave and one exponential sweep; there is no filter envelope.
- FM has one modulator and works only on `SINE`.
- Binaural positions occupy a front plane. Spatial held voices support smooth live movement; there is no rear positioning, distance attenuation or head tracking. Output is two channels, without a multichannel 2.1/5.1 routing API.
- One chorus/delay/reverb/saturation chain processes selected categories; per-voice sends override selection. It does not provide arbitrary routing or one processor per category.
- The module provides generic synthesis primitives and does not emulate hardware cycle by cycle.

Use a sample player or a dedicated music engine when a product needs streaming, sample loop points, audio-file decoding or multiple independent composition tracks. Use the native sequence transport for the supported musical grid.

## Use effects and held voices deliberately

Use `noteOn` for a sound whose duration follows interaction, such as a key, motor or beam; release its ID on touch end, cancellation, pause or scene teardown. Use `playSequence` for a finite musical cue or repeating grid. Neither needs JavaScript to keep an already accepted note alive. Both share the same 32-slot maximum with collision and interface tones; held notes can be stolen, and an accepted `updateVoice` on a stolen ID is a no-op. Optional priority 0-3 affects stealing; it reserves no voices. There is no voice-finished event.

Keep chorus/delay/reverb mixes modest when dialogue or short game feedback must remain distinct. They process the whole mix, so enabling reverb for a victory chord also affects simultaneous shots and collisions. Use an isolated presentation context, or close effect input before returning to gameplay. Disabling effects lets tails drain for at most 30 seconds; use panic when immediate history invalidation is required. Start with saturation disabled and compare creative drive at matched levels. Do not use saturation as an automatic substitute for the final limiter.

Fixed input/event gain does not decrease when unrelated voices start. If level dips, inspect `maxLimiterReductionDb` and `preLimiterPeakDb`, then consider same-pitch phase cancellation or the device's speaker protection. Eight coherent independent voices can still exceed the limiter threshold; module capacity is not a clean-mix loudness guarantee. See [measurement example](advanced-examples.md#measure-peaks-and-limiter-reduction).

Measure the complete workload on each target device, including held voices, binaural, LFOs, all enabled effects and tails. The [historical statistics benchmark](stats-performance.md) predates these features; the [current technical report](studio-validation.json) includes an unmet full-chain host deadline criterion. Neither is a guarantee of game-frame rate, physical audio deadlines, heat or battery life.
