import styles from './ArtIframe.module.scss'
import React from 'react'

export interface IArtIframe extends React.ComponentPropsWithRef<'iframe'> {
  url: string
}

const ArtIframe: React.FC<IArtIframe> = ({ className, url }) => {
  return (
    <iframe
      className={`${styles.root} ${className ? className : ''}`}
      src={url}
      frameBorder="0"
      sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
      allow="geolocation; microphone; camera; midi; vr; xr-spatial-tracking"
      allowFullScreen={true}
    >
      {url}
    </iframe>
  )
}

export default ArtIframe
