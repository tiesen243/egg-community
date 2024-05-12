'use client'

import { PencilIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { fileToBase64 } from '@/lib/utils'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export const CreatePost: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const action = (formData: FormData) =>
    startTransition(async () => {
      const inp = {
        content: String(formData.get('content')),
        image: await fileToBase64(formData.get('image') as File),
      }
      const { error } = await api.post.create.post(inp)
      if (error) {
        toast.error(error.value.message)
        return
      }
      revalidate('posts')
      setOpen(false)
    })

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

        <form action={action} className="my-4 space-y-4">
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea name="content" placeholder="What's on your mind?" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" name="image" accept="image/*" />
          </div>

          <Button className="w-full" isLoading={isPending}>
            Post
          </Button>
        </form>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}
