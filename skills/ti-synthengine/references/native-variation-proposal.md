> Source snapshot: official TiSynthEngine documentation at commit `ec04f4e634075c41b55f66279eabcd78b9652d58` (2026-11-02). Published module 1.1.0; public API 1.1.0. Upstream `documentation/native-variation-proposal.md` SHA-256: `17b74434b0e03e5353b71c693d4ec722dede92fee8aed142003e67f60e158e27`.

<a id="native-per-attack-variation--proposal-and-implementation-plan"></a>

# Native per-attack variation: proposal and implementation plan

Historical proposal, written on November 1, 2026 before implementation. The design and unchecked plan below record that starting point, not outstanding implementation work. Current source and local 1.1.0 candidates implement the feature; use the [implemented contract](native-variation.md) and [technical verification](native-variation-validation.md) for current behavior and acceptance. Writing the original proposal did not change native sources, binaries or packages.

Implementation update (November 1, 2026): current source and local 1.1.0 candidates implement the contract on both platforms. See [the implemented contract](native-variation.md) and [verification](native-variation-validation.md). The proposal and historical feasibility findings below describe the starting point; they are not release announcements.

## Purpose and ownership

Generate subtly different versions of the **same** sound: an anvil struck at different places, not a different object on each hit. The Engine owns random selection once per new native voice. Apps supply an authored recipe, permitted ranges and amount. Studio exposes the controls and saves those choices; Frontier and Guardian use the same public property.

The existing oscillator, anti-aliasing, ADSR, fixed event gain, chord compensation, routing, output protection and Oboe/Apple audio backends remain intact. This is an optional addition at voice creation, not a redesign of mixing or dynamics. A recipe without variation must preserve its existing output exactly. Do not revive the rejected Studio touch adapters, gesture delays, normalization or output-protector experiments.

Studio's independent catalog expansion imports Playground, Frontier and Guardian sound examples. That work can ship independently. It does not implement random selection or require this future feature. The accepted pure-sine preset formerly named Cristal is now Seno puro (`clean`); preserve its approved sound.

## Proposed public contract

Use one optional dictionary named `variation` on `playTone`, `playChord`, `noteOn`, sequence `voice`, and step `overrides`. Unknown fields remain rejected by the closed contracts.

```javascript
synth.playTone({
  frequency: 620,
  waveType: WAVE.SINE,
  duration: 180,
  attack: 1, decay: 65, sustain: 0.12, release: 110,
  fmRatio: 2.7, fmDepth: 3.2, fmDepthEnd: 0.4,
  volume: 0.30,
  variation: {
    amount: 0.5,
    // seed: 20261101, // Optional: deterministic comparison/testing.
    ranges: {
      volume: [0.291, 0.30],
      fmDepth: [2.944, 3.456],
      pitchCents: [-12, 12]
    }
  }
});
```

- Omitted `variation`: current behavior, no extra RNG calls or changed noise state.
- `amount`: finite number 0 to 1, default 1 when variation is supplied. Zero bypasses sampling and leaves authored values unchanged. The dictionary is still validated.
- `ranges`: dictionary of permitted field ranges. Empty ranges have no audible effect. Each value is exactly two finite numbers `[minimum, maximum]` with minimum ≤ maximum. Equal endpoints deliberately fix a value when amount is 1.
- `seed`: optional integer 0 to 4294967295. Zero is a valid deterministic seed, not the sentinel for automatic seeding. Omission uses the Engine's independent variation stream.
- Non-pitch ranges are **absolute native parameter values**, not multipliers. Interpolate from the authored value toward the sampled value: `authored + amount * (sampled - authored)`.
- `pitchCents` is a relative offset, initially zero. Multiply the already tuned/detuned frequency and its active sweep endpoint by `2 ** (amount * sampledCents / 1200)`.
- Each range samples a uniform distribution. No quantized three-variant selection, hidden rounding to preset choices or automatic rejection of a natural repeated value.

### Version-one fields

| Range field  | Bounds and compatibility                                               | Identity rule                                                                                |
| ------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `volume`     | Current native event volume 0 to 2                                     | Sample before existing fixed chord compensation; no other voice is rescaled.                 |
| `filterHz`   | 20 to active frequency ceiling; an enabled resonant filter is required | Changes starting cutoff; the authored `filterHzEnd` remains the same endpoint.               |
| `filterQ`    | 0.5 to 10; enabled resonant filter required                            | Does not change filter type.                                                                 |
| `fmDepth`    | 0 to 10; SINE only                                                     | Does not change `fmRatio`; an authored FM endpoint, including zero, remains unchanged.       |
| `noiseRate`  | Positive colored-noise range accepted by current API; NOISE only       | Does not change waveform; authored noise sweep endpoint stays fixed.                         |
| `lowPassHz`  | Enabled cutoff, 20 to active ceiling                                   | Does not randomly switch the low-pass on/off. A disabled low-pass cannot receive this range. |
| `pulseWidth` | 0.05 to 0.95; SQUARE only                                              | Does not change waveform; authored PWM endpoint stays fixed.                                 |
| `pitchCents` | −1200…1200, intentional opt-in                                         | Preserve both the starting pitch and pitch-sweep trajectory under the same multiplier.       |

Native validators must use the actual existing source/range rules rather than assuming all numeric intervals are continuous. In particular, do not interpolate through an invalid bypass/cutoff gap. Pitch corners must remain within the active frequency ceiling, including an existing detune and every frequency in a chord/step. Reject a dictionary whose reachable extremes are invalid; never silently clamp the variation to conceal an invalid recipe.

Version one deliberately keeps waveform, wavetable, quantization, FM ratio, filter type, ADSR, event duration, rhythmic interval, routing and priority authored. This preserves the principal sound shape and simplifies timed-envelope correctness. Optional duration/ADSR variation is a separate future design: it must not randomly violate envelope budgets or move a sequence's rhythmic grid. The earlier discussion of varying 140 to 170 ms was an illustration, not a shipped promise.

### Attacks, held notes, chords and sequences

1. **Timed tone / held note:** sample once as the new voice starts. Reuse the sampled values throughout sustain and release. Playing another note, lifting another finger or repainting UI must not resample this voice.
2. **Chord:** validate the complete call before admission. Each admitted voice gets its own deterministic draws, then the existing compensation applies. Keep atomic chord admission and existing pan/detune behavior.
3. **Sequence:** sample when each scheduled voice actually starts in the native transport, not when JavaScript submits the score. Every new iteration gets new draws. Rests consume none. This is the main advantage over baking variations in JS step overrides.
4. **Inheritance:** a step without `variation` inherits the prepared root voice. A step with `variation` replaces that whole dictionary. `{amount:0}` disables it for that step; partial nested merge semantics are intentionally avoided.
5. **Updates:** `updateVoice` does not accept this attack-only dictionary. Explicit live edits retain their normal smoothing and set the requested fields without resampling other fields or restarting the envelope. `updateSequence` may change ranges/amount for future attacks; active voices keep their sampled state.
6. **Seed stream:** a seeded tone/note call begins at attack index zero, so repeating exactly that call reproduces it. A seeded chord uses note ordinal as a further index. A seeded sequence owns an attack counter that continues across loops and normal revisions. Stop/new play restarts the seeded stream; changing the seed restarts it when the new revision applies. Re-publishing the same seed must not accidentally reset it.

## Deterministic and realtime design

Implement one small C-compatible shared helper, provisionally `shared/synth_variation.h`, used by both platform renderers. Use an integer-defined generator/hash with golden vectors, stable field slots and explicitly defined conversion to a uniform scalar. A counter-based `(seed, attack index, chord voice ordinal, field slot)` scheme avoids dependence on JavaScript property order and on adding another optional field. Review statistical quality against this sound-design use; this is not a cryptographic RNG.

Maintain a separate random stream/counter from oscillator noise. Enabling variation in another voice must not change an existing noise waveform. Omitted/zero amount consumes no variation draws and does not disturb legacy noise state. Seed automatic streams at control/start time, never by calling an OS entropy service in the audio callback.

Parse/validate dictionaries and prepare numeric fixed-size configuration on the producer/control side. At an attack, native code uses bounded constant-time arithmetic and preallocated storage. No allocation, locks, sleeps, collection creation, JSON, JS calls, OS RNG or logging in the callback. No per-sample randomization of these parameters. Existing LFO and sweep processing continues normally after the attack.

Inspect actual packet and bank sizes before choosing storage. `SynthSequenceVoice` is copied into up to 512 steps, three prepared banks and four transports; adding a dictionary-sized object or copying large tables for variation would be wasteful. Use a bit mask plus fixed numeric fields, and measure the resulting worst-case memory instead of guessing.

## Verified implementation seams to inspect

- `android/src/ti/synthengine/SynthContract.java`: closed timed/held/chord validation, including `validateNoteOn`.
- `android/src/ti/synthengine/SynthStudioContract.java`: sequence voice/override validation and prepared packet encoding.
- `android/src/ti/synthengine/SynthThread.java` and `TiSynthEngineModule.java`: command preparation, bridge/default metadata.
- `android/jni/SynthOboeEngine.cpp`: `Voice`, command-to-voice setup, sequence attack creation and JNI packet decoding.
- `ios/Classes/TiSynthengineContract.{h,m}`: equivalent validation and prepared sequence/command structures.
- `ios/Classes/TiSynthengineModule.m`: `startVoiceFromCommand`, sequence-created voices and defaults/capabilities.
- `shared/synth_sequence.h`: `SynthSequenceVoice`, `SynthSequenceStep`, prepared banks and attack events.
- `shared/synth_held.h`, `synth_modulation.h`, `synth_core.h`: preserve held envelope, modulation and oscillator contracts.
- Existing `tests/engine_render_host.cpp`, platform contract regression tests and actual Apple callback host tooling: extend their relevant cases rather than inventing a second renderer.

The graph was used to identify these seams. It reports partial indexing of `synth_sequence.h`; exact source is authoritative. Confirm concrete entry-point signatures against the current checkout before editing.

## Range authoring policy

A preset should define a small subset of the eight fields, with most fields left alone. Musical instruments preserve tuning by default. Mechanical/game impacts may opt into small pitch changes. Amount 100% means the full **authored subtle range**, not an uncontrolled maximum across the API.

Starting references from the archived Frontier experiment:

- Impacts/destruction: pitch multiplier 0.95 to 1.05, about −88.8…84.5 cents. Shots: 0.97 to 1.03, about −52.7…51.2 cents. These are optional FX bounds, not instrument defaults.
- Colored-noise rate/cutoff: 88 to 112% of the anchor; FM depth 92 to 108%; Q 95 to 105%.
- Event level: 97 to 100% of anchor, deliberately never louder than that anchor.
- ADSR/timing/voice count remain unchanged.

Convert these references into absolute native ranges in each recipe. Do not bake those percentages as mandatory Engine defaults: the Engine must not guess what an anvil, glass or trumpet means. Technical range validity and recognizability are distinct; audition the material at low, midpoint and full amount.

<a id="feasibility-and-compatibility-review--november-1-2026"></a>

## Feasibility and compatibility review: November 1, 2026

The proposed opt-in feature is feasible. It requires changes to both validators, bridge packets, command preparation and the voice-start paths, including sequence attacks. No implementation or performance acceptance is claimed by this review.

### Compatibility requirements and consumer impact

| Consumer scenario                                                   | Required behavior                                                                                                                                                                                      |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| An installed app keeps its existing module package                  | Nothing changes; the module is bundled with that app.                                                                                                                                                  |
| An app rebuilds with the new package but never supplies `variation` | Existing recipe parameters, admission, envelopes, gains, processing and noise algorithm/state progression remain unchanged. No variation draws occur.                                                  |
| An app supplies valid `{amount:0}`                                  | Validate the dictionary, then take the same rendering path as the unvaried recipe.                                                                                                                     |
| An app explicitly supplies active ranges                            | Only new attacks sample the permitted fields. Existing sustained voices are not resampled.                                                                                                             |
| A newer app runs with an older package                              | Omit the entire `variation` key unless feature support is advertised. Old closed validators reject unknown keys, including an amount-zero dictionary. Do not retry an unsupported recipe indefinitely. |

Package version and reported API compatibility are separate concerns. Playground's `Resources/lib/synthSafe.js` requires `apiVersion === '1.0.0'`; Guardian's audio system also compares its expected API version exactly. Changing that string would make those apps reject the module or fall back even if every existing sound call remained valid. Studio's inspected source does not impose that exact-version check; Frontier's inspected app/Resources source contains no `apiVersion` check.

**Recommendation, not a published contract:** retain the existing compatibility identifier for unchanged core methods and advertise this optional extension explicitly on both platforms, for example `capabilities.variation: true` plus `variationSchemaVersion: 1`. Publish a new module package version when implementation is ready; do not replace the 1.0.2 release. If the API identifier instead changes, prepare the affected consumer checks before claiming drop-in compatibility. Current iOS metadata omits Android's capability map, so adding the variation flag must be implemented on iOS too.

Apps that do not opt in need no recipe edits. Opting in requires the new package and a support check. Studio additionally needs saved range/amount fields, schema migration, validation, serialization to every supported playback path and explicit controls. Frontier/Guardian need material-specific ranges attached to their recipes; visual variant selection remains a separate concern. No shared recipe registry or reusable sound-object API is required.

### Native details that the implementation must preserve

1. **Validate the effective step voice.** Root voice and step overrides already merge before validation. Validate inherited ranges against each effective waveform/filter and every effective pitch. A step that changes from sine to noise cannot silently discard inherited FM variation: replace the variation dictionary or explicitly disable it for that step. A variation-only `updateSequence` edit must not reset its seed counter or touch active voices.
2. **Apply samples before all derived state.** Android held starts initialize `SynthLive` and may inherit compatible release-tail phase/filter state. Sequence sweeps also read a retained `sequenceShape`. Sample before building those derived values, and retain the sampled starting shape and pitch-scaled endpoint. Sampling only the initial volume/filter/frequency would allow the next live/sweep update to overwrite it. Apply the equivalent rule on iOS.
3. **Define admission and draw order.** Use a fixed-width attack counter and stable field slots. Advance an event counter only after that attack is admitted; rejected events and rests consume no draws. All notes in an admitted chord share that event index and use their note ordinal for independent draws. Automatic streams must distinguish successive one-shot calls. Explicitly seeded one-shot calls restart at index zero, so repeating the same seeded call intentionally repeats its sampled parameters. Specify counter wrap in the shared helper.
4. **Do not confuse parameter determinism with noise PCM.** An explicit variation seed reproduces selected parameter values. Existing oscillator noise is separate: Android currently seeds a voice from its address/sample index; iOS uses time/slot state. A variation seed does not promise identical noise samples, complete PCM or cross-platform output. Compare absent/zero variation against the old renderer using the same controlled noise initialization in the test harness; preserve production noise behavior. Do not change the noise generator to make this test pass.
5. **Preserve waveform meaning.** Pitch variation is useful for tuned sources; ordinary oscillator pitch does not transpose a NOISE source. Author noise effects with clock/filter variation. Keep waveform, ADSR, duration, timing, routing, priority and FM ratio outside V1, as already specified. In particular, authoring FM ranges from an initially zero depth must still satisfy the effective FM-ratio/source rules.
6. **Measure storage and callback cost.** A 64-bit macOS host `sizeof` probe of the unchanged header measured `SynthSequenceVoice=824`, `SynthSequenceStep=1400`, one config `718,920` and one triple-bank transport `2,156,928` bytes. Four such transports total `8,627,712` bytes, excluding renderer voices, command queues and other state. A naive candidate containing amount, sixteen double endpoints, mask and seed flags is 152 bytes; adding it to every step of every bank of four transports would add 933,888 bytes before other copies. These are baseline/layout measurements, not an implemented storage design or a device benchmark. Prefer a compact representation and consider sharing repeated effective configurations within an immutable prepared bank if measurement justifies it.

### Acceptance before consumer rollout

The compatibility claim is a release gate, not a conclusion established by this proposal. Tests must cover omitted and amount-zero variation through timed tones, chords, held notes and native sequences on both platforms, including existing profiles, release overlap and deterministic noise fixtures. Assert unchanged authored configs, stable sustained voices, no extra noise-state consumption, atomic chord admission, unchanged gain compensation, correct sweep starts/endpoints and newly sampled loop attacks. Measure dense publication memory and callback load; retain physical listening as a separate acceptance step.

The review ran only source inspection and the isolated host layout probe. No renderer, bridge, package, existing app sound or physical device was changed.

## Implementation plan and gates

- [ ] **Contract first:** add paired Android/iOS rejection/acceptance tests for omitted, zero, minimum/midpoint/maximum amount, unknown keys, malformed/inverted/nonfinite ranges, incompatible sources, bypass gaps, invalid seeds and pitch corners. Watch new-feature tests fail before adding support.
- [ ] **Shared sampling helper:** implement fixed-size config and deterministic math; test golden vectors, field ordering, seed zero, repeatability, independence from noise RNG, bounded outputs and no mutation of authored configurations.
- [ ] **Both renderers in one work cycle:** add strict bridge/prepared fields, initialize them on every path and sample at actual voice creation, including native sequence retriggers. Review timed/chord/held/sequence paths separately. No platform-only completion.
- [ ] **Native behavior tests:** compare absent/zero-variation PCM to the prior renderer for every waveform/profile/path with controlled identical noise initialization in the harness; use representative fixed seeds to compare platform selections and rendered outcomes. Confirm held notes stay stable when unrelated voices start/release; confirm eight/32-note chords and looping sequence attacks advance the stream correctly.
- [ ] **Lifecycle and edits:** stop/panic/restart, failed admission, voice stealing, capacity saturation, stale sequence revisions, seed changes, 512 steps/four transports, varying override source types, updates while a note sustains. Verify no partially admitted chord and no stale uninitialized variation mask.
- [ ] **Performance/memory:** measure callback work for 1/8/16/32 voices and four active sequences, max bank memory and publication allocation behavior. Absent/disabled paths must remain effectively unchanged. Never reinterpret a host benchmark as physical latency/listening acceptance.
- [ ] **Metadata/docs/example:** advertise support on both platforms in `getDefaults()` capabilities/limits, document fields/defaults/seed/loop behavior and add a clear example. Review exact API-version checks in consumer apps before selecting the feature's development/API version. Do not silently publish 1.0.2 binaries with an undocumented new contract.
- [ ] **Consumer integration:** once the native packages exist, Studio forwards the property from its switch/amount/preset bounds; Frontier and Guardian supply their ranges. Remove app-side samplers, preserve visual variant selection, stable IDs and saved edits. The catalog remains usable when the optional native property is absent.
- [ ] **Physical acceptance:** same-anvil identity, non-repeating nearby strikes, tuned instrument chords, stable held notes, complete finite effects, fresh sequence-loop variations and representative headphones/speakers on Android/iOS. Record listening separately from validator/PCM evidence.

Do not broaden to the entire module suite automatically. Start with the new shared helper and affected contract/render tests. Broaden when a shared struct/packet change makes existing serialization/lifecycle regressions relevant, and explain that concrete reason. Run release-required checks only if an actual release is requested.

## References and workspace state at proposal time

- Current base: TiSynthEngine 1.0.2 packages, public API 1.0.0. Engine checkout was `main` ahead of `origin/main` by one preexisting documentation commit before this proposal; do not discard it.
- Engine mixing/output/oscillator fixes are valued by César. He initially froze the Engine during the unrelated Cristal investigation, then authorized this specific optional variation feature and requested the proposal in the Engine repository.
- Native implementation is **not started** by this document. No release, tag, force push, consumer installation or physical-device operation is authorized merely by the plan.
- Complete Studio JS prototype (archived, removed from production): `/Users/cesar/Developer/validation-evidence/TiSynthEngine/native-variation-proposal-2026-11-01/studio-prototype/README.md`.
- Complete Frontier JS prototype/range tests (archived, removed from production): `/Users/cesar/Developer/validation-evidence/TiSynthEngine/native-variation-proposal-2026-11-01/frontier-prototype/README.md`.
- Frontier prototype proved 271 zero-amount recipe results identical to HEAD and exercised 162 generator/action cases ×32 seeds. Studio prototype checked per-attack ownership and sampled-sequence limitations. These are reference experiments, **not native implementation evidence**. They sampled some fields differently from the proposed native V1 contract; do not copy them wholesale.
- Studio ongoing catalog: `/Users/cesar/Developer/Apps/TiSynth-Studio/documentation/sound-library.json`; generator `tools/import-sound-examples.js`. Source files are snapshotted at development time; the shipped app must not require sibling source projects.

### Historical implementation request

> Read AGENTS.md, docs/project/status.md and documentation/native-variation-proposal.md. Implement the optional native per-attack variation contract on Android and iOS, preserving absent/disabled behavior and existing DSP/mixing. Start with the scoped tests and verify the sequence-loop/held-note/seed guarantees. Treat the document as a proposal whose contradictions should be resolved explicitly; do not publish a release or install on devices without the corresponding instruction. Integrate consumer controls after the native contract and packages are verified.


## Deferred API-model question (separate scope)

César raised whether a recipe should be a registered reusable sound object with a method such as `clickSeco.play()`, instead of a reusable options dictionary submitted on every call. He explicitly asked to defer this observation and continue the current catalog/proposal work. Record it for a later API-design discussion; it is not authorization to add a sound registry, cache or another playback wrapper to this feature. Do not expand native variation into a preset-object lifecycle project.
