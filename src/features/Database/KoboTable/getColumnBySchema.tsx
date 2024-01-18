import {useKoboSchema} from '@/features/KoboSchema/useKoboSchema'
import {I18nContextProps} from '@/core/i18n/I18n'
import {KoboApiColType, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {SheetHeadTypeIcon} from '@/shared/Sheet/SheetHead'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {map, mapFor, seq} from '@alexandreannic/ts-utils'
import {formatDate, formatDateTime} from '@/core/i18n/localization/en'
import {IpBtn} from '@/shared/Btn'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import React from 'react'
import {Utils} from '@/utils/utils'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/KoboSchema/KoboSchemaContext'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'

const ignoredColType: KoboApiColType[] = [
  'begin_group',
  'end_group',
  'deviceid',
  'end_repeat',
  // 'begin_repeat',
  // 'note',
]

interface GetColumnBySchemaProps<T extends Record<string, any> = any> {
  data?: T[]
  choicesIndex: ReturnType<typeof useKoboSchema>['choicesIndex']
  m: I18nContextProps['m']
  translateChoice: KoboTranslateChoice
  translateQuestion: KoboTranslateQuestion
  groupSchemas: Record<string, KoboQuestionSchema[]>
  onOpenGroupModal?: (_: {columnId: string, group: KoboAnswer[], event: any}) => void,
  groupIndex?: number
  groupName?: string
  repeatGroupsAsColumn?: boolean
}

export const getColumnByQuestionSchema = <T extends Record<string, any | undefined>>({
  data,
  m,
  q,
  groupSchemas,
  translateQuestion,
  translateChoice,
  onOpenGroupModal,
  choicesIndex,
  groupIndex,
  getRow = _ => _ as unknown as KoboMappedAnswer,
  groupName,
  repeatGroupsAsColumn,
}: GetColumnBySchemaProps<T> & {
  q: KoboQuestionSchema,
  getRow?: (_: T) => KoboMappedAnswer
}): SheetColumnProps<T>[] => {
  const {
    getId,
    getHead,
    getVal,
  } = (() => {
    if (groupIndex && groupName)
      return {
        getId: (q: KoboQuestionSchema) => `${groupIndex}_${q.name}`,
        getHead: (name: string) => `[${groupIndex}] ${name}`,
        getVal: (row: T, name: string) => (getRow(row) as any)[groupName]?.[groupIndex]?.[name]
      }
    return {
      getId: (q: KoboQuestionSchema) => q.name,
      getHead: (name: string) => name,
      getVal: (row: T, name: string) => getRow(row)[name],
    }
  })()

  const common = {
    id: getId(q),
    head: Utils.removeHtml(getHead(translateQuestion(q.name))),
    renderValue: (row: T) => getVal(row, q.name),
  }
  const res: SheetColumnProps<T>[] | SheetColumnProps<T> = (() => {
    switch (q.type) {
      case 'image': {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          render: row =>
            <KoboAttachedImg attachments={row.attachments} fileName={getVal(row, q.name) as string}/>
        }
      }
      case 'calculate': {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="functions" tooltip="calculate"/>,
          head: Utils.removeHtml(getHead(translateQuestion(q.name))),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>,
          options: () => seq(data).map(_ => getRow(_)[q.name] ?? SheetUtils.blank).distinct(_ => _).map(_ => ({label: _, value: _})),
        }
      }
      case 'select_one_from_file': {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="attach_file" tooltip="select_one_from_file"/>,
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'username':
      case 'text': {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>,
        }
      }
      case 'decimal':
      case 'integer': {
        return {
          ...common,
          type: 'number',
          typeIcon: <SheetHeadTypeIcon children="tag" tooltip={q.type}/>,
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as number}</span>
        }
      }
      case 'note': {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="info" tooltip="note"/>,
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'date':
      case 'datetime':
      case 'today':
      case 'start':
      case 'end': {
        return {
          ...common,
          type: 'date',
          typeIcon: <SheetHeadTypeIcon children="event" tooltip={q.type}/>,
          render: row => map(getVal(row, q.name) as Date | undefined, _ => (
            <span title={formatDateTime(_)}>{formatDate(_)}</span>
          ))
        }
      }
      case 'begin_repeat': {
        if (repeatGroupsAsColumn) {
          return mapFor(17, i => getColumnBySchema({
            data: data?.map(_ => getRow(_)[q.name]) as any,
            groupSchemas,
            schema: groupSchemas[q.name],
            translateQuestion,
            translateChoice,
            choicesIndex,
            m,
            onOpenGroupModal,
            groupIndex: i,
            groupName: q.name,
          })).flat()
        }
        return {
          ...common,
          type: 'number',
          typeIcon: <SheetHeadTypeIcon children="repeat" tooltip="begin_repeat"/>,
          render: row => map(row[q.name] as KoboAnswer[] | undefined, group =>
            <IpBtn sx={{py: '4px'}} onClick={(event) => onOpenGroupModal?.({
              columnId: q.name,
              group,
              event,
            })}>{group.length}</IpBtn>
          ) ?? <></>
        }
      }
      case 'select_one': {
        return {
          ...common,
          type: 'select_one',
          typeIcon: <SheetHeadTypeIcon children="radio_button_checked" tooltip={q.type}/>,
          // options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          renderValue: row => getVal(row, q.name) ?? SheetUtils.blank,
          render: row => map(getVal(row, q.name) as string | undefined, v => {
            const render = translateChoice(q.name, v)
            if (render)
              return <span title={render}>{render}</span>
            return (
              <span title={v}>
                <TableIcon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} children="error"/>
                {v}
              </span>
            )
          })
        }
      }
      case 'select_multiple': {
        return {
          ...common,
          type: 'select_multiple',
          typeIcon: <SheetHeadTypeIcon children="check_box" tooltip={q.type}/>,
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          renderValue: row => getVal(row, q.name) ?? SheetUtils.blank,
          // renderOption: row => translateChoice(q.name, getVal(row, q.name)) ?? SheetUtils.blank,
          render: row => map(getVal(row, q.name) as string[] | undefined, v => {
            try {
              const render = v.map(_ => translateChoice(q.name, _,)).join(' | ')
              return <span title={render}>{render}</span>
            } catch (e: any) {
              console.warn('Cannot translate')
              return JSON.stringify(v)
            }
          })
        }
      }
      case 'geopoint': {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="location_on" tooltip="geopoint"/>,
          render: row => map(getVal(row, q.name), (x: any) => {
            const render = JSON.stringify(x)
            return <span title={render}>{render}</span>
          })
        }
      }
      default: {
        return {
          ...common,
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          render: row => {
            const render = JSON.stringify(getVal(row, q.name))
            return <span title={render}>{render}</span>
          }
        }
      }
    }
  })()
  return [res].flat()
}


export const getColumnBySchema = <T extends Record<string, any>>({
  schema,
  ...props
}: GetColumnBySchemaProps<T> & {
  schema: KoboQuestionSchema[]
}) => {
  return schema.filter(_ => !ignoredColType.includes(_.type)).flatMap(q => getColumnByQuestionSchema({
    q,
    ...props,
  }))
}