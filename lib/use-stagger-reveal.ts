'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Staggered scroll reveal shared by the Projects and Involvements grids.
 * Children marked with `data-reveal` that start below the fold rise and
 * fade in once they scroll into view (styles: `.stagger-reveal` in the
 * component). Cards already on screen at load are left alone, and nothing
 * moves for reduced-motion visitors or before JS runs.
 */
export function useStaggerReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const below = items.filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    below.forEach((el) => el.setAttribute('data-reveal', 'pending'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-reveal', 'shown')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )
    below.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref])
}