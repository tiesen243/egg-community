import { Header } from './_components/header'
import { Tabs } from './_components/tabs'

const TabLayot: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    <Header>
      <Tabs className="hidden md:flex" />
    </Header>
    <main className="container max-w-screen-md pb-16 md:pb-4">{children}</main>

    <footer className="fixed bottom-0 left-0 z-50 w-full bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150 md:hidden">
      <Tabs />
    </footer>
  </>
)

export default TabLayot
