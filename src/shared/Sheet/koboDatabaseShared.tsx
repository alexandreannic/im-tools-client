import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'

export const KoboDatabaseBtn = ({
  ...props
}: {
  tooltip: string
} & Omit<AAIconBtnProps, 'tooltip'>) => {
  return (
    <AAIconBtn {...props}/>
  )
}

export const koboTypeToFilterType = (type?: KoboQuestionType) => fnSwitch(type!, {
  date: 'date',
  start: 'date',
  end: 'date',
  select_one: 'list',
  select_multiple: 'list',
}, () => 'string')