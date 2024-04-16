'use client'

import { useMutation } from '@/lib/swr'
import { PencilIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { FormField } from '@/components/ui/form-field'
import { updateSchema } from '@/server/models/post.model'

interface Props {
  post: {
    id: string
    content: string
  }
}
export const UpdatePostTrigger: React.FC = () => (
  <DialogTrigger asChild>
    <DropdownMenuItem>
      <PencilIcon className="mr-2" /> Update
    </DropdownMenuItem>
  </DialogTrigger>
)

export const UpdatePostContent: React.FC<Props> = ({ post }) => {
  const { trigger, isMutating, error } = useMutation('post', async (_, { arg }) => {
    const inp = updateSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    console.log(inp.data)
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update post</DialogTitle>
      </DialogHeader>

      {/* prettier-ignore */}
      <form action={(fd)=>{ trigger(fd) }} className="my-4 space-y-4">
        <FormField<HTMLTextAreaElement>
          name="content"
          placeholder="What’s on your mind?"
          defaultValue={post.content}
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
          Save changes
        </Button>
      </form>
    </DialogContent>
  )
}
