'use client'

import { Shuffle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Idea = {
  text: string
  tag: string
}

const ideas: Idea[] = [
  { text: 'Text someone the last photo in your camera roll with zero context.', tag: 'social' },
  { text: 'Learn to say “thank you” in a language you don’t speak.', tag: 'learn' },
  { text: 'Draw your current view in under 60 seconds. No erasing.', tag: 'make' },
  { text: 'Rearrange the five nearest objects by color.', tag: 'tidy' },
  { text: 'Write a one-sentence review of the last thing you ate.', tag: 'write' },
  { text: 'Look up the etymology of the word you’ve said most today.', tag: 'learn' },
  { text: 'Stretch your hands and neck for a full 30 seconds. Actually time it.', tag: 'reset' },
  { text: 'Find a song from the year you were born and play it loud.', tag: 'music' },
  { text: 'Name three things you can hear right now.', tag: 'reset' },
  { text: 'Open a map to a random country and pick where you’d get lunch.', tag: 'explore' },
  { text: 'Fold one thing that’s been sitting unfolded for too long.', tag: 'tidy' },
  { text: 'Invent a fake holiday for today and decide how it’s celebrated.', tag: 'make' },
  { text: 'Message a friend one genuine thing you appreciate about them.', tag: 'social' },
  { text: 'Try to recreate a snack you like using only what’s in the kitchen.', tag: 'make' },
  { text: 'Read the first paragraph of a Wikipedia “random article”.', tag: 'learn' },
  { text: 'Set a two-minute timer and do nothing at all. Just sit.', tag: 'reset' },
  { text: 'Write down one thing you want to remember about this week.', tag: 'write' },
  { text: 'Teach yourself to whistle a scale, or fail loudly trying.', tag: 'learn' },
  { text: 'Reorganize your phone’s home screen like it’s a fresh start.', tag: 'tidy' },
  { text: 'Pick a color and find five of it in the room without moving much.', tag: 'reset' },
]

const tagTone: Record<string, string> = {
  social: 'oklch(0.87 0.008 90 / 80%)',
  learn: 'oklch(0.91 0.008 90 / 80%)',
  make: 'var(--tape)',
  tidy: 'oklch(0.89 0.008 90 / 80%)',
  write: 'oklch(0.91 0.008 90 / 80%)',
  reset: 'oklch(0.89 0.008 90 / 80%)',
  music: 'oklch(0.87 0.008 90 / 80%)',
  explore: 'var(--tape)',
}

function pickIndex(exclude: number): number {
  if (ideas.length < 2) return 0
  let next = Math.floor(Math.random() * ideas.length)
  while (next === exclude) {
    next = Math.floor(Math.random() * ideas.length)
  }
  return next
}

export function BoredButton() {
  const [index, setIndex] = useState<number | null>(null)
  const [count, setCount] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const idea = index === null ? null : ideas[index]

  function handleClick() {
    setIndex((prev) => pickIndex(prev ?? -1))
    setCount((c) => c + 1)
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-64 w-full flex-col items-center justify-center gap-5 rounded-sm border border-dashed border-input bg-secondary/60 p-6 text-center sm:min-h-72">
        {idea === null ? (
          <p className="max-w-sm display text-2xl leading-snug text-balance text-muted-foreground">
            Bored? Press the button. It’ll hand you something small to do.
          </p>
        ) : (
          <div
            key={animKey}
            className="bored-pop flex max-w-md flex-col items-center gap-3"
          >
            <span
              style={{ backgroundColor: tagTone[idea.tag] ?? 'var(--tape)' }}
              className="rounded-full px-2.5 py-0.5 eyebrow text-[10px] text-foreground/60"
            >
              {idea.tag}
            </span>
            <p className="display text-2xl leading-snug text-balance sm:text-3xl">
              {idea.text}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-transparent bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform',
            'hover:-translate-y-0.5 active:translate-y-0',
          )}
        >
          <Shuffle className="size-4" aria-hidden="true" />
          {idea === null ? 'I’m bored' : 'Something else'}
        </button>
      </div>

      <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 eyebrow text-muted-foreground">
        <div className="flex gap-1.5">
          <dt>ideas tried</dt>
          <dd className="text-foreground">{count}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>in the jar</dt>
          <dd className="text-foreground">{ideas.length}</dd>
        </div>
      </dl>
    </div>
  )
}
