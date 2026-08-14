'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

// Place the click sound file at public/audio/click.wav — anything in
// /public is served at the site root as-is, which sidesteps needing any
// bundler config for non-image asset imports (importing straight from
// lib/ would require a webpack/turbopack loader that isn't set up here).
const CLICK_SRC = '/audio/click.wav'

type SoundContextValue = {
  /** Whether sound fx are currently enabled. This is the single global
   *  audio switch for the page — there's no separate background music
   *  state anymore. */
  enabled: boolean
  toggle: () => void
  /** Plays the short click sound, if sound fx are enabled. Safe to call
   *  from any button's onClick. */
  playClick: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

/**
 * Wrap the app (or at least everything above SiteHeader/UtilityRail) in
 * this once, near the root layout, e.g.:
 *
 *   <SoundProvider>
 *     <SiteHeader />
 *     {children}
 *     <UtilityRail />
 *   </SoundProvider>
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  // Reused across plays rather than constructing a new Audio() per
  // click — cheaper, and currentTime is reset before each play so rapid
  // successive clicks retrigger cleanly instead of being dropped while
  // a previous play is still finishing.
  const clickRef = useRef<HTMLAudioElement | null>(null)

  const toggle = useCallback(() => setEnabled((v) => !v), [])

  const playClick = useCallback(() => {
    if (!enabled) return

    if (!clickRef.current) {
      const audio = new Audio(CLICK_SRC)
      audio.volume = 0.5
      clickRef.current = audio
    }

    const audio = clickRef.current
    audio.currentTime = 0
    audio.play().catch(() => {
      // Ignored — sound fx are non-critical, so a blocked/failed replay
      // just means the click stays silent rather than erroring the UI.
    })
  }, [enabled])

  const value = useMemo(
    () => ({ enabled, toggle, playClick }),
    [enabled, toggle, playClick],
  )

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return ctx
}