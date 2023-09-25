import {useMemo} from 'react'
import {subDays} from 'date-fns'
import {DashboardSafetyIncidentsPageProps} from '@/features/Dashboard/DashboardSafetyIncidents/DashboardSafetyIncident'
import {Period} from '@/core/type'

export const useDashboardSafetyIncident = ({
  data,
  period,
}: {
  data?: DashboardSafetyIncidentsPageProps['data']
  period: Partial<Period>
}) => useMemo(() => {
  if (data)
    return {
      lastMonth: data?.filter(_ => _.end < subDays(period?.end ?? new Date(), 30))
    }
}, [data])