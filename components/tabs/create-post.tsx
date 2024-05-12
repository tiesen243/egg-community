'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { FileField, Form, TextField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { fileToBase64 } from '@/lib/utils'

const schema = z.object({
  content: z.string(),
  image: z.optional(z.instanceof(File)),
})

export const CreatePost: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    await api.post.create.post({
      content: formData.content,
      image: await fileToBase64(formData.image),
    })
    form.reset()
    setOpen(false)
    revalidate('posts')
  })
  const isPending = form.formState.isSubmitting

  return (
    <dialog.Dialog open={open} onOpenChange={setOpen}>
      <dialog.DialogTrigger asChild>
        <Button variant="ghost" className="flex-1 text-muted-foreground">
          <PencilIcon />
        </Button>
      </dialog.DialogTrigger>

      <dialog.DialogContent>
        <dialog.DialogHeader>
          <dialog.DialogTitle>Create a new post</dialog.DialogTitle>
          <dialog.DialogDescription>
            Start a new discussion or ask a question. Share what’s on your mind.
          </dialog.DialogDescription>
        </dialog.DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="my-4 space-y-4">
            <TextField control={form.control} name="content" label="Content" asChild>
              <Textarea />
            </TextField>
            <FileField control={form.control} name="image" label="Image" />

            <Button className="w-full" isLoading={isPending}>
              Post
            </Button>
          </form>
        </Form>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}
