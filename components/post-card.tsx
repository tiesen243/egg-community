import type { Post } from '@prisma/client'
import { HeartIcon, MessageSquareIcon } from 'lucide-react'
import Image from 'next/image'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  post: {
    author: {
      id: string
      name: string
      avatar: string
    }
    heartCount: number
    replyCount: number
  } & Post
}

export const PostCard: React.FC<Props> = ({ post }) => (
  <Card className="group border-none">
    <div className="absolute left-5 top-0 h-full w-[2px] bg-muted transition-colors ease-linear group-hover:bg-primary" />
    <div className="absolute inset-0 h-fit">
      <Image
        src={post.author.avatar}
        alt={post.author.name}
        width={40}
        height={40}
        className="absolute aspect-square h-auto rounded-full object-cover ring-2 ring-transparent transition-colors ease-linear group-hover:ring-ring"
      />

      <div className="space-y-1 pl-12">
        <CardTitle>{post.author.name}</CardTitle>
        <CardDescription>{new Date(post.createdAt).toDateString()}</CardDescription>
      </div>
    </div>

    <CardHeader className="mb-6 line-clamp-2 pb-0 pl-12 pt-12">
      {post.content}
      {post.content}
    </CardHeader>

    {post.image && (
      <CardContent className="pl-12">
        <Image
          src={post.image}
          alt={post.content}
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </CardContent>
    )}

    <CardFooter className="flex gap-4 pl-12">
      <button className="flex gap-2">
        <HeartIcon className="hover:stroke-red-500" />
        {post.heartCount}
      </button>

      <button className="flex gap-2">
        <MessageSquareIcon />
        {post.replyCount}
      </button>
    </CardFooter>
  </Card>
)
