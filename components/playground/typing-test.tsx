'use client'

import { RotateCcw } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const prompts = [
  'good products start with a clear problem statement',
  'ship small, measure honestly, then decide what is next',
  'teaching something is the fastest way to learn it',
]

export function TypingTest() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const target = prompts[promptIndex]
  const done = typed.length >= target.length

  const stats = useMemo(() => {
    const minutes = elapsed / 60000
    const correct = typed
      .split('')
      .filter((char, index) => char === target[index]).length
    const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100
    const wpm = minutes > 0 ? Math.round(typed.length / 5 / minutes) : 0
    return { accuracy, wpm }
  }, [elapsed, typed, target])

  function handleChange(value: string) {
    if (value.length > target.length) return
    const now = performance.now()
    if (startedAt === null) {
      setStartedAt(now)
      setTyped(value)
      return
    }
    setElapsed(now - startedAt)
    setTyped(value)
  }

  function reset(next = false) {
    setTyped('')
    setStartedAt(null)
    setElapsed(0)
    if (next) setPromptIndex((i) => (i + 1) % prompts.length)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="flex h-64 w-full flex-col justify-center gap-5 rounded-sm border border-dashed border-input bg-secondary/60 px-5 text-left sm:h-72 sm:px-8"
      >
        <p className="eyebrow text-muted-foreground">
          click here, then type the line
        </p>
        <p className="display text-2xl leading-relaxed text-pretty sm:text-3xl">
          {target.split('').map((char, index) => {
            const typedChar = typed[index]
            const state =
              typedChar === undefined
                ? 'pending'
                : typedChar === char
                  ? 'correct'
                  : 'wrong'
            return (
              <span
                key={`${index}-${char}`}
                className={cn(
                  state === 'pending' && 'text-foreground/25',
                  state === 'correct' && 'text-foreground',
                  state === 'wrong' && 'bg-destructive/15 text-destructive',
                  index === typed.length &&
                    'border-l-2 border-primary text-foreground/25',
                  // Bounce the character that was *just* typed. Each span
                  // only ever gets this class once (as it becomes the most
                  // recent), so the CSS animation fires cleanly with no JS timer.
                  index === typed.length - 1 && 'animate-bounce-up',
                )}
              >
                {char}
              </span>
            )
          })}
        </p>
        {done ? (
          <p className="eyebrow text-primary">
            done — {stats.wpm} wpm at {stats.accuracy}% accuracy
          </p>
        ) : null}
      </button>

      <input
        ref={inputRef}
        value={typed}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Type the prompt above"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 eyebrow text-muted-foreground">
        <span>
          wpm <span className="text-foreground">{stats.wpm || '—'}</span>
        </span>
        <span>
          accuracy <span className="text-foreground">{stats.accuracy}%</span>
        </span>
        <button
          type="button"
          onClick={() => reset(false)}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          restart
        </button>
        <button
          type="button"
          onClick={() => reset(true)}
          className="ml-auto transition-colors hover:text-foreground"
        >
          new line →
        </button>
      </div>
    </div>
  )
}
