import {useConfig} from '../../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {Layout} from '../../shared/Layout'
import {KoboSidebar} from './KoboSidebar'
import {koboModule} from '@/features/Kobo/koboModule'
import {Route, Routes} from 'react-router-dom'
import {KoboTableLayoutRoute} from '@/features/Kobo/KoboForm/KoboTable'


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
      <Routes>
        <Route path={koboModule.siteMap.form()} element={<KoboTableLayoutRoute/>}/>
      </Routes>
    </Layout>
  )
}
