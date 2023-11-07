import {KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {Dispatch, SetStateAction, useMemo} from 'react'
import {useAsync} from '@/alexlib-labo/useAsync'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAaToast} from '@/core/useToast'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {ShelterRow} from '@/features/Shelter/useShelterData'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {buildKoboSchemaHelper, getKoboTranslations} from '@/features/Database/KoboTable/useKoboSchema'
import {useI18n} from '@/core/i18n'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'

export type UseShelterActions<T extends Record<string, any>> = ReturnType<typeof useShelterActions<T>>

export const useShelterActions = <T extends Record<string, any>, >({
  formId,
  setEntity,
  schema,
  langIndex,
}: {
  langIndex: number
  schema: KoboApiForm
  formId: KoboId,
  setEntity: Dispatch<SetStateAction<KoboAnswer<any, T>>>
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()

  const helper = useMemo(() => {
    const schemaHelper = buildKoboSchemaHelper({schema, m})
    return {
      schemaHelper,
      ...getKoboTranslations({
        schema,
        langIndex,
        questionIndex: schemaHelper.questionIndex,
      })
    }
  }, [schema, langIndex])


  const asyncUpdates = useAsync(async <K extends keyof T>({
    answerIds,
    key,
    value
  }: {
    answerIds: KoboAnswerId[],
    key: K,
    value: T[K] | null
  }) => {
    await api.kobo.answer.updateTag({
      formId,
      answerIds,
      tags: {[key]: value},
    })
    const answerIdsSet = new Set(answerIds)
    setEntity((data?: KoboAnswer<any, T>[]) => data?.map(d => {
      if (answerIdsSet.has(d.id)) {
        d.tags = {...d.tags, [key]: value}
      }
      return {...d}
    }))
  })

  const asyncUpdate = useAsync(<K extends keyof T>({answerId, key, value}: {
    answerId: KoboAnswerId,
    key: K,
    value: T[K] | null
  }) => api.kobo.answer.updateTag({
    formId,
    answerIds: [answerId],
    tags: {[key]: value},
  }).then(() => {
    setEntity((data?: KoboAnswer<any, T>[]) => data?.map(d => {
      if (d.id === answerId) {
        d.tags = {...d.tags, [key]: value}
      }
      return d
    }))
  }), {
    requestKey: ([_]) => _.answerId
  })

  const asyncEdit = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(kobo.drcUa.server.prod, formId, answerId).then(_ => {
      if (_.url) window.open(_.url, '_blank')
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const [openModalAnswer] = useDatabaseKoboAnswerView<ShelterRow['ta']>(schema)

  useEffectFn(asyncUpdates.lastError, toastHttpError)
  useEffectFn(asyncUpdate.lastError, toastHttpError)
  useEffectFn(asyncEdit.lastError, toastHttpError)

  return {
    helper,
    asyncUpdate,
    asyncUpdates,
    asyncEdit,
    openModalAnswer,
  }
}
