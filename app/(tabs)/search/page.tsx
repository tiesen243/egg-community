import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { UserCard } from '@/components/user-card'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'
import { SearchIcon } from 'lucide-react'
import type { NextPage } from 'next'
import { redirect } from 'next/navigation'

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

  const { data: posts } = await api.post['get-all'].get({ query: { keyword, id: user?.id } })
  const { data: users } = await api.user['get-all'].get({ query: { keyword } })

  console.log({ posts, users })

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
          <Typography variant="h2" className="mt-4">
            Users
          </Typography>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </>
      )}

      {posts && posts.length > 0 && (
        <>
          <Typography variant="h2" className="my-4">
            Posts
          </Typography>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      )}
    </>
  )
}

export default Page
