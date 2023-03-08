import * as React from 'react'
import {ReactNode, useMemo, useState} from 'react'
import {alpha, Box, Icon, styled, Tooltip, tooltipClasses, TooltipProps} from '@mui/material'
import {useTimeout} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension'

export interface HorizontalBarChartGoogleData {
  label: ReactNode
  value: number
  color?: string
  disabled?: boolean
  desc?: string
}

interface Props {
  data?: HorizontalBarChartGoogleData[]
  barHeight?: number
}

const TooltipWrapper = ({
  children,
  item,
  percentOfAll,
  ...props
}: {
  percentOfAll: number
  item: HorizontalBarChartGoogleData
} & Omit<TooltipProps, 'title'>
) => {
  const {formatLargeNumber} = useI18n()
  if (item.disabled) return children
  return (
    <LightTooltip
      {...props}
      open={item.disabled ? false : undefined}
      title={
        <>
          <Txt size="big" block bold>
            {item.label}
          </Txt>
          {item.desc && (
            <Txt block color="hint">
              {item.desc}
            </Txt>
          )}
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Txt size="title" color="primary" block>
              {Math.ceil(percentOfAll)}%
            </Txt>
            <Txt size="title" color="hint" block>
              {formatLargeNumber(item.value)}
            </Txt>
          </Box>
        </>
      }
    >
      {children}
    </LightTooltip>
  )
}

export const HorizontalBarChartGoogle = ({
  data,
  barHeight = 4
}: Props) => {
  const {m} = useI18n()
  const maxValue = useMemo(() => data && Math.max(...data.map(_ => _.value)), [data])
  const sumValue = useMemo(() => data && data.reduce((sum, _) => _.value + sum, 0), [data])
  const [appeared, setAppeared] = useState<boolean>(false)
  const {formatLargeNumber} = useI18n()
  
  useTimeout(() => setAppeared(true), 200)

  return (
    <Box sx={{overflow: 'hidden'}}>
      {data && maxValue && sumValue ? (
        data.map((item, i) => {
          const percentOfMax = (item.value / maxValue) * 100
          const percentOfAll = (item.value / sumValue) * 100
          return (
            <TooltipWrapper percentOfAll={percentOfAll} key={i} item={item}>
              <Box sx={{
                my: 1,
                mx: 0,
                ...item.disabled ? {
                  mb: -1,
                  mt: 2,
                } : {
                  borderBottom: i === data.length - 1 ? 'none' : t => `1px solid ${t.palette.divider}`,
                  transition: t => t.transitions.create('background'),
                  '&:hover': {
                    background: t => alpha(item.color ?? t.palette.primary.main, 0.10),
                  }
                }
              }}>
                <Box sx={{display: 'flex', mb: barHeight + 'px', py: .0}}>
                  <Txt sx={{p: 0, mt: .5, pr: 2, flex: 1}} truncate>
                    <Txt block truncate>{item.label}</Txt>
                    {item.desc && <Txt block color="hint" truncate size="small">{item.desc}</Txt>}
                  </Txt>
                  {!item.disabled && (
                    <Box sx={{display: 'flex', textAlign: 'right',}}>
                      <Txt color="hint">{formatLargeNumber(item.value)}</Txt>
                      <Box sx={{
                        minWidth: 110,
                        color: t => t.palette.primary.main,
                        fontWeight: t => t.typography.fontWeightBold,
                      }}>{percentOfMax.toFixed(1)}%</Box>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    transition: t => t.transitions.create('width', {duration: 1200}),
                    width: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderBottom: t => `${barHeight}px solid ${t.palette.primary.main}`,
                  }}
                  style={{width: appeared ? `calc(${percentOfMax * 0.9}%)` : 0, color: item.color, borderColor: item.color}}
                />
              </Box>
            </TooltipWrapper>
          )
        })
      ) : (
        <Box sx={{
          textAlign: 'center',
          mt: 2,
          color: t => t.palette.text.disabled
        }}>
          <Icon sx={{fontSize: '3rem !important'}}>block</Icon>
          <Box>{m.noDataAtm}</Box>
        </Box>
      )}
    </Box>
  )
}

const LightTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))
