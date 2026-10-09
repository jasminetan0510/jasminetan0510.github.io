'use client'

import { FileText, Menu, Star, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { openContactForm } from '@/components/contact-modal'
import { SocialLinks } from '@/components/social-links'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/utils'

// All links are home-page sections, in page order. They start with "/#"
// so they also work from the project pages (navigate home, then jump).
const navLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Involvements', href: '/#involvements' },
]

/**
 * Floating "island" nav: a fixed, pill-shaped, translucent capsule.
 *
 * - Desktop (md+): section links in the pill; social icons from lg.
 * - Phones: name + "Get in touch" + a menu button. The menu opens a panel
 *   under the pill with the section links, Résumé and social icons. It
 *   closes on a link tap, Escape, or tapping outside.
 * - The link for the section you're reading is highlighted as you scroll.
 */
export function SiteHeader() {
  const lenis = useLenis()
  const pathname = usePathname()
  const onHome = pathname === '/'
  const active = useActiveSection(onHome, pathname)
  const [open, setOpen] = useState(false)

  // Close the mobile menu on Escape or when the route changes.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // On the home page, section links glide via Lenis/scrollToSection.
  // Elsewhere they navigate home and Next.js jumps to the section.
  function handleNavClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false)
    if (!href.startsWith('/#') || !onHome) return
    event.preventDefault()
    const id = href.slice(2)
    if (id === 'hero') {
      if (lenis) lenis.scrollTo(0, { duration: 1.3 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    scrollToSection(id, lenis, 1.3)
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-40 flex flex-col items-center px-3 sm:top-6 sm:px-4">
      <div
        className="
          group pointer-events-auto flex w-full max-w-5xl items-center justify-between
          gap-3 rounded-full border border-white/10 bg-background/70
          py-1.5 pr-1.5 pl-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          backdrop-blur-xl backdrop-saturate-150
          transition-[transform,box-shadow] duration-300 ease-out
          sm:gap-4 sm:py-2 sm:pr-2 sm:pl-8
          md:hover:scale-[1.015] md:hover:shadow-[0_8px_32px_rgba(0,0,0,0.14),0_0_14px_-8px_var(--ring)]
        "
      >
        <Link
          href="/#hero"
          onClick={(e) => handleNavClick(e, '/#hero')}
          className="eyebrow shrink-0 rounded-full py-1 text-foreground transition-colors hover:text-primary"
        >
          jasmine.tan
        </Link>

        <nav aria-label="Section navigation" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(2)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                data-active={isActive}
                aria-current={isActive ? 'true' : undefined}
                className="group/link eyebrow flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition-all duration-200 ease-out hover:scale-110 hover:text-primary data-[active=true]:text-foreground"
              >
                <Star
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary transition-all duration-200 group-data-[active=true]/link:fill-current"
                />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <SocialLinks className="hidden lg:flex" />
          <span aria-hidden="true" className="hidden h-5 w-px bg-foreground/15 lg:block" />
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-goatcounter-click="resume-click"
            className="hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-all duration-200 hover:scale-110 hover:text-primary md:inline-flex"
          >
            <FileText className="size-3.5" aria-hidden="true" />
            Resume
          </a>
          <button
            type="button"
            onClick={() => openContactForm()}
            data-goatcounter-click="contact-open"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_-2px_var(--ring)] active:scale-95"
          >
            Get in touch
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="pointer-events-auto fixed inset-0 -z-10 bg-foreground/10 md:hidden"
          />
          <div
            id="mobile-menu"
            className="pointer-events-auto mt-2 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-background/95 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Section navigation" className="flex flex-col">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(2)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-2xl px-4 py-3 text-base transition-colors hover:bg-secondary',
                      isActive ? 'text-foreground' : 'text-foreground/70',
                    )}
                  >
                    <Star aria-hidden="true" className={cn('size-4 text-primary', isActive && 'fill-current')} />
                    {link.label}
                  </Link>
                )
              })}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                data-goatcounter-click="resume-click"
                className="flex items-center gap-2.5 rounded-2xl px-4 py-3 text-base text-foreground/70 transition-colors hover:bg-secondary"
              >
                <FileText aria-hidden="true" className="size-4 text-primary" />
                Résumé
              </a>
            </nav>
            <div className="mt-1 flex items-center justify-between border-t border-foreground/10 px-3 pt-2">
              <span className="text-xs text-muted-foreground">Find me on</span>
              <SocialLinks />
            </div>
          </div>
        </>
      ) : null}
    </header>
  )
}

/**
 * Which home-page section the visitor is reading: the last section whose
 * top has passed a line 35% down the screen. Nothing is highlighted while
 * the hero is in view. On a project page, Projects is highlighted.
 */
function useActiveSection(onHome: boolean, pathname: string) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!onHome) {
      setActive(pathname.startsWith('/projects') ? 'projects' : null)
      return
    }
    const ids = navLinks.map((l) => l.href.slice(2))
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.35
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [onHome, pathname])

  return active
}