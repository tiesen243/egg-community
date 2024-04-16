'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { useMutation } from '@/lib/swr'
import { changePasswordSchema } from '@/server/models/user.model'

export const ChangePasswordForm: React.FC = () => {
  const router = useRouter()
  const { trigger, isMutating, error } = useMutation('changePassword', async (_, { arg }) => {
    const inp = changePasswordSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { data, error } = await api.user['change-password'].patch(inp.data)
    if (error) throw error.value
    await api.user['sign-out'].post()
    router.push('/auth/login')
    router.refresh()
    return data
  })
  return (
    // prettier-ignore
    <form action={(fd)=>{ trigger(fd) }} className='space-y-4'>
      {fields.map((field) => (
        <FormField key={field.name} {...field} type='password'message={error?.fieldErrors?.[field.name]} />
      ))}

      <Button className="w-full" isLoading={isMutating}>
        Change Password
      </Button>
    </form>
  )
}

const fields = [
  {
    name: 'oldPassword',
    label: 'Old Password',
  },
  {
    name: 'newPassword',
    label: 'New Password',
  },
  {
    name: 'confirmNewPassword',
    label: 'Confirm New Password',
  },
]
