import {useAppSettings} from '@/core/context/ConfigContext'
import {OrderBy, useAsync, useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {Page, PageTitle} from '@/shared/Page'
import {SheetTableProps} from '@/shared/Sheet/Sheet'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import * as yup from 'yup'
import {KoboAnswer, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {map} from '@alexandreannic/ts-utils'
import {AAIconBtn} from '@/shared/IconBtn'
import {KoboApiColType, KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Panel} from '@/shared/Panel'
import {databaseModule} from '@/features/Database/databaseModule'
import {HashRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {Layout} from '@/shared/Layout'
import {Skeleton} from '@mui/material'
import {useParams} from 'react-router'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {DatabaseNew} from '@/features/Database/DatabaseNew/DatabaseNew'
import {useAaToast} from '@/core/useToast'
import {DatabaseProvider, useDatabaseContext} from '@/features/Database/DatabaseContext'
import {DatabaseAccess} from '@/features/Database/DatabaseAccess/DatabaseAccess'
import {useSession} from '@/core/context/SessionContext'
import {KoboDatabase} from '@/shared/Sheet/KoboDatabase'

const urlParamsValidation = yup.object({
  serverId: yup.string().required(),
  formId: yup.string().required(),
})

const sortFnByType: Record<any, (a: any, b: any) => number> = {
  string: (a: any, b: any) => a.localeCompare(b),
  number: (a: any, b: any) => a - b,
  object: (a: Date, b: Date) => a.getTime() - b.getTime(),
}

export const ignoredColType: KoboApiColType[] = [
  'begin_group',
  'end_group',
  'deviceid',
  'end_repeat',
  // 'begin_repeat',
  // 'note',
]

export const Database = () => {
  const {m} = useI18n()
  const {session} = useSession()
  const {api, conf} = useAppSettings()
  const _forms = useFetcher(api.kobo.form.getAll)
  const {toastHttpError} = useAaToast()

  useEffectFn(_forms.error, toastHttpError)

  useEffect(() => {
    _forms.fetch()
  }, [])

  // const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  return (
    <DatabaseProvider>
      <Router>
        <Layout
          sidebar={
            <Sidebar headerId="app-header">
              {session.admin && (
                <DatabaseNew onAdded={() => _forms.fetch({force: true, clean: false})}>
                  <AaBtn icon="add" sx={{mx: 1, mb: 1}} variant="contained">{m.database.registerNewForm}</AaBtn>
                </DatabaseNew>
              )}
              {_forms.loading ? (
                <>
                  <SidebarItem>
                    <Skeleton sx={{height: 30}}/>
                  </SidebarItem>
                  <SidebarItem>
                    <Skeleton sx={{height: 30}}/>
                  </SidebarItem>
                  <SidebarItem>
                    <Skeleton sx={{height: 30}}/>
                  </SidebarItem>
                </>
              ) : _forms.entity?.map(_ => (
                <NavLink key={_.id} to={databaseModule.siteMap.form(_.serverId, _.id)}>
                  {({isActive, isPending}) => (
                    <SidebarItem key={_.id} active={isActive}>{_.name}</SidebarItem>
                  )}
                </NavLink>
              ))}
            </Sidebar>
          }
          header={<AppHeader id="app-header"/>}
        >
          <Routes>
            <Route path={databaseModule.siteMap.form()} element={<DatabaseLayout/>}/>
          </Routes>
        </Layout>
      </Router>
    </DatabaseProvider>
  )
}

export const DatabaseLayout = () => {
  const _formSchemas = useDatabaseContext().formSchemas
  const {serverId, formId} = urlParamsValidation.validateSync(useParams())
  const {api} = useAppSettings()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _answers = useFetcher((id: KoboId) => api.kobo.answer.search({
    formId: id,
  }))
  const [sort, setSort] = useState<{sortBy?: keyof KoboAnswer, orderBy?: OrderBy}>()
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
    _formSchemas.fetch({}, serverId, formId)
    _answers.fetch({}, formId)
  }, [serverId, formId])

  return (
    <Page loading={_formSchemas.getLoading(formId)} width="full">
      <PageTitle action={
        <>
          <DatabaseAccess serverId={serverId} koboFormId={formId}>
            <AaBtn variant="outlined" icon="person_add">
              {m.grantAccess}
            </AaBtn>
          </DatabaseAccess>
          <AAIconBtn loading={_refresh.getLoading()} color="primary" icon="refresh" tooltip={m.refresh} onClick={async () => {
            await _refresh.call()
            await _answers.fetch({force: true, clean: false}, formId)
          }}/>
        </>
      }>{_formSchemas.get(formId)?.name}</PageTitle>
      <Panel>
        {data && map(_formSchemas.get(formId), schema => (
          <DatabaseTable
            form={schema}
            loading={_answers.loading}
            data={data}
            sort={{
              sortBy: sort?.sortBy,
              orderBy: sort?.orderBy,
              onSortChange: setSort,
            }}
          />
        ))}
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
  data: KoboAnswer[]
  sort?: SheetTableProps<KoboAnswer>['sort']
}) => {

  return (
    <KoboDatabase form={form} data={data}/>
  )
  // const {m, formatDate, formatDateTime} = useI18n()
  // const [langIndex, setLangIndex] = useState<number>(0)//, `lang-index-${Utils.slugify(form.name)}`)
  // const translations = useMemo(() => {
  //   const res: Record<string, Record<string, string>> = {}
  //   form.content.choices.forEach(choice => {
  //     if (!res[choice.list_name]) res[choice.list_name] = {}
  //     res[choice.list_name][choice.name] = langIndex >= 0 ? choice.label[langIndex] : choice.name
  //   })
  //   return res
  // }, [form, langIndex])
  //
  // const getValue = (row: KoboAnswer, q: KoboQuestionSchema) => {
  //   const value = row[q.name]
  //   if (!value) return ''
  //   return fnSwitch(q.type, {
  //     select_multiple: () => value?.split(' ').map(_ => translations[q.select_from_list_name!][_]).join(' | '),
  //     select_one: () => translations[q.select_from_list_name!][value],
  //   }, () => undefined)
  // }
  //
  // const columns = useMemo(() => {
  //     const questions = form.content.survey.filter(_ => !ignoredColType.includes(_.type)).map(q => {
  //       const col: SheetColumnProps<KoboAnswer<any>> = {
  //         id: q.name,
  //         head: map(langIndex, _ => map(q.label?.[_], removeHtml)) ?? q.name,
  //         tooltip: row => fnSwitch(q.type, {
  //           date: formatDateTime(row[q.name]),
  //           start: formatDateTime(row[q.name]),
  //           end: formatDateTime(row[q.name]),
  //           select_one: getValue(row, q),
  //           select_multiple: getValue(row, q),
  //         }, () => row[q.name]),
  //         type: q.type,
  //         // fnSwitch<any, SheetColumnProps<any>['type']>(q.type, {
  //         // date: {type: 'date'},
  //         // integer: {type: 'number'},
  //         // text: {type: 'string'},
  //         // start: {type: 'date'},
  //         // end: {type: 'date'},
  //         // calculate: {type: 'string'},
  //         // select_multiple: {type: 'multiple_option', options: form.content.choices.filter(_ => _.list_name === q.select_from_list_name).map(_ => _.name)},
  //         // select_one: {type: 'single_option', options: form.content.choices.filter(_ => _.list_name === q.select_from_list_name).map(_ => _.name)},
  //         // }, () => undefined),
  //         render: row => fnSwitch(q.type, {
  //           image: <KoboImg attachments={row.attachments} fileName={row[q.name]}/>,
  //           text: row[q.name],
  //           integer: row[q.name],
  //           calculate: row[q.name],
  //           date: row[q.name] ? formatDate(new Date(row[q.name])) : '',
  //           select_one: getValue(row, q),
  //           select_multiple: getValue(row, q),
  //           select_one_from_file: row[q.name],
  //           start: formatDate(row.start),
  //           end: formatDate(row.end),
  //         }, type => JSON.stringify(row[q.name])),
  //         renderExport: row => fnSwitch(q.type, {
  //           start: () => row.start,
  //           end: () => row.start,
  //           date: () => row.end,
  //           image: () => getKoboUrl(row.attachments, row[q.name]),
  //           select_one: () => getValue(row, q),
  //           select_multiple: () => getValue(row, q),
  //           calculate: () => map(row[q.name], _ => isNaN(_) ? _ : +_),
  //           integer: () => map(row[q.name], _ => +_),
  //         }, () => row[q.name]),
  //         // subHead: _ => fnSwitch(q.type, {
  //         //   start: _ => (
  //         //     <>
  //         //       <Logo icon="event" title={q.type}/>
  //         //       <Logo icon="chart"></Logo>
  //         //     </>
  //         //   ),
  //         //   end: () => <DatabaseSubHeader.Date title={q.type}/>,
  //         //   date: () => <DatabaseSubHeader.Date title={q.type}/>,
  //         //   select_multiple: () => (
  //         //     <>
  //         //       <Logo icon="check_box" title={q.type}/>
  //         //       <Logo icon="chart"></Logo>
  //         //     </>
  //         //   ),
  //         //   select_one: () => <DatabaseSubHeader.SingleChoices title={q.type}/>,
  //         //   text: () => <DatabaseSubHeader.Text title={q.type}/>,
  //         //   image: () => <DatabaseSubHeader.Image title={q.type}/>,
  //         //   calculate: () => <DatabaseSubHeader.Calculate title={q.type}/>,
  //         // }, () => <></>),
  //       }
  //       return col
  //     })
  //     const metaColumn: SheetColumnProps<KoboAnswer>[] = [
  //       {
  //         id: 'id',
  //         head: 'ID',
  //         render: (_: any) => _.id,
  //         renderExport: _ => _.id,
  //       },
  //       // {
  //       //   id: 'uuid',
  //       //   head: 'UUID',
  //       //   render: (_: any) => _.uuid,
  //       //   renderExport: _ => _.uuid,
  //       // },
  //       {
  //         id: 'submittedBy',
  //         head: m.submittedBy,
  //         render: _ => _.submittedBy,
  //         renderExport: _ => _.submittedBy,
  //       },
  //       {
  //         id: 'submissionTime',
  //         head: m.submissionTime,
  //         render: _ => formatDateTime(_.submissionTime),
  //         type: 'date',
  //         renderExport: _ => _.submissionTime,
  //       },
  //
  //     ]
  //     return [...metaColumn, ...questions ?? []]
  //   }, [form, translations]
  // )

  // return (
  //   <Sheet
  //     title={form.name}
  //     header={
  //       <AaSelect<number>
  //         sx={{maxWidth: 100}}
  //         defaultValue={langIndex}
  //         onChange={setLangIndex}
  //         options={['xml', ...form.content.translations].map((_, i) => ({children: _, value: '' + i - 1}))}
  //       />
  //     }
  //     sort={sort}
  //     loading={loading}
  //     data={data}
  //     columns={columns}
  //     getRenderRowKey={_ => _.id}
  //   />
  // )
}
