import {Func} from '@alexandreannic/react-hooks-lib'
import {UseMap2, useMap2} from '@/alexlib-labo/useMap'

export interface UseAsync<F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any> {
  isLoading: boolean
  loading: UseMap2<K, boolean>,
  errors: UseMap2<K, E>
  call: F,
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

  const call = (...args: Parameters<F>) => {
    loading.set(requestKey(args), true)
    return caller(...args)
      .then(_ => {
        loading.delete(requestKey(args))
        return _
      })
      .catch((e: E) => {
        loading.delete(requestKey(args))
        errors.set(requestKey(args), mapError(e))
        throw e
      })
  }

  const isLoading = loading.keys.length > 0

  return {
    isLoading,
    loading,
    errors,
    call,
  } as any
}

