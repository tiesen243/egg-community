'use client'

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
import { useMutation } from '@/lib/hooks'
import { deleteAccountSchema } from '@/lib/validators/user'
import { FormField } from './ui/form-field'

export const DeleteAccount: React.FC = () => {
  const router = useRouter()
  const { trigger, isMutating, fieldErrors } = useMutation(async (arg) => {
    const inp = deleteAccountSchema.parse(Object.fromEntries(arg.entries()))
    const { data, error } = await api.user['delete-account'].delete(inp)
    if (error) throw new Error(error.value.message)
    await api.user['sign-out'].post()
    router.push('/')
    router.refresh()
    return data.message
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

        <form action={trigger} className="space-y-4">
          <FormField
            name="confirm"
            label='To verify, type "delete my account" below: '
            placeholder="delete my account"
            message={fieldErrors?.confirm?.at(0)}
          />

          <FormField
            type="password"
            name="password"
            label="Confirm your password:"
            placeholder="Enter your password"
            message={fieldErrors?.password?.at(0)}
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
