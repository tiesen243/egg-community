'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface Props {
  id: string
  isFollowing: boolean
}

export const FollowBtn: React.FC<Props> = ({ id, isFollowing }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleFollow = () =>
    startTransition(async () => {
      const { data, error } = await api.user.follow.post({ id })
      if (error) toast.error(error.value.message)
      else {
        toast.success(data.message)
        router.refresh()
      }
    })

  return (
    <Button className="w-full" onClick={handleFollow} isLoading={isPending}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
