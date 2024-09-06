import { zodResolver } from '@hookform/resolvers/zod'
import { PencilIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { fileToBase64 } from '@/lib/utils'
import { revalidate } from '@/server/actions'

export const UpdatePostTrigger: React.FC = () => (
  <DialogTrigger asChild>
    <DropdownMenuItem>
      <PencilIcon className="mr-2" /> Update
    </DropdownMenuItem>
  </DialogTrigger>
)

interface Props {
  post: {
    id: string
    content: string
  }
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const schema = z.object({
  content: z.string(),
  image: z.optional(z.instanceof(File)),
})
export const UpdatePostContent: React.FC<Props> = ({ post, setOpen }) => {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    const { error } = await api.post.update({ id: post.id }).patch({
      content: formData.content,
      image: await fileToBase64(formData.image),
    })
    if (error) return toast.error(error.value)
    await revalidate('posts')
    setOpen(false)
  })
  const isPending = form.formState.isSubmitting

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update post</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="my-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea name="content" defaultValue={post.content} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" name="image" accept="image/*" />
          </div>

          <Button className="w-full" isLoading={isPending}>
            Save changes
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
