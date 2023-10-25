import React from 'react'
import {GlobalStyles, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {SnapshotProtMonitoNN2} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2'
import {endOfMonth, startOfMonth} from 'date-fns'

const generalStyles = <GlobalStyles styles={{
  body: {
    background: '#fff',
  }
}}/>

const SnapshotProtectionMonitoringPage = () => {
  return (
    <ThemeProvider theme={muiTheme({
      dark: false,
      fontSize: 14,
      mainColor: '#af161e',
      backgroundDefault: '#fff',
      backgroundPaper: '#f6f7f9',
      cardElevation: 1,
    })}>
      {generalStyles}
      <SnapshotProtMonitoNN2 period={{
        start: startOfMonth(new Date(2023, 7)),
        end: endOfMonth(new Date(2023, 8)),
      }}/>
    </ThemeProvider>
  )
}

export default SnapshotProtectionMonitoringPage