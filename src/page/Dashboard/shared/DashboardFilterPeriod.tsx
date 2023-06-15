import {PeriodPicker, PeriodPickerProps} from '../../../shared/PeriodPicker/PeriodPicker'
import {DashboardFilterLabel} from './DashboardFilterLabel'

export const DashboardFilterPeriod = ({...props}: PeriodPickerProps) => {
  return (
    <DashboardFilterLabel label="">
      <PeriodPicker {...props}/>
    </DashboardFilterLabel>
  )
}