import React from 'react'
import {SnapshotProtMonitoEcho} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {createTheme, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'

const SnapshotProtectionMonitoringPage = () => {
  return (
    <ThemeProvider theme={muiTheme({
      dark: false,
      fontSize: 14,
      mainColor: '#af161e',
      backgroundDefault: 'white',
      backgroundPaper: '#f6f7f9',
      cardElevation: 1,
    })}>
      <SnapshotProtMonitoEcho/>
    </ThemeProvider>
  )
}

export default SnapshotProtectionMonitoringPage