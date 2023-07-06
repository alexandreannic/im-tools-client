import React from 'react'
import {SessionProvider} from '@/core/context/SessionContext'
import {Playground} from '@/features/Playground'

const Page = () => {

  return (
    <SessionProvider>
      <Playground/>
    </SessionProvider>
  )
}

export default Page