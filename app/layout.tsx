import type { Metadata, Viewport } from 'next'
import { Caveat, Jost } from 'next/font/google'
import './globals.css'

const _caveat = Caveat({
  subsets: ['latin'],
})
const _jost = Jost({ subsets: ['latin'] })

export const metadata: Metadata = {
  // TODO: swap in your real domain once DNS is live — required for the
  // OG image URL below to resolve correctly when your link is shared.
  metadataBase: new URL('https://jasminetan.dev'),
  title: 'Jasmine Tan — CS student & aspiring product manager',
  description:
    'Portfolio of Jasmine Tan: 4th-year computer science student minoring in science + mathematics education, building products that teach.',
  openGraph: {
    title: 'Jasmine Tan — CS student & aspiring product manager',
    description:
      'Projects, experiments, and writing from a 4th-year CS student headed into product management.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jasmine Tan — Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jasmine Tan — CS student & aspiring product manager',
    description:
      'Projects, experiments, and writing from a 4th-year CS student headed into product management.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f9f7ec',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}