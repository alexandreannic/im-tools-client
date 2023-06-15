import {ChartTools} from '../../../core/chartTools'
import {UkraineMap} from '../../../shared/UkraineMap/UkraineMap'
import React, {useMemo} from 'react'
import {_Arr} from '@alexandreannic/ts-utils'
import {OblastISOSVG} from '../../../shared/UkraineMap/ukraineSvgPath'
import {BoxProps} from '@mui/material'

export const KoboUkraineMap = <D extends Record<string, any>>({
  data,
  getOblast,
  value,
  base,
  ...props
}: {
  value: (_: D) => boolean
  base: (_: D) => boolean
  getOblast: (_: D) => OblastISOSVG
  data: _Arr<D>
} & Pick<BoxProps, 'sx'>) => {
  const res = useMemo(() => {
    return ChartTools.groupBy({
      data: data,
      groupBy: _ => getOblast(_),
      filter: value,
      filterBase: base,
    })
  }, [data, value, getOblast])
  return (
    <UkraineMap data={res} fillBaseOn="percent" {...props}/>
  )
}