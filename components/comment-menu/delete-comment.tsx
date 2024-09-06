import { Trash2Icon } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'
import { revalidate } from '@/server/actions'

export const DeleteComment: React.FC<{ id: string }> = ({ id }) => {
  const handleDelete = async () => {
    await api.comment({ id }).delete()
    await revalidate({ tag: 'posts' })
  }
  return (
    <DropdownMenuItem onClick={handleDelete}>
      <Trash2Icon className="mr-2" /> Delete
    </DropdownMenuItem>
  )
}
