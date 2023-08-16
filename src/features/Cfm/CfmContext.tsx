import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {UseKoboSchema, useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {getKoboTranslations} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {UseAsync, useAsync} from '@/alexlib-labo/useAsync'
import {KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {CfmDataFilters} from '@/features/Cfm/Data/CfmTable'
import {KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {MealCfmInternal} from '@/core/koboModel/MealCfmInternal/MealCfmInternal'
import {MealCfmExternal} from '@/core/koboModel/MealCfmExternal/MealCfmExternal'

export enum CfmDataSource {
  Internal = 'Internal',
  External = 'External',
}

export type CfmData = {
  formId: KoboId
  tags?: KoboMealCfmTag
  form: CfmDataSource
  internal?: Pick<MealCfmInternal, 'feedback' | 'existing_beneficiary' | 'feedback_type' | 'project_code'>
  external?: Pick<MealCfmExternal, 'prot_support' | 'thanks_feedback' | 'complaint' | 'consent' | 'feedback_type'>
} & Pick<KoboAnswer<MealCfmInternal>,
  'id' |
  'start' |
  'date' |
  'end' |
  'submissionTime' |
  'existing_beneficiary' |
  'name' |
  'gender' |
  'phone' |
  'email' |
  'ben_det_oblast' |
  'ben_det_raion' |
  'ben_det_hromada'
>

export interface CfmContext {
  schemaInternal: UseKoboSchema,
  schemaExternal: UseKoboSchema,
  translateExternal: ReturnType<typeof getKoboTranslations>,
  translateInternal: ReturnType<typeof getKoboTranslations>,
  updateTag: UseAsync<(_: {formId: KoboId, answerId: KoboAnswerId, key: string, value: any}) => Promise<Record<string, any>>>
  data: UseFetcher<() => Promise<CfmData[]>>
}

const CfmContext = React.createContext({} as CfmContext)

export const useCfmContext = () => useContext<CfmContext>(CfmContext)

export const cfmMakeUpdateRequestKey = (form: KoboId, answerId: KoboAnswerId, key: string) => form + answerId + key

export const CfmProvider = ({
  children,
  schemas,
  langIndex = 0,
}: {
  langIndex?: number
  schemas: {
    internal: KoboApiForm,
    external: KoboApiForm,
  }
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const schemaInternal = useKoboSchema({schema: schemas.internal})
  const schemaExternal = useKoboSchema({schema: schemas.external})
  const translateExternal = useMemo(() => getKoboTranslations({
    schema: schemas.external,
    langIndex,
    questionIndex: schemaExternal.questionIndex,
  }), [schemas.external, langIndex])

  const translateInternal = useMemo(() => getKoboTranslations({
    schema: schemas.internal,
    langIndex,
    questionIndex: schemaInternal.questionIndex,
  }), [schemas.internal, langIndex])

  const updateTag = useAsync((_: {formId: KoboId, answerId: KoboAnswerId, key: string, value: any}) => api.kobo.answer.updateTag({
    formId: _.formId,
    answerId: _.answerId,
    tags: {[_.key]: _.value}
  }), {
    requestKey: ([_]) => cfmMakeUpdateRequestKey(_.formId, _.answerId, _.key)
  })

  const data = useFetcher(async (filters?: CfmDataFilters) => {
    const res: CfmData[] = []
    const [external, internal] = await Promise.all([
      api.kobo.answer.searchMealCfmExternal(filters),
      api.kobo.answer.searchMealCfmInternal(filters),
    ])
    external.data.forEach(_ => {
      res.push({
        formId: kobo.drcUa.form.cfmExternal,
        form: CfmDataSource.External,
        external: _,
        ..._,
      })
    })
    internal.data.forEach(_ => {
      res.push({
        formId: kobo.drcUa.form.cfmInternal,
        form: CfmDataSource.Internal,
        internal: _,
        ..._,
      })
    })
    return res.sort((b, a) => (a.date ?? a.submissionTime).getTime() - (b.date ?? b.submissionTime).getTime())
  })

  useEffect(() => {
    data.fetch()
  }, [])

  return (
    <CfmContext.Provider value={{
      schemaInternal,
      schemaExternal,
      translateExternal,
      translateInternal,
      updateTag,
      data,
    }}>
      {children}
    </CfmContext.Provider>
  )
}
