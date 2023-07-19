import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {SheetTableProps} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {KoboDatabase} from '@/shared/Sheet/KoboDatabase'
import {KoboDatabaseBtn} from '@/shared/Sheet/koboDatabaseShared'
import React from 'react'

export const DatabaseTable = ({
  loading,
  data,
  form,
  sort,
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void
  refreshing?: boolean
  loading?: boolean
  form: KoboApiForm
  data: KoboAnswer[]
  sort?: SheetTableProps<KoboAnswer>['sort']
}) => {
  const {m} = useI18n()

  return (
    <KoboDatabase form={form} data={data} header={
      <KoboDatabaseBtn loading={refreshing} color="primary" icon="refresh" tooltip={m.refresh} onClick={onRefresh}/>
    }/>
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