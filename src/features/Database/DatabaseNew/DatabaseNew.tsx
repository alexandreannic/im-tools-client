import {useAsync, useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {ReactElement, useEffect, useState} from 'react'
import {Modal, Txt} from 'mui-extension'
import {useI18n} from '@/core/i18n'
import {Box} from '@mui/material'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {KoboFormCreate} from '@/core/sdk/server/kobo/KoboFormSdk'
import {useAaToast} from '@/core/useToast'


export const DatabaseNew = ({
  children,
  onAdded,
}: {
  onAdded?: () => void
  children: ReactElement<any>
}) => {
  const {api} = useAppSettings()
  const _server = useFetcher(api.kobo.server.getAll)
  const _form = useFetchers(api.koboApi.getForms, {requestKey: ([serverId]) => serverId})
  const _create = useAsync(api.kobo.form.create)
  const {m, formatDate} = useI18n()
  const [selectedForm, setSelectedForm] = useState<KoboFormCreate & {uid: string} | undefined>()
  const {toastHttpError} = useAaToast()

  useEffectFn(_server.error, toastHttpError)
  // useEffectFn(_form.error, toastHttpError)
  useEffectFn(_create.getError(), toastHttpError)

  useEffect(() => {
    _server.fetch()
  }, [])

  useEffect(() => {
    if (_server.entity) {
      _server.entity.forEach(_ => _form.fetch({}, _.id))
    }
  }, [_server.entity])

  return (
    <Modal
      loading={_server.loading || _form.loading || _create.getLoading()}
      title={m.database.registerNewForm}
      confirmLabel={m.register}
      onConfirm={(event, close) => {
        if (selectedForm) {
          _create.call(selectedForm).then(onAdded)
          setSelectedForm(undefined)
          close()
        }
      }}
      content={
        <>
          {_server.entity?.map(server =>
            <Box
              key={server.id}
              sx={{
                '&:not(:last-of-type)': {
                  mb: 2,
                }
              }}
            >
              < Txt size="big" bold sx={{mb: .5}}>{server.url.replace('https://', '')}</Txt>
              <ScRadioGroup dense value={selectedForm?.uid}>
                {_form.get(server.id)?.filter(_ => _.has_deployment).map(form =>
                  <ScRadioGroupItem
                    dense
                    key={form.uid}
                    value={form.uid}
                    onClick={() => setSelectedForm({
                      name: form.name,
                      uid: form.uid,
                      serverId: server.id,
                    })}
                    title={form.name}
                    description={
                      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Box>{form.deployment__submission_count}</Box>
                        {formatDate(form.date_created)}
                      </Box>
                    }
                  />
                )}
              </ScRadioGroup>
            </Box>
          )}
        </>
      }
    >
      {children}
    </Modal>
  )
}