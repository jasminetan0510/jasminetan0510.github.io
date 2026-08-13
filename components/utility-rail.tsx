'use client'

import { AlertCircle, Lamp, Moon, Music, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// TODO: add your calming ambient audio file at this path (mp3 or ogg).
// Keep it a genuinely small file (a looping ~30–60s ambient track is plenty)
// so it doesn't slow down the initial page load.
const AUDIO_SRC = '/audio/ambient.mp3'

function railButtonClass() {
  return 'paper-edge flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-transform hover:-translate-y-0.5 active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
}

function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  // Distinguishes "the file is missing/broken" from "browser blocked
  // autoplay" or "user just hasn't pressed play yet" — previously all
  // three looked identical (button just silently did nothing).
  const [hasError, setHasError] = useState(false)

  function toggle() {
    const audio = audioRef.current
    if (!audio || hasError) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      // play() returns a promise that rejects if the browser blocks it —
      // this is triggered by a real click, so autoplay policies allow it.
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  const label = hasError
    ? 'Ambient audio file is missing — see /public/audio/ambient.mp3'
    : playing
      ? 'Pause background audio'
      : 'Play calming background audio'

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="none"
        onError={() => setHasError(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={label}
        title={label}
        disabled={hasError}
        className={`${railButtonClass()} ${hasError ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {hasError ? (
          <AlertCircle
            className="size-4.5 text-destructive"
            aria-hidden="true"
          />
        ) : playing ? (
          <Music className="size-4.5" aria-hidden="true" />
        ) : (
          <VolumeX
            className="size-4.5 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </button>
    </>
  )
}

function ThemeToggle() {
  // Start as null so we don't render a guess before we know the real
  // state (the blocking script in layout.tsx already set the class on
  // <html> before hydration, so we just read it back here).
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just
      // won't persist across reloads, which is fine.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark ?? false}
      aria-label={
        isDark
          ? 'Turn the lamp on (switch to light mode)'
          : 'Turn the lamp off (switch to dark mode)'
      }
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={railButtonClass()}
    >
      {isDark ? (
        <Moon className="size-4.5 text-muted-foreground" aria-hidden="true" />
      ) : (
        <Lamp className="size-4.5" aria-hidden="true" />
      )}
    </button>
  )
}

/**
 * Fixed vertical control rail, right edge of the viewport, stays visible
 * while scrolling. Houses the ambient-audio toggle and the light/dark
 * "lamp" toggle. Add more buttons here later using railButtonClass().
 */
export function UtilityRail() {
  return (
    <div className="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-6">
      <AudioToggle />
      <ThemeToggle />
    </div>
  )
}