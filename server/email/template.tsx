import * as components from '@react-email/components'

interface EmailProps {
  from: string
  replyTo: string
  subject: string
  message: string
}

const config: components.TailwindConfig = {
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      background: 'hsl(240 10% 3.9%)',
      foreground: 'hsl(0 0% 98%)',
      border: 'hsl(240 3.7% 15.9%)',
    },
  },
}

export const EmailTemplate: React.FC<Readonly<EmailProps>> = (data) => {
  const previewText = `Message from ${data.replyTo} on ${data.from}`

  return (
    <components.Html lang="en">
      <components.Head />
      <components.Preview>{previewText}</components.Preview>

      <components.Tailwind config={config}>
        <components.Body className="border-border bg-background font-sans text-foreground antialiased">
          <components.Container className="mx-auto px-2">
            <components.Section>
              <components.Img
                src="https://raw.githubusercontent.com/tiesen243/portfolio/main/public/android-chrome-512x512.png"
                alt="logo"
                className="mx-auto my-4 h-16 w-16"
              />
              <components.Heading className="text-center">{data.subject}</components.Heading>
            </components.Section>

            <components.Markdown
              markdownCustomStyles={{
                h1: { marginTop: 2, marginBottom: 2 },
                h2: { marginTop: 2, marginBottom: 2 },
                h3: { marginTop: 2, marginBottom: 2 },
                h4: { marginTop: 2, marginBottom: 2 },
              }}
              markdownContainerStyles={{
                background: 'hsl(240 10% 3.9%)',
                color: 'hsl(0 0% 98%)',
              }}
            >
              {data.message}
            </components.Markdown>

            <components.Text>
              Best Regards, <br />
              {data.from.split(' ').at(0)}
            </components.Text>

            <hr className="border-border" />
            <components.Section>
              <components.Text>
                Website:{' '}
                <components.Link href="https://tiesen.id.vn/">https://tiesen.id.vn</components.Link>
                <br />
                Email:{' '}
                <components.Link href={`mailto:${data.replyTo}`}>{data.replyTo}</components.Link>
                <br />
                Address: Saigon, Vietnam
              </components.Text>

              <components.Img
                src="https://raw.githubusercontent.com/tiesen243/portfolio/main/public/images/tiesen.png"
                alt="Tiesen"
                className="my-4 h-auto w-52"
              />
            </components.Section>
          </components.Container>
        </components.Body>
      </components.Tailwind>
    </components.Html>
  )
}
