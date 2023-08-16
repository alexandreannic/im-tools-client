import {HashRouter as Router, Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useEffect, useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {CfmTable} from '@/features/Cfm/Data/CfmTable'
import {CfmProvider, useCfmContext} from '@/features/Cfm/CfmContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAaToast} from '@/core/useToast'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {CfmEntryRoute} from '@/features/Cfm/Data/CfmEntry'
import {KoboMealCfmStatus} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Box, Divider} from '@mui/material'
import {CfmAccess} from '@/features/Cfm/Access/CfmAccess'

export const cfmModule = {
  basePath: '/cfm',
  siteMap: {
    access: '/access',
    data: '/data',
    entry: (formId: KoboId = ':formId', answerId: string = ':answerId') => `/entry/${formId}/${answerId}`
  }
}

const FcmSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const ctx = useCfmContext()
  const _stats = useMemo(() => {
    let open = 0
    let coc = 0
    ctx.data.entity?.forEach(_ => {
      if (_.tags?.status === undefined || _.tags?.status === KoboMealCfmStatus.Open) {
        if (_.internal?.feedback_type === 'coc') coc++
        open++
      }
    })
    return {
      open,
      coc,
      total: ctx.data.entity?.length
    }
  }, [ctx.data])

  return (
    <Sidebar>
      <SidebarBody>
        <Box sx={{pl: 2}}>
          <PieChartIndicator
            dense
            showValue
            title={m._cfm.openTickets}
            value={_stats.open}
            base={_stats.total ?? 1}
          />
          <Divider sx={{my: 1.5}}/>
          <PieChartIndicator
            dense
            showValue
            title={m._cfm.openTicketsCoc}
            value={_stats.coc}
            base={_stats.total ?? 1}
          />
        </Box>
      </SidebarBody>
      <SidebarBody>
        <SidebarHr/>
        <NavLink to={path(cfmModule.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(cfmModule.siteMap.access)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="person_add" active={isActive}>{m.access}</SidebarItem>
          )}
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const CfmModule = () => {
  const {session, accesses} = useSession()
  const {toastHttpError} = useAaToast()
  const access = useMemo(() => !!appFeaturesIndex.cfm.showIf?.(session, accesses), [accesses])
  const {api} = useAppSettings()
  const _schemas = useFetcher(async () => {
    const [external, internal] = await Promise.all([
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.cfmExternal),
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.cfmInternal),
    ])
    return {external, internal}
  })

  useEffect(() => {
    _schemas.fetch()
  }, [])

  useEffectFn(_schemas.error, toastHttpError)

  if (!access) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <>
      {_schemas.entity ? (
        <CfmProvider schemas={_schemas.entity}>
          <Router>
            <Layout
              title={appFeaturesIndex.cfm.name}
              sidebar={<FcmSidebar/>}
              header={<AppHeader id="app-header"/>}
            >
              <Routes>
                <Route index element={<Navigate to={cfmModule.siteMap.data}/>}/>
                <Route path={cfmModule.siteMap.data} element={<CfmTable/>}/>
                <Route path={cfmModule.siteMap.entry()} element={<CfmEntryRoute/>}/>
                <Route path={cfmModule.siteMap.access} element={<CfmAccess/>}/>
              </Routes>
            </Layout>
          </Router>
        </CfmProvider>
      ) : _schemas.loading && (
        <>
          {/*<Fender type="loading"/>*/}
        </>
      )}
    </>
  )
}

