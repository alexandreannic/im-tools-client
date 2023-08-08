import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import React, {useEffect} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {kobo} from '@/koboDrcUaFormId'
import {Enum} from '@alexandreannic/ts-utils'
import {Shelter_NTAOptions} from '@/core/koboModel/Shelter_NTA/Shelter_NTAOptions'
import {useI18n} from '@/core/i18n'
import {ShelterProgress} from '@/features/Shelter/Shelter'

export interface ShelterDataFilters extends KoboAnswerFilter {

}

export const ShelterData = () => {
  const {api} = useAppSettings()
  const {m, formatDate} = useI18n()
  // const _schema = useFetcher(() => {
  //   const [ta, nta] = await Promise.all([
  //     api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelterTA),
  //     api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA),
  //   ])
  // })

  const _data = useFetcher(async (filters?: ShelterDataFilters) => {
    const index: Record<string, {
      nta: KoboAnswer<Shelter_NTA>,
      ta?: KoboAnswer<Shelter_TA>,
    }> = {} as any
    await Promise.all([
      api.kobo.answer.searchShelterNTA(filters).then(_ => _.data.forEach(d => {
        if (!index[d.id]) index[d.id] = {nta: {} as any}
        index[d.id].nta = d
      })),
      api.kobo.answer.searchShelterTA(filters).then(_ => _.data.forEach(d => {
        if (!d.drc_reference_number) {
          console.log('no reference number for', d)
          return
        }
        if (!index[d.drc_reference_number.replace(/[^\\d]/, '')]) index[d.id] = {nta: {} as any}
        index[d.id].ta = d
      })),
    ])
    // console.log(index)
    return Enum.entries(index).filter(([k, v]) => !!v.nta).map(([k, v]) => ({id: k, ...v}))
  })

  useEffect(() => {
    _data.fetch()
  }, [])

  return (
    <Page width="lg">
      <Sheet
        data={_data.entity}
        loading={_data.loading}
        columns={[
          {
            id: 'Id',
            head: 'ID',
            render: _ => _.id,
          },
          {
            type: 'date',
            id: 'submissionTime',
            head: m.submissionTime,
            renderValue: _ => _.nta.submissionTime,
            render: _ => formatDate(_.nta.submissionTime),
          },
          {
            id: 'TA',
            type: 'select_one',
            options: () => [{value: 'true', label: 'true'}, {value: 'false', label: 'false'}],
            head: 'TA',
            render: _ => _.ta ? '✅' : '🛑',
            renderValue: _ => _.ta ? 'true' : 'false',
          },
          {
            id: 'progress',
            type: 'select_one',
            options: () => Enum.keys(ShelterProgress).map(_ => ({value: _, label: _})),
            render: _ => m.
          },
          {
            id: 'oblast',
            type: 'select_one',
            options: () => Enum.entries(Shelter_NTAOptions.ben_det_oblast).map(([value, label]) => ({value, label})),
            head: m.oblast,
            render: _ => _.nta.ben_det_oblast,
            renderValue: _ => _.nta.ben_det_oblast,
          },
          {
            id: 'raion',
            type: 'select_one',
            options: () => Enum.entries(Shelter_NTAOptions.ben_det_raion).map(([value, label]) => ({value, label})),
            head: m.raion,
            render: _ => _.nta.ben_det_raion,
            renderValue: _ => _.nta.ben_det_raion,
          }
        ]}
      />

    </Page>
  )
}