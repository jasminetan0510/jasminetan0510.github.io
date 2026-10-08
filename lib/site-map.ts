import type { MetadataRoute } from 'next'

const SITE = 'https://jasminetan.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}