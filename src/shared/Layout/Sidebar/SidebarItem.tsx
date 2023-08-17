import * as React from 'react'
import {ReactNode} from 'react'
import {Box, ButtonBase, ButtonBaseProps, Icon, Theme, useTheme} from '@mui/material'
import {alpha} from '@mui/material/styles'
import {makeSx} from 'mui-extension'

const css = makeSx({
  i: {
    textAlign: 'center',
    mr: 2,
  },
})

const styleActive = (t: Theme) => ({
  color: t.palette.primary.main,
  background: alpha(t.palette.primary.main, 0.16),
})

export interface SidebarItemProps extends ButtonBaseProps {
  icon?: string | ReactNode
  iconEnd?: string | ReactNode
  large?: boolean
  href?: string
  target?: string
  active?: boolean
  to?: string
}

export const SidebarItem = ({
  children,
  icon,
  iconEnd,
  className,
  active,
  large,
  sx,
  ...props
}: SidebarItemProps) => {
  const theme = useTheme()
  return (
    <ButtonBase
      disableRipple={!props.onClick || !props.href}
      sx={{
        width: '100%',
        transition: t => t.transitions.create('all'),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'inherit',
        minHeight: 36,
        overflow: 'hidden',
        minWidth: 0,
        whiteSpace: 'nowrap',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        color: t => t.palette.text.secondary,
        pr: 1,
        pl: 2,
        my: 1 / 2,
        borderTopRightRadius: 42,
        borderBottomRightRadius: 42,
        '&:hover': props.onClick ? {
          background: t => alpha(t.palette.primary.main, 0.06),
        } : {},
        ...(large && {
          minHeight: 38,
        }),
        ...(active && {
          color: t => t.palette.primary.main,
          background: t => alpha(t.palette.primary.main, 0.16),
        }),
        ...sx,
      }}
      {...props}
    >
      {icon && (typeof icon === 'string' ? <Icon sx={css.i}>{icon}</Icon> : <Box sx={css.i}>{icon}</Box>)}
      <Box
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          fontWeight: t => t.typography.fontWeightMedium,
        }}
      >
        {children}
      </Box>
      {iconEnd && (typeof iconEnd === 'string' ? <Icon sx={css.i} color="disabled">{iconEnd}</Icon> : <Box sx={css.i}>{iconEnd}</Box>)}
    </ButtonBase>
  )
}
