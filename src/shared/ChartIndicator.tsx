import {Box, BoxProps, Icon} from '@mui/material'
import React from 'react'

export const ChartIndicator = ({
  percent,
  value,
  ...props
}: {
  percent?: boolean
  value: number
} & Omit<BoxProps, 'children'>) => {
  return (
    <Box component="span" {...props}>
      <Box sx={{display: 'inline-flex', alignItems: 'center'}}>
        {value > 0 ? (
          <Icon color="success" fontSize="inherit">north</Icon>
        ) : (
          <Icon color="error" fontSize="inherit">south</Icon>
        )}
        <Box sx={{ml: .5}}>
          {value > 0 && '+'}{value}{percent && '%'}
        </Box>
      </Box>
    </Box>
  )
}
