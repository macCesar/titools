# Curated sound and interaction recipes

These recipes are tuned starting points for `ti.synthengine` 1.0.0. They use
only public option keys, keep every explicit envelope valid, and obtain
waveforms from the runtime contract instead of hardcoding integers. Install the
matching official Android/iOS packages and follow the owning-engine
[installation and lifecycle guide](guide.md) before using them.

Unless a section says otherwise, the snippets assume one owner has already
started the engine:

```javascript
const synth = require('ti.synthengine')
const contract = synth.getDefaults()
const WAVE = contract.waveTypes
```

Treat levels as starting points, not mastering targets. Test on the actual
phone speaker and leave headroom when release tails or independent events can
overlap.

Instrument interactions, layered chords and expressive synthesis are in
[the interaction recipes](recipes-interaction.md). Their standard synthesis
starting ranges require listening on the target device before shipping.

<!-- TOC-START -->
## Contents

- [Retro and arcade effects](#retro-and-arcade-effects)
- [Playable xylophone](#playable-xylophone)
- [Four-pad memory cues](#four-pad-memory-cues)
- [Polyphony and layered chords](#polyphony-and-layered-chords)
- [Expressive envelopes, filters and FM](#expressive-envelopes-filters-and-fm)
- [Preset architecture for strict contracts](#preset-architecture-for-strict-contracts)
- [Recipe verification checklist](#recipe-verification-checklist)

<!-- TOC-END -->

## Retro and arcade effects

### Rising missile launch

A bright square wave and a fast upward sweep create the impression of thrust
and acceleration. The short release removes the edge without blurring the
motion.

```javascript
const accepted = synth.playTone({
  frequency: 196,
  frequencyEnd: 523,
  duration: 350,
  attack: 0,
  release: 50,
  volume: 0.55,
  waveType: WAVE.SQUARE
})
```

### Downward projectile

Reverse the pitch direction for a compact shot, fall, or power-down effect.

```javascript
synth.playTone({
  frequency: 900,
  frequencyEnd: 200,
  duration: 150,
  attack: 0,
  release: 50,
  volume: 0.48,
  waveType: WAVE.SQUARE
})
```

### Power-up sweep

Sawtooth carries more upper harmonics than square or triangle, so this sweep
cuts through small speakers at a moderate event level.

```javascript
synth.playTone({
  frequency: 220,
  frequencyEnd: 880,
  duration: 600,
  attack: 10,
  release: 100,
  volume: 0.5,
  waveType: WAVE.SAWTOOTH
})
```

### Noise explosion

White noise supplies an impact spectrum without implying a musical pitch. The
long release creates the debris tail. A pitch field is still included because
every sounding event follows the same contract.

```javascript
synth.playTone({
  frequency: 200,
  duration: 600,
  attack: 0,
  release: 500,
  volume: 0.72,
  waveType: WAVE.NOISE
})
```

For a shorter blast, use `duration: 500` and `release: 400`. Do not stack
several full-level explosions unless the engine profile and overlap budget
were chosen for it.

### Three-note bonus cue

Short ascending square notes read as collection or reward. Native millisecond intervals preserve the 110 ms onset spacing; explicit `length` starts release early enough to preserve the original 95/95/130 ms total envelopes.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "attack": 2,
    "release": 30,
    "volume": 0.55,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        523.25
      ],
      "duration": 95,
      "length": 65,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 15
    },
    {
      "frequencies": [
        587.33
      ],
      "duration": 95,
      "length": 65,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 15
    },
    {
      "frequencies": [
        659.25
      ],
      "duration": 130,
      "length": 100,
      "overrides": {}
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Fast four-note arpeggio

Very short square notes with a small attack retain the hard cartridge-era
edge while reducing uncontrolled clicks. The 10 ms rests keep the first three
40 ms notes on a 50 ms grid; the final note rings for 80 ms.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "attack": 5,
    "release": 15,
    "volume": 0.5,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        261.63
      ],
      "duration": 40,
      "length": 25,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        329.63
      ],
      "duration": 40,
      "length": 25,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        392
      ],
      "duration": 40,
      "length": 25,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        523.25
      ],
      "duration": 80,
      "length": 65,
      "overrides": {}
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Rapid score ticks

Use one native pattern instead of ten JavaScript timers. Explicit attack and
release values make every 60 ms tone valid without relying on shortened
defaults. A 10 ms rest after each tone places the ticks 70 ms apart.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "volume": 0.42,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Hovering craft

A large triangle-wave LFO is no longer subtle vibrato: it becomes a cyclical
engine wobble. Slow stereo travel adds movement on headphones while pitch
remains the primary cue on mono speakers.

```javascript
synth.playTone({
  frequency: 800,
  duration: 2500,
  attack: 100,
  release: 400,
  volume: 0.42,
  waveType: WAVE.TRIANGLE,
  lfoFreq: 12,
  lfoDepth: 200,
  pan: -0.35,
  panEnd: 0.35
})
```

### Alternating warning alarm

An octave-like high/low alternation is easy to identify even through a small
speaker. Each 120 ms tone has a fitted envelope (`10 + 100 <= 120`), followed
by a 10 ms rest, so the pitch changes every 130 ms.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "attack": 10,
    "release": 100,
    "volume": 0.45,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Low heartbeat pair

Two separated triangle pulses suggest a double heartbeat without the buzz of a
square wave. These sub-bass pitches suit headphones or a larger speaker; for a
phone speaker, try 180 and 160 Hz while preserving the rhythm.

```javascript
function playHeartbeatPair () {
  return synth.playSequence({ timeUnit: 'ms', loop: false,
    voice: {waveType: WAVE.TRIANGLE, attack: 10, release: 120, volume: 0.55},
    steps: [
      {frequencies: [90], duration: 220, length: 30},
      {frequencies: [80], duration: 150, length: 30, overrides: {volume: 0.48}}
    ]
  })
}
```

The native clock owns both attacks. Keep the returned ID to stop only this cue.

## Playable xylophone

Continue in [the interaction recipes](recipes-interaction.md#playable-xylophone).

## Four-pad memory cues

Continue in [the interaction recipes](recipes-interaction.md#four-pad-memory-cues).

## Polyphony and layered chords

Continue in [the interaction recipes](recipes-interaction.md#polyphony-and-layered-chords).

## Expressive envelopes, filters and FM

Continue in [the interaction recipes](recipes-interaction.md#expressive-envelopes-filters-and-fm).

## Preset architecture for strict contracts

Continue in [the interaction recipes](recipes-interaction.md#preset-architecture-for-strict-contracts).

## Recipe verification checklist

Before returning or shipping a variation:

- use at most one pitch source for a tone (omission uses the documented default)
  and exactly one pitch array for a chord;
- use exactly one MIDI `notes` array, `frequencies` array or `rest: true` per native sequence step, including noise;
- keep `duration` as the onset interval and `length` as the release onset; both use the sequence time unit;
- verify `attack < duration`, `release <= duration - attack` and `attack + decay <= duration` for timed tones/chords; sequence ADSR remains in milliseconds and has no interval budget;
- give `sustain` below 1 a `decay`, give filter fields a `filterType`, and give
  FM a sine carrier and a depth;
- keep all numbers finite and integer-only fields integral;
- use `WAVE` constants, not copied numeric waveform values;
- check Boolean acceptance and positive sequence IDs at important control boundaries;
- size `maxVoices` for the largest real overlap, including release tails;
- cancel app-owned timers before `stopAll()` or `shutdown()`;
- audition on the intended phone speaker as well as headphones.
