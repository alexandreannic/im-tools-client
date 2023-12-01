import React from 'react'
import {SessionProvider} from '@/core/Session/SessionContext'
import {DashboardMealVisit} from '@/features/Meal/DashboardMealVisit'

export default () => {
  return (
    <SessionProvider>
      <DashboardMealVisit/>
    </SessionProvider>
  )
}
