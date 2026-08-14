'use client'

import { Download, Star } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useSound } from '@/components/sound-provider'

const navLinks = [
  { label: 'Projects', href: '#projects', num: '02' },
  { label: 'Involvements', href: '#involvements', num: '04' },
  { label: 'Playground', href: '#playground', num: '05' },
]

/**
 * Floating "island" nav bar, inspired by the iPhone Dynamic Island: a
 * fixed, pill-shaped, translucent capsule that hovers above the page
 * content and never shifts position as the user scrolls.
 *
 * Two layers of hover feedback: the whole pill grows and glows slightly
 * when the cursor is anywhere over it, and each clickable item inside
 * *also* grows/glows further on its own hover, on top of the container's
 * effect — so the closer you get to something clickable, the more it
 * invites the click.
 */
export function SiteHeader() {
  const lenis = useLenis()
  const { playClick } = useSound()

  // Anchor links jump instantly by default — Lenis only smooths wheel/
  // programmatic scroll, not native <a href="#..."> clicks. Route them
  // through lenis.scrollTo() instead. If Lenis isn't mounted (e.g. the
  // visitor has prefers-reduced-motion set, so SmoothScroll renders
  // nothing), skip preventDefault and let the native anchor jump happen —
  // that's the correct, motion-respecting fallback.
  function handleAnchorClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) {
    if (!lenis) return
    event.preventDefault()
    lenis.scrollTo(hash, { offset: -16, duration: 1.3 })
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 sm:top-6">
      <div
        className="
          group pointer-events-auto flex w-full max-w-5xl items-center justify-between
          gap-4 rounded-full border border-white/10 bg-background/30
          px-6 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          backdrop-blur-xl backdrop-saturate-150
          transition-[transform,box-shadow] duration-300 ease-out
          hover:scale-[1.015]
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.14),0_0_14px_-8px_var(--ring)]
          sm:px-8
        "
      >
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className="eyebrow shrink-0 rounded-full px-2 py-1 text-foreground transition-all duration-200 ease-out hover:scale-110 hover:text-primary hover:drop-shadow-[0_0_8px_var(--ring)]"
        >
          jasmine.tan
        </a>

        <nav
          aria-label="Section navigation"
          className="hidden items-center gap-2 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                playClick()
                handleAnchorClick(e, link.href)
              }}
              className="group/link eyebrow flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition-all duration-200 ease-out hover:scale-110 hover:text-primary hover:drop-shadow-[0_0_8px_var(--ring)]"
            >
              <Star className="w-4 h-4 text-primary shrink-0 transition-all duration-200 ease-out group-hover/link:drop-shadow-[0_0_6px_var(--ring)]" />
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href="/resume.pdf"
            download
            className="hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-all duration-200 ease-out hover:scale-110 hover:text-primary hover:drop-shadow-[0_0_8px_var(--ring)] sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Download Resume
          </a>
          <a
            href="#contact"
            onClick={(e) => handleAnchorClick(e, '#contact')}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_0_22px_-2px_var(--ring)] active:scale-95"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}