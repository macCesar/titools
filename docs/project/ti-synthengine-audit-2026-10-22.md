# ti-synthengine audit — 2026-10-22

Reviewed against TiSynthEngine `6b48af568c4a50685541b4ae2800d38081e6ebb7`,
including its documentation-only working tree, fingerprint
`b1674a0c4ae7cced240d4983e415286bdb18d441566c2ac0f5c6fdc8198ef5f3`.
The user explicitly requested both audit and update. Existing TiTools synchronization
was committed by the user as `ff3c829` during the audit; corrections below follow
that baseline. At audit handoff, no native module edits, additional commit, push or release
had been performed. The user subsequently authorized semantic TiTools commits
and session documentation; current commit state is recorded in `status.md`.

## Outcome

Documentation coverage is closed for the eight official Markdown source documents,
two raw reports and protected curated recipes. The source-first detailed ledger
accounted for 906 paragraphs/table rows/distinct code blocks across 190 sections,
including unchanged material. The compact section routing below avoids duplicating
the complete published references in this maintainer record. Declared exclusions
and external demonstration dependencies remain explicit. Runtime acceptance is
limited by the native findings below and the bundled Studio report.

Corrections:

- Discovery/README now describe nineteen methods, held notes, native sequence
  transport, shared master effects and two optional voice LFOs.
- Official examples split into `examples.md` and `advanced-examples.md`, preserving
  full source reconstruction and routing all moved anchors. All references remain
  at most 800 lines; the entry point remains below 500.
- `studio-validation.json` is bundled byte-identically; its three incoming links
  resolve within the installed skill. It preserves failed/pending acceptance.
- API counter prose explicitly limits iOS rejection accounting instead of promising
  exhaustive counts. Native evidence below identifies the exact early returns.
- Curated recipes use const/let, method shorthand and a binding-safe arrow callback;
  rhythm, envelopes, gesture ownership and cancellation are preserved.
- Timed envelope budgets are distinguished from held notes; zero-depth FM with an
  enabled FM-target LFO remains valid. Trigger prompts cover new task families.
- Corrected the documented Java compile command to include `SynthStudioContract.java`;
  compilation and the three documented Java regression runners pass.
- Snapshot metadata declares both example parts and all reversible corrections;
  dirty upstream documentation is not attributed solely to its committed base.

## Verification

- TiTools snapshot/fidelity/local-anchor tests and five curated rhythm/cancellation
  tests pass. Exact reconstruction includes all official Markdown content, permitted
  corrections reversed, plus both raw JSON assets byte-for-byte.
- Scoped manifest checks cover frontmatter, reference pointers and JSON parsing;
  ESLint covers the changed test. `git diff --check` is clean.
- npm dry-run confirms both added assets ship in the 15-file skill payload.
- Upstream documentation regression passes; Studio Java and iOS replay the same
  81-case acceptance corpus with zero failures, plus their contract regressions.
- Shared held, sequence, effects, modulation and spatial core regressions pass.
  Sequence checks a ten-minute sample clock at five rates. No native binary or
  physical output was rebuilt or auditioned by this task.
- Three consumer replays evaluate the actual advanced snippets with mock API/timers:
  held cancellation/retry/failure shutdown; sequence/effects editing and cleanup;
  timer/native swing distinctions and rejection-counter caveats. All pass within
  this control-flow/documentation boundary. Eight source-derived walkthroughs cover
  setup, held notes, transport, master/LFO, spatial, diagnostics, evidence and demo.

## Native findings

### iOS rejected-request statistics undercount

Official upstream `documentation/api.md:616` claims every rejected Boolean API request is counted once. Several current iOS paths return false without updating rejection counters:

- `ios/Classes/TiSynthengineModule.m:1842`: stopped playSequence/updateSequence.
- `ios/Classes/TiSynthengineModule.m:1844`: sequence argument is not a dictionary.
- `ios/Classes/TiSynthengineModule.m:1862`: stopped stopSequence.
- `ios/Classes/TiSynthengineModule.m:1874`: stopped setMasterProcessing.
- `ios/Classes/TiSynthengineModule.m:1968`: known voice receives an incompatible modulation configuration.

Android counterparts count these errors: `android/src/ti/synthengine/TiSynthEngineModule.java:449`, `:452`, `:466`, `:469`, `:474`, `:269`. Its `reject(1)`, `reject(0)`, `reject(2)` classify engineStopped, validation, queueFull. iOS still counts validation failures dispatched through acceptValidation and relevant publication/queue failures; the issue is specific early-return coverage. The returned reason subtotals still sum to the returned total, but that total is not an exhaustive number of actual rejected calls. This is a native parity limitation; no native fixes were authorized in this TiTools skill task. The updated skill API at `skills/ti-synthengine/references/api.md:647` now explicitly limits its claim.

## Existing finding: timed zero envelope remains different

The current iOS voice initializer uses MAX(0), but command conversion still forces one sample on timed calls:

- `ios/Classes/TiSynthengineModule.m:2078` and `:2079`: publishTone uses MAX(voiceId ? 0 : 1, converted time).
- `ios/Classes/TiSynthengineModule.m:2169` and `:2170`: chord attack/release use MAX(1,...).
- `ios/Classes/TiSynthengineModule.m:2470` and `:2471`: pattern attack/release use MAX(1,...).
- `android/jni/SynthOboeEngine.cpp:1052`: makeCommand preserves a converted zero.

Held calls are a different contract: `ios/Classes/TiSynthengineModule.m:1063` applies the shared minimum 3 ms held edge. Do not report the timed iOS discrepancy as resolved simply because the initializer changed. Existing source notes preserve the issue; its scope can explicitly say timed calls.

## Contracts independently verified

- Held option whitelist, positive IDs, no duration/end targets: `android/src/ti/synthengine/SynthContract.java:157`.
- Update option whitelist, note/frequency exclusion, at least one change: same file `:179`.
- Cross-field sustain/filter/FM constraints: same file `:652`.
- Known voice capability checks and callback publication: `android/src/ti/synthengine/TiSynthEngineModule.java:255`; `ios/Classes/TiSynthengineModule.m:1952`.
- Native sequence MIDI12..119, 1..32 notes, 1..512 steps, 20..300 BPM, swing ±0.75, tuning220..880, gates.01..1, voice/step merge: `android/src/ti/synthengine/SynthStudioContract.java:54`.
- Effects ranges, initial defaults and strict Boolean fields: same file `:134`.
- Two LFOs, free rate0..20, strict sources and musical sync: same file `:120`.
- Three-bank acceptance/application distinction: `shared/synth_sequence.h:75`, `:114`.
- BPM next block; structure next step; swing next pair; stop generations and sample clock: `shared/synth_sequence.h:155`, `:165`, `:182`, `:201`.
- Two LFO phase preservation and safe summed contributions: `shared/synth_modulation.h:29`, `:45`, `:54`.
- Held rendering does not accumulate unbounded sample age after attack+decay; release is separate, so INT_MAX total does not impose an approximately13hour time limit: `android/jni/SynthOboeEngine.cpp:837` (held completion at end of function).
- Master effects order, gain and tail processing: `shared/synth_effects.h:136`; iOS render integration `ios/Classes/TiSynthengineModule.m:1686`.
- Statistics shape and unavailable iOS backend fields: `ios/Classes/TiSynthengineModule.m:1259`.

No additional contradiction found in these inspected held/transport/effects/LFO tables. This is a scoped native audit, not proof of every runtime bridge, device route or perceptual behavior.

## Regression coverage boundaries

- `tests/spatial_regression.c:19` runs16,32,64,128kHz; doubling skips192kHz and never exercises8kHz. Other specific checks use44.1/48kHz. Do not infer endpoint coverage from the loop condition.
- `tests/spatial_engine_host.cpp:19` checks complete short-note FIR output at48kHz using a shared-processor reference.
- `tests/spatial_engine_host.cpp:14` and following stealing/stopping cases check finiteness and eventual silence; they do not compare exact stolen/stopped history sample-for-sample.
- `tests/effects_core_regression.c:67` explicitly covers16,44.1,48,96,192kHz, including disabled bypass, automation, panic, tails and memory bounds.
- `tests/modulation_core_regression.c:5` covers disabled state,30Hz sync, source capability rejection, phase preservation, clamping and disabled contribution decay.
- Java/iOS contract corpus validates options and reasons, not iOS renderer samples.
- Android native host output does not prove iOS output, physical stream underruns, device CPU, heat, battery, route handling or localization.
- Historical stats-only measurements are not current full-chain device acceptance. Retain the Studio report's unmet/pending acceptance distinctions.

Parent reports freshly executed PASS: documentation_regression; Studio Java81-case corpus plus regression; Foundation iOS81-case corpus plus studio_contract; shared C held, sequence, effects, modulation and spatial checks. These executions belong to the parent agent; this auditor independently inspected boundaries rather than rerunning identical checks.


## Compact source-section routing

Each source is at the reviewed commit plus exact dirty fingerprint above.
Rows locate the final destination section; the snapshot retains every source
paragraph/table/example, including unchanged requirements. Native exceptions are
corrected through recorded reversible transformations.

| Source | Section | Final skill locator | Status |
| --- | --- | --- | --- |
| documentation/api.md | API reference | references/api.md:3 | complete |
| documentation/api.md | Return values | references/api.md:40 | complete |
| documentation/api.md | `getDefaults()` | references/api.md:46 | complete |
| documentation/api.md | Limits | references/api.md:112 | complete |
| documentation/api.md | `startEngine(options)` | references/api.md:152 | complete |
| documentation/api.md | `noteOn(options)` | references/api.md:168 | complete |
| documentation/api.md | `noteOff(options)` | references/api.md:200 | complete |
| documentation/api.md | `updateVoice(options)` | references/api.md:208 | complete |
| documentation/api.md | `playTone(options)` | references/api.md:239 | complete |
| documentation/api.md | Native sequence transport | references/api.md:281 | complete |
| documentation/api.md | `playSequence(options)` | references/api.md:305 | complete |
| documentation/api.md | `updateSequence(changes)` | references/api.md:309 | complete |
| documentation/api.md | `stopSequence()` | references/api.md:313 | complete |
| documentation/api.md | `getSequenceState()` | references/api.md:317 | complete |
| documentation/api.md | `setMasterProcessing(options)` | references/api.md:332 | complete |
| documentation/api.md | Additional voice modulation | references/api.md:352 | complete |
| documentation/api.md | `playChord(options)` | references/api.md:366 | complete |
| documentation/api.md | `playPattern(options)` | references/api.md:399 | complete |
| documentation/api.md | Expressive controls | references/api.md:468 | complete |
| documentation/api.md | Decay and sustain | references/api.md:472 | complete |
| documentation/api.md | Resonant filter | references/api.md:489 | complete |
| documentation/api.md | Frequency modulation | references/api.md:504 | complete |
| documentation/api.md | Detune | references/api.md:516 | complete |
| documentation/api.md | Rules across keys | references/api.md:520 | complete |
| documentation/api.md | `setVolume(options)` | references/api.md:534 | complete |
| documentation/api.md | `stopAll()` | references/api.md:542 | complete |
| documentation/api.md | `shutdown()` | references/api.md:546 | complete |
| documentation/api.md | `patternend` event | references/api.md:550 | complete |
| documentation/api.md | Strict validation | references/api.md:575 | complete |
| documentation/api.md | Binaural front-plane positioning | references/api.md:614 | complete |
| documentation/api.md | `getStats()` | references/api.md:633 | complete |
| documentation/api.md | `setStatsEnabled(enabled)` | references/api.md:668 | complete |
| documentation/api.md | `resetStats()` | references/api.md:672 | complete |
| documentation/audio-engine.md | Audio engine | references/audio-engine.md:3 | complete |
| documentation/audio-engine.md | Signal path | references/audio-engine.md:32 | complete |
| documentation/audio-engine.md | Oscillators | references/audio-engine.md:58 | complete |
| documentation/audio-engine.md | Frequency modulation | references/audio-engine.md:77 | complete |
| documentation/audio-engine.md | State-variable filter | references/audio-engine.md:83 | complete |
| documentation/audio-engine.md | Envelope | references/audio-engine.md:95 | complete |
| documentation/audio-engine.md | Event gain | references/audio-engine.md:108 | complete |
| documentation/audio-engine.md | Mixing profiles | references/audio-engine.md:128 | complete |
| documentation/audio-engine.md | Limiter | references/audio-engine.md:141 | complete |
| documentation/audio-engine.md | Master volume and pan | references/audio-engine.md:155 | complete |
| documentation/audio-engine.md | Voice pool | references/audio-engine.md:161 | complete |
| documentation/audio-engine.md | Command queue | references/audio-engine.md:167 | complete |
| documentation/audio-engine.md | Shared DSP core | references/audio-engine.md:175 | complete |
| documentation/audio-engine.md | Android implementation | references/audio-engine.md:179 | complete |
| documentation/audio-engine.md | iOS implementation | references/audio-engine.md:185 | complete |
| documentation/audio-engine.md | Latency | references/audio-engine.md:191 | complete |
| documentation/audio-engine.md | Route behavior | references/audio-engine.md:201 | complete |
| documentation/audio-engine.md | Regression coverage | references/audio-engine.md:205 | complete |
| documentation/audio-engine.md | Binaural front-plane renderer | references/audio-engine.md:269 | complete |
| documentation/audio-engine.md | Reproduce a host CPU comparison | references/audio-engine.md:277 | complete |
| documentation/audio-engine.md | Engine statistics | references/audio-engine.md:293 | complete |
| documentation/audio-engine.md | Sustained voices | references/audio-engine.md:313 | complete |
| documentation/audio-engine.md | Native transport and processing | references/audio-engine.md:322 | complete |
| documentation/examples.md | Examples | references/examples.md:3 | complete |
| documentation/examples.md | Start once after layout | references/examples.md:53 | complete |
| documentation/examples.md | Built-in waveforms | references/examples.md:86 | complete |
| documentation/examples.md | Variable-rate filtered noise | references/examples.md:107 | complete |
| documentation/examples.md | Pulse-width sweep | references/examples.md:126 | complete |
| documentation/examples.md | Stepped wavetable | references/examples.md:143 | complete |
| documentation/examples.md | Fixed controls on a chord | references/examples.md:160 | complete |
| documentation/examples.md | Wave-shaping pattern overrides | references/examples.md:179 | complete |
| documentation/examples.md | Pitch sweep and pan movement | references/examples.md:217 | complete |
| documentation/examples.md | Vibrato | references/examples.md:235 | complete |
| documentation/examples.md | Chord with an even spread | references/examples.md:252 | complete |
| documentation/examples.md | Chord with explicit pans | references/examples.md:266 | complete |
| documentation/examples.md | Tempo, note values and swing | references/examples.md:282 | complete |
| documentation/examples.md | Millisecond pattern | references/examples.md:305 | complete |
| documentation/examples.md | Step overrides | references/examples.md:326 | complete |
| documentation/examples.md | Noise percussion | references/examples.md:352 | complete |
| documentation/examples.md | Xylophone sketch | references/examples.md:373 | complete |
| documentation/examples.md | Simon-style pads | references/examples.md:396 | complete |
| documentation/examples.md | Pluck and electric piano | references/examples.md:425 | complete |
| documentation/examples.md | Bell | references/examples.md:460 | complete |
| documentation/examples.md | Wah and filtered laser | references/examples.md:480 | complete |
| documentation/examples.md | Kick and hi-hat in one pattern | references/examples.md:515 | complete |
| documentation/examples.md | Detuned chords | references/examples.md:561 | complete |
| documentation/examples.md | Chain patterns with `patternend` | references/examples.md:594 | complete |
| documentation/examples.md | Rules across keys | references/examples.md:628 | complete |
| documentation/examples.md | Speaker-safe startup | references/examples.md:640 | complete |
| documentation/examples.md | Validation at an input boundary | references/examples.md:653 | complete |
| documentation/examples.md | Stop and clean up | references/examples.md:669 | complete |
| documentation/examples.md | Positioned headphone effect | references/examples.md:682 | complete |
| documentation/examples.md | Sustained game motor | references/advanced-examples.md:7 | complete |
| documentation/examples.md | Native sequence with chords and edits | references/advanced-examples.md:67 | complete |
| documentation/examples.md | Chorus, delay, reverb and creative saturation | references/advanced-examples.md:108 | complete |
| documentation/examples.md | Two voice LFOs | references/advanced-examples.md:141 | complete |
| documentation/examples.md | Measure peaks and limiter reduction | references/advanced-examples.md:167 | complete |
| documentation/guide.md | Guide | references/guide.md:3 | complete |
| documentation/guide.md | Install the module | references/guide.md:34 | complete |
| documentation/guide.md | Load and verify the contract | references/guide.md:52 | complete |
| documentation/guide.md | Lifecycle | references/guide.md:67 | complete |
| documentation/guide.md | Detect optional beta capabilities | references/guide.md:113 | complete |
| documentation/guide.md | Hold and edit a voice | references/guide.md:128 | complete |
| documentation/guide.md | Choose the musical transport | references/guide.md:136 | complete |
| documentation/guide.md | Add master effects | references/guide.md:151 | complete |
| documentation/guide.md | Play the first sound | references/guide.md:161 | complete |
| documentation/guide.md | Choose a pitch | references/guide.md:178 | complete |
| documentation/guide.md | Shape a tone | references/guide.md:189 | complete |
| documentation/guide.md | Settle, filter and modulate | references/guide.md:223 | complete |
| documentation/guide.md | Shape noise and waveforms | references/guide.md:284 | complete |
| documentation/guide.md | Play simultaneous notes | references/guide.md:329 | complete |
| documentation/guide.md | Play a pattern | references/guide.md:356 | complete |
| documentation/guide.md | Know when a pattern ends | references/guide.md:379 | complete |
| documentation/guide.md | Master level and stopping | references/guide.md:404 | complete |
| documentation/guide.md | Output route changes | references/guide.md:413 | complete |
| documentation/guide.md | Integrate binaural in a 2D app | references/guide.md:419 | complete |
| documentation/guide.md | Detect the installed feature | references/guide.md:425 | complete |
| documentation/guide.md | Direction and amplitude are different controls | references/guide.md:438 | complete |
| documentation/guide.md | Convert screen positions when playing a tone | references/guide.md:465 | complete |
| documentation/guide.md | Chords and patterns | references/guide.md:528 | complete |
| documentation/guide.md | Listen and measure | references/guide.md:561 | complete |
| documentation/guide.md | Read engine statistics | references/guide.md:567 | complete |
| documentation/guide.md | Next steps | references/guide.md:609 | complete |
| documentation/guide.md | Diagnose mix headroom | references/guide.md:616 | complete |
| documentation/recommendations.md | Recommendations | references/recommendations.md:3 | complete |
| documentation/recommendations.md | Group simultaneous notes | references/recommendations.md:7 | complete |
| documentation/recommendations.md | Choose the mixing profile once | references/recommendations.md:13 | complete |
| documentation/recommendations.md | Size `maxVoices` for real overlap | references/recommendations.md:26 | complete |
| documentation/recommendations.md | Keep one lifecycle owner | references/recommendations.md:39 | complete |
| documentation/recommendations.md | Coexisting with other audio | references/recommendations.md:47 | complete |
| documentation/recommendations.md | Keep resonance, FM and detune in check | references/recommendations.md:61 | complete |
| documentation/recommendations.md | Validate values at the app boundary | references/recommendations.md:72 | complete |
| documentation/recommendations.md | Test the intended sound | references/recommendations.md:92 | complete |
| documentation/recommendations.md | Binaural placement | references/recommendations.md:108 | complete |
| documentation/recommendations.md | Known limits | references/recommendations.md:112 | complete |
| documentation/recommendations.md | Use effects and held voices deliberately | references/recommendations.md:129 | complete |
| documentation/sound-design.md | Sound design with TiSynthEngine | references/sound-design.md:3 | complete |
| documentation/sound-design.md | Notes, frequencies and octaves | references/sound-design.md:36 | complete |
| documentation/sound-design.md | Waveform and timbre | references/sound-design.md:64 | complete |
| documentation/sound-design.md | Sine | references/sound-design.md:68 | complete |
| documentation/sound-design.md | Square | references/sound-design.md:72 | complete |
| documentation/sound-design.md | Sawtooth | references/sound-design.md:76 | complete |
| documentation/sound-design.md | Triangle | references/sound-design.md:80 | complete |
| documentation/sound-design.md | Noise | references/sound-design.md:84 | complete |
| documentation/sound-design.md | Wavetable | references/sound-design.md:90 | complete |
| documentation/sound-design.md | Filter, pulse width and quantization | references/sound-design.md:122 | complete |
| documentation/sound-design.md | Envelope and total duration | references/sound-design.md:142 | complete |
| documentation/sound-design.md | Decay and sustain | references/sound-design.md:166 | complete |
| documentation/sound-design.md | Pan and movement | references/sound-design.md:186 | complete |
| documentation/sound-design.md | Vibrato and the LFO | references/sound-design.md:218 | complete |
| documentation/sound-design.md | Resonant filter | references/sound-design.md:236 | complete |
| documentation/sound-design.md | Frequency modulation | references/sound-design.md:265 | complete |
| documentation/sound-design.md | Detune | references/sound-design.md:275 | complete |
| documentation/sound-design.md | Chords, polyphony and gain | references/sound-design.md:295 | complete |
| documentation/sound-design.md | Mixing profiles and limiter | references/sound-design.md:315 | complete |
| documentation/sound-design.md | Speakers, headphones and devices | references/sound-design.md:330 | complete |
| documentation/sound-design.md | Recipes | references/sound-design.md:344 | complete |
| documentation/sound-design.md | Interface click | references/sound-design.md:348 | complete |
| documentation/sound-design.md | Confirmation hit | references/sound-design.md:363 | complete |
| documentation/sound-design.md | Soft pad | references/sound-design.md:377 | complete |
| documentation/sound-design.md | Two-tone alarm | references/sound-design.md:391 | complete |
| documentation/sound-design.md | Retro pickup | references/sound-design.md:410 | complete |
| documentation/sound-design.md | Noise percussion | references/sound-design.md:432 | complete |
| documentation/sound-design.md | Filtered noise burst | references/sound-design.md:453 | complete |
| documentation/sound-design.md | Pluck | references/sound-design.md:472 | complete |
| documentation/sound-design.md | Electric piano | references/sound-design.md:487 | complete |
| documentation/sound-design.md | Bell | references/sound-design.md:507 | complete |
| documentation/sound-design.md | Wah | references/sound-design.md:527 | complete |
| documentation/sound-design.md | Filtered laser | references/sound-design.md:531 | complete |
| documentation/sound-design.md | Hi-hat | references/sound-design.md:549 | complete |
| documentation/sound-design.md | Thick pad | references/sound-design.md:567 | complete |
| documentation/sound-design.md | Kick | references/sound-design.md:586 | complete |
| documentation/sound-design.md | Simon-style cues | references/sound-design.md:604 | complete |
| documentation/sound-design.md | Holding a sound and adding movement | references/sound-design.md:637 | complete |
| documentation/sound-design.md | Native space and creative drive | references/sound-design.md:645 | complete |
| documentation/stats-performance.md | Statistics host comparison | references/stats-performance.md:3 | complete |
| documentation/troubleshooting.md | Troubleshooting | references/troubleshooting.md:3 | complete |
| documentation/troubleshooting.md | A call returns `false` | references/troubleshooting.md:7 | complete |
| documentation/troubleshooting.md | The installed contract is wrong | references/troubleshooting.md:48 | complete |
| documentation/troubleshooting.md | Binaural does not change the position | references/troubleshooting.md:68 | complete |
| documentation/troubleshooting.md | Statistics are missing or show `null` | references/troubleshooting.md:82 | complete |
| documentation/troubleshooting.md | Render load changes while no notes are playing | references/troubleshooting.md:90 | complete |
| documentation/troubleshooting.md | The first sound glitches | references/troubleshooting.md:100 | complete |
| documentation/troubleshooting.md | The app is silent | references/troubleshooting.md:106 | complete |
| documentation/troubleshooting.md | A pattern stops or skips steps | references/troubleshooting.md:120 | complete |
| documentation/troubleshooting.md | `patternend` never arrives | references/troubleshooting.md:136 | complete |
| documentation/troubleshooting.md | A chord is distorted or pumps | references/troubleshooting.md:147 | complete |
| documentation/troubleshooting.md | The phone speaker buzzes but headphones are clean | references/troubleshooting.md:161 | complete |
| documentation/troubleshooting.md | Audio changes after connecting headphones | references/troubleshooting.md:167 | complete |
| documentation/troubleshooting.md | Android-specific checks | references/troubleshooting.md:173 | complete |
| documentation/troubleshooting.md | iOS-specific checks | references/troubleshooting.md:181 | complete |
| documentation/troubleshooting.md | What to include in a bug report | references/troubleshooting.md:188 | complete |
| documentation/troubleshooting.md | Held notes, sequences or effects methods are missing | references/troubleshooting.md:192 | complete |
| documentation/troubleshooting.md | A held voice does not release or update | references/troubleshooting.md:196 | complete |
| documentation/troubleshooting.md | A native sequence edit seems delayed or does not resume | references/troubleshooting.md:204 | complete |
| documentation/troubleshooting.md | Effects are silent, remain audible when disabled or affect other sounds | references/troubleshooting.md:212 | complete |
| documentation/troubleshooting.md | A brief level dip is gone before the meter refreshes | references/troubleshooting.md:220 | complete |


## Supplemental source coverage and exclusions


| Source section | Requirement | Destination or exclusion | Status |
| --- | --- | --- | --- |
| documentation/index.md entire | Navigation, feature entry points, official examples/tests/shared DSP provenance | SKILL.md task table plus source-notes; links into api/guide/advanced-examples/audio-engine. Upstream duplicate index excluded. | excluded (duplicate navigation) |
| documentation/third-party-notices.md:1-5 | Oboe1.10 and native-effect dependency context | audio-engine Android implementation and native transport/processing; external notice text belongs to actual module packages. | excluded (native license payload not redistributed) |
| documentation/third-party-notices.md:7-214 | Apache2 license for Oboe | No Oboe code/binary distributed by this skill; stays with official native packages. | excluded |
| documentation/third-party-notices.md:216-end | KEMAR measurements provenance, author attribution and archive/hash transformation | audio-engine binaural renderer preserves provenance/context; data license text stays with module packaging because no HRTF data distributed here. Source sentence no iOS third-party dependencies is misleading unless read as no external code dependency; KEMAR is embedded on both ports. | excluded (license payload); applicable runtime/provenance complete |
| README.md:7 What it is for | Complete section/task and distinct examples | recommendations.md#known-limits | complete (equivalent reference guidance) |
| README.md:13 Requirements | Complete section/task and distinct examples | guide.md#install-the-module + audio-engine.md Android/iOS implementation | complete (equivalent reference guidance) |
| README.md:21 Install | Complete section/task and distinct examples | guide.md#install-the-module | complete (equivalent reference guidance) |
| README.md:39 Quick start | Complete section/task and distinct examples | guide.md#load-and-verify-the-contract + #play-the-first-sound | complete (equivalent reference guidance) |
| README.md:64 Start after layout | Complete section/task and distinct examples | guide.md#lifecycle | complete (equivalent reference guidance) |
| README.md:96 Public methods | Complete section/task and distinct examples | api.md complete method sections | complete (equivalent reference guidance) |
| README.md:126 Sustained voices, musical transport and effects | Complete section/task and distinct examples | guide.md#detect-optional-beta-capabilities + advanced-examples.md | complete (equivalent reference guidance) |
| README.md:158 Strict options | Complete section/task and distinct examples | api.md#strict-validation | complete (equivalent reference guidance) |
| README.md:175 Notes and frequencies | Complete section/task and distinct examples | api.md#playtoneoptions + sound-design.md#notes-frequencies-and-octaves | complete (equivalent reference guidance) |
| README.md:189 Waveforms | Complete section/task and distinct examples | sound-design.md#waveform-and-timbre | complete (equivalent reference guidance) |
| README.md:225 Wave-shaping controls | Complete section/task and distinct examples | guide.md#shape-noise-and-waveforms | complete (equivalent reference guidance) |
| README.md:262 Envelopes | Complete section/task and distinct examples | api.md#expressive-controls + sound-design.md#envelope-and-total-duration | complete (equivalent reference guidance) |
| README.md:287 Panning, sweeps and vibrato | Complete section/task and distinct examples | api.md#playtoneoptions + sound-design.md#pan-and-movement | complete (equivalent reference guidance) |
| README.md:315 Filter, FM and detune | Complete section/task and distinct examples | api.md#expressive-controls | complete (equivalent reference guidance) |
| README.md:346 Chords and polyphony | Complete section/task and distinct examples | api.md#playchordoptions + audio-engine.md#event-gain | complete (equivalent reference guidance) |
| README.md:368 Patterns | Complete section/task and distinct examples | api.md#playpatternoptions + #patternend-event | complete (equivalent reference guidance) |
| README.md:404 Binaural headphone positioning | Complete section/task and distinct examples | guide.md#integrate-binaural-in-a-2d-app | complete (equivalent reference guidance) |
| README.md:410 Engine statistics | Complete section/task and distinct examples | api.md#getstats + guide.md#read-engine-statistics | complete (equivalent reference guidance) |
| README.md:416 Mixing profiles | Complete section/task and distinct examples | audio-engine.md#mixing-profiles | complete (equivalent reference guidance) |
| README.md:431 Master volume | Complete section/task and distinct examples | api.md#setvolumeoptions | complete (equivalent reference guidance) |
| README.md:435 Audio route changes | Complete section/task and distinct examples | guide.md#output-route-changes | complete (equivalent reference guidance) |
| README.md:439 More documentation | Complete section/task and distinct examples | SKILL.md task routing | complete (equivalent reference guidance) |
| README.md:449 Build and test | Complete section/task and distinct examples | audio-engine.md#regression-coverage; native package builds delegated official platform READMEs | complete (equivalent reference guidance) |
| README.md:453 License | Complete section/task and distinct examples | Excluded native code license: no module code redistributed | complete (equivalent reference guidance) |
| example/README.md #Run it | Full interactive demo setup/control test behavior | Pinned official example README: exact Classic setup path incl Resources/app.js, both archives, requirements, rebuild/reinstall; guide.md also preserves native integration | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| example/README.md #Synthesis and sequencing | Full interactive demo setup/control test behavior | examples.md waveform/shaping/chord/pattern/percussion/FM sections | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| example/README.md #Headphone positioning | Full interactive demo setup/control test behavior | guide.md binaural integration + pinned demo checklist | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| example/README.md #Audio session | Full interactive demo setup/control test behavior | api.md startEngine + pinned demo controls | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| example/README.md #Pattern completion and replacement | Full interactive demo setup/control test behavior | api.md patternend event + pinned demo checklist | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| example/README.md #Statistics | Full interactive demo setup/control test behavior | api.md stats + guide.md read-engine-statistics + pinned demo controls | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| example/README.md #Checks and limits | Full interactive demo setup/control test behavior | audio-engine.md regression coverage + pinned demo checklist | delegated to commit-pinned official README (repository access required; runnable app not bundled) |
| android/README.md; ios/README.md | Module maintainer native build/package instructions | Out of app-consumer skill scope; linked by upstream root README; app installation and runtime requirements retained in guide/audio-engine. | excluded (native module build maintenance) |

## Consumer walkthroughs

| Scenario | Source-derived requirements and observed final route | Result / boundary |
| --- | --- | --- |
| Install and first sound | guide install pins both platform1.0.0 packages; SDK13.2/API35/iOS15; verify capabilities; register postlayout before open; debounce250ms; handle failed start; cancel timers on close; shutdown owner. | pass, documentation walkthrough |
| Held motor/interactive keys | advanced-examples held motor checks3methods; unique positive ID; update allowed target; release/cancel; retry twice16ms then shutdown; stop retries on close; restart stream after pause. | pass, contract guidance only |
| Native sequence vs timer pattern | guide/API preserve MIDI vs strings, grid/gate vs milliseconds, atomic edits/revision, next block/step/pair boundaries, mutual replacement and stop ownership. | pass, documentation walkthrough |
| Shared master effects and LFO | advanced-examples + api ranges/default-disabled state; whole bus effect scope; independent2LFO slots; compatible targets; sync native tempo; drain bounded30s; panic/shutdown differences. | pass, no perceived quality assertion |
| Binaural app control | guide converts all source paths; signed directional vs amplitude controls; removes pan conflict incl inherited0; omit both coords off; no active reposition; headphone/perception limits. | pass, no localization assertion |
| Diagnostics | guide/API/advanced meter preserve optional enable, null vs0, nonresetting reads, callback reset,200ms windows vs persistent maxima,5Hz owner timer cleanup, Android best effort/iOSnull, iOS rejection counter exception. | pass, no total CPU/hardware claim |
| Performance evidence | stats-performance labels historical only; studio JSON complete includes failed49deadline host workload, maxload22.0155, hardware limitations and partial physical records; no realtime guarantee. | pass for evidence access; runtime acceptance deliberately open |
| Interactive standalone example | examples links pinned README/app at reviewed base; Classic setup and controls available with repository access; docs clearly distinguish older timed demo from advanced API snippets. | pass as declared external demonstration; not bundled runnable code |


The read-only snapshot checker automatically discovers Markdown additions only.
Both current JSON reports are explicitly inventoried and hashed; future JSON or
non-Markdown documentation additions must be inventoried separately during audits.
No shared CLI or sibling AISkills implementation changed. Version files remain
at 5.2.0 because this task prepares an unreleased update; publication was not requested.
