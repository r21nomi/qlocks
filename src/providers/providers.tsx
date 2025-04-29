'use client'

import * as React from 'react'
import ComposeProviders from '@/providers/composeProviders'
import { ArtsProvider } from '@/hooks/contexts/artsContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ComposeProviders providers={[ArtsProvider]}>{children}</ComposeProviders>
  )
}
