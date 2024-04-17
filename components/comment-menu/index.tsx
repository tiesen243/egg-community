'use client'

import { EllipsisIcon, PencilIcon } from 'lucide-react'
import { useState } from 'react'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteComment } from './delete-comment'
import { EditComment } from './edit-comment'

interface Props {
  id: string
  content: string
}

export const CommentMenu: React.FC<Props> = ({ id, content }) => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-0 top-0 z-20">
          <EllipsisIcon className="z-20 hover:text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <PencilIcon className="mr-2" /> Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DeleteComment id={id} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditComment id={id} content={content} setOpen={setOpen} />
    </Dialog>
  )
}
