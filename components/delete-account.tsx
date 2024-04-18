'use client'

import { useMutation } from '@/lib/swr'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { FormField } from './ui/form-field'
import { deleteAccountSchema } from '@/server/models/user.model'

export const DeleteAccount: React.FC = () => {
  const router = useRouter()
  const { trigger, isMutating, error } = useMutation('delete-account', async (_, { arg }) => {
    const inp = deleteAccountSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { data, error } = await api.user['delete-account'].delete(inp.data)
    if (error) throw error.value
    await api.user['sign-out'].post()
    router.push('/')
    router.refresh()
    return data
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Once you delete your account, there is no going back. Please be certain.
          </DialogDescription>
        </DialogHeader>

        <form
          action={(fd) => {
            trigger(fd)
          }}
          className="space-y-4"
        >
          <FormField
            name="confirm"
            label='To verify, type "delete my account" below: '
            placeholder="delete my account"
            message={error?.fieldErrors?.confirm}
          />

          <FormField
            type="password"
            name="password"
            label="Confirm your password:"
            placeholder="Enter your password"
            message={error?.fieldErrors?.password}
          />

          <DialogFooter className="gird w-full grid-cols-2">
            <Button variant="secondary" disabled={isMutating} asChild>
              <DialogClose>Cancel</DialogClose>
            </Button>

            <Button variant="destructive" type="submit" isLoading={isMutating}>
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
