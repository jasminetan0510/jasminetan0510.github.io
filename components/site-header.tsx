import { Download } from 'lucide-react'
import { Star } from "lucide-react";

const navLinks = [
  { label: 'Projects', href: '#projects', num: '02' },
  { label: 'Involvements', href: '#involvements', num: '04' },
  { label: 'Playground', href: '#playground', num: '05' },
]

/**
 * Floating "island" nav bar, inspired by the iPhone Dynamic Island:
 * a fixed, pill-shaped, translucent capsule that hovers above the
 * page content and never shifts position as the user scrolls.
 */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 sm:top-6">
      <div
        className="
          pointer-events-auto flex w-full max-w-5xl items-center justify-between
          gap-4 rounded-full border border-white/10 bg-background/30
          px-6 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          backdrop-blur-xl backdrop-saturate-150
          sm:px-8
        "
      >
        <a
          href="#hero"
          className="eyebrow shrink-0 text-foreground transition-colors hover:text-primary"
        >
          jasmine.tan
        </a>

        <nav
          aria-label="Section navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="eyebrow flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Star className="w-4 h-4 text-primary shrink-0" />
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href="/resume.pdf"
            download
            className="hidden items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Download Resume
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}