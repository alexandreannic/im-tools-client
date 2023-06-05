import {alpha, Box, BoxProps, Card, Icon} from '@mui/material'
import React, {ReactNode, useState} from 'react'
import {makeSx} from 'mui-extension'
import {combineSx} from '../../../core/theme'

const css = makeSx({
  button: {
    py: .75,
    px: 1.25,
    zIndex: 101,
    fontWeight: t => t.typography.fontWeightBold,
    display: 'inline-flex',
    alignItems: 'center',
    background: t => t.palette.background.paper,
    border: t => `1px solid ${t.palette.divider}`,
    borderRadius: 20,
    color: t => t.palette.text.primary,
    transition: t => t.transitions.create('all'),
    '&:active': {
      boxShadow: t => t.shadows[3],
    },
    '&:hover': {
      background: t => t.palette.action.hover,
    }
  },
  active: {
    color: t => t.palette.primary.main,
    background: t => t.palette.action.focus,
    // borderColor: t => alpha(t.palette.primary.light, .8),
  }
})

export const DashboardFilterLabel = ({
  label,
  children,
  icon,
  active,
  sx
}: {
  active?: boolean
  icon?: string
  children: ReactNode
  label: ReactNode
} & BoxProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Box sx={{position: 'relative', display: 'inline-block', ...sx}}>
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 100,
          }}
        />
      )}
      <Box
        component="button"
        sx={combineSx(css.button, active && css.active)}
        onClick={() => setOpen(_ => !_)}
      >
        {icon && <Icon fontSize="small" sx={{mr: 1}}>{icon}</Icon>}
        {label}
        <Icon sx={{ml: 1}} fontSize="small">{open ? 'expand_less' : 'expand_more'}</Icon>
      </Box>
      {open && (
        <Card sx={{
          boxShadow: t => t.shadows[4],
          overflow: 'hidden',
          border: 'none',
          zIndex: 102,
          position: 'absolute',
          top: 57,
        }}>
          <Box sx={{
            overflowY: 'scroll',
            maxHeight: '50vh',
          }}>
            {children}
          </Box>
        </Card>
      )}
    </Box>
  )
}
