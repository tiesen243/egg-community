'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import * as form_1 from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
    await revalidate('posts')
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

        <form_1.Form {...form}>
          <form onSubmit={handleSubmit} className="my-4 space-y-4">
            <form_1.FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <form_1.FormItem>
                  <form_1.FormControl>
                    <Textarea {...field} />
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>
              )}
            />

            <form_1.FormField
              control={form.control}
              name="image"
              render={({ field: { value: _v, ...field } }) => (
                <form_1.FormItem>
                  <form_1.FormControl>
                    <Input
                      {...field}
                      type="file"
                      onChange={(event) => {
                        if (!event.target.files) return
                        field.onChange(event.target.files[0])
                      }}
                    />
                  </form_1.FormControl>
                  <form_1.FormMessage />
                </form_1.FormItem>
              )}
            />

            <Button className="w-full" isLoading={isPending}>
              Post
            </Button>
          </form>
        </form_1.Form>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}
