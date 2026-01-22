# Music Theory Visualizer - Technical Architecture

## Project Overview

An interactive web application for visualizing music theory concepts, featuring a Circle of Fifths and a guitar fretboard. Designed to help musicians understand scales, chords, modes, and their relationships.

---

## Project Structure

```
music-theory-visualizer/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for auto-deployment
├── src/
│   ├── components/
│   │   ├── CircleOfFifths.tsx  # SVG-based interactive circle visualization
│   │   ├── GuitarFretboard.tsx # Guitar fretboard with note highlighting
│   │   └── ConfigPanel.tsx     # Controls for mode, chords, tuning, etc.
│   ├── hooks/
│   │   └── useMusicState.ts    # Central state management hook
│   ├── lib/
│   │   ├── music-theory.ts     # Music theory utilities and constants
│   │   └── utils.ts            # General utilities (className merging)
│   ├── App.tsx                 # Main layout component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles and Tailwind theme
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite bundler configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── ARCHITECTURE.md             # This file
```

---

## Technology Stack

### Core Framework: React 18 + TypeScript

**Why React?**
- Component-based architecture fits well with distinct UI sections (Circle, Fretboard, Controls)
- Excellent ecosystem and community support
- Declarative rendering makes complex SVG updates straightforward
- Hooks API enables clean state management without external libraries

**Why TypeScript?**
- Type safety catches errors at compile time (critical for music theory calculations)
- Better IDE support with autocomplete for note names, chord types, etc.
- Self-documenting code through interfaces (e.g., `StringTuning`, `FretboardNote`)
- Easier refactoring as the project grows

### Build Tool: Vite

**Why Vite over Create React App or Webpack?**
- 10-100x faster development server startup (uses native ES modules)
- Instant Hot Module Replacement (HMR)
- Optimized production builds with automatic code splitting
- First-class TypeScript support without configuration
- Simpler configuration compared to Webpack

### Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first approach speeds up UI development
- No context switching between CSS and component files
- Built-in dark mode support
- Smaller production CSS bundle (only includes used classes)
- Easy theming through CSS custom properties

**Custom Theme Variables (defined in index.css):**
```css
--color-background    # App background
--color-surface       # Card/panel backgrounds
--color-primary       # Interactive elements (purple)
--color-octave-2/3/4/5  # Fretboard note coloring by octave
--color-major/minor/diminished  # Circle of Fifths arc colors
```

### Music Theory: Tonal.js (@tonaljs/tonal)

**Why Tonal.js?**
- Comprehensive music theory library (scales, chords, intervals, MIDI)
- Handles enharmonic equivalence (C# = Db)
- Well-maintained with TypeScript definitions
- No audio dependencies (pure calculation library)
- MIT licensed

**Key Functions Used:**
- `Scale.get()` - Retrieve scale notes for any tonic/mode combination
- `Chord.get()` - Get chord notes with proper voicing
- `Note.midi()` - Convert note names to MIDI numbers for comparison
- `Midi.midiToNoteName()` - Generate fretboard note names

### Animation: Framer Motion

**Why Framer Motion?**
- Declarative animation API integrates naturally with React
- Hardware-accelerated animations
- Simple hover/tap interactions
- Handles SVG animations smoothly (important for Circle of Fifths)

### Icons: Lucide React

**Why Lucide?**
- Consistent, clean icon set
- Tree-shakeable (only imports used icons)
- MIT licensed
- Drop-in React components

---

## Design Decisions

### 1. Client-Side Only Architecture

**Decision:** No backend server, all computation happens in the browser.

**Rationale:**
- Music theory calculations are deterministic and fast
- No user data to persist (state resets on refresh)
- Enables free hosting on GitHub Pages
- Zero latency for interactions
- Works offline once loaded

**Trade-offs:**
- State is lost on page refresh (could add localStorage later)
- Can't share configurations via URL (could add URL params later)

### 2. Centralized State with Custom Hook

**Decision:** Single `useMusicState` hook manages all application state.

**Rationale:**
- Simpler than Redux/Zustand for this scale of application
- All derived values (activeNotes, currentTuning) computed in one place
- Easy to understand data flow
- No external state library dependencies

**State Structure:**
```typescript
{
  tonic: string           // Current root note (C, D, E, etc.)
  viewMode: 'scale' | 'chord'
  mode: string            // Scale mode (major, dorian, etc.)
  chordType: string       // Chord quality (M, m, 7, etc.)
  inversion: number       // Chord inversion (0-3)
  accidentalMode: 'flats' | 'sharps'
  tuningPreset: string    // Guitar tuning preset name
  customTuning: StringTuning[]
}
```

### 3. SVG for Circle of Fifths

**Decision:** Render the Circle of Fifths as inline SVG rather than Canvas or DOM elements.

**Rationale:**
- Vector graphics scale perfectly at any resolution
- Native support for arc paths and polar coordinates
- CSS styling applies directly to SVG elements
- Text rendering is crisp (important for note names)
- Event handling works naturally (click on wedges)

**Implementation Details:**
- Wedges created with path commands using polar-to-cartesian conversion
- Text-on-path for MAJOR/MINOR/DIM labels following arc curves
- Dynamic arc positioning based on scale degrees

### 4. Enharmonic Note Comparison via MIDI

**Decision:** Compare notes by MIDI number modulo 12, not string matching.

**Rationale:**
- "C#" and "Db" are the same pitch but different strings
- Scale/chord libraries may return different enharmonic spellings
- MIDI numbers are unambiguous (C# = Db = 1, D = 2, etc.)

**Implementation:**
```typescript
function areSameNote(note1: string, note2: string): boolean {
  return getPitchClass(note1) === getPitchClass(note2)
}

function getPitchClass(note: string): number {
  const midi = Note.midi(note + '4')  // Add octave for MIDI calc
  return midi % 12  // 0-11 for each pitch class
}
```

### 5. Fretboard Generation at Runtime

**Decision:** Generate all fretboard notes dynamically rather than hardcoding.

**Rationale:**
- Supports any tuning without code changes
- Correct octave calculation for all positions
- Single source of truth (tuning array)
- Easy to extend to different fret counts or string counts

**Data Structure:**
```typescript
interface FretboardNote {
  note: string      // Pitch class (e.g., "C#")
  fullNote: string  // With octave (e.g., "C#4")
  octave: number    // For color coding
  string: number    // 0-5
  fret: number      // 0-15
  midi: number      // For comparison
}
```

### 6. Collapsible Tuning Section

**Decision:** Hide tuning controls by default, reveal on click.

**Rationale:**
- Most users will use standard tuning
- Keeps the main interface uncluttered
- Power users can still access all options
- Reduces cognitive load for beginners

---

## Data Flow

```
User Interaction
       │
       ▼
┌─────────────────┐
│  ConfigPanel    │ ─── setTonic(), setMode(), etc.
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useMusicState  │ ─── Central state + computed values
└────────┬────────┘
         │
         ├──────────────────┬─────────────────┐
         ▼                  ▼                 ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│ CircleOfFifths  │ │  Fretboard  │ │   ConfigPanel   │
│                 │ │             │ │   (displays)    │
│ - activeNotes   │ │ - tuning    │ │                 │
│ - tonic         │ │ - tonic     │ │                 │
│ - mode          │ │ - activeNotes                   │
└─────────────────┘ └─────────────┘ └─────────────────┘
```

---

## Performance Considerations

1. **Memoization:** `useMemo` for expensive calculations (fretboard notes, scale degrees, circle data)

2. **Static Arrays:** Tuning presets and chord types defined as constants, not recreated on render

3. **Conditional Rendering:** Inversion slider only renders in chord mode; custom tuning only when selected

4. **SVG Optimization:** Reuse path generation functions; avoid inline function definitions in render

---

## Future Extension Points

### MIDI Input (Planned)
- Web MIDI API for device detection
- Note-on/note-off event handling
- Real-time chord detection using `Chord.detect()`
- Highlight played notes on fretboard

### Potential Additions
- Audio playback (Web Audio API or Tone.js)
- Chord progression builder
- Scale practice mode with random note highlighting
- Export/share configurations via URL parameters
- LocalStorage persistence for user preferences
- Multiple fretboard instruments (bass, ukulele)

---

## Deployment

### GitHub Pages (Current)
- Automatic deployment via GitHub Actions on push to `master`
- Static files served from `dist/` folder
- Base path configured in `vite.config.ts`
- Free hosting with custom domain support

### Alternative Platforms
- Vercel: `npx vercel` (auto-detects Vite)
- Netlify: Drag and drop `dist/` folder
- Cloudflare Pages: Connect GitHub repo

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## File Size Analysis (Production Build)

| Asset | Size | Gzipped |
|-------|------|---------|
| JavaScript | ~375 KB | ~119 KB |
| CSS | ~14 KB | ~4 KB |
| HTML | <1 KB | <1 KB |

Main contributors to JS bundle:
- Tonal.js (~150 KB) - Music theory calculations
- React + ReactDOM (~140 KB) - UI framework
- Framer Motion (~60 KB) - Animations
- Application code (~25 KB)
