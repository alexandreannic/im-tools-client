import {Enum, map} from '@alexandreannic/ts-utils'
import {ukraineSvgPath} from './ukraineSvgPath'
import {alpha, Box, BoxProps, useTheme} from '@mui/material'
import {useMemo} from 'react'
import {Oblast, OblastIndex} from './oblastIndex'
import {Txt} from 'mui-extension'

// viewBox="22.138577 52.380834 40.220623 44.387017"
// width="612.47321"
// height="408.0199"

const minAlpha = .2

export const UkraineMap = ({
  values = {},
  total,
  onSelect,
  legend,
  sx,
}: {
  legend?: string
  onSelect?: (oblast: Oblast) => void
  total?: number
  values?: Partial<Record<keyof typeof ukraineSvgPath, number>>
} & Pick<BoxProps, 'sx'>) => {
  const theme = useTheme()
  const fill = useMemo(() => {
    const max = Math.max(...Object.values(values))
    const res: Partial<Record<keyof typeof ukraineSvgPath, number>> = {}
    Enum.keys(values).forEach(k => {
      const x = (values[k] ?? 0) / max
      res[k] = (1 - minAlpha) * x + minAlpha
      return res
    })
    return res
  }, [values])

  return (
    <Box sx={sx}>
      <Box
        component="svg"
        preserveAspectRatio="xMidYMin slice"
        // style={{width: '100%',}}
        viewBox="0 0 612 408"
      >
        <g stroke={theme.palette.background.paper} strokeWidth="1">
          {Enum.keys(ukraineSvgPath).map(iso =>
            <Box
              onClick={() => {
                const o = OblastIndex.findByIso(iso)
                if (o && onSelect) {
                  onSelect(o)
                }
              }}
              component="path"
              key={iso}
              d={ukraineSvgPath[iso].d}
              fill={map(fill[iso], _ => alpha(theme.palette.primary.main, _)) ?? theme.palette.divider}
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
                  {total ? ((values[iso] ?? 0) / total * 100).toFixed(1) + ' %' : values[iso]}
                </title>
              ))}
            </Box>
          )}
        </g>
      </Box>
      {legend && <Txt block sx={{mt: -1, textAlign: 'center'}} size="small" color="hint">{legend}</Txt>}
    </Box>
  )
}
