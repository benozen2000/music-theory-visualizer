import { useState } from 'react'
import { Scale, Music, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ALL_NOTES, SCALE_MODES, CHORD_TYPES, TUNING_PRESETS } from '@/lib/music-theory'
import type { MusicState, MusicStateActions } from '@/hooks/useMusicState'

interface ConfigPanelProps {
  state: MusicState
  actions: MusicStateActions
}

const INVERSIONS = [
  { value: 0, label: 'Root' },
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
]

const TUNING_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const OCTAVES = [1, 2, 3, 4, 5]

export function ConfigPanel({ state, actions }: ConfigPanelProps) {
  const { tonic, viewMode, mode, chordType, inversion, accidentalMode, tuningPreset, customTuning } = state
  const { setTonic, setViewMode, setMode, setChordType, setInversion, setAccidentalMode, setTuningPreset, setCustomTuning } = actions

  const [showTuning, setShowTuning] = useState(false)

  const handleCustomTuningChange = (stringIndex: number, field: 'note' | 'octave', value: string | number) => {
    const newTuning = [...customTuning]
    if (field === 'note') {
      newTuning[stringIndex] = { ...newTuning[stringIndex], note: value as string }
    } else {
      newTuning[stringIndex] = { ...newTuning[stringIndex], octave: value as number }
    }
    setCustomTuning(newTuning)
  }

  return (
    <div className="bg-surface rounded-xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary">Configuration</h2>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-muted mb-2">
          View Mode
        </label>
        <div className="flex bg-background rounded-lg p-1">
          <button
            onClick={() => setViewMode('scale')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              viewMode === 'scale'
                ? 'bg-surface-hover text-text'
                : 'text-text-muted hover:text-text'
            )}
          >
            <Scale className="w-4 h-4" />
            Scale
          </button>
          <button
            onClick={() => setViewMode('chord')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              viewMode === 'chord'
                ? 'bg-surface-hover text-text'
                : 'text-text-muted hover:text-text'
            )}
          >
            <Music className="w-4 h-4" />
            Chord
          </button>
        </div>
      </div>

      {/* Accidental Mode Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-muted mb-2">
          Accidentals
        </label>
        <div className="flex bg-background rounded-lg p-1">
          <button
            onClick={() => setAccidentalMode('flats')}
            className={cn(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              accidentalMode === 'flats'
                ? 'bg-surface-hover text-text'
                : 'text-text-muted hover:text-text'
            )}
          >
            Flats (b)
          </button>
          <button
            onClick={() => setAccidentalMode('sharps')}
            className={cn(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              accidentalMode === 'sharps'
                ? 'bg-surface-hover text-text'
                : 'text-text-muted hover:text-text'
            )}
          >
            Sharps (#)
          </button>
        </div>
      </div>

      {/* Root Note Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-muted mb-2">
          Root Note
        </label>
        <select
          value={tonic}
          onChange={(e) => setTonic(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {ALL_NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </div>

      {/* Mode / Chord Type Selector */}
      {viewMode === 'scale' ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Mode / Scale
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SCALE_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Chord Type
          </label>
          <select
            value={chordType}
            onChange={(e) => setChordType(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CHORD_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Inversion Slider (Chord Mode only) */}
      {viewMode === 'chord' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-muted">
              Inversion
            </label>
            <span className="text-sm text-text">
              {INVERSIONS[inversion]?.label || 'Root'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            value={inversion}
            onChange={(e) => setInversion(Number(e.target.value))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            {INVERSIONS.map((inv) => (
              <span key={inv.value}>{inv.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tuning Section */}
      <div className="border-t border-border pt-4 mt-4">
        <button
          onClick={() => setShowTuning(!showTuning)}
          className="flex items-center justify-between w-full text-sm font-medium text-text-muted hover:text-text transition-colors"
        >
          <span>Guitar Tuning</span>
          {showTuning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTuning && (
          <div className="mt-4 space-y-4">
            {/* Tuning Preset Selector */}
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Preset
              </label>
              <select
                value={tuningPreset}
                onChange={(e) => setTuningPreset(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.entries(TUNING_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Custom Tuning Inputs */}
            {tuningPreset === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Custom Tuning (Low to High)
                </label>
                <div className="space-y-2">
                  {customTuning.map((string, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-text-muted w-4">{index + 1}</span>
                      <select
                        value={string.note}
                        onChange={(e) => handleCustomTuningChange(index, 'note', e.target.value)}
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {TUNING_NOTES.map((note) => (
                          <option key={note} value={note}>
                            {note}
                          </option>
                        ))}
                      </select>
                      <select
                        value={string.octave}
                        onChange={(e) => handleCustomTuningChange(index, 'octave', Number(e.target.value))}
                        className="w-16 bg-background border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {OCTAVES.map((oct) => (
                          <option key={oct} value={oct}>
                            {oct}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
