import { MenuIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'

import * as dm from '@/components/ui/dropdown-menu'
import { auth } from '@/server/auth'
import { LogOutBtn } from './log-out-btn'
import { ThemeBtn } from './theme-btn'

export const Menu: React.FC = async () => {
  const { user } = await auth()

  // prettier-ignore
  if (!user) return <Link href="/login" className='hover:underline underline-offset-4'>Login</Link>

  return (
    <dm.DropdownMenu>
      <dm.DropdownMenuTrigger>
        <MenuIcon />
      </dm.DropdownMenuTrigger>

      <dm.DropdownMenuContent className="mt-2" align="end">
        <dm.DropdownMenuLabel>{user.name}</dm.DropdownMenuLabel>
        <dm.DropdownMenuSeparator />

        <dm.DropdownMenuGroup>
          <Link href={`/u/${user.id}/settings`} passHref>
            <dm.DropdownMenuItem>
              <SettingsIcon className="mr-2" /> Settings
            </dm.DropdownMenuItem>
          </Link>

          <ThemeBtn />
        </dm.DropdownMenuGroup>

        <dm.DropdownMenuSeparator />

        <LogOutBtn />
      </dm.DropdownMenuContent>
    </dm.DropdownMenu>
  )
}
