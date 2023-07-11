import {styled, Tooltip, tooltipClasses, TooltipProps} from '@mui/material'
import * as React from 'react'
import {ReactNode} from 'react'
import {Txt} from 'mui-extension'

export const LightTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[3],
    fontSize: 11,
  },
}))

export const TooltipRow = ({
  label,
  value,
}: {
  label: ReactNode
  value: ReactNode
}) => {
  return (
    <Txt size="big" sx={{mt: .5, display: 'flex', justifyContent: 'space-between'}}>
      <Txt color="hint">{label}</Txt>
      <Txt bold color="primary" sx={{ml: 2}}>{value}</Txt>
    </Txt>
  )
}