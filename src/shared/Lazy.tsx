import {useMemo} from 'react'

export const Lazy = <T, D extends any>({
  deps,
  fn,
  children,
}: {
  deps: D[]
  fn: (_: D) => T
  children: (..._: T[]) => any
}) => {
  const res = useMemo(() => deps.map(fn), deps)
  return children(...res)
}