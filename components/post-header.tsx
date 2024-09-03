'use client'

import { ChevronLeftIcon } from 'lucide-react'

import { useRouter } from 'next/navigation'

export const PostHeader: React.FC<{ authorName: string }> = ({ authorName }) => {
  const router = useRouter()

  return (
    <header className="sticky inset-0 z-50 bg-background/70 py-4 backdrop-blur-xl backdrop-saturate-150 md:py-2">
      <div className="flex items-center justify-between gap-4">
        <ChevronLeftIcon
          onClick={() => router.back()}
          className="cursor-pointer hover:text-muted-foreground"
        />
        <h3 className="text-3xl font-bold">{authorName}</h3>
        <div />
      </div>
    </header>
  )
}
