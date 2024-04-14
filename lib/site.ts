import { HomeIcon, RssIcon, SearchIcon, UserIcon } from 'lucide-react'

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const siteConfig = {
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
  navs: [
    {
      label: HomeIcon,
      href: '/',
      order: 1,
    },
    {
      label: RssIcon,
      href: '/following',
      order: 1,
    },
    {
      label: SearchIcon,
      href: '/search',
      order: 1,
    },
    {
      label: UserIcon,
      href: '/profile',
      order: 3,
    },
  ],
}
