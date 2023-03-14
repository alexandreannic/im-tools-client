import {Box, BoxProps} from '@mui/material'
import logo from 'core/drc-logo.png'
import React from 'react'
import {Txt} from 'mui-extension'

export const slidePadding = 2

export const ProtectionSnapshotHeader = ({children}: BoxProps) => {
  return (
    <Box sx={{
      p: 2,
      borderBottom: t => `1px solid ${t.palette.divider}`,
      mb: 0,
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
    <Box {...props} sx={{p: slidePadding, ...props.sx}}/>
  )
}

export const SlidePanel = ({children, title, sx, ...props}: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        ...sx,
        mb: slidePadding,
        p: 1,
        background: '#f8f9fa',
        borderRadius: 2,
      }}
    >
      <Txt bold block sx={{fontSize: '1.3rem', mb: .5}}>{title}</Txt>
      {children}
    </Box>
  )
}
