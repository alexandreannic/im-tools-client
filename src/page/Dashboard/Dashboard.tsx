import {Page} from '../../shared/Page'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import {useEffect} from 'react'
import {ProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1'

export const Dashboard = () => {
  const {api} = useConfig()
  const _answers = useFetcher(() => api.koboForm.getAnswers<ProtHHS_2_1>('4820279f-6c3d-47ba-8afe-47f86b16ab5d', 'aQDZ2xhPUnNd43XzuQucVR'))

  useEffect(() => {
    _answers.fetch()
  }, [])

  return (
    <Page>
      {/*<PieChartIndicator value={}/>*/}
    </Page>
  )
}

export const _Dashboard = () => {

}