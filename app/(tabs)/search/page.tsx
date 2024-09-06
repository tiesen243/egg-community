import { redirect } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import type { NextPage } from 'next'

import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCard } from '@/components/user-card'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'

interface Props {
  searchParams: {
    keyword: string
  }
}

const Page: NextPage<Props> = async ({ searchParams: { keyword } }) => {
  const { user } = await auth()
  const search = async (fd: FormData) => {
    'use server'
    const keyword = String(fd.get('keyword'))
    redirect(`/search?keyword=${keyword}`)
  }

  const { data: posts } = await api.post.getAll.get({ query: { keyword, id: user?.id } })
  const { data: users } = await api.user.getAll.get({ query: { keyword } })

  return (
    <>
      <form action={search} className="flex items-center gap-4">
        <Input name="keyword" type="text" defaultValue={keyword} placeholder="Search..." />
        <Button variant="ghost" size="icon">
          <SearchIcon />
        </Button>
      </form>

      {users && users.length > 0 && (
        <>
          <h2 className="mt-4 text-3xl font-bold">Users</h2>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </>
      )}

      {posts && posts.length > 0 && (
        <>
          <h2 className="mt-4 text-3xl font-bold">Posts</h2>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      )}
    </>
  )
}

export default Page
