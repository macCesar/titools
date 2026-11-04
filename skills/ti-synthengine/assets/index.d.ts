/** TiSynthEngine 2.0.0 candidate. One module version for the entire public interface. */
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
    version: string;
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
  /** Numbers are MIDI notes 12..119; strings are native note names. */
  type Notes = string[] | number[];
  type SoundType = 'tone' | 'chord' | 'repeat' | 'pattern' | 'held';
  type ModernPitch = { notes?: Notes; frequencies?: never } | { frequencies?: number[]; notes?: never };
  /** Shared allowlist; each interpretation also validates source-specific compatibility. */
  interface SoundProperties extends VoiceOptions {
    detune?: number; panEnd?: number; noiseRateEnd?: number; pulseWidthEnd?: number;
    filterHzEnd?: number; fmDepthEnd?: number; detunes?: number[]; pans?: number[];
    panSpread?: number; modulations?: Modulation[];
  }
  type TonePlayback = ModernPitch & { type?: 'tone'; duration?: number; frequencyEnd?: number };
  type ChordPlayback = ({ notes: Notes; frequencies?: never } | { frequencies: number[]; notes?: never }) & { type: 'chord'; duration?: number };
  type RepeatPlayback = ModernPitch & { type: 'repeat'; duration?: number; frequencyEnd?: number; interval: number };
  type HeldPlayback = ModernPitch & { type: 'held' };
  type PatternStep = { interval?: number; length?: number; gate?: number;
    sound?: SoundProperties & { frequencyEnd?: number } } &
    ({ notes: Notes; frequencies?: never; rest?: never } |
    { frequencies: number[]; notes?: never; rest?: never } |
    { rest: true; notes?: never; frequencies?: never });
  interface PatternPlayback {
    type?: 'pattern'; timeUnit?: 'beats' | 'ms'; interval?: number; gate?: number;
    loop?: boolean; swing?: number; mode?: 'normal' | 'up' | 'down' | 'updown';
    tuning?: number; frequencyEnd?: number; steps: PatternStep[];
  }
  type SoundPlayback = TonePlayback | ChordPlayback | RepeatPlayback | PatternPlayback | HeldPlayback;
  interface SoundPreset { name?: string; sound?: SoundProperties; playback?: SoundPlayback }
  /** Objects merge recursively; arrays replace. Null removes a leaf if the resulting preset is valid. */
  type PresetPatch<T> = T extends unknown[] ? T | null : T extends object ?
    { [K in keyof T]?: PresetPatch<T[K]> } : T | null;
  interface SoundChanges {
    name?: string;
    sound?: PresetPatch<SoundProperties>;
    playback?: PresetPatch<SoundPlayback>;
  }
  /** Execution overrides are flat, unlike the stored sound/playback definition. */
  type RepeatChanges = PresetPatch<SoundProperties> & ModernPitch & {
    type?: 'repeat'; duration?: number | null; frequencyEnd?: number | null; interval?: number;
  };
  type PatternChanges = PresetPatch<SoundProperties> & PresetPatch<Partial<PatternPlayback>>;
  type SoundOverrides = SoundProperties & (TonePlayback | Partial<ChordPlayback> | HeldPlayback |
    (ModernPitch & { type?: 'repeat'; duration?: number; frequencyEnd?: number; interval?: number }) |
    Partial<PatternPlayback>);
  type NoteChanges = Pick<VoiceOptions, 'volume' | 'pan' | 'lfoFreq' | 'lfoDepth' |
    'noiseRate' | 'lowPassHz' | 'pulseWidth' | 'filterHz' | 'filterQ' | 'fmRatio' |
    'fmDepth' | 'spatialX' | 'spatialY' | 'effectSend'> & ModernPitch & { modulations?: Modulation[] };
  interface Note {
    /** Ramps compatible live fields without retriggering. Attack-only fields are rejected. */
    update(changes: NoteChanges): boolean;
    /** Begins this note's release; false after release, shutdown or invalidation. */
    noteOff(): boolean;
  }
  interface RepeatingPlaybackControl {
    /** Applies at the next scheduled attack without moving its existing deadline. */
    update(changes: RepeatChanges): boolean;
    /** Cancels future attacks; already sounding finite attacks finish. */
    stop(): boolean;
  }
  type PatternState = Omit<SequenceState, 'sequenceId'>;
  interface PatternEndEvent { reason: 'completed' | 'stopped' }
  interface PatternPlaybackControl {
    update(changes: PatternChanges): boolean;
    stop(): boolean;
    getState(): PatternState | null;
    /** Transport retirement, not a promise of audible silence. No native ID is exposed. */
    addEventListener(name: 'end', listener: (event: PatternEndEvent) => void): void;
    removeEventListener(name: 'end', listener: (event: PatternEndEvent) => void): void;
  }
  type PlaybackResult = boolean | Note | RepeatingPlaybackControl | PatternPlaybackControl;
  interface Sound {
    getPreset(): SoundPreset;
    /** Validates before replacing the stored definition; affects future executions only. */
    set(changes: SoundChanges): void;
    play(changes: SoundOverrides & { type: 'held' }): Note | false;
    play(changes: SoundOverrides & { type: 'pattern' }): PatternPlaybackControl | false;
    play(changes: SoundOverrides & { type: 'repeat' }): RepeatingPlaybackControl | false;
    play(changes: SoundOverrides & { type: 'tone' | 'chord' }): boolean;
    /** The stored type can change through set(), so an omitted type has a mixed return. */
    play(changes?: SoundOverrides): PlaybackResult;
    noteOn(changes?: SoundProperties & ModernPitch): Note | false;
  }
  interface Contract extends Defaults {
    capabilities: Defaults['capabilities'] & { soundObjects: true };
    interpretations: SoundType[];
    units: { envelope: 'ms'; duration: 'msIncludingRelease'; repetitionInterval: 'ms'; pattern: ('beats' | 'ms')[] };
    soundProperties: (keyof SoundProperties)[];
    playbackProperties: string[];
  }
  type Sync = 'off' | 'quarter' | 'eighth' | 'sixteenth' | 'quarterTriplet' | 'eighthTriplet' | 'sixteenthTriplet';
  interface ProcessingOptions {
    inputGain?: number; applyTo?: Bus[];
    chorus?: { enabled?: boolean; rate?: number; depth?: number; mix?: number };
    /** time is milliseconds; timeMs is a deprecated exclusive input spelling. */
    delay?: { enabled?: boolean; sync?: Sync; feedback?: number; mix?: number } &
      ({ time?: number; timeMs?: never } | { time?: never; timeMs?: number });
    /** decay is milliseconds (200..8000), unlike setMasterProcessing's seconds. */
    reverb?: { enabled?: boolean; decay?: number; damping?: number; mix?: number };
    saturation?: { enabled?: boolean; drive?: number; mix?: number };
  }
  function createSound(preset: SoundPreset): Sound;
  function getContract(): Contract;
  /** Strict configuration errors throw; operational rejection returns false. */
  function setProcessing(options: ProcessingOptions): boolean;
  /** Installed module version, native defaults, limits and capabilities. */
  function getDefaults(): Defaults;
  function start(options?: StartOptions): boolean;
  /** One finite attack. intervalMs is rejected; use repeatTone for repetition. */
  /** @deprecated Use createSound(...).play(). The existing signature and behavior remain supported. */
  function playTone(options: ToneOptions & { intervalMs?: never }): boolean;
  /** Integer 1-60000 ms: positive module-owned ID, or 0 on rejection. */
  /** @deprecated Use a Sound with playback.type repeat and its playback control. The existing signature and behavior remain supported. */
  function repeatTone(options: RepeatingToneOptions): number;
  /** @deprecated Use the repetition control update(). The existing signature and behavior remain supported. */
  function updateTone(options: ToneUpdate): boolean;
  /** Cancels future attacks at the next block; admitted attacks finish. */
  /** @deprecated Use the repetition control stop(). The existing signature and behavior remain supported. */
  function stopTone(options: { toneId: number }): boolean;
  /** @deprecated Use a Sound with playback.type chord. The existing signature and behavior remain supported. */
  function playChord(options: ChordOptions): boolean;
  /** @deprecated Use Sound.noteOn() or a Sound with playback.type held. The existing signature and behavior remain supported. */
  function noteOn(options: NoteOptions): boolean;
  /** @deprecated Use Note.update(). The existing signature and behavior remain supported. */
  function updateNote(options: NoteUpdate): boolean;
  /** @deprecated Use updateNote; identical behavior and voiceId contract. */
  function updateVoice(options: NoteUpdate): boolean;
  /** @deprecated Use Note.noteOff(). The existing signature and behavior remain supported. */
  function noteOff(options: { voiceId: number }): boolean;
  /** @deprecated Use a Sound with playback.type pattern. The existing signature and behavior remain supported. */
  function playSequence(options: SequenceOptions): number;
  /** @deprecated Use the pattern control update(). The existing signature and behavior remain supported. */
  function updateSequence(options: Partial<Omit<SequenceOptions, 'timeUnit'>> & { sequenceId: number }): boolean;
  /** @deprecated Use the pattern control stop(). The existing signature and behavior remain supported. */
  function stopSequence(options: { sequenceId: number }): boolean;
  /** @deprecated Use the pattern control getState(). The existing signature and behavior remain supported. */
  function getSequenceState(options: { sequenceId: number }): SequenceState | null;
  function setTempo(bpm: number): boolean;
  /** @deprecated Use setTempo(bpm); the dictionary signature remains supported. */
  function setTempo(options: { bpm: number }): boolean;
  function setVolume(volume: number): boolean;
  /** @deprecated Use setVolume(volume); the dictionary signature remains supported. */
  function setVolume(options: { volume: number }): boolean;
  /** @deprecated Use setProcessing(); its reverb decay unit is milliseconds. The existing signature and behavior remain supported. */
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
