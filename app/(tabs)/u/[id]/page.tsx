import type { NextPage } from 'next'

import { PostCard } from '@/components/post-card'
import { UserInfo } from '@/components/user-info'
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
      <UserInfo user={data} />

      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  )
}

export default Page
