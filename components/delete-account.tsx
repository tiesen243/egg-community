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

export const DeleteAccount: React.FC = () => {
  const router = useRouter()
  const { trigger, isMutating } = useMutation('delete-account', async () => {
    const { error } = await api.user['delete-account'].delete()
    if (error) throw error.value
    await api.user['sign-out'].post()
    router.push('/')
    router.refresh()
    return { message: 'Account deleted' }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent>
        {/* prettier-ignore */}
        <form action={(fd)=>{ trigger(fd) }}>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Once you delete your account, there is no going back. Please be certain.
            </DialogDescription>
          </DialogHeader>

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
