import { useMutation } from '@/lib/swr'
import { useRouter } from 'next/navigation'

import { api } from '@/lib/api'
import { commentSchema } from '@/server/models/comment.model'
import { Button } from '../ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { FormField } from '../ui/form-field'

interface Props {
  id: string
  content: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const EditComment: React.FC<Props> = (props) => {
  const router = useRouter()
  const { trigger, isMutating } = useMutation('comment', async (_, { arg }) => {
    const inp = commentSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { error } = await api.comment({ id: props.id }).patch(inp.data)
    if (error) throw error.value
    props.setOpen(false)
    router.refresh()
  })
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit your comment</DialogTitle>
      </DialogHeader>

      {/* prettier-ignore */}
      <form action={(fd)=>{ trigger(fd) }} className='space-y-4'>
        <FormField name="content" label="Content" defaultValue={props.content} />

        <DialogFooter>
          <Button isLoading={isMutating}>Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
