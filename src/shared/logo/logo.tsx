import {BoxProps} from '@mui/material'
import React from 'react'
import Image from 'next/image'
import eu from './eu.png'
import drc from './drc-logo.png'

export const EULogo = ({
  height = 38,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return (
    <Image
      src={eu}
      height={height}
      alt="EU Logo"
    />
  )
}

export const DRCLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return (
    <Image
      src={drc}
      height={height}
      alt="DRC Logo"
    />

  )
}