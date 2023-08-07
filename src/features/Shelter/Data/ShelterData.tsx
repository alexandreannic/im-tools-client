import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {useEffect} from 'react'
import {Page} from '@/shared/Page'

export interface ShelterDataFilters extends KoboAnswerFilter {

}

export const ShelterData = () => {
  const {api} = useAppSettings()
  const _data = useFetcher(async (filters?: ShelterDataFilters) => {
    const index: Record<string, {
      ta: KoboAnswer<Shelter_TA>[],
      nta: KoboAnswer<Shelter_NTA>[],
    }> = {} as any
    await Promise.all([
      api.kobo.answer.searchShelterNTA(filters).then(_ => _.data.forEach(d => {
        if (!index[d.id]) index[d.id] = {ta: [], nta: []}
        index[d.id].nta.push(d)
      })),
      api.kobo.answer.searchShelterTA(filters).then(_ => _.data.forEach(d => {
        if (!index[d.id]) index[d.id] = {ta: [], nta: []}
        index[d.id].ta.push(d)
      })),
    ])
    console.log(index)
  })

  useEffect(() => {
    _data.fetch()
  }, [])

  return (
    <Page>

    </Page>
  )
}