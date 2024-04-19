'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { useMutation } from '@/lib/hooks'
import { fileToBase64, previewFile } from '@/lib/utils'
import { updateSchema } from '@/lib/validators/user'

interface Props {
  user: {
    name: string
    bio: string | null
    image: string | null
  }
}
export const UpdateProfileForm: React.FC<Props> = ({ user }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const { trigger, isMutating, fieldErrors } = useMutation(async (arg) => {
    const { name, bio, avatar } = updateSchema.parse(Object.fromEntries(arg.entries()))
    const { data, error } = await api.user.update.patch({
      name,
      bio,
      avatar: await fileToBase64(avatar),
    })
    if (error) throw error.value
    return data
  })

  return (
    <form action={trigger} className="space-y-4">
      <FormField
        label="Name"
        name="name"
        defaultValue={user.name}
        message={fieldErrors?.name?.at(0)}
      />
      <FormField
        label="Bio"
        name="bio"
        defaultValue={user.bio ?? ''}
        message={fieldErrors?.bio?.at(0)}
      />
      <FormField
        label="Image"
        name="avatar"
        type="file"
        accept="image/*"
        onChange={(e) => previewFile(e.target.files?.[0], setPreview)}
        message={fieldErrors?.avatar?.at(0)}
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
