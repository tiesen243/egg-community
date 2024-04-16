const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <main className="flex h-[69dvh] w-full items-center justify-center [&>*]:container [&>*]:max-w-screen-md [&>*]:flex-1 [&>*]:space-y-4">
    {children}
  </main>
)

export default AuthLayout
