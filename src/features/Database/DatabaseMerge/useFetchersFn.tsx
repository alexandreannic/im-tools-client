import {useMemo, useRef} from 'react'
import {useMap} from '@alexandreannic/react-hooks-lib'

export type Func<R = any> = (...args: any[]) => R

export type Fetch<T extends Func<Promise<FetcherResult<T>>>> = (p?: {force?: boolean, clean?: boolean}, ..._: Parameters<T>) => ReturnType<T>;

export interface FetchParams {
  force?: boolean,
  clean?: boolean
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type FetcherResult<T extends Func> = ThenArg<ReturnType<T>>

// export type UseFetchers<F extends Func<Promise<FetcherResult<F>>>, K extends number | symbol | string = any, E = any> = {
//   list: FetcherResult<F>[],
//   loading: (key?: K) => boolean,
//   get: (key: K) => FetcherResult<F> | undefined,
//   error: (key: K) => E | undefined
//   fetch: Fetch<F>,
//   // setEntity: Dispatch<SetStateAction<FetcherResult<F> | undefined>>,
//   clearCache: () => void,
// };

interface BaseReturn<F extends Func<Promise<any>>> {
  fetch: Fetch<F>
  list: FetcherResult<F>[]
  clearCache: () => void
  loading: boolean
  error?: boolean
}

export interface UseFetchersMultiple<F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any> extends BaseReturn<F> {
  get: (key: K) => FetcherResult<F> | undefined,
  getLoading: (k: K) => boolean,
  getError: (k: K) => E
}

export interface UseFetchersSimple<F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any> extends BaseReturn<F> {
  get: () => FetcherResult<F> | undefined,
  getLoading: () => boolean,
  getError: () => E
}

export interface UseFetchersFn {
  <F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any>(
    fetcher: F,
    params: {
      mapError?: (_: any) => E,
      requestKey: (_: Parameters<F>) => K,
    }
  ): UseFetchersMultiple<F, K, E>

  <F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any>(
    fetcher: F,
    params?: {
      mapError?: (_: any) => E,
      requestKey?: undefined,
    }
  ): UseFetchersSimple<F, K, E>
}

const defaultKey: any = 1

/**
 * Factorize fetching logic which goal is to prevent unneeded fetchs and expose loading indicator + error status.
 */
export const useFetchers: UseFetchersFn = <F extends Func<Promise<any>>, K extends number | symbol | string = any, E = any>(
  fetcher: F,
  {
    mapError = (_: any) => _,
    requestKey = (_: any) => defaultKey,
  } = {}
) => {
  const entities = useMap<K, FetcherResult<F>>()
  const errors = useMap<K, E | undefined>()
  const loadings = useMap<K, boolean>()
  const list = useMemo(() => entities.values() ?? [], [entities])
  const fetch$ = useRef<Promise<FetcherResult<F>>>()

  const fetch = ({force = true, clean = true}: FetchParams = {}, ...args: Parameters<F>): Promise<FetcherResult<F>> => {
    const key = requestKey(args)
    const entity = entities.get(key)
    errors.delete(key)
    if (!force) {
      if (entity) {
        return Promise.resolve(entity)
      }
    }
    if (clean) {
      entities.delete(key)
    }
    loadings.set(key, true)
    fetch$.current = fetcher(...args)
    fetch$.current
      .then((x: FetcherResult<F>) => {
        entities.set(key, x)
        fetch$.current = undefined
        loadings.set(key, false)
      })
      .catch((e) => {
        errors.set(key, mapError ? mapError(e) : e)
        loadings.set(key, false)
        entities.delete(key)
        throw e
      })
    return fetch$.current
  }

  const clearCache = () => {
    entities.clear()
    errors.clear()
    loadings.clear()
  }

  console.log('errors', errors.values())
  return {
    list,
    loading: !!loadings.values().find(_ => _),
    error: errors.size > 0,
    get: (k?: K) => entities.get(k ? k : defaultKey),
    getLoading: (k?: K) => loadings.get(k ? k : defaultKey) ?? false,
    getError: (k?: K) => errors.get(k ? k : defaultKey),
    // TODO(Alex) not sure the error is legitimate
    fetch: fetch as any,
    // setEntity,
    clearCache
  }
}
