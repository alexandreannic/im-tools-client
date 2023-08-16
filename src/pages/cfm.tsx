import React from 'react'
import {SessionProvider} from '@/core/Session/SessionContext'
import {CfmModule} from '@/features/Cfm/CfmModule'

const CfmPage = () => {

  return (
    <SessionProvider>
      <CfmModule/>
    </SessionProvider>
  )
}

export default CfmPage