import {HashRouter as Router, Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {AppFeatureId, appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {KoboFormName, KoboIndex} from '@/KoboIndex'
import {MealVerificationList} from '@/features/Meal/Verification/MealVerificationList'
import {MealVerificationForm} from '@/features/Meal/Verification/Form/MealVerificationForm'
import {MealVerificationTable} from '@/features/Meal/Verification/MealVerificationTable'
import {getKoboFormRouteProps, SidebarKoboLink} from '@/features/SidebarKoboLink'
import {MealVisit} from '@/features/Meal/Visit/MealVisit'
import {MealVisitDashboard} from '@/features/Meal/Visit/MealVisitDashboard'
import {MealVisitDetails} from '@/features/Meal/Visit/MealVisitDetails'
import {MealVerification} from '@/features/Meal/Verification/MealVerification'
import {Access} from '@/core/sdk/server/access/Access'
import {appConfig} from '@/conf/AppConfig'

const relatedKoboForms: KoboFormName[] = [
  'meal_verificationWinterization',
  'meal_verificationEcrec',
  'meal_visitMonitoring'
]

export const mealModule = {
  basePath: '/meal',
  siteMap: {
    visit: {
      _: '/visit',
      dashboard: `/visit/dashobard`,
      details: (koboAnswerId = ':id') => `/visit/details/${koboAnswerId}`,
    },
    verification: {
      _: '/verification',
      list: '/verification/list',
      form: '/verification/form',
      data: (_: string = '/:id') => `/verification/${_}`,
    },
    form: (id: KoboFormName = ':id' as any) => '/form/' + id,
  }
}

const MealSidebar = ({
  access
}: {
  access: {
    verification: boolean
  }
}) => {
  const path = (page: string) => '' + page
  const {m, formatLargeNumber} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarSection title={m._meal.visitMonitoring}>
          <NavLink to={path(mealModule.siteMap.visit._)}>
            {({isActive, isPending}) => (
              <SidebarItem icon="assignment_turned_in" active={isActive}>{m.dashboard}</SidebarItem>
            )}
          </NavLink>
          <a href="https://drcngo.sharepoint.com/:x:/s/UKR-MEAL_DM-WS/Ee4lwQ1OMKhCkzyeza_UejoBVWdn-2zgxjoCbpPjN4DZZQ?e=zn5LHw" target="_blank">
            <SidebarItem icon={appConfig.icons.matrix} iconEnd="open_in_new">{m._meal.openTracker}</SidebarItem>
          </a>
          <SidebarKoboLink path={path(mealModule.siteMap.form('meal_visitMonitoring'))} name="meal_visitMonitoring"/>
        </SidebarSection>
        {access.verification && (
          <SidebarSection title={m._meal.verification}>
            <NavLink to={path(mealModule.siteMap.verification.list)}>
              {({isActive, isPending}) => (
                <SidebarItem icon="manage_search" active={isActive}>{m.data}</SidebarItem>
              )}
            </NavLink>
            <NavLink to={path(mealModule.siteMap.verification.form)}>
              {({isActive, isPending}) => (
                <SidebarItem icon="add_circle" active={isActive}>{m._mealVerif.newRequest}</SidebarItem>
              )}
            </NavLink>
            <SidebarKoboLink path={path(mealModule.siteMap.form('meal_verificationEcrec'))} name="meal_verificationEcrec"/>
            <SidebarKoboLink path={path(mealModule.siteMap.form('meal_verificationWinterization'))} name="meal_verificationWinterization"/>
          </SidebarSection>
        )}
      </SidebarBody>
    </Sidebar>
  )
}

export const Meal = () => {
  const {session, accesses} = useSession()
  const access = useMemo(() => {
    return {
      _: !!appFeaturesIndex.meal.showIf?.(session, accesses),
      verification: session && session?.admin || accesses && !!accesses
        .filter(Access.filterByFeature(AppFeatureId.kobo_database))
        .find(_ => {
          return _.params?.koboFormId === KoboIndex.byName('bn_re').id ||
            _.params?.koboFormId === KoboIndex.byName('ecrec_cashRegistration').id ||
            _.params?.koboFormId === KoboIndex.byName('meal_visitMonitoring').id
        })
    }
  }, [accesses, session])

  if (!access._) {
    return (
      <NoFeatureAccessPage/>
    )
  }

  return (
    <Router>
      <Layout
        sidebar={<MealSidebar access={access}/>}
        header={<AppHeader id="app-header"/>}
      >
        <Routes>
          <Route path={mealModule.siteMap.visit._} element={<MealVisit/>}>
            <Route index element={<Navigate to={mealModule.siteMap.visit.dashboard}/>}/>
            <Route path={mealModule.siteMap.visit.dashboard} element={<MealVisitDashboard/>}/>
            <Route path={mealModule.siteMap.visit.details()} element={<MealVisitDetails/>}/>
          </Route>
          {access.verification && (
            <Route path={mealModule.siteMap.verification._} element={<MealVerification/>}>
              <Route index element={<Navigate to={mealModule.siteMap.verification.list}/>}/>
              <Route path={mealModule.siteMap.verification.list} element={<MealVerificationList/>}/>
              <Route path={mealModule.siteMap.verification.form} element={<MealVerificationForm/>}/>
              <Route path={mealModule.siteMap.verification.data()} element={<MealVerificationTable/>}/>
            </Route>
          )}
          <Route index element={<Navigate to={mealModule.siteMap.visit.dashboard}/>}/>
          {relatedKoboForms.map(_ =>
            <Route key={_} {...getKoboFormRouteProps({path: mealModule.siteMap.form(_), name: _})}/>
          )}
        </Routes>
      </Layout>
    </Router>
  )
}

