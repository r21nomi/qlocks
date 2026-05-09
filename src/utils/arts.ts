import { Art } from '@/types/entity'

export const getArts = (): Art[] => {
  return [
    {
      id: 'qlock1',
      title: 'qlock1',
      baseDir: '/arts/20250321',
      file: 'public/index.html',
      thumbnail: 'art.jpg',
      description: 'qlock1',
    },
    {
      id: 'qlock2',
      title: 'qlock2',
      baseDir: '/arts/20250429',
      file: 'public/index.html',
      thumbnail: 'art.jpg',
      description: 'qlock2',
    },
    {
      id: 'qlock3',
      title: 'qlock3 - Sunrise',
      baseDir: '/arts/20250603',
      file: 'public/index.html',
      thumbnail: 'art.jpg',
      description: 'qlock3 - Sunrise',
    },
    {
      id: 'qlock4',
      title: 'qlock4',
      baseDir: '/arts/20260120',
      file: 'public/index.html',
      thumbnail: 'art.jpg',
      description: 'qlock4',
    },
    {
      id: 'qlock5',
      title: 'qlock5',
      baseDir: '/arts/20260127',
      file: 'public/index.html',
      thumbnail: 'art.jpg',
      description: 'qlock5',
    },
  ]
}

export const getArtById = (id: string): Art | undefined => {
  return getArts().find((art) => art.id === id)
}
