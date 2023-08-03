import {useCallback, useMemo, useState} from 'react'

export interface UseSetState<T> {
  add: (t: T | T[]) => void
  toggle: (t: T) => void
  toggleAll: (t: T[]) => void
  delete: (t: T | T[]) => boolean
  clear: () => void
  values: Iterable<T>
  toArray: T[]
  size: number
  has: (t: T) => boolean
  reset: (values?: T[]) => void
  get: Set<T>,
}

export const useSetState2 = <T>(initialValue: T[] = []): UseSetState<T> => {
  const [set, setSet] = useState(new Set<T>(initialValue))

  const add = useCallback((t: T | T[]): void => {
    if (Array.isArray(t)) {
      const newSet = new Set([...set.values(), ...t])
      setSet(newSet)
    } else {
      set.add(t)
      const newSet = new Set(set)
      setSet(newSet)
    }
  }, [])

  const remove = useCallback((t: T | T[]): boolean => {
    const returnValue = [t].flatMap(_ => _).map(_ => set.delete(_))
    setSet(new Set(set))
    return returnValue[returnValue.length - 1]
  }, [])

  const toggle = useCallback((t: T): void => {
    set.has(t) ? remove(t) : add(t)
  }, [])

  const toggleAll = useCallback((t: T[]): void => {
    t.map(t.every(_ => set.has(_)) ? remove : add)
  }, [])

  const clear = useCallback(() => setSet(new Set()), [])

  const reset = useCallback((values: T[] = []) => setSet(new Set(values)), [])

  const has = useCallback((t: T) => set.has(t), [])

  const toArray = useMemo(() => Array.from(set.values()), [])

  const values = useMemo(() => set.values(), [])

  return useMemo(() => {
    return {
      has,
      size: set.size,
      get: set,
      toArray,
      values,
      add,
      toggle,
      toggleAll,
      reset,
      delete: remove,
      clear,
    }
  }, [set])
}
