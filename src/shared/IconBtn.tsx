import {Icon, Tooltip} from '@mui/material'
import {IconBtnProps} from 'mui-extension/lib/IconBtn/IconBtn'
import React from 'react'
import {IconBtn} from 'mui-extension'

export interface AAIconBtnProps extends Omit<IconBtnProps, 'children'> {
  tooltip?: string
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
      <Icon fontSize={size === 'small' ? 'medium' : size}>{children}</Icon>
    </IconBtn>
  )
  return tooltip ? (
    <Tooltip title={tooltip}>
      {content}
    </Tooltip>
  ) : content
}