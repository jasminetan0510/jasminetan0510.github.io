'use client'

import { useParallax } from '@/lib/use-parallax'
import { cn } from '@/lib/utils'

/**
 * Flat, solid color blocks — not gradients — built from the existing
 * theme tokens so the palette stays in the site's neutral cream/
 * charcoal/taupe family. True color blocking reads from a hard edge
 * between adjacent panels, not a blend, so keep these flat.
 */
const backdropVariants = {
  seabreeze: 'bg-[#e5edf0]',
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