import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'

export const KoboDatabaseBtn = ({
  ...props
}: {
  tooltip: string
} & Omit<AAIconBtnProps, 'tooltip'>) => {
  return (
    <AAIconBtn {...props}/>
  )
}