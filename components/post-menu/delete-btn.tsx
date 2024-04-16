import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'

export const DeleteBtn: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter()
  const handleClick = async () => {
    const { error } = await api.post['delete-post']({ id }).delete()
    if (error) toast.error(error.value.message)
    router.refresh()
  }

  return (
    <DropdownMenuItem onClick={handleClick}>
      <Trash2Icon className="mr-2" /> Delete
    </DropdownMenuItem>
  )
}
