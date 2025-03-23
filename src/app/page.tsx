import styles from '@/styles/TopPage.module.scss'
import ArtIframe from '@/components/artIframe/ArtIframe'

export default function Home() {
  const isLocal = () => {
    if (typeof window !== 'undefined') {
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
    : `/arts/20250321/public/index.html`

  return (
    <div className={styles.root}>
      <ArtIframe className={styles.art} url={url} />
    </div>
  )
}
