import {useConfig} from '../../../core/context/ConfigContext'
import {OrderBy, useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useParams} from 'react-router'
import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '../../../shared/Page'
import {DatatableColumnProps, Sheet} from '../../../shared/Sheet/Sheet'
import {useI18n} from '../../../core/i18n'
import * as yup from 'yup'
import {KoboAnswer2} from '../../../core/sdk/server/kobo/Kobo'
import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {Box} from '@mui/material'
import {AAIconBtn} from '../../../shared/IconBtn'
import {Txt} from 'mui-extension'

const urlParamsValidation = yup.object({
  serverId: yup.string().required(),
  formId: yup.string().required(),
})

const sortFnByType: Record<any, (a: any, b: any) => number> = {
  string: (a: any, b: any) => a.localeCompare(b),
  number: (a: any, b: any) => a - b,
  object: (a: Date, b: Date) => a.getTime() - b.getTime(),
}

export const KoboForm = () => {
  const {api} = useConfig()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  const _form = useFetcher(() => api.koboApi.getForm(serverId!, formId!))
  const _answers = useFetcher(() => api.koboForm.getAnswers({
    formId,
  }))
  const [sort, setSort] = useState<{sortBy?: keyof KoboAnswer2, orderBy?: OrderBy}>()
  const data = useMemo(() => {
    return map(sort?.sortBy, sortBy => {
      const sortFn = sortFnByType[typeof _answers.entity?.data[0][sortBy]]
      console.log(sortFn, typeof _answers.entity?.data[0][sortBy], _answers.entity?.data[0][sortBy])
      return _answers.entity?.data.sort((a, b) => {
        return sortFn ? sortFn(a[sortBy], b[sortBy]) : 0
      })
    }) ?? _answers.entity?.data
  }, [_answers.entity, sort])

  const _refresh = useAsync(() => api.koboApi.synchronizeAnswers(serverId, formId))

  const columns = useMemo(() => {
    return _form.entity?.content.survey.map(_ => {
      const col: DatatableColumnProps<KoboAnswer2<any>> = {
        id: _.name,
        head: _.name,
        render: x => fnSwitch(_.type, {
          text: x[_.name],
          integer: x[_.name],
          select_one: x[_.name],
          date: x[_.name] ? formatDate(new Date(x[_.name])) : '',
          select_multiple: x[_.name],
          start: formatDate(x.start),
          end: formatDate(x.end),
        }, type => JSON.stringify(x[_.name]))
      }
      return col
    })
  }, [_form])

  useEffect(() => {
    _form.fetch()
    _answers.fetch()
  }, [])

  return (
    <Page loading={_form.loading} sx={{maxWidth: 2000}}>
      <Box sx={{display: 'flex'}}>
        <AAIconBtn loading={_refresh.getLoading()} color="primary" icon="refresh" tooltip={m.refresh} onClick={_refresh.call}/>
        <Txt bold sx={{marginLeft: 'auto'}} skeleton={_answers.loading}>{formatLargeNumber(data?.length)}</Txt>
      </Box>
      {columns && (
        <Sheet
          sort={{
            sortBy: sort?.sortBy,
            orderBy: sort?.orderBy,
            sortableColumns: columns.map(_ => _.id),
            onSortChange: setSort,
          }}
          loading={_answers.loading}
          data={data}
          columns={columns}
          getRenderRowKey={_ => _.id}
        />
      )}
    </Page>
  )
}
