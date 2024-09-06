import type { Metadata, NextPage, ResolvingMetadata } from 'next'

import { PostCard } from '@/components/post-card'
import { PostMenu } from '@/components/post-menu'
import { api } from '@/lib/api'
import { seo } from '@/lib/seo'
import { auth } from '@/server/auth'
import { UserInfo } from './_user-info'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const { user } = await auth()

  const { data, error } = await api
    .user({ id: params.id })
    .get({ query: { id: user?.id ?? '' }, fetch: { next: { tags: ['users'] } } })
  if (!data || error) return <div>Error: {error.value ?? 'Unknown error'}</div>

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

export const generateMetadata = async (
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { data, error } = await api.user({ id: params.id }).get({ query: {} })
  if (!data || error) return { title: 'Error' }
  const previousImages = (await parent).openGraph?.images ?? []

  return seo({
    title: data.name,
    url: `/u/${data.id}`,
    description: data.bio,
    images: data.image
      ? [data.image, ...previousImages]
      : [`/og?title=${data.name}&desc=${data.bio ?? ''}`, ...previousImages],
  })
}
