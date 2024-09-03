'use client'

import { ChevronLeft, HomeIcon, RssIcon, SearchIcon, UserIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { CreatePost } from '@/components/tabs/create-post'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/session'

const navs = [
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
]

export const Tabs: React.FC<{ className?: string }> = ({ className }) => {
  const { user, isAuth } = useSession()
  const pathName = usePathname()
  const router = useRouter()

  if (!isAuth) return <div />

  const isNotInNav = !navs.some((nav) => nav.href === pathName) && pathName !== `/u/${user.id}`

  return (
    <div
      className={cn('container flex max-w-screen-md items-center justify-between gap-2', className)}
    >
      {isNotInNav && (
        <Button variant="ghost" className="flex-1" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
      )}

      {navs.map((nav, idx) => (
        <Button key={idx} variant="ghost" className="flex-1" onClick={() => router.push(nav.href)}>
          <nav.label className={pathName === nav.href ? '' : 'text-muted-foreground'} />
        </Button>
      ))}
      <CreatePost />

      <Button variant="ghost" className="flex-1" onClick={() => router.push(`/u/${user.id}`)}>
        <UserIcon className={pathName === `/u/${user.id}` ? '' : 'text-muted-foreground'} />
      </Button>
    </div>
  )
}
