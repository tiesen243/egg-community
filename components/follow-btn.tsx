'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface Props {
  id: string
  isFollowing: boolean
}

export const FollowBtn: React.FC<Props> = ({ id, isFollowing }) => {
  const router = useRouter()
  const [isLoading, setLoading] = useState<boolean>(false)

  const handleFollow = async () => {
    setLoading(true)
    const { data, error } = await api.user.follow.post({ id })
    if (error) toast.error(error.value.message)
    else {
      toast.success(data.message)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button className="w-full" onClick={handleFollow} isLoading={isLoading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
