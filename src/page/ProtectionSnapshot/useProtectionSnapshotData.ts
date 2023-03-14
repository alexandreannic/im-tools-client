import {useMemo} from 'react'
import {ChartTools} from '../../core/ChartTools'
import {format} from 'date-fns'
import {_Arr, map} from '@alexandreannic/ts-utils'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {ProtectionHHAnswer} from './ProtectionSnapshot'
import {useI18n} from '../../core/i18n'

export const useProtectionSnapshotData = (data: _Arr<ProtectionHHAnswer>, {
  start,
  end,
}: {
  start: Date
  end: Date
}) => {
  const {m} = useI18n()

  return useMemo(() => {
    return {
      _12_8_1_What_would_be_the_deciding_fac: ChartTools.multiple({
        data: data.map(_ => _._12_8_1_What_would_be_the_deciding_fac).compact(),
        m: m.factorsToReturn,
      }),

      // _12_7_1_planToReturn: (() => {
      //   const curve = ChartTools.indexByDate({
      //     data: data,
      //     getDate: _ => format(_.start, 'yyyy-MM'),
      //     percentageOf: _ => _._12_7_1_Do_you_plan_to_return_to_your_ === 'yes21'
      //   })
      //   return map(Object.values(curve), _ => (_[1]?.count ?? 0 - _[0]?.count ?? 0) * 100)!
      // })(),

      _12_3_1_dateDeparture: ChartTools.indexByDate({
        data: data
          .map(_ => _._12_3_1_When_did_you_your_area_of_origin)
          .compact()
          .filter(_ => _ > '2021-12' && _ < format(end, 'yyyy-dd'))
          .sort(),
        getDate: _ => _.replace(/-\d{2}$/, ''),
      }),

      oblastOrigins: data.map(_ => _['_12_1_What_oblast_are_you_from_001'])
        .map(_ => OblastIndex.findByKoboKey(_!)?.iso)
        .reduceObject<Record<string, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1]),

      oblastCurrent:
        data.map(_ => _['_4_What_oblast_are_you_from'])
          .map(_ => OblastIndex.findByKoboKey(_!)?.iso)
          .reduceObject<Record<string, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1]),
    }
  }, [data])
}
