import type { NextPage } from 'next'

import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/user-avatar'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const { user } = await auth()

  const { data, error } = await api.user.info({ id: params.id }).get({ query: { id: user?.id } })
  if (!data || error) return <div>Error: {error.value.message ?? 'Unknown error'}</div>

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

            {data.id === user?.id ? (
              <Button className="w-full">Edit Profile</Button>
            ) : (
              <Button className="w-full">Follow</Button>
            )}
          </div>

          <UserAvatar user={data} className="size-40" />
        </CardHeader>
      </Card>

      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  )
}

export default Page
