import {Enum} from '@alexandreannic/ts-utils'
import {UserSession} from '@/core/sdk/server/session/Session'
import {appConfig} from '@/conf/AppConfig'
import {Access} from '@/core/sdk/server/access/Access'
import {kobo} from '@/koboDrcUaFormId'

export enum AppFeatureId {
  dashboards = 'dashboards',
  kobo_database = 'kobo_database',
  mpca = 'mpca',
  shelter = 'shelter',
  wfp_deduplication = 'wfp_deduplication',
  activity_info = 'activity_info',
  admin = 'admin',
  playground = 'playground',
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
    color: 'brown',
    path: '/shelter',
    showIf: (u, accesses) => {
      return u?.email === appConfig.contact
      // return u?.admin || accesses && !!accesses
      //   .filter(Access.filterByFeature(AppFeatureId.kobo_database))
      //   .find(_ => _.params?.koboFormId === kobo.drcUa.form.shelterNTA)
    }
  },
  mpca: {
    id: AppFeatureId.mpca,
    name: 'MPCA',
    materialIcons: 'savings',
    color: 'green',
    path: '/mpca',
    showIf: (u, accesses) => {
      return u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.mpca)
    }
  },
  activity_info: {
    materialIcons: 'group_work',
    id: AppFeatureId.activity_info,
    name: 'Activity Info',
    color: '#00e6b8',
    path: '/activity-info',
    showIf: _ => _ && _?.admin,
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
