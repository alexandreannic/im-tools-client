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

export type UseFetcher<F extends Func<Promise<FetcherResult<F>>>, E = any> = {
  list: FetcherResult<F>[],
  loading: (key: string) => boolean | undefined,
  get: (key: string) => FetcherResult<F> | undefined,
  error: (key: string) => E | undefined
  fetch: Fetch<F>,
  // setEntity: Dispatch<SetStateAction<FetcherResult<F> | undefined>>,
  clearCache: () => void,
};

/**
 * Factorize fetching logic which goal is to prevent unneeded fetchs and expose loading indicator + error status.
 */
export const useFetchers = <F extends Func<Promise<any>>, E = any>(
  fetcher: F,
  {
    mapError = _ => _,
    requestKey,
  }: {
    mapError?: (_: any) => E
    requestKey: (_: Parameters<F>) => string,
  }
): UseFetcher<F, E> => {
  const entities = useMap<string, FetcherResult<F>>()
  const errors = useMap<string, E | undefined>()
  const loadings = useMap<string, boolean>()
  const list = useMemo(() => entities.values() ?? [], [entities])
  const fetch$ = useRef<Promise<FetcherResult<F>>>()

  const fetch = ({force = true, clean = true}: FetchParams = {}, ...args: Parameters<F>): Promise<FetcherResult<F>> => {
    const key = requestKey(args)
    const entity = entities.get(key)
    if (!force) {
      if (entity) {
        return Promise.resolve(entity)
      }
    }
    if (clean) {
      entities.delete(key)
      errors.delete(key)
    }
    loadings.set(key, true)
    fetch$.current = fetcher(...args)
    fetch$.current
      .then((x: FetcherResult<F>) => {
        entities.set(key, x)
        fetch$.current = undefined
      })
      .catch((e) => {
        errors.set(key, mapError ? mapError(e) : e)
        entities.delete(key)
        throw e
      })
      .finally(() => {

        loadings.set(key, false)
      })
    return fetch$.current
  }

  const clearCache = () => {
    entities.clear()
    errors.clear()
    loadings.clear()
  }

  return {
    list,
    loading: loadings.get,
    get: entities.get,
    error: errors.get,
    // TODO(Alex) not sure the error is legitimate
    fetch: fetch as any,
    // setEntity,
    clearCache
  }
}
