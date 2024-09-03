import type { NextPage } from 'next'
import { redirect } from 'next/navigation'

import { PostCard } from '@/components/post-card'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'

const Page: NextPage = async () => {
  const { user } = await auth()
  if (!user) redirect('/')

  const { data, error } = await api.post['get-by-following'].get({
    query: { id: user.id },
    fetch: { next: { tags: ['posts'] } },
  })
  if (error) return <div>{error.value}</div>

  return data.map((post) => <PostCard key={post.id} post={post} />)
}

export default Page
