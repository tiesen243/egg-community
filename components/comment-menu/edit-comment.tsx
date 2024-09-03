import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import * as f from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'

interface Props {
  id: string
  content: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const schema = z.object({ content: z.string().min(1, 'Content is required') })

export const EditComment: React.FC<Props> = (props) => {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    await api.comment({ id: props.id }).patch(formData)
    props.setOpen(false)
    await revalidate('posts')
  })
  const isPending = form.formState.isSubmitting

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit your comment</DialogTitle>
      </DialogHeader>

      <f.Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <f.FormField
            control={form.control}
            name="content"
            defaultValue={props.content}
            disabled={isPending}
            render={({ field }) => (
              <f.FormItem>
                <f.FormControl>
                  <Input {...field} placeholder="Your comment" />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />

          <DialogFooter>
            <Button isLoading={isPending}>Save</Button>
          </DialogFooter>
        </form>
      </f.Form>
    </DialogContent>
  )
}
