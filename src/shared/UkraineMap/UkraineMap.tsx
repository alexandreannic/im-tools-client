import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {OblastISO, UkraineSvgPath, ukraineSvgPath} from './ukraineSvgPath'
import {alpha, Box, BoxProps, darken, useTheme} from '@mui/material'
import {useMemo} from 'react'
import {Oblast, OblastIndex} from './oblastIndex'
import {Txt} from 'mui-extension'
import {toPercent} from '../../utils/utils'

// viewBox="22.138577 52.380834 40.220623 44.387017"
// width="612.47321"
// height="408.0199"

const minAlpha = .05
const maxAlpha = .8
const medianAlpha = minAlpha + (maxAlpha - minAlpha) / 2

const computeFill = (value: number, max: number) => {
  return value > 0 ? (maxAlpha - minAlpha) * value / max + minAlpha : undefined
}

export const UkraineMap = ({
  data = {} as any,
  base,
  fillBaseOn,
  onSelect,
  legend = true,
  title,
  sx,
}: {
  legend?: boolean
  title?: string
  onSelect?: (oblast: OblastISO) => void
  base?: number
  fillBaseOn?: 'percent' | 'value'
  data?: Partial<{ [key in keyof UkraineSvgPath]: {value: number, base?: number} }>
} & Pick<BoxProps, 'sx'>) => {
  const theme = useTheme()

  const {max, min, maxPercent, minPercent} = useMemo(() => {
    const _data = Arr(Enum.values(data)).compact()
    const values = _data.map(_ => _!.value ?? 0)
    console.log('_data', _data)
    const percents = ((_data.head && _data.head.base !== undefined) || base !== undefined) ? _data.map(_ => {
      const b = (base ?? _.base) || 1
      if (!b) {
        console.error(`No base found for`, data)
        return 0
      } else {
        return (_.value ?? 0) / b
      }
    }) : undefined
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      ...percents && {
        maxPercent: Math.max(...percents),
        minPercent: Math.min(...percents),
      }
    }
  }, [data])

  const generateColor = (fill: number | undefined) => {
    if (fill) {
      if (fill < medianAlpha) {
        return alpha(theme.palette.primary.main, fill * 2)
      } else {
        return darken(theme.palette.primary.main, (fill - .5) * 2)
      }
    }
    return theme.palette.divider
  }

  return (
    <Box sx={{...sx, p: 1, position: 'relative'}}>
      <Box
        component="svg"
        preserveAspectRatio="xMidYMin slice"
        // style={{width: '100%',}}
        viewBox="0 0 612 408"
      >
        <g stroke={theme.palette.background.paper} strokeWidth="1">
          {Enum.keys(ukraineSvgPath).map(iso => {
            const res = data[iso] ? (() => {
              const value = data[iso]!.value
              const _base = base ?? data[iso]!.base
              const percent = _base ? value / _base : undefined
              const fill = (percent && fillBaseOn === 'percent' && maxPercent)
                ? computeFill(percent, maxPercent)
                : computeFill(value, max)
              return {value, base: _base, fill, percent}
            })() : undefined
            return (
              <Box
                onClick={() => {
                  onSelect?.(iso)
                }}
                component="path"
                key={iso}
                d={ukraineSvgPath[iso].d}
                fill={generateColor(res?.fill)}
                sx={{
                  transition: t => t.transitions.create('fill'),
                  '&:hover': {
                    fill: t => t.palette.primary.dark
                  }
                }}
              >
                {map(OblastIndex.findByIso(iso), _ => (
                  <title>
                    {_.name}<br/>{'\n'}
                    {res ? (
                      <>{res.value} {res.base && res.base !== 100 && '/ ' + res.base} - {toPercent(res.percent)}</>
                    ) : 0}
                  </title>
                ))}
              </Box>
            )
          })}
        </g>
      </Box>
      {legend && (
        <Box sx={{width: '25%', position: 'absolute', bottom: '15%', left: theme.spacing(),}}>
          <Box sx={{
            height: 10,
            borderRadius: '2px',
            // boxShadow: t => t.shadows[1],
            background: `linear-gradient(90deg, ${generateColor(minAlpha)} 0%, ${theme.palette.primary.main} 50%, ${generateColor(maxAlpha)} 100%)`
          }}/>
          <Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between',}}>
            {fillBaseOn === 'percent' ? (
              <><Box>{toPercent(minPercent, 0)}</Box> <Box>{toPercent(maxPercent, 0)}</Box></>
            ) : (
              <><Box>{min}</Box> <Box>{max}</Box></>
            )}
          </Txt>
        </Box>
      )}
      {title && <Txt block sx={{mt: 0, textAlign: 'center'}} size="small" color="disabled">{title}</Txt>}
    </Box>
  )
}
