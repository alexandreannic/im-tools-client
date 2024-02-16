import {IpSelectOption, IpSelectSingle, IpSelectSingleNullableProps, IpSelectSingleProps} from '@/shared/Select/SelectSingle'
import {fnSwitch, Obj} from '@alexandreannic/ts-utils'
import {ReactNode, useMemo} from 'react'
import {KeyOf, StateStatus} from '@/core/type/generic'
import {Box, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import placeholder from 'lodash/fp/placeholder'

export enum ShelterCashStatus {
  Selected = 'Selected',
  Rejected = 'Rejected',
  FirstPayment = 'FirstPayment',
  Paid = 'Paid',
}

export const shelterCashStatusType: Record<ShelterCashStatus, StateStatus> = {
  Selected: 'warning',
  Rejected: 'error',
  FirstPayment: 'info',
  Paid: 'success',
}

export enum CashStatus {
  Paid = 'Paid',
  Rejected = 'Rejected',
  Referred = 'Referred',
  Received = 'Received',
}

export const cashStatusType: Record<CashStatus, StateStatus> = {
  Paid: 'success',
  Rejected: 'error',
  Referred: 'none',
  Received: 'info',
}

const commonProps = {borderRadius: '20px', px: 1}

const OptionLabelType = ({
  type,
  children,
}: {
  type: StateStatus
  children: ReactNode
}) => {
  const t = useTheme()
  return fnSwitch(type, {
    'none': (
      <Box sx={{...commonProps, background: t.palette.divider, color: t.palette.text.secondary}}>{children}</Box>
    ),
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


export const SelectStatus = <T extends string>({status, placeholder, labels, ...props}: Omit<IpSelectSingleNullableProps<T>, 'hideNullOption' | 'options'> & {
  status: Record<T, string>,
  labels: Record<T, StateStatus>
}) => {
  const {m} = useI18n()
  const options: IpSelectOption<any>[] = useMemo(() => {
    return Obj.keys(status).map(_ => ({value: _, children: <OptionLabelType type={labels[_]}>{_ as string}</OptionLabelType>}))
  }, [labels, status])
  return (
    <IpSelectSingle placeholder={placeholder ?? m.status} hideNullOption={false} options={options} {...props}/>
  )
}

export const SelectCashStatus = (props: Omit<IpSelectSingleNullableProps<CashStatus>, 'hideNullOption' | 'options'>) => {
  return <SelectStatus status={CashStatus} labels={cashStatusType} {...props}/>
}

export const SelectShelterCashStatus = (props: Omit<IpSelectSingleNullableProps<ShelterCashStatus>, 'hideNullOption' | 'options'>) => {
  return <SelectStatus status={ShelterCashStatus} labels={shelterCashStatusType} {...props}/>
}