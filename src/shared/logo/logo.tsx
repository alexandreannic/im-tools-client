import {Box, BoxProps, useTheme} from '@mui/material'
import React from 'react'

export const EULogo = ({
  height = 38,
  sx,
  ...props
}: {
  height?: number
} & BoxProps) => {
  const theme = useTheme()
  return (
    <>
      <Box
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'none'
          },
          ...sx,
        }}
        component="img"
        src="/static/eu.png"
        height={height}
        alt="EU Logo"
        {...props}
      />
      <Box
        component="img"
        sx={{
          [theme.breakpoints.up('sm')]: {
            display: 'none'
          },
          ...sx,
        }}
        src="/static/eu-mobile.png"
        height={height}
        alt="EU Logo"
        {...props}
      />
    </>
  )
}

export const DRCLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return (
    <Box
      component="img"
      src="/static/drc-logo.png"
      height={height}
      alt="DRC Logo"
      {...props}
    />

  )
}