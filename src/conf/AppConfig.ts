import {bool, defaultValue, env, required} from '@alexandreannic/ts-utils'
import {AppFeatureId, appFeaturesIndex} from '@/features/appFeatureId'

enum Env {
  NEXT_PUBLIC_SENTRY_DNS = 'NEXT_PUBLIC_SENTRY_DNS',
  NEXT_PUBLIC_BASE_URL = 'NEXT_PUBLIC_BASE_URL',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  NEXT_PUBLIC_GOOGLE_MAPS_ID = 'NEXT_PUBLIC_GOOGLE_MAPS_ID',
  NEXT_PUBLIC_API_BASE_URL = 'NEXT_PUBLIC_API_BASE_URL',
  NEXT_PUBLIC_MS_BEARER_TOKEN = 'NEXT_PUBLIC_MS_BEARER_TOKEN',
  NEXT_PUBLIC_MS_CLIENT_ID = 'NEXT_PUBLIC_MS_CLIENT_ID',
  NEXT_PUBLIC_MS_AUTHORITY = 'NEXT_PUBLIC_MS_AUTHORITY',
  NEXT_PUBLIC_APP_OFF = 'NEXT_PUBLIC_APP_OFF',
  NEXT_PUBLIC_MUI_PRO_LICENSE_KEY = 'NEXT_PUBLIC_MUI_PRO_LICENSE_KEY',
  NEXT_PUBLIC_CHATGPT_APIKEY = 'NEXT_PUBLIC_CHATGPT_APIKEY',
}

const persistedTempEnvVariablesForFront: { [key in Env]: string | undefined } = {
  NEXT_PUBLIC_SENTRY_DNS: process.env.NEXT_PUBLIC_SENTRY_DNS,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_MS_BEARER_TOKEN: process.env.NEXT_PUBLIC_MS_BEARER_TOKEN,
  NEXT_PUBLIC_MS_CLIENT_ID: process.env.NEXT_PUBLIC_MS_CLIENT_ID,
  NEXT_PUBLIC_MS_AUTHORITY: process.env.NEXT_PUBLIC_MS_AUTHORITY,
  NEXT_PUBLIC_APP_OFF: process.env.NEXT_PUBLIC_APP_OFF,
  NEXT_PUBLIC_MUI_PRO_LICENSE_KEY: process.env.NEXT_PUBLIC_MUI_PRO_LICENSE_KEY,
  NEXT_PUBLIC_CHATGPT_APIKEY: process.env.NEXT_PUBLIC_CHATGPT_APIKEY,
}

const _ = env(persistedTempEnvVariablesForFront)

export const appConfig = {
  uahToUsd: .027,
  muiProLicenseKey: _()(Env.NEXT_PUBLIC_MUI_PRO_LICENSE_KEY),
  linkToFeature: (feature: AppFeatureId, path: string) => {
    const featurePath = appFeaturesIndex[feature]?.path ?? feature
    return featurePath + '/#' + path
  },
  contact: 'alexandre.annic@drc.ngo',
  apiURL: _(required)(Env.NEXT_PUBLIC_API_BASE_URL),
  baseURL: _(defaultValue('https://infoportal-ua.drc.ngo/'))(Env.NEXT_PUBLIC_BASE_URL),
  sentry: {
    dsn: _()(Env.NEXT_PUBLIC_SENTRY_DNS)
  },
  gooogle: {
    apiKey: _(required)(Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    mapId: _(required)(Env.NEXT_PUBLIC_GOOGLE_MAPS_ID),
  },
  microsoft: {
    // To find it go to https://developer.microsoft.com/en-us/graph/graph-explorer,
    // Login and inspect Network
    bearerToken: _(required)(Env.NEXT_PUBLIC_MS_BEARER_TOKEN),
    clientId: _(required)(Env.NEXT_PUBLIC_MS_CLIENT_ID),
    authority: _(required)(Env.NEXT_PUBLIC_MS_AUTHORITY),
  },
  chatGptApiKey: _()(Env.NEXT_PUBLIC_CHATGPT_APIKEY),
  appOff: _(bool, defaultValue(false))(Env.NEXT_PUBLIC_APP_OFF),
  externalLink: {
    mealReferralMatrix: 'https://drcngo.sharepoint.com/:x:/r/sites/UKRPortal/_layouts/15/Doc.aspx?sourcedoc=%7B401B9D94-94AF-4D88-A85D-BBCCAC7196FE%7D&file=DRC%20Ukraine%20CFM%20Referral%20Matrix_updated.xlsx&action=default&mobileredirect=true'
  },
  icons: {
    program: 'book',
    koboForm: appFeaturesIndex.kobo_database.materialIcons,
    donor: 'handshake',
    disability: 'assist_walker',
    project: 'inventory_2',
    oblast: 'location_on',
    matrix: 'hub',
    koboFormLink: appFeaturesIndex.kobo_database.materialIcons,
    office: 'business',
    displacementStatus: 'directions_run',
    dataTable: 'table_view',
    dashboard: 'stacked_bar_chart',
  },
  iconStatus: {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info'
  },
  other: {
    protection: {
      echoDuplicationEstimationPercent: 10,
      echoDisabilityEstimationPercent: 13,
    }
  }
}

export type AppConfig = typeof appConfig


