/**
 * schema.org Person data so search engines can connect jasminetan.dev,
 * GitHub, and LinkedIn as the same person. Render once, in layout.tsx.
 */
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jasmine Tan',
  url: 'https://jasminetan.dev',
  image: 'https://jasminetan.dev/images/headshot2.png',
  email: 'mailto:jasminetan0510@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA' },
  jobTitle: 'Software Developer',
  worksFor: { '@type': 'Organization', name: 'Caliber Research Group' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of California, Santa Barbara',
    sameAs: 'https://www.ucsb.edu',
  },
  knowsAbout: ['Product management', 'Software engineering', 'Education technology'],
  sameAs: ['https://github.com/jasminetan0510', 'https://www.linkedin.com/in/jasminetan555'],
}

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: every value is a literal above.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  )
}