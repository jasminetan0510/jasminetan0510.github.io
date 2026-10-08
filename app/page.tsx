import { BootScreen } from '@/components/boot-screen'
import { EasterEgg } from '@/components/easter-egg'
import { ExperienceTimeline } from '@/components/experience-timeline'
import { FeaturedProjects } from '@/components/featured-projects'
import { Hero } from '@/components/hero'
import { Involvements } from '@/components/involvements'
import { PullQuote } from '@/components/pull-quote'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

/**
 * Home: the whole site on one page. Proof of work first (projects), then
 * roles and involvements, then one teammate quote right before the
 * footer's call to action. Each project has its own case-study page at
 * /projects/<slug>, where all teammate quotes live next to their project.
 */
export default function Page() {
  return (
    <>
      {/* Home page only, so other pages never play the loading screen. */}
      <BootScreen />
      <SiteHeader />
      <Hero />
      <main>
        <FeaturedProjects />
        <ExperienceTimeline />
        <Involvements />
        <PullQuote />
      </main>
      <SiteFooter />
      <EasterEgg />
    </>
  )
}