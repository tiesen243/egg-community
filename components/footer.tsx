import { auth } from '@/server/auth'
import { Tabs } from './tabs'

export const Footer: React.FC = async () => {
  const { user } = await auth()
  if (!user) return null

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150 md:hidden">
      <Tabs userId={user.id} />
    </footer>
  )
}
