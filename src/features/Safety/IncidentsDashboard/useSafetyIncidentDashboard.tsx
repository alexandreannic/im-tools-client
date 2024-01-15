import {useMemo} from 'react'
import {subDays} from 'date-fns'
import {Period} from '@/core/type'
import {DashboardSafetyIncidentsPageProps} from '@/features/Safety/IncidentsDashboard/SafetyIncidentDashboard'

export const useSafetyIncidentDashboard = ({
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