'use client'

import { HeartIcon } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'

interface Props {
  id: string
  isLiked: boolean
  likes: number
}

export const LikeBtn: React.FC<Props> = (props) => {
  const handleClick = async () => {
    const { error } = await api.post.like({ id: props.id }).post()
    if (error) return toast.error(error.value.message)
    revalidate('posts')
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
