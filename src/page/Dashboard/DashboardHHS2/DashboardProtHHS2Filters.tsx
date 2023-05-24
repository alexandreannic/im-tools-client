import {Box, Card, Radio} from '@mui/material'
import React, {ReactNode, useState} from 'react'
import {AaBtnProps} from '../../../shared/Btn/AaBtn'

const DashboardFilterLabel = ({
  label,
  children,
  ...props
}: AaBtnProps & {
  label: string
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Box sx={{position: 'relative'}}>
      <Box
        component="button"
        sx={{
          p: 1,
          px: 2,
          display: 'inline-block',
          background: t => t.palette.background.paper,
          // border: t => `1px solid ${t.palette.divider}`,
          border: 'none',
          boxShadow: t => t.shadows[1],
          borderRadius: 2,
          color: t => t.palette.text.primary,
          transition: t => t.transitions.create('all'),
          '&:active': {
            boxShadow: t => t.shadows[3],
          },
          '&:hover': {
            background: t => t.palette.action.hover,
          },
        }}
        onClick={() => setOpen(_ => !_)}
      >
        {label}
      </Box>
      <Card sx={{
        position: 'absolute',
        top: 0,
        opacity: open ? 1 : 0,
      }}>
        {children}
      </Card>
    </Box>
  )
}

export const DashboardFilterOptions = ({
  value,
  label,
  options
}: {
  value?: string
  label: string
  options: {name: string, label: ReactNode}[]
}) => {
  return (
    <Box>
      <DashboardFilterLabel label={label}>
        {options.map(o =>
          <Box>
            <Radio checked={value === o.name}/>
            {o.label}
          </Box>
        )}
      </DashboardFilterLabel>
    </Box>
  )
}