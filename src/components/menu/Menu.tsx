import styles from './Menu.module.scss'
import React from 'react'
import { useArts } from '@/hooks/contexts/artsContext'
import { useRouter, useSearchParams } from 'next/navigation'

export type IMenu = React.ComponentPropsWithRef<'div'>

const Menu: React.FC<IMenu> = ({ className }) => {
  const { arts, setIndex } = useArts()
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClicked = (index: number) => {
    setIndex(index)
    const id = arts[index].id
    const params = new URLSearchParams(searchParams.toString())
    params.set('id', id)
    router.push(`?${params.toString()}`)
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
