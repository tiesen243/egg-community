import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { UserAvatar } from './user-avatar'

interface Props {
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
  }
}

export const UserInfo: React.FC<Props> = ({ user }) => (
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

        {user.id === user?.id ? (
          <Button className="w-full" asChild>
            <Link href={`/u/${user.id}/settings`}>Edit Profile</Link>
          </Button>
        ) : (
          <Button className="w-full">Follow</Button>
        )}
      </div>

      <UserAvatar user={user} className="size-36" />
    </CardHeader>
  </Card>
)
