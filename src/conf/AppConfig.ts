import {bool, defaultValue, env, required} from '@alexandreannic/ts-utils'
import {AppFeatureId, appFeaturesIndex} from '@/features/appFeatureId'

enum Env {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  NEXT_PUBLIC_GOOGLE_MAPS_ID = 'NEXT_PUBLIC_GOOGLE_MAPS_ID',
  NEXT_PUBLIC_API_BASE_URL = 'NEXT_PUBLIC_API_BASE_URL',
  NEXT_PUBLIC_MS_BEARER_TOKEN = 'NEXT_PUBLIC_MS_BEARER_TOKEN',
  NEXT_PUBLIC_MS_CLIENT_ID = 'NEXT_PUBLIC_MS_CLIENT_ID',
  NEXT_PUBLIC_MS_AUTHORITY = 'NEXT_PUBLIC_MS_AUTHORITY',
  NEXT_PUBLIC_APP_OFF = 'NEXT_PUBLIC_APP_OFF',
  NEXT_PUBLIC_MUI_PRO_LICENSE_KEY = 'NEXT_PUBLIC_MUI_PRO_LICENSE_KEY',
}

const persistedTempEnvVariablesForFront: { [key in Env]: string | undefined } = {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_MS_BEARER_TOKEN: process.env.NEXT_PUBLIC_MS_BEARER_TOKEN,
  NEXT_PUBLIC_MS_CLIENT_ID: process.env.NEXT_PUBLIC_MS_CLIENT_ID,
  NEXT_PUBLIC_MS_AUTHORITY: process.env.NEXT_PUBLIC_MS_AUTHORITY,
  NEXT_PUBLIC_APP_OFF: process.env.NEXT_PUBLIC_APP_OFF,
  NEXT_PUBLIC_MUI_PRO_LICENSE_KEY: process.env.NEXT_PUBLIC_MUI_PRO_LICENSE_KEY,
}

const _ = env(persistedTempEnvVariablesForFront)


export const appConfig = {
  uahToUsd: .027,
  muiProLicenseKey: _()(Env.NEXT_PUBLIC_MUI_PRO_LICENSE_KEY),
  linkToFeature: (feature: AppFeatureId, path: string) => {
    return appFeaturesIndex[feature].path + '/#' + path
  },
  contact: 'alexandre.annic@drc.ngo',
  apiURL: _(required)(Env.NEXT_PUBLIC_API_BASE_URL),
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
  appOff: _(bool, defaultValue(false))(Env.NEXT_PUBLIC_APP_OFF),
}

export type AppConfig = typeof appConfig


