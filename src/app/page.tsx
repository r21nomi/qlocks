import HomeClient from '@/components/homeClient/HomeClient'
import { getArtById } from '@/utils/arts'
import { Metadata } from 'next'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams
  const id = typeof params.id === 'string' ? params.id : undefined
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const art = id ? getArtById(id) : null

  const title = art?.title || 'qlocks'
  const description = art?.description || 'Art collection themed with Clock.'
  const imageUrl = art?.thumbnail
    ? `${siteUrl}${art.baseDir}/${art.thumbnail}`
    : `${siteUrl}/ogp.jpg`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function Home() {
  return <HomeClient />
}
