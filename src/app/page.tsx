import HomeClient from '@/components/homeClient/HomeClient'
import { getArtById, getArts } from '@/utils/arts'
import { Metadata } from 'next'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams
  const id = typeof params.id === 'string' ? params.id : undefined
  const arts = getArts()
  const art = id ? getArtById(id) : arts[0]

  if (!art) {
    return {
      title: 'qlocks',
      description: 'Art collection themed with Clock.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const thumbnailUrl = art.thumbnail
    ? `${siteUrl}${art.baseDir}/${art.thumbnail}`
    : `${siteUrl}/ogp.jpg`

  return {
    title: art.title,
    description: art.description || art.title,
    openGraph: {
      title: art.title,
      description: art.description || art.title,
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: art.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: art.title,
      description: art.description || art.title,
      images: [thumbnailUrl],
    },
  }
}

export default function Home() {
  return <HomeClient />
}
