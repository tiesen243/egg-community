'use client'

import { EllipsisIcon, PencilIcon } from 'lucide-react'
import { useState } from 'react'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import * as dm from '@/components/ui/dropdown-menu'
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
      <dm.DropdownMenu>
        <dm.DropdownMenuTrigger className="absolute right-0 top-0 z-20">
          <EllipsisIcon className="z-20 hover:text-muted-foreground" />
        </dm.DropdownMenuTrigger>

        <dm.DropdownMenuContent align="end">
          <dm.DropdownMenuLabel>Action</dm.DropdownMenuLabel>
          <dm.DropdownMenuSeparator />

          <dm.DropdownMenuGroup>
            <DialogTrigger asChild>
              <dm.DropdownMenuItem>
                <PencilIcon className="mr-2" /> Edit
              </dm.DropdownMenuItem>
            </DialogTrigger>
            <DeleteComment id={id} />
          </dm.DropdownMenuGroup>
        </dm.DropdownMenuContent>
      </dm.DropdownMenu>

      <EditComment id={id} content={content} setOpen={setOpen} />
    </Dialog>
  )
}
