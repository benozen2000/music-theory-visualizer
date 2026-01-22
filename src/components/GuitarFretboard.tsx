import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  generateFretboardNotes,
  isNoteActive,
  isRootNote,
  FRET_COUNT,
  type FretboardNote,
  type StringTuning,
} from '@/lib/music-theory'

interface GuitarFretboardProps {
  activeNotes: string[]
  tonic: string
  bassNote?: string
  tuning: StringTuning[]
}

const FRET_MARKERS = [3, 5, 7, 9, 12, 15]
const DOUBLE_MARKERS = [12]

// Octave colors
const OCTAVE_COLORS: Record<number, string> = {
  2: 'bg-octave-2',
  3: 'bg-octave-3',
  4: 'bg-octave-4',
  5: 'bg-octave-5',
}

export function GuitarFretboard({ activeNotes, tonic, bassNote, tuning }: GuitarFretboardProps) {
  const effectiveBass = bassNote || tonic
  const fretboardNotes = useMemo(() => generateFretboardNotes(tuning), [tuning])

  // Group notes by string and fret for easy lookup
  const noteGrid = useMemo(() => {
    const grid: FretboardNote[][] = Array(tuning.length)
      .fill(null)
      .map(() => [])

    fretboardNotes.forEach((note) => {
      grid[note.string][note.fret] = note
    })

    return grid
  }, [fretboardNotes])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">Fretboard Visualizer</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-text-muted">Root</span>
          </div>
          {bassNote && bassNote !== tonic && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white ring-1 ring-primary"></span>
              <span className="text-text-muted">Bass</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-octave-3"></span>
            <span className="text-text-muted">Oct 3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-octave-4"></span>
            <span className="text-text-muted">Oct 4</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[900px]">
          {/* Fretboard container */}
          <div className="relative bg-surface rounded-lg p-4">
            {/* Nut */}
            <div className="absolute left-[60px] top-4 bottom-4 w-2 bg-zinc-300 rounded-sm z-10" />

            {/* Fret markers (dots) */}
            <div className="absolute left-[80px] right-4 top-0 bottom-0 flex pointer-events-none">
              {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => {
                if (fret === 0) return null
                const isMarker = FRET_MARKERS.includes(fret)
                const isDouble = DOUBLE_MARKERS.includes(fret)

                return (
                  <div
                    key={fret}
                    className="flex-1 flex items-center justify-center"
                  >
                    {isMarker && (
                      <div className="flex flex-col gap-16">
                        <div className="w-3 h-3 rounded-full bg-zinc-700 opacity-50" />
                        {isDouble && (
                          <div className="w-3 h-3 rounded-full bg-zinc-700 opacity-50" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Strings and notes */}
            <div className="relative flex flex-col gap-2">
              {/* Reverse order so high string is at top visually */}
              {[...tuning].reverse().map((_, reversedIndex) => {
                const stringIndex = tuning.length - 1 - reversedIndex
                const stringNotes = noteGrid[stringIndex]

                return (
                  <div key={stringIndex} className="flex items-center">
                    {/* String label */}
                    <div className="w-[40px] text-center text-text-muted text-sm font-medium">
                      {tuning[stringIndex].note}
                    </div>

                    {/* Frets */}
                    <div className="flex flex-1 relative">
                      {/* String line */}
                      <div
                        className="absolute left-0 right-0 top-1/2 h-[2px] bg-zinc-600"
                        style={{
                          height: `${1 + (5 - stringIndex) * 0.3}px`,
                        }}
                      />

                      {stringNotes.map((note, fret) => {
                        const isActive = isNoteActive(note.note, activeNotes)
                        const isRoot = isRootNote(note.note, tonic)
                        const isBass = isRootNote(note.note, effectiveBass)

                        return (
                          <div
                            key={fret}
                            className={cn(
                              'flex-1 h-10 flex items-center justify-center relative',
                              fret > 0 && 'border-l border-zinc-700'
                            )}
                          >
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10',
                                  isRoot
                                    ? 'bg-primary text-white ring-2 ring-primary-hover'
                                    : isBass
                                    ? 'bg-white text-background ring-2 ring-primary'
                                    : cn(
                                        OCTAVE_COLORS[note.octave] || 'bg-zinc-500',
                                        'text-white'
                                      )
                                )}
                              >
                                {note.note}
                              </motion.div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Fret numbers */}
            <div className="flex mt-2 ml-[40px]">
              {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
                <div
                  key={fret}
                  className="flex-1 text-center text-text-muted text-xs"
                >
                  {fret === 0 ? '' : fret}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
