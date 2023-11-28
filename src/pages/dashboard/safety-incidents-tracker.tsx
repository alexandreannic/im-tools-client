import {DashboardSafetyIncident} from '@/features/Dashboard/DashboardSafetyIncidents/DashboardSafetyIncident'
import {SessionProvider} from '@/core/Session/SessionContext'

const DashboardSafetyIncidentTrackerPage = () => {
  return (
    <SessionProvider>
      <DashboardSafetyIncident/>
    </SessionProvider>
  )
}

export default DashboardSafetyIncidentTrackerPage