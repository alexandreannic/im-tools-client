import {ChartTools} from '../../../core/chartTools'
import {format} from 'date-fns'
import {ScLineChart, ScLineChartProps} from '@/shared/Chart/ScLineChart'
import {_Arr} from '@alexandreannic/ts-utils'
import React, {useMemo} from 'react'

export type DateKeys<T> = {
  [K in keyof T]: T[K] extends (Date | undefined) ? K : never;
}[keyof T]

export const KoboLineChartDate = <T, K extends DateKeys<T>>({
  data,
  question,
  label,
  end = new Date(),
}: {
  label?: string | string[]
  question: K | K[]
  data: _Arr<T>
  end?: Date
}) => {
  const curve: ScLineChartProps['curves'] = useMemo(() => {
    const labels = [label].flat()
    return ([question].flat() as K[]).map((q, i) => {
      return {
        label: labels[i] ?? '',
        key: q as string,
        curve: ChartTools.groupByDate({
          data: data
            .map(_ => _[q])
            .compact()
            .map(_ => format(_ as Date, 'yyyy-MM-dd'))
            .filter(_ => _ > '2021-11' && _ < format(end, 'yyyy-MM'))
            .sort(),
          getDate: _ => _.replace(/-\d{2}$/, ''),
        })
      }
    })
  }, [])

  return (
    <>
      <ScLineChart height={220} curves={curve}/>
      {/*<Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>*/}
      {/*{map(curve.head, start => <Box>{start.label}</Box>)}*/}
      {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
      {/*</Txt>*/}
    </>
  )
}