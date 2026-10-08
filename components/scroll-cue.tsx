'use client'

import { ArrowDown } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/utils'

/**
 * "See the work" + bobbing arrow, pinned to the bottom of the hero. It's
 * both the hero's call to action and the "there's more below" hint.
 * Clicking glides slowly down to the target section (via Lenis when it's
 * running); the link fades out once the visitor starts scrolling.
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
  const lenis = useLenis()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function go(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    scrollToSection(targetId, lenis, duration / 1000)
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={go}
      className={cn(
        'group absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 rounded-full px-4 py-2 text-foreground/70 transition-opacity duration-500 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <span className="hero-enter flex flex-col items-center gap-1.5" style={{ '--d': '1100ms' } as CSSProperties}>
        <span className="text-sm font-medium underline-offset-4 group-hover:underline">{label}</span>
        <ArrowDown className="scroll-cue-bob size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>

      <style>{`
        @keyframes scroll-cue-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(5px) } }
        .scroll-cue-bob { animation: scroll-cue-bob 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .scroll-cue-bob { animation: none; } }
      `}</style>
    </a>
  )
}