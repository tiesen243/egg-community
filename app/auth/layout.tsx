const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex h-[69dvh] w-full items-center justify-center [&>*]:max-w-screen-md [&>*]:flex-1 [&>*]:space-y-4">
    {children}
  </div>
)

export default AuthLayout
