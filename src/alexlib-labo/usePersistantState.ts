import {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react'
import {generateId} from 'react-persistent-state/build/utils/hash'

// export function usePersistentState<S>(initialState: S | (() => S), key?: string): [S, Dispatch<SetStateAction<S>>, () => void] {
//   const localStorage = useMemo(() => new LocalStorageEntity<S>(generateId(key)), [])
//   const [state, setState] = useState<S>((typeof window === 'undefined' ? localStorage.load() : undefined) ?? initialState)
//   const throttled = useRef(throttle(localStorage.save, 1000))
//   useEffect(() => {
//     throttled.current(state)
//   }, [state])
//
//   const callback = useCallback(() => {
//     localStorage.clear()
//     setState(initialState)
//   }, [initialState])
//
//   return [
//     state,
//     setState,
//     callback,
//   ]
// }

export const usePersistentState = <S>(initialState: S | (() => S), key: string = generateId()): [S, Dispatch<SetStateAction<S>>, () => void] => {
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage

  const getInitialValue = (): S | (() => S) => {
    if (!isLocalStorageAvailable) return initialState
    const storedValue = localStorage.getItem(key)
    if (storedValue) {
      try {
        return JSON.parse(storedValue)
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error)
      }
    }
    return initialState
  }

  const [state, setState] = useState<S>(getInitialValue())

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  const clear = useCallback(() => {
    localStorage.clear()
    setState(initialState)
  }, [initialState])

  return [state, setState, clear]
}