import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Chord } from 'tonal'
import {
  CIRCLE_OF_FIFTHS_FLATS,
  CIRCLE_OF_FIFTHS_SHARPS,
  isInScale,
  areSameNote,
  getScaleDegrees,
} from '@/lib/music-theory'
import type { AccidentalMode } from '@/hooks/useMusicState'

interface CircleOfFifthsProps {
  tonic: string
  activeNotes: string[]
  mode: string
  accidentalMode: AccidentalMode
  onSelectTonic: (note: string) => void
}

const SIZE = 450
const CENTER = SIZE / 2
const OUTER_RADIUS = 180
const MIDDLE_RADIUS = 140
const INNER_RADIUS = 100
const TRIAD_RADIUS = 60

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

// Create wedge path for a slice
function createWedgePath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle)
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    'M', innerStart.x, innerStart.y,
    'L', outerStart.x, outerStart.y,
    'A', outerRadius, outerRadius, 0, largeArc, 1, outerEnd.x, outerEnd.y,
    'L', innerEnd.x, innerEnd.y,
    'A', innerRadius, innerRadius, 0, largeArc, 0, innerStart.x, innerStart.y,
    'Z',
  ].join(' ')
}

// Create arc path for quality indicators
function createArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle)
  const end = polarToCartesian(cx, cy, radius, endAngle)
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0
  const sweep = endAngle > startAngle ? 1 : 0

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArc, sweep, end.x, end.y,
  ].join(' ')
}

// Get triad notes for a scale degree
function getTriadNotes(note: string, quality: string): string[] {
  let chordSymbol = note
  if (quality === 'minor') chordSymbol += 'm'
  else if (quality === 'diminished') chordSymbol += 'dim'
  else if (quality === 'augmented') chordSymbol += 'aug'

  const chord = Chord.get(chordSymbol)
  return chord.notes.slice(0, 3)
}

export function CircleOfFifths({
  tonic,
  activeNotes,
  mode,
  accidentalMode,
  onSelectTonic,
}: CircleOfFifthsProps) {
  const sliceAngle = 360 / 12

  // Select the appropriate circle based on accidental mode
  const circleNotes = accidentalMode === 'sharps' ? CIRCLE_OF_FIFTHS_SHARPS : CIRCLE_OF_FIFTHS_FLATS

  // Get scale degrees for the current tonic and mode
  const scaleDegrees = useMemo(() => getScaleDegrees(tonic, mode), [tonic, mode])

  // Map each circle position to its scale degree info (if in scale)
  const circleData = useMemo(() => {
    return circleNotes.map((note, index) => {
      const isActive = isInScale(note, activeNotes)
      const isTonic = areSameNote(note, tonic)

      // Find if this note is a scale degree
      const degreeInfo = scaleDegrees.find(deg => areSameNote(deg.note, note))

      return {
        note,
        index,
        isActive,
        isTonic,
        degreeInfo,
        triad: degreeInfo ? getTriadNotes(degreeInfo.note, degreeInfo.quality) : null,
      }
    })
  }, [circleNotes, activeNotes, tonic, scaleDegrees])

  // Calculate arc positions for Major, Minor, Diminished based on scale degrees
  const qualityArcs = useMemo(() => {
    const arcs: { quality: string; startIndex: number; endIndex: number; color: string }[] = []

    // Find indices of each quality type
    const majorIndices: number[] = []
    const minorIndices: number[] = []
    const diminishedIndices: number[] = []

    circleData.forEach(d => {
      if (!d.degreeInfo) return
      const idx = d.index
      if (d.degreeInfo.quality === 'major') majorIndices.push(idx)
      else if (d.degreeInfo.quality === 'minor') minorIndices.push(idx)
      else if (d.degreeInfo.quality === 'diminished') diminishedIndices.push(idx)
    })

    // Helper to find the shortest arc span for a set of indices (handles wrapping)
    const findArcSpan = (indices: number[]): { start: number; end: number } => {
      if (indices.length === 0) return { start: 0, end: 0 }
      if (indices.length === 1) return { start: indices[0], end: indices[0] }

      // Sort indices
      const sorted = [...indices].sort((a, b) => a - b)

      // Find the largest gap between consecutive indices
      let maxGap = 0
      let gapEndIndex = 0

      for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i]
        const next = sorted[(i + 1) % sorted.length]
        // Gap wrapping around from last to first
        const gap = i === sorted.length - 1 ? (12 - current + next) : (next - current)

        if (gap > maxGap) {
          maxGap = gap
          gapEndIndex = (i + 1) % sorted.length
        }
      }

      // The arc starts after the largest gap and ends before it
      const start = sorted[gapEndIndex]
      const end = sorted[(gapEndIndex - 1 + sorted.length) % sorted.length]

      return { start, end }
    }

    // Create arcs for each quality group
    if (majorIndices.length > 0) {
      const span = findArcSpan(majorIndices)
      arcs.push({
        quality: 'MAJOR',
        startIndex: span.start,
        endIndex: span.end,
        color: 'var(--color-major)',
      })
    }
    if (minorIndices.length > 0) {
      const span = findArcSpan(minorIndices)
      arcs.push({
        quality: 'MINOR',
        startIndex: span.start,
        endIndex: span.end,
        color: 'var(--color-minor)',
      })
    }
    if (diminishedIndices.length > 0) {
      // Diminished is usually just one note
      diminishedIndices.forEach(idx => {
        arcs.push({
          quality: 'DIM',
          startIndex: idx,
          endIndex: idx,
          color: 'var(--color-diminished)',
        })
      })
    }

    return arcs
  }, [circleData])

  return (
    <div className="flex flex-col items-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="overflow-visible"
      >
        {/* Quality arcs - dynamic based on scale */}
        <g>
          {qualityArcs.map((arc, i) => {
            const startAngle = arc.startIndex * sliceAngle - sliceAngle / 2
            // Handle wrapping: if end < start, add 360 to end
            let endAngle = (arc.endIndex + 1) * sliceAngle - sliceAngle / 2
            if (arc.endIndex < arc.startIndex) {
              endAngle += 360
            }
            const pathId = `arc-path-${arc.quality}-${i}`

            // Create text path arc (slightly outside the colored arc)
            const textArcRadius = OUTER_RADIUS + 22
            const textArcPath = createArcPath(CENTER, CENTER, textArcRadius, startAngle, endAngle)

            return (
              <g key={`arc-${arc.quality}-${i}`}>
                {/* Colored arc */}
                <path
                  d={createArcPath(CENTER, CENTER, OUTER_RADIUS + 10, startAngle, endAngle)}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {/* Hidden path for text to follow */}
                <defs>
                  <path id={pathId} d={textArcPath} fill="none" />
                </defs>
                {/* Text following the arc */}
                <text
                  fill={arc.color}
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="2"
                >
                  <textPath
                    href={`#${pathId}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {arc.quality}
                  </textPath>
                </text>
              </g>
            )
          })}
        </g>

        {/* Outer ring - Note names */}
        <g>
          {circleData.map(({ note, index, isActive, isTonic }) => {
            const startAngle = index * sliceAngle - sliceAngle / 2
            const endAngle = startAngle + sliceAngle
            const midAngle = startAngle + sliceAngle / 2
            const labelPos = polarToCartesian(CENTER, CENTER, (OUTER_RADIUS + MIDDLE_RADIUS) / 2, midAngle)

            return (
              <g key={note}>
                <motion.path
                  d={createWedgePath(CENTER, CENTER, MIDDLE_RADIUS, OUTER_RADIUS, startAngle, endAngle)}
                  fill={
                    isTonic
                      ? 'var(--color-primary)'
                      : isActive
                      ? 'var(--color-surface-hover)'
                      : 'var(--color-surface)'
                  }
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  className="cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelectTonic(note)}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isTonic ? 'white' : isActive ? 'var(--color-text)' : 'var(--color-text-muted)'}
                  fontSize={isTonic ? '18' : '16'}
                  fontWeight={isTonic || isActive ? '700' : '500'}
                  className="pointer-events-none select-none"
                >
                  {note}
                </text>
              </g>
            )
          })}
        </g>

        {/* Middle ring - Roman numerals (directly under notes) */}
        <g>
          {circleData.map(({ note, index, degreeInfo, isTonic }) => {
            const startAngle = index * sliceAngle - sliceAngle / 2
            const endAngle = startAngle + sliceAngle
            const midAngle = startAngle + sliceAngle / 2
            const labelPos = polarToCartesian(CENTER, CENTER, (MIDDLE_RADIUS + INNER_RADIUS) / 2, midAngle)

            // Only show roman numeral if this note is in the scale
            if (!degreeInfo) {
              return (
                <path
                  key={`middle-${note}`}
                  d={createWedgePath(CENTER, CENTER, INNER_RADIUS, MIDDLE_RADIUS, startAngle, endAngle)}
                  fill="var(--color-background)"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
              )
            }

            const qualityColor =
              degreeInfo.quality === 'major' ? 'var(--color-major)' :
              degreeInfo.quality === 'minor' ? 'var(--color-minor)' :
              'var(--color-diminished)'

            return (
              <g key={`middle-${note}`}>
                <path
                  d={createWedgePath(CENTER, CENTER, INNER_RADIUS, MIDDLE_RADIUS, startAngle, endAngle)}
                  fill={isTonic ? 'var(--color-primary)' : 'var(--color-surface)'}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={qualityColor}
                  fontSize="14"
                  fontWeight="700"
                  className="pointer-events-none select-none"
                >
                  {degreeInfo.roman}
                </text>
              </g>
            )
          })}
        </g>

        {/* Inner ring - Triads */}
        <g>
          {circleData.map(({ note, index, triad, isTonic }) => {
            const startAngle = index * sliceAngle - sliceAngle / 2
            const endAngle = startAngle + sliceAngle
            const midAngle = startAngle + sliceAngle / 2
            const labelPos = polarToCartesian(CENTER, CENTER, (INNER_RADIUS + TRIAD_RADIUS) / 2, midAngle)

            // Background slice
            const bgPath = createWedgePath(CENTER, CENTER, TRIAD_RADIUS, INNER_RADIUS, startAngle, endAngle)

            if (!triad) {
              return (
                <path
                  key={`inner-${note}`}
                  d={bgPath}
                  fill="var(--color-background)"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
              )
            }

            return (
              <g key={`inner-${note}`}>
                <path
                  d={bgPath}
                  fill={isTonic ? 'var(--color-primary)' : 'var(--color-surface)'}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-text-muted)"
                  fontSize="9"
                  className="pointer-events-none select-none"
                >
                  {triad.join('-')}
                </text>
              </g>
            )
          })}
        </g>

        {/* Center circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TRIAD_RADIUS}
          fill="var(--color-background)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x={CENTER}
          y={CENTER - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-muted)"
          fontSize="10"
          fontWeight="500"
        >
          CIRCLE OF
        </text>
        <text
          x={CENTER}
          y={CENTER + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-muted)"
          fontSize="10"
          fontWeight="500"
        >
          FIFTHS
        </text>
      </svg>

      {/* Current selection label */}
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-bold">
          <span className="text-primary">{tonic}</span>{' '}
          <span className="text-text-muted capitalize">{mode}</span>
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Click a note to change tonic
        </p>
      </div>
    </div>
  )
}
