'use client'

import { ChevronLeft, UserIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { CreatePost } from '@/components/tabs/create-post'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'

export const Tabs: React.FC<{ className?: string; userId: string }> = ({ className, userId }) => {
  const pathName = usePathname()
  const router = useRouter()
  const isNotInNav =
    !siteConfig.navs.some((nav) => nav.href === pathName) && pathName !== `/u/${userId}`

  return (
    <div
      className={cn('container flex max-w-screen-md items-center justify-between gap-2', className)}
    >
      {isNotInNav && (
        <Button variant="ghost" className="flex-1" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
      )}

      {siteConfig.navs.map((nav, idx) => (
        <Button key={idx} variant="ghost" className="flex-1" onClick={() => router.push(nav.href)}>
          <nav.label className={pathName === nav.href ? '' : 'text-muted-foreground'} />
        </Button>
      ))}
      <CreatePost />

      <Button variant="ghost" className="flex-1" onClick={() => router.push(`/u/${userId}`)}>
        <UserIcon className={pathName === `/u/${userId}` ? '' : 'text-muted-foreground'} />
      </Button>
    </div>
  )
}
