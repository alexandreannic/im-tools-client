import {Enum, map} from '@alexandreannic/ts-utils'
import {ukraineSvgPath} from './ukraineSvgPath'
import {alpha, useTheme} from '@mui/material'

// viewBox="22.138577 52.380834 40.220623 44.387017"
// width="612.47321"
// height="408.0199"
export const UkraineMapSvg = ({
  fill = {},
}: {
  fill?: Partial<Record<keyof typeof ukraineSvgPath, number>>
}) => {
  const theme = useTheme()
  return (
    <svg
      style={{border: '1px solid black'}}
      preserveAspectRatio="xMidYMin slice"
      // style={{width: '100%',}}
      viewBox="0 0 612 408"
    >
      <g stroke={theme.palette.background.paper} strokeWidth="1">
        {Enum.keys(ukraineSvgPath).map(iso =>
          <path d={ukraineSvgPath[iso].d} fill={alpha(theme.palette.primary.main, fill[iso] ?? .15)}/>
        )}
      </g>
    </svg>
  )
}
