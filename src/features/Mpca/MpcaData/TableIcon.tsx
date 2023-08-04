import {Icon, IconProps, Tooltip} from '@mui/material'
import React from 'react'
import {AAIconBtn, AAIconBtnProps} from '@/shared/IconBtn'

export interface TableIconProps extends IconProps {
  tooltip?: string
  children: string
}

export const TableIcon = ({tooltip, children, sx, ...props}: TableIconProps) => {
  const body = <Icon sx={{
    verticalAlign: 'middle',
    // fontSize: '20px !important',
    ...sx
  }} fontSize="medium" {...props}>{children}</Icon>
  return tooltip
    ? <Tooltip title={tooltip}>{body}</Tooltip>
    : body
}

export const TableIconBtn = ({
  sx,
  color,
  ...props
}: AAIconBtnProps) => {
  return (
    <AAIconBtn
      color={color}
      size="small"
      sx={{
        verticalAlign: 'middle',
        // fontSize: '20px !important',
        ...sx
      }}
      {...props}
    />
  )
}