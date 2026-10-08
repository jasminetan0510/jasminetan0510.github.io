'use client'

import { ArrowDown } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Slow, eased scroll to a section. Respects the section's scroll-margin,
 * stops if the visitor scrolls themselves, and jumps instantly for
 * reduced-motion visitors.
 */
function slowScrollTo(id: string, duration = 1600) {
  const target = document.getElementById(id)
  if (!target) return
  const startY = window.scrollY
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  const endY = target.getBoundingClientRect().top + startY - margin

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: endY, behavior: 'instant' })
    return
  }

  let raf = 0
  const cancel = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
    window.removeEventListener('keydown', cancel)
  }
  window.addEventListener('wheel', cancel, { passive: true })
  window.addEventListener('touchstart', cancel, { passive: true })
  window.addEventListener('keydown', cancel)

  // ease-in-out cubic: gentle start, gentle landing
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    window.scrollTo({ top: startY + (endY - startY) * ease(t), behavior: 'instant' })
    if (t < 1) raf = requestAnimationFrame(step)
    else cancel()
  }
  raf = requestAnimationFrame(step)
}

/**
 * "See the work" + bobbing arrow, pinned to the bottom of the hero. It's
 * both the hero's call to action and the "there's more below" hint.
 * Clicking glides slowly down to the target section; the link fades out
 * once the visitor starts scrolling.
 *
 * The scroll-fade lives on the link and the entrance (hero-enter) on the
 * inner span, so the entrance delay never slows down the fade.
 */
export function ScrollCue({
  targetId = 'projects',
  label = 'See the work',
  duration = 1600,
}: {
  targetId?: string
  label?: string
  duration?: number
}) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault()
        slowScrollTo(targetId, duration)
      }}
      className={cn(
        'group absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 rounded-full px-4 py-2 text-foreground/70 transition-opacity duration-500 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <span
        className="hero-enter flex flex-col items-center gap-1.5"
        style={{ '--d': '1100ms' } as CSSProperties}
      >
        <span className="text-sm font-medium underline-offset-4 group-hover:underline">{label}</span>
        <ArrowDown className="scroll-cue-bob size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>

      <style jsx global>{`
        @keyframes scroll-cue-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }
        .scroll-cue-bob {
          animation: scroll-cue-bob 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-cue-bob {
            animation: none;
          }
        }
      `}</style>
    </a>
  )
}