import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useMemo} from 'react'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {useAsync} from '@/alexlib-labo/useAsync'
import {kobo} from '@/koboDrcUaFormId'
import {seq} from '@alexandreannic/ts-utils'

export type UseShelterData = ReturnType<typeof useShelterData>

export const useShelterData = (allowedOffices: Shelter_NTA['back_office'][] = []) => {
  const {api} = useAppSettings()

  const req = () => api.shelter.search().then(_ => allowedOffices.length === 0 ? _.data : _.data.filter(_ => allowedOffices.includes(_.nta?.back_office)))
  const fetcher = useFetcher(req)
  const index: undefined | Record<KoboAnswerId, number> = useMemo(() => {
    if (!fetcher.entity) return
    return fetcher.entity.reduce((acc, _, i) => {
      acc[_.id] = i
      return acc
    }, {} as Record<KoboAnswerId, number>)
    // const index: Record<'all' | 'nta' | 'ta', Record<KoboAnswerId, number>> = {
    //   all: {},
    //   nta: {},
    //   ta: {},
    // }
    // fetcher.entity.forEach((_, i) => {
    //   index.all[_.id] = i
    //   if (_.nta) index.all[_.nta.id] = i
    //   if (_.ta) index.all[_.ta.id] = i
    // })
    // return index
  }, [fetcher.entity])

  const fetchAll = fetcher.fetch

  const asyncSyncAnswers = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_ta),
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.shelter_nta),
    ])
    await fetchAll()
  })

  return {
    loading: fetcher.loading,
    fetcher,
    fetchAll,
    asyncSyncAnswers,
    fetching: fetcher.loading,
    mappedData: seq(fetcher.entity),
    index,
  } as const
}