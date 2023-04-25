import {Page} from '../../shared/Page'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {useEffect, useMemo} from 'react'
import {ProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {KoboAnswerMetaData} from '../../core/sdk/server/kobo/Kobo'
import {_Arr, Arr} from '@alexandreannic/ts-utils'
import {mapProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1Mapping'
import {SlideCard} from '../../shared/PdfLayout/Slide'
import {useI18n} from '../../core/i18n'
import {ChartTools} from '../../core/chartTools'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'

export const Dashboard = () => {
  const {api} = useConfig()
  const _answers = useFetcher(() => api.koboForm.getAnswers<ProtHHS_2_1>({
    formId: 'aQDZ2xhPUnNd43XzuQucVR',
    fnMap: mapProtHHS_2_1
  }))

  useEffect(() => {
    _answers.fetch()
  }, [])

  return (
    <Page>
      {_answers.entity && (
        <_Dashboard data={Arr(_answers.entity.data)}/>
      )}
    </Page>
  )
}

export const _Dashboard = ({
  data,
}: {
  data: _Arr<ProtHHS_2_1 & KoboAnswerMetaData>
}) => {
  const {formatLargeNumber} = useI18n()

  const x = useMemo(() => {
    return ChartTools.single({
      data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
    })
  }, [data])
  console.log(data.map(_ => _))
  return (
    <>
      <SlideCard icon="home">
        {formatLargeNumber(data.length)}
      </SlideCard>
      <HorizontalBarChartGoogle data={x}/>
    </>
  )
}