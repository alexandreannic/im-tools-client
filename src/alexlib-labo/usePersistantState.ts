import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from 'react'
import {LocalStorageEntity} from 'react-persistent-state/build/utils/localStorageApi'
import {generateId} from 'react-persistent-state/build/utils/hash'
import throttle from 'lodash/throttle'

export function usePersistentState<S>(initialState: S | (() => S), key?: string): [S, Dispatch<SetStateAction<S>>, () => void] {
  const localStorage = useMemo(() => new LocalStorageEntity<S>(generateId(key)), [])
  const [state, setState] = useState<S>(initialState)
  useEffect(() => {
    const loaded = localStorage.load()
    if (loaded)
      setState(localStorage.load())
  }, [])
  const throttled = useRef(throttle(localStorage.save, 1000))
  useEffect(() => throttled.current(state), [state])

  return [
    state,
    setState,
    () => {
      localStorage.clear()
      setState(initialState)
    }
  ]
}