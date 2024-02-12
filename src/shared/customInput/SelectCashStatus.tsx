import {IpSelectOption, IpSelectSingle, IpSelectSingleNullableProps, IpSelectSingleProps} from '@/shared/Select/SelectSingle'
import {fnSwitch, Obj} from '@alexandreannic/ts-utils'
import {ReactNode} from 'react'
import {StateStatus} from '@/core/type/generic'
import {Box, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'

export enum CashStatus {
  Paid = 'Paid',
  Rejected = 'Rejected',
  Referred = 'Referred',
  Received = 'Received',
}

const commonProps = {borderRadius: '20px', px: .5, py: .125}

const OptionLabel = ({
  type,
  children,
}: {
  type: StateStatus
  children: ReactNode
}) => {
  const t = useTheme()
  return fnSwitch(type, {
    'error': (
      <Box sx={{...commonProps, background: t.palette.error.main, color: t.palette.error.contrastText}}>{children}</Box>
    ),
    'warning': (
      <Box sx={{...commonProps, background: t.palette.warning.main, color: t.palette.warning.contrastText}}>{children}</Box>
    ),
    'info': (
      <Box sx={{...commonProps, background: t.palette.info.main, color: t.palette.info.contrastText}}>{children}</Box>
    ),
    'success': (
      <Box sx={{...commonProps, background: t.palette.success.main, color: t.palette.success.contrastText}}>{children}</Box>
    ),
  })
}
const options: IpSelectOption<CashStatus>[] = [
  {value: CashStatus.Paid, children: <OptionLabel type="success" children={CashStatus.Paid}/>},
  {value: CashStatus.Rejected, children: <OptionLabel type="error" children={CashStatus.Rejected}/>},
  {value: CashStatus.Referred, children: <OptionLabel type="warning" children={CashStatus.Referred}/>},
  {value: CashStatus.Received, children: <OptionLabel type="info" children={CashStatus.Received}/>},
]

export const SelectCashStatus = (props: Omit<IpSelectSingleNullableProps<CashStatus>, 'hideNullOption' | 'options'>) => {
  const {m} = useI18n()
  return (
    <IpSelectSingle placeholder={m.status} hideNullOption={false} options={options} {...props}/>
  )
}