import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <div className="flex gap-4">
      <div className="order-2 size-10 bg-red-400" />
      <div className="order-4 size-10 bg-green-400" />
      <div className="order-3 size-10 bg-blue-400" />
      <div className="order-5 size-10 bg-yellow-400" />
    </div>
  )
}

export default Page
