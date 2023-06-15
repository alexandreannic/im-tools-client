import {Box, BoxProps} from '@mui/material'
import eulogo from '../core/img/eu.png'
import drclogo from '../core/img/drc-logo.png'
import React from 'react'

export const EULogo = ({
  height = 38,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return (
    <Box component="img" src={eulogo} sx={{height}} {...props}/>
  )
}

export const DRCLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return (
    <Box component="img" src={drclogo} sx={{height}}/>
  )
}