import { Footer } from '@/components/footer'

const TabLayot: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    <main className="container max-w-screen-md pb-16">{children}</main>
    <Footer />
  </>
)

export default TabLayot
