import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'

export const DeleteComment: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter()
  const handleDelete = async () => {
    await api.comment({ id }).delete()
    router.refresh()
  }
  return (
    <DropdownMenuItem onClick={handleDelete}>
      <Trash2Icon className="mr-2" /> Delete
    </DropdownMenuItem>
  )
}
