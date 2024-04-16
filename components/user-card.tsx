import Image from 'next/image'
import { Card, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'

interface Props {
  user: {
    id: string
    name: string
    image: string | null
  }
}
export const UserCard: React.FC<Props> = ({ user }) => (
  <Link href={`/u/${user.id}`} passHref>
    <Card className="mt-4 transition-colors ease-linear hover:bg-secondary">
      <CardHeader className="flex-row items-center gap-4">
        <Image
          src={user.image ?? '/og'}
          alt={user.name}
          width={40}
          height={40}
          className="aspect-square rounded-full object-cover"
        />
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
    </Card>
  </Link>
)
