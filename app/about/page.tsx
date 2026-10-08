import type { Metadata } from 'next'
import { SkipBoot } from '@/components/boot-screen'
import { EducationTeaching } from '@/components/education-teaching'
import { Involvements } from '@/components/involvements'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ToolkitSection } from '@/components/toolkit-section'

/**
 * /about: everything that's about who Jasmine is rather than proof of
 * work, moved off the home page so it can stay a one-minute skim.
 */
export const metadata: Metadata = {
  title: 'About — Jasmine Tan',
  description:
    'Education, teaching, toolkit, and involvements: CS at UC Santa Barbara with a minor in science + mathematics education.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <SkipBoot />
      <SiteHeader />
      <main>
        <section className="bg-accent pt-28 pb-10 sm:pt-32 sm:pb-14">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            <p className="eyebrow text-muted-foreground">About</p>
            <h1 className="display mt-3 text-4xl leading-[1.02] text-balance sm:text-5xl">
              A bit more about me
            </h1>
            {/* TODO: rewrite in your own voice; a few sentences is plenty. */}
            <p className="mt-5 max-w-2xl text-lg leading-snug font-light text-foreground/80 sm:text-xl">
              I&apos;m a computer science student at UC Santa Barbara, minoring in science and
              mathematics education. My favorite problems sit between people and process, which is
              why I keep ending up building products that teach and tools that give people time back.
            </p>
          </div>
        </section>
        <EducationTeaching />
        <ToolkitSection />
        <Involvements />
      </main>
      <SiteFooter />
    </>
  )
}