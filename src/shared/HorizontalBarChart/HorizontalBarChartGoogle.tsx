import * as React from 'react'
import {ReactNode, useMemo, useState} from 'react'
import {alpha, Box, Icon, styled, Tooltip, tooltipClasses, TooltipProps} from '@mui/material'
import {useTimeout} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension'

export interface HorizontalBarChartGoogleData {
  name: ReactNode
  value: number
  base?: number
  color?: string
  disabled?: boolean
  desc?: string
}

interface Props {
  hideValue?: boolean
  dense?: boolean
  base?: number
  data?: HorizontalBarChartGoogleData[]
  barHeight?: number
}

const TooltipRow = ({
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
const TooltipWrapper = ({
    children,
    item,
    percentOfAll,
    percentOfBase,
    ...props
  }: {
    percentOfBase: number
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
            {item.name}
          </Txt>
          {item.desc && (
            <Txt block color="hint">
              {item.desc}
            </Txt>
          )}
          <Box sx={{mt: .5}}>
            <TooltipRow label="Total" value={formatLargeNumber(item.value)}/>
            <TooltipRow label="% of answers" value={Math.ceil(percentOfAll) + ' %'}/>
            {percentOfAll !== percentOfBase && (
              <TooltipRow label="% of peoples" value={Math.ceil(percentOfBase) + ' %'}/>
            )}
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
  base,
  barHeight = 3,
  hideValue,
}: Props) => {
  const {m} = useI18n()

  const maxValue = useMemo(() => data && Math.max(...data.map(_ => _.value)), [data])
  const sumValue = useMemo(() => data && data.reduce((sum, _) => _.value + sum, 0), [data])
  const percents = useMemo(() => data && sumValue && data.map(_ => _.value / (_.base ? _.base : base ?? sumValue) * 100), [data])
  const maxPercent = useMemo(() => percents && Math.max(...percents), [percents])

  const [appeared, setAppeared] = useState<boolean>(false)

  const {formatLargeNumber} = useI18n()

  useTimeout(() => setAppeared(true), 200)

  return (
    <Box sx={{overflow: 'hidden'}}>
      {(data && percents && maxPercent && maxValue) ? (
        data.map((item, i) => {
          const percentOfMax = 100 * (item.base ? percents[i] / maxPercent : item.value / maxValue)
          return (
            <TooltipWrapper percentOfBase={percents[i]} percentOfAll={base ? percents[i] : item.value / data.length} key={i} item={item}>
              <Box sx={{
                mx: 0,
                ...item.disabled ? {
                  mb: -1,
                  mt: 2,
                } : {
                  mb: (i === data.length - 1) ? 0 : 1,
                  borderBottom: i === data.length - 1 ? 'none' : t => `1px solid ${t.palette.divider}`,
                  transition: t => t.transitions.create('background'),
                  '&:hover': {
                    background: t => alpha(item.color ?? t.palette.primary.main, 0.10),
                  }
                }
              }}>
                <Box sx={{mt: .5, pt: .5, pb: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: barHeight + 'px',}}>
                  <Txt sx={{p: 0, pr: 2, flex: 1}} truncate>
                    <Txt block truncate>{item.name}</Txt>
                    {item.desc && <Txt block color="hint" truncate size="small">{item.desc}</Txt>}
                  </Txt>
                  {!item.disabled && (
                    <Box sx={{display: 'flex', textAlign: 'right',}}>
                      {!hideValue && (
                        <Txt color="hint" sx={{flex: 1, ml: 2}}>{formatLargeNumber(item.value)}</Txt>
                      )}
                      <Txt sx={{
                        flex: 1,
                        ml: 2,
                        color: t => t.palette.primary.main,
                        fontWeight: t => t.typography.fontWeightBold,
                      }}>{percents[i].toFixed(1)}%</Txt>
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
          <Icon sx={{fontSize: '3em !important'}}>block</Icon>
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
    boxShadow: theme.shadows[3],
    fontSize: 11,
  },
}))
