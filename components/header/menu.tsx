import { MenuIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { auth } from '@/server/auth'
import { LogOutBtn } from './log-out-btn'
import { ThemeBtn } from './theme-btn'

export const Menu: React.FC = async () => {
  const { user } = await auth()

  // prettier-ignore
  if (!user) return <Link href="/login" className='hover:underline underline-offset-4'>Login</Link>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mt-2" align="end">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href={`/u/${user.id}/settings`} passHref>
            <DropdownMenuItem>
              <SettingsIcon className="mr-2" /> Settings
            </DropdownMenuItem>
          </Link>

          <ThemeBtn />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <LogOutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
