import * as React from 'react'
import {ReactNode} from 'react'
import {Badge, Box, ButtonBase, ButtonBaseProps, Icon, Theme, useTheme} from '@mui/material'
import {alpha} from '@mui/material/styles'
import {makeSx, Txt} from 'mui-extension'
import {fnSwitch} from '@alexandreannic/ts-utils'

const css = makeSx({
  i: {
    textAlign: 'center',
    mr: 1.5,
  },
})

const styleActive = (t: Theme) => ({
  color: t.palette.primary.main,
  background: alpha(t.palette.primary.main, 0.16),
})

export interface SidebarItemProps extends ButtonBaseProps {
  icon?: string | ReactNode
  iconEnd?: string | ReactNode
  disabled?: boolean
  large?: boolean
  badge?: ReactNode
  href?: string
  target?: string
  active?: boolean
  size?: 'normal' | 'small' | 'tiny'
  to?: string
}

export const SidebarItem = ({
  children,
  icon,
  size,
  iconEnd,
  className,
  active,
  large,
  sx,
  badge,
  ...props
}: SidebarItemProps) => {
  const t = useTheme()
  return (
    <ButtonBase
      disableRipple={!props.onClick || !props.href}
      sx={{
        width: '100%',
        transition: t.transitions.create('all'),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'inherit',
        minHeight: fnSwitch(size!, {
          normal: 36,
          small: 30,
          tiny: 28
        }, () => 36),
        overflow: 'hidden',
        minWidth: 0,
        whiteSpace: 'nowrap',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        color: t.palette.text.secondary,
        pr: 1,
        pl: 1.5,
        my: 1 / (fnSwitch(size!, {
          normal: 2,
          small: 4,
          tiny: 8
        }, () => 2)),
        borderTopRightRadius: 42,
        borderBottomRightRadius: 42,
        ...props.disabled && {
          opacity: .5,
        },
        '&:hover': {
          background: t => alpha(t.palette.primary.main, 0.06),
        },
        ...(large && {
          minHeight: 38,
        }),
        ...(active && {
          color: t.palette.primary.main,
          background: t => alpha(t.palette.primary.main, 0.16),
        }),
        ...sx,
      }}
      {...props}
    >
      {icon && (typeof icon === 'string' ? <Icon sx={css.i}>{icon}</Icon> : <Box sx={css.i}>{icon}</Box>)}
      <Box
        sx={{
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          fontWeight: t.typography.fontWeightMedium,
        }}
      >
        {children}
      </Box>
      {badge && (
        <Txt size="small" sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: t.typography.fontWeightBold,
          borderRadius: '50px',
          background: t.palette.primary.main,
          color: t.palette.primary.contrastText,
          py: 1 / 16,
          px: .75,
        }}>{badge}</Txt>
      )}
      {iconEnd && (typeof iconEnd === 'string' ? <Icon sx={css.i} color="disabled">{iconEnd}</Icon> : <Box sx={css.i}>{iconEnd}</Box>)}
    </ButtonBase>
  )
}
