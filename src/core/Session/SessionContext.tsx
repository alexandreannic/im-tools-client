import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {useAsync, useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UserSession} from '@/core/sdk/server/session/Session'
import {mapPromise} from '@alexandreannic/ts-utils'
import {Box, CircularProgress} from '@mui/material'
import {useAaToast} from '@/core/useToast'
import {Access} from '@/core/sdk/server/access/Access'
import {SessionLoginForm} from '@/core/Session/SessionLoginForm'
import {SessionInitForm} from '@/core/Session/SessionInitForm'
import {CenteredContent} from '@/shared/CenteredContent'

export interface SessionContext {
  session: UserSession
  accesses: Access[]
  logout: () => void
}

export const Context = React.createContext({} as SessionContext)

export const useSession = () => useContext(Context)

export const SessionProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {m} = useI18n()
  const {toastError} = useAaToast()
  const {api} = useAppSettings()
  const [session, setSession] = useState<UserSession | undefined>()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const _access = useFetcher<any>(api.access.search)

  const _getSession = useAsync(mapPromise({
    promise: api.session.get,
    mapThen: setSession,
  }))

  const logout = () => {
    api.session.logout()
    setSession(undefined)
  }

  console.log(session)
  useEffect(() => {
    if (session?.email)
      _access.fetch({force: true, clean: true}, {email: session.email})
  }, [session?.email])

  useEffect(() => {
    _getSession.call()
    setIsInitialLoading(false)
  }, [])

  useEffectFn(_getSession.getError(), () => toastError(m.youDontHaveAccess))

  if (_getSession.getLoading() || _access.loading) {
    return (
      <CenteredContent>
        <CircularProgress/>
      </CenteredContent>
    )
  }
  if (!session || !_access.entity) {
    return (
      <CenteredContent>
        <SessionLoginForm setSession={setSession}/>
      </CenteredContent>
    )
  }
  return (
    !session.drcOffice ? (
      <CenteredContent>
        <SessionInitForm
          user={session}
          onChangeAccount={logout}
          onSelectOffice={drcOffice => setSession(prev => ({...prev, drcOffice: drcOffice}))}
        />
      </CenteredContent>
    ) : (
      <Context.Provider value={{
        session,
        accesses: _access.entity,
        logout,
      }}>
        {children}
      </Context.Provider>
    )
  )
}
