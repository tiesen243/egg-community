'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { fileToBase64, previewFile } from '@/lib/utils'
import { useMutation } from '@/lib/swr'
import { updateSchema } from '@/server/models/user.model'
import { api } from '@/lib/api'

interface Props {
  user: {
    name: string
    bio: string | null
    image: string | null
  }
}
export const UpdateProfileForm: React.FC<Props> = ({ user }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const { trigger, isMutating, error } = useMutation('user', async (_, { arg }) => {
    const inp = updateSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { data, error } = await api.user.update.patch({
      ...inp.data,
      avatar: await fileToBase64(inp.data.avatar),
    })
    if (error) throw error.value
    return data
  })

  return (
    // prettier-ignore
    <form action={(fd)=>{ trigger(fd) }} className="space-y-4">
      <FormField
        label="Name"
        name="name"
        defaultValue={user.name}
        message={error?.fieldErrors?.name}
      />
      <FormField
        label="Bio"
        name="bio"
        defaultValue={user.bio ?? ''}
        message={error?.fieldErrors?.bio}
        multiline
      />
      <FormField
        label="Image"
        name="avatar"
        type="file"
        accept="image/*"
        onChange={(e) => previewFile(e.target.files?.[0], setPreview)}
        message={error?.fieldErrors?.avatar}
      />

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={200}
          height={200}
          className="mx-auto aspect-square rounded-full object-cover"
        />
      )}

      <Button className="w-full" isLoading={isMutating}>
        Update
      </Button>
    </form>
  )
}
