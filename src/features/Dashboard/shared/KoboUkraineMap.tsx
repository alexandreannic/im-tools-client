import {ChartHelper} from '@/shared/chart/chartHelper'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import React, {useMemo} from 'react'
import {Seq} from '@alexandreannic/ts-utils'
import {BoxProps} from '@mui/material'
import {OblastISO} from '@/shared/UkraineMap/oblastIndex'

export const KoboUkraineMap = <D extends Record<string, any>>({
  data,
  getOblast,
  value,
  base,
  fillBaseOn = 'percent',
  ...props
}: {
  fillBaseOn?: 'percent' | 'value'
  value: (_: D) => boolean
  base: (_: D) => boolean
  getOblast: (_: D) => OblastISO
  data: Seq<D>
} & Pick<BoxProps, 'sx'>) => {
  const res = useMemo(() => {
    return ChartHelper.groupBy({
      data: data,
      groupBy: _ => getOblast(_),
      filter: value,
      filterBase: base,
    })
  }, [data, value, getOblast])
  return (
    <UkraineMap data={res} fillBaseOn={fillBaseOn} {...props}/>
  )
}