import { Art } from '@/types/entity'

export interface IArtsContext {
  arts: Art[]
  currentIndex: number
  setIndex: (value: number) => void
}
