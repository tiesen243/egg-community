'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { useMutation } from '@/lib/hooks'
import { changePasswordSchema } from '@/lib/validators/user'

export const ChangePasswordForm: React.FC = () => {
  const router = useRouter()

  const { trigger, isMutating, fieldErrors } = useMutation(async (arg) => {
    const inp = changePasswordSchema.parse(Object.fromEntries(arg.entries()))
    const { data, error } = await api.user['change-password'].patch(inp)
    if (error) throw new Error(error.value.message)
    await api.user['sign-out'].post()
    router.push('/')
    router.refresh()
    return data
  })

  return (
    <form action={trigger} className="space-y-4">
      {fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          type="password"
          message={fieldErrors?.[field.name]?.at(0)}
        />
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
