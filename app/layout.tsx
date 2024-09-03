import '@/app/globals.css'

import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'
import { seo } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { SessionProvider } from '@/lib/session'
import { auth } from '@/server/auth'

export const metadata = seo({})
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(0, 0%, 100%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(240, 10%, 3.9%)' },
  ],
}

const RootLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const { session, user } = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`font-san`, GeistSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <SessionProvider session={session} user={user}>
            {children}
          </SessionProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
