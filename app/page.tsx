import { FeaturedProjects } from '@/components/featured-projects'
import { Hero } from '@/components/hero'
import { Playground } from '@/components/playground'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <main>
        <FeaturedProjects />
        <Playground />
      </main>
      <SiteFooter />
    </>
  )
}