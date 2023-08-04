import {useMemo, useState} from 'react'

export interface UseMap<K, V> {
  set: (k: K, v: V) => void
  has: (k: K) => boolean
  values: V[]
  keys: K[]
  clear: () => void
  delete: (k: K) => void
  size: number
  get: (k: K) => V | undefined
  reset: (arr: V[], getKey: (v: V) => K) => void
}

export const useMap2 = <K, V>(initialValue: Map<K, V> = new Map()): UseMap<K, V> => {
  const [map, setMap] = useState<Map<K, V>>(initialValue)

  return useMemo(() => ({
    reset: (arr: V[], getKey: (v: V) => K) => {
      const index: [K, V][] = arr.map(_ => [getKey(_), _])
      setMap(new Map(index))
    },
    set: (k: K, v: V): void => {
      const newMap = map.set(k, v)
      setMap(new Map(newMap))
      return map as any
    },
    has: (k: K) => map.has(k),
    values: Array.from(map.values()),
    keys: Array.from(map.keys()),
    clear: () => map.clear(),
    delete: (k: K) => {
      const exists = map.delete(k)
      setMap(new Map(map))
      return exists
    },
    size: map.size,
    get: (k: K) => map.get(k),
  }), [map])
}