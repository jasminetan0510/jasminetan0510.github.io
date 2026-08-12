import { FeaturedProjects } from '@/components/featured-projects'
import { Hero } from '@/components/hero'
import { Involvements } from '@/components/involvements'
import { Playground } from '@/components/playground'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { UtilityRail } from '@/components/utility-rail'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <main>
        <FeaturedProjects />
        <Involvements />
        <Playground />
      </main>
      <SiteFooter />
      <UtilityRail />
    </>
  )
}