/** TiSynthEngine local 1.1.0 candidate, public API 1.1.0. */
declare namespace synth {
  type Bus = 'music' | 'effects' | 'ui' | 'ambience';
  type FilterType = 'none' | 'lowpass' | 'highpass' | 'bandpass';
  type Range = [number, number];
  interface Variation {
    amount?: number;
    seed?: number;
    ranges?: Partial<Record<'volume' | 'filterHz' | 'filterQ' | 'fmDepth' |
      'noiseRate' | 'lowPassHz' | 'pulseWidth' | 'pitchCents', Range>>;
  }
  interface VoiceOptions {
    attack?: number; decay?: number; sustain?: number; release?: number;
    volume?: number; waveType?: number; pan?: number;
    lfoFreq?: number; lfoDepth?: number; noiseRate?: number; lowPassHz?: number;
    pulseWidth?: number; waveTable?: number[]; bitDepth?: number;
    filterType?: FilterType; filterHz?: number; filterQ?: number;
    fmRatio?: number; fmDepth?: number; spatialX?: number; spatialY?: number;
    bus?: Bus; effectSend?: number; priority?: number; variation?: Variation;
  }
  type Pitch = { note?: string; frequency?: never } | { frequency?: number; note?: never };
  interface FiniteOptions extends VoiceOptions {
    duration?: number; panEnd?: number; frequencyEnd?: number;
    noiseRateEnd?: number; pulseWidthEnd?: number; filterHzEnd?: number;
    fmDepthEnd?: number; detune?: number;
  }
  type ToneOptions = FiniteOptions & Pitch;
  type RepeatingToneOptions = ToneOptions & { intervalMs: number };
  /** Partial changes merge with the latest accepted recipe; never retriggers immediately. */
  type ToneUpdate = Partial<FiniteOptions> & Pitch & { toneId: number; intervalMs?: number };
  interface Modulation {
    target: 'filterHz' | 'pulseWidth' | 'fmDepth';
    wave?: 'sine' | 'triangle'; rate?: number; sync?: string; depth?: number;
  }
  type NoteOptions = VoiceOptions & Pitch & { voiceId: number; detune?: number; modulations?: Modulation[] };
  type NoteUpdate = Pick<VoiceOptions, 'volume' | 'pan' | 'lfoFreq' | 'lfoDepth' |
    'noiseRate' | 'lowPassHz' | 'pulseWidth' | 'filterHz' | 'filterQ' |
    'fmRatio' | 'fmDepth' | 'spatialX' | 'spatialY' | 'effectSend'> & Pitch &
    { voiceId: number; modulations?: Modulation[] };
  type ChordOptions = VoiceOptions & { duration?: number; detune?: number;
    detunes?: number[]; pans?: number[]; panSpread?: number } &
    ({ notes: string[]; frequencies?: never } | { frequencies: number[]; notes?: never });
  interface StartOptions {
    maxVoices?: number; maxSequences?: number;
    mixingProfile?: 'conservative' | 'raw' | 'balanced' | 'speakerSafe';
    audioSession?: 'playback' | 'ambient';
  }
  interface Defaults {
    apiVersion: '1.1.0';
    capabilities: { variation: true; toneRepetition: true; [key: string]: boolean };
    variationSchemaVersion: 1;
    limits: Record<string, { min: number; max: number }>;
    defaults: Record<string, unknown>;
    waveTypes: Record<'SINE' | 'SQUARE' | 'SAWTOOTH' | 'TRIANGLE' | 'NOISE' | 'WAVETABLE', number>;
    mixingProfiles: string[]; audioSessions: string[]; buses: Bus[]; filterTypes: FilterType[];
  }
  interface SequenceVoice extends Omit<FiniteOptions, 'duration' | 'detune'> { modulations?: Modulation[] }
  type SequenceStep = { duration?: number; length?: number; gate?: number;
    overrides?: SequenceVoice; bus?: Bus; effectSend?: number; priority?: number } &
    ({ notes: number[]; frequencies?: never; rest?: never } |
    { frequencies: number[]; notes?: never; rest?: never } |
    { rest: true; notes?: never; frequencies?: never });
  interface SequenceOptions {
    timeUnit?: 'beats' | 'ms'; stepDuration?: number; gate?: number; loop?: boolean;
    swing?: number; mode?: 'normal' | 'up' | 'down' | 'updown'; tuning?: number;
    detune?: number; voice?: SequenceVoice; steps: SequenceStep[];
    bus?: Bus; effectSend?: number; priority?: number;
  }
  interface SequenceState {
    sequenceId: number; playing: boolean; step: number; beat: number;
    position: number; bpm: number; revision: number;
  }
  function getDefaults(): Defaults;
  function start(options?: StartOptions): boolean;
  /** One finite attack. intervalMs is rejected; use repeatTone for repetition. */
  function playTone(options: ToneOptions & { intervalMs?: never }): boolean;
  /** Integer 1-60000 ms: positive module-owned ID, or 0 on rejection. */
  function repeatTone(options: RepeatingToneOptions): number;
  function updateTone(options: ToneUpdate): boolean;
  /** Cancels future attacks at the next block; admitted attacks finish. */
  function stopTone(options: { toneId: number }): boolean;
  function playChord(options: ChordOptions): boolean;
  function noteOn(options: NoteOptions): boolean;
  function updateNote(options: NoteUpdate): boolean;
  /** @deprecated Use updateNote; identical behavior and voiceId contract. */
  function updateVoice(options: NoteUpdate): boolean;
  function noteOff(options: { voiceId: number }): boolean;
  function playSequence(options: SequenceOptions): number;
  function updateSequence(options: Partial<Omit<SequenceOptions, 'timeUnit'>> & { sequenceId: number }): boolean;
  function stopSequence(options: { sequenceId: number }): boolean;
  function getSequenceState(options: { sequenceId: number }): SequenceState | null;
  function setTempo(options: { bpm: number }): boolean;
  function setVolume(options: { volume: number }): boolean;
  function setMasterProcessing(options: Record<string, unknown>): boolean;
  function enableStats(): boolean;
  function disableStats(): boolean;
  /** @deprecated Use enableStats or disableStats; identical diagnostic behavior. */
  function setStatsEnabled(enabled: boolean): boolean;
  function getStats(): Record<string, number | boolean | string | null>;
  function resetStats(): void;
  function stopAll(): void;
  function shutdown(): void;
  function addEventListener(name: 'sequenceend', listener: (event: { sequenceId: number; reason: 'completed' | 'stopped' }) => void): void;
  function removeEventListener(name: 'sequenceend', listener: (event: { sequenceId: number; reason: 'completed' | 'stopped' }) => void): void;
}
export = synth;
