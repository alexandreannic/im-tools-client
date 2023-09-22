import {useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {I18nContextProps} from '@/core/i18n/I18n'
import {KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {SheetColumnProps} from '@/shared/Sheet/Sheet'
import {ignoredColType} from '@/features/Database/Database'
import {SheetHeadTypeIcon} from '@/shared/Sheet/SheetHead'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Arr, map, mapFor} from '@alexandreannic/ts-utils'
import {formatDate, formatDateTime} from '@/core/i18n/localization/en'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import React from 'react'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'

export const getColumnBySchema = ({
  data,
  m,
  schema,
  groupSchemas,
  translateQuestion,
  translateChoice,
  onOpenGroupModal,
  choicesIndex,
  groupIndex,
  groupName,
  repeatGroupsAsColumn,
}: {
  data: any[]
  choicesIndex: ReturnType<typeof useKoboSchema>['choicesIndex']
  m: I18nContextProps['m']
  translateChoice: KoboTranslateChoice
  translateQuestion: KoboTranslateQuestion
  schema: KoboQuestionSchema[],
  groupSchemas: Record<string, KoboQuestionSchema[]>
  onOpenGroupModal?: (_: {columnId: string, group: KoboAnswer[], event: any}) => void,
  groupIndex?: number
  groupName?: string
  repeatGroupsAsColumn?: boolean
}): SheetColumnProps<KoboMappedAnswer>[] => {
  const {
    getId,
    getHead,
    getVal,
  } = (() => {
    if (groupIndex && groupName)
      return {
        getId: (q: KoboQuestionSchema) => `${groupIndex}_${q.name}`,
        getHead: (name: string) => `[${groupIndex}] ${name}`,
        getVal: (row: KoboMappedAnswer, name: string) => (row as any)[groupName][groupIndex]?.[name]
      }
    return {
      getId: (q: KoboQuestionSchema) => q.name,
      getHead: (name: string) => name,
      getVal: (row: KoboMappedAnswer, name: string) => row[name],
    }
  })()

  return schema.filter(_ => !ignoredColType.includes(_.type)).flatMap(q => {
    switch (q.type) {
      case 'image': {
        return {
          type: 'string',
          id: getId(q),
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => <KoboAttachedImg attachments={row.attachments} fileName={getVal(row, q.name) as string}/>
        }
      }
      case 'calculate': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="functions" tooltip="calculate"/>,
          id: getId(q),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>,
          options: () => Arr(data).map(_ => _[q.name] as string | undefined).distinct(_ => _).map(_ => ({label: _, value: _})),
        }
      }
      case 'select_one_from_file': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="attach_file" tooltip="select_one_from_file"/>,
          id: getId(q),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'username':
      case 'text': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          id: getId(q),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'decimal':
      case 'integer': {
        return {
          type: 'number',
          id: getId(q),
          typeIcon: <SheetHeadTypeIcon children="tag" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as number}</span>
        }
      }
      case 'note': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="info" tooltip="note"/>,
          id: getId(q),
          head: getHead(translateQuestion(q.name)),
          render: row => <span title={getVal(row, q.name) as string}>{getVal(row, q.name) as string}</span>
        }
      }
      case 'date':
      case 'today':
      case 'start':
      case 'end': {
        return {
          type: 'date',
          id: getId(q),
          typeIcon: <SheetHeadTypeIcon children="event" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => map(getVal(row, q.name) as Date | undefined, _ => (
            <span title={formatDateTime(_)}>{formatDate(_)}</span>
          ))
        }
      }
      case 'begin_repeat': {
        if (repeatGroupsAsColumn) {
          return mapFor(17, i => getColumnBySchema({
            data: data?.map(_ => _[q.name]),
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
          type: 'number',
          typeIcon: <SheetHeadTypeIcon children="repeat" tooltip="begin_repeat"/>,
          id: getId(q),
          head: getHead(translateQuestion(q.name)),
          render: row => map(row[q.name] as KoboAnswer[] | undefined, group =>
            <AaBtn sx={{py: '6px'}} onClick={(event) => onOpenGroupModal?.({
              columnId: q.name,
              group,
              event,
            })}>{group.length}</AaBtn>
          ) ?? <></>
        }
      }
      case 'select_one': {
        return {
          type: 'select_one',
          id: getId(q),
          typeIcon: <SheetHeadTypeIcon children="radio_button_checked" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
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
          type: 'select_multiple',
          id: getId(q),
          typeIcon: <SheetHeadTypeIcon children="check_box" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          options: () => choicesIndex[q.select_from_list_name!].map(_ => ({value: _.name, label: translateChoice(q.name, _.name)})),
          render: row => map(getVal(row, q.name) as string[] | undefined, v => {
            try {
              const render = v.map(_ => translateChoice(q.name, _,)).join(' | ')
              return <span title={render}>{render}</span>
            } catch (e: any) {
              console.error(v)
              return JSON.stringify(v)
            }
          })
        }
      }
      case 'geopoint': {
        return {
          type: 'string',
          typeIcon: <SheetHeadTypeIcon children="location_on" tooltip="geopoint"/>,
          id: getId(q),
          head: getHead(translateQuestion(q.name)),
          render: row => map(getVal(row, q.name), (x: any) => {
            const render = JSON.stringify(x)
            return <span title={render}>{render}</span>
          })
        }
      }
      default: {
        return {
          type: 'string',
          id: getId(q),
          typeIcon: <SheetHeadTypeIcon children="short_text" tooltip={q.type}/>,
          head: getHead(translateQuestion(q.name)),
          render: row => {
            const render = JSON.stringify(getVal(row, q.name))
            return <span title={render}>{render}</span>
          }
        }
      }
    }
  })
}
