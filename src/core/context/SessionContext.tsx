import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {useAsync, useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useMsal} from '@azure/msal-react'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UserSession} from '@/core/sdk/server/session/Session'
import {mapPromise} from '@alexandreannic/ts-utils'
import {Box, ButtonBase, CircularProgress, Icon} from '@mui/material'
import {Txt} from 'mui-extension'
import {DRCLogo} from '@/shared/logo/logo'
import {useAaToast} from '@/core/useToast'

export interface SessionContext {
  session: UserSession
  logout: () => void
}

export const Context = React.createContext({} as SessionContext)

export const useSession = () => useContext(Context)

export const SessionProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const msal = useMsal()
  const {m} = useI18n()
  const {toastError} = useAaToast()
  const {api} = useAppSettings()
  const [session, setSession] = useState<UserSession | undefined | 'loading'>('loading')

  const _login = useFetcher(() => msal.instance.loginPopup({
    scopes: ['User.Read']
  }))

  const _getSession = useAsync(mapPromise({
    promise: api.session.get,
    mapThen: setSession,
  }))

  const _saveSession = useAsync(mapPromise({
    promise: api.session.login,
    mapThen: setSession,
  }))

  const logout = () => {
    api.session.logout()
    setSession(undefined)
  }

  useEffect(() => {
    _getSession.call()
  }, [])

  useEffectFn(_login.error, () => toastError(m.youDontHaveAccess))
  useEffectFn(_saveSession.getError(), () => toastError(m.youDontHaveAccess))
  useEffectFn(_getSession.getError(), () => toastError(m.youDontHaveAccess))

  return (
    <>
      {(session === 'loading' || _getSession.getLoading()) ? (
        <Box sx={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <CircularProgress/>
        </Box>
      ) : session ? (
        <Context.Provider value={{
          session,
          logout,
        }}>
          {children}
        </Context.Provider>
      ) : (
        <Box sx={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Box sx={{
            border: t => `1px solid ${t.palette.divider}`,
            padding: 4,
            borderRadius: '8px',
          }}>
            <DRCLogo sx={{margin: 'auto', display: 'block', mb: 2}}/>
            <Txt sx={{textAlign: 'center'}} size="title" block>{m.title}</Txt>
            <Txt sx={{textAlign: 'center', mb: 4}} size="big" color="hint" block>{m.subTitle}</Txt>
            <ButtonBase
              sx={{
                boxShadow: t => t.shadows[2],
                display: 'flex',
                alignItems: 'center',
                margin: 'auto',
                textAlign: 'left',
                height: 80,
                minWidth: 300,
                borderRadius: '8px',
              }}
              onClick={() => msal.instance.loginPopup({
                scopes: ['User.Read']
              }).then(_ => {
                _saveSession.call({
                  accessToken: _.accessToken,
                  name: _.account?.name ?? '',
                  username: _.account!.username,
                })
                return _
              })}
            >
              <Icon sx={{mr: 2}}>login</Icon>
              <Box>
                <Txt block size="big" bold>{m.signIn}</Txt>
                <Txt block color="hint">{m.signInDesc}</Txt>
              </Box>
            </ButtonBase>
          </Box>
        </Box>
      )}
    </>
  )
}
