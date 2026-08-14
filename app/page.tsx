import { Currently } from '@/components/currently'
import { EasterEgg } from '@/components/easter-egg'
import { FeaturedProjects } from '@/components/featured-projects'
import { Hero } from '@/components/hero'
import { ImpactStats } from '@/components/impact-stats'
import { ImpactAndTestimonials } from '@/components/impact-and-testimonials'
import { Involvements } from '@/components/involvements'
import { Playground } from '@/components/playground'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Testimonials } from '@/components/testimonials'
import { UtilityRail } from '@/components/utility-rail'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <Currently />
      <ImpactAndTestimonials />
      {/* <ImpactStats /> */}
      <main>
        <FeaturedProjects />
        {/* <Testimonials /> */}
        <Involvements />
        <Playground />
      </main>
      <SiteFooter />
      <UtilityRail />
      <EasterEgg />
    </>
  )
}