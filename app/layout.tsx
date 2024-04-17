import type { Metadata, NextPage } from 'next'
import { Inter } from 'next/font/google'

import { Provider } from '@/components/provider'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = siteConfig.meta

const RootLayout: NextPage<React.PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`font-sans ${inter.variable}`}>
      <Provider>
        {children}
        <Toaster />
      </Provider>
    </body>
  </html>
)

export default RootLayout
