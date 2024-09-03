'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as f from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { fileToBase64 } from '@/lib/utils'
import { Input } from './ui/input'

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
    await revalidate('user')
  })
  const isPending = form.formState.isSubmitting

  return (
    <f.Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <f.FormField
          control={form.control}
          name="name"
          defaultValue={user.name}
          render={({ field }) => (
            <f.FormItem>
              <f.FormLabel>Name</f.FormLabel>
              <f.FormControl>
                <Input {...field} />
              </f.FormControl>
              <f.FormMessage />
            </f.FormItem>
          )}
        />

        <f.FormField
          control={form.control}
          name="bio"
          defaultValue={user.bio ?? ''}
          render={({ field }) => (
            <f.FormItem>
              <f.FormLabel>Bio</f.FormLabel>
              <f.FormControl>
                <Textarea {...field} />
              </f.FormControl>
              <f.FormMessage />
            </f.FormItem>
          )}
        />

        <f.FormField
          control={form.control}
          name="avatar"
          render={({ field: { value: _v, ...field } }) => (
            <f.FormItem>
              <f.FormLabel>Avatar</f.FormLabel>
              <f.FormControl>
                <Input
                  {...field}
                  type="file"
                  onChange={(event) => {
                    if (!event.target.files) return
                    field.onChange(event.target.files[0])
                  }}
                />
              </f.FormControl>
              <f.FormMessage />
            </f.FormItem>
          )}
        />

        <Button className="w-full" isLoading={isPending}>
          Update
        </Button>
      </form>
    </f.Form>
  )
}
