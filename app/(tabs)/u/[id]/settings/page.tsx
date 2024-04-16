import { ChangePasswordForm } from '@/components/change-password-form'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import { UpdateProfileForm } from '@/components/update-profile-form'
import { auth } from '@/server/auth'
import type { NextPage } from 'next'
import { redirect } from 'next/navigation'

interface Props {
  params: { id: string }
}

const Page: NextPage<Props> = async ({ params }) => {
  const { user } = await auth()
  if (!user || user.id !== params.id) return redirect('/')

  return (
    <>
      <Typography variant="h2">Settings</Typography>

      <Typography variant="h3">Profile</Typography>

      <UpdateProfileForm user={user} />

      <Separator className="mt-4" />

      <Typography variant="h3">Change Password</Typography>

      <ChangePasswordForm />
    </>
  )
}

export default Page
