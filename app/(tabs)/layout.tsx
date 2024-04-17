import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

const TabLayot: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    <Header />
    <main className="container max-w-screen-md pb-16">{children}</main>
    <Footer />
  </>
)

export default TabLayot
