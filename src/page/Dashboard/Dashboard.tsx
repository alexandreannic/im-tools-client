import {Page} from '../../shared/Page'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {useEffect} from 'react'
import {ProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {mapProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1Mapping'
import {SlideCard} from '../../shared/PdfLayout/Slide'
import {useI18n} from '../../core/i18n'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {useProtHH_2_1Data} from './useProtHH_2_1Data'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {Panel, PanelBody} from '../../shared/Panel'
import {Box} from '@mui/material'

const enrichProtHHS_2_1 = (a: ProtHHS_2_1) => {
  return {
    ...a,
    where_are_you_current_living_oblast_iso: OblastIndex.findByShortISO(a.where_are_you_current_living_oblast!)?.iso,
    what_is_your_area_of_origin_oblast_iso: OblastIndex.findByShortISO(a.what_is_your_area_of_origin_oblast!)?.iso,
  }
}

export type ProtHHS_2_1Enrich = ReturnType<typeof enrichProtHHS_2_1>

export const Dashboard = () => {
  const {api} = useConfig()
  const _answers = useFetcher(() => api.koboForm.getAnswers<ProtHHS_2_1>({
    formId: 'aQDZ2xhPUnNd43XzuQucVR',
    fnMap: mapProtHHS_2_1
  })
    .then(_ => _.data)
    .then(_ => _.map(enrichProtHHS_2_1)
    ))

  useEffect(() => {
    _answers.fetch()
  }, [])

  return (
    <Page>
      {_answers.entity && (
        <_Dashboard
          data={Arr(_answers.entity)}
        />
      )}
    </Page>
  )
}

export const _Dashboard = ({
  data,
}: {
  // computed: ReturnType<typeof useProtHH_2_1Data>
  data: _Arr<ProtHHS_2_1Enrich>
}) => {
  const {formatLargeNumber} = useI18n()
  const computed = useProtHH_2_1Data({data})
  const savableAsImg = true

  console.log(data.map(_ => _.where_are_you_current_living_oblast))
  return (
    <Box sx={{maxWidth: 1200}}>
      <SlideCard icon="home">
        {formatLargeNumber(data.length)}
      </SlideCard>
      <Panel savableAsImg={savableAsImg}>
        <PanelBody>
          <HorizontalBarChartGoogle data={computed.do_you_identify_as_any_of_the_following}/>
        </PanelBody>
      </Panel>
      <Panel savableAsImg={savableAsImg}>
        <PanelBody>
          <UkraineMap data={computed.where_are_you_current_living_oblast}/>
        </PanelBody>
      </Panel>
    </Box>
  )
}