import {KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {Dispatch, SetStateAction, useMemo} from 'react'
import {useAsync} from '@/alexlib-labo/useAsync'
import {kobo} from '@/KoboIndex'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {buildKoboSchemaHelper, getKoboTranslations} from '@/features/Database/KoboTable/useKoboSchema'
import {useI18n} from '@/core/i18n'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'

import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'

export type UseShelterActions<T extends Record<string, any>> = ReturnType<typeof useShelterActions<T>>

export const useShelterActions = <T extends Record<string, any>, >({
  form,
  formId,
  schema,
  langIndex,
  setEntity,
}: {
  form: 'nta' | 'ta'
  langIndex: number
  schema: KoboApiForm
  formId: KoboId,
  setEntity: Dispatch<SetStateAction<ShelterEntity[] | undefined>>
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError, toastHttpError} = useIpToast()

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

  const updateTag = ({answerIds, key, value}: {
    answerIds: KoboAnswerId[]
    key: any
    value: any
  }) => setEntity(prev => {
    if (!prev) return prev
    const set = new Set(answerIds)
    return prev.map(_ => {
      if (set.has(_[form]?.id ?? '!') && _[form]) {
        _[form]!.tags = {
          ...(_[form]?.tags ?? {}),
          [key]: value,
        }
      }
      return _
    })
  })

  const asyncUpdates = useAsync(async <K extends keyof T>(props: {
    answerIds: KoboAnswerId[],
    key: K,
    value: T[K] | null
  }) => {
    // updateTag(props)
    await api.kobo.answer.updateTag({
      formId,
      answerIds: props.answerIds,
      tags: {[props.key]: props.value},
    }).then(() => {
      updateTag(props)
    }).catch(() => {
      toastError(m._shelter.cannotUpdateTag(props.answerIds.length, props.key as string, props.value as string))
    })
  })

  const asyncUpdate = useAsync(<K extends keyof T>({answerId, key, value}: {
    answerId: KoboAnswerId,
    key: K,
    value: T[K] | null
  }) => {
    return api.kobo.answer.updateTag({
      formId,
      answerIds: [answerId],
      tags: {[key]: value},
    }).then(() => {
      updateTag({answerIds: [answerId], key, value,})
    }).catch(() => {
      toastError(m._shelter.cannotUpdateTag(1, key as string, value as string))
    })
  }, {
    requestKey: ([_]) => _.answerId
  })

  const asyncEdit = (answerId: KoboAnswerId) => api.koboApi.getEditUrl({formId, answerId})

  const [openModalAnswer] = useDatabaseKoboAnswerView<ShelterEntity['ta']>(schema)

  // useEffectFn(asyncUpdates.lastError, toastHttpError)
  // useEffectFn(asyncUpdate.lastError, toastHttpError)

  return {
    helper,
    asyncUpdate,
    asyncUpdates,
    asyncEdit,
    openModalAnswer,
  }
}
