import {Theme} from '@mui/material'

export const chartConfig = {
  defaultColors: (t: Theme) => [
    t.palette.primary.main,
    t.palette.secondary.main,
    '#008a09',
    'red',
    'orange'
  ]
}