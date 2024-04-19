'use client'

import { ChevronLeftIcon } from 'lucide-react'

import { Typography } from '@/components/ui/typography'
import { useRouter } from 'next/navigation'

export const PostHeader: React.FC<{ authorName: string }> = ({ authorName }) => {
  const router = useRouter()
  return (
    <header className="container max-w-screen-md border-b py-2">
      <div className="flex items-center justify-between">
        <ChevronLeftIcon
          onClick={() => router.back()}
          className="cursor-pointer hover:text-muted-foreground"
        />
        <Typography variant="h3">{authorName}</Typography>
        <div />
      </div>
    </header>
  )
}
