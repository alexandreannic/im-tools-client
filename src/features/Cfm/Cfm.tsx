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
import {kobo, KoboFormName, KoboIndex} from '@/KoboIndex'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAaToast} from '@/core/useToast'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {CfmEntryRoute} from '@/features/Cfm/Data/CfmDetails'
import {CfmDataPriority, KoboMealCfmStatus} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Box} from '@mui/material'
import {CfmAccess} from '@/features/Cfm/Access/CfmAccess'
import {KoboUkraineMap} from '@/features/Dashboard/shared/KoboUkraineMap'
import {Fender} from 'mui-extension'
import {appConfig} from '@/conf/AppConfig'
import {getKoboFormRouteProps, SidebarKoboLink} from '@/features/SidebarKoboLink'
import {shelterIndex} from '@/features/Shelter/Shelter'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'

const relatedKoboForms: KoboFormName[] = [
  'meal_cfmInternal',
  'meal_cfmExternal',
]

export const cfmIndex = {
  basePath: '/cfm',
  siteMap: {
    access: '/access',
    data: '/data',
    entry: (formId: KoboId = ':formId', answerId: string = ':answerId') => `/entry/${formId}/${answerId}`
  }
}

const CfmSidebar = () => {
  const path = (page: string) => '' + page
  const {conf} = useAppSettings()
  const {m} = useI18n()
  const ctx = useCfmContext()
  const _stats = useMemo(() => {
    let open = 0
    let coc = 0
    ctx.mappedData?.forEach(_ => {
      if (_.tags?.status === undefined || _.tags?.status === KoboMealCfmStatus.Open) {
        if (_.priority === CfmDataPriority.High) coc++
        open++
      }
    })
    return {
      open,
      coc,
      total: ctx.mappedData?.length
    }
  }, [ctx.data])

  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(cfmIndex.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(cfmIndex.siteMap.access)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="person_add" active={isActive}>{m.access}</SidebarItem>
          )}
        </NavLink>
        <SidebarHr/>
        <SidebarItem
          icon={appConfig.icons.matrix}
          onClick={() => void 0}
          href={conf.externalLink.mealReferralMatrix}
          target="_blank"
          iconEnd="open_in_new"
        >
          {m._cfm.referralMatrix}
        </SidebarItem>
        <SidebarSection title={m.koboForms}>
          {relatedKoboForms.map(_ =>
            <SidebarKoboLink key={_} path={path(shelterIndex.siteMap.form(_))} name={_}/>
          )}
        </SidebarSection>
      </SidebarBody>
      <SidebarHr/>
      <SidebarBody>
        <Box sx={{pl: 2}}>
          <PieChartIndicator
            dense
            showValue
            title={m._cfm.openTickets}
            value={_stats.open}
            base={_stats.total ?? 1}
          />
          {/*<Divider sx={{my: 1.5}}/>*/}
          <PieChartIndicator
            sx={{mt: 2}}
            dense
            showValue
            title={m._cfm.openTicketsHigh}
            value={_stats.coc}
            base={_stats.open ?? 1}
          />
        </Box>
        <KoboUkraineMap
          sx={{ml: 1, mt: 2}}
          fillBaseOn="value"
          data={ctx.mappedData}
          value={_ => true}
          getOblast={_ => _.oblastIso!}
          base={_ => _.oblastIso !== undefined}
        />
      </SidebarBody>
    </Sidebar>
  )
}

export const Cfm = () => {
  const {session, accesses} = useSession()
  const {toastHttpError} = useAaToast()
  const access = useMemo(() => !!appFeaturesIndex.cfm.showIf?.(session, accesses), [accesses])
  const {api} = useAppSettings()
  const _schemas = useFetcher(async () => {
    const [external, internal] = await Promise.all([
      api.koboApi.getForm({id: KoboIndex.byName('meal_cfmExternal').id}),
      api.koboApi.getForm({id: KoboIndex.byName('meal_cfmInternal').id}),
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
              sidebar={<CfmSidebar/>}
              header={<AppHeader id="app-header"/>}
            >
              <Routes>
                <Route index element={<Navigate to={cfmIndex.siteMap.data}/>}/>
                <Route path={cfmIndex.siteMap.data} element={<CfmTable/>}/>
                <Route path={cfmIndex.siteMap.entry()} element={<CfmEntryRoute/>}/>
                <Route path={cfmIndex.siteMap.access} element={<CfmAccess/>}/>
                {relatedKoboForms.map(_ =>
                  <Route key={_} {...getKoboFormRouteProps({path: shelterIndex.siteMap.form(_), name: _})}/>
                )}
              </Routes>
            </Layout>
          </Router>
        </CfmProvider>
      ) : _schemas.loading && (
        <>
          <Fender type="loading"/>
        </>
      )}
    </>
  )
}
