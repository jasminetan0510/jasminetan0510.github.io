import type React from 'react'
import { cn } from '@/lib/utils'

/** Simple inline GitHub mark — shared by the header and footer contact buttons. */
export function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.98-.88-2.98-2.86 0-.83.3-1.51.79-2.04-.1-.25-.35-1.02.08-2.12 0 0 .64-.2 2.1.78a5.9 5.9 0 0 1 1.6-.22c.54 0 1.09.07 1.6.22 1.46-.99 2.1-.78 2.1-.78.43 1.1.18 1.87.09 2.12.49.53.79 1.2.79 2.04 0 1.99-1.21 2.66-2.99 2.86.31.27.58.79.58 1.6 0 1.15-.01 2.08-.01 2.37 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

const tapeTones = {
  mint: 'var(--tape)',
  blush: 'oklch(0.87 0.01 60 / 78%)',
  butter: 'oklch(0.91 0.01 90 / 78%)',
} as const

/** A strip of washi tape. Position it with className (e.g. "-top-3 left-6 -rotate-3"). */
export function Tape({
  className,
  label,
  tone = 'mint',
}: {
  className?: string
  label?: string
  tone?: keyof typeof tapeTones
}) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: tapeTones[tone] }}
      className={cn(
        'tape-strip flex items-center justify-center rounded-[2px] eyebrow text-[10px] text-foreground/45',
        className,
      )}
    >
      {label}
    </span>
  )
}

export function SectionHeading({
  index,
  title,
  note,
}: {
  index: string
  title: React.ReactNode
  note?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <span className="eyebrow text-primary">{index}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        {note ? (
          <p className="eyebrow text-right text-muted-foreground">{note}</p>
        ) : null}
      </div>
      <h2 className="display text-4xl leading-[1.02] text-balance sm:text-5xl">
        {title}
      </h2>
    </div>
  )
}

/**
 * Splits text into individual letters, each with a staggered delay, so a
 * "merry-go-round" bob-and-tilt animation ripples across the word on hover
 * (see the letter-carousel keyframe in globals.css). Only plays while
 * hovered — CSS-driven, no JS needed.
 */
export function CarouselText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <span className={cn('group inline-block cursor-default', className)}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 60}ms` }}
          className={cn(
            'carousel-letter inline-block [animation-duration:0.6s] [animation-iteration-count:infinite]',
            '[animation-name:none] [animation-timing-function:ease-in-out]',
            'group-hover:[animation-name:letter-carousel]',
          )}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

/** Paper card with a slightly off-kilter, taped-down feel. */
export function PaperCard({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'paper-edge relative rounded-sm border border-border bg-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}