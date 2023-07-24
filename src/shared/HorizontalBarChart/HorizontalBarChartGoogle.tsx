import * as React from 'react'
import {ReactNode, useMemo, useState} from 'react'
import {alpha, Box, Icon, TooltipProps} from '@mui/material'
import {useTimeout} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension'
import {Enum} from '@alexandreannic/ts-utils'
import {LightTooltip, TooltipRow} from '@/shared/LightTooltip'
import {base} from 'next/dist/build/webpack/config/blocks/base'
import {toPercent} from '@/utils/utils'

export interface HorizontalBarChartGoogleData {
  label?: ReactNode
  value: number
  base?: number
  color?: string
  disabled?: boolean
  desc?: string
}

interface Props<K extends string> {
  onClickData?: (_: K, item: HorizontalBarChartGoogleData) => void
  showLastBorder?: boolean
  hideValue?: boolean
  dense?: boolean
  // base?: number
  icons?: Record<K, string>
  labels?: Record<K, ReactNode>
  descs?: Record<K, ReactNode>
  data?: Record<K, HorizontalBarChartGoogleData>
  barHeight?: number
}

export const HorizontalBarChartGoogle = <K extends string>(props: Props<K>) => {
  const {m} = useI18n()
  return props.data ? (
    <_HorizontalBarChartGoogle {...props} data={props.data!}/>
  ) : (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      color: t => t.palette.text.disabled
    }}>
      <Icon sx={{fontSize: '3em !important'}}>block</Icon>
      <Box>{m.noDataAtm}</Box>
    </Box>
  )
}

export const _HorizontalBarChartGoogle = <K extends string>({
  data,
  // base,
  icons,
  labels,
  descs,
  barHeight = 2,
  hideValue,
  onClickData,
  showLastBorder,
}: Omit<Props<K>, 'data'> & {data: NonNullable<Props<K>['data']>}) => {
  const {
    values,
    maxValue,
    sumValue,
    // base,
    percents,
  } = useMemo(() => {
    const values = Enum.values(data) as HorizontalBarChartGoogleData[]
    const maxValue = Math.max(...values.map(_ => _.value))
    const sumValue = values.reduce((sum, _) => _.value + sum, 0)
    // const base = values[0]?.base ?? sumValue
    const percents = values.map(_ => _.value / (_.base ?? sumValue) * 100)
    return {
      values,
      maxValue,
      sumValue,
      // base,
      percents,
    }
  }, [data])
  // const values: HorizontalBarChartGoogleData[] = useMemo(() => Enum.values(data), [data])
  // const maxValue = useMemo(() => Math.max(...values.map(_ => _.value)), [data])
  // const sumValue = useMemo(() => values.reduce((sum, _) => _.value + sum, 0), [data])
  // const percents = useMemo(() => values.map(_ => _.value / ((base ?? _.base) || sumValue) * 100), [data])
  const maxPercent = useMemo(() => Math.max(...percents), [percents])
  const {m} = useI18n()
  const [appeared, setAppeared] = useState<boolean>(false)
  useTimeout(() => setAppeared(true), 200)

  const {formatLargeNumber} = useI18n()

  return (
    <Box sx={{overflow: 'hidden'}}>
      {Enum.keys(data).length === 0 && (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Icon color="disabled" sx={{fontSize: 40, mb: 1}}>block</Icon>
          <Txt block color="disabled">{m.noDataAtm}</Txt>
        </Box>
      )}
      {Enum.entries(data).map(([k, item], i) => {
        const percentOfMax = 100 * (item.base ? percents[i] / maxPercent : item.value / maxValue)
        return (
          <TooltipWrapper item={item} base={item.base ?? sumValue} sumValue={sumValue} key={i}>
            <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => onClickData?.(k, item)}>
              {icons && (
                <Icon color="disabled" sx={{mr: 1}}>{icons[k]}</Icon>
              )}
              <Box sx={{flex: 1, minWidth: 0}}>
                <Box sx={{
                  mx: 0,
                  ...item.disabled ? {
                    mb: -1,
                    mt: 2,
                  } : {
                    mb: (i === values.length - 1) ? 0 : 1,
                    borderBottom: i === values.length - 1 && !showLastBorder ? 'none' : t => `1px solid ${t.palette.divider}`,
                    transition: t => t.transitions.create('background'),
                    '&:hover': {
                      background: t => alpha(item.color ?? t.palette.primary.main, 0.10),
                    }
                  }
                }}>
                  <Box sx={{mt: .5, pt: .5, pb: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: barHeight + 'px',}}>
                    <Txt sx={{p: 0, pr: .5, flex: 1}} truncate>
                      <Txt block truncate>
                        {(labels && labels[k]) ?? ''}
                        {item.label ?? k}&nbsp;
                      </Txt>
                      {(item.desc || descs) && <Txt block color="hint" truncate size="small">
                        {item.desc}
                        {(descs && descs[k]) ?? ''}
                      </Txt>}
                    </Txt>
                    {!item.disabled && (
                      <Box sx={{display: 'flex', textAlign: 'right',}}>
                        {!hideValue && (
                          <Txt color="hint" sx={{flex: 1, mr: 2,}}>{formatLargeNumber(item.value)}</Txt>
                        )}
                        <Txt sx={{
                          flex: 1,
                          minWidth: 52,
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
              </Box>
            </Box>
          </TooltipWrapper>
        )
      })}
    </Box>
  )
}

const TooltipWrapper = ({
  children,
  item,
  base,
  sumValue,
  ...props
}: Omit<TooltipProps, 'title'> & {
  base: number
  sumValue: number
  item: HorizontalBarChartGoogleData
}) => {
  const {formatLargeNumber} = useI18n()
  const {m} = useI18n()
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
          <Box sx={{mt: .5}}>
            <TooltipRow hint={<>{formatLargeNumber(item.value)} / {formatLargeNumber(base)}</>} value={toPercent(item.value / base)}/>
            {base !== sumValue && (
              <TooltipRow label={m.comparedToTotalAnswers} hint={<>{formatLargeNumber(item.value)} / {formatLargeNumber(sumValue)}</>} value={toPercent(item.value / sumValue)}/>
            )}
            {/*<TooltipRow label="% of answers" value={Math.ceil(percentOfAll) + ' %'}/>*/}
            {/*{sumValue !== percentOfBase && (*/}
            {/*  <TooltipRow label="% of peoples" value={Math.ceil(percentOfBase) + ' %'}/>*/}
            {/*)}*/}
          </Box>
        </>
      }
    >
      {children}
    </LightTooltip>
  )
}

