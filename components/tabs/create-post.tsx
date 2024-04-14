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
import { FormField } from '../ui/form-field'

export const CreatePost: React.FC = () => {
  const action = async (fd: FormData) => {
    const data = { content: String(fd.get('content')), image: fd.get('image') as File }
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="order-2 flex-1 text-muted-foreground">
          <PencilIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            Start a new discussion or ask a question. Share what’s on your mind.
          </DialogDescription>

          <form action={action} className="my-2 space-y-4">
            <FormField name="content" placeholder="What’s on your mind?" rows={3} multiline />
            <FormField name="image" type="file" accept="image/*" />

            <Button type="submit" className="w-full">
              Post
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
