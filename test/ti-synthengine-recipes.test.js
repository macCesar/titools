import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import vm from 'node:vm';

const recipes = await readFile(new URL('../skills/ti-synthengine/references/recipes.md', import.meta.url), 'utf8');

function snippet(heading) {
  const section = recipes.split(`### ${heading}\n`)[1];
  assert.ok(section, `Missing recipe: ${heading}`);
  const code = section.split(/^#{2,3} /m)[0].match(/```javascript\n([\s\S]*?)```/);
  assert.ok(code, `Missing JavaScript: ${heading}`);
  return code[1];
}

function context(synth, extra = {}) {
  return vm.createContext({
    synth,
    WAVE: { SINE: 0, SQUARE: 1, SAWTOOTH: 2, TRIANGLE: 3, NOISE: 4 },
    ...extra,
  });
}

// These recipes deliberately specify every duration. This interprets their
// requested timeline, not the native scheduler or audio rendering.
function explicitTimeline(pattern) {
  let time = 0;
  const notes = [];
  for (const step of pattern.steps) {
    assert.ok(Number.isInteger(step.duration) && step.duration > 0);
    if (!step.rest) {
      const attack = step.overrides?.attack ?? pattern.voice.attack;
      const release = step.overrides?.release ?? pattern.voice.release;
      assert.ok(Number.isInteger(attack) && attack >= 0 && attack < step.duration);
      assert.ok(Number.isInteger(release) && release >= 0 && release <= step.duration - attack);
      notes.push({ at: time, duration: step.length + release, frequency: step.frequencies[0] });
    }
    time += step.duration;
  }
  return { notes, end: time };
}

describe('curated synth pattern rhythm', () => {
  const cases = [
    {
      heading: 'Three-note bonus cue',
      onsets: [0, 110, 220],
      durations: [95, 95, 130],
      pitches: [523.25, 587.33, 659.25],
      end: 350,
    },
    {
      heading: 'Fast four-note arpeggio',
      onsets: [0, 50, 100, 150],
      durations: [40, 40, 40, 80],
      pitches: [261.63, 329.63, 392, 523.25],
      end: 230,
    },
    {
      heading: 'Rapid score ticks',
      onsets: Array.from({ length: 10 }, (_, index) => index * 70),
      durations: Array(10).fill(60),
      pitches: Array(10).fill(1046.5),
      end: 700,
    },
    {
      heading: 'Alternating warning alarm',
      onsets: Array.from({ length: 10 }, (_, index) => index * 130),
      durations: Array(10).fill(120),
      pitches: Array.from({ length: 10 }, (_, index) => index % 2 === 0 ? 800 : 400),
      end: 1300,
    },
  ];

  for (const expected of cases) {
    it(`${expected.heading} preserves note spacing and fitted envelopes`, () => {
      const patterns = [];
      const sandbox = context({
        playSequence(options) {
          patterns.push(JSON.parse(JSON.stringify(options)));
          return patterns.length;
        },
      });
      vm.runInContext(snippet(expected.heading), sandbox);
      assert.equal(patterns.length, 1);
      const { notes, end } = explicitTimeline(patterns[0]);
      assert.deepEqual(notes.map((note) => note.at), expected.onsets);
      assert.deepEqual(notes.map((note) => note.duration), expected.durations);
      assert.deepEqual(notes.map((note) => note.frequency), expected.pitches);
      assert.equal(end, expected.end);
    });
  }
});

it('closing the native pulse owner stops only its accepted sequence and never schedules JS notes', () => {
  const listeners = new Map(), sequences = [], stopped = [];
  let shutdowns = 0;
  const sandbox = context({
    addEventListener(event, callback) { listeners.set(event, callback); },
    removeEventListener(event) { listeners.delete(event); },
    playSequence(options) { sequences.push(options); return 17; },
    stopSequence(options) { stopped.push(options.sequenceId); return true; },
    shutdown() { shutdowns++; },
  }, {
    setTimeout() { assert.fail('native pulse must not schedule JS notes'); },
    win: { addEventListener(event, callback) { listeners.set(event, callback); } },
  });
  vm.runInContext([
    snippet('Convert MIDI pitch to hertz'), snippet('Build a wide layered chord'),
    snippet('Clean reference versus overlap stress'), snippet('Cancellable repetition'),
    'startChordPulse()',
  ].join('\n'), sandbox);
  assert.equal(sequences.length, 1);
  assert.equal(sequences[0].timeUnit, 'ms');
  assert.equal(sequences[0].stepDuration, 260);
  assert.equal(sequences[0].steps[0].length + sequences[0].voice.release, 180);
  assert.equal(sequences[0].steps[0].frequencies.length, 4);
  assert.equal(sequences[0].loop, true);
  listeners.get('close')();
  assert.deepEqual(stopped, [17]);
  assert.equal(shutdowns, 1);
});

it('curated scheduling snippets use only the unified native sequence contract', () => {
  const snippets = Array.from(recipes.matchAll(/```javascript\n([\s\S]*?)```/g), match => match[1]).join('\n');
  assert.doesNotMatch(snippets, /\b(?:playPattern|startEngine|patternend|setTimeout)\b/);
  assert.match(snippets, /playSequence/);
  assert.match(snippets, /stopSequence\(\{sequenceId:/);
  assert.match(snippets, /event\.sequenceId !== cueSequenceId/);
});

it('restarting a curated pulse waits for native retirement and coalesces rapid requests', () => {
  const listeners = new Map(), sequences = [];
  let active = 0, serial = 0, stops = 0;
  const sandbox = context({
    addEventListener(event, callback) { listeners.set(event, callback); },
    removeEventListener(event) { listeners.delete(event); },
    playSequence(options) { if(active) return 0; sequences.push(options); active=++serial; return active; },
    stopSequence() { stops++; return true; }, shutdown() {},
  });
  vm.runInContext([snippet('Convert MIDI pitch to hertz'),snippet('Build a wide layered chord'),
    snippet('Clean reference versus overlap stress'),'startChordPulse();startChordPulse();startChordPulse()'].join('\n'),sandbox);
  assert.equal(sequences.length,1);assert.equal(stops,1);
  active=0;listeners.get('sequenceend')({sequenceId:1,reason:'stopped'});
  assert.equal(sequences.length,2);
});
