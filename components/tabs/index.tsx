'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'
import { CreatePost } from './create-post'

export const Tabs: React.FC<{ className?: string }> = ({ className }) => {
  const pathName = usePathname()
  const router = useRouter()
  const isNotInNav = !siteConfig.navs.some((nav) => nav.href === pathName)
  return (
    <div
      className={cn('container flex max-w-screen-md items-center justify-between gap-2', className)}
    >
      {isNotInNav && (
        <Button variant="ghost" className="flex-1" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
      )}
      <CreatePost />

      {siteConfig.navs.map((nav, index) => (
        <Button
          key={index}
          variant="ghost"
          className={`order-${nav.order} flex-1`}
          onClick={() => router.push(nav.href)}
        >
          <nav.label className={pathName === nav.href ? '' : 'text-muted-foreground'} />
        </Button>
      ))}
    </div>
  )
}
