import {Box, BoxProps} from '@mui/material'
import logo from 'core/drc-logo.png'

export const ProtectionSnapshotHeader = ({children}: BoxProps) => {
  return (
    <Box sx={{
      p: 2,
      borderBottom: t => `1px solid ${t.palette.divider}`,
      mb: 2,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box sx={{fontSize: '1.4rem'}}>{children}</Box>
      <Box component="img" src={logo} sx={{height: 22, marginLeft: 'auto'}}/>
    </Box>
  )
}

export const ProtectionSnapshotBody = (props: BoxProps) => {
  return (
    <Box {...props} sx={{p: 2, ...props.sx}}/>
  )
}
