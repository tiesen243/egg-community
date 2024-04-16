import { MessageSquareIcon } from 'lucide-react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LikeBtn } from '@/components/like-btn'
import { Typography } from '@/components/ui/typography'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params: { id } }) => {
  const { user } = await auth()
  const { data, error } = await api.post['get-one']({ id }).get({ query: { id: user?.id } })
  if (!data || error) return notFound()

  return (
    <>
      <Link href={`/u/${data.author.id}`} className="flex items-center gap-4">
        <Image
          src={data.author.image ?? '/og'}
          alt={data.author.name}
          width={64}
          height={64}
          className="aspect-square size-16 rounded-full object-cover"
        />

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
        <LikeBtn {...data} />

        <div className="flex gap-2">
          <MessageSquareIcon />
          {data.comments}
        </div>
      </section>
    </>
  )
}

export default Page
