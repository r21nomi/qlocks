'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { IArtsContext } from '@/types/context'
import { getArts } from '@/utils/arts'

const defaultContext: IArtsContext = {
  arts: getArts(),
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
