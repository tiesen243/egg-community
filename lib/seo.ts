import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'
import type { Metadata } from 'next'

import { getBaseUrl } from './utils'

interface Seo {
  title?: string
  description?: string
  images?: OpenGraph['images']
  url?: string
}

export const seo = (params: Seo): Metadata => {
  const title = params.title ? `${params.title} | Egg Community` : 'Egg Community'
  const description =
    params.description ??
    'A simple socials platform for egg antifan built with Next.js, ElysiaJS, and TailwindCSS'
  const images = params.images ?? ['/api/og?title=Welcome to Egg Community']
  const url = params.url ? `${getBaseUrl()}${params.url}` : getBaseUrl()

  return {
    metadataBase: new URL(getBaseUrl()),
    applicationName: 'Egg Community',
    title,
    description,
    authors: { name: 'Tiesen', url: 'https://tiesen.id.vn' },
    openGraph: { title, url, images, type: 'website' },
    twitter: {
      site: '@tiesen243',
      card: 'summary_large_image',
    },
    icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
    alternates: { canonical: url },
  }
}
