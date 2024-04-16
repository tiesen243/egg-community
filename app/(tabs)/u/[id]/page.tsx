import type { NextPage } from 'next'

import { PostCard } from '@/components/post-card'
import { UserInfo } from '@/components/user-info'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'
import { PostMenu } from '@/components/post-menu'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const { user } = await auth()

  const { data, error } = await api.user.info({ id: params.id }).get({ query: { id: user?.id } })
  if (!data || error) return <div>Error: {error.value.message ?? 'Unknown error'}</div>

  return (
    <>
      <UserInfo id={user?.id ?? ''} user={data} />

      <ul className="space-y-4">
        {data.posts.map((post) => (
          <li key={post.id}>
            {user?.id === data.id && <PostMenu post={post} />}
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default Page
