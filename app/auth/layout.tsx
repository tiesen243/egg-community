import { Typography } from '@/components/ui/typography'
import { auth } from '@/server/auth'
import { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Authorization',
  description: 'Authorization page for Egg Community',
  openGraph: {
    images: '/og?title=Authorization&description=Authorization page for Egg Community',
  },
}

const AuthLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const { user } = await auth()
  if (user) redirect('/')

  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-8">
        <Image src="/logo.svg" alt="logo" className="dark:invert" width={150} height={150} />
        <Typography variant="h1">Egg Community</Typography>
      </div>
      {children}
    </main>
  )
}

export default AuthLayout
