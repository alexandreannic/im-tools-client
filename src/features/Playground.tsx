import {useAppSettings} from '../core/context/ConfigContext'
import React from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Page} from '@/shared/Page'

export const Playground = () => {
  const {session} = useSession()
  const {api} = useAppSettings()
  return (
    <Page>ok</Page>
  )
}