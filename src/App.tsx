import { useMusicState } from '@/hooks/useMusicState'
import { CircleOfFifths } from '@/components/CircleOfFifths'
import { GuitarFretboard } from '@/components/GuitarFretboard'
import { ConfigPanel } from '@/components/ConfigPanel'

function App() {
  const { state, actions, computed } = useMusicState()

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-text">
            Music Theory Visualizer
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Interactive Circle of Fifths and Guitar Fretboard
          </p>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left side - Circle of Fifths */}
          <div className="flex justify-center">
            <CircleOfFifths
              tonic={state.tonic}
              activeNotes={computed.activeNotes}
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

        {/* Guitar Fretboard */}
        <GuitarFretboard
          activeNotes={computed.activeNotes}
          tonic={state.tonic}
          bassNote={state.viewMode === 'chord' ? computed.activeNotes[0] : state.tonic}
          tuning={computed.currentTuning}
        />
      </div>
    </div>
  )
}

export default App
