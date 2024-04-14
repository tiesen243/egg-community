'use client'

import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

export const ThemeBtn: React.FC = () => {
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoonIcon className="mr-2" /> Appearance
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-muted' : ''}
        >
          <SunIcon className="mr-2" /> Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-muted' : ''}
        >
          <MoonIcon className="mr-2" /> Dark
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
