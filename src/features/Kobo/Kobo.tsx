import {useAppSettings} from '../../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {Layout} from '../../shared/Layout'
import {KoboSidebar} from './KoboSidebar'
import {koboModule} from '@/features/Kobo/koboModule'
import {Route, Routes} from 'react-router-dom'
import {Database} from '@/features/Kobo/Database/Database'


export const Kobo = () => {
  const {api} = useAppSettings()
  const _forms = useFetcher(api.kobo.server.getAll)

  useEffect(() => {
    _forms.fetch()
  }, [])
  return (
    <Layout
      sidebar={<KoboSidebar/>}
    >
      <Routes>
        <Route path={koboModule.siteMap.form()} element={<Database/>}/>
      </Routes>
    </Layout>
  )
}
