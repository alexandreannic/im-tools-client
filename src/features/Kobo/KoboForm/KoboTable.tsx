import {useConfig} from '../../../core/context/ConfigContext'
import {OrderBy, useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useParams} from 'react-router'
import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '../../../shared/Page'
import {Sheet, SheetColumnProps, SheetTableProps} from '../../../shared/Sheet/Sheet'
import {useI18n} from '../../../core/i18n'
import * as yup from 'yup'
import {KoboAnswer2} from '../../../core/sdk/server/kobo/Kobo'
import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {Box} from '@mui/material'
import {AAIconBtn} from '../../../shared/IconBtn'
import {KoboApiColType, KoboApiForm} from '../../../core/sdk/server/kobo/KoboApi'
import {Panel, PanelHead} from '../../../shared/Panel'
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

const ignoredColType: KoboApiColType[] = [
  'begin_group',
  'end_group',
  'end_repeat',
  'begin_repeat',
  'note',
]

export const KoboTableLayoutRoute = () => {
  const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  return <KoboTableLayout serverId={serverId} formId={formId}/>
}

export const KoboTableLayout = ({
  serverId,
  formId
}: {
  serverId: string
  formId: string
}) => {
  const {api} = useConfig()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _form = useFetcher(() => api.koboApi.getForm(serverId!, formId!))
  const _answers = useFetcher(() => api.koboForm.getAnswers({
    formId,
  }))
  const [sort, setSort] = useState<{sortBy?: keyof KoboAnswer2, orderBy?: OrderBy}>()
  const data = useMemo(() => {
    return map(sort?.sortBy, sortBy => {
      const sortFn = sortFnByType[typeof _answers.entity?.data[0][sortBy]]
      return _answers.entity?.data.sort((a, b) => {
        return sortFn ? sortFn(a[sortBy], b[sortBy]) : 0
      })
    }) ?? _answers.entity?.data
  }, [_answers.entity, sort])

  const _refresh = useAsync(() => api.koboApi.synchronizeAnswers(serverId, formId))

  useEffect(() => {
    _form.fetch()
    _answers.fetch()
  }, [])

  return (
    <Page loading={_form.loading} width="full">
      {/*<KoboStats serverId={serverId} formId={formId}/>*/}
      <Panel>
        <PanelHead action={
          <AAIconBtn loading={_refresh.getLoading()} color="primary" icon="refresh" tooltip={m.refresh} onClick={async () => {
            await _refresh.call()
            await _answers.fetch({force: true, clean: false})
          }}/>
        }>
          <Txt skeleton={_form.loading && 190}>{_form.entity?.name}</Txt>
        </PanelHead>
        {_form.entity && data && (
          <KoboTable
            form={_form.entity}
            loading={_answers.loading}
            data={data}
            sort={{
              sortBy: sort?.sortBy,
              orderBy: sort?.orderBy,
              onSortChange: setSort,
            }}
          />
        )}
      </Panel>
    </Page>
  )
}

export const KoboTable = ({
  loading,
  data,
  form,
  sort,
}: {
  loading?: boolean
  form: KoboApiForm
  data: KoboAnswer2[]
  sort?: SheetTableProps<KoboAnswer2>['sort']
}) => {
  const {m, formatDate} = useI18n()

  const columns = useMemo(() => {
    const questions = form.content.survey.filter(_ => !ignoredColType.includes(_.type)).map(q => {
      const col: SheetColumnProps<KoboAnswer2<any>> = {
        id: q.name,
        head: q.name,
        type: fnSwitch<any, SheetColumnProps<any>['type']>(q.type, {
          date: 'date',
          integer: 'number',
          text: 'string',
          start: 'date',
          end: 'date',
          select_multiple: form.content.choices.filter(_ => _.list_name === q.select_from_list_name).map(_ => _.name),
          select_one: form.content.choices.filter(_ => _.list_name === q.select_from_list_name).map(_ => _.name),
        }, () => undefined),
        render: x => fnSwitch(q.type, {
          text: x[q.name],
          integer: x[q.name],
          select_one: x[q.name],
          date: x[q.name] ? formatDate(new Date(x[q.name])) : '',
          select_multiple: x[q.name],//?.join(', '),
          start: formatDate(x.start),
          end: formatDate(x.end),
        }, type => JSON.stringify(x[q.name]))
      }
      return col
    })
    const metaColumn: SheetColumnProps<KoboAnswer2>[]  = [
      {
        id: 'id',
        head: 'ID',
        render: (_: any) => _.id,
      },
      {
        id: 'submissionTime',
        head: m.submissionTime,
        render: _ => formatDate(_.submissionTime),
      },
      {
        id: 'submittedBy',
        head: m.submittedBy,
        render: _ => _.submittedBy,
      },
    ]
    return [...metaColumn, ...questions ?? []]
  }, [form])

  return (
    <Sheet
      sort={sort}
      loading={loading}
      data={data}
      columns={columns}
      getRenderRowKey={_ => _.id}
    />
  )
}
