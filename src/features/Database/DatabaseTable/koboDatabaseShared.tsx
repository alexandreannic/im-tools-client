import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'

export const KoboDatabaseBtn = ({
  ...props
}: AAIconBtnProps) => {
  return (
    <AAIconBtn {...props}/>
  )
}

// export const koboTypeToFilterType = (type?: KoboQuestionType): SheetFilterDialogProps['type'] => fnSwitch(type!, {
//   date: 'date',
//   start: 'date',
//   end: 'date',
//   calculate: 'list',
//   select_one: 'list',
//   select_multiple: 'list_multiple',
// }, () => 'string')