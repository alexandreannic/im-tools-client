import {memo, useMemo} from 'react'

interface Type {
  <T, D extends any>(_: {
    deps: D[]
    fn: (_: D) => T
    children: (..._: T[]) => any
  }): any
}

export const Lazy: Type = memo(({
  deps,
  fn,
  children,
}) => {
  const res = useMemo(() => deps.map(fn), deps)
  return children(...res)
}, (prev, curr) => !!prev.deps.find(p => !!curr.deps.filter(c => c !== p)))