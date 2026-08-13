'use client'

import { Dice5, Keyboard, Sticker, UserRoundPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { BoredButton } from '@/components/playground/bored-button'
import { CharacterCreator } from '@/components/playground/character-creator'
import { StickerBoard } from '@/components/playground/sticker-board'
import { TypingTest } from '@/components/playground/typing-test'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import {
  CarouselText,
  PaperCard,
  SectionHeading,
  Tape,
} from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type TabId = 'stickers' | 'typing' | 'bored' | 'character'

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
  {
    id: 'character',
    label: 'Make a character',
    Icon: UserRoundPlus,
    blurb:
      'Design a little pixel character and save it — it\u2019ll join the others walking at the bottom of the page.',
  },
]

export function Playground() {
  const [active, setActive] = useState<TabId>('stickers')
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0]

  return (
    <section
      id="playground"
      className="relative scroll-mt-8 overflow-hidden bg-[#e5edf0]"
    >
      <ParallaxBackdrop variant="seabreeze" speed={0.2} />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <SectionHeading
            index="04"
            title={<CarouselText text="Playground" />}
            note="little things I build to think"
          />
        </Reveal>

        <PaperCard className="mt-8 p-5 sm:mt-10 sm:p-8">
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

          <p className="mt-4 text-sm text-muted-foreground">
            {activeTab.blurb}
          </p>

          <div
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            className="mt-4"
          >
            {active === 'stickers' ? <StickerBoard /> : null}
            {active === 'typing' ? <TypingTest /> : null}
            {active === 'bored' ? <BoredButton /> : null}
            {active === 'character' ? <CharacterCreator /> : null}
          </div>
        </PaperCard>
      </div>
    </section>
  )
}