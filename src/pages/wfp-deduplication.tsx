import React from 'react'
import {SessionProvider} from '@/core/context/SessionContext'
import {WfpDeduplicationPage} from '@/features/WfpDeduplication/WfpDeduplicationPage'

const _ = () => {
  return (
    <SessionProvider>
      <WfpDeduplicationPage/>
    </SessionProvider>
  )
}

export default _