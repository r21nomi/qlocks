'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { IArtsContext } from '@/types/context'

const defaultContext: IArtsContext = {
  arts: [
    {
      title: 'qlock1',
      file: '20250321/public/index.html',
    },
    {
      title: 'qlock2',
      file: '20250429/public/index.html',
    },
    {
      title: 'qlock3 - Sunrise',
      file: '20250603/public/index.html',
    },
    {
      title: 'qlock4',
      file: '20260120/public/index.html',
    },
    {
      title: 'qlock5',
      file: '20260127/public/index.html',
    },
  ],
  currentIndex: 0,
  setIndex: () => {},
}

const ArtsContext = createContext<IArtsContext>(defaultContext)

const ArtsProvider = ({ children }: { children: React.ReactNode }) => {
  const context: IArtsContext = useContext(ArtsContext)
  const [index, _setIndex] = useState<number>(0)

  const newContext = useMemo(() => {
    return {
      ...context,
      ...{
        currentIndex: index,
        setIndex: (value: number): void => {
          _setIndex(value)
        },
      },
    }
  }, [index])

  return (
    <ArtsContext.Provider value={newContext}>{children}</ArtsContext.Provider>
  )
}
const useArts = (): IArtsContext => {
  return useContext(ArtsContext)
}

export { ArtsProvider, useArts }
