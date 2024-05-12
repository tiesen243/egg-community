import { fileToBase64 } from '@/lib/utils'
import { PencilIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'

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

export const UpdatePostContent: React.FC<Props> = ({ post, setOpen }) => {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) =>
    startTransition(async () => {
      const inp = {
        content: String(formData.get('content')),
        image: await fileToBase64(formData.get('image') as File),
      }
      const { error } = await api.post.update({ id: post.id }).patch(inp)
      if (error) {
        toast.error(error.value.message)
        return
      }

      revalidate('posts')
      setOpen(false)
    })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update post</DialogTitle>
      </DialogHeader>

      <form action={handleSubmit} className="my-4 space-y-4">
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
    </DialogContent>
  )
}
