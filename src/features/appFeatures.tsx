import {Enum} from '@alexandreannic/ts-utils'

export interface AppFeature {
  name: string
  materialIcons: string
  color: string
  path: string
}

export const appFeaturesIndex = {
  WFP_Deduplication: {
    name: 'WFP Deduplication',
    materialIcons: 'join_left',
    color: 'orange',
    path: '/wfp-deduplication',
  },
  Databases: {
    name: 'Databases',
    materialIcons: 'table_chart',
    color: '#0052bc',
    path: '/database',
  },
  Dashboards: {
    name: 'Dashboards',
    materialIcons: 'insights',
    color: 'red',
    path: '/dashboard',
  }
}

export const appFeatures = Enum.values(appFeaturesIndex)