import {KoboFormName, KoboIndex} from '@/KoboIndex'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useEffect} from 'react'
import {useFetchers} from '@/shared/hook/useFetchers'
import {useFetcher} from '@/shared/hook/useFetcher'

export const useSchemaFetcher = ({name, autoFetch}: {name: KoboFormName | [KoboFormName], autoFetch?: boolean}) => {
  const {api} = useAppSettings()
  const {toastError} = useIpToast()
  const fetcherSchema = useFetcher(() => {
    return Promise.all([name].flat().map(_ => api.koboApi.getForm({id: KoboIndex.byName(_).id})))
      .then(res => {
        name
      })
  })
  useEffect(() => {
    if (autoFetch) fetcherSchema.fetch()
  }, [])
  useEffectFn(fetcherSchema.error, toastError)
  return fetcherSchema
}

export const useSchemaFetchers = () => {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  return useFetchers((name: KoboFormName) => {
    return api.koboApi.getForm({id: KoboIndex.byName(name).id}).catch(e => {
      toastHttpError(e)
      throw e
    })
  }, {
    requestKey: _ => _[0],
  })
}