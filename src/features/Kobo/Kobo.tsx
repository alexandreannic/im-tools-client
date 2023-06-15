import {useConfig} from '../../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {Layout} from '../../shared/Layout'
import {KoboSidebar} from './KoboSidebar'
import {Outlet} from 'react-router-dom'

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
