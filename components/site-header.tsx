'use client'

import { Download, Star } from 'lucide-react'
import { useLenis } from 'lenis/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { openContactForm } from '@/components/contact-modal'
import { SocialLinks } from '@/components/social-links'

// All links are home-page sections, in page order. They start with "/#"
// so they also work from the project pages (navigate home, then jump).
const navLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Involvements', href: '/#involvements' },
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
 *
 * Section links show from md (768px); the social icons join from lg
 * (1024px).
 * The footer still links GitHub and LinkedIn on small screens.
 */
export function SiteHeader() {
  const lenis = useLenis()
  const pathname = usePathname()
  const onHome = pathname === '/'

  // Anchor links jump instantly by default — Lenis only smooths wheel/
  // programmatic scroll, not native <a href="#..."> clicks. Route them
  // through lenis.scrollTo() instead. If Lenis isn't mounted (e.g. the
  // visitor has prefers-reduced-motion set, so SmoothScroll renders
  // nothing), skip preventDefault and let the native anchor jump happen —
  // that's the correct, motion-respecting fallback.
  //
  // Off the home page, section links ("/#projects") just navigate home and
  // Next.js scrolls to the section.
  function handleNavClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (!href.startsWith('/#') || !onHome || !lenis) return
    event.preventDefault()
    lenis.scrollTo(href.slice(1), { offset: -16, duration: 1.3 })
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
        <Link
          href="/#hero"
          onClick={(e) => handleNavClick(e, '/#hero')}
          className="eyebrow shrink-0 rounded-full px-2 py-1 text-foreground transition-all duration-200 ease-out hover:scale-110 hover:text-primary hover:drop-shadow-[0_0_8px_var(--ring)]"
        >
          jasmine.tan
        </Link>

        <nav
          aria-label="Section navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group/link eyebrow flex items-center gap-1.5 rounded-full px-3 py-1.5 aria-[current=page]:text-foreground text-muted-foreground transition-all duration-200 ease-out hover:scale-110 hover:text-primary hover:drop-shadow-[0_0_8px_var(--ring)]"
            >
              <Star className="w-4 h-4 text-primary shrink-0 transition-all duration-200 ease-out group-hover/link:drop-shadow-[0_0_6px_var(--ring)]" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <SocialLinks className="hidden lg:flex" />
          <span aria-hidden="true" className="hidden h-5 w-px bg-foreground/15 lg:block" />
          <a
            href="/resume.pdf"
            download
            data-goatcounter-click="resume-click"
            className="hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-all duration-200 ease-out hover:scale-110 hover:text-primary hover:drop-shadow-[0_0_8px_var(--ring)] sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Resume
          </a>
          <button
            type="button"
            onClick={() => openContactForm()}
            data-goatcounter-click="contact-open"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_0_22px_-2px_var(--ring)] active:scale-95"
          >
            Get in touch
          </button>
        </div>
      </div>
    </header>
  )
}