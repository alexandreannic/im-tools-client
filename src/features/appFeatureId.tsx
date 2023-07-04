import {Enum} from '@alexandreannic/ts-utils'

export enum AppFeatureId {
  dashboards = 'dashboards',
  databases = 'databases',
  mpca = 'mpca',
  wfp_deduplication = 'wfp_deduplication',
  activity_info = 'activity_info',
}

export interface AppFeature {
  id: AppFeatureId
  name: string
  materialIcons: string
  color: string
  path: string
}

export const appFeaturesIndex: Record<AppFeatureId, AppFeature> = {
  dashboards: {
    id: AppFeatureId.dashboards,
    name: 'Dashboards',
    materialIcons: 'insights',
    color: 'red',
    path: '/dashboard',
  },
  databases: {
    id: AppFeatureId.databases,
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
}

export const appFeatures = Enum.values(appFeaturesIndex)