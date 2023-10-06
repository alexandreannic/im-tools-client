import {Arr} from '@/alexlib-labo/Arr'
import {Enum} from '@alexandreannic/ts-utils'

export const groupBy: {
  <T extends Record<string, any>, A extends string, R extends any>(_: {
    data: T[],
    groups: [
      {by: ((_: T) => A), sort?: (a: A, b: A) => number}
    ],
    finalTransform: (_: _Arr<T>, groups: [A]) => R
  }): Record<A, R>

  <T extends Record<string, any>, A extends string, B extends string, R extends any>(_: {
    data: T[],
    groups: [
      {by: ((_: T) => A), sort?: (a: A, b: A) => number},
      {by: ((_: T) => B), sort?: (a: B, b: B) => number}
    ],
    finalTransform: (_: _Arr<T>, groups: [A, B]) => R
  }): Record<A, Record<B, R>>

  <T extends Record<string, any>, A extends string, B extends string, C extends string, R extends any>(_: {
    data: T[],
    groups: [
      {by: ((_: T) => A), sort?: (a: A, b: A) => number},
      {by: ((_: T) => B), sort?: (a: B, b: B) => number},
      {by: ((_: T) => C), sort?: (a: C, b: C) => number},
    ],
    finalTransform: (_: _Arr<T>, groups: [A, B, C]) => R
  }): Record<A, Record<B, Record<C, R>>>

  <T extends Record<string, any>, A extends string, B extends string, C extends string, D extends string, R extends any>(_: {
    data: T[],
    groups: [
      {by: ((_: T) => A), sort?: (a: A, b: A) => number},
      {by: ((_: T, groups: [A]) => B), sort?: (a: B, b: B) => number},
      {by: ((_: T, groups: [A, B]) => C), sort?: (a: C, b: C) => number},
      {by: ((_: T, groups: [A, B, C]) => D), sort?: (a: D, b: D) => number},
    ],
    finalTransform: (_: _Arr<T>, groups: [A, B, C, D]) => R
  }): Record<A, Record<B, Record<C, Record<D, R>>>>

  <T extends Record<string, any>, A extends string, B extends string, C extends string, D extends string, E extends string, R extends any>(_: {
    data: T[],
    groups: [
      {by: ((_: T) => A), sort?: (a: A, b: A) => number},
      {by: ((_: T) => B), sort?: (a: B, b: B) => number},
      {by: ((_: T) => C), sort?: (a: C, b: C) => number},
      {by: ((_: T) => D), sort?: (a: D, b: D) => number},
      {by: ((_: T) => E), sort?: (a: E, b: E) => number},
    ],
    finalTransform: (_: _Arr<T>, groups: [A, B, C, D, E]) => R
  }): Record<A, Record<B, Record<C, Record<D, Record<D, R>>>>>

  <T extends Record<string, any>>(_: {
    data: T[],
    groups: {by: ((_: T) => string), sort?: (a: string, b: string) => number}[],
    finalTransform: (_: _Arr<T>, groups: string[]) => any
  }): Record<string, any>
} = ({
  data,
  groups,
  finalTransform,
  collectedGroup = []
}: any) => {
  if (groups.length === 0) return finalTransform(Arr(data), collectedGroup)
  const [group, ...rest] = groups
  console.log('data', data)
  const res = Arr(data.splice(1, 200)).groupBy(_ => group.by(_, collectedGroup))
  return new Enum(res)
    .sort(([a], [b]) => group.sort ? group.sort(a, b) : a.localeCompare(b))
    .transform((k, v) => [k, groupBy({
      data: v,
      groups: rest,
      finalTransform,
      collectedGroup: [...collectedGroup, k]
    } as any)])
    .get() as Record<string, any>
}
