import { useState } from 'react'
import { Chord, Scale } from 'tonal'
import { useMusicState } from '@/hooks/useMusicState'
import { CircleOfFifths } from '@/components/CircleOfFifths'
import { GuitarFretboard } from '@/components/GuitarFretboard'
import { ConfigPanel } from '@/components/ConfigPanel'
import { ChordScaleFinder } from '@/components/ChordScaleFinder'

function App() {
  const { state, actions, computed } = useMusicState()

  // Chord/Scale finder state
  const [finderMode, setFinderMode] = useState<'off' | 'chord' | 'scale'>('off')
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [showAllNotes, setShowAllNotes] = useState(false)

  // Toggle note selection on fretboard
  const handleNoteSelect = (note: string) => {
    if (finderMode === 'off') return

    setSelectedNotes(prev => {
      if (prev.includes(note)) {
        return prev.filter(n => n !== note)
      }
      return [...prev, note]
    })
  }

  // Clear selected notes
  const clearSelectedNotes = () => {
    setSelectedNotes([])
  }

  // Detect chord from selected notes
  const detectedChords = selectedNotes.length >= 2
    ? Chord.detect(selectedNotes)
    : []

  // Detect scales from selected notes
  const detectedScales = selectedNotes.length >= 3
    ? Scale.detect(selectedNotes).slice(0, 8)
    : []

  // Determine which notes to highlight on fretboard
  const fretboardNotes = finderMode !== 'off'
    ? selectedNotes
    : computed.activeNotes

  const fretboardTonic = finderMode !== 'off'
    ? (selectedNotes[0] || state.tonic)
    : state.tonic

  const fretboardBass = finderMode !== 'off'
    ? (selectedNotes[0] || state.tonic)
    : (state.viewMode === 'chord' ? computed.activeNotes[0] : state.tonic)

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-text">
            Music Theory Visualizer
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Interactive Circle of Fifths and {state.instrument === 'guitar' ? 'Guitar' : 'Bass'} Fretboard
          </p>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left side - Circle of Fifths */}
          <div className="flex justify-center">
            <CircleOfFifths
              tonic={state.tonic}
              activeNotes={finderMode !== 'off' ? selectedNotes : computed.activeNotes}
              mode={state.viewMode === 'scale' ? state.mode : 'major'}
              accidentalMode={state.accidentalMode}
              onSelectTonic={actions.setTonic}
            />
          </div>

          {/* Right side - Config Panel */}
          <div className="flex justify-center lg:justify-start">
            <ConfigPanel state={state} actions={actions} />
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Fretboard */}
        <GuitarFretboard
          instrument={state.instrument}
          activeNotes={fretboardNotes}
          tonic={fretboardTonic}
          bassNote={fretboardBass}
          tuning={computed.currentTuning}
          showAllNotes={showAllNotes}
          selectionMode={finderMode !== 'off'}
          selectedNotes={selectedNotes}
          onNoteSelect={handleNoteSelect}
        />

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Chord/Scale Finder */}
        <ChordScaleFinder
          finderMode={finderMode}
          setFinderMode={setFinderMode}
          showAllNotes={showAllNotes}
          setShowAllNotes={setShowAllNotes}
          selectedNotes={selectedNotes}
          clearSelectedNotes={clearSelectedNotes}
          detectedChords={detectedChords}
          detectedScales={detectedScales}
        />
      </div>
    </div>
  )
}

export default App
