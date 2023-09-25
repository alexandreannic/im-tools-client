import React from 'react'
import {useI18n} from '@/core/i18n'
import {Div} from '@/shared/PdfLayout/PdfSlide'
import {DashboardSafetyIncidentsPageProps} from '@/features/Dashboard/DashboardSafetyIncidents/DashboardSafetyIncident'
import {Typography} from '@mui/material'

export const DashboardSafetyIncidentAgravatingFactors = ({
  data,
  computed,
}: {
  data: DashboardSafetyIncidentsPageProps['data']
  computed: DashboardSafetyIncidentsPageProps['computed']
}) => {
  const {m, formatLargeNumber} = useI18n()

  return (
    <>
      <Typography variant="h2" sx={{mt: 3}}>{m._dashboardSafetyIncident.aggravatingFactors}</Typography>
      <Div sx={{alignItems: 'flex-start'}}>
        <Div column>
          <Div></Div>
        </Div>
        <Div column>

        </Div>
      </Div>
    </>
  )
}
