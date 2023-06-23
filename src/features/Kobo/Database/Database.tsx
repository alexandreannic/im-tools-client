import {useAppSettings} from '@/core/context/ConfigContext'
import {OrderBy, useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {Page, PageTitle} from '@/shared/Page'
import {Sheet, SheetColumnProps, SheetTableProps} from '@/shared/Sheet/Sheet'
import {Sidebar, SidebarBody, SidebarHeader, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import * as yup from 'yup'
import {KoboAnswer2, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {AAIconBtn} from '@/shared/IconBtn'
import {KoboApiColType, KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Panel, PanelHead} from '@/shared/Panel'
import {Txt} from 'mui-extension'
import {koboModule} from '@/features/Kobo/koboModule'
import {BrowserRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {Header} from '@/shared/Layout/Header/Header'
import {Layout} from '@/shared/Layout'
import {Skeleton} from '@mui/material'
import {useParams} from 'react-router'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {DatabaseNew} from '@/features/Kobo/DatabaseNew/DatabaseNew'

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

export const Database = () => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const _forms = useFetcher(api.kobo.form.getAll)

  useEffect(() => {
    _forms.fetch()
  }, [])

  // const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  return (
    <Router basename={koboModule.basePath}>
      <Layout
        sidebar={
          <Sidebar headerId="app-header">
            <SidebarBody>
              <DatabaseNew onAdded={() => _forms.fetch({force: true, clean: false})}>
                <AaBtn icon="add" sx={{mx: 1, mb: 1}} variant="contained">{m.database.registerNewForm}</AaBtn>
              </DatabaseNew>
              {_forms.loading ? (
                <>
                  <Skeleton/>
                  <Skeleton/>
                  <Skeleton/>
                </>
              ) : _forms.entity?.map(_ => (
                <SidebarItem key={_.id} to={koboModule.siteMap.form(_.serverId, _.id)} component={NavLink}>{_.name}</SidebarItem>
              ))}
            </SidebarBody>
          </Sidebar>
        }
        header={<Header id="app-header"/>}
      >
        <Routes>
          <Route path={koboModule.siteMap.form()} element={<DatabaseLayout/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}

export const DatabaseLayout = () => {
  const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  const {api} = useAppSettings()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _form = useFetcher(api.koboApi.getForm)
  const _answers = useFetcher((id: KoboId) => api.kobo.answer.search({
    formId: id,
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
    _form.fetch({}, serverId, formId)
    _answers.fetch({}, formId)
  }, [serverId, formId])

  return (
    <Page loading={_form.loading} width="full">
      <PageTitle action={
        <>
          <AAIconBtn loading={_refresh.getLoading()} color="primary" icon="refresh" tooltip={m.refresh} onClick={async () => {
            await _refresh.call()
            await _answers.fetch({force: true, clean: false}, formId)
          }}/>
        </>
      }>{_form.entity?.name}</PageTitle>
      <Panel>
        {_form.entity && data && (
          <DatabaseTable
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

export const DatabaseTable = ({
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
    const metaColumn: SheetColumnProps<KoboAnswer2>[] = [
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
