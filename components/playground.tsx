'use client'

import { Dice5, Keyboard, Sticker } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { BoredButton } from '@/components/playground/bored-button'
import { StickerBoard } from '@/components/playground/sticker-board'
import { TypingTest } from '@/components/playground/typing-test'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

type TabId = 'stickers' | 'typing' | 'bored'

const tabs: { id: TabId; label: string; Icon: LucideIcon; blurb: string }[] = [
  {
    id: 'stickers',
    label: 'Sticker board',
    Icon: Sticker,
    blurb: 'Drag the stickers, add your own. Pointer + arrow keys both work.',
  },
  {
    id: 'typing',
    label: 'Typing test',
    Icon: Keyboard,
    blurb: 'Type the line, watch the wpm and accuracy update live.',
  },
  {
    id: 'bored',
    label: 'Bored button',
    Icon: Dice5,
    blurb: 'Press it when you’re stuck. It picks a small thing to go do.',
  },
]

export function Playground() {
  const [active, setActive] = useState<TabId>('stickers')
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0]

  return (
    <section
      id="playground"
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-5 py-16 sm:px-8"
    >
      <SectionHeading
        index="01"
        title="Playground"
        note="little things I build to think"
      />

      <PaperCard className="mt-8 p-4 sm:p-6">
        <Tape className="-top-3 left-8 -rotate-3" label="wip" />
        <Tape className="-top-3 right-10 rotate-2" />

        <div
          role="tablist"
          aria-label="Playground experiments"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
                active === tab.id
                  ? 'border-transparent bg-foreground text-background'
                  : 'border-input hover:bg-secondary',
              )}
            >
              <tab.Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{activeTab.blurb}</p>

        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="mt-4"
        >
          {active === 'stickers' ? <StickerBoard /> : null}
          {active === 'typing' ? <TypingTest /> : null}
          {active === 'bored' ? <BoredButton /> : null}
        </div>
      </PaperCard>
    </section>
  )
}
