import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {DrcOffice} from '@/core/drcJobTitle'
import {Enum, map} from '@alexandreannic/ts-utils'
import {UserSession} from '@/core/sdk/server/session/Session'
import {Txt} from 'mui-extension'
import {useI18n} from '@/core/i18n'
import {Box} from '@mui/material'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useEffect, useState} from 'react'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAaToast} from '@/core/useToast'
import {Modal} from 'mui-extension/lib/Modal'

export const SessionInitForm = ({
  user,
  onSelectOffice,
  onChangeAccount,
}: {
  user: UserSession
  onChangeAccount: () => void
  onSelectOffice: (_: DrcOffice) => void
}) => {
  const {api, conf} = useAppSettings()
  const [drcOffice, setDrcOffice] = useState<DrcOffice | undefined>()
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()

  const _updateUser = useFetcher(api.user.update)
  useEffectFn(_updateUser.error, toastHttpError)

  useEffect(() => {
    map(_updateUser.entity?.drcOffice, _ => onSelectOffice(_ as DrcOffice))
  }, [_updateUser.entity])

  return (
    <Box sx={{p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Box sx={{width: '100%', maxWidth: 400}}>
        <AaBtn icon="arrow_back" color="primary" onClick={onChangeAccount}>{m.changeAccount}</AaBtn>
      </Box>
      <Box sx={{
        mb: 4,
        mt: 2,
        textAlign: 'center',
      }}>
        <Txt block noWrap sx={{fontSize: '3em', fontWeight: 'lighter'}} bold>{user.name}</Txt>
        <Txt block noWrap sx={{fontSize: '1.4em', fontWeight: 'lighter'}} color="hint">{user.drcJob}</Txt>
      </Box>
      <Box sx={{width: '100%', maxWidth: 400}}>
        <Txt block sx={{fontSize: '1.2em', mb: 1}}>{m.welcomePleaseSelectOffice}</Txt>
        <ScRadioGroup onChange={setDrcOffice}>
          {Enum.keys(DrcOffice).map(k =>
            <ScRadioGroupItem key={k} value={k} title={k}/>
          )}
        </ScRadioGroup>
        <Modal
          title={m.confirmYourOffice(drcOffice!)}
          content={m.itCannotBeChanged(conf.contact)}
          onConfirm={() => _updateUser.fetch({}, {drcOffice: drcOffice})}
          loading={_updateUser.loading}
        >
          <AaBtn
            icon="arrow_forward"
            disabled={!drcOffice}
            variant="contained"
            sx={{mt: 2}}
          >
            {m.select}
          </AaBtn>
        </Modal>
      </Box>
    </Box>
  )
}