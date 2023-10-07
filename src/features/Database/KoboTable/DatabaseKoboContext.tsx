import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {UseAsync, useAsync} from '@/alexlib-labo/useAsync'
import {Kobo, KoboAnswer, KoboAnswerId, KoboForm, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {UUID} from '@/core/type'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher} from '@alexandreannic/react-hooks-lib'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useAaToast} from '@/core/useToast'
import {getKoboTranslations, UseKoboSchema, useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {KoboTranslateChoice, KoboTranslateQuestion} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {KeyOf} from '@/utils/utils'

export interface DatabaseKoboContext {
  fetcherAnswers: UseFetcher<() => ReturnType<ApiSdk['kobo']['answer']['searchByAccess']>>
  serverId: UUID
  schemaHelper: UseKoboSchema
  canEdit?: boolean
  form: KoboForm
  asyncRefresh: UseAsync<() => Promise<void>>
  asyncEdit: UseAsync<(answerId: KoboAnswerId) => Promise<void>>
  asyncUpdateTag: UseAsync<(_: {answerIds: KoboAnswerId[], key: KeyOf<any>, value: any}) => Promise<void>>
  data: KoboMappedAnswer[]
  schema: KoboApiForm
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
  translate: {
    question: KoboTranslateQuestion
    choice: KoboTranslateChoice
  }
}

const Context = React.createContext({} as DatabaseKoboContext)

export const useDatabaseKoboTableContext = () => useContext<DatabaseKoboContext>(Context)

export const DatabaseKoboTableProvider = (props: {
  children: ReactNode
  schema: DatabaseKoboContext['schema']
  fetcherAnswers: DatabaseKoboContext['fetcherAnswers']
  serverId: DatabaseKoboContext['serverId']
  canEdit: DatabaseKoboContext['canEdit']
  form: DatabaseKoboContext['form']
  data: KoboAnswer[]
}) => {
  const {
    schema,
    form,
    data,
    serverId,
    children,
    fetcherAnswers,
  } = props
  const {api} = useAppSettings()
  const {toastHttpError, toastLoading} = useAaToast()

  const [langIndex, setLangIndex] = useState<number>(0)

  const asyncRefresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(serverId, form.id)
    await fetcherAnswers.fetch({force: true, clean: false})
  })

  const asyncEdit = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(serverId, form.id, answerId).then(_ => {
      if (_.url) {
        window.open(_.url, '_blank')
      }
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const schemaHelper = useKoboSchema({schema: schema})

  const {translateQuestion, translateChoice} = useMemo(() => getKoboTranslations({
    schema: schema,
    langIndex,
    questionIndex: schemaHelper.questionIndex,
  }), [schema, langIndex])


  const [mappedData, setMappedData] = useState<KoboMappedAnswer[]>(data)

  useEffect(() => setMappedData(data.map(_ => Kobo.mapAnswerBySchema(schemaHelper.questionIndex, _))), [data])

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
      schemaHelper,
      langIndex,
      setLangIndex,
      translate: {
        question: translateQuestion,
        choice: translateChoice
      }
    }}>
      {children}
    </Context.Provider>
  )
}
