import {Icon, IconProps, Tooltip} from '@mui/material'
import React from 'react'

export interface TableIconProps extends IconProps {
  tooltip?: string
}

export const TableIcon = ({sx, tooltip, ...props}: TableIconProps) => {
  const body = <Icon sx={{verticalAlign: 'middle', ...sx}} fontSize="medium" {...props}/>
  return tooltip
    ? <Tooltip title={tooltip}>{body}</Tooltip>
    : body
}