import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Enum, fnSwitch, seq, Seq} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useCallback, useMemo} from 'react'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {ShelterNtaTags, ShelterTaPriceLevel, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import {ShelterContractorPrices} from '@/core/sdk/server/kobo/custom/ShelterContractor'
import {OblastIndex, OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcOffice} from '@/core/drcUa'

export interface ShelterRow {
  ta?: KoboAnswer<Shelter_TA, ShelterTaTags> & {
    _price?: number | null
    _priceLevel?: ShelterTaPriceLevel
  }
  nta?: KoboAnswer<Shelter_NTA, ShelterNtaTags>
  oblastIso?: OblastISO | ''
  oblast?: OblastName | ''
  office?: DrcOffice | ''
  id: KoboAnswerId
}

export type UseShelterData = ReturnType<typeof useShelterData>

export const useShelterData = (allowedOffices: Shelter_NTA['back_office'][] = []) => {
  const {api} = useAppSettings()
  const ntaRequest = () => api.kobo.answer.searchShelterNta().then(_ => _.data)
  const taRequest = () => api.kobo.answer.searchShelterTa().then(_ => _.data)
  const _fetchNta = useFetcher(ntaRequest)
  const _fetchTa = useFetcher(taRequest)

  const {mappedData, index} = useMemo(() => {
      if (!_fetchTa.entity || !_fetchNta.entity) return {}
      const skippedNta = new Set<KoboAnswerId>()
      const index: Record<KoboAnswerId, Omit<ShelterRow, 'id'>> = {} as any
      _fetchNta.entity.forEach(d => {
        if (allowedOffices.length > 0 && !allowedOffices.includes(d.back_office)) {
          skippedNta.add(d.id)
        } else {
          if (!index[d.id]) index[d.id] = {}
          index[d.id].nta = d
          index[d.id].oblastIso = fnSwitch(d.ben_det_oblast!, OblastIndex.koboOblastIndexIso, () => '')
          index[d.id].oblast = fnSwitch(d.ben_det_oblast!, OblastIndex.koboOblastIndex, () => '')
          index[d.id].office = fnSwitch(d.back_office!, {
            cej: DrcOffice.Chernihiv,
            dnk: DrcOffice.Dnipro,
            hrk: DrcOffice.Kharkiv,
            umy: DrcOffice.Sumy,
            nlv: DrcOffice.Mykolaiv,
          }, () => undefined) ?? ''
        }
      })
      _fetchTa.entity.forEach(d => {
        const refId = d.nta_id ? d.nta_id.replaceAll(/[^\d]/g, '') : d.id
        if (skippedNta.has(refId)) return
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
      return {
        index,
        mappedData: seq(Enum.entries(index))
          // .filter(([k, v]) => !!v.nta)
          .map(([k, v]) => ({id: k, ...v}))
          .sort((a, b) => {
            if (!a.nta) return -1
            if (!b.nta) return 1
            return a.nta.submissionTime?.getTime() - b.nta?.submissionTime.getTime()
          }) as Seq<ShelterRow>
      }
    }, [_fetchTa.entity, _fetchNta.entity, allowedOffices]
  )

  const fetchAll = useCallback(() => {
    _fetchNta.fetch({force: true})
    _fetchTa.fetch({force: true})
  }, [])

  return {
    loading: _fetchNta.loading || _fetchTa.loading,
    fetchAll,
    _fetchNta,
    _fetchTa,
    mappedData,
    index,
  }
}