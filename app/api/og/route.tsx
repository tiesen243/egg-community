import { seo } from '@/lib/seo'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

interface Props {
  params: {
    title?: string
    desc?: string
    image?: string
  }
}

export const runtime = 'edge'

export const GET = async (_: NextRequest, { params }: Props): Promise<ImageResponse> => {
  const dotBg = {
    backgroundImage:
      'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
    backgroundSize: '100px 100px',
  }

  const title = params.title ?? seo({}).applicationName!
  const description = params.desc ?? seo({}).description!
  const image = params.image ?? ''

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full p-20 items-center justify-center bg-white" style={dotBg}>
        <div tw="flex justify-between w-full items-center">
          <h1 tw="text-8xl ml-4">Egg Community</h1>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            viewBox="0 0 906.87 785.29"
            style={{
              width: '10rem',
              height: '10rem',
            }}
          >
            <path d="M297.68 662.01 178.11 454.29h406.5l35.58-61.43-35.63-61.85H177.85l120.32-207.72h382.55l35.44-61.28L680.46 0H227.14L0 392.07l226.41 393.22h453.33l35.54-61.34-35.67-61.94z" />
            <path d="M775.76 165.5h-357.6l-35.71 61.59 35.56 61.7h286.46l60.04 104.26-59.95 103.46H417.67l-35.61 61.51 35.53 61.77h358.05l131.23-226.56z" />
          </svg>
        </div>

        <div tw="flex-1 flex w-full items-end justify-between">
          <div tw="flex flex-col items-start w-3/4 pr-4">
            <h2 tw="text-4xl">{title}</h2>
            <p tw="text-2xl mt-4">{description}</p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image && <img alt={title} src={image} tw="rounded-md w-1/4 aspect-square" />}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
