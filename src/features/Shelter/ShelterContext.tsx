import React, {ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {kobo} from '@/koboDrcUaFormId'
import {useI18n} from '@/core/i18n'
import {UseShelterData, useShelterData} from '@/features/Shelter/useShelterData'
import {ShelterNtaTags, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {UseShelterActions, useShelterActions} from '@/features/Shelter/useShelterActions'
import {UseAsync, useAsync} from '@/alexlib-labo/useAsync'
import {_Arr, Arr, fnSwitch} from '@alexandreannic/ts-utils'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {CfmContext} from '@/features/Cfm/CfmContext'
import {useSession} from '@/core/Session/SessionContext'
import {DrcOffice} from '@/core/drcJobTitle'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'

export interface ShelterContext {
  access: AccessSum
  refresh: UseAsync<() => Promise<void>>
  data: UseShelterData
  nta: UseShelterActions<ShelterNtaTags>
  ta: UseShelterActions<ShelterTaTags>
  langIndex: number
  fetching?: boolean
  fetchAll: () => Promise<void>
  // helper: {
  //   nta: ReturnType<typeof buildFormHelper>
  //   ta: ReturnType<typeof buildFormHelper>
  // }
}

const Context = React.createContext({} as ShelterContext)

export const useShelterContext = () => useContext<ShelterContext>(Context)

// const buildFormHelper = (schemaTa: KoboApiForm, langIndex: number, m: Messages) => {
//   const schemaHelper = buildKoboSchemaHelper(schemaTa, m)
//   return {
//     schemaHelper,
//     translate: getKoboTranslations({
//       schema: schemaTa,
//       langIndex,
//       questionIndex: schemaHelper.questionIndex,
//     })
//   }
// }

// const shelterToOffice = (_?: Shelter_NTA['back_office']) => fnSwitch(_!, {
//   cej: DrcOffice.Chernihiv,
//   dnk: DrcOffice.Dnipro,
//   hrk: DrcOffice.Kharkiv,
//   nlv: DrcOffice.Mykolaiv,
//   umy: DrcOffice.Sumy,
// }, () => undefined)

export const ShelterProvider = ({
  schemaTa,
  schemaNta,
  children,
}: {
  schemaTa: KoboApiForm,
  schemaNta: KoboApiForm,
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const [langIndex, setLangIndex] = useState<number>(0)
  const {m} = useI18n()
  const {session, accesses} = useSession()

  const {access, allowedOffices} = useMemo(() => {
    const cfmAccesses = Arr(accesses).filter(Access.filterByFeature(AppFeatureId.kobo_database))
    const allowedOffices = cfmAccesses.flatMap(_ => {
      return _.params?.filters?.back_office as Shelter_NTA['back_office'][] | undefined
    }).compact()
    return {
      access: Access.toSum(cfmAccesses, session.admin),
      allowedOffices,
    }
  }, [session, accesses])

  const _data = useShelterData(allowedOffices)

  const _ntaActions = useShelterActions<ShelterNtaTags>({
    formId: kobo.drcUa.form.shelterNTA,
    setEntity: _data._fetchNta.setEntity,
    schema: schemaNta,
    langIndex,
  })
  const _taActions = useShelterActions<ShelterTaTags>({
    formId: kobo.drcUa.form.shelterTA,
    setEntity: _data._fetchTa.setEntity,
    schema: schemaTa,
    langIndex,
  })

  const fetchAll = useCallback(async () => {
    await Promise.all([
      _data._fetchNta.fetch({force: true, clean: false}),
      _data._fetchTa.fetch({force: true, clean: false}),
    ])
  }, [])

  const fetching = _data._fetchTa.loading || _data._fetchNta.loading

  const _refresh = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.shelterTA),
      api.koboApi.synchronizeAnswers(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA),
    ])
    await fetchAll()
  })

  // const _updateNta = useAsync(<K extends keyof ShelterNtaTags>({answerId, key, value}: {answerId: KoboAnswerId, key: K, value: ShelterNtaTags[K]}) => api.kobo.answer.updateTag({
  //   formId: kobo.drcUa.form.shelterNTA,
  //   answerId: answerId,
  //   tags: {[key]: value},
  // }).then(newTag => {
  //   _data._fetchNta.setEntity(data => data?.map(d => {
  //     if (d.id === answerId) {
  //       d.tags = newTag
  //     }
  //     return d
  //   }))
  // }), {
  //   requestKey: ([_]) => _.answerId
  // })
  //
  // const _updateTa = useAsync(<K extends keyof ShelterTaTags>({answerId, key, value}: {answerId: KoboAnswerId, key: K, value: ShelterTaTags[K]}) => api.kobo.answer.updateTag({
  //   formId: kobo.drcUa.form.shelterNTA,
  //   answerId: answerId,
  //   tags: {[key]: value},
  // }).then(newTag => {
  //   _data._fetchTa.setEntity(data => data?.map(d => {
  //     if (d.id === answerId) {
  //       d.tags = newTag
  //     }
  //     return d
  //   }))
  // }), {
  //   requestKey: ([_]) => _.answerId
  // })

  // const _updateTag = useAsync(api.kobo.answer.updateTag)

  return (
    <Context.Provider value={{
      access,
      data: _data,
      fetching,
      refresh: _refresh,
      nta: _ntaActions,
      ta: _taActions,
      fetchAll,
      langIndex,
      // helper: {ta, nta},
    }}>
      {children}
    </Context.Provider>
  )
}