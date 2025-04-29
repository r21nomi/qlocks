import styles from './Menu.module.scss'
import React from 'react'
import { useArts } from '@/hooks/contexts/artsContext'

export type IMenu = React.ComponentPropsWithRef<'div'>

const Menu: React.FC<IMenu> = ({ className }) => {
  const { arts, setIndex } = useArts()

  const onClicked = (index: number) => {
    setIndex(index)
  }

  return (
    <div className={`${styles.root} ${className ? className : ''}`}>
      {arts.map((art, index) => (
        <div
          className={styles.item}
          key={index}
          onClick={() => onClicked(index)}
        >
          {art.title}
        </div>
      ))}
    </div>
  )
}

export default Menu
