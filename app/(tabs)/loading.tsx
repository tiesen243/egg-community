import { Loader2Icon } from 'lucide-react'
import type { NextPage } from 'next'

const LoadingPage: NextPage = () => (
  <div className="grid min-h-[90dvh] animate-pulse place-items-center">
    <Loader2Icon className="size-20 animate-spin" />
  </div>
)

export default LoadingPage
