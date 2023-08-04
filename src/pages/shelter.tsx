import {Mpca} from '@/features/Mpca/Mpca'
import React from 'react'
import {SessionProvider} from '@/core/Session/SessionContext'

const ShelterPage = () => {

  return (
    <SessionProvider>
      <Mpca/>
    </SessionProvider>
  )
}

export default ShelterPage