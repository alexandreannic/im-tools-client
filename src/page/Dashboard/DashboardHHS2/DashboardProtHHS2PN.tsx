import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {useI18n} from '../../../core/i18n'
import {useTheme} from '@mui/material'
import {SlideContainer, SlidePanel} from '../../../shared/PdfLayout/Slide'

export const DashboardProtHHS2PN = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()

  return (
    <>
      <SlideContainer>
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
      </SlideContainer>
    </>
  )
}