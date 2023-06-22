import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect} from 'react'
import {KoboTableLayoutRoute} from '@/features/Kobo/KoboForm/KoboTable'

const DashboardProtectionHouseholdSurvey = () => {
  const {api} = useAppSettings()
  const _forms = useFetcher(api.kobo.fetchServers)
  useEffect(() => {
    _forms.fetch()
  }, [])

  return (
    <KoboTableLayoutRoute/>
  )
}

export default DashboardProtectionHouseholdSurvey