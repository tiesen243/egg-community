'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import * as dialog from '@/components/ui/dialog'
import { Form, TextField } from '@/components/ui/form'
import { api } from '@/lib/api'
import { z } from 'zod'

const fields = [
  {
    name: 'confirm',
    label: 'To verify, type "delete my account" below: ',
    placeholder: 'delete my account',
  },
  {
    name: 'password',
    label: 'Confirm your password:',
    placeholder: 'Enter your password',
    type: 'password',
  },
]

const schema = z.object({
  confirm: z.string().refine((value) => value === 'delete my account', {
    message: 'Please type "delete my account" to confirm',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export const DeleteAccount: React.FC = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    const { data, error } = await api.user['delete-account'].delete(formData)
    if (error) return toast.error(error.value.message)
    toast.success(data.message)
    router.push('/login')
    router.refresh()
  })
  const isPending = form.formState.isSubmitting

  return (
    <dialog.Dialog>
      <dialog.DialogTrigger asChild>
        <Button variant="destructive" className="mt-2 w-full">
          Delete Account
        </Button>
      </dialog.DialogTrigger>

      <dialog.DialogContent>
        <dialog.DialogHeader>
          <dialog.DialogTitle>Delete Account</dialog.DialogTitle>
          <dialog.DialogDescription>
            Once you delete your account, there is no going back. Please be certain.
          </dialog.DialogDescription>
        </dialog.DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <TextField key={field.name} control={form.control} {...field} />
            ))}

            <dialog.DialogFooter className="gird w-full grid-cols-2">
              <Button variant="secondary" disabled={isPending} asChild>
                <dialog.DialogClose>Cancel</dialog.DialogClose>
              </Button>

              <Button variant="destructive" isLoading={isPending}>
                Confirm
              </Button>
            </dialog.DialogFooter>
          </form>
        </Form>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}
