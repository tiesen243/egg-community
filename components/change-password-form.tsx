'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, TextField } from '@/components/ui/form'
import { api } from '@/lib/api'

const schema = z
  .object({
    oldPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmNewPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
  })

export const ChangePasswordForm: React.FC = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    const { data, error } = await api.user['change-password'].patch(formData)
    if (error) {
      toast.error(error.value.message)
      return
    }
    toast.success(data.message, {
      description: 'You will be redirected to the login page',
    })
    await api.user['sign-out'].post()
    router.push('/login')
    router.refresh()
  })
  const isPending = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <TextField key={field.name} control={form.control} {...field} />
        ))}

        <Button className="w-full" isLoading={isPending}>
          Change Password
        </Button>
      </form>
    </Form>
  )
}

const fields = [
  {
    name: 'oldPassword',
    label: 'Old Password',
    type: 'password',
    placeholder: 'Abcd#12345',
  },
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Abcd#12345',
  },
  {
    name: 'confirmNewPassword',
    label: 'Confirm New Password',
    type: 'password',
    placeholder: 'Abcd#12345',
  },
]
