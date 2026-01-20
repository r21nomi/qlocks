'use client'

import styles from '@/styles/TopPage.module.scss'
import ArtIframe from '@/components/artIframe/ArtIframe'
import { useArts } from '@/hooks/contexts/artsContext'
import Menu from '@/components/menu/Menu'

export default function Home() {
  const { arts, currentIndex } = useArts()
  const isLocal = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('dev') === 'false') {
        return false
      }
      console.log(window.location.hostname)
      return (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      )
    }
    return process.env.NEXT_PUBLIC_IS_LOCAL === 'true'
  }
  const url = isLocal()
    ? `http://localhost:8080`
    : `/arts/${arts[currentIndex].file}`

  return (
    <div className={styles.root}>
      <ArtIframe className={styles.art} url={url} />
      <Menu className={styles.menu} />
    </div>
  )
}
