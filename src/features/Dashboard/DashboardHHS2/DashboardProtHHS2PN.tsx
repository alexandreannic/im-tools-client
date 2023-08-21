import {DashboardPageProps} from './DashboardProtHHS2'
import {useI18n} from '../../../core/i18n'
import {useTheme} from '@mui/material'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'

export const DashboardProtHHS2PN = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <Div responsive>
        <SlidePanel title={m.firstPriorityNeed}>
          <ProtHHS2BarChart
            data={data}
            question="what_is_your_1_priority"
            filterValue={['unable_unwilling_to_answer']}
            overrideLabel={{
              health_1_2: m.health,
            }}
          />
        </SlidePanel>
        <SlidePanel title={m.secondPriorityNeed}>
          <ProtHHS2BarChart
            data={data}
            question="what_is_your_2_priority"
            filterValue={['unable_unwilling_to_answer']}
            overrideLabel={{
              health_1_2: m.health,
            }}
          />
        </SlidePanel>
        <SlidePanel title={m.thirdPriorityNeed}>
          <ProtHHS2BarChart
            data={data}
            question="what_is_your_3_priority"
            filterValue={['unable_unwilling_to_answer']}
            overrideLabel={{
              health_1_2: m.health,
            }}
          />
        </SlidePanel>
      </Div>
    </>
  )
}