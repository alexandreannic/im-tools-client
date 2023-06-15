import React, {ReactNode} from 'react'
import {Box, Icon} from '@mui/material'

export const Row = ({
  icon,
  label,
  children,
  noBorder,
}: {
  noBorder?: boolean
  icon?: string
  label: ReactNode
  children: ReactNode
}) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      '&:not(:first-of-type)': {
        pt: 1.5,
      },
      '&:not(:last-of-type) .row-body': {
        pb: 1.5,
        ...!noBorder && {
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }
      },
    }}>
      {icon !== undefined && (
        <Box sx={{minWidth: 40}}>
          {icon !== '' && (
            <Icon color="disabled">{icon}</Icon>
          )}
        </Box>
      )}
      <Box className="row-body" sx={{flex: 1, display: 'flex', alignItems: 'center'}}>
        <Box sx={{flex: 1, mr: 1}}>{label}</Box>
        <Box sx={{minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>{children}</Box>
      </Box>
    </Box>
  )
}
