'use client'

import { PencilIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form-field'
import { useMutation } from '@/lib/swr'
import { createSchema } from '@/server/models/post.model'
import { fileToBase64 } from '@/lib/utils'
import { api } from '@/lib/api'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const CreatePost: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const { trigger, isMutating, error } = useMutation('post', async (_, { arg }) => {
    const inp = createSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const image = String(inp.data.image ? await fileToBase64(inp.data.image) : '')
    const { data, error } = await api.post.create.post({ content: inp.data.content, image })
    if (error) throw error.value
    setOpen(false)
    router.refresh()
    return data
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex-1 text-muted-foreground">
          <PencilIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            Start a new discussion or ask a question. Share what’s on your mind.
          </DialogDescription>
        </DialogHeader>

        {/* prettier-ignore */}
        <form action={(fd)=>{ trigger(fd) }} className="my-4 space-y-4">
            <FormField<HTMLTextAreaElement>
              name="content"
              placeholder="What’s on your mind?"
              multiline
              message={error?.fieldErrors?.content}
              disabled={isMutating}
            />
            <FormField 
              name="image" 
              type="file" 
              accept="image/*"  
              message={error?.fieldErrors?.image} 
              disabled={isMutating}
            />

            <Button className="w-full" isLoading={isMutating}>
              Post
            </Button>
          </form>
      </DialogContent>
    </Dialog>
  )
}
