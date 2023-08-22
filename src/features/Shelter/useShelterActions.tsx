import {KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {Dispatch, SetStateAction, useMemo} from 'react'
import {useAsync} from '@/alexlib-labo/useAsync'
import {kobo} from '@/koboDrcUaFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAaToast} from '@/core/useToast'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {ShelterRow} from '@/features/Shelter/useShelterData'
import {getKoboTranslations} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {buildKoboSchemaHelper} from '@/features/Database/KoboTable/useKoboSchema'
import {useI18n} from '@/core/i18n'

export type UseShelterActions<T extends Record<string, any>> = ReturnType<typeof useShelterActions<T>>

export const useShelterActions = <T extends Record<string, any>, >({
  formId,
  setEntity,
  // translateQuestion,
  // translateChoice,
  schema,
  langIndex,
}: {
  langIndex: number
  schema: KoboApiForm
  // translateQuestion: KoboTranslateQuestion,
  // translateChoice: KoboTranslateChoice
  formId: KoboId,
  setEntity: Dispatch<SetStateAction<KoboAnswer<any, T>>>
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastHttpError} = useAaToast()

  const helper = useMemo(() => {
    const schemaHelper = buildKoboSchemaHelper(schema, m)
    return {
      schemaHelper,
      ...getKoboTranslations({
        schema,
        langIndex,
        questionIndex: schemaHelper.questionIndex,
      })
    }
  }, [schema, langIndex])


  const _update = useAsync(<K extends keyof T>({answerId, key, value}: {answerId: KoboAnswerId, key: K, value: T[K] | null}) => api.kobo.answer.updateTag({
    formId,
    answerId: answerId,
    tags: {[key]: value},
  }).then(newTag => {
    setEntity((data?: KoboAnswer<any, T>[]) => data?.map(d => {
      if (d.id === answerId) {
        d.tags = newTag
      }
      return d
    }))
  }), {
    requestKey: ([_]) => _.answerId
  })

  const _edit = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(kobo.drcUa.server.prod, formId, answerId).then(_ => {
      if (_.url) window.open(_.url, '_blank')
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const [openModalAnswer] = useDatabaseKoboAnswerView<ShelterRow['ta']>({
    translateQuestion: helper.translateQuestion,
    translateChoice: helper.translateChoice,
    schema,
    langIndex: langIndex,
  })

  return {
    _helper: helper,
    _update,
    _edit,
    openModalAnswer,
  }
}
