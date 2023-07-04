import React from 'react'
import {SessionProvider} from '@/core/context/SessionContext'
import {ActivityInfo} from '@/features/ActivityInfo/ActivityInfo'

const _ = () => {
  return (
    <SessionProvider>
      <ActivityInfo/>
    </SessionProvider>
  )
}

export default _