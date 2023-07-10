import {Icon, Tooltip} from '@mui/material'
import {IconBtnProps} from 'mui-extension/lib/IconBtn/IconBtn'
import React from 'react'
import {IconBtn} from 'mui-extension'

export interface AAIconBtnProps extends Omit<IconBtnProps, 'children'> {
  title?: string
  icon: string
}

export const AAIconBtn = ({
  title,
  icon,
  size = "small",
  ...props
}: AAIconBtnProps) => {
  return (
    <Tooltip title={title}>
      <IconBtn {...props} size={size}>
        <Icon fontSize={size}>{icon}</Icon>
      </IconBtn>
    </Tooltip>
  )
}