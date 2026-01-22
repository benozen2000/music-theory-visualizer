import { Music2, Search, Trash2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChordScaleFinderProps {
  finderMode: 'off' | 'chord' | 'scale'
  setFinderMode: (mode: 'off' | 'chord' | 'scale') => void
  showAllNotes: boolean
  setShowAllNotes: (show: boolean) => void
  selectedNotes: string[]
  clearSelectedNotes: () => void
  detectedChords: string[]
  detectedScales: string[]
}

export function ChordScaleFinder({
  finderMode,
  setFinderMode,
  showAllNotes,
  setShowAllNotes,
  selectedNotes,
  clearSelectedNotes,
  detectedChords,
  detectedScales,
}: ChordScaleFinderProps) {
  return (
    <div className="bg-surface rounded-xl p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Chord / Scale Finder</h2>
        </div>

        {/* Show all notes toggle */}
        <button
          onClick={() => setShowAllNotes(!showAllNotes)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            showAllNotes
              ? "bg-primary/20 text-primary"
              : "bg-surface-hover text-text-muted hover:text-text"
          )}
        >
          {showAllNotes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {showAllNotes ? 'All Notes On' : 'All Notes Off'}
        </button>
      </div>

      {/* Mode selection */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => {
            setFinderMode(finderMode === 'chord' ? 'off' : 'chord')
            clearSelectedNotes()
          }}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all",
            finderMode === 'chord'
              ? "bg-primary text-white"
              : "bg-surface-hover text-text-muted hover:text-text"
          )}
        >
          Find Chord
        </button>
        <button
          onClick={() => {
            setFinderMode(finderMode === 'scale' ? 'off' : 'scale')
            clearSelectedNotes()
          }}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all",
            finderMode === 'scale'
              ? "bg-primary text-white"
              : "bg-surface-hover text-text-muted hover:text-text"
          )}
        >
          Find Scale
        </button>
      </div>

      {/* Instructions when mode is off */}
      {finderMode === 'off' && (
        <div className="text-center py-6 text-text-muted">
          <p className="text-sm">
            Click "Find Chord" or "Find Scale" to start selecting notes on the fretboard
          </p>
        </div>
      )}

      {/* Active finder mode */}
      {finderMode !== 'off' && (
        <div className="space-y-4">
          {/* Selected notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                Selected Notes ({selectedNotes.length})
              </p>
              {selectedNotes.length > 0 && (
                <button
                  onClick={clearSelectedNotes}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-background rounded-lg border border-border">
              {selectedNotes.length > 0 ? (
                selectedNotes.map((note, i) => (
                  <span
                    key={`${note}-${i}`}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {note}
                  </span>
                ))
              ) : (
                <span className="text-text-muted text-sm">
                  Click notes on the fretboard to select them...
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          {finderMode === 'chord' && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                Matching Chords
              </p>
              {selectedNotes.length < 2 ? (
                <p className="text-sm text-text-muted p-3 bg-background rounded-lg border border-border">
                  Select at least 2 notes to detect chords
                </p>
              ) : detectedChords.length > 0 ? (
                <div className="space-y-2">
                  {detectedChords.slice(0, 6).map((chord, i) => (
                    <div
                      key={chord}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        i === 0
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-background border border-border"
                      )}
                    >
                      {i === 0 && <Music2 className="w-5 h-5 text-primary" />}
                      <span className={cn(
                        "font-medium",
                        i === 0 ? "text-lg text-text" : "text-text-muted"
                      )}>
                        {chord}
                      </span>
                      {i === 0 && (
                        <span className="text-xs text-primary ml-auto">Best match</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-yellow-200 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  No matching chords found for these notes
                </p>
              )}
            </div>
          )}

          {finderMode === 'scale' && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                Matching Scales
              </p>
              {selectedNotes.length < 3 ? (
                <p className="text-sm text-text-muted p-3 bg-background rounded-lg border border-border">
                  Select at least 3 notes to detect scales
                </p>
              ) : detectedScales.length > 0 ? (
                <div className="space-y-2">
                  {detectedScales.map((scale, i) => (
                    <div
                      key={scale}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        i === 0
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-background border border-border"
                      )}
                    >
                      {i === 0 && <Music2 className="w-5 h-5 text-primary" />}
                      <span className={cn(
                        "font-medium",
                        i === 0 ? "text-lg text-text" : "text-text-muted"
                      )}>
                        {scale}
                      </span>
                      {i === 0 && (
                        <span className="text-xs text-primary ml-auto">Best match</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-yellow-200 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  No matching scales found for these notes
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
