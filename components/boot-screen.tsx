'use client'

import { useEffect, useRef, useState } from 'react'
import { BOOT_EVENT, BOOT_SESSION_KEY } from '@/lib/boot'
import { cn } from '@/lib/utils'

/**
 * "Loading the app" intro, shown once per tab session.
 *
 * 1. loading  — name + progress bar on an ink screen; the nav tabs type
 *               themselves out in the top-right corner (same spot as the
 *               real header nav, so the hand-off feels continuous).
 * 2. closing  — the screen switches off like an old CRT: content squashes
 *               to a bright line, the line shrinks to a dot.
 * 3. opening  — the screen splits open from that line, revealing the
 *               site. html[data-booted] is set here, which starts the hero
 *               entrance (see globals.css).
 *
 * Progress follows real loading (window load + web fonts), clamped between
 * MIN_MS and MAX_MS so it never drags. Any key or click skips ahead.
 * Purely decorative, so the whole overlay is aria-hidden; the page
 * underneath is fully server-rendered for crawlers and screen readers.
 */

const TABS = ['projects', 'experience', 'impact', 'education', 'involvements']
const MIN_MS = 4200        // was 1600
const MAX_MS = 6000        // was 3200
const TYPE_START_MS = 500  // was 250
const MS_PER_CHAR = 75     // was 32 (tabs finish typing ~4.2s in)
const CLOSE_MS = 700       // was 420; keep in sync with globals.css
const OPEN_MS = 1200       // was 750

type Phase = 'loading' | 'closing' | 'opening' | 'done'

export function BootScreen() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [typed, setTyped] = useState(0)
  const skipRef = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    if (html.hasAttribute('data-boot-skip')) {
      setPhase('done')
      return
    }

    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'

    let loaded = document.readyState === 'complete'
    let fontsReady = !document.fonts
    const onLoad = () => (loaded = true)
    const skip = () => (skipRef.current = true)
    window.addEventListener('load', onLoad)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    document.fonts?.ready.then(() => (fontsReady = true))

    const totalChars = TABS.join('').length
    const timers: number[] = []
    const start = performance.now()
    let last = start
    let p = 0
    let raf = 0

    const finish = () => {
      setPhase('closing')
      timers.push(
        window.setTimeout(() => {
          setPhase('opening')
          html.setAttribute('data-booted', '1')
          html.style.overflow = prevOverflow
          try {
            sessionStorage.setItem(BOOT_SESSION_KEY, '1')
          } catch {}
          window.dispatchEvent(new Event(BOOT_EVENT))
          timers.push(window.setTimeout(() => setPhase('done'), OPEN_MS))
        }, CLOSE_MS),
      )
    }

    const tick = (now: number) => {
      const elapsed = now - start
      const dt = (now - last) / 1000
      last = now
      const ready =
        skipRef.current || elapsed > MAX_MS || (loaded && fontsReady && elapsed > MIN_MS)
      // Ease toward 92% while waiting, then sprint to 100 once ready.
      const target = ready ? 100 : 92 * (1 - Math.exp(-elapsed / (MIN_MS * 0.45)))
      p += (target - p) * Math.min(1, dt * (ready ? 4 : 6))
      if (ready && p > 99.4) p = 100

      setProgress(p)
      setTyped(
        skipRef.current
          ? totalChars
          : Math.max(0, Math.floor((elapsed - TYPE_START_MS) / MS_PER_CHAR)),
      )

      if (p >= 100) {
        timers.push(window.setTimeout(finish, skipRef.current ? 0 : 400)) // was 180
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      html.style.overflow = prevOverflow
    }
  }, [])

  if (phase === 'done') return null

  let remaining = typed
  const opening = phase === 'opening'

  return (
    <div
      aria-hidden="true"
      className={cn('boot-screen fixed inset-0 z-[100]', opening && 'pointer-events-none')}
    >
      {/* The "screen" is two halves so it can split open from the middle. */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1/2 bg-foreground transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
          opening && '-translate-y-full',
        )}
      />
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 h-1/2 bg-foreground transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
          opening && 'translate-y-full',
        )}
      />

      {phase === 'closing' && (
        <div className="boot-line absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-background" />
      )}

      {!opening && (
        <div className={cn('absolute inset-0 text-background', phase === 'closing' && 'boot-crt-off')}>
          <p className="absolute top-6 left-8 hidden text-sm font-medium sm:block">jasmine.tan</p>

          {/* Tabs type out left to right. Each word reserves its full width
              (invisible copy underneath) so nothing shifts while typing. */}
          <nav className="absolute top-6 right-4 left-4 flex justify-end gap-2.5 text-[11px] sm:left-auto sm:right-8 sm:gap-6 sm:text-sm">
            {TABS.map((tab) => {
              const shown = Math.min(Math.max(remaining, 0), tab.length)
              remaining -= tab.length
              const typing = shown > 0 && shown < tab.length
              return (
                <span key={tab} className="relative whitespace-nowrap">
                  <span className="invisible">{tab}</span>
                  <span className="absolute inset-y-0 left-0">
                    {tab.slice(0, shown)}
                    {typing && (
                      <span className="boot-caret ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-background" />
                    )}
                  </span>
                </span>
              )
            })}
          </nav>

          <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
            <p className="display text-5xl leading-none sm:text-7xl">Jasmine Tan</p>
            <div className="h-[3px] w-[min(22rem,70vw)] overflow-hidden rounded-full bg-background/20">
              <div className="h-full rounded-full bg-background" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs tabular-nums text-background/60">
              loading portfolio… {Math.round(progress)}%
            </p>
          </div>

          <p className="absolute inset-x-0 bottom-6 text-center text-[11px] text-background/40">
            press any key to skip
          </p>
        </div>
      )}
    </div>
  )
}