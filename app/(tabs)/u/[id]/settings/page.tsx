import { ChangePasswordForm } from '@/components/change-password-form'
import { DeleteAccount } from '@/components/delete-account'
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

      <Separator className="mt-4" />

      <Typography variant="h3" color="destructive">
        Delete Account
      </Typography>
      <Typography className="mb-2 [&:not(:first-child)]:mt-0">
        Once you delete your account, there is no going back. Please be certain.
      </Typography>
      <DeleteAccount />
    </>
  )
}

export default Page
