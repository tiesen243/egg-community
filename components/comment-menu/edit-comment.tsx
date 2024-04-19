import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { commentSchema } from '@/lib/validators/comment'
import { useMutation } from '@/lib/hooks'

interface Props {
  id: string
  content: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const EditComment: React.FC<Props> = (props) => {
  const router = useRouter()
  const { trigger, isMutating } = useMutation(async (arg) => {
    const inp = commentSchema.parse(Object.fromEntries(arg.entries()))
    const { error } = await api.comment({ id: props.id }).patch(inp)
    if (error) throw error.value
    props.setOpen(false)
    router.refresh()
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit your comment</DialogTitle>
      </DialogHeader>

      <form action={trigger} className="space-y-4">
        <FormField
          name="content"
          label="Content"
          defaultValue={props.content}
          disabled={isMutating}
        />

        <DialogFooter>
          <Button isLoading={isMutating}>Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
