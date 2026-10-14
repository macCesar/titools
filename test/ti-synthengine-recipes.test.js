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
      const attack = step.attack ?? pattern.attack;
      const release = step.release ?? pattern.release;
      assert.ok(Number.isInteger(attack) && attack >= 0 && attack < step.duration);
      assert.ok(Number.isInteger(release) && release >= 0 && release <= step.duration - attack);
      notes.push({ at: time, duration: step.duration, frequency: step.frequency });
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
        playPattern(options) {
          patterns.push(JSON.parse(JSON.stringify(options)));
          return true;
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

it('closing the pulse owner cancels its timer and guards an already queued callback', () => {
  const pending = new Map();
  const listeners = new Map();
  const chords = [];
  let nextId = 0;
  let stops = 0;
  let shutdowns = 0;
  const sandbox = context({
    playChord(options) { chords.push(options); return true; },
    stopAll() { stops++; },
    shutdown() { shutdowns++; },
  }, {
    setTimeout(callback, delay) {
      const id = ++nextId;
      pending.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) { pending.delete(id); },
    win: { addEventListener(event, callback) { listeners.set(event, callback); } },
  });
  vm.runInContext([
    snippet('Convert MIDI pitch to hertz'),
    snippet('Build a wide layered chord'),
    snippet('Clean reference versus overlap stress'),
    snippet('Cancellable repetition'),
    'startChordPulse()',
  ].join('\n'), sandbox);
  assert.equal(chords.length, 1);
  assert.equal(stops, 1);
  assert.equal(pending.size, 1);
  const queued = [...pending.values()][0];
  assert.equal(queued.delay, 260);
  assert.equal(chords[0].duration, 180);

  listeners.get('close')();
  assert.equal(pending.size, 0);
  assert.equal(stops, 2);
  assert.equal(shutdowns, 1);
  queued.callback();
  assert.equal(chords.length, 1);
  assert.equal(pending.size, 0);
});
