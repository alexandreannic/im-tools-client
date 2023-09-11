import React from 'react'
import {Databases} from '@/features/Database/Databases'
import {SessionProvider} from '@/core/Session/SessionContext'

const DashboardProtectionHouseholdSurvey = () => {
  return (
    <SessionProvider>
      <Databases/>
    </SessionProvider>
  )
}

export default DashboardProtectionHouseholdSurvey