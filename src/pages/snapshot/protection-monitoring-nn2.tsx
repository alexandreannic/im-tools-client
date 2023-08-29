import React from 'react'
import {SnapshotProtMonitoEcho} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {createTheme, GlobalStyles, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {SnapshotProtMonitoNN2} from '@/features/Snapshot/SnapshotProtMonitoNN2/SnapshotProtMonitoNN2'

const generalStyles = <GlobalStyles styles={{
  body: {
    background: 'white',
  }
}}/>

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
      {generalStyles}
      <SnapshotProtMonitoNN2/>
    </ThemeProvider>
  )
}

export default SnapshotProtectionMonitoringPage