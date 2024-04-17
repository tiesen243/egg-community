import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { api } from '@/lib/api'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  params: { id: string; follow: 'following' | 'followers' }
}

const Page: NextPage<Props> = async ({ params: { id, follow } }) => {
  const { data, error } = await api.user({ id })[follow].get()
  if (error) return <div>{error.value.message}</div>

  return (
    <section className="flex flex-col gap-4">
      <Typography variant="h2">
        {data.name}&apos;s {follow === 'following' ? 'following' : 'followers'}
      </Typography>
      {data.users?.map((user) => (
        <Link key={user.id} href={`/u/${user.id}`} passHref>
          <Card className="transition-colors ease-linear hover:bg-secondary">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <Image
                src={user.image ?? '/og'}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />

              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </section>
  )
}

export default Page