import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import * as yup from 'yup'
import {KoboApiColType} from '@/core/sdk/server/kobo/KoboApi'
import {databaseModule} from '@/features/Database/databaseModule'
import {HashRouter as Router, Navigate, NavLink, Outlet, Route, Routes} from 'react-router-dom'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {Layout} from '@/shared/Layout'
import {LinearProgress, Skeleton, Tab, Tabs} from '@mui/material'
import {useLocation, useParams} from 'react-router'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {DatabaseNew} from '@/features/Database/DatabaseNew/DatabaseNew'
import {DatabaseProvider, useDatabaseContext} from '@/features/Database/DatabasesContext'
import {DatabaseAccessRoute} from '@/features/Database/Access/DatabaseAccess'
import {DatabaseTableRoute} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {Fender, Txt} from 'mui-extension'
import {DatabasesDefaultPage} from '@/features/Database/DatabasesDefaultPage'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useAaToast} from '@/core/useToast'
import {DatabaseKoboTableProvider} from '@/features/Database/KoboTable/DatabaseKoboTableContext'
import {map} from '@alexandreannic/ts-utils'

export const databaseUrlParamsValidation = yup.object({
  serverId: yup.string().required(),
  formId: yup.string().required(),
})

export const ignoredColType: KoboApiColType[] = [
  'begin_group',
  'end_group',
  'deviceid',
  // 'end_repeat',
  // 'begin_repeat',
  // 'note',
]

export const Databases = () => {
  return (
    <DatabaseProvider>
      <Router>
        <DatabaseWithContext/>
      </Router>
    </DatabaseProvider>
  )
}

export const DatabaseWithContext = () => {
  const {m} = useI18n()
  const {conf} = useAppSettings()
  const ctx = useDatabaseContext()
  return (
    <Layout
      title={m._koboDatabase.title()}
      sidebar={
        <Sidebar headerId="app-header">
          {ctx.isAdmin && (
            <DatabaseNew onAdded={() => ctx._forms.fetch({force: true, clean: false})}>
              <AaBtn icon="add" sx={{mx: 1, mb: 1}} variant="contained">{m.database.registerNewForm}</AaBtn>
            </DatabaseNew>
          )}
          {ctx._forms.loading ? (
            <>
              <SidebarItem>
                <Skeleton sx={{width: 160, height: 30}}/>
              </SidebarItem>
              <SidebarItem>
                <Skeleton sx={{width: 160, height: 30}}/>
              </SidebarItem>
              <SidebarItem>
                <Skeleton sx={{width: 160, height: 30}}/>
              </SidebarItem>
            </>
          ) : ctx.formAccess?.map(_ => (
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
      {ctx.formAccess?.length === 0 && (
        <Fender type="empty" sx={{mt: 2}}>
          <Txt block color="disabled" size="big">{m._koboDatabase.noAccessToForm}</Txt>
          <Txt block color="disabled" dangerouslySetInnerHTML={{__html: m.contact(conf.contact)}}/>
        </Fender>
      )}
      <Routes>
        <Route index element={<DatabasesDefaultPage forms={ctx.formAccess}/>}/>
        <Route path={databaseModule.siteMap.home()} element={<DatabaseHome/>}>
          <Route index element={<Navigate to={databaseModule.siteMap.database.relative}/>}/>
          <Route path={databaseModule.siteMap.database.relative} element={<DatabaseTableRoute/>}/>
          <Route path={databaseModule.siteMap.access.relative} element={<DatabaseAccessRoute/>}/>
          {/*<Route path={databaseModule.siteMap.entry.absolute()} element={<DatabaseKoboAnswerView/>}/>*/}
        </Route>
      </Routes>
    </Layout>
  )
}

export const DatabaseHome = () => {
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {pathname} = useLocation()
  const ctx = useDatabaseContext()
  const {setTitle} = useLayoutContext()
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()

  const fetchersSchema = useDatabaseContext().formSchemas
  const fetcherAnswers = useFetcher((id: KoboId) => api.kobo.answer.searchByAccess({
    formId: id,
  }))

  useEffect(() => {
    fetchersSchema.fetch({}, serverId, formId)
    fetcherAnswers.fetch({}, formId)
  }, [serverId, formId])

  useEffectFn(ctx.getForm(formId)?.name, _ => _ && setTitle(m._koboDatabase.title(_)))
  useEffectFn(fetcherAnswers.error, toastHttpError)
  useEffectFn(fetchersSchema.getError(formId), toastHttpError)

  return (
    <>
      {fetchersSchema.getLoading(formId) ?
        (
          <LinearProgress/>
        ) : map(fetchersSchema.get(formId), schema => (
          <DatabaseKoboTableProvider
            schema={schema}
            fetcherAnswers={fetcherAnswers}
          >
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
          </DatabaseKoboTableProvider>
        ))}
    </>
  )
}


