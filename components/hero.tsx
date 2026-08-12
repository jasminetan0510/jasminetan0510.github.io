'use client'

import { ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Tape } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

/**
 * Hero + polaroid, combined into one file since the polaroid only ever
 * appears here.
 */
export function Hero() {
  const [flipped, setFlipped] = useState(false)

  return (
    <header
      id="hero"
      className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pt-14 pb-16 sm:px-8 sm:pt-20 md:flex-row md:items-center md:justify-between md:gap-14"
    >
      <div className="flex max-w-xl flex-col gap-6 animate-hero-in">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          <span className="eyebrow text-muted-foreground">
            Open to PM &amp; Software Engineering roles
          </span>
        </div>

        <p className="eyebrow text-muted-foreground">
          Jasmine Tan — Portfolio
        </p>

        <h1 className="display text-5xl leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
          Hi, I&apos;m Jasmine :)
        </h1>

        <p className="font-sans text-xl leading-relaxed font-light text-muted-foreground sm:text-2xl lg:text-[1.75rem]">
          CS teaches me how to build. Education teaches me why it matters.
          Technology management keeps the business side in view — all
          toward tools that{' '}
          <span className="relative inline-block text-foreground">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2 -rotate-1 bg-highlight/80"
            />
            <span className="relative">
              make learning and working together easier
            </span>
          </span>
          .
        </p>

        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/85 sm:text-[0.95rem]">
          <p className="max-w-prose">
            I&apos;m a rising fourth-year at UCSB. I like working with
            people, building things, and chasing new ideas into real
            ventures.
          </p>
          <p className="max-w-prose">
            Outside of that, you can find me lifting at the gym, exploring the local outdoors, and experimenting in the kitchen!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            See the work
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#playground"
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Play with something
          </a>
        </div>
      </div>

      {/* Polaroid photo — click to flip to a short "currently" note */}
      <div className="relative mx-auto w-[15rem] shrink-0 sm:w-[16.5rem]">
        <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          aria-pressed={flipped}
          className={cn(
            'paper-edge group block w-full rounded-sm bg-card p-3 pb-10 text-left transition-transform duration-300 ease-out',
            flipped
              ? 'rotate-1'
              : '-rotate-2 hover:rotate-0 hover:scale-[1.02]',
          )}
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            {flipped ? (
              <div className="flex h-full flex-col justify-center gap-2 p-4">
                <p className="display text-xl leading-snug">
                  {/* TODO: adjust to whatever you're actually up to right now */}
                  Currently: building Caliber&apos;s ticket tracker and
                  getting SciTrek&apos;s scheduler ready for its fall launch.
                </p>
                <p className="text-xs text-muted-foreground">
                  {/* TODO: adjust to what you're actually looking for */}
                  Open to PM / APM opportunities — let&apos;s talk.
                </p>
              </div>
            ) : (
              // TODO: drop your own photo at public/images/polaroid-portrait.png
              // Recommended: a square-ish crop, at least 500x500px.
              <Image
                src="/images/polaroid-portrait.png"
                alt="Jasmine Tan"
                fill
                sizes="(max-width: 640px) 240px, 264px"
                className="object-cover"
                priority
              />
            )}
          </div>
          <p className="mt-3 eyebrow text-muted-foreground">
            {flipped ? 'click to flip back' : 'click me →'}
          </p>
        </button>
      </div>
    </header>
  )
}