import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import {SheetFilterDialogProps} from '@/shared/Sheet/SheetFilterDialog'

export const KoboDatabaseBtn = ({
  ...props
}: AAIconBtnProps) => {
  return (
    <AAIconBtn {...props}/>
  )
}

export const koboTypeToFilterType = (type?: KoboQuestionType): SheetFilterDialogProps['type'] => fnSwitch(type!, {
  date: 'date',
  start: 'date',
  end: 'date',
  select_one: 'list',
  select_multiple: 'list',
}, () => 'string')