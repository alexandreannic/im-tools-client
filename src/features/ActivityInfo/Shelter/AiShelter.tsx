import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Utils} from '@/utils/utils'
import {fnSwitch, seq} from '@alexandreannic/ts-utils'
import {ShelterTaPriceLevel} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {AiTypeSnfiRmm} from '@/features/ActivityInfo/Shelter/AiTypeSnfiRmm'
import {AaInput} from '@/shared/ItInput/AaInput'
import {format, subMonths} from 'date-fns'
import {Period, PeriodHelper} from '@/core/type'

export const AiShelter = () => {
  const {api} = useAppSettings()
  const req = (period: Period) => api.shelter.search(period).then(_ => seq(_.data))
  const fetcher = useFetcher(req)
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))

  useEffect(() => {
    fetcher.fetch({}, PeriodHelper.fromyyyMM(period))

    // const r = Utils.groupBy({
    //   data: res,
    //   groups: [
    //     {by: _ => _.ta?.tags?.project ?? ''},
    //     {by: _ => _.nta?.ben_det_oblast ?? ''},
    //     {by: _ => _.nta?.ben_det_raion ?? ''},
    //     {by: _ => _.nta?.ben_det_hromada ?? ''},
    //     {by: _ => _.}
    //     {
    //       by: _ => {
    //         if (_.ta?._priceLevel)
    //           return fnSwitch(_.ta?._priceLevel, {
    //             [ShelterTaPriceLevel.Heavy]: ShelterTaPriceLevel.Medium,
    //           }, _ => _)
    //         else
    //       },
    //     },
    //
    //   ],
    //   finalTransform: (grouped, [project, oblast, raion, PlanCode]) => {
    //     const a: AiTypeSnfiRmm.Type = {
    //       'SNFI indictors'
    //     }
    //   },
    // })
    // })
  }, [period])

  console.log(fetcher.entity?.map(_ => _.nta).compact().map(_ => {
    const a = Utils.add(
      _.total_apt_damage_light,
      _.total_apt_damage_medium,
      _.total_damage_heavy,
      _.total_damage_light,
      _.total_damage_medium
    )
    if(a === 0) return {a, _}
  }))

  return (
    <Page width="full">
      <Panel>
        <AaInput type="month" sx={{width: 200, mr: 1}} value={period} onChange={_ => setPeriod(_.target.value)}/>
      </Panel>
    </Page>
  )
}