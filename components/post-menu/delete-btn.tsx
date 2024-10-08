import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'
import { revalidate } from '@/server/actions'

export const DeleteBtn: React.FC<{ id: string }> = ({ id }) => {
  const handleClick = async () => {
    const { error } = await api.post.deletePost({ id }).delete()
    if (error) toast.error(error.value)
    await revalidate({ tag: 'posts' })
  }

  return (
    <DropdownMenuItem onClick={handleClick}>
      <Trash2Icon className="mr-2" /> Delete
    </DropdownMenuItem>
  )
}
