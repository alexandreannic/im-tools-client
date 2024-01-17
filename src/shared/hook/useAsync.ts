import {Func} from '@alexandreannic/react-hooks-lib'
import {UseMap2, useMap2} from '@/shared/hook/useMap'
import {useState} from 'react'

export interface UseAsync<F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any> {
  anyLoading: boolean
  lastError?: E
  loading: UseMap2<K, boolean>,
  errors: UseMap2<K, E>
  call: F,
  callIndex: number
}

export interface UseAsyncFn {
  <F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any>(
    caller: F,
    params: {
      mapError?: (_: any) => E,
      requestKey: (_: Parameters<F>) => K,
    }
  ): UseAsync<F, K, E>
  <F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any>(
    caller: F,
    params?: {
      mapError?: (_: any) => E,
      requestKey?: undefined,
    }
  ): UseAsync<F, K, E>
}

const defaultKey: any = 1

/**
 * Factorize async by exposing loading indicator and error status.
 */
export const useAsync: UseAsyncFn = <F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any>(
  caller: F,
  {
    mapError = _ => _,
    requestKey = () => defaultKey
  }: {
    mapError?: (_: any) => E,
    requestKey?: (_: Parameters<F>) => K,
  } = {} as any
) => {
  const loading = useMap2<K, boolean>()
  const errors = useMap2<K, E>()
  const [callIndex, setCallIndex] = useState(0)
  const [lastError, setLastError] = useState<E | undefined>()

  const call = (...args: Parameters<F>) => {
    setLastError(undefined)
    loading.set(requestKey(args), true)
    return caller(...args)
      .then(_ => {
        loading.delete(requestKey(args))
        setCallIndex(_ => _ + 1)
        return _
      })
      .catch((e: E) => {
        setCallIndex(_ => _ + 1)
        setLastError(e)
        loading.delete(requestKey(args))
        errors.set(requestKey(args), mapError(e))
        throw e
      })
  }

  const isLoading = loading.keys.length > 0

  return {
    callIndex,
    lastError,
    isLoading,
    loading,
    errors,
    call,
  } as any
}

