import {HashRouter as Router, Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Layout} from '@/shared/Layout'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {PartnershipProvider} from '@/features/Partnership/PartnershipContext'
import {PartnershipDashboard} from '@/features/Partnership/Dashboard/PartnershipDashboard'
import {PartnershipDatabase} from '@/features/Partnership/Database/PartnershipDatabase'
import {kobo, KoboFormName, KoboIndex} from '@/KoboIndex'
import {DatabaseTable} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAaToast} from '@/core/useToast'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {Tooltip} from '@mui/material'
import {mpcaIndex} from '@/features/Mpca/Mpca'
import {KoboSchemaProvider} from '@/features/Kobo/KoboSchemaContext'

const relatedKoboForms: KoboFormName[] = [
  'partnership_partnersDatabase',
  'partnership_assessment',
  'partnership_initialQuestionnaire',
]

export const partnershipIndex = {
  basePath: '/partnership',
  siteMap: {
    data: '/data',
    // access: '/access',
    dashboard: '/dashboard',
    koboPartnersDatabase: '/kobo-partners-database',
    koboAssessment: '/kobo-assessment',
    koboInitialQuestionnaire: '/kobo-initial-questionnaire',
  }
}

const PartnershipSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const {conf} = useAppSettings()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(partnershipIndex.siteMap.dashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="insights" active={isActive}>{m.dashboard}</SidebarItem>
          )}
        </NavLink>
        {/*<NavLink to={path(partnershipModule.siteMap.data)}>*/}
        {/*  {({isActive, isPending}) => (*/}
        {/*    <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>*/}
        {/*  )}*/}
        {/*</NavLink>*/}
        <SidebarHr/>
        <SidebarSection title={m.koboForms}>
          {relatedKoboForms.map(_ => {
            const name = KoboIndex.byName(_).name
            return (
              <Tooltip key={_} title={name} placement="right">
                <NavLink to={path(mpcaIndex.siteMap.form(_))}>
                  {({isActive, isPending}) => (
                    <SidebarItem size="small" active={isActive} icon="calendar_view_month">{KoboIndex.byName(name).parsed.name}</SidebarItem>
                  )}
                </NavLink>
              </Tooltip>
            )
          })}
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  )
}

export const Partnership = () => {
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()

  const _schemas = useFetcher(async () => {
    const [
      partnersDatabase,
      // assessment,
      // initialQuestionnaire,
    ] = await Promise.all([
      api.koboApi.getForm({id: KoboIndex.byName('partnership_partnersDatabase').id}),
      // api.koboApi.getForm({id: KoboIndex.byName('partnership_assessment').id}),
      // api.koboApi.getForm({id: KoboIndex.byName('partnership_initialQuestionnaire').id}),
    ])
    return {
      partnersDatabase,
      // assessment,
      // initialQuestionnaire,
    }
  })

  useEffect(() => {
    _schemas.fetch()
  }, [])

  useEffectFn(_schemas.error, toastHttpError)

  return (
    <Router>
      <Layout
        title={appFeaturesIndex.partnership.name}
        sidebar={<PartnershipSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        {_schemas.entity && (
          <KoboSchemaProvider schema={_schemas.entity.partnersDatabase}>
            <PartnershipProvider>
              <Routes>
                <Route index element={<Navigate to={partnershipIndex.siteMap.dashboard}/>}/>
                <Route path={partnershipIndex.siteMap.dashboard} element={<PartnershipDashboard/>}/>
                {/*<Route path={partnershipModule.siteMap.data} element={<PartnershipDatabase/>}/>*/}
                <Route path={partnershipIndex.siteMap.koboPartnersDatabase}
                       element={<DatabaseTable formId={KoboIndex.byName('partnership_partnersDatabase').id} schema={_schemas.entity.partnersDatabase}/>}/>
                {/*<Route path={partnershipModule.siteMap.koboAssessment}*/}
                {/*       element={<DatabaseTable formId={KoboIndex.byName('partnership_assessment').id} schema={_schemas.entity.assessment}/>}/>*/}
                {/*<Route path={partnershipModule.siteMap.koboInitialQuestionnaire}*/}
                {/*       element={<DatabaseTable formId={KoboIndex.byName('partnership_initialQuestionnaire').id} schema={_schemas.entity.initialQuestionnaire}/>}/>*/}
              </Routes>
            </PartnershipProvider>
          </KoboSchemaProvider>
        )}
      </Layout>
    </Router>
  )
}