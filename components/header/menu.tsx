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
import { MenuIcon, SettingsIcon } from 'lucide-react'
import { Typography } from '../ui/typography'
import { LogOutBtn } from './log-out-btn'
import { ThemeBtn } from './theme-btn'

export const Menu: React.FC<{ name?: string }> = async ({ name }) => {
  if (!name)
    return (
      <Typography variant="link" href="/auth/login">
        Login
      </Typography>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mt-2" align="end">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/settings" passHref>
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
