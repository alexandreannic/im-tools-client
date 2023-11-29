import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {getKoboTranslations, UseKoboSchema, useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {UseAsync, useAsync} from '@/alexlib-labo/useAsync'
import {KoboAnswer, KoboAnswerId, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib'
import {kobo} from '@/koboDrcUaFormId'
import {CfmDataFilters} from '@/features/Cfm/Data/CfmTable'
import {CfmDataPriority, CfmDataProgram, CfmDataSource, KoboMealCfmHelper, KoboMealCfmTag} from '@/core/sdk/server/kobo/custom/KoboMealCfm'
import {Meal_CfmExternal} from '@/core/koboModel/Meal_CfmExternal/Meal_CfmExternal'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {DrcOffice} from '@/core/drcUa'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useAaToast} from '@/core/useToast'
import {KeyOf} from '@/utils/utils'
import {Seq, seq} from '@alexandreannic/ts-utils'
import {Meal_CfmInternal} from '@/core/koboModel/Meal_CfmInternal/Meal_CfmInternal'
import {OblastIndex, OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'

const formIdMapping: Record<string, CfmDataSource> = {
  [kobo.drcUa.form.meal_cfmExternal]: CfmDataSource.External,
  [kobo.drcUa.form.meal_cfmInternal]: CfmDataSource.Internal,
}

export type CfmData = {
  priority?: CfmDataPriority
  formId: KoboId
  tags?: KoboMealCfmTag
  form: CfmDataSource
  comments?: string
  feedback?: string
  additionalInformation?: string
  project?: string
  oblast: OblastName
  oblastIso: OblastISO
  category?: Meal_CfmInternal['feedback_type']
  external_prot_support?: Meal_CfmExternal['prot_support']
  internal_existing_beneficiary?: Meal_CfmInternal['existing_beneficiary']
  internal_project_code?: Meal_CfmInternal['project_code']
  // external_thanks_feedback?: MealCfmExternal['thanks_feedback']
  // external_complaint?: MealCfmExternal['complaint']
  external_consent?: Meal_CfmExternal['consent']
  external_feedback_type?: Meal_CfmExternal['feedback_type']
  // internal_feedback?: Meal_CfmInternal['feedback']
  // internal?: Pick<Meal_CfmInternal, 'feedback' | 'existing_beneficiary' | 'project_code'>
  // external?: Pick<MealCfmExternal, 'prot_support' | 'thanks_feedback' | 'complaint' | 'consent' | 'feedback_type'>
} & Pick<KoboAnswer<Meal_CfmInternal>,
  // 'ben_det_oblast' |
  'ben_det_raion' |
  'ben_det_hromada'
> & Pick<KoboAnswer<Meal_CfmInternal>,
  'id' |
  'start' |
  'date' |
  'end' |
  'submissionTime' |
  'existing_beneficiary' |
  'name' |
  'gender' |
  'phone' |
  'email'
>

export interface CfmContext {
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
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
  updateTag: UseAsync<(_: {
    formId: KoboId,
    answerId: KoboAnswerId,
    key: keyof KoboMealCfmTag,
    value: any
  }) => Promise<Record<string, any>>>
  asyncRemove: UseAsync<(_: {
    formId: KoboId,
    answerId: KoboAnswerId
  }) => Promise<void>>
  users: UseFetcher<ApiSdk['user']['search']>
  data: UseFetcher<() => Promise<{
    [CfmDataSource.Internal]: KoboAnswer<Meal_CfmInternal, KoboMealCfmTag>[]
    [CfmDataSource.External]: KoboAnswer<Meal_CfmExternal, KoboMealCfmTag>[]
  }>>
  mappedData: Seq<CfmData>
}

const CfmContext = React.createContext({} as CfmContext)

export const useCfmContext = () => useContext<CfmContext>(CfmContext)

export const cfmMakeUpdateRequestKey = (form: KoboId, answerId: KoboAnswerId, key: KeyOf<KoboMealCfmTag>) => form + answerId + key

export const cfmMakeEditRequestKey = (form: KoboId, answerId: KoboAnswerId) => form + answerId

export const CfmProvider = ({
  children,
  schemas,
}: {
  schemas: {
    internal: KoboApiForm,
    external: KoboApiForm,
  }
  children: ReactNode
}) => {
  const {session, accesses} = useSession()
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()
  const [langIndex, setLangIndex] = useState(0)
  const schemaInternal = useKoboSchema({schema: schemas.internal})
  const schemaExternal = useKoboSchema({schema: schemas.external})
  const translateExternal = useMemo(() => getKoboTranslations({
    schema: schemas.external,
    langIndex,
    questionIndex: schemaExternal.questionIndex,
  }), [schemas.external, langIndex])

  const users = useFetcher(() => api.user.search())

  const authorizations: CfmContext['authorizations'] = useMemo(() => {
    const cfmAccesses = seq(accesses).filter(Access.filterByFeature(AppFeatureId.cfm))
    const sum = Access.toSum(cfmAccesses, session.admin)
    const accessibleOffices = cfmAccesses.map(_ => _.params).flatMap(_ => _?.office).compact().get()
    const accessiblePrograms = cfmAccesses.map(_ => _.params).flatMap(_ => _?.program).compact().get()
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
      api.kobo.typedAnswers.searchMealCfmExternal(filters).then(_ => _.data),
      api.kobo.typedAnswers.searchMealCfmInternal(filters).then(_ => _.data),
    ])
    return {[CfmDataSource.External]: external, [CfmDataSource.Internal]: internal}
  })

  const mappedData = useMemo(() => {
    const res: CfmData[] = []
    data.entity?.[CfmDataSource.External].forEach(_ => {
      const category = _.tags?.feedbackTypeOverride
      res.push({
        category,
        priority: KoboMealCfmHelper.feedbackType2priority(category),
        formId: kobo.drcUa.form.meal_cfmExternal,
        external_feedback_type: _.feedback_type,
        external_consent: _.consent,
        external_prot_support: _.prot_support,
        form: CfmDataSource.External,
        oblast: OblastIndex.byKoboName(_.ben_det_oblast!)!.name,
        oblastIso: OblastIndex.byKoboName(_.ben_det_oblast!)!.iso,
        feedback: _.complaint ?? _.thanks_feedback ?? _.request,
        ..._,
      })
    })
    data?.entity?.[CfmDataSource.Internal].forEach(_ => {
      const category = _.tags?.feedbackTypeOverride ?? _.feedback_type
      res.push({
        project: !_.project_code || _.project_code === 'Other' ? _.project_code_specify : _.project_code,
        priority: KoboMealCfmHelper.feedbackType2priority(category),
        category,
        formId: kobo.drcUa.form.meal_cfmInternal,
        form: CfmDataSource.Internal,
        internal_existing_beneficiary: _.existing_beneficiary,
        internal_project_code: _.project_code,
        oblast: OblastIndex.byKoboName(_.ben_det_oblast!).name,
        oblastIso: OblastIndex.byKoboName(_.ben_det_oblast!).iso,
        ..._,
      })
    })
    return seq(res)
      .filter(_ => {
        if (_.tags?.deletedBy) return false
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

  const updateTag = useAsync((params: {
    formId: KoboId,
    answerId: KoboAnswerId,
    key: keyof KoboMealCfmTag,
    value: any
  }) => api.kobo.answer.updateTag({
    formId: params.formId,
    answerIds: [params.answerId],
    tags: {[params.key]: params.value}
  }).then(() => {
    const formName = formIdMapping[params.formId]
    data.setEntity(prev => prev ? ({
      ...prev,
      [formName]: prev[formName].map(_ => {
        if (_.id === params.answerId) {
          _.tags = {..._.tags, [params.key]: params.value}
        }
        return _
      })
    }) : undefined)
  }), {
    requestKey: ([_]) => cfmMakeUpdateRequestKey(_.formId, _.answerId, _.key)
  })

  const asyncRemove = useAsync(async ({formId, answerId}: {
    formId: KoboId,
    answerId: KoboAnswerId
  }) => {
    // await Promise.all([
    // await updateTag.call({
    //   formId,
    //   answerId,
    //   key: 'deletedAt',
    //   value: new Date(),
    // })
    await updateTag.call({
      formId,
      answerId,
      key: 'deletedBy',
      value: session.email ?? 'unknown',
    })
    // ])
  }, {
    requestKey: ([_]) => cfmMakeEditRequestKey(_.formId, _.answerId)
  })

  useEffect(() => {
    data.fetch()
    users.fetch()
  }, [])

  return (
    <CfmContext.Provider value={{
      authorizations,
      schemaInternal,
      asyncRemove,
      schemaExternal,
      translateExternal,
      translateInternal,
      updateTag,
      data,
      users,
      mappedData,
      langIndex,
      setLangIndex,
    }}>
      {children}
    </CfmContext.Provider>
  )
}
