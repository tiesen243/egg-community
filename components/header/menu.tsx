import Link from 'next/link'
import { MenuIcon, SettingsIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOutBtn } from './log-out-btn'
import { ThemeBtn } from './theme-btn'

export const Menu: React.FC<{ id?: string; name?: string }> = async ({ id, name }) => {
  // prettier-ignore
  if (!id || !name) return <Link href="/login" className='hover:underline underline-offset-4'>Login</Link>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mt-2" align="end">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href={`/u/${id}/settings`} passHref>
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
