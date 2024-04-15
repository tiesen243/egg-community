import type { NextPage } from 'next'

import { PostCard } from '@/components/post-card'
import { api } from '@/lib/api'

const Page: NextPage = async () => {
  const { data, error } = await api.post.getAll.get()

  if (!data || error) return <div>Error: {error.value.message ?? 'Unknown error'}</div>

  return data.map((post) => <PostCard key={post.id} post={post} />)
}

export default Page
