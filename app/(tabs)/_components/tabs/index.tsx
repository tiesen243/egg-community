'use client'

import * as icons from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { CreatePost } from './create-post'

const navs = [
  { label: icons.HomeIcon, href: '/' },
  { label: icons.RssIcon, href: '/following' },
  { label: icons.SearchIcon, href: '/search' },
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
          <icons.ChevronLeft />
        </Button>
      )}

      {navs.map((nav, idx) => (
        <Button key={idx} variant="ghost" className="flex-1" onClick={() => router.push(nav.href)}>
          <nav.label className={pathName === nav.href ? '' : 'text-muted-foreground'} />
        </Button>
      ))}
      <CreatePost />

      <Button variant="ghost" className="flex-1" onClick={() => router.push(`/u/${user.id}`)}>
        <icons.UserIcon className={pathName === `/u/${user.id}` ? '' : 'text-muted-foreground'} />
      </Button>
    </div>
  )
}
