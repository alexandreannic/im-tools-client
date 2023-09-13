import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {useMemo} from 'react'
import {BNREOptions} from '../../core/koboModel/BNRE/BNREOptions'
import {OblastISO} from '../../shared/UkraineMap/oblastIndex'
import {chain, mapObjectValue} from '../../utils/utils'
import {ageGroup, groupByAgeGroup} from '../../core/type'
import {MpcaRow} from '@/features/Mpca/MpcaDeduplicationContext'
import {DrcSupportSuggestion} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {transform} from 'lodash'

export const BNREOblastToISO: Record<keyof typeof BNREOptions['ben_det_prev_oblast'], OblastISO> = {
  cherkaska: 'UA71',
  chernihivska: 'UA74',
  chernivetska: 'UA73',
  dnipropetrovska: 'UA12',
  donetska: 'UA14',
  'ivano-frankivska': 'UA26',
  kharkivska: 'UA63',
  khersonska: 'UA65',
  khmelnytska: 'UA68',
  kirovohradska: 'UA35',
  kyivska: 'UA32',
  luhanska: 'UA44',
  lvivska: 'UA46',
  mykolaivska: 'UA48',
  odeska: 'UA51',
  poltavska: 'UA53',
  rivnenska: 'UA56',
  sevastopilska: 'UA85',
  sumska: 'UA59',
  ternopilska: 'UA61',
  vinnytska: 'UA05',
  volynska: 'UA07',
  zakarpatska: 'UA21',
  zaporizka: 'UA23',
  zhytomyrska: 'UA18',
}

export type UseBNREComputed = ReturnType<typeof useBNREComputed>
export const useBNREComputed = ({
  data,
}: {
  data?: _Arr<MpcaRow> | undefined
}) => useMemo(() => {
  if (!data) return
  const flatData = Arr([] as any[])//data.flatMap(_ => (_.hh_char_hh_det ?? [{}]).map(det => ({..._, ...det})))
  return {
    flatData,
    multipleTimeAssisted: (() => {
      const grouped = data.filter(_ => [
          DrcSupportSuggestion.ThreeMonthsNoDuplication,
          DrcSupportSuggestion.ThreeMonthsUnAgency,
          undefined
        ].includes(_.deduplication?.suggestion)
      ).groupBy(_ => _.taxId)
      return new Enum(grouped)
        .transform((k, v) => [k, v.length])
        .filter((k, v) => v > 1)
        .get()
    })(),
    ageGroup: chain(flatData.filter(_ => _?.hh_char_hh_det_age !== undefined).groupBy(_ => groupByAgeGroup()(_, p => +p?.hh_char_hh_det_age!)))
      .map(_ => Enum.entries(_).map(([group, v]) => ({
          key: group,
          Male: v.filter(_ => _.hh_char_hh_det_gender === 'male').length,
          Female: v.filter(_ => _.hh_char_hh_det_gender === 'female').length,
          Other: v.filter(_ => _.hh_char_hh_det_gender === undefined).length,
        })
      ))
      .map(_ => _.sort((a, b) => Object.keys(ageGroup.drc).indexOf(b.key) - Object.keys(ageGroup.drc).indexOf(a.key)))
      .get
    ,
  }
}, [data])
