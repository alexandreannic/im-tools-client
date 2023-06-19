import {Box, BoxProps, Card, Icon, Popover} from '@mui/material'
import React, {ReactNode, useState} from 'react'
import {makeSx} from 'mui-extension'
import {combineSx} from '../../../core/theme'

const css = makeSx({
  button: {
    py: .75,
    px: 1.25,
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  // const [open, setOpen] = useState(false)

  const open = (!!anchorEl)

  return (
    <Box sx={{position: 'relative', display: 'inline-block', ...sx}}>
      <Box
        component="button"
        sx={combineSx(css.button, active && css.active)}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {icon && <Icon fontSize="small" sx={{mr: 1}}>{icon}</Icon>}
        {label}
        <Icon color="disabled" sx={{ml: 1}} fontSize="small">{open ? 'expand_less' : 'expand_more'}</Icon>
      </Box>
      <Popover
        disableScrollLock={true}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{
          boxShadow: t => t.shadows[4],
          overflow: 'hidden',
          // border: 'none',
          // position: 'absolute',
          // top: 46,
        }}
      >
        <Box sx={{
          overflowY: 'auto',
          maxHeight: '50vh',
        }}>
          {children}
        </Box>
      </Popover>
    </Box>
  )
}
