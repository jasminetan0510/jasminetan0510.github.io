import { BootScreen } from '@/components/boot-screen'
import { Currently } from '@/components/currently'
import { EasterEgg } from '@/components/easter-egg'
import { EducationTeaching } from '@/components/education-teaching'
import { ExperienceTimeline } from '@/components/experience-timeline'
import { FeaturedProjects } from '@/components/featured-projects'
import { Hero } from '@/components/hero'
import { ImpactStats } from '@/components/impact-stats'
import { ImpactAndTestimonials } from '@/components/impact-and-testimonials'
import { Involvements } from '@/components/involvements'
// import { Playground } from '@/components/playground'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Testimonials } from '@/components/testimonials'
import { UtilityRail } from '@/components/utility-rail'
import { Toolkit } from '@/components/toolkit'

export default function Page() {
  return (
    <>
      {/* Home page only, so other pages never play the loading screen. */}
      <BootScreen />
      <SiteHeader />
      <Hero />
      {/* <Currently /> */}
      {/* <ImpactStats /> */}
      <main>
        <FeaturedProjects /> {/* 01 */}
        <ExperienceTimeline /> {/* 02 */}
        <ImpactAndTestimonials /> {/* 03: update its SectionHeading index */}
        {/* <Toolkit /> */}
        {/* <Testimonials /> */}
        <EducationTeaching /> {/* 04 */}
        <Involvements /> {/* 05: update its SectionHeading index */}
        {/* <Playground /> */}
      </main>
      <SiteFooter />
      {/* <UtilityRail /> */}
      <EasterEgg />
    </>
  )
}