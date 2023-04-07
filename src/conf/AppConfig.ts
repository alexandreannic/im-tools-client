import {env, required} from '@alexandreannic/ts-utils'

const _ = env(process.env)

export const appConfig = {
  contact: 'alexandre.annic@drc.ngo',
  apiURL: _(required)('REACT_APP_API_URL'),
  gooogle: {
    apiKey: _(required)('REACT_APP_GOOGLE_MAPS_API_KEY'),
    mapId: _(required)('REACT_APP_GOOGLE_MAPS_ID'),
  }
}

console.log(appConfig)

export type AppConfig = typeof appConfig


