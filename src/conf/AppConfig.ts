import {bool, defaultValue, env, required} from '@alexandreannic/ts-utils'

enum Env {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  NEXT_PUBLIC_GOOGLE_MAPS_ID = 'NEXT_PUBLIC_GOOGLE_MAPS_ID',
  NEXT_PUBLIC_API_BASE_URL = 'NEXT_PUBLIC_API_BASE_URL',
  NEXT_PUBLIC_MS_BEARER_TOKEN = 'NEXT_PUBLIC_MS_BEARER_TOKEN',
  NEXT_PUBLIC_MS_CLIENT_ID = 'NEXT_PUBLIC_MS_CLIENT_ID',
  NEXT_PUBLIC_MS_AUTHORITY = 'NEXT_PUBLIC_MS_AUTHORITY',
  NEXT_PUBLIC_APP_OFF = 'NEXT_PUBLIC_APP_OFF',
}

const persistedTempEnvVariablesForFront: { [key in Env]: string | undefined } = {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_MS_BEARER_TOKEN: process.env.NEXT_PUBLIC_MS_BEARER_TOKEN,
  NEXT_PUBLIC_MS_CLIENT_ID: process.env.NEXT_PUBLIC_MS_CLIENT_ID,
  NEXT_PUBLIC_MS_AUTHORITY: process.env.NEXT_PUBLIC_MS_AUTHORITY,
  NEXT_PUBLIC_APP_OFF: process.env.NEXT_PUBLIC_APP_OFF,
}

const _ = env(persistedTempEnvVariablesForFront)

export const appConfig = {
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


