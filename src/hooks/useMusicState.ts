import { useState, useMemo } from 'react'
import {
  getScaleNotes,
  getChordNotes,
  getScaleDegrees,
  GUITAR_TUNING_PRESETS,
  BASS_TUNING_PRESETS,
  GUITAR_TUNING,
  BASS_TUNING,
  type StringTuning,
  type InstrumentType,
} from '@/lib/music-theory'

export type ViewMode = 'scale' | 'chord'
export type AccidentalMode = 'flats' | 'sharps'

export interface MusicState {
  instrument: InstrumentType
  tonic: string
  viewMode: ViewMode
  mode: string
  chordType: string
  inversion: number
  accidentalMode: AccidentalMode
  tuningPreset: string
  customTuning: StringTuning[]
}

export interface MusicStateActions {
  setInstrument: (instrument: InstrumentType) => void
  setTonic: (tonic: string) => void
  setViewMode: (mode: ViewMode) => void
  setMode: (mode: string) => void
  setChordType: (chordType: string) => void
  setInversion: (inversion: number) => void
  setAccidentalMode: (mode: AccidentalMode) => void
  setTuningPreset: (preset: string) => void
  setCustomTuning: (tuning: StringTuning[]) => void
}

export interface MusicStateComputed {
  activeNotes: string[]
  scaleDegrees: ReturnType<typeof getScaleDegrees>
  currentTuning: StringTuning[]
}

export function useMusicState() {
  // Default: Guitar, C Major chord
  const [instrument, setInstrumentState] = useState<InstrumentType>('guitar')
  const [tonic, setTonic] = useState('C')
  const [viewMode, setViewMode] = useState<ViewMode>('chord')
  const [mode, setMode] = useState('major')
  const [chordType, setChordType] = useState('M')
  const [inversion, setInversion] = useState(0)
  const [accidentalMode, setAccidentalMode] = useState<AccidentalMode>('flats')
  const [tuningPreset, setTuningPreset] = useState('standard')
  const [customTuning, setCustomTuning] = useState<StringTuning[]>(GUITAR_TUNING)

  // Handle instrument change - reset tuning preset and custom tuning
  const setInstrument = (newInstrument: InstrumentType) => {
    setInstrumentState(newInstrument)
    if (newInstrument === 'guitar') {
      setTuningPreset('standard')
      setCustomTuning(GUITAR_TUNING)
    } else {
      setTuningPreset('standard4')
      setCustomTuning(BASS_TUNING)
    }
  }

  // Compute active notes based on view mode
  const activeNotes = useMemo(() => {
    if (viewMode === 'scale') {
      return getScaleNotes(tonic, mode)
    } else {
      return getChordNotes(tonic, chordType, inversion)
    }
  }, [tonic, viewMode, mode, chordType, inversion])

  // Compute scale degrees for circle of fifths display
  const scaleDegrees = useMemo(() => {
    return getScaleDegrees(tonic, mode)
  }, [tonic, mode])

  // Get current tuning based on instrument, preset, or custom
  const currentTuning = useMemo(() => {
    if (tuningPreset === 'custom') {
      return customTuning
    }
    const presets = instrument === 'guitar' ? GUITAR_TUNING_PRESETS : BASS_TUNING_PRESETS
    const defaultTuning = instrument === 'guitar' ? GUITAR_TUNING : BASS_TUNING
    return presets[tuningPreset]?.tuning || defaultTuning
  }, [instrument, tuningPreset, customTuning])

  const state: MusicState = {
    instrument,
    tonic,
    viewMode,
    mode,
    chordType,
    inversion,
    accidentalMode,
    tuningPreset,
    customTuning,
  }

  const actions: MusicStateActions = {
    setInstrument,
    setTonic,
    setViewMode,
    setMode,
    setChordType,
    setInversion,
    setAccidentalMode,
    setTuningPreset,
    setCustomTuning,
  }

  const computed: MusicStateComputed = {
    activeNotes,
    scaleDegrees,
    currentTuning,
  }

  return { state, actions, computed }
}
