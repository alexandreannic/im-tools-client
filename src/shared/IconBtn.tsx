import {Box, Icon, Tooltip} from '@mui/material'
import {IconBtnProps} from 'mui-extension/lib/IconBtn/IconBtn'
import React, {ReactNode} from 'react'
import {IconBtn} from 'mui-extension'

export interface AAIconBtnProps extends Omit<IconBtnProps, 'tooltip' | 'children'> {
  tooltip?: ReactNode
  children: string
  href?: string
  target?: '_blank'
}

export const AAIconBtn = ({
  tooltip,
  children,
  size,
  ...props
}: AAIconBtnProps) => {
  const content = (
    <IconBtn {...props} size={size}>
      <Icon fontSize={size/* === 'small' ? 'small' : size*/}>{children}</Icon>
    </IconBtn>
  )
  return tooltip ? (
    <Tooltip title={tooltip}>
      {props.disabled ? <Box component="span" sx={props.sx}>{content}</Box> : content}
    </Tooltip>
  ) : content
}