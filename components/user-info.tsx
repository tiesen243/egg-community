import Image from 'next/image'
import Link from 'next/link'
import { FollowBtn } from './follow-btn'
import { Button } from './ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props {
  id?: string
  user: {
    id: string
    name: string
    bio: string | null
    image: string | null
    createdAt: Date
    _count: {
      posts: number
      followers: number
      following: number
    }
    isFollowing: boolean
  }
}

export const UserInfo: React.FC<Props> = ({ id, user }) => (
  <Card className="mb-4">
    <CardHeader className="flex-row items-center justify-between gap-8">
      <div className="flex-1 space-y-2">
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.bio ?? 'No bio available'}</CardDescription>
        <CardDescription>Joined at: {new Date(user.createdAt).toDateString()}</CardDescription>

        <p className="flex gap-2">
          <span>
            <strong>Post:</strong> {user._count.posts}
          </span>
          <span>
            <strong>Followers:</strong> {user._count.followers}
          </span>
          <span>
            <strong>Following:</strong> {user._count.following}
          </span>
        </p>

        {id === user?.id ? (
          <Button className="w-full" asChild>
            <Link href={`/u/${user.id}/settings`}>Edit Profile</Link>
          </Button>
        ) : (
          <FollowBtn id={user.id} isFollowing={user.isFollowing} />
        )}
      </div>

      <Image
        src={user.image ?? '/og'}
        alt={user.name}
        width={150}
        height={150}
        className="aspect-square size-36 rounded-full object-cover"
      />
    </CardHeader>
  </Card>
)
