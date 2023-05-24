import {useMemo} from 'react'

export const Lazy = <T, >({
  deps,
  fn,
  children,
}: {
  deps: any[]
  fn: () => T
  children: (t: T) => any
}) => {
  const res = useMemo(fn, deps)
  return children(res)
}