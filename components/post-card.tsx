import { MessageSquareIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { LikeBtn } from '@/components/like-btn'
import * as card from '@/components/ui/card'
import type { TPostCard } from '@/server/api/models/post'

interface Props {
  post: TPostCard[0]
}

export const PostCard: React.FC<Props> = ({ post }) => (
  <card.Card className="group border-none">
    <div className="absolute left-5 top-0 h-full w-[2px] bg-muted transition-colors ease-linear group-hover:bg-primary" />

    <Link
      href={`/u/${post.author.id}`}
      className="absolute inset-0 z-10 flex h-fit w-fit items-center gap-4"
    >
      <Image
        src={post.author.image ?? '/og'}
        alt={post.author.name}
        width={40}
        height={40}
        className="aspect-square size-12 rounded-full object-cover ring-ring group-hover:ring-2"
      />

      <div>
        <card.CardTitle className="text-lg">{post.author.name}</card.CardTitle>
        <card.CardDescription>{new Date(post.createdAt).toDateString()}</card.CardDescription>
      </div>
    </Link>

    <Link href={`/p/${post.id}`}>
      <card.CardHeader className="line-clamp-2 pb-0 pl-16 pt-14">
        {post.content.split('\n').map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </card.CardHeader>

      {post.image && (
        <card.CardContent className="pl-16 pt-2">
          <Image
            src={post.image}
            alt={post.content}
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </card.CardContent>
      )}
    </Link>

    <card.CardFooter className={`gap-4 pl-16 ${post.image ? '' : 'pt-2'}`}>
      <LikeBtn {...post} />

      <div className="flex gap-2">
        <MessageSquareIcon />
        {post.comments}
      </div>
    </card.CardFooter>
  </card.Card>
)
