'use client'

import { PencilIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
import { api } from '@/lib/api'
import { useMutation } from '@/lib/hooks'
import { fileToBase64 } from '@/lib/utils'
import { createSchema } from '@/lib/validators/post'
import { Textarea } from '../ui/textarea'

export const CreatePost: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()

  const { trigger, isMutating, fieldErrors } = useMutation(async (arg) => {
    const { content, image } = createSchema.parse(Object.fromEntries(arg))
    const { error } = await api.post.create.post({ content, image: await fileToBase64(image) })
    if (error) throw new Error(error.value.message)
    router.refresh()
    setOpen(false)
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

        <form action={trigger} className="my-4 space-y-4">
          <FormField
            name="content"
            message={fieldErrors?.content?.at(0)}
            disabled={isMutating}
            asChild
          >
            <Textarea />
          </FormField>
          <FormField
            name="image"
            type="file"
            accept="image/*"
            message={fieldErrors?.image?.at(0)}
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
