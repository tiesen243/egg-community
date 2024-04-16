'use client'

import { EllipsisIcon } from 'lucide-react'

import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteBtn } from './delete-btn'
import { UpdatePostContent, UpdatePostTrigger } from './update-post'
import { useState } from 'react'

interface Props {
  post: {
    id: string
    content: string
    image: string | null
    createdAt: Date
    author: { id: string; name: string; image: string | null }
    isLiked: boolean
    likes: number
    comments: number
  }
}

export const PostMenu: React.FC<Props> = ({ post }) => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-0 top-0 z-20">
          <EllipsisIcon className="z-20" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <UpdatePostTrigger />
          <DeleteBtn id={post.id} />
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdatePostContent post={post} setOpen={setOpen} />
    </Dialog>
  )
}
