'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FileField, Form, TextField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { fileToBase64 } from '@/lib/utils'

interface Props {
  user: {
    name: string
    bio: string | null
    image: string | null
  }
}

const schema = z.object({
  name: z.string(),
  bio: z.string().optional(),
  avatar: z.optional(z.instanceof(File)),
})
export const UpdateProfileForm: React.FC<Props> = ({ user }) => {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    const { data, error } = await api.user.update.patch({
      name: formData.name,
      bio: formData.bio,
      avatar: await fileToBase64(formData.avatar),
    })
    if (error) return toast.error(error.value.message)
    toast.success(data.message)
    revalidate('user')
  })
  const isPending = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField control={form.control} name="name" label="Name" defaultValue={user.name} />
        <TextField control={form.control} name="bio" label="Bio" asChild>
          <Textarea defaultValue={user.bio ?? ''} />
        </TextField>
        <FileField control={form.control} name="avatar" label="Avatar" />

        <Button className="w-full" isLoading={isPending}>
          Update
        </Button>
      </form>
    </Form>
  )
}
