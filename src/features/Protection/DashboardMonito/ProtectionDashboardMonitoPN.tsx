import {DashboardPageProps} from './ProtectionDashboardMonito'
import {useI18n} from '@/core/i18n'
import {useTheme} from '@mui/material'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Protection_Hhs2} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2'

export const ProtectionDashboardMonitoPN = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <Div responsive>
        <SlidePanel title={m.firstPriorityNeed}>
          <ChartBarSingleBy
            data={data}
            by={_ => _.what_is_your_1_priority}
            filter={_ => _.what_is_your_1_priority !== 'unable_unwilling_to_answer'}
            label={{
              ...Protection_Hhs2.options.what_is_your_1_priority,
              health_1_2: m.health,
            }}
          />
        </SlidePanel>
        <SlidePanel title={m.secondPriorityNeed}>
          <ChartBarSingleBy
            data={data}
            by={_ => _.what_is_your_2_priority}
            filter={_ => _.what_is_your_2_priority !== 'unable_unwilling_to_answer'}
            label={{
              ...Protection_Hhs2.options.what_is_your_2_priority,
              health_1_2: m.health,
            }}
          />
        </SlidePanel>
        <SlidePanel title={m.thirdPriorityNeed}>
          <ChartBarSingleBy
            data={data}
            by={_ => _.what_is_your_3_priority}
            filter={_ => _.what_is_your_3_priority !== 'unable_unwilling_to_answer'}
            label={{
              ...Protection_Hhs2.options.what_is_your_3_priority,
              health_1_2: m.health,
            }}
          />
        </SlidePanel>
      </Div>
    </>
  )
}