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
import {CfmDataPriority, CfmDataProgram, CfmDataSource, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {MealCfmInternal} from '@/core/koboModel/MealCfmInternal/MealCfmInternal'
import {MealCfmExternal} from '@/core/koboModel/MealCfmExternal/MealCfmExternal'
import {Arr, Enum} from '@alexandreannic/ts-utils'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {DrcOffice} from '@/core/drcJobTitle'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

const formIdMapping: Record<string, CfmDataSource> = {
  [kobo.drcUa.form.cfmExternal]: CfmDataSource.External,
  [kobo.drcUa.form.cfmInternal]: CfmDataSource.Internal,
}

export type CfmData = {
  priority?: CfmDataPriority
  formId: KoboId
  tags?: KoboMealCfmTag
  form: CfmDataSource
  feedback?: string
  category?: MealCfmInternal['feedback_type']
  external_prot_support?: MealCfmExternal['prot_support']
  internal_existing_beneficiary?: MealCfmInternal['existing_beneficiary']
  internal_project_code?: MealCfmInternal['project_code']
  // external_thanks_feedback?: MealCfmExternal['thanks_feedback']
  // external_complaint?: MealCfmExternal['complaint']
  external_consent?: MealCfmExternal['consent']
  external_feedback_type?: MealCfmExternal['feedback_type']
  // internal_feedback?: MealCfmInternal['feedback']
  // internal?: Pick<MealCfmInternal, 'feedback' | 'existing_beneficiary' | 'project_code'>
  // external?: Pick<MealCfmExternal, 'prot_support' | 'thanks_feedback' | 'complaint' | 'consent' | 'feedback_type'>
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
  authorizations: {
    sum: AccessSum,
    accessibleOffices?: DrcOffice[]
    accessiblePrograms?: CfmDataProgram[]
    // seeHisOwn: boolean
  }
  schemaInternal: UseKoboSchema,
  schemaExternal: UseKoboSchema,
  translateExternal: ReturnType<typeof getKoboTranslations>,
  translateInternal: ReturnType<typeof getKoboTranslations>,
  updateTag: UseAsync<(_: {formId: KoboId, answerId: KoboAnswerId, key: string, value: any}) => Promise<Record<string, any>>>
  users: UseFetcher<ApiSdk['user']['search']>
  data: UseFetcher<() => Promise<{
    [CfmDataSource.Internal]: KoboAnswer<MealCfmInternal, KoboMealCfmTag>[]
    [CfmDataSource.External]: KoboAnswer<MealCfmExternal, KoboMealCfmTag>[]
  }>>
  mappedData: CfmData[]
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
  const {session, accesses} = useSession()
  const {api} = useAppSettings()
  const schemaInternal = useKoboSchema({schema: schemas.internal})
  const schemaExternal = useKoboSchema({schema: schemas.external})
  const translateExternal = useMemo(() => getKoboTranslations({
    schema: schemas.external,
    langIndex,
    questionIndex: schemaExternal.questionIndex,
  }), [schemas.external, langIndex])

  const users = useFetcher(() => api.user.search())

  const authorizations: CfmContext['authorizations'] = useMemo(() => {
    const cfmAccesses = Arr(accesses).filter(Access.filterByFeature(AppFeatureId.cfm))
    const sum = Access.toSum(cfmAccesses, session.admin)
    const accessibleOffices = cfmAccesses.map(_ => _.params).flatMap(_ => _?.office).compact().get
    const accessiblePrograms = cfmAccesses.map(_ => _.params).flatMap(_ => _?.program).compact().get
    // const seeHisOwn = !!cfmAccesses.find(_ => _.params?.seeHisOwn)
    return {
      sum,
      accessibleOffices: accessibleOffices.length === 0 ? undefined : accessibleOffices,
      accessiblePrograms: accessiblePrograms.length === 0 ? undefined : accessiblePrograms,
      // seeHisOwn: seeHisOwn,
    }
  }, [session, accesses])

  const translateInternal = useMemo(() => getKoboTranslations({
    schema: schemas.internal,
    langIndex,
    questionIndex: schemaInternal.questionIndex,
  }), [schemas.internal, langIndex])

  const data = useFetcher(async (filters?: CfmDataFilters) => {
    const [external, internal] = await Promise.all([
      api.kobo.answer.searchMealCfmExternal(filters).then(_ => _.data),
      api.kobo.answer.searchMealCfmInternal(filters).then(_ => _.data),
    ])
    return {[CfmDataSource.External]: external, [CfmDataSource.Internal]: internal}
  })

  const mappedData = useMemo(() => {
    const res: CfmData[] = []
    data.entity?.[CfmDataSource.External].forEach(_ => {
      const category = _.tags?.feedbackTypeOverride
      res.push({
        category,
        priority: KoboMealCfmTag.feedbackType2priority(category),
        feedback: _.thanks_feedback ?? _.complaint,
        formId: kobo.drcUa.form.cfmExternal,
        external_feedback_type: _.feedback_type,
        external_consent: _.consent,
        external_prot_support: _.prot_support,
        form: CfmDataSource.External,
        ..._,
      })
    })
    data?.entity?.[CfmDataSource.Internal].forEach(_ => {
      const category = _.tags?.feedbackTypeOverride ?? _.feedback_type
      res.push({
        priority: KoboMealCfmTag.feedbackType2priority(category),
        category,
        formId: kobo.drcUa.form.cfmInternal,
        form: CfmDataSource.Internal,
        internal_existing_beneficiary: _.existing_beneficiary,
        internal_project_code: _.project_code,
        ..._,
      })
    })
    console.log('authorizations.sum', authorizations)
    return res
      .filter(_ => {
        if (session.email === _.tags?.focalPointEmail)
          return true
        if (!authorizations.sum.read)
          return false
        if (authorizations.accessiblePrograms && !authorizations.accessiblePrograms.includes(_.tags?.program!))
          return false
        if (authorizations.accessibleOffices && !authorizations.accessibleOffices.includes(_.tags?.office!))
          return false
        // if (authorizations.accessibleEmails && !authorizations.accessibleEmails.includes(_.tags?.focalPointEmail!))
        //   return false
        return true
      })
      .sort((b, a) => (a.date ?? a.submissionTime).getTime() - (b.date ?? b.submissionTime).getTime())
  }, [data])

  const updateTag = useAsync((params: {formId: KoboId, answerId: KoboAnswerId, key: string, value: any}) => api.kobo.answer.updateTag({
    formId: params.formId,
    answerId: params.answerId,
    tags: {[params.key]: params.value}
  }).then(newTags => {
    const formName = formIdMapping[params.formId]
    data.setEntity(prev => prev ? ({
      ...prev,
      [formName]: prev[formName].map(_ => {
        if (_.id === params.answerId) {
          _.tags = newTags
        }
        return _
      })
    }) : undefined)
  }), {
    requestKey: ([_]) => cfmMakeUpdateRequestKey(_.formId, _.answerId, _.key)
  })

  useEffect(() => {
    data.fetch()
    users.fetch()
  }, [])

  return (
    <CfmContext.Provider value={{
      authorizations,
      schemaInternal,
      schemaExternal,
      translateExternal,
      translateInternal,
      updateTag,
      data,
      users,
      mappedData,
    }}>
      {children}
    </CfmContext.Provider>
  )
}
