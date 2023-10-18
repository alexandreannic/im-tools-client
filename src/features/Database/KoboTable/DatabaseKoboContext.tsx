import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {UseAsync, useAsync} from '@/alexlib-labo/useAsync'
import {Kobo, KoboAnswer, KoboAnswerId, KoboForm, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {UUID} from '@/core/type'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher} from '@alexandreannic/react-hooks-lib'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useAaToast} from '@/core/useToast'
import {KeyOf} from '@/utils/utils'
import {useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'

export interface DatabaseKoboContext {
  fetcherAnswers: UseFetcher<() => ReturnType<ApiSdk['kobo']['answer']['searchByAccess']>>
  serverId: UUID
  canEdit?: boolean
  form: KoboForm
  asyncRefresh: UseAsync<() => Promise<void>>
  asyncEdit: (answerId: KoboAnswerId) => string
  asyncUpdateTag: UseAsync<(_: {
    answerIds: KoboAnswerId[],
    key: KeyOf<any>,
    value: any
  }) => Promise<void>>
  data: KoboMappedAnswer[]
}

const Context = React.createContext({} as DatabaseKoboContext)

export const useDatabaseKoboTableContext = () => useContext<DatabaseKoboContext>(Context)

export const DatabaseKoboTableProvider = (props: {
  children: ReactNode
  fetcherAnswers: DatabaseKoboContext['fetcherAnswers']
  serverId: DatabaseKoboContext['serverId']
  canEdit: DatabaseKoboContext['canEdit']
  form: DatabaseKoboContext['form']
  data: KoboAnswer[]
}) => {
  const ctxSchema = useKoboSchemaContext()
  const {
    form,
    data,
    serverId,
    children,
    fetcherAnswers,
  } = props
  const {api, conf} = useAppSettings()

  const asyncRefresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(serverId, form.id)
    await fetcherAnswers.fetch({force: true, clean: false})
  })

  const asyncEdit = (answerId: KoboAnswerId) => `${conf.apiURL}/kobo-api/${serverId}/${form.id}/${answerId}/edit-url`
  // const asyncEdit = useAsync(async (answerId: KoboAnswerId) => {
  //   return api.koboApi.getEditUrl(serverId, form.id, answerId).then(_ => {
  //     if (_.url) {
  //       window.open(_.url, '_blank')
  //     }
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})


  const [mappedData, setMappedData] = useState<KoboMappedAnswer[]>([])

  useEffect(() => setMappedData(data.map(_ => Kobo.mapAnswerBySchema(ctxSchema.schemaHelper.questionIndex, _))), [data])

  const asyncUpdateTag = useAsync(async ({
    answerIds,
    key,
    value
  }: {
    answerIds: KoboAnswerId[],
    key: KeyOf<any>,
    value: any,
  }) => {
    const index = new Set(answerIds)
    setMappedData(prev => {
      return prev?.map(_ => {
        if (index.has(_.id)) _.tags = {..._.tags, [key]: value}
        return _
      })
    })
    await api.kobo.answer.updateTag({
      formId: form.id,
      answerIds: answerIds,
      tags: {[key]: value}
    })
  })

  return (
    <Context.Provider value={{
      ...props,
      asyncRefresh,
      asyncEdit,
      asyncUpdateTag,
      data: mappedData,
    }}>
      {children}
    </Context.Provider>
  )
}
