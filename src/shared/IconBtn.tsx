import {Icon, Tooltip} from '@mui/material'
import {IconBtnProps} from 'mui-extension/lib/IconBtn/IconBtn'
import React from 'react'
import {IconBtn} from 'mui-extension'

export interface AAIconBtnProps extends Omit<IconBtnProps, 'children'> {
  tooltip?: string
  icon: string
}

export const AAIconBtn = ({
  tooltip,
  icon,
  size,
  ...props
}: AAIconBtnProps) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconBtn {...props} size={size}>
          <Icon fontSize={size}>{icon}</Icon>
        </IconBtn>
      </span>
    </Tooltip>
  )
}