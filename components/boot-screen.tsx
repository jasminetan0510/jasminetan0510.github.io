'use client'

import { useLenis } from 'lenis/react'
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

// Must match the header nav (components/site-header.tsx), in the same order.
const TABS = ['projects', 'experience', 'involvements']
// Normal speed: about 2.5s from first paint to fully open (well under
// recruiters' patience). Use ?boot=slow to test (see readSlowFactor).
const MIN_MS = 1300
const MAX_MS = 2400
const TYPE_START_MS = 150
const MS_PER_CHAR = 30 // 3 tabs ≈ 32 chars ≈ 1s of typing
const CLOSE_MS = 420
const OPEN_MS = 750

/**
 * Testing aid: ?boot=slow plays everything 4x slower, ?boot=<n> n times
 * slower (?boot=1 = normal speed). Any ?boot=… also forces the screen to
 * play even if it already ran this session (see lib/boot.ts).
 */
function readSlowFactor() {
  if (typeof window === 'undefined') return 1
  const v = new URLSearchParams(window.location.search).get('boot')
  if (v === null) return 1
  if (v === 'slow') return 4
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 1
}

type Phase = 'loading' | 'closing' | 'opening' | 'done'

export function BootScreen() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [typed, setTyped] = useState(0)
  const skipRef = useRef(false)
  const lenis = useLenis()
  // Read after mount (not during render) so server and client HTML match.
  const [slow, setSlow] = useState(1)
  useEffect(() => setSlow(readSlowFactor()), [])

  // Always open at the very top. Without this, a refresh restores the old
  // scroll position (or jumps to a #section left in the URL) behind the
  // loading screen, so the site appeared already scrolled down once it
  // opened. Lenis is paused while the screen is up so wheel/touch input
  // can't move the page underneath it either.
  useEffect(() => {
    if (phase === 'done') return
    if (phase === 'opening') {
      lenis?.start()
      lenis?.resize() // re-measure page height now that everything is laid out
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto'
      return
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (location.hash) history.replaceState(null, '', location.pathname + location.search)
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true, force: true })
    lenis?.stop()
  }, [phase, lenis])

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

    const f = slow
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
          timers.push(window.setTimeout(() => setPhase('done'), OPEN_MS * f))
        }, CLOSE_MS * f),
      )
    }

    const tick = (now: number) => {
      const elapsed = now - start
      const dt = (now - last) / 1000
      last = now
      const ready =
        skipRef.current || elapsed > MAX_MS * f || (loaded && fontsReady && elapsed > MIN_MS * f)
      // Ease toward 92% while waiting, then sprint to 100 once ready.
      const target = ready ? 100 : 92 * (1 - Math.exp(-elapsed / (MIN_MS * f * 0.45)))
      p += (target - p) * Math.min(1, dt * (ready ? 9 / f : 6 / f))
      if (ready && p > 99.4) p = 100

      setProgress(p)
      setTyped(
        skipRef.current
          ? totalChars
          : Math.max(0, Math.floor((elapsed - TYPE_START_MS * f) / (MS_PER_CHAR * f))),
      )

      if (p >= 100) {
        timers.push(window.setTimeout(finish, skipRef.current ? 0 : 160 * f))
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
  }, [slow])

  if (phase === 'done') return null

  let remaining = typed
  const opening = phase === 'opening'

  return (
    <div
      aria-hidden="true"
      className={cn('boot-screen fixed inset-0 z-[100]', opening && 'pointer-events-none')}
      // In slow test mode, switch off the 10s failsafe fade so it can't cut the test short.
      style={slow !== 1 ? { animation: 'none' } : undefined}
    >
      {/* The "screen" is two halves so it can split open from the middle. */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1/2 bg-foreground transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]',
          opening && '-translate-y-full',
        )}
        style={{ transitionDuration: `${OPEN_MS * slow}ms` }}
      />
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 h-1/2 bg-foreground transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]',
          opening && 'translate-y-full',
        )}
        style={{ transitionDuration: `${OPEN_MS * slow}ms` }}
      />

      {phase === 'closing' && (
        <div
          className="boot-line absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-background"
          style={{ animationDuration: `${CLOSE_MS * slow}ms` }}
        />
      )}

      {!opening && (
        <div
          className={cn('absolute inset-0 text-background', phase === 'closing' && 'boot-crt-off')}
          style={phase === 'closing' ? { animationDuration: `${CLOSE_MS * slow}ms` } : undefined}
        >
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

/**
 * Drop on any page other than the home page (About, project pages). If a
 * visitor lands there first, e.g. from a link on LinkedIn, then clicks
 * through to the home page, the loading screen won't suddenly play
 * mid-visit. It marks the session as booted, same as the screen itself.
 */
export function SkipBoot() {
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-boot-skip', '1')
    html.setAttribute('data-booted', '1')
    try {
      sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    } catch {}
  }, [])
  return null
}