'use client'

import { HeartIcon } from 'lucide-react'

import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  id: string
  isLiked: boolean
  likes: number
}

export const LikeBtn: React.FC<Props> = (props) => {
  const router = useRouter()
  const handleClick = async () => {
    const { error } = await api.post.like({ id: props.id }).post()
    if (error) return toast.error(error.value.message)
    router.refresh()
  }

  return (
    <button className="flex gap-2" onClick={handleClick}>
      <HeartIcon
        className={
          props.isLiked ? 'fill-destructive stroke-destructive' : 'hover:stroke-destructive'
        }
      />
      {props.likes}
    </button>
  )
}
