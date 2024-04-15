import type { NextPage } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Typography } from '@/components/ui/typography'
import { UserAvatar } from '@/components/user-avatar'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'
import { HeartIcon, MessageSquareIcon } from 'lucide-react'
import Image from 'next/image'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params: { id } }) => {
  const { user } = await auth()
  const { data, error } = await api.post.getOne({ id }).get({ query: { id: user?.id } })
  if (!data || error) return notFound()
  return (
    <>
      <Link href={`/u/${data.author.id}`} className="flex items-center gap-4">
        <UserAvatar user={data.author} className="size-20" />

        <div>
          <Typography variant="h3">{data.author.name}</Typography>
          <p className="text-muted-foreground">
            Upload at: {new Date(data.createdAt).toDateString()}
          </p>
        </div>
      </Link>

      <Typography>{data.content}</Typography>

      {data.image && (
        <Image
          src={data.image}
          alt={data.content}
          width={400}
          height={400}
          className="my-4 h-auto w-full rounded-lg"
        />
      )}

      <section className="flex items-center gap-4">
        <button className="group flex gap-2">
          <HeartIcon
            className={
              data.isLiked
                ? 'fill-destructive stroke-destructive'
                : 'group-hover:stroke-destructive'
            }
          />
          {data.likes}
        </button>

        <div className="flex gap-2">
          <MessageSquareIcon />
          {data.comments}
        </div>
      </section>
    </>
  )
}

export default Page
