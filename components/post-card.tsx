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
import Link from 'next/link'

interface Props {
  post: {
    id: string
    content: string
    image: string | null
    createdAt: Date
    author: { id: string; name: string; image: string | null }
    isLiked: boolean
    likes: number
    comments: number
  }
}

export const PostCard: React.FC<Props> = ({ post }) => (
  <Card className="group border-none">
    <div className="absolute left-5 top-0 h-full w-[2px] bg-muted transition-colors ease-linear group-hover:bg-primary" />
    <Link href={`/u/${post.author.id}`} className="absolute inset-0 h-fit">
      <Image
        src={post.author.image ?? '/og'}
        alt={post.author.name}
        width={40}
        height={40}
        className="absolute aspect-square h-auto rounded-full object-cover ring-2 ring-transparent transition-colors ease-linear group-hover:ring-ring"
      />

      <div className="space-y-1 pl-12">
        <CardTitle>{post.author.name}</CardTitle>
        <CardDescription>{new Date(post.createdAt).toDateString()}</CardDescription>
      </div>
    </Link>

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
        <HeartIcon
          className={
            post.isLiked ? 'fill-destructive stroke-destructive' : 'hover:stroke-destructive'
          }
        />
        {post.likes}
      </button>

      <button className="flex gap-2">
        <MessageSquareIcon />
        {post.comments}
      </button>
    </CardFooter>
  </Card>
)
