import { HomeIcon, RssIcon, SearchIcon, type LucideIcon } from 'lucide-react'
import type { Metadata, Viewport } from 'next'

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://egg-community.vercel.app`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

interface SiteConfig {
  meta: Metadata
  viewport: Viewport
  navs: { label: LucideIcon; href: string }[]
}

export const siteConfig: SiteConfig = {
  meta: {
    metadataBase: new URL(getBaseUrl()),
    applicationName: 'Egg Community',
    title: {
      default: 'Egg Community',
      template: '%s | Egg Community',
    },
    description:
      'A simple socials platform for egg antifan built with Next.js, ElysiaJS, and TailwindCSS',
    authors: { name: 'Tiesen', url: 'https://tiesen.id.vn' },
    openGraph: {
      images: '/og?title=Welcome to Egg Community',
      url: getBaseUrl(),
      locale: 'vi_VN',
      type: 'website',
      siteName: 'Egg Community',
    },
    twitter: {
      site: '@tiesen243',
      card: 'summary_large_image',
      images: '/og?title=Welcome to Egg Community',
    },
    icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
    alternates: { canonical: getBaseUrl() },
  },

  viewport: {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'hsl(0 0% 100%)' },
      { media: '(prefers-color-scheme: dark)', color: 'hsl(240 10% 3.9%)' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },

  navs: [
    {
      label: HomeIcon,
      href: '/',
    },
    {
      label: RssIcon,
      href: '/following',
    },
    {
      label: SearchIcon,
      href: '/search',
    },
  ],
}
