import {useConfig} from '../../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {Layout} from '../../shared/Layout'
import {KoboSidebar} from './KoboSidebar'
import {Header} from '../../shared/Layout/Header/Header'
import {Outlet, Route, Routes} from 'react-router-dom'
import {KoboForm} from './KoboForm/KoboForm'
import {koboModule} from './koboModule'

export const NoMatch = () => <div>NoMatch</div>

export const Kobo = () => {
  const {api} = useConfig()
  const _forms = useFetcher(api.kobo.fetchServers)

  useEffect(() => {
    _forms.fetch()
  }, [])

  return (
    <Layout
      sidebar={<KoboSidebar/>}
    >
      <Outlet/>
    </Layout>
  )
}
