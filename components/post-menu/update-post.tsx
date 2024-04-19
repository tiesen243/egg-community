import { PencilIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { fileToBase64 } from '@/lib/utils'
import { updateSchema } from '@/lib/validators/post'
import { useMutation } from '@/lib/hooks'
import { Textarea } from '../ui/textarea'

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
  const router = useRouter()
  const { trigger, isMutating, fieldErrors } = useMutation(async (arg) => {
    const { content, image } = updateSchema.parse(Object.fromEntries(arg.entries()))
    const { error } = await api.post
      .update({ id: post.id })
      .patch({ content, image: await fileToBase64(image) })
    if (error) throw new Error(error.value.message)
    router.refresh()
    setOpen(false)
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update post</DialogTitle>
      </DialogHeader>

      <form action={trigger} className="my-4 space-y-4">
        <FormField
          name="content"
          defaultValue={post.content}
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
          Save changes
        </Button>
      </form>
    </DialogContent>
  )
}
