import React from 'react'
import {SessionProvider} from '@/core/Session/SessionContext'
import {MealVerification} from '@/features/MealVerification/MealVerification'

export default function Page() {

  return (
    <SessionProvider>
      <MealVerification/>
    </SessionProvider>
  )
}
