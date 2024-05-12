import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, TextField } from '@/components/ui/form'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { commentSchema, type CommentSchema } from '@/lib/validators/comment'

interface Props {
  id: string
  content: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const EditComment: React.FC<Props> = (props) => {
  const form = useForm<CommentSchema>({ resolver: zodResolver(commentSchema) })
  const handleSubmit = form.handleSubmit(async (formData: CommentSchema) => {
    await api.comment({ id: props.id }).patch(formData)
    props.setOpen(false)
    revalidate('posts')
  })
  const isPending = form.formState.isSubmitting

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit your comment</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            control={form.control}
            name="content"
            label="Content"
            defaultValue={props.content}
            placeholder="What's on your mind?"
            disabled={isPending}
          />

          <DialogFooter>
            <Button isLoading={isPending}>Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
