import {seq} from '@alexandreannic/ts-utils'

export interface MinusRusData {
  aircraft: number
  armored_combat_vehicles: number
  artillery: number
  prisoners: number
  killed: number
  ships_boats: number
  tanks: number
  component: 'losses'
  date: Date
  helicopters: number
  id: number
  wounded: number
  _uid: string
}

export const parseMinusRus = (htmlPage: string) => {
  const mapped = (evalScript(htmlPage).state.sortedStoriesByDateDESC as any[])
    .map(_ => _.content as MinusRusData)
    .map((_) => ({
      ..._,
      aircraft: +_.aircraft,
      armored_combat_vehicles: +_.armored_combat_vehicles,
      artillery: +_.artillery,
      helicopters: +_.helicopters,
      wounded: +_.wounded,
      prisoners: +_.prisoners,
      killed: +_.killed,
      ships_boats: +_.ships_boats,
      tanks: +_.tanks,
      date: new Date(_.date),
    }))
  return seq(mapped)
}

const evalScript = (htmlPage: string) => {
  const container = document.createElement('div')
  container.innerHTML = htmlPage
  const scripts = container.querySelectorAll('script')
  const dataScript = scripts.item(2)
  const code = dataScript.innerHTML.replaceAll('window.__NUXT__=', '')
  return eval(code)
}

