'use client'

import { useLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

/**
 * Attaches a scroll-linked parallax offset to a DOM node, synced to the
 * site-wide Lenis scroll loop (so it never drifts out of phase with the
 * smooth-scroll easing in SmoothScroll).
 *
 * The offset is based on the element's position relative to the viewport
 * center — not raw page-scroll distance — so the effect stays bounded no
 * matter where the section sits on the page. An element far down the page
 * still drifts smoothly in and out as it crosses the viewport, instead of
 * accumulating a huge, page-scroll-proportional offset.
 *
 * `speed` is a small multiplier on that distance:
 *  - positive values lag behind the scroll ("further back" / slower)
 *  - negative values lead ahead of it ("closer" / floating forward)
 *
 * Automatically no-ops when the visitor has prefers-reduced-motion set —
 * Lenis itself doesn't mount in that case, so this naturally goes still
 * right alongside smooth scroll rather than needing separate handling.
 */
export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T | null>(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const onChange = () => {
      reducedMotion.current = mq.matches
      if (mq.matches && ref.current) {
        ref.current.style.transform = ''
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useLenis(() => {
    if (!ref.current || reducedMotion.current) return
    const rect = ref.current.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const elementCenter = rect.top + rect.height / 2
    const distanceFromCenter = viewportCenter - elementCenter
    ref.current.style.transform = `translate3d(0, ${distanceFromCenter * speed}px, 0)`
  })

  return ref
}