'use client'

import Image from 'next/image'
import * as React from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

interface Props {
  user: {
    image: string | null
    name: string
  }
  className?: string
}
export const UserAvatar: React.FC<Props> = ({ user, className = '' }) => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  React.useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null
  return (
    <div className={cn('size-10 rounded-full', className)}>
      <AspectRatio ratio={1 / 1} className={className} asChild>
        <Image
          src={user.image ?? '/og'}
          alt={user.name}
          className="rounded-full object-cover"
          fill
        />
      </AspectRatio>
    </div>
  )
}
