'use client'

import { useRouter } from 'next/navigation'
import { LogOutIcon } from 'lucide-react'

import { api } from '@/lib/api'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export const LogOutBtn: React.FC = () => {
  const router = useRouter()
  const logOut = async () => {
    await api.user.signOut.post()
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenuItem onClick={logOut}>
      <LogOutIcon className="mr-2" /> Log Out
    </DropdownMenuItem>
  )
}
