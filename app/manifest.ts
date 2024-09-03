import { seo } from '@/lib/seo'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo({}).applicationName!,
    short_name: seo({}).applicationName!,
    description: seo({}).description!,
    start_url: '/',
    display: 'standalone',
    background_color: 'hsl(0, 0%, 100%)',
    theme_color: 'hsl(240, 10%, 3.9%)',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
