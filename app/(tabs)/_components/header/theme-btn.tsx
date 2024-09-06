'use client'

import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import * as dm from '@/components/ui/dropdown-menu'

export const ThemeBtn: React.FC = () => {
  const { theme, setTheme } = useTheme()
  return (
    <dm.DropdownMenuSub>
      <dm.DropdownMenuSubTrigger>
        <SunMoonIcon className="mr-2" /> Appearance
      </dm.DropdownMenuSubTrigger>

      <dm.DropdownMenuSubContent>
        <dm.DropdownMenuItem
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-muted' : ''}
        >
          <SunIcon className="mr-2" /> Light
        </dm.DropdownMenuItem>

        <dm.DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-muted' : ''}
        >
          <MoonIcon className="mr-2" /> Dark
        </dm.DropdownMenuItem>
      </dm.DropdownMenuSubContent>
    </dm.DropdownMenuSub>
  )
}
