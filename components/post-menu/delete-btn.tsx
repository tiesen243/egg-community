'use client'

import { Trash2Icon } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useMutation } from '@/lib/swr'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export const DeleteBtn: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter()
  const { trigger } = useMutation('post', async () => {
    const { error } = await api.post['delete-post']({ id }).delete()
    if (error) throw error.value
    router.refresh()
  })

  return (
    /* prettier-ignore */
    <form action={(fd) => { trigger(fd) }}>
      <DropdownMenuItem asChild>
        <button className="w-full">
          <Trash2Icon className="mr-2" /> Delete
        </button>
      </DropdownMenuItem>
    </form>
  )
}
