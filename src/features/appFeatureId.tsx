import {Enum} from '@alexandreannic/ts-utils'
import {UserSession} from '@/core/sdk/server/session/Session'
import {appConfig} from '@/conf/AppConfig'

export enum AppFeatureId {
  dashboards = 'dashboards',
  kobo_database = 'kobo_database',
  mpca = 'mpca',
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
  showIf?: (_?: UserSession) => boolean | undefined
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
    name: 'Databases',
    materialIcons: 'fact_check',
    color: '#0052bc',
    path: '/database',
  },
  mpca: {
    id: AppFeatureId.mpca,
    name: 'MPCA',
    materialIcons: 'savings',
    color: 'green',
    path: '/mpca',
  },
  activity_info: {
    materialIcons: 'group_work',
    id: AppFeatureId.activity_info,
    name: 'Activity Info',
    color: '#00e6b8',
    path: '/activity-info',
  },
  wfp_deduplication: {
    id: AppFeatureId.wfp_deduplication,
    name: 'WFP Deduplication',
    materialIcons: 'join_left',
    color: 'orange',
    path: '/wfp-deduplication',
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
