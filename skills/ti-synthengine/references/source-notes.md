# Source and platform caveats

The current references describe published TiSynthEngine **2.0.0**, reviewed at
`9d74aa45f84d3f2822d4aab76874efe37d81257f` on 2026-11-03. Both platform
release ZIPs declare 2.0.0 and their packaged declarations match the bundled
[TypeScript asset](../assets/index.d.ts). Read the [guide](guide.md) for
installation and the [upgrade guide](upgrade-2.0.0.md) for migration.

## Choose the correct interface

Use [Sound objects](sound-api.md) for new code. The [direct API](api.md) remains
supported, including its Boolean/ID return contracts and original option names.
The curated [sound](recipes.md) and [interaction](recipes-interaction.md) recipes
use that direct interface; preserve their pitch, envelope, gain and timing when
adapting them. A Sound definition survives shutdown; its playback controls do not.
Do not combine `sound`/`playback` presets with direct native dictionaries.

Runtime metadata uses `version`, not `apiVersion`. Native module manifest
`apiversion` is a separate Titanium ABI field. Older 1.0.2 binaries lack variation
and repetition; detect methods/capabilities before sending new closed-dictionary
fields. Native variation requires its capability and schema pair. Android reports
some extra sequence/processing/modulation flags that iOS omits while supporting
the methods; do not use those flags as a universal feature gate.

`setProcessing()` reverb decay is milliseconds; direct `setMasterProcessing()`
reverb decay remains seconds. See the [unit mapping](upgrade-2.0.0.md#names-and-units).

## Native differences that affect decisions

- Submit exact integer repetition intervals. The reviewed Apple validator accepts
  values extremely close to an integer within its 1e-9 tolerance and truncates
  them; Android rejects them. This is not a portable fractional interval feature.
- Timed zero attack/release initially becomes one sample on Apple before duration
  trimming; Android preserves zero. Matching validation does not establish
  sample-identical envelopes.
- Some early Apple rejections and unknown/retired Android sequence stops bypass
  rejection counters. Recorded reason totals describe recorded failures, not
  every rejected API call.
- Sequence filter sweeps refresh every 16 samples on Android and every 8 on Apple.
  Both use note length; do not promise identical platform PCM.

Exact constraints and platform differences are in the [API](api.md) and
[engine](audio-engine.md). Sound wrapping does not widen native source compatibility.

## Diagnose audio without overstating evidence

Use the [statistics API](api.md#getstats) and [engine telemetry](audio-engine.md#engine-statistics).
Keep unavailable readings as `null`, poll slowly, and cancel the owner's timer.
Render load is callback work divided by its deadline, not whole-app CPU.
Sample-peak ceilings do not certify speaker safety or inter-sample peaks.
Start after layout settles; Android startup underruns, output routes, Bluetooth
latency and sustained maximum load require their own device checks.

The official [Sound validation record](https://github.com/macCesar/TiSynthEngine/blob/9d74aa45f84d3f2822d4aab76874efe37d81257f/documentation/sound-api-validation.md)
separates validator, bridge, within-platform PCM, host allocation/GC and scoped
physical evidence. Host dispatch timings are not Titanium bridge/device latency;
byte-identical PCM comparisons are within each platform, not across platforms.
Historical measurements retain their original revision and acceptance limits,
including failed or inconclusive results. They do not certify every workload.
The native module repository retains raw reports and reproduction tools; they
are maintenance evidence rather than resources needed to implement sounds.
