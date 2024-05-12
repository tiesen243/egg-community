'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
export const UpdateProfileForm: React.FC<Props> = ({ user }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const handleSubmit = (formData: FormData) =>
    startTransition(async () => {
      const { data, error } = await api.user.update.patch({
        name: String(formData.get('name')),
        bio: String(formData.get('bio')),
        avatar: await fileToBase64(formData.get('avatar') as File),
      })
      if (error) {
        toast.error(error.value.message)
        return
      }
      toast.success(data.message)
      revalidate('users')
    })

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input name="name" defaultValue={user.name} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea disabled={isPending} defaultValue={user.bio ?? ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar</Label>
        <Input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const base64 = await fileToBase64(file)
            setPreview(base64)
          }}
        />
      </div>

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={200}
          height={200}
          className="mx-auto aspect-square rounded-full object-cover"
        />
      )}

      <Button className="w-full" isLoading={isPending}>
        Update
      </Button>
    </form>
  )
}
