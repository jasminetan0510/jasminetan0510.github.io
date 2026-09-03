'use client'

import { useParallax } from '@/lib/use-parallax'
import { cn } from '@/lib/utils'

/**
 * Flat, solid color blocks — not gradients — built to sit *behind* a
 * section and drift at a different scroll speed than its foreground
 * content. True color blocking reads from a hard edge between adjacent
 * panels, not a blend, so keep these flat.
 *
 * These intentionally do NOT reuse --background/--accent/etc. directly:
 * if this layer matched its section's own background exactly, the
 * parallax drift would be invisible (same color moving behind same
 * color shows nothing). Each variant needs to differ *slightly* from
 * the sections it's used in so the motion actually reads. seabreeze
 * used to do that with a hardcoded blue-gray (#e5edf0) that fell
 * outside the ivory/ink palette entirely — swapped for a warm oat/
 * greige that still contrasts against the surrounding cream sections
 * but stays in-family.
 */
const backdropVariants = {
  seabreeze: 'bg-[#ece4d6]',
  cococream: 'bg-[#faf7f2]',
} as const

/**
 * An absolutely-positioned background layer that drifts at its own speed,
 * independent of the section's foreground content. Drop it as the first
 * child of a `relative overflow-hidden` section — it's oversized
 * (extends 20% beyond the section on top and bottom) so the drift never
 * reveals empty space at the edges.
 */
export function ParallaxBackdrop({
  variant = 'cococream',
  speed = 0.2,
  className,
}: {
  variant?: keyof typeof backdropVariants
  speed?: number
  className?: string
}) {
  const ref = useParallax<HTMLDivElement>(speed)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ willChange: 'transform' }}
      className={cn(
        'pointer-events-none absolute inset-x-0 -top-[20%] -bottom-[20%]',
        backdropVariants[variant],
        className,
      )}
    />
  )
}