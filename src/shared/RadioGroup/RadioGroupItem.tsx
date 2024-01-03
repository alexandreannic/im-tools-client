import {alpha, Box, BoxProps, Checkbox, Icon, Radio} from '@mui/material'
import React, {ReactNode} from 'react'

const defaultMuiRadioPadding = 9

export interface ScRadioGroupItemProps<T> extends Omit<BoxProps, 'title'> {
  title?: string | ReactNode
  description?: string | ReactNode
  value: T
  disabled?: boolean
  icon?: string
  selected?: boolean
  children?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  dense?: boolean
  inline?: boolean
  error?: boolean
  hideRadio?: boolean
  multiple?: boolean
}

export const ScRadioGroupItem = <T, >({
  title,
  description,
  error,
  icon,
  dense,
  inline,
  disabled,
  value,
  children,
  selected,
  onClick,
  hideRadio,
  className,
  multiple,
  sx,
  ...rest
}: ScRadioGroupItemProps<T>) => {
  const minHeight = dense ? 34 : 50
  return (
    <Box
      role={multiple ? 'checkbox' : 'radio'}
      sx={{
        ...sx,
        minHeight,
        display: 'flex',
        alignItems: 'flex-start',
        border: t => '1px solid ' + t.palette.divider,
        paddingRight: '2px',
        paddingBottom: '2px',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        ...inline ? {
          borderRightColor: 'transparent',
          '&:last-of-type': {
            borderRight: t => '1px solid ' + t.palette.divider,
            borderBottomRightRadius: t => t.shape.borderRadius,
            borderTopRightRadius: t => t.shape.borderRadius,
          },
          '&:first-of-type': {
            borderBottomLeftRadius: t => t.shape.borderRadius,
            borderTopLeftRadius: t => t.shape.borderRadius,
          },
          '&:not(:first-of-type)': {
            marginLeft: '-1px',
          },
        } : {
          borderBottomColor: 'transparent',
          '&:last-of-type': {
            borderBottom: t => '1px solid ' + t.palette.divider,
            borderBottomRightRadius: t => t.shape.borderRadius,
            borderBottomLeftRadius: t => t.shape.borderRadius,
          },
          '&:first-of-type': {
            borderTopRightRadius: t => t.shape.borderRadius,
            borderTopLeftRadius: t => t.shape.borderRadius,
          },
          '&:not(:first-of-type)': {
            marginTop: '-2px',
          },
        },
        '&:hover': disabled ? {} : {
          zIndex: 1,
          border: t => `1px solid ${t.palette.primary.main}`,
          background: 'rgba(0,0,0,.04)',
        },
        ...disabled && {
          opacity: .8,
        },
        ...selected && {
          zIndex: 1,
          border: t => `1px solid ${t.palette.primary.main} !important`,
          background: t => alpha(t.palette.primary.main, 0.1),
          boxShadow: t => `inset 0 0 0 1px ${t.palette.primary.main}`,
        },
        ...error && {
          '&$rootSelected': {
            borderColor: t => t.palette.error.main + ' !important',
          },
          boxShadow: t => `inset 0 0 0 1px ${t.palette.error.main}`,
        }
      }}
      // className={classes(css.root, selected && css.rootSelected, error && css.rootError, className)}
      onClick={onClick}
      {...rest}
    >
      {!hideRadio && (
        multiple ? (
          <Checkbox
            disabled={disabled}
            size={dense ? 'small' : undefined}
            checked={selected}
            sx={{
              marginLeft: 1,
              minHeight: minHeight,
            }}/>
        ) : (
          <Radio
            size="small"
            disabled={disabled}
            // size={dense ? 'small' : undefined}
            checked={selected}
            sx={{
              marginLeft: 1,
              minHeight: minHeight,
            }}
          />
        )
      )}
      {icon && <Icon sx={{color: t => t.palette.text.secondary, mr: .5, alignSelf: 'center'}}>{icon}</Icon>}
      <Box
        sx={{
          alignSelf: 'center',
          display: 'flex',
          justifyContent: 'center',
          pt: 1.5,
          pb: 1.5,
          flexDirection: 'column',
          ml: hideRadio ? 2 : .5,
          mr: 2,
          width: '100%',
          ...dense && {
            pt: .5,
            pb: .5,
          }
        }}>
        {title && (
          <Box>
            {title}
          </Box>
        )}
        {description && (
          <Box sx={{color: t => t.palette.text.secondary, fontSize: t => t.typography.fontSize * 0.90}}>
            {description}
          </Box>
        )}
        {children && children}
      </Box>
    </Box>
  )
}
