import {ChartBarMultipleBy, ChartBarMultipleByProps} from '@/shared/chart/ChartBarMultipleBy'
import {StringArrayKeys} from '@/core/type/generic'

export const ChartBarMultipleByKey = <
  D extends Record<string, any>,
  R extends string | undefined,
  O extends Record<NonNullable<R>, string>,
  K extends StringArrayKeys<D>,
>({
  property,
  by,
  ...props
}: Omit<ChartBarMultipleByProps<D, R, O>, 'by'> & {
  property: K,
  by?: (_: D[K]) => R[] | undefined,
}) => {
  return (
    <ChartBarMultipleBy
      by={_ => by ? by(_[property]) : _[property]}
      {...props}
    />
  )
}