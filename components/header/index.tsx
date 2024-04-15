import Image from 'next/image'
import Link from 'next/link'

import { auth } from '@/server/auth'
import { Tabs } from '../tabs'
import { Menu } from './menu'

export const Header: React.FC = async () => {
  const { user } = await auth()
  return (
    <header className="sticky inset-0 z-50 bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150">
      <div className="container flex grid-cols-3 place-items-center justify-between gap-4 md:grid">
        <Link href="/" className="flex items-center justify-start gap-2">
          <Image
            src="/logo.svg"
            alt="Egg Community"
            width={32}
            height={32}
            className="dark:invert"
          />

          <h1 className="text-2xl font-bold">Egg Community</h1>
        </Link>

        {user ? <Tabs className="hidden md:flex" /> : <div className="flex-1" />}
        <Menu name={user?.name} />
      </div>
    </header>
  )
}