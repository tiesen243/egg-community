import { MessageSquareIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LikeBtn } from './like-btn'

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
    <Link href={`/u/${post.author.id}`} className="absolute inset-0 z-10 flex h-fit gap-2">
      <Image
        src={post.author.image ?? '/og'}
        alt={post.author.name}
        width={40}
        height={40}
        className="aspect-square rounded-full ring-ring group-hover:ring-2"
      />

      <div>
        <CardTitle>{post.author.name}</CardTitle>
        <CardDescription>{new Date(post.createdAt).toDateString()}</CardDescription>
      </div>
    </Link>

    <Link href={`/p/${post.id}`}>
      <CardHeader className="mb-6 line-clamp-2 pb-0 pl-12 pt-12">{post.content}</CardHeader>

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
    </Link>

    <CardFooter className="gap-4 pl-12">
      <LikeBtn {...post} />

      <div className="flex gap-2">
        <MessageSquareIcon />
        {post.comments}
      </div>
    </CardFooter>
  </Card>
)
