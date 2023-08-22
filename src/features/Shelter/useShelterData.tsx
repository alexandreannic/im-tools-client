import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Enum} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useMemo} from 'react'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {ShelterNtaTags, ShelterTaPriceLevel, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {ShelterContractorPrices} from '@/core/sdk/server/kobo/custom/ShelterContractor'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'

export interface ShelterRow {
  ta?: KoboAnswer<Shelter_TA, ShelterTaTags> & {
    _price?: number | string
    _priceLevel?: ShelterTaPriceLevel
  }
  nta?: KoboAnswer<Shelter_NTA, ShelterNtaTags>
  id: KoboAnswerId
}

export type UseShelterData = ReturnType<typeof useShelterData>

export const useShelterData = () => {
  const {api} = useAppSettings()
  const ntaRequest = () => api.kobo.answer.searchShelterNta().then(_ => _.data)
  const taRequest = () => api.kobo.answer.searchShelterTa().then(_ => _.data)
  const _fetchNta = useFetcher(ntaRequest)
  const _fetchTa = useFetcher(taRequest)

  const mappedData = useMemo(() => {
    if (!_fetchTa.entity || !_fetchNta.entity) return
    const index: Record<KoboAnswerId, {
      nta?: ShelterRow['nta'],
      ta?: ShelterRow['ta'],
    }> = {} as any
    _fetchNta.entity.forEach(d => {
      if (!index[d.id]) index[d.id] = {}
      index[d.id].nta = d
    })
    _fetchTa.entity.forEach(d => {
      const refId = d.nta_id ? +d.nta_id.replaceAll(/[^\d]/g, '') : d.id
      if (!index[refId]) index[refId] = {}
      const price = ShelterContractorPrices.compute({
        answer: d,
        contractor1: d.tags?.contractor1,
        contractor2: d.tags?.contractor2,
      })
      const nta = index[refId].nta
      const priceLevel = () => {
        if (!price || typeof price != 'number') return
        if (nta?.dwelling_type === 'house') {
          if (price < 100000) return ShelterTaPriceLevel.Light
          if (price >= 100000 && price <= 200000) return ShelterTaPriceLevel.Medium
          return ShelterTaPriceLevel.Heavy
        } else if (nta?.dwelling_type === 'apartment') {
          if (price < 40000) return ShelterTaPriceLevel.Light
          if (price >= 40000 && price <= 80000) return ShelterTaPriceLevel.Medium
          return ShelterTaPriceLevel.Heavy
        }
      }
      index[refId].ta = {
        ...d,
        _price: price,
        _priceLevel: priceLevel()
      }
    })
    return Enum.entries(index)
      // .filter(([k, v]) => !!v.nta)
      .map(([k, v]) => ({id: k, ...v}))
      .sort((a, b) => {
        if (!a.nta) return -1
        if (!b.nta) return 1
        return a.nta.submissionTime?.getTime() - b.nta?.submissionTime.getTime()
      }) as ShelterRow[]
  }, [_fetchTa.entity, _fetchNta.entity])

  return {
    _fetchNta,
    _fetchTa,
    mappedData,
  }
}