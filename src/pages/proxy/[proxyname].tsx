import {useRouter} from 'next/router'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Page} from '@/shared/Page'
import {Fender} from 'mui-extension'
import {map} from '@alexandreannic/ts-utils'
import {Proxy} from '@/core/sdk/server/proxy/Proxy'

export default function _Component() {
  const router = useRouter()
  const proxyname = router.query.proxyname as string

  const {api} = useAppSettings()
  const request = (proxyname: string) => api.proxy.search()
    .then(res => res.find(_ => {
      return _.slug === proxyname
    }))

  const _proxy = useFetcher(request)

  const isEnabled = (p: Proxy) => !p.disabled && (!p.expireAt || p.expireAt.getTime() > new Date().getTime())

  useEffect(() => {
    if (proxyname)
      _proxy.fetch({}, proxyname)
  }, [proxyname])

  useEffect(() => {
    if (_proxy.entity && isEnabled(_proxy.entity)) window.location = _proxy.entity.url as any
  }, [_proxy.entity])

  return (
    <Page width="lg" loading={_proxy.loading}>
      {!_proxy.entity && !_proxy.loading && (
        <Fender type="error">
          Cannot open proxy <b>{router.query.proxyname}</b>
        </Fender>
      )}
      {map(_proxy.entity, p => !isEnabled(p) && (
        <Fender type="error">
          The proxy <b>{router.query.proxyname}</b> is disabled.
        </Fender>
      ))}
    </Page>
  )
}