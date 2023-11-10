import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Utils} from '@/utils/utils'
import {fnSwitch, map, seq} from '@alexandreannic/ts-utils'
import {ShelterProgress, ShelterTaPriceLevel} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {AaInput} from '@/shared/ItInput/AaInput'
import {format, subMonths} from 'date-fns'
import {Period, PeriodHelper} from '@/core/type'
import {AiTypeSnfiRmm} from '@/features/ActivityInfo/Shelter/AiTypeSnfiRmm'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'

export const AiShelter = () => {
  const {api} = useAppSettings()
  const req = (period: Period) => api.shelter.search(period).then(_ => seq(_.data)).then(res => {
    const formatted: AiTypeSnfiRmm.Type[] = []
    Utils.groupBy({
      data: res,
      groups: [
        {by: _ => _.ta?.tags?.project ?? ''},
        {by: _ => _.nta?.ben_det_oblast ?? ''},
        {by: _ => _.nta?.ben_det_raion ?? ''},
        {by: _ => _.nta?.ben_det_hromada ?? ''},
        // {by: _ => _.}
        {
          by: row => {
            if (row.ta?._priceLevel)
              return fnSwitch(row.ta?._priceLevel, {
                [ShelterTaPriceLevel.Heavy]: ShelterTaPriceLevel.Medium,
              }, _ => _)
            return map(row.nta?.total_apt_damage ?? row.nta?.total_damage, _ => {
              if (+_ < 6) return ShelterTaPriceLevel.Light
              return ShelterTaPriceLevel.Medium
            }) ?? '!!!!!'
          },
        },
        {
          by: row => {
            const x: AiTypeSnfiRmm.Opt<'Implementation status'> = (row.ta?.tags?.progress! === ShelterProgress.RepairWorksCompleted)
              ? 'Complete'
              : 'Ongoing'
            return x
          }
        },
        {
          by: row => fnSwitch(row.nta?.ben_det_res_stat!, {
            idp: 'IDPs',
            ret: 'Returnees',
          }, () => 'Non-Displaced') as AiTypeSnfiRmm.Opt<'Population Group'>
        }
      ],
      finalTransform: (grouped, [project, oblast, raion, hromada, damageLeve, complete, status]) => {
        formatted.push({
          'SNFI indictors': '',
          'Implementing Partner': 'Danish Refugee Council',
          'Plan Code': project,
          'Reporting Partner': 'Danish Refugee Council',
          'Report to a planned project': 'Yes',
          'Oblast': oblast,
          'Raion': raion,
          'Hromada': hromada,
          'Settlement': '_NTA TODO',
          'Collective Site': '_NTA TODO',
          'Implementation status': complete,
          'Reporting Date (YYYY-MM-DD)': format(period.end, 'yyyy-MM-dd'),
          'Population Group': status,
          'Indicator Value (HHs reached, buildings, etc.)': 0,
          '# Individuals Reached': 0,
          'Girls (0-17)': 0,
          'Boys (0-17)': 0,
          'Women (18-59)': 0,
          'Men (18-59)': 0,
          'Elderly Women (60+)': 0,
          'Elderly Men (60+)': 0,
          'People with disability': 0,
        })
      },
    })
    return formatted
  })
  const fetcher = useFetcher(req)
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {m} = useI18n()

  useEffect(() => {
    fetcher.fetch({}, PeriodHelper.fromyyyMM(period))
  }, [period])

  // console.log(fetcher.entity?.map(_ => _.nta).compact().map(_ => {
  //   const a = Utils.add(
  //     _.total_apt_damage_light,
  //     _.total_apt_damage_medium,
  //     _.total_damage_heavy,
  //     _.total_damage_light,
  //     _.total_damage_medium
  //   )
  //   if (a === 0) return _.id
  // }))

  return (
    <Page width="full">
      <Panel>
        <AaInput type="month" sx={{width: 200, mr: 1}} value={period} onChange={_ => setPeriod(_.target.value)}/>
        <Sheet id="ai-shelter" data={fetcher.entity} loading={fetcher.loading} columns={[
          {type: 'select_one', id: 'Plan Code', head: 'Plan Code', render: row => row['Plan Code']},
          {type: 'select_one', id: 'SNFI indictors', head: 'SNFI indictors', render: row => row['SNFI indictors']},
          {type: 'select_one', id: 'Oblast', head: 'Oblast', render: row => row['Oblast']},
          {type: 'select_one', id: 'Raion', head: 'Raion', render: row => row['Raion']},
          {type: 'select_one', id: 'Hromada', head: 'Hromada', render: row => row['Hromada']},
          {type: 'select_one', id: 'Implementation status', head: 'Implementation status', render: row => row['Implementation status']},
          {type: 'select_one', id: 'Population Group', head: 'Population Group', render: row => row['Population Group']},
          {type: 'number', id: 'Indicator Value (HHs reached, buildings, etc.)', head: 'Indicator Value (HHs reached, buildings, etc.)', render: row => row['Indicator Value (HHs reached, buildings, etc.)']},
          {type: 'number', id: '# Individuals Reached', head: '# Individuals Reached', render: row => row['# Individuals Reached']},
          {type: 'number', id: 'Girls (0-17)', head: 'Girls (0-17)', render: row => row['Girls (0-17)']},
          {type: 'number', id: 'Boys (0-17)', head: 'Boys (0-17)', render: row => row['Boys (0-17)']},
          {type: 'number', id: 'Women (18-59)', head: 'Women (18-59)', render: row => row['Women (18-59)']},
          {type: 'number', id: 'Men (18-59)', head: 'Men (18-59)', render: row => row['Men (18-59)']},
          {type: 'number', id: 'Elderly Women (60+)', head: 'Elderly Women (60+)', render: row => row['Elderly Women (60+)']},
          {type: 'number', id: 'Elderly Men (60+)', head: 'Elderly Men (60+)', render: row => row['Elderly Men (60+)']},
          {type: 'number', id: 'People with disability', head: 'People with disability', render: row => row['People with disability']},
        ]}/>
      </Panel>
    </Page>
  )
}