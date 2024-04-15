import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'
import type { NextPage } from 'next'
import Image from 'next/image'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const { user } = await auth()

  const { data } = await api.user.info({ id: params.id }).get({ query: { id: user?.id } })
  if (!user || !data) return null

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-2">
            <CardTitle>{data.name}</CardTitle>
            <CardDescription>{data.bio ?? 'No bio available'}</CardDescription>
            <CardDescription>Joined at: {new Date(data.createdAt).toDateString()}</CardDescription>

            <p className="space-x-2">
              <strong>Post:</strong> {data._count.posts}
              <strong>Followers:</strong> {data._count.followers}
              <strong>Following:</strong> {data._count.following}
            </p>

            {data.id === user.id ? (
              <Button className="w-full">Edit Profile</Button>
            ) : (
              <Button className="w-full">Follow</Button>
            )}
          </div>

          <Image
            src={user.image ?? '/og'}
            alt={user.name}
            width={150}
            height={150}
            className="aspect-square rounded-full object-cover"
          />
        </CardHeader>
      </Card>

      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  )
}

export default Page
