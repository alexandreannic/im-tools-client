import {useAppSettings} from '@/core/context/ConfigContext'
import {useState} from 'react'
import {format, subMonths} from 'date-fns'
import {useI18n} from '@/core/i18n'
import {useAaToast} from '@/core/useToast'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Period, PeriodHelper} from '@/core/type'
import {AiBundle} from '@/features/ActivityInfo/shared/AiType'
import {Utils} from '@/utils/utils'
import {seq} from '@alexandreannic/ts-utils'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'

type AiGbvBundle = AiBundle

export const AiGbv = () => {
  const {api, conf} = useAppSettings()
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {formatLargeNumber, m} = useI18n()
  const {toastHttpError} = useAaToast()

  const fetcher = useFetcher((periodStr: string) => {
    const period = PeriodHelper.fromYYYYMM(periodStr)
    return api.kobo.typedAnswers.searchProtection_gbv({filters: period}).then(_ => {
      const mapped: AiGbvBundle[] = []
      const flatData = seq(_.data).flatMap(_ => {
        return _.hh_char_hh_det?.map(hh => ({
          ...getAiLocation(_),
          ..._,
          ...hh,
        }))
      }).compact()
      Utils.groupBy({
        data: flatData,
        groups: [
          {by: _ => _.Oblast ?? ''},
          {by: _ => _.Raion ?? ''},
          {by: _ => _.Hromada ?? ''},
          {by: _ => _.project ?? ''},
          // {by: _ => _.project ?? ''},
        ],
        finalTransform: () => {

        }
      })
    })
  })
}