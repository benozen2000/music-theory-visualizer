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

// Available modes/scales with brightness order, adjective, and genre
export const SCALE_MODES = [
  { value: 'major', label: 'Ionian (Major)', brightness: '2nd brightest', adjective: 'Happy, stable', genre: 'Pop, Classical, Folk' },
  { value: 'dorian', label: 'Dorian', brightness: '4th brightest', adjective: 'Soulful, hopeful', genre: 'Jazz, Funk, R&B' },
  { value: 'phrygian', label: 'Phrygian', brightness: '2nd darkest', adjective: 'Tense, aggressive', genre: 'Metal, Flamenco-adjacent' },
  { value: 'lydian', label: 'Lydian', brightness: 'Brightest', adjective: 'Dreamy, ethereal', genre: 'Film scores, Art rock' },
  { value: 'mixolydian', label: 'Mixolydian', brightness: '3rd brightest', adjective: 'Laid-back, groovy', genre: 'Classic rock, Blues' },
  { value: 'minor', label: 'Aeolian (Minor)', brightness: '3rd darkest', adjective: 'Sad, introspective', genre: 'Pop, Rock, Classical' },
  { value: 'locrian', label: 'Locrian', brightness: 'Darkest', adjective: 'Unstable, dissonant', genre: 'Metal, Experimental' },
  { value: 'harmonic minor', label: 'Harmonic Minor', brightness: 'Dark with tension', adjective: 'Dramatic, exotic', genre: 'Classical, Neoclassical metal' },
  { value: 'melodic minor', label: 'Melodic Minor', brightness: 'Minor-major hybrid', adjective: 'Sophisticated, bittersweet', genre: 'Jazz, Fusion' },
  { value: 'major pentatonic', label: 'Major Pentatonic', brightness: 'Bright (5-note)', adjective: 'Simple, cheerful', genre: 'Country, Folk, Pop' },
  { value: 'minor pentatonic', label: 'Minor Pentatonic', brightness: 'Dark (5-note)', adjective: 'Raw, soulful', genre: 'Blues, Rock' },
] as const

// Available chord types with mood descriptors
export const CHORD_TYPES = [
  // Triads
  { value: 'M', label: 'Major', mood: 'Happy, stable, resolved' },
  { value: 'm', label: 'Minor', mood: 'Sad, dark, somber' },
  { value: 'dim', label: 'Diminished', mood: 'Tense, anxious, spooky' },
  { value: 'aug', label: 'Augmented', mood: 'Mysterious, unsettled, dreamlike' },
  { value: 'sus2', label: 'Sus2', mood: 'Open, airy, modern' },
  { value: 'sus4', label: 'Sus4', mood: 'Anticipating, folk, unresolved' },
  // 6th Chords
  { value: '6', label: 'Major 6', mood: 'Jazzy, nostalgic, warm' },
  { value: 'm6', label: 'Minor 6', mood: 'Film noir, mysterious, sophisticated' },
  // 7th Chords
  { value: 'M7', label: 'Major 7', mood: 'Dreamy, lush, romantic' },
  { value: 'm7', label: 'Minor 7', mood: 'Smooth, mellow, chill' },
  { value: '7', label: 'Dominant 7', mood: 'Bluesy, tension, wants to resolve' },
  { value: 'dim7', label: 'Diminished 7', mood: 'Dramatic, suspenseful, eerie' },
  { value: 'm7b5', label: 'Half-Dim 7 (m7b5)', mood: 'Jazzy, longing, bittersweet' },
  // 9th Chords
  { value: '9', label: 'Dominant 9', mood: 'Funky, groovy, soulful' },
  { value: 'M9', label: 'Major 9', mood: 'Lush, neo-soul, expansive' },
  { value: 'm9', label: 'Minor 9', mood: 'Smooth jazz, contemplative' },
  { value: 'add9', label: 'Add 9', mood: 'Bright, shimmering, pop' },
  { value: 'madd9', label: 'Minor Add 9', mood: 'Emotional, introspective, cinematic' },
  // 11th Chords
  { value: '11', label: 'Dominant 11', mood: 'Complex, funky, fusion' },
  { value: 'M11', label: 'Major 11', mood: 'Ethereal, cinematic, ambient' },
  { value: 'm11', label: 'Minor 11', mood: 'Deep, contemplative, atmospheric' },
  { value: 'add11', label: 'Add 11', mood: 'Suspended, folk, spacious' },
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
// Instrument types
export type InstrumentType = 'guitar' | 'bass'

// Guitar tuning presets
export const GUITAR_TUNING_PRESETS: Record<string, { label: string; tuning: StringTuning[] }> = {
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

// Bass tuning presets
export const BASS_TUNING_PRESETS: Record<string, { label: string; tuning: StringTuning[] }> = {
  standard4: {
    label: '4-String Standard (E-A-D-G)',
    tuning: [
      { note: 'E', octave: 1 },
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
    ],
  },
  standard5: {
    label: '5-String Standard (B-E-A-D-G)',
    tuning: [
      { note: 'B', octave: 0 },
      { note: 'E', octave: 1 },
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
    ],
  },
  standard6: {
    label: '6-String Standard (B-E-A-D-G-C)',
    tuning: [
      { note: 'B', octave: 0 },
      { note: 'E', octave: 1 },
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
      { note: 'C', octave: 3 },
    ],
  },
  dropD4: {
    label: '4-String Drop D (D-A-D-G)',
    tuning: [
      { note: 'D', octave: 1 },
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
    ],
  },
  dropA5: {
    label: '5-String Drop A (A-E-A-D-G)',
    tuning: [
      { note: 'A', octave: 0 },
      { note: 'E', octave: 1 },
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
    ],
  },
  halfStepDown4: {
    label: '4-String Half Step Down (Eb-Ab-Db-Gb)',
    tuning: [
      { note: 'Eb', octave: 1 },
      { note: 'Ab', octave: 1 },
      { note: 'Db', octave: 2 },
      { note: 'Gb', octave: 2 },
    ],
  },
  fullStepDown4: {
    label: '4-String Full Step Down (D-G-C-F)',
    tuning: [
      { note: 'D', octave: 1 },
      { note: 'G', octave: 1 },
      { note: 'C', octave: 2 },
      { note: 'F', octave: 2 },
    ],
  },
  tenor4: {
    label: '4-String Tenor (A-D-G-C)',
    tuning: [
      { note: 'A', octave: 1 },
      { note: 'D', octave: 2 },
      { note: 'G', octave: 2 },
      { note: 'C', octave: 3 },
    ],
  },
}

// Default bass tuning (4-string standard)
export const BASS_TUNING: StringTuning[] = BASS_TUNING_PRESETS.standard4.tuning

// Combined presets for backward compatibility - maps to guitar presets
export const TUNING_PRESETS = GUITAR_TUNING_PRESETS

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

// Relative minors for the Circle of Fifths (parallel to major keys)
// Each position in the circle has a relative minor 3 semitones below
export const RELATIVE_MINORS_FLATS = [
  'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'
] as const

export const RELATIVE_MINORS_SHARPS = [
  'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'E#m', 'B#m', 'F##m', 'Dm'
] as const

// Get the relative minor for a major key
export function getRelativeMinor(majorKey: string, useSharps: boolean = false): string {
  const circleFlats = CIRCLE_OF_FIFTHS_FLATS
  const circleSharps = CIRCLE_OF_FIFTHS_SHARPS
  const minorsFlats = RELATIVE_MINORS_FLATS
  const minorsSharps = RELATIVE_MINORS_SHARPS

  // Find the index in either circle
  let index = circleFlats.findIndex(n => areSameNote(n, majorKey))
  if (index === -1) {
    index = circleSharps.findIndex(n => areSameNote(n, majorKey))
  }

  if (index === -1) return 'Am' // fallback

  return useSharps ? minorsSharps[index] : minorsFlats[index]
}
