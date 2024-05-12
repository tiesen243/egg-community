import { ChangePasswordForm } from '@/components/change-password-form'
import { DeleteAccount } from '@/components/delete-account'
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
      <h2 className="text-3xl font-bold">Settings</h2>

      <hr className="my-4" />

      <h3 className="mb-2 text-2xl font-medium">Profile</h3>
      <UpdateProfileForm user={user} />

      <hr className="my-4" />

      <h3 className="mb-2 text-2xl font-medium">Change Password</h3>
      <ChangePasswordForm />

      <hr className="my-4" />

      <h3 className="mb-2 text-2xl font-medium text-destructive">Delete Account</h3>
      <p>Once you delete your account, there is no going back. Please be certain.</p>
      <DeleteAccount />
    </>
  )
}

export default Page
