import type { BaseGender } from '@/lib/characters'

// A real pixel grid — every part is a set of square cells on this grid,
// rendered as <rect> with crisp edges. Nothing here is a smooth curve,
// so there's no room for the kind of path-math bug that caused the
// previous version's bald spot.
const UNIT = 4 // px per pixel, before scaling to the requested `size`
const COLS = 24
const ROWS = 32

/** Height-to-width ratio of the avatar's viewBox — use this instead of
 * hardcoding a number when sizing a wrapper around <CharacterAvatar>. */
export const AVATAR_ASPECT = ROWS / COLS

const SKIN = '#f4c9a0'
const HAIR_COLOR = '#4a3423'
const BROW_COLOR = '#3a2a1a'
const MOUTH_COLOR = '#8a4a4a'

const HEAD = { centerCol: 11.5, centerRow: 13, radiusCol: 8, radiusRow: 9 }

type RowSpan = { row: number; fromCol: number; toCol: number }

/** Generates filled row-spans for an ellipse on the pixel grid. */
function ellipseRowSpans(
  centerCol: number,
  centerRow: number,
  radiusCol: number,
  radiusRow: number,
): RowSpan[] {
  const spans: RowSpan[] = []
  const top = Math.max(0, Math.ceil(centerRow - radiusRow))
  const bottom = Math.min(ROWS - 1, Math.floor(centerRow + radiusRow))
  for (let row = top; row <= bottom; row++) {
    const dy = row - centerRow
    const ratio = 1 - (dy * dy) / (radiusRow * radiusRow)
    if (ratio < 0) continue
    const dx = radiusCol * Math.sqrt(ratio)
    const fromCol = Math.round(centerCol - dx)
    const toCol = Math.round(centerCol + dx)
    if (toCol >= fromCol) spans.push({ row, fromCol, toCol })
  }
  return spans
}

function PixelSpans({ spans, color }: { spans: RowSpan[]; color: string }) {
  return (
    <>
      {spans.map((s, i) => (
        <rect
          key={i}
          x={s.fromCol * UNIT}
          y={s.row * UNIT}
          width={(s.toCol - s.fromCol + 1) * UNIT}
          height={UNIT}
          fill={color}
        />
      ))}
    </>
  )
}

function PixelCells({
  cells,
  color,
}: {
  cells: [col: number, row: number][]
  color: string
}) {
  return (
    <>
      {cells.map(([col, row], i) => (
        <rect
          key={i}
          x={col * UNIT}
          y={row * UNIT}
          width={UNIT}
          height={UNIT}
          fill={color}
        />
      ))}
    </>
  )
}

/** Per-style hair-back silhouette (drawn behind the head). */
function hairBackSpans(style: number): RowSpan[] {
  switch (style) {
    case 0: // Waves — long, past the shoulders
      return ellipseRowSpans(HEAD.centerCol, 20, 9.5, 17)
    case 1: // Bob — chin length
      return ellipseRowSpans(HEAD.centerCol, 14, 9, 11)
    case 2: // Ponytail — short at the back, plus a tail
      return ellipseRowSpans(HEAD.centerCol, 12, 8.5, 9)
    case 3: // Short crop — close to the head
    default:
      return ellipseRowSpans(HEAD.centerCol, 9.5, 7.5, 6.5)
  }
}

/** Extra hand-placed cells per style (e.g. the ponytail's tail). */
function hairExtraCells(style: number): [number, number][] {
  if (style !== 2) return []
  // Ponytail, offset to the right of the head.
  const cells: [number, number][] = []
  for (let row = 10; row <= 16; row++) cells.push([20, row], [21, row])
  return cells
}

/** How many of the head's top rows get overpainted with hair color to
 * form the fringe — reuses the head's own ellipse spans, so the fringe
 * edge always matches the head edge exactly (no gap possible). */
function fringeRowCount(style: number): number {
  switch (style) {
    case 2:
      return 5 // ponytail — pulled back, but still a real fringe
    case 3:
      return 3 // short crop — shortest, but no longer barely-there
    default:
      return 6 // waves / bob — fuller fringe, covers well into the face
  }
}

export function CharacterAvatar({
  base,
  hair,
  shirtColor,
  eyeColor,
  size = 96,
  className,
}: {
  base: BaseGender
  hair: number
  shirtColor: string
  eyeColor: string
  size?: number
  className?: string
}) {
  const headSpans = ellipseRowSpans(
    HEAD.centerCol,
    HEAD.centerRow,
    HEAD.radiusCol,
    HEAD.radiusRow,
  )
  const fringeSpans = headSpans.slice(0, fringeRowCount(hair))

  const eyeRow = 14
  const leftEyeCol = 8.5
  const rightEyeCol = 14.5
  const eyeSpans = [
    ...ellipseRowSpans(leftEyeCol, eyeRow, 1.6, 2.2),
    ...ellipseRowSpans(rightEyeCol, eyeRow, 1.6, 2.2),
  ]

  // Positioned relative to the eyes rather than the fringe, so they stay
  // sensibly placed regardless of how much fringe a given hairstyle has.
  const browRow = eyeRow - 2
  const browWidth = base === 'male' ? 4 : 3 // only remaining base difference — flat either way
  const browCells: [number, number][] = [
    ...Array.from(
      { length: browWidth },
      (_, i) => [9 - i, browRow] as [number, number],
    ),
    ...Array.from(
      { length: browWidth },
      (_, i) => [14 + i, browRow] as [number, number],
    ),
  ]

  const blushCells: [number, number][] = [
    [5, 16],
    [6, 16],
    [5, 17],
    [17, 16],
    [18, 16],
    [17, 17],
  ]

  const mouthCells: [number, number][] = [
    [11, 19],
    [12, 19],
  ]

  const shirtSpans: RowSpan[] = [
    { row: 23, fromCol: 8, toCol: 15 },
    { row: 24, fromCol: 7, toCol: 16 },
    { row: 25, fromCol: 6, toCol: 17 },
    { row: 26, fromCol: 6, toCol: 17 },
    { row: 27, fromCol: 5, toCol: 18 },
    { row: 28, fromCol: 5, toCol: 18 },
    { row: 29, fromCol: 5, toCol: 18 },
    { row: 30, fromCol: 5, toCol: 18 },
    { row: 31, fromCol: 5, toCol: 18 },
  ]

  return (
    <svg
      viewBox={`0 0 ${COLS * UNIT} ${ROWS * UNIT}`}
      width={size}
      height={size * (ROWS / COLS)}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {/* Hair — back layer */}
      <PixelSpans spans={hairBackSpans(hair)} color={HAIR_COLOR} />
      <PixelCells cells={hairExtraCells(hair)} color={HAIR_COLOR} />

      {/* Body / shirt */}
      <PixelSpans spans={shirtSpans} color={shirtColor} />

      {/* Head */}
      <PixelSpans spans={headSpans} color={SKIN} />

      {/* Hair — front fringe (same ellipse as the head, top rows only,
          so the edge is guaranteed to match — this is what fixes the
          bald-spot bug). */}
      <PixelSpans spans={fringeSpans} color={HAIR_COLOR} />

      {/* Eyebrows */}
      <PixelCells cells={browCells} color={BROW_COLOR} />

      {/* Eyes, with a single white highlight pixel each */}
      <PixelSpans spans={eyeSpans} color={eyeColor} />
      <PixelCells
        cells={[
          [Math.round(leftEyeCol - 1), eyeRow - 1],
          [Math.round(rightEyeCol - 1), eyeRow - 1],
        ]}
        color="white"
      />

      {/* Blush */}
      <PixelCells cells={blushCells} color="#f7a8a8" />

      {/* Mouth — small, no nose */}
      <PixelCells cells={mouthCells} color={MOUTH_COLOR} />
    </svg>
  )
}