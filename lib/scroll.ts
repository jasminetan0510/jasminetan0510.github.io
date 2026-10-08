/**
 * Shared section-to-section scrolling for the hero's "See the work", the
 * between-section arrows and the header links.
 *
 * Where a section lands is set in ONE place: its CSS scroll margin
 * (`scroll-mt-20` = 80px, just below the floating nav pill). This helper
 * reads that margin and scrolls to an exact pixel position, so the result
 * is the same whether Lenis is running or not, and no matter whether a
 * given Lenis version applies scroll-margin itself (which is what caused
 * sections to land 80px too low: the offset was being applied twice).
 */

/** Gentle start, gentle landing. */
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

type LenisLike = {
  scrollTo: (target: number, options?: { duration?: number; easing?: (t: number) => number }) => void
}

export function scrollToSection(id: string, lenis?: LenisLike | null, duration = 1.4) {
  const el = document.getElementById(id)
  if (!el) return
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin)

  if (lenis) {
    lenis.scrollTo(top, { duration, easing: easeInOutCubic })
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}