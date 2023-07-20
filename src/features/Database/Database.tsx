import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import * as yup from 'yup'
import {KoboApiColType} from '@/core/sdk/server/kobo/KoboApi'
import {databaseModule} from '@/features/Database/databaseModule'
import {HashRouter as Router, NavLink, Outlet, Route, Routes} from 'react-router-dom'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {Layout} from '@/shared/Layout'
import {Skeleton, Tab, Tabs} from '@mui/material'
import {useLocation, useParams} from 'react-router'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {DatabaseNew} from '@/features/Database/DatabaseNew/DatabaseNew'
import {useAaToast} from '@/core/useToast'
import {DatabaseProvider} from '@/features/Database/DatabaseContext'
import {useSession} from '@/core/Session/SessionContext'
import {DatabaseAccessRoute} from '@/features/Database/DatabaseAccess/DatabaseAccess'
import {DatabaseTableRoute} from '@/features/Database/DatabaseTable/DatabaseTable'

export const databaseUrlParamsValidation = yup.object({
  serverId: yup.string().required(),
  formId: yup.string().required(),
})

export const ignoredColType: KoboApiColType[] = [
  'begin_group',
  'end_group',
  'deviceid',
  'end_repeat',
  // 'begin_repeat',
  // 'note',
]

export const Database = () => {
  const {m} = useI18n()
  const {session} = useSession()
  const {api, conf} = useAppSettings()
  const _forms = useFetcher(api.kobo.form.getAll)
  const {toastHttpError} = useAaToast()

  useEffectFn(_forms.error, toastHttpError)

  useEffect(() => {
    _forms.fetch()
  }, [])

  // const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  return (
    <DatabaseProvider>
      <Router>
        <Layout
          sidebar={
            <Sidebar headerId="app-header">
              {session.admin && (
                <DatabaseNew onAdded={() => _forms.fetch({force: true, clean: false})}>
                  <AaBtn icon="add" sx={{mx: 1, mb: 1}} variant="contained">{m.database.registerNewForm}</AaBtn>
                </DatabaseNew>
              )}
              {_forms.loading ? (
                <>
                  <SidebarItem>
                    <Skeleton sx={{height: 30}}/>
                  </SidebarItem>
                  <SidebarItem>
                    <Skeleton sx={{height: 30}}/>
                  </SidebarItem>
                  <SidebarItem>
                    <Skeleton sx={{height: 30}}/>
                  </SidebarItem>
                </>
              ) : _forms.entity?.map(_ => (
                <NavLink key={_.id} to={databaseModule.siteMap.home(_.serverId, _.id)}>
                  {({isActive, isPending}) => (
                    <SidebarItem key={_.id} active={isActive}>{_.name}</SidebarItem>
                  )}
                </NavLink>
              ))}
            </Sidebar>
          }
          header={<AppHeader id="app-header"/>}
        >
          <Routes>
            <Route path={databaseModule.siteMap.home()} element={<DatabaseHome/>}>
              <Route path={databaseModule.siteMap.database.absolute()} element={<DatabaseTableRoute/>}/>
              <Route path={databaseModule.siteMap.access.absolute()} element={<DatabaseAccessRoute/>}/>
            </Route>
          </Routes>
        </Layout>
      </Router>
    </DatabaseProvider>
  )
}

export const DatabaseHome = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {pathname} = useLocation()
  return (
    <>
      <Tabs
        value={pathname}
        sx={{
          mb: 1,
          borderBottom: t => `1px solid ${t.palette.divider}`
        }}
      >
        <Tab
          component={NavLink}
          value={databaseModule.siteMap.database.absolute(serverId, formId)}
          to={databaseModule.siteMap.database.absolute(serverId, formId)}
          label={m.data}
        />
        <Tab
          component={NavLink}
          value={databaseModule.siteMap.access.absolute(serverId, formId)}
          to={databaseModule.siteMap.access.absolute(serverId, formId)}
          label={m.access}
        />
      </Tabs>
      <Outlet/>
    </>

  )
}


