import type { NextPage } from 'next'

import { PostCard } from '@/components/post-card'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'

const Page: NextPage = async () => {
  const { user } = await auth()
  const { data, error } = await api.post['get-all'].get({
    query: { id: user?.id ?? '' },
    fetch: { next: { tags: ['posts'] } },
  })

  if (!data || error) return <div>Error: {error.value.message ?? 'No data'}</div>

  return data.map((post) => <PostCard key={post.id} post={post} />)
}

export default Page
