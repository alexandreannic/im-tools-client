import {Enum} from '@alexandreannic/ts-utils'
import {UserSession} from '@/core/sdk/server/session/Session'
import {appConfig} from '@/conf/AppConfig'
import {Access} from '@/core/sdk/server/access/Access'
import {kobo, KoboIndex} from '@/KoboIndex'

export enum AppFeatureId {
  meal = 'meal',
  dashboards = 'dashboards',
  kobo_database = 'kobo_database',
  mpca = 'mpca',
  shelter = 'shelter',
  meal_verification = 'meal_verification',
  partnership = 'partnership',
  wfp_deduplication = 'wfp_deduplication',
  activity_info = 'activity_info',
  cfm = 'cfm',
  admin = 'admin',
  playground = 'playground',
  snapshot = 'snapshot',
}

export interface AppFeature {
  id: AppFeatureId
  name: string
  materialIcons: string
  color: string
  path: string
  showIf?: (_?: UserSession, a?: Access[]) => boolean | undefined
}

export const appFeaturesIndex: Record<AppFeatureId, AppFeature> = {
  dashboards: {
    id: AppFeatureId.dashboards,
    name: 'Dashboards',
    materialIcons: 'insights',
    color: 'red',
    path: '/dashboard',
  },
  kobo_database: {
    id: AppFeatureId.kobo_database,
    name: 'Kobo Databases',
    materialIcons: 'fact_check',
    color: '#259af4',
    path: '/database',
  },
  shelter: {
    id: AppFeatureId.shelter,
    name: 'Shelter',
    materialIcons: 'home_work',
    color: '#742020',
    path: '/shelter',
    showIf: (u, accesses) => {
      // return u && ([
      //   'xavier.desplans@drc.ngo',
      //   'enrico.dainese@drc.ngo',
      //   'paul.thibault@drc.ngo',
      //   'lorenza.esquinca@drc.ngo',
      // ].includes(u.email) || u.admin)
      // return u?.email === appConfig.contact
      return u?.admin || accesses && !!accesses
        .filter(Access.filterByFeature(AppFeatureId.kobo_database))
        .find(_ => _.params?.koboFormId === KoboIndex.byName('shelter_nta').id)
    }
  },
  mpca: {
    id: AppFeatureId.mpca,
    name: 'MPCA and Basic Needs',
    materialIcons: 'savings',
    color: 'green',
    path: '/mpca',
    showIf: (u, accesses) => {
      return u?.admin || accesses && !!accesses
        .filter(Access.filterByFeature(AppFeatureId.kobo_database))
        .find(_ => _.params?.koboFormId === KoboIndex.byName('bn_re').id)
      // return u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.mpca)
    }
  },
  meal: {
    id: AppFeatureId.meal,
    name: 'MEAL',
    // materialIcons: 'display_settings',
    materialIcons: 'troubleshoot',
    color: '#1f9b97',
    path: '/meal',
    showIf: (u, accesses) => {
      return u?.admin || accesses && !!accesses
        .filter(Access.filterByFeature(AppFeatureId.kobo_database))
        .find(_ => _.params?.koboFormId === KoboIndex.byName('bn_re').id)
      // return u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.mpca)
    }
  },
  meal_verification: {
    id: AppFeatureId.meal_verification,
    name: 'Meal Verification',
    materialIcons: 'troubleshoot',
    color: '#afd0d6',
    path: '/meal-verification',
    showIf: (_, accesses) => _ && _?.admin || accesses && !!accesses
      .filter(Access.filterByFeature(AppFeatureId.kobo_database))
      .find(_ => {
        return _.params?.koboFormId === KoboIndex.byName('bn_re').id ||
          _.params?.koboFormId === KoboIndex.byName('ecrec_cashRegistration').id ||
          _.params?.koboFormId === KoboIndex.byName('meal_visitMonitoring').id
      })
  },
  activity_info: {
    materialIcons: 'group_work',
    id: AppFeatureId.activity_info,
    name: 'Activity Info',
    color: '#00e6b8',
    path: '/activity-info',
    showIf: _ => true,
  },
  wfp_deduplication: {
    id: AppFeatureId.wfp_deduplication,
    name: 'WFP Deduplication',
    materialIcons: 'join_left',
    color: 'orange',
    path: '/wfp-deduplication',
    showIf: (u, accesses) => {
      return u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.wfp_deduplication)
    }
  },
  cfm: {
    id: AppFeatureId.cfm,
    name: 'CFM',
    materialIcons: 'support_agent',
    color: '#1c2c73',
    path: '/cfm',
    showIf: (u, accesses) => true
    // showIf: (u, accesses) => u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.cfm)
  },
  [AppFeatureId.partnership]: {
    id: AppFeatureId.partnership,
    name: 'Partnership',
    materialIcons: 'handshake',
    color: '#8ab4f8',
    path: '/partnership',
    showIf: (u, accesses) => true
    // showIf: (u, accesses) => u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.cfm)
  },
  snapshot: {
    id: AppFeatureId.snapshot,
    name: 'Snapshots',
    materialIcons: 'photo_camera',
    color: 'silver',
    path: '/snapshot',
    showIf: _ => _ && _?.admin
  },
  admin: {
    id: AppFeatureId.admin,
    name: 'Admin',
    materialIcons: 'admin_panel_settings',
    color: 'silver',
    path: '/admin',
    showIf: _ => _ && _?.admin
  },
  playground: {
    id: 'playground' as any,
    color: 'black',
    name: 'Playground',
    path: '/playground',
    materialIcons: 'admin',
    showIf: _ => _ && _?.email === appConfig.contact
  }
}

export const appFeatures = Enum.values(appFeaturesIndex)
