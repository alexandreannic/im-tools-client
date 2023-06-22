import React, {useEffect} from 'react'
import {Box} from '@mui/material'
import {useAppSettings} from '../../../core/context/ConfigContext'
import {useParams} from 'react-router'
import * as yup from 'yup'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Arr, fnSwitch, map} from '@alexandreannic/ts-utils'
import {ChartTools} from '../../../core/chartTools'
import {Panel} from '@/shared/Panel'

const urlParamsValidation = yup.object({
  serverId: yup.string().required(),
  formId: yup.string().required(),
})

export const KoboStatsPage = () => {
  const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  return (
    <KoboStats serverId={serverId} formId={formId}/>
  )
}

export const KoboStats = ({
  serverId,
  formId,
}: {
  serverId: string
  formId: string
}) => {
  const {api} = useAppSettings()
  const _form = useFetcher(() => api.koboApi.getForm(serverId!, formId!))
  const _answers = useFetcher(() => api.koboForm.getAnswers({
    formId,
  }))

  useEffect(() => {
    _form.fetch()
    _answers.fetch()
  }, [])

  return (
    <Box>
      {map(_form.entity, form => map(_answers.entity?.data, answers => (
        <>
          {form.content.survey.map(item => fnSwitch(item.type, {
            select_multiple: () => {
              return (
                <Panel title={item.name + ' ' + item.type} savableAsImg={true} expendable={true}>
                  <HorizontalBarChartGoogle data={ChartTools.multiple({
                    data: Arr(answers.map(_ => _[item.name]?.split(' ')))
                  })}/>
                </Panel>
              )
            },
            select_one: () => {
              return (
                <Panel title={item.name} savableAsImg={true} expendable={true}>
                  <HorizontalBarChartGoogle data={ChartTools.single({
                    data: Arr(answers.map(_ => _[item.name])).compact()
                  })}/>
                </Panel>
              )
            }
          }, _ => <></>))}
        </>
      )))}
    </Box>
  )
}