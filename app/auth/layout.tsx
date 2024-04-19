import type { Metadata, NextPage } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { auth } from '@/server/auth'

export const metadata: Metadata = {
  title: 'Authorization',
  description: 'Authorization page for Egg Community',
  openGraph: {
    images: '/og?title=Authorization&description=Authorization page for Egg Community',
  },
}

const AuthLayout: NextPage<React.PropsWithChildren> = async ({ children }) => {
  const { user } = await auth()
  if (user) redirect('/')

  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-8">
        <Image src="/logo.svg" alt="logo" className="dark:invert" width={100} height={100} />
        <h1 className="text-4xl font-black">Egg Community</h1>
      </div>

      {children}
    </main>
  )
}

export default AuthLayout
