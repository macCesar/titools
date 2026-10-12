# Procedural WAV sources and audio analysis

Support both runtime `ti.synthengine` recipes and offline synthesized WAV assets. Preserve the project's chosen backend: Lander generates PCM WAV with Python's `wave`/`struct` and deterministic synthesis; Guardian uses native recipes with generated WAV fallback. Do not install a synthesizer module just to generate a WAV. The authoring agent (Claude Code, Codex CLI, etc.) is provenance, not the synthesis algorithm.

Keep generator code, recipe parameters, seed, reference roles, sample rate, bit depth/sample width, channels, duration/frame count and loop/one-shot role. Store source and resulting file hashes. Choose formats compatible with the installed playback engine. Make fallback semantics match the requested cue, and preserve mute/preferences, pause, lifecycle and graceful failure. A mono WAV can still be spatialized if the playback backend supports it; do not assume that support.

## Analysis and tools

Inspect available tools/versions before use. `ffprobe` reports codec, sample format, rate, channels and duration. FFmpeg can decode/convert, measure peak/RMS/DC statistics and draw spectral views; that does not automatically identify the notes in noisy or polyphonic effects. Use FFT/autocorrelation or a dedicated pitch estimator for an appropriate signal, state window/hop and uncertainty, and distinguish a harmonic peak from the fundamental. Music note naming is an optional interpretation under an explicit tuning reference, not a reliable description of every noise effect.

Examples (read/derived output only; choose new paths and inspect installed filter help):

```bash
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels,bits_per_sample:format=duration -of json cue.wav
ffmpeg -hide_banner -i cue.wav -af astats -f null -
ffmpeg -n -i cue.wav -lavfi showspectrumpic=s=1024x512 -frames:v 1 /tmp/cue-spectrum.png
```

Do not claim a historical project used FFmpeg unless its code/logs show it. Verified in this review: Lander's current generator writes WAV directly in Python; Guardian's `docs/scripts/generate-audio.js` writes RIFF/PCM directly in Node. Both can be analyzed with other tools without those tools being the original synthesizer.

## Synthesis and loops

For a changing frequency, integrate frequency into phase (`phase[n+1] = phase[n] + 2π f[n]/sampleRate`); multiplying a time-varying frequency by time produces a different sweep. Keep oscillators/modulation below meaningful aliasing limits or use a suitable band-limited method; square/saw/noise/FM require listening beyond a peak check. Mix with headroom and verify clipped samples, DC offset, peak, RMS and tails; do not solve every mix by normalization.

A one-shot's fades/envelope must not automatically wrap around a loop. Measure amplitude continuity and local RMS through repeated joins, as well as phase/tangent continuity for tonal components. Integer cycles of tonal and modulation periods are one useful periodic construction, not a universal recipe for noisy loops. Check the complete mixed/noise signal too. Crossfading can help suitable ambience, but is not a substitute for reviewing the loop; detuned partials may introduce an unwanted amplitude beat.

Lander's documented thruster pulse came from fades inside the WAV, despite gapless playback. It rebuilt the loops with periodic tonal/modulation components and tested with an old-file positive control (`docs/project/decisions.md`, 2026-08-18; `scripts/generate_game_assets.py`). Preserve this diagnostic lesson rather than its exact frequencies or durations.

## Manifest and acceptance

A sound may keep `source`/`reference` for its generator recipe and optionally declare `wav: {file, sample_rate, channels, sample_width, frames, loop}`. The validator checks an existing PCM WAV against those header fields and rejects empty/truncated payloads; it does not check pitch, clipping, loop quality or native playback. `sample_width` is bytes per sample. `loop` records intent, not a quality certificate. Use project analysis/tests and repeated listening to prove those properties.

Report separately: file/contract checks, signal analysis, native playback and headphone/phone listening. Preserve reference rights/provenance; original sound design based on technical observations does not authorize redistributing reference recordings or ROM/sample data.
