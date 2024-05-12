'use client'

import { EllipsisIcon } from 'lucide-react'
import { useState } from 'react'

import { Dialog } from '@/components/ui/dialog'
import * as dropdownMenu from '@/components/ui/dropdown-menu'
import { DeleteBtn } from './delete-btn'
import { UpdatePostContent, UpdatePostTrigger } from './update-post'

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
      <dropdownMenu.DropdownMenu>
        <dropdownMenu.DropdownMenuTrigger className="absolute right-0 top-0 z-20">
          <EllipsisIcon className="z-20" />
        </dropdownMenu.DropdownMenuTrigger>

        <dropdownMenu.DropdownMenuContent align="end">
          <dropdownMenu.DropdownMenuLabel>Actions</dropdownMenu.DropdownMenuLabel>
          <dropdownMenu.DropdownMenuSeparator />

          <dropdownMenu.DropdownMenuGroup>
            <UpdatePostTrigger />
            <DeleteBtn id={post.id} />
          </dropdownMenu.DropdownMenuGroup>
        </dropdownMenu.DropdownMenuContent>
      </dropdownMenu.DropdownMenu>

      <UpdatePostContent post={post} setOpen={setOpen} />
    </Dialog>
  )
}
