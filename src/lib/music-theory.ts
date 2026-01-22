import { Scale, Chord, Note, Midi } from 'tonal'

// Circle of Fifths order (clockwise from C)
// F# stays F# in both modes (Gb is rarely used)
export const CIRCLE_OF_FIFTHS_FLATS = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'
] as const

export const CIRCLE_OF_FIFTHS_SHARPS = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'
] as const

// Default export for backward compatibility
export const CIRCLE_OF_FIFTHS = CIRCLE_OF_FIFTHS_FLATS

// All chromatic notes for selectors
export const ALL_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const

// Available modes/scales
export const SCALE_MODES = [
  { value: 'major', label: 'Ionian (Major)' },
  { value: 'dorian', label: 'Dorian' },
  { value: 'phrygian', label: 'Phrygian' },
  { value: 'lydian', label: 'Lydian' },
  { value: 'mixolydian', label: 'Mixolydian' },
  { value: 'minor', label: 'Aeolian (Minor)' },
  { value: 'locrian', label: 'Locrian' },
  { value: 'harmonic minor', label: 'Harmonic Minor' },
  { value: 'melodic minor', label: 'Melodic Minor' },
  { value: 'major pentatonic', label: 'Major Pentatonic' },
  { value: 'minor pentatonic', label: 'Minor Pentatonic' },
] as const

// Available chord types
export const CHORD_TYPES = [
  // Triads
  { value: 'M', label: 'Major' },
  { value: 'm', label: 'Minor' },
  { value: 'dim', label: 'Diminished' },
  { value: 'aug', label: 'Augmented' },
  { value: 'sus2', label: 'Sus2' },
  { value: 'sus4', label: 'Sus4' },
  // 6th Chords
  { value: '6', label: 'Major 6' },
  { value: 'm6', label: 'Minor 6' },
  // 7th Chords
  { value: 'M7', label: 'Major 7' },
  { value: 'm7', label: 'Minor 7' },
  { value: '7', label: 'Dominant 7' },
  { value: 'dim7', label: 'Diminished 7' },
  { value: 'm7b5', label: 'Half-Dim 7 (m7b5)' },
  // 9th Chords
  { value: '9', label: 'Dominant 9' },
  { value: 'M9', label: 'Major 9' },
  { value: 'm9', label: 'Minor 9' },
  { value: 'add9', label: 'Add 9' },
  { value: 'madd9', label: 'Minor Add 9' },
  // 11th Chords
  { value: '11', label: 'Dominant 11' },
  { value: 'M11', label: 'Major 11' },
  { value: 'm11', label: 'Minor 11' },
  { value: 'add11', label: 'Add 11' },
] as const

// Guitar tuning type
export interface StringTuning {
  note: string
  octave: number
}

// Standard guitar tuning (low to high: E2, A2, D3, G3, B3, E4)
export const GUITAR_TUNING: StringTuning[] = [
  { note: 'E', octave: 2 },
  { note: 'A', octave: 2 },
  { note: 'D', octave: 3 },
  { note: 'G', octave: 3 },
  { note: 'B', octave: 3 },
  { note: 'E', octave: 4 },
]

// Preset tunings
export const TUNING_PRESETS: Record<string, { label: string; tuning: StringTuning[] }> = {
  standard: {
    label: 'Standard (E-A-D-G-B-E)',
    tuning: [
      { note: 'E', octave: 2 },
      { note: 'A', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'G', octave: 3 },
      { note: 'B', octave: 3 },
      { note: 'E', octave: 4 },
    ],
  },
  dropD: {
    label: 'Drop D (D-A-D-G-B-E)',
    tuning: [
      { note: 'D', octave: 2 },
      { note: 'A', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'G', octave: 3 },
      { note: 'B', octave: 3 },
      { note: 'E', octave: 4 },
    ],
  },
  dropC: {
    label: 'Drop C (C-G-C-F-A-D)',
    tuning: [
      { note: 'C', octave: 2 },
      { note: 'G', octave: 2 },
      { note: 'C', octave: 3 },
      { note: 'F', octave: 3 },
      { note: 'A', octave: 3 },
      { note: 'D', octave: 4 },
    ],
  },
  openG: {
    label: 'Open G (D-G-D-G-B-D)',
    tuning: [
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'G', octave: 3 },
      { note: 'B', octave: 3 },
      { note: 'D', octave: 4 },
    ],
  },
  openD: {
    label: 'Open D (D-A-D-F#-A-D)',
    tuning: [
      { note: 'D', octave: 2 },
      { note: 'A', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'F#', octave: 3 },
      { note: 'A', octave: 3 },
      { note: 'D', octave: 4 },
    ],
  },
  openE: {
    label: 'Open E (E-B-E-G#-B-E)',
    tuning: [
      { note: 'E', octave: 2 },
      { note: 'B', octave: 2 },
      { note: 'E', octave: 3 },
      { note: 'G#', octave: 3 },
      { note: 'B', octave: 3 },
      { note: 'E', octave: 4 },
    ],
  },
  dadgad: {
    label: 'DADGAD (D-A-D-G-A-D)',
    tuning: [
      { note: 'D', octave: 2 },
      { note: 'A', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'G', octave: 3 },
      { note: 'A', octave: 3 },
      { note: 'D', octave: 4 },
    ],
  },
  halfStepDown: {
    label: 'Half Step Down (Eb-Ab-Db-Gb-Bb-Eb)',
    tuning: [
      { note: 'Eb', octave: 2 },
      { note: 'Ab', octave: 2 },
      { note: 'Db', octave: 3 },
      { note: 'Gb', octave: 3 },
      { note: 'Bb', octave: 3 },
      { note: 'Eb', octave: 4 },
    ],
  },
  fullStepDown: {
    label: 'Full Step Down (D-G-C-F-A-D)',
    tuning: [
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
      { note: 'C', octave: 3 },
      { note: 'F', octave: 3 },
      { note: 'A', octave: 3 },
      { note: 'D', octave: 4 },
    ],
  },
}

export const FRET_COUNT = 15

// Roman numerals for scale degrees
export const ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

// Get pitch class (0-11) from a note name for enharmonic comparison
export function getPitchClass(note: string): number {
  const midi = Note.midi(note + '4') // Add octave for MIDI calculation
  if (midi === null) return -1
  return midi % 12
}

// Check if two notes are enharmonically equivalent
export function areSameNote(note1: string, note2: string): boolean {
  return getPitchClass(note1) === getPitchClass(note2)
}

// Get scale notes for a given tonic and mode
export function getScaleNotes(tonic: string, mode: string): string[] {
  const scale = Scale.get(`${tonic} ${mode}`)
  return scale.notes
}

// Get chord notes for a given root and type, with optional inversion
export function getChordNotes(root: string, chordType: string, inversion: number = 0): string[] {
  const chord = Chord.get(`${root}${chordType}`)
  let notes = [...chord.notes]

  // Apply inversion by rotating the array
  for (let i = 0; i < inversion && i < notes.length - 1; i++) {
    const first = notes.shift()
    if (first) notes.push(first)
  }

  return notes
}

// Check if a note is in the active notes (handles enharmonic equivalence)
export function isNoteActive(note: string, activeNotes: string[]): boolean {
  const pitchClass = getPitchClass(note)
  return activeNotes.some(activeNote => getPitchClass(activeNote) === pitchClass)
}

// Check if a note is the root note
export function isRootNote(note: string, root: string): boolean {
  return areSameNote(note, root)
}

// Generate all notes for the guitar fretboard
export interface FretboardNote {
  note: string      // Note name without octave (e.g., "C#")
  fullNote: string  // Note name with octave (e.g., "C#4")
  octave: number
  string: number    // 0-5 (low E to high E)
  fret: number      // 0-15 (0 = open string)
  midi: number
}

export function generateFretboardNotes(tuning: StringTuning[] = GUITAR_TUNING): FretboardNote[] {
  const notes: FretboardNote[] = []

  for (let string = 0; string < tuning.length; string++) {
    const openString = tuning[string]
    const openMidi = Note.midi(`${openString.note}${openString.octave}`)

    if (openMidi === null) continue

    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const midi = openMidi + fret
      const noteName = Midi.midiToNoteName(midi, { sharps: true })
      const pitchClass = Midi.midiToNoteName(midi, { sharps: true, pitchClass: true })
      const octave = Math.floor(midi / 12) - 1

      notes.push({
        note: pitchClass,
        fullNote: noteName,
        octave,
        string,
        fret,
        midi,
      })
    }
  }

  return notes
}

// Get scale degree info for Circle of Fifths
// Returns the chord quality and roman numeral for each scale degree
type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented'

export interface ScaleDegreeInfo {
  degree: number        // 1-7
  roman: string         // I, ii, iii, etc.
  quality: ChordQuality
  note: string          // The note at this degree
}

export function getScaleDegrees(tonic: string, mode: string): ScaleDegreeInfo[] {
  const scaleNotes = getScaleNotes(tonic, mode)

  // Quality patterns for different modes
  const qualityPatterns: Record<string, ChordQuality[]> = {
    'major': ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
    'dorian': ['minor', 'minor', 'major', 'major', 'minor', 'diminished', 'major'],
    'phrygian': ['minor', 'major', 'major', 'minor', 'diminished', 'major', 'minor'],
    'lydian': ['major', 'major', 'minor', 'diminished', 'major', 'minor', 'minor'],
    'mixolydian': ['major', 'minor', 'diminished', 'major', 'minor', 'minor', 'major'],
    'minor': ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
    'locrian': ['diminished', 'major', 'minor', 'minor', 'major', 'major', 'minor'],
    'harmonic minor': ['minor', 'diminished', 'augmented', 'minor', 'major', 'major', 'diminished'],
    'melodic minor': ['minor', 'minor', 'augmented', 'major', 'major', 'diminished', 'diminished'],
  }

  const qualities = qualityPatterns[mode] || qualityPatterns['major']
  const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

  // Adjust roman numerals based on quality
  const adjustedRomans = qualities.map((quality, i) => {
    const base = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i]
    if (quality === 'minor') return base.toLowerCase()
    if (quality === 'diminished') return base.toLowerCase() + '°'
    return base
  })

  return scaleNotes.slice(0, 7).map((note, i) => ({
    degree: i + 1,
    roman: adjustedRomans[i] || romanNumerals[i],
    quality: qualities[i] || 'major',
    note,
  }))
}

// Get the index of a note in the circle of fifths
export function getCircleIndex(note: string): number {
  return CIRCLE_OF_FIFTHS.findIndex(n => areSameNote(n, note))
}

// Check if a circle position is "in scale"
export function isInScale(circleNote: string, scaleNotes: string[]): boolean {
  return scaleNotes.some(scaleNote => areSameNote(circleNote, scaleNote))
}
