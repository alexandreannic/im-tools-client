import * as React from 'react'
import {ReactNode, useMemo, useState} from 'react'
import {alpha, Box, styled, Tooltip} from '@mui/material'
import {useTimeout} from '@alexandreannic/react-hooks-lib'
import {mapFor} from '@alexandreannic/ts-utils'
import {makeSx, Txt} from 'mui-extension'
import {useI18n} from '../../core/i18n'

export interface HorizontalBarChartData {
  label: ReactNode
  value: number
  color?: string
  disabled?: boolean
}

interface Props {
  data?: HorizontalBarChartData[]
  grid?: boolean
  labelWidth?: number
  barHeight?: number
}

const sx = makeSx({
  item: {
    display: 'flex',
    mx: 0,
  },
  label: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    p: 0,
    pr: 2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

export const HorizontalBarChart = ({
  data,
  grid,
  labelWidth = 200,
  barHeight = 5
}: Props) => {
  const {m} = useI18n()
  const maxValue = useMemo(() => data && Math.max(...data.map(_ => _.value)), [data])
  const sumValue = useMemo(() => data && data.reduce((sum, _) => _.value + sum, 0), [data])
  const [appeared, setAppeared] = useState<boolean>(false)
  const gridAxis = 4
  const {formatLargeNumber} = useI18n()
  useTimeout(() => setAppeared(true), 0)

  return (
    <Box
      sx={{
        overflow: 'hidden',
      }}
    >
      {data && maxValue && sumValue ? (
        data.map((item, i) => {
          const percentOfMax = (item.value / maxValue) * 100
          const percentOfAll = (item.value / sumValue) * 100
          return (
            <Box key={i} sx={sx.item}>
              <Box sx={sx.label} style={{width: labelWidth, minWidth: labelWidth}}>
                <Box>{item.label}</Box>
                
                <Box sx={{display: 'flex', marginLeft: 'auto'}}>
                  <Txt color="hint" sx={{mr: 2}}>{percentOfMax.toFixed(1)}%</Txt>
                  <Box sx={{
                    color: t => t.palette.primary.main,
                    fontWeight: t => t.typography.fontWeightBold,
                  }}>{formatLargeNumber(item.value)}</Box>
                </Box>
              </Box>
              <LightTooltip
                open={item.disabled ? false : undefined}
                title={
                  <>
                    <Txt size="big" block bold>
                      {item.label}
                    </Txt>
                    <div>
                      <Txt size="title" color="primary" block>
                        {formatLargeNumber(item.value)}
                      </Txt>
                      <Txt size="big" color="hint" block>
                        {Math.ceil(percentOfAll)}%
                      </Txt>
                    </div>
                  </>
                }
              >
                <Box
                  sx={{
                    py: 0.25,
                    px: 0,
                    flex: 1,
                    ...item.disabled ? {} : {
                      transition: t => t.transitions.create('background'),
                      '&:hover': {
                        background: t => alpha(t.palette.primary.main, 0.1),
                      },
                    }
                  }}
                >
                  <Box
                    sx={{
                      transition: t => t.transitions.create('width', {duration: 1000}),
                      width: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      minHeight: 24,
                      borderBottom: t => `${barHeight}px solid ${t.palette.primary.main}`,
                    }}
                    style={{width: appeared ? `calc(${percentOfMax * 0.9}%)` : 0, color: item.color, borderColor: item.color}}
                  />
                </Box>
              </LightTooltip>
            </Box>
          )
        })
      ) : (
        <Box sx={sx.label}> {m.noDataAtm} </Box>
      )}
      {grid && data && data.length > 0 && (
        <Box sx={sx.item}>
          <Box sx={sx.label} style={{width: labelWidth, minWidth: labelWidth}}/>
          <div style={{position: 'relative', width: '100%'}}>
            {mapFor(gridAxis + 1, i => (
              <Box
                key={i}
                sx={{
                  width: '1px',
                  height: 1000,
                  borderRight: t => `1px dashed ${t.palette.divider}`,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: `calc(${i * (100 / gridAxis)}% - 1px)`,
                }}
              />
            ))}
          </div>
        </Box>
      )}
    </Box>
  )
}


const ToBeStyledTooltip = ({className, ...props}: any) => (
  <Tooltip {...props} classes={{tooltip: className}}/>
)

const LightTooltip = styled(ToBeStyledTooltip)(({theme}) => ({
  backgroundColor: theme.palette.common.white,
  color: 'rgba(0, 0, 0, 0.87)',
  boxShadow: theme.shadows[1],
  fontSize: 11,
}))

// const LightTooltip = styled(({className, ...props}: any) => (
//   <Tooltip {...props} componentsProps={{tooltip: {className: className}}}/>
// ))(t => ({
//   backgroundColor: t.palette.common.white,
//   color: 'rgba(0, 0, 0, 0.87)',
//   boxShadow: t.shadows[1],
//   fontSize: 11,
// }))

// const LightTooltip = styled(Tooltip)((t: Theme) => ({
//   backgroundColor: t.palette.common.white,
//   color: 'rgba(0, 0, 0, 0.87)',
//   boxShadow: t.shadows[1],
//   fontSize: 11,
// }))
