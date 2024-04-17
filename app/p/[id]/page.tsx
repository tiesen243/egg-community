import { MessageSquareIcon } from 'lucide-react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CreateComment } from '@/components/create-comment'
import { LikeBtn } from '@/components/like-btn'
import { PostHeader } from '@/components/post-header'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params: { id } }) => {
  const { user } = await auth()

  const { data, error } = await api.post['get-one']({ id }).get({ query: { id: user?.id } })

  if (!data || error)
    return <Typography color="destructive">Error: {error.value.message}</Typography>

  return (
    <>
      <PostHeader authorName={data.author.name} />
      <main className="container max-w-screen-md">
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

        <Typography className={!data.image ? 'mb-4' : ''}>{data.content}</Typography>

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

        <Separator className="my-4" />

        <ul className="space-y-4">
          {data.commentsList?.map((c) => (
            <li key={c.id} className="border-b">
              <Link href={`/u/${c.author.id}`} className="flex items-center gap-4">
                <Image
                  src={c.author.image ?? '/og'}
                  alt={c.author.name}
                  width={40}
                  height={40}
                  className="aspect-square rounded-full object-cover"
                />

                <p>
                  <strong>{c.author.name}</strong> <br />
                  <span className="text-muted-foreground">
                    {new Date(c.createdAt).toDateString()}
                  </span>
                </p>
              </Link>

              <p className="py-2">{c.content}</p>
            </li>
          ))}
        </ul>

        {user && <CreateComment postId={data.id} />}
      </main>
    </>
  )
}

export default Page
