import type { Metadata, NextPage, ResolvingMetadata } from 'next'

import { PostCard } from '@/components/post-card'
import { UserInfo } from '@/components/user-info'
import { api } from '@/lib/api'
import { auth } from '@/server/auth'
import { PostMenu } from '@/components/post-menu'

interface Props {
  params: { id: string }
}

export const generateMetadata = async (
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { data, error } = await api.user.info({ id: params.id }).get({ query: {} })
  if (!data || error) return { title: 'Error' }
  const previousImages = (await parent).openGraph?.images ?? []

  return {
    title: data.name,
    openGraph: {
      images: data.image
        ? [data.image, ...previousImages]
        : [`/og?title=${data.name}&desc=${data.bio ?? ''}`, ...previousImages],
    },
  }
}

const Page: NextPage<Props> = async ({ params }) => {
  const { user } = await auth()

  const { data, error } = await api.user
    .info({ id: params.id })
    .get({ query: { id: user?.id ?? '' }, fetch: { next: { tags: ['users'] } } })
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
